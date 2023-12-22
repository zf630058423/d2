<template>
  <div>
    <el-form ref="formRef" :rules="formRules" :model="data" size="small" class="f2bpm-editform" label-width="120px">
      <el-form-item label="组织名称" prop="OrgName">
        <el-input v-model="data.OrgName" placeholder="组织名称" @blur.native.capture="toPinYin('OrgName','OrgId')" />
      </el-form-item>
      <el-form-item label="组织编码" prop="OrgId">
        <el-input v-model="data.OrgId" placeholder="组织编码" :disabled="formAction!='Add'" />
      </el-form-item>
      <el-form-item label="上级组织" prop="ParentOrgId">
        <treeselect  v-model="data.ParentOrgId" :default-expand-level="3" :multiple="false" placeholder="请选择上级组织" :options="treeData" />
      </el-form-item>
      <el-form-item prop="StartUse" label="开启状态" >
        <el-radio v-model="data.StartUse" label="1">开启</el-radio>
        <el-radio v-model="data.StartUse" label="0">关闭</el-radio>
      </el-form-item>
      <el-form-item label="全路径编码" >
        <el-input v-model="data.OrgFullCode" placeholder="组织的全路径编码,系统自动根据组织编码构建" :disabled="true"/>
      </el-form-item>
      <el-form-item label="组织标签" prop="OrgLevel">
        <el-input v-model="data.OrgLevel" style="width: 100%;" placeholder="组织级别是一种自定义标签" />
        <a id="selectDepart" href="javascript:void(0)" class="fa fa-search font12" title="选择标签" @click="selectRelationType('OrgLevel','','orgLevel')">选择标签</a> <a id="clearEmpty2" href="javascript:void(0)" @click="clearRelationInfoType('OrgLevel')" class=" font12"><i class="fa fa-minus-circle" aria-hidden="true" />清空</a>
        <el-tooltip class="item" effect="dark" content="组织级别是一种自定义标签，多个之间使用英文逗号隔开" placement="right">
          <i style="margin-left: 5px;font-size: 12px;" class="fa fa-question-circle-o">说明</i>
        </el-tooltip>
      </el-form-item>
      <el-row>
        <el-col :span="12">
          <el-form-item label="组织类别" prop="Type">
            <f2bpmui-select :field="typeField" :fieldvalue="data.Type" @updatevalue="updateFieldValue" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="排序" prop="OrgOrderNo">
            <el-input-number v-model="data.OrgOrderNo" size="small" :min="1" :max="100000" label="排序" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="分公司编码" prop="CompanyCode" v-if="false">
        <el-input v-model="data.CompanyCode" style="width: 320px;" placeholder="不填写则为总公司" />
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
        treeData: [],
        typeField: { field: 'Type', title: '组织类别', itemRender: { props: { configtype: '组织类别' } } },
        data: {
          Id:"",
          OrgName: '',
          OrgId: '',
          ParentOrgId: null,
          OrgLevel: '',
          Type: "0",
          OrgOrderNo: 100,
          StartUse:'1',
          OrgFullCode: '',
          CompanyCode: '',
          IsTmpOrg: 0,
          TenantId: '',
          OpinionType: '',
          CreatorId: '',
          Creator: '',
          CreatorOrgId: '',
          CreatedTime: '',
          LastModTime: ''
        },
        formRules: {
          OrgName: [
            { required: true, message: '必填项不能为空' }
          ],
          OrgId: [
            { required: true, message: '必填项不能为空' }
            ,{ validator: FUI.GetValidatorRule('englishchar3') }
          ],
          OrgCode: [
            { required: true, message: '必填项不能为空' }
          ],
          StartUse:[
            { required: true, message: '必填项不能为空' }
          ],
        }
      };
    },
    created: function () {
      var that = this;
      var parentId = Object.toQueryString('parentId') || '';
      that.formAction = formAction;
      if (formAction == FUI.FormAction.Add) {
        if (parentId && parentId != 'Root') {
          that.data.ParentOrgId = parentId;
        }
        else {
          that.data.ParentOrgId = "Root";
        }
        that.data.OrgId = "ORG" + (new Date()).toDateFormat('yyyyMMddhhmmssS');
        const currUser = FUI.Sys.getAuthor();
        that.data.CreatorId = currUser.userId;
        that.data.Creator = decodeURI(currUser.realName);
        that.data.TenantId = currUser.tenantId;
        that.data.CreatedTime = Object.toGetCurrentDateTimeString();
      }
      that.loadTreeSelect();
      that.loadData();
      if (formAction == FUI.FormAction.Edit) {
        that.data.LastModTime = Object.toGetCurrentDateTimeString();
      }
    },
    methods: {
      closeEdit() {
        FUI.Window.closeEdit();
      },
      loadData() {
        var that = this;
        if (formAction != FUI.FormAction.Add) {
          FUI.Form.bindDataToForm(that, FUI.Handlers.FuiFrameworkHandler, FUI.Method.AutoGetViewModelMethod, keyId, null, mainTable);
        }
      },
      loadTreeSelect() {
        var that = this;
        var treeUrl = FUI.Handlers.OrgImplController + 'getOrgList/?needroot=true';
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
      submitForm() {
        var that = this;
        var success = that.validateForm('formRef');
        if (!success) return;
        FUI.Form.submitForm(that, that.data, "/admin/org/", "saveOrg", formAction, keyId, parentGridId, mainTable);
      },
      validateForm(refFormName) {
        // stand:表单校验
        let that = this;
        var success = false;
        this.$refs[refFormName].validate(valid => {
          success = valid;
        });
        if (that.data.ParentOrgId == that.data.OrgId) {
          FUI.Window.showMsg("上级组织不能是自己");
          return false;
        }
        if (that.data.OrgName.indexOf("/")>-1) {
          FUI.Window.showMsg("组织名称不允许包含有“/”字符");
          return false;
        }
        return success;
      },
      updateFieldValue(fieldName, newVal) {
        var that = this;
        that.data[fieldName] = newVal;
      },
      clearRelationInfoType(inputIds) {
        var that = this;
        var arr = inputIds.split(",");
        $.each(arr, function (i, name) {
          that.data[name] = "";
        });
      }
      , selectRelationType(inputKey, inputName, infoType) {
        var that = this;
        var that = this;
        WF.SelectorDialog.selectRelationType(that, null, null, infoType, null, false, true, function (data) {
          if (data != false) {
            var arrTV = [];
            var titleArr = [];
            var valueArr = [];
            $.each(data, function (i, item) {
              let typeCode = item.typeCode;
              let typeTitle = item.typeTitle;
              arrTV.push({ text: typeTitle, value: typeCode });
              titleArr.push(typeTitle);
              valueArr.push(typeCode);
            });
            if (inputKey) {
              that.data[inputKey] = valueArr.toString();
            }
            if (inputName) {
              that.data[inputName] = titleArr.toString();
            }
          }
        });
      },
      parentOrgChange(node, instanceId) {
        console.info(node);
        var that = this;
        var attributes = node.attributes;
        if (attributes) {
          var parentGroupFullCode = attributes.groupFullCode;
          var myGroupFullCode = parentGroupFullCode + that.data.OrgId;
          that.data.OrgFullCode = myGroupFullCode;
        } else {
          that.data.OrgFullCode = that.data.OrgId;
        }
      }
      , toPinYin(sourceField, targetField) {
        if (!this.data[targetField]) {
          const source = this.data[sourceField];
          this.data[targetField] = Object.toPinYin(source);
        }
      }
    }
  }
</script>