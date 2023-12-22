<template>
  <div class="f2bpm-page-dialog-layout">
    <div>
      <el-form ref="formRef" :rules="formRules" size="small" :model="data" class="f2bpm-editform" label-width="120px">
        <el-row>
          <el-col :span="8">
            <el-form-item label="栏目名称" prop="fenceName">
              <el-input v-model="data.fenceName" placeholder="" @blur.native.capture="toPinYin('fenceName','fenceKey')" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="栏目编码" prop="fenceKey">
              <el-input v-model="data.fenceKey" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="栏目分类" prop="categoryCode">
              <treeselect v-model="data.categoryCode" :default-expand-level="4" :multiple="false" placeholder="请选择分类" :options="treeData" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="栏目类型" prop="fenceType">
              <el-select v-model="data.fenceType">
               <!--  <el-option label="普通栏目" value="normal" /> -->
                <el-option label="图表栏目" value="report" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="使用端" prop="platformType">
              <el-select v-model="data.platformType">
                <el-option label="前端" value="front" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="栏目高度" prop="fenceHeight">
              <el-input-number v-model="data.fenceHeight" size="small" :min="200" :max="2000" label="排序" />(单位：px)
            </el-form-item>
          </el-col>
        </el-row>

        <el-row v-if="data.fenceType=='report'">
          <el-col :span="8">
            <el-form-item label="图表类型">
              <el-radio-group v-model="reportParms.reportSourceType" size="mini">
                <el-radio label="custReport">自定义图表</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="选择图表">
              <el-input v-model="reportParms.reportName" placeholder="" :disabled="true" class="textBoxShort50P" /><span class="fa fa-search ml10 cur" @click="selectCustReport">选择</span>
            </el-form-item>
          </el-col>
          <el-col :span="8" />
        </el-row>
        <el-row v-if="data.fenceType=='normal'">
          <el-col :span="8">
            <el-form-item label="数据加载来源">
              <el-select v-model="data.dataSourceType">
                <el-option label="数据服务" value="dataService" />
                <el-option label="本地后台请求" value="localAddress" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item v-if="data.dataSourceType=='dataService'" label="选择数据服务">
              <el-input v-model="dataSourceParms.dataServiceName" :disabled="true" placeholder="选择数据服务" class="textBoxShort50P" /><span class="fa fa-search ml10">选择</span>
            </el-form-item>
            <el-form-item v-if="data.dataSourceType=='localAddress'" label="后台请求地址">
              <el-input v-model="dataSourceParms.localAddress" placeholder="Controller后台数据请求完整地址" />
            </el-form-item>
          </el-col>
          <el-col :span="8" />
        </el-row>
        <el-form-item label="是否启用" prop="isEnabled">
          <el-switch v-model="data.isEnabled" :inactive-value="0" :active-value="1" active-color="#13ce66" inactive-color="#DEDEDE" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="data.remarks" placeholder="备注" />
        </el-form-item>
        <el-form-item v-if="data.fenceType=='normal'" label="模板内容">
          <el-input v-model="data.templateContent" placeholder="模板内容" type="textarea" :rows="14" />
        </el-form-item>
        <el-form-item v-if="data.fenceType=='normal'" label="模板脚本">
          <el-input v-model="data.templateScript" placeholder="模板脚本" type="textarea" :rows="2" />
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
        itemId: '',
        fieldId: '',
        formAction: null,
        treeData: [],
        reportParms: { reportSourceType: 'custReport', reportCode: '', reportName: '' },
        dataSourceParms: { reportSourceType: 'custReport', reportCode: '', reportName: '' },
        data: {
          fenceKey: '',
          fenceName: '',
          categoryCode: null,
          fenceType: 'report',
          fenceTypeParms: '',
          dataSourceType: '',
          dataSourceParms: '',
          platformType: 'front',
          fenceHeight: 200,
          fenceWidth: 0,
          templateContent: '',
          templateScript: '',
          isEnabled: 1,
          createdTime: '',
          creatorRealName: '',
          creatorId: '',
          remarks: '',
          adptions: '',
          tenantId: ''
        },
        formRules: {
          fenceKey: [
            { required: true, message: '必填项不能为空' }
          ],
          fenceName: [
            { required: true, message: '必填项不能为空' }
          ],
          categoryCode: [
            { required: true, message: '必填项不能为空' }
          ],
          fenceType: [
            { required: true, message: '必填项不能为空' }
          ],
          fenceTypeParms: [
            { required: true, message: '必填项不能为空' }
          ],
          dataSourceType: [
            { required: true, message: '必填项不能为空' }
          ],
          platformType: [
            { required: true, message: '必填项不能为空' }
          ]
        }
      };
    },
    mounted: function () {
      var that = this;
      // 如果ItemId不为空，则是从表单设计器打开的
      var itemId = Object.toQueryString('itemId') || '';
      that.loadTreeSelect();
      that.loadData();
      that.fieldId = keyId;
      that.itemId = itemId;
      if (that.data.fenceType == 'report' && that.data.fenceTypeParms) {
        that.reportParms = eval('(' + that.data.fenceTypeParms + ')');
      }
      if (that.data.dataSourceParms) {
        that.dataSourceParms = eval('(' + that.data.dataSourceParms + ')');
      }
    },
    created: function () {
      var that = this;
      that.formAction = formAction;
      if (formAction == FUI.FormAction.Add) {
        var categoryCode = Object.toQueryString('categoryCode') || null;
        that.data.categoryCode = categoryCode;
        const currUser = that.$store.state.user.author;
        that.data.creatorId = currUser.userId;
        that.data.tenantId = currUser.tenantId;
        that.data.creatorRealName = decodeURI(currUser.realName);
        that.data.createdTime = Object.toGetCurrentDateTimeString();
        that.dataSourceParms = { dataServiceCode: '', dataServiceName: '', localAddress: '' };
      }
    },
    methods: {
      closeEdit() {
        FUI.Window.closeEdit();
      },
      loadTreeSelect() {
        var that = this;
        var treeUrl = FUI.Handlers.CategoryHandler + '?groupKey=AppFenceGroup&needRoot=true';
        Object.toAjaxJson(treeUrl, null, null, true, null, function (res) {
          if (res.success) {
            that.treeData = res.data;
          } else {
            FUI.Window.showMsg(res.msg);
          }
        });
      },
      loadData() {
        var that = this;
        if (formAction != FUI.FormAction.Add) {
          FUI.Form.bindDataToForm(that, '/workflow/frame/appFence/', 'getModelJson', keyId, null, null);
        }
      },
      submitForm() {
        var that = this;
        var success = that.validateForm('formRef');
        if (that.data.fenceType == 'report') {
          if (!that.reportParms.reportSourceType) {
            FUI.Window.showMsg('请选择“图表类型”');
            return;
          }
          if (!that.reportParms.reportCode) {
            FUI.Window.showMsg('请选择“图表”');
            return;
          }
          that.data.fenceTypeParms = JSON.stringify(that.reportParms);
        } else if (that.data.fenceType == 'normal') {
          if (that.data.dataSourceType == 'localAddress' && !that.dataSourceParms.localAddress) {
            FUI.Window.showMsg('请填写“后台请求地址”');
            return;
          }
          that.data.dataSourceParms = JSON.stringify(that.dataSourceParms);
        }
        if (!success) return;
        if (that.itemId != '') {
          FUI.Form.submitForm(that, that.data, '/workflow/frame/appFence/', 'updateSave', formAction, keyId, null, null, null, null, null, function (obj) {
            if (obj.success != undefined && obj.success) {
              obj.msg = obj.msg || '操作成功！';
            }
            if (obj.success) {
              try {
                var $target = $('#' + that.itemId, $(window.parent.window.document));
                var vmodel = $target.attr('vmodel');
                if (vmodel == undefined) {
                  FUI.Window.showMsg('控件找不到vmodel属性');
                  return false;
                }
                var rowId = $target.attr('rowId');
                var columnId = $target.attr('colId');
                var preFix = vmodel.substring(0, vmodel.lastIndexOf('.'));
                var inputJson = Object.toAjaxJson('/workflow/frame/appPortal/', 'getFenceFieldJson', {
                  'fenceId': that.fieldId
                }, null, null, null, 'html');
                var fieldItem = eval('(' + inputJson + ')');
                if (inputJson != '') {
                  // 1并替换标签
                  window.parent.window.myvm.onFieldUpdate(fieldItem, rowId, columnId, that.itemId);
                }
              } catch (err) {
                FUI.Window.showMsg(err);
                return false;
              }

              // 调用生成新的表单Html字段
              FUI.Window.showMsg(obj.msg, null, 1, function () {
                if (obj.success) {
                  FUI.Window.closeEdit(false);
                }
              });
            } else {
              FUI.Window.showMsg(obj.msg);
            }
          });
        } else {
          FUI.Form.submitForm(that, that.data, FUI.Handlers.FuiFrameworkHandler, FUI.Method.AutoSaveMethod, formAction, keyId, parentGridId, mainTable);
        }
      },
      validateForm(refFormName) {
        var success = false;
        this.$refs[refFormName].validate(valid => {
          success = valid;
        });
        return success;
      },
      selectCustReport() {
        var that = this;
        WF.SelectorDialog.selectorReport(that, 'reportCode', 'reportName', true, that.reportParms);
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