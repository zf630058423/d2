<template>
  <div class="f2bpm-page-layout f2bpm-page-right">
    <el-form ref="formRef" :rules="formRules" size="small" :model="data" class="f2bpm-editform" label-width="140px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="名称" prop="Name">
            <el-input v-model="data.Name" placeholder="名称" @blur.native.capture="toPinYin('Name', 'Code')" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="别名" prop="Code">
            <el-input v-model="data.Code" placeholder="别名" :disabled="isCode" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="数据来源" prop="SourceType">
            <el-radio-group v-model="data.SourceType" @change="sourceTypeChange">
              <el-radio label="db">DB数据源</el-radio>
              <!-- <el-radio label="rest">REST接口</el-radio> -->
            </el-radio-group>

          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否分页">
            <el-switch v-model="data.NeedPage" active-color="#87DC48" :active-value="1" :inactive-value="0"
              inactive-color="#DEDEDE" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row v-if="data.SourceType == 'db'">
        <el-col :span="12">
          <el-form-item label="表或视图" prop="ObjName">
            <el-input v-model="data.ObjName" placeholder="请选择表或视图">
              <template slot="append"><i v-if="!isObjName" class="fa fa-search cur" @click="selectDbTable">选择</i>
              </template>
              (数据库表名、视图名、Map的Key)
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item v-if="data.SourceType == 'db'" label="数据源">
            <f2bpmui-select sqlkey="CB_DataBaseSourceList" field="DBSource" :fieldvalue="data.DBSource"
              @updatevalue="updateFieldValue" />
            (为空代表本地数据库)
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="data.SourceType == 'rest'">
        <el-col :span="12">
          <el-form-item label="REST请求地址">
            <el-input v-model="data.RestUrl" style="width:90%;" placeholder="" />
            <div>
              <el-tooltip class="item" effect="dark" placement="right-start">
                <div slot="content">
                  1、可直接输入以“参数名:参数值”字符串的形式，如“token:abc”<br>2、可在本输入框填写Java插件类的地址，通过Java类构建请求头参数,示例：com.f2bpm.myrest</div>
                <i class="fa fa-question-circle">说明</i>
              </el-tooltip>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="接口头部参数">
            <el-input v-model="data.AuthorParams" />
            <div>
              <el-tooltip class="item" effect="dark" placement="right-start">
                <div slot="content">
                  1、可直接输入以“参数名:参数值”字符串的形式，如“token:abc”<br>2、可在本输入框填写Java插件类的地址，通过Java类构建请求头参数,示例：com.f2bpm.myrest</div>
                <i class="fa fa-question-circle">说明</i>
              </el-tooltip>
            </div>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="排序字段" prop="SortName">
            <el-input v-model="data.SortName" placeholder="请选择排序字段">
              <template slot="append"><i class="fa fa-search cur" @click="selectDbField">选择</i>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="排序方向" prop="SortOrder">
            <el-select v-model="data.SortOrder">
              <el-option label="升序" value="asc" />
              <el-option label="降序" value="desc" />
            </el-select>
          </el-form-item>

        </el-col>
      </el-row>

      <el-row>
        <el-col :span="4">
          <el-form-item label="宽度" prop="Width">
            <el-input-number v-model="data.Width" label="宽度" />
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="高度" prop="Height">
            <el-input-number v-model="data.Height" label="高度" />
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="是否启用权限" prop="IsEnableAuthor">
            <el-switch v-model="data.IsEnableAuthor" :active-value="1" :inactive-value="0" active-color="#87DC48"
              inactive-color="#DEDEDE">
            </el-switch>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="是否多选">
            <el-switch v-model="data.RadioMultiple" active-color="#87DC48" :active-value="1" :inactive-value="0"
              inactive-color="#DEDEDE" />
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="系统预设">
            <el-switch v-model="data.IsSystem" active-color="#87DC48" :active-value="1" :inactive-value="0"
              inactive-color="#DEDEDE" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item v-if="data.SourceType == 'db'" label="过滤条件" prop="DivideSql">
        <el-input v-model="data.DivideSql"
          placeholder="where的过滤条件，sql标准语法，可使用系统变量作为Sql的动态参数，示例：name='zs'  s_and creatorId=#CurrentUserId# " />
        <div>
          <span class="fa fa-search font12 " @click="selectSystemVars('DivideSql')">选择系统变量</span>
          <br>
          <span class="fa font10 ml10" style="line-height:18px"> Sql关键字必须使用转换代替：or：s_or;
            and:s_and;select:s_elect；<br>使用##括起来的变量代码字符串，会自动加上单引号，比如#XingMing#翻译之后可能是'张三'。<br>使用$$符合括起来表示无符号，使用原值自身，$XingMing$翻译之后是
            张三,<br>使用 @参数 的形式会自动获取Url参数作为变量值，示例 @XingMing 需要Url中带有XingMing的参数，替换结果为无符号的值</span>
        </div>
      </el-form-item>
      <!-- <el-form-item label="Url参数"   v-if="data.SourceType=='db'">
        <el-input v-model="data.UrlParamsOption"></el-input>
        <a @click="dbfieldUrlParams" class="btn btn-sm btn-white btn-info btn-bold"> <i class="ace-icon fa fa-pencil  bigger-120  "></i>配置URL参数</a>
      </el-form-item> -->
      <el-form-item v-if="data.SourceType == 'db'" label="扩展后台过滤条件" prop="DefaultWhereAssembly">
        <el-input v-model="data.DefaultWhereAssembly"
          placeholder="由Java类返回过滤条件的sql填写类包路径全名称;示例：DemoDefaultWhereAssembly.java" />
      </el-form-item>
      <el-form-item v-if="data.SourceType == 'db'" label="是否加入过滤条件" prop="DefaultWhereIsJoinAssembly">
        <el-input v-model="data.DefaultWhereIsJoinAssembly"
          placeholder="由Java类判断是否加入过滤条件填类包路径全名称。示例DemoDefaultWhereIsJoinAssembly.java" />
      </el-form-item>
      <el-form-item label="备注">
        <el-input v-model="data.Remark" type="textarea" :rows="4" placeholder="" />
      </el-form-item>
      <div class="dialogfooter2">
        <el-button v-if="formAction != 'View'" size="small" type="primary" @click="submitForm()"><i
            class="fa fa-save" />保存
        </el-button>
        <el-button id="btn_cancel" size="small" @click="closeEdit"><i class="fa fa-minus-circle" />取消
        </el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isMultiTenant: false,
      keyId: '',
      formAction: null,
      isCode: false,
      isObjName: false,
      treeData: [],
      data: {
        Name: '',
        Code: '',
        ObjName: '',
        SortName: '',
        SortOrder: 'desc',
        IsEnableAuthor: 0,
        Width: 800,
        Height: 500,
        RadioMultiple: 0,
        IsSystem: 0,
        DivideSql: '',
        TenantId: '',
        CreatedTime: '',
        Style: '',
        NeedPage: 1,
        PageSize: 15,
        SourceType: 'db',
        AuthorParams: '',
        RestUrl: '',
        DBSource: '',
        DefaultWhereAssembly: '',
        DefaultWhereIsJoinAssembly: '',
        UrlParamsOption: ''

      },
      // stand:表单校验规则
      formRules: {
        Name: [
          { required: true, validator: FUI.Validator.required }
        ],
        Code: [
          { required: true, validator: FUI.Validator.required }
        ],
        ObjName: [
          { required: true, validator: FUI.Validator.required }
        ],
        SortName: [
          { required: true, validator: FUI.Validator.required }
        ],
        SortOrder: [
          { required: true, validator: FUI.Validator.required }
        ],
        TableName: [
          { validator: FUI.GetValidatorRule('englisthOrChar') }
        ]
      }
    };
  },
  created: function () {
    var that = this;
    that.formAction = formAction;
    that.keyId = keyId;
    const currUser = FUI.Sys.getAuthor();
    that.isMultiTenant = currUser.isMultiTenant;
    var tenantId = Object.toQueryString('tenantId') || currUser.tenantId;
    if (formAction == FUI.FormAction.Add) {
      that.data.CreatedTime = Object.toGetCurrentDateTimeString();
      that.data.TenantId = tenantId;
    } else {
      that.isCode = true;
      that.isObjName = true;
    }
    that.loadData();
  },
  methods: {
    closeEdit() {
      FUI.Window.closeEdit();
    },
    loadData() {
      var that = this;
      if (formAction == FUI.FormAction.Add) {
      } else if (formAction != FUI.FormAction.Add) {
        FUI.Form.bindDataToForm(that, FUI.Handlers.FuiFrameworkHandler, FUI.Method.AutoGetViewModelMethod, keyId, null, mainTable);
      }
    },
    submitForm() {
      var that = this;
      var success = that.validateForm('formRef');
      if (!success) return;
      if (that.isMultiTenant && formAction == FUI.FormAction.Add) {
        // 多租户时需要添加租户ID前缀
        that.data.Code = that.data.TenantId + '_' + that.data.Code + '_' + Object.toGetRandomNum(1, 9999);
      }
      FUI.Form.submitForm(that, that.data, FUI.Handlers.FuiFrameworkHandler, FUI.Method.AutoSaveMethod, formAction, keyId, parentGridId, mainTable);
    },
    validateForm(refFormName) {
      // stand:表单校验
      var success = false;
      this.$refs[refFormName].validate(valid => {
        success = valid;
      });
      return success;
    },
    selectDbField() {
      var that = this;
      if (that.data.DBSource != '') {
        FUI.Window.showMsg('非本地数据库，请手动填写');
        return false;
      }
      var dataMainTableName = that.data.ObjName;
      if (dataMainTableName == '') {
        FUI.Window.showMsg(that, '请选择数据源');
        return false;
      }
      WF.SelectorDialog.dbfieldSelect(that, '', dataMainTableName, 'SortName');
    },
    selectDbTable(value) {
      var that = this;
      if (that.data.DBSource != '') {
        FUI.Window.showMsg('非本地数据库，请手动填写');
        return false;
      }
      // 选择表或视图
      WF.SelectorDialog.selectDbTable(this, 'ObjName', null, 'allns', true);
    },
    showSystemCurrentVars() {
      var that = this;
      WF.SelectorDialog.showSystemCurrentVars('all');
    },
    selectSystemVars(inputId) {
      WF.SelectorDialog.selectSystemVars(this, inputId, null, true);
    },
    dbfieldUrlParams() {
      var that = this;
      var dataMainTableName = that.data.ObjName;
      WF.SelectorDialog.dbfieldParamsSelect(that, 'UrlParamsOption', '', dataMainTableName);
    },
    sourceTypeChange(v) {

    }
    , updateFieldValue(fieldName, newVal) {
      var that = this;
      that.data[fieldName] = newVal;
    },
    toPinYin(sourceField, targetField) {
      if (!this.data[targetField]) {
        const source = this.data[sourceField];
        this.data[targetField] = Object.toPinYin(source);
      }
    }
  }
}
</script>