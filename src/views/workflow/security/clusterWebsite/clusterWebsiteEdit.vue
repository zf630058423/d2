<template>
  <div class="f2bpm-page-dialog-layout">
    <el-form ref="formRef" :rules="formRules" :model="data" size="small" class="f2bpm-editform" label-width="120px">
      <el-form-item label="站点类别" prop="SiteType">
        <el-select v-model="data.SiteType" style="width:300px ;" :disabled="formAction!='Add'">
          <el-option label="普通站点" value="NormalSite" />
          <el-option label="统一主站点[流水号派发站点]" value="MainSite" />
        </el-select>
        <div style="line-height: 25px;font-size: 10px;">
          普通站点：后端部署的站点。<br>
          统一主站点：是指为了达成目标值确保唯一性、有序性或统一管理性，这时就需要用到统一站点来承担负责。由这个统一站点来完成这些操作。例如现有的流水号生成器在集群时：需要指定唯一的一台主机做为流水号分发主机 。
        </div>
      </el-form-item>

      <el-form-item label="站点名称" prop="WebSiteName">
        <el-input v-model="data.WebSiteName" @blur.native.capture="toPinYin('WebSiteName','WebSiteCode')"></el-input>
      </el-form-item>
      <el-form-item label="站点编码" prop="WebSiteCode">
        <el-input v-model="data.WebSiteCode" placeholder="请填写站点英文名称"></el-input>
      </el-form-item>
      <el-form-item label="站点Url" prop="WebSiteUrl">
        <el-input v-model="data.WebSiteUrl" placeholder="请填写站点地址如 http://wwww.a.com:8080或 http://wwww.a.com:8080/f2bpm"></el-input>
      </el-form-item>

      <el-form-item label="是否启用">
        <el-switch v-model="data.IsEnable" active-color="#87DC48" inactive-value="0" :active-value="1" inactive-color="#DEDEDE" />
      </el-form-item>
      <el-form-item label="备注" prop="Remark">
        <el-input v-model="data.Remark" type="textarea" :rows="4" />
      </el-form-item>
      <div class="dialogfooter">
        <el-button v-if="formAction!='View'" size="small" type="primary" @click="submitForm()"><i class="fa fa-save" />保存
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
        isOnlyMySelf: 1,
        treeData: [],
        data: {
          WebSiteName: "",
          WebSiteCode: "",
          IsEnable: 1,
          SiteType: 'MainSite',
          LastUpdatorName: '',
          CreatorRealName: '',

          LastUpdateTime: '',
          CreatedTime: ''
        },
        // stand:表单校验规则
        formRules: {
          WebSiteName: [
            { required: true, message: '必填项不能为空' }
          ],
          WebSiteUrl: [
            { required: true, message: '必填项不能为空' }
          ],
          WebSiteCode: [
            { required: true, message: '必填项不能为空' },
            { validator: FUI.Validator.englishchar }
          ]
        }
      };
    },
    created: function () {
      var that = this;
      that.formAction = formAction;
      const currUser = FUI.Sys.getAuthor();
      if (formAction == FUI.FormAction.Add) {
        that.data.CreatorRealName = decodeURI(currUser.realName);
        that.data.LastUpdatorName = decodeURI(currUser.realName);
        that.data.CreatedTime = Object.toGetCurrentDateTimeString();
        that.data.LastUpdateTime = Object.toGetCurrentDateTimeString();
      } else {
        that.data.LastUpdateTime = Object.toGetCurrentDateTimeString();
        that.data.LastUpdatorName = decodeURI(currUser.realName);
      }
      that.loadData();
    },
    methods: {
      // ===stand:标准化方法============
      closeEdit() {
        // stand:关闭编辑窗口
        FUI.Window.closeEdit();
      },
      // ===stand:标准化方法结束============
      loadData() {
        var that = this;

        if (formAction != FUI.FormAction.Add) {
          FUI.Form.bindDataToForm(that, FUI.Handlers.FuiFrameworkHandler, FUI.Method.AutoGetViewModelMethod, keyId, null, mainTable);
        }
      },
      submitForm() {
        var that = this;
        var success = that.validateForm('formRef');
        if (!success) return;
        FUI.Form.submitForm(that, that.data, "/workflow/security/clusterWebsite/", "save", formAction, keyId, parentGridId, mainTable);
      },

      toPinYin(sourceField, targetField) {
        if (!this.data[targetField]) {
          const source = this.data[sourceField];
          this.data[targetField] = Object.toPinYin(source);
        }
      }
      , validateForm(refFormName) {
        // stand:表单校验
        var success = false;
        this.$refs[refFormName].validate(valid => {
          success = valid;
        });
        return success;
      }

    }
  }
</script>