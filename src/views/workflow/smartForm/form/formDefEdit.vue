<template>
  <div>
    <div>
      <!--  <el-header style="padding: 0;padding-left: 5px;border-bottom: solid #e8eaec  1px;height: 40px;">
        <el-tabs :value="actionName" @tab-click="tabsClick">
          <el-tab-pane label="①基本信息" name="goFormDefEdit"></el-tab-pane>
          <el-tab-pane label="②关联表" name="goFormDefTableRelList"></el-tab-pane>
          <el-tab-pane label="③业务对象" name="goBusObjectSubsEdit"></el-tab-pane>
          <el-tab-pane label="④字段控件" name="goFormFieldList"></el-tab-pane>
        </el-tabs>
      </el-header> -->
    </div>

    <el-form ref="formRef" :rules="formRules" :model="data" size="small" class="f2bpm-editform" label-width="120px">
      <el-form-item label="模型分类" prop="categoryCode">
        <treeselect v-model="data.categoryCode" :default-expand-level="2" :multiple="false" placeholder="请选择分类" :options="treeData" />
      </el-form-item>
      <el-form-item label="模型名称" prop="formDefName">
        <el-input v-model="data.formDefName" placeholder="" @blur.native.capture="toPinYin('formDefName','formDefKey')" />
      </el-form-item>

      <el-form-item label="模型编码" prop="formDefKey">
        <el-input v-model="data.formDefKey" placeholder="" :disabled="formAction=='Edit'" />
      </el-form-item>
      <el-form-item label="备注">
        <el-input v-model="data.remart" type="textarea" :rows="4" placeholder="备注" />
      </el-form-item>
      <div class="dialogfooter">
        <el-button v-if="formAction!='View'" size="small" type="primary" @click="submitForm(1)"><i class="fa fa-save" />保存</el-button>
        <el-button id="btn_cancel" size="small" @click="closeEdit"> <i class="fa fa-minus-circle" />关闭</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        formAction: null,
        isShowgoNext: false,
        actionName: 'goFormDefEdit',
        treeData: [],
        data: {
          formDefName: '',
          formDefKey: '',
          categoryCode: null,
          tenantId: '',
          lastUpdateTime: '',
          lastUpdateActor: '',
          createdTime: '',
          creatorId: '',
          creatorRealName: '',
          formDefId: ''
        },
        formRules: {
          categoryCode: [
            { required: true, message: '请选择分类', trigger: 'blur' }
          ],
          formDefName: [
            { required: true, message: '必填项不能为空', trigger: 'blur' }
          ],
          formDefKey: [
            { required: true, message: '必填项不能为空', trigger: 'blur' }
          ]
        }
      };
    },
    created: function () {
      var that = this;
      that.loadTreeSelect();
      that.loadData();
    },
    methods: {
      closeEdit() {
        FUI.Window.closeEdit();
      },
      // ===stand:标准化方法结束============
      loadData() {
        var that = this;
        const currUser = FUI.Sys.getAuthor();
        that.formAction = formAction;
        if (formAction == FUI.FormAction.Add) {
          var categoryCode = Object.toQueryString('categoryCode') || '';
          that.data.tenantId = currUser.tenantId;
          that.data.createdTime = Object.toGetCurrentDateTimeString();
          that.data.creatorId = currUser.userId;
          that.data.creatorRealName = decodeURI(currUser.realName);
          that.data.lastUpdateActor = decodeURI(currUser.realName);
          that.data.lastUpdateTime = Object.toGetCurrentDateTimeString();
          if (categoryCode) {
            that.data.categoryCode = categoryCode;
          }
        } else if (formAction != FUI.FormAction.Add) {
          that.isShowgoNext = true;
          that.data.lastUpdateActor = decodeURI(currUser.realName);
          that.data.lastUpdateTime = Object.toGetCurrentDateTimeString();
          FUI.Form.bindDataToForm(that, FUI.Handlers.SmartFormHandler, 'getModelFormDef', keyId, null, mainTable);
        }
      },
      loadTreeSelect() {
        var that = this;
        var treeUrl = FUI.Handlers.CategoryHandler + '?groupKey=BusinessObject&needRoot=false';
        Object.toAjaxJson(treeUrl, null, null, true, null, function (res) {
          if (res.success) {
            that.treeData = res.data;
          } else {
            FUI.Window.showMsg(res.msg);
          }
        });
      },
      submitForm(isGoNext) {
        var that = this;
        var success = that.validateForm('formRef');
        if (!success) return;
        if (formAction == FUI.FormAction.Edit) {
          // 修改时直接保存
          FUI.Form.submitForm(that, that.data, FUI.Handlers.SmartFormHandler, 'saveFormDef', formAction, keyId, parentGridId, mainTable, null, null, null,
            function (data) {
              if (data.success) {
                var theParentWin = window.openerWin || window.parent;
                if (theParentWin.myvm && theParentWin.myvm.loadFormDefInfo) {
                  theParentWin.myvm.loadFormDefInfo();
                }
                FUI.Window.showMsg(that, data.msg, null, 1, function () {
                  FUI.Window.closeEdit(true, 'grid');
                });
              } else {
                FUI.Window.showMsg(that, data.msg);
              }
            });
        } else {
          // 新增成功后跳到模型设计中
          FUI.Form.submitForm(that, that.data, FUI.Handlers.SmartFormHandler, 'saveFormDef', formAction, keyId, parentGridId, mainTable, null, null, null, function (data) {
            if (data.success) {
              FUI.Window.refreshParentGrid();
              FUI.Window.showMsg(that, data.msg, null, 1, function () {
                if (isGoNext == 1) {
                  // 刷新数据模型列表
                  var formDefId = data.data;
                  window.location.href = __webpath + '/workflow/smartForm/form/formModeDesigner?formDefId=' + formDefId + '&categoryCode=' + that.data.categoryCode;
                  //window.location.reload();
                } else {
                  FUI.Window.closeEdit(true, parentGridId);
                }
              });
            } else {
              FUI.Window.showMsg(that, data.msg);
            }
          });
        }
      },
      validateForm(refFormName) {
        var that=this;
        // stand:表单校验
        var success = false;
        if (that.data.formDefName.indexOf('/') > -1 ||that.data.formDefName.indexOf('&') > -1 ||that.data.formDefName.indexOf('@') > -1 || that.data.formDefName.indexOf('#') > -1 ||that.data.formDefName.indexOf('!') > -1) {
          FUI.Window.showMsg(that.data.formDefName+ ' 不能含有特殊字符');
          return;
        }
        this.$refs[refFormName].validate(valid => {
          success = valid;
        });
        return success;
      },
      toPinYin(sourceField, targetField) {
        if (!this.data[targetField]) {
          const source = this.data[sourceField];
          this.data[targetField] = Object.toPinYin(source);
        }
      },
      // 表单编辑
      goFormDefEdit() {
        window.location.href = __webpath + '/workflow/smartForm/formDefEdit/?parentGridId=grid&formAction=Edit&mainTable=f2bpm_form_FormDef&keyId=' + this.data.formDefId + '&categoryCode=' + this.data.categoryCode;
      },
      // 关联表
      goFormDefTableRelList() {
        var that = this;
        window.location.href = __webpath + '/workflow/smartForm/table/formDefTableRelList/?formDefId=' + this.data.formDefId + '&categoryCode=' + that.data.categoryCode;
      },
      // 业务对象设计
      goBusObjectSubsEdit() {
        var that = this;
        window.location.href = __webpath + '/workflow/smartForm/busObjectSubsEdit/?formDefId=' + this.data.formDefId + '&categoryCode=' + that.data.categoryCode;
      },
      // 字段元素
      goFormFieldList() {
        window.location.href = __webpath + '/workflow/smartForm/formFieldList/?formDefId=' + this.data.formDefId + '&categoryCode=' + this.data.categoryCode;
      },
      tabsClick(tab) {
        var that = this;
        var name = tab.name;
        that.actionName = 'goFormDefEdit';
        if (formAction == 'Add') {
          FUI.Window.showMsg('首次新增，请填写并点击“保存”基本信息');
          return;
        }
        if (name == 'goFormDefEdit') {
          that.goFormDefEdit();
        } else if (name == 'goBusObjectSubsEdit') {
          that.goBusObjectSubsEdit();
        } else if (name == 'goFormFieldList') {
          that.goFormFieldList();
        } else if (name == 'goFormDefTableRelList') {
          that.goFormDefTableRelList();
        }
      }
    }
  }
</script>