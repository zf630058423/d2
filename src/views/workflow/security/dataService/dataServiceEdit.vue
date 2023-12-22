<template>
  <div class="f2bpm-page-dialog-layout">
    <el-form ref="formRef" :rules="formRules" :model="data" size="small" class="f2bpm-editform" label-width="120px">
      <el-row>
        <el-col :span="8">
          <el-form-item label="名称" prop="Name">
            <el-input v-model="data.Name" placeholder="" @blur.native.capture="toPinYin('Name','Code')" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="编码" prop="Code">
            <el-input v-model="data.Code" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="分类" prop="CategoryCode">
            <treeselect v-model="data.CategoryCode" :default-expand-level="4" :multiple="false" placeholder="请选择分类" :options="treeData" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="数据来源" prop="SourceType">
            <el-radio-group v-model="data.SourceType" @change="sourceTypeChange">
              <el-radio label="db">DB数据源</el-radio>
              <el-radio label="rest">REST接口</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item v-if="data.SourceType=='db'" label="数据源">
            <f2bpmui-select sqlkey="CB_DataBaseSourceList" field="DBSource" :fieldvalue="data.DBSource" @updatevalue="updateFieldValue" />
          </el-form-item>
          <el-form-item v-if="data.SourceType=='rest'" label="请求类型">
            <el-select v-model="data.RequestType" size="mini">
              <el-option label="post" value="post" />
              <el-option label="get" value="get" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="应用方式" prop="ImplType">
            <el-select v-model="data.ImplType" placeholder="请选择" @change="implTypeOnChange">
              <el-option v-for="item in implTypeOptions" :key="item.value" :label="item.text" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="是否启用">
            <el-radio-group v-model="data.IsEnabled">
              <el-radio :label="1">启用</el-radio>
              <el-radio :label="0">停用</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="data.SourceType=='db'">
        <el-col :span="12">
          <el-form-item label="Parent" prop="ParentValue">
            <el-input v-model="data.ParentValue" placeholder="数据库表或视图中Parent的字段名" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="特殊标识" prop="Flag">
            <el-input v-model="data.Flag" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item :label="value_title" prop="Value">
        <el-input v-model="data.Value" type="textarea" :rows="2" />
        <div>
          <span class="fa fa-search font12 " @click="selectSystemVars('Value')">选择系统变量</span>
        </div>
      </el-form-item>
      <el-form-item v-if="author_div" label="接口头部参数" prop="AuthorParams">
        <el-input v-model="data.AuthorParams" placeholder="1、可直接输入以“参数名:参数值”字符串的形式，如“token:abc” 2、可在本输入框填写Java插件类的地址，通过Java类构建请求头参数,接口类必须实现接口IMapAssembly,示例：com.f2bpm.myrest" />
      </el-form-item>

      <el-form-item label="说明">
        <div  v-if="data.SourceType=='db'">
          <em>注意:</em>sql查询的字段名中不允许出现“.”号，需要以"-"代替;示例：select a as "My.A" 需要写成：select a as "My-A" 。返回查询的Json结果时会自动替换回“.”号。需要将字符串转为in语句后面跟的括号内容，如  where id in ($$)
        </div>
        <div v-if="data.SourceType=='rest'" class="note">
          <br> <em>注意:</em>#xxx#点位符参数值在应用的时候所配置传递的参数, 如：http://www.a.com/getOrderNo/?a=1&b=#bValue#;b=#bValue#这个也是你想要传的参数及参数值，只是这里的参数值是使用##包起来的变量，当使用者使用Ajax调用此数据服务请求时可传入变量参数，后台发生远程Rest真正请求时会将此变量替换成使用者传进来的真实值。远程地址：使用http://开头作为标识，示例请求远程地址（具体需要调整为远程系统能接受到的请求方式，注意要放通请求权限）。
        </div>
        <div v-if="data.ImplType=='Autocompleter'" class="note">自动完成Sql脚本说明：脚本中一定要有别名的value和text字段（使用 a as AA别名语法），text为下拉框的显示字段，value为下拉框的值字段。 如同示例：select UserName value,RealName text,UserId,Email,Mobile from sys_Users where UserName like '%$searchKey$%' or RealName like '%$searchKey$%' </div>
        <div v-if="data.ImplType=='DropSelect'" class="note">下拉选择Sql脚本说明：脚本中一定要有别名的value和text字段（使用 a as AA别名语法），text为下拉框的显示字段，value为下拉框的值字段。如同示例：select UserName value,RealName text,UserId,Email,Mobile from sys_Users where groupKey= #groupKey# 其中#groupKey#占位符参数值在应用的时候所配置传递的参数 </div>
        <div v-if="data.ImplType=='Cascselect'" class="note">级联选择Sql数据源配置说明：脚本中一定要有别名的value和text字段（使用 a as AA别名语法），text为下拉框的显示字段，value为下拉框的值字段，必须填写“上级值字段”的字段名，联运时将上级值通过此字段来查询子级数据，顶级的父级值固定为"root"。 如同示例：select ConfigName "text",ConfigValue "value" from f2bpm_sys_DataDict where ConfigType='省市县村-简单测试' and Flag='province'</div>
        <div v-if="data.ImplType=='Tree'" class="note">下拉树:数据列表中必须有id,parentId,text字段，text为下拉框的显示字段（使用 a as AA别名语法），id为下拉框的值字段，DB示例：select ConfigName "text",ConfigValue "id",ParentConfigKey "parentId" from f2bpm_sys_DataDict where ConfigType='省市县村-简单测试'；如果使用REST接口，那么返回的Data数据列表扁平化数据中必须有这id,parentId,text三个字段。或者data数据直接返回的就是标准的树形结构如：[{id:1,label:'级别一',children:[{id:2,label:'级别2',children:[]}]}]<br> </div>

      </el-form-item>

      </el-form-item>
      <el-form-item label="备注" prop="Remark">
        <el-input v-model="data.Remark" type="textarea" :rows="2" placeholder="备注" />
      </el-form-item>
      <el-form-item v-if="false" label="租户ID" prop="TenantId">
        <el-input v-model="data.TenantId" />
      </el-form-item>

      <div v-if="data.SourceType=='rest'" style="margin-bottom: 10px;">
        <a role="button" href="javascript:void(0)" title="点击重置响应参数" class="btn btn-primary btn-sm mr2" @click="resetInitailResponseParms"><i class="fa fa-cog" /><span>响应参数</span></a>
        <div id="parmList">
          <table id="parmTable" class="common-grid">
            <tr>
              <th>标题</th>
              <th>变量名</th>
              <th>返回名 </th>
            </tr>
            <tr v-for="item in responseParms">
              <td>
                <span v-html="item.title" /><span v-if="item.property!='code'"><em>*</em></span>
              </td>
              <td>
                {{ item.property }}
              </td>
              <td>
                <el-input v-model="item.field" size="mini" :placeholder="item.title+'，不填写表示与变量名相同'" />
              </td>
            </tr>
          </table>
          <div style="line-height: 25px;">
            <em>说明：</em>例如返回的数据为： {success: true,code:200, msg: "请求成功", data: [{name: "出差",num: 50},{name: "采购",num: 28}] }
          </div>
        </div>
      </div>
      <div id="property_parm_div">
        <a role="button" href="javascript:void(0)" class="btn btn-primary btn-sm mr2" @click="addParm"><i class="fa fa-plus" /><span>列表属性</span></a>
        <div id="parmList">
          <table id="parmTable" class="common-grid">
            <tr>
              <th>标题名称</th>
              <th>属性名称</th>
              <th style="width: 90px;">操作</th>
            </tr>
            <tr v-for="(item,index) in paramsData">
              <td>
                <el-input v-model="item.title" size="mini" placeholder="标题" />
              </td>
              <td>
                <el-input v-model="item.property" size="mini" placeholder="属性" />
              </td>
              <td>
                <span class="cur" @click="deleteProperyItem(index)">删除</span>
              </td>
            </tr>
          </table>
        </div>
        <div style="line-height: 25px;">
          <em>注：</em><br>
          "列表属性"：是指返回JSON结果中列表数据的字段名。<br>
          “标题名称”：为中文名称，即属性字段的中文名,用于说明属性字段的标题。<br>
          “属性名称”：为返回JSON数据中的属性字段名，用于告诉目标从返回JSON属性中取值。
        </div>

      </div>
      <div class="dialogfooter2">
        <el-button size="small" type="primary" @click="submitForm()"><i class="fa fa-save" />保存
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
        formAction: null,
        implTypeOptions: [
          { text: '普通查询', value: 'GeneralQuery' },
          { text: '自动完成', value: 'Autocompleter' },
          { text: '级联选择', value: 'Cascselect' },
          { text: '选项查询', value: 'DropSelect' },
          { text: '树形结构', value: 'Tree' },
          { text: '流程引擎', value: 'Workflow' }

        ],
        value_title: 'Sql',
        author_div: true,
        sql_note: true,
        Rest_note: true,
        Autocompleter_note: true,
        DropSelect_note: true,
        Cascselect_note: true,
        add_btn_title: '',
        paramsData: [],
        responseParms: [],
        treeData: [],
        data: {
          CategoryCode: null,
          ParentId: '',
          Name: '',
          Code: '',
          ImplType: 'DropSelect',
          ParentValue: '',
          TenantId: '',
          CreatedTime: '',
          LastModTime: '',
          LastModifier: '',
          Creator: '',
          ConfigProperty: '',
          SourceType: 'db',
          DBSource: '',
          ResponseParms: '',
          RequestType: 'post',
          IsEnabled: 1
        },
        // stand:表单校验规则
        formRules: {
          CategoryCode: [
            { required: true, message: '必填项不能为空' }
          ],
          Name: [
            { required: true, message: '必填项不能为空' }
          ],
          Code: [
            { required: true, message: '必填项不能为空' },
            { validator: FUI.GetValidatorRule('englishchar') }
          ],
          SourceType: [
            { required: true, message: '必填项不能为空' }
          ],
          ImplType: [
            { required: true, message: '必填项不能为空' }
          ]
        }
      };
    },
    mounted: function () {
      var that = this;
      that.loadTreeSelect();
      that.loadData();

      if (formAction == FUI.FormAction.Edit) {
        that.data.LastModTime = Object.toGetCurrentDateTimeString();
      }
    },
    created: function () {
      var that = this;
      that.formAction = formAction;
      that.dataTypeOptions = FUI.Data.baseDataTypeDic;
      if (formAction == FUI.FormAction.Add) {
        var categoryCode = Object.toQueryString('categoryCode') || 'Root';
        var tenantId = Object.toQueryString('tenantId');
        const currUser = FUI.Sys.getAuthor();
        that.data.CreatorId = currUser.userId;
        that.data.CreatedTime = Object.toGetCurrentDateTimeString();
        that.data.LastModTime = Object.toGetCurrentDateTimeString();
        that.data.TenantId = tenantId || currUser.tenantId;
        if (categoryCode) {
          that.data.CategoryCode = categoryCode;
        }
        that.resetInitailResponseParms();
      } else {
        that.data.LastModTime = Object.toGetCurrentDateTimeString();
      }
    },
    methods: {
      // ===stand:标准化方法============
      closeEdit() {
        // stand:关闭编辑窗口
        FUI.Window.closeEdit();
      },
      // ===stand:标准化方法结束============
      loadTreeSelect() {
        var that = this;
        var treeUrl = FUI.Handlers.CategoryHandler + '?groupKey=DataServiceGroup&needRoot=true';
        Object.toAjaxJson(treeUrl, null, null, true, null, function (res) {
          if (res.success) {
            that.treeData = res.data;
          } else {
            that.$message.error(
              res.msg
            );
          }
        });
      },
      loadData() {
        var that = this;
        if (formAction != FUI.FormAction.Add) {
          FUI.Form.bindDataToForm(that, FUI.Handlers.FuiFrameworkHandler, FUI.Method.AutoGetViewModelMethod, keyId, null, mainTable);
          that.paramsData = eval('(' + that.data.ConfigProperty.replace(/\\/g, '') + ')');
          that.responseParms = eval('(' + that.data.ResponseParms.replace(/\\/g, '') + ')');
          that.sourceTypeChange(that.data.SourceType);
        }
      },
      submitForm() {
        var that = this;
        var success = that.validateForm('formRef');
        if (!success) return;
        that.data.ConfigProperty = JSON.stringify(that.paramsData);
        that.data.ResponseParms = JSON.stringify(that.responseParms);
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
      implTypeOnChange(impleType) {
        var that = this;
      },
      selectSystemVars(inputId) {
        WF.SelectorDialog.selectSystemVars(this, inputId, null, true);
      },
      sourceTypeChange(v) {
        var that = this;
        if (v == 'rest') {
          that.author_div = true;
          that.value_title = 'REST请求地址';
        } else {
          that.value_title = 'SQL';
        }
      },
      addParm() {
        var that = this;
        that.paramsData.push({ title: '', property: '' });
      },
      deleteProperyItem(index) {
        var that = this;
        var temp = [];
        $.each(that.paramsData, function (i, item) {
          if (i != index) {
            temp.push(item);
          }
        });
        that.paramsData = temp;
      },
      resetInitailResponseParms() {
        var that = this;
        that.responseParms = [];
        that.responseParms.push({ title: '布尔状态', property: 'success', field: '' });
        that.responseParms.push({ title: '返回消息', property: 'msg', field: '' });
        that.responseParms.push({ title: '返回码', property: 'code', field: '' });
        that.responseParms.push({ title: '数据列表', property: 'data', field: '' });
      },
      updateFieldValue(fieldName, newVal) {
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