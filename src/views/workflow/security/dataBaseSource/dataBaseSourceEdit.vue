<template>
  <div class="f2bpm-page-dialog-layout">
    <div>
      <el-form ref="formRef" :rules="formRules" size="small" :model="data" class="f2bpm-editform" label-width="120px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="标题" prop="title">
              <el-input v-model="data.title" placeholder="" @blur.native.capture="toPinYin('title','dbCode')" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="编码" prop="dbCode">
              <el-input v-model="data.dbCode" placeholder="" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="数据库类型" prop="dbType">
              <el-select v-model="data.dbType" @change="dbTypeChange">
                <el-option label="请选择" value="" />
                <el-option label="mysql" value="mysql" />
                <el-option label="oracle" value="oracle" />
                <el-option label="postgresql" value="postgresql" />
                <el-option label="sqlserver" value="mssql" />
                <el-option label="达梦" value="dm" />
                <el-option label="人大金仓" value="kingbase" />
                <el-option label="OceanBase" value="oceanbase" />
                <el-option label="mysql低版本驱动" value="mysql_low" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否启用" prop="isEnabled">
              <el-switch v-model="data.isEnabled" active-color="#13ce66" inactive-color="#DEDEDE" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="数据库名" prop="dbName">
              <el-input v-model="data.dbName" placeholder="" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="data.dbType=='dm'||data.dbType=='kingbase'" label="模式名" prop="dbMode">
              <el-input v-model="data.dbMode" placeholder="达梦/人大金仓的模式名" />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- <el-form-item label="国产数据库类型" prop="dbChinatype">
          <el-select v-model="data.dbChinatype">
            <el-option label="无" value="none"></el-option>
            <el-option label="达梦" value="dm"></el-option>
            <el-option label="人大金仓" value="kingbase"></el-option>
          </el-select>
        </el-form-item> -->

        <el-row>
          <el-col :span="12">
            <el-form-item label="账号" prop="userName">
              <el-input v-model="data.userName" placeholder="" />
              <span class="font10" v-if="data.dbType=='oceanbase'">OceanBase账号格式：用户名@租户名</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="密码" prop="pwd">
              <el-input v-model="data.pwd" placeholder="" autocomplete="off" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="IP地址" prop="ip">
              <el-input v-model="data.ip" placeholder="" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="端口号" prop="port">
              <el-input v-model="data.port" placeholder="" style="width:80px;" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="测试SQL" prop="validationQuery">
          <el-input v-model="data.validationQuery" :rows="4" placeholder="" />
          <span class="font6">查询单行单列的结果，建议使用：select count(0) from table</span>
        </el-form-item>
        <el-form-item label="备注" prop="remarks">
          <el-input v-model="data.remarks" type="textarea" :rows="1" placeholder="" />
          <span class="font6"> (DB数据源一般用于读取数据，更新操作存在与本地数据库事务不一致问题需自行处理。)</span> 
        </el-form-item>

        <el-form-item label="" prop=" ">
          <span class="red fa fa-link cur" @click="testConnection">测试链接</span>
        </el-form-item>
        <div class="dialogfooter">
          <el-button v-if="formAction!='View'" size="small" type="primary" @click="submitForm()"><i class="fa fa-save" />保存
          </el-button>
          <el-button id="btn_cancel" size="small" @click="closeEdit"><i class="fa fa-minus-circle" />取消
          </el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>

  export default {
    data() {
      return {
        formAction: null,
        treeData: [],
        data: {
          title: '',
          dbCode: '',
          dbName: '',
          dbType: '',
          dbChinatype: '',
          dbMode: '',
          userName: '',
          pwd: '',
          ip: '',
          port: '',
          isEnabled: true,
          opts: '',
          remarks: '',
          validationQuery: 'select count(0) from dual',
          creatorRealName: '',
          creatorId: '',
          createdTime: '',
          tenantId: ''
        },
        formRules: {
          title: [
            { required: true, message: '必填项不能为空' }
          ],
          dbCode: [
            { required: true, message: '必填项不能为空' }
          ],
          dbName: [
            { required: true, message: '必填项不能为空' }
          ],
          dbType: [
            { required: true, message: '必填项不能为空' }
          ],
          userName: [
            { required: true, message: '必填项不能为空' }
          ],
          pwd: [
            { required: true, message: '必填项不能为空' }
          ],
          ip: [
            { required: true, message: '必填项不能为空' },
            { validator: FUI.Validator.ip }
          ],
          port: [
            { required: true, message: '必填项不能为空' },
            { validator: FUI.Validator.number }
          ]
        }
      };
    },
    created: function () {
      var that = this;
      that.formAction = formAction;
      if (formAction == FUI.FormAction.Add) {
        const currUser = that.$store.state.user.author;
        that.data.creatorId = currUser.userId;
        that.data.creatorRealName = decodeURI(currUser.realName);
        that.data.tenantId = currUser.tenantId;
        that.data.createdTime = Object.toGetCurrentDateTimeString();
      }
      that.loadData();
    },
    methods: {
      closeEdit() {
        FUI.Window.closeEdit();
      },
      loadData() {
        var that = this;
        if (formAction != FUI.FormAction.Add) {
          FUI.Form.bindDataToForm(that, "/workflow/security/dataBaseSource/", "getModel", keyId, null, mainTable);
        }
      },
      submitForm() {
        var that = this;
        var success = that.validateForm('formRef');
        if (!success) return;
        if ((that.data.dbType == 'kingbase' || that.data.dbType == 'dm') && that.data.dbMode == '') {
          FUI.Window.showMsg('请填写模式名');
          return false;
        }
        if (formAction == FUI.FormAction.Add && !Object.toStartWith(that.data.dbCode, that.data.tenantId.toLowerCase() + "_")) {
          that.data.dbCode = that.data.tenantId.toLowerCase() + "_" + that.data.dbCode;
        }
        FUI.Form.submitForm(that, that.data, "/workflow/security/dataBaseSource/", "saveModel", formAction, keyId, parentGridId, mainTable);
      },
      dbTypeChange(v) {
        var that = this;
        if (that.formAction != 'Add') {
          return false;
        }
        if (v == 'oracle' || v == 'dm' || v == 'kingbase') {
          that.data.validationQuery = 'select count(0) from dual';
        }
        else {
          that.data.validationQuery = 'select 1';
        }
        if (v == 'mssql') {
          that.data.port = "1433";
        } else if (v == 'mysql' || v == 'mysql_low') {
          that.data.port = "3306";
        } else if (v == 'dm') {
          that.data.port = "5236";
        } else if (v == 'kingbase') {
          that.data.port = "54321";
        } else if (v == 'postgresql') {
          that.data.port = "5432";
        } else if (v == 'oracle') {
          that.data.port = "1521";
        }
        else if (v == 'oceanbase') {
          that.data.port = "2883";
        }


        console.info(v);
      }
      , validateForm(refFormName) {
        var success = false;
        this.$refs[refFormName].validate(valid => {
          success = valid;
        });
        return success;
      },
      testConnection() {
        var that = this;
        var success = that.validateForm('formRef');
        if (!success) return;
        var dbCode = that.data.dbCode;
        Object.toAjaxJson('/workflow/security/dataBaseSource/', 'testConnection', that.data, true, null,
          function (res) {
            res.msg = res.msg || "";
            FUI.Window.showMsg(res.msg, null, res.success ? 1 : 7);
          });
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