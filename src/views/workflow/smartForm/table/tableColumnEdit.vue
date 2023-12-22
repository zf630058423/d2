<template>
  <div class="f2bpm-page-layout f2bpm-page-right">
    <el-form ref="formRef" :rules="formRules" size="small" :model="data" class="f2bpm-editform" label-width="120px">

      <el-form-item label="字段标题" prop="ColumnTitle">
        <el-input v-model="data.ColumnTitle" placeholder="字段标题" @blur.native.capture="toPinYin('ColumnTitle','ColumnName')" />
      </el-form-item>
      <el-form-item label="字段名" prop="ColumnName">
        <el-input v-model="data.ColumnName" :disabled="isDisabled" placeholder="段名不能超过30字节长度" />
      </el-form-item>
      <el-row>
        <el-col :span="12">
          <el-form-item label="数据类型" prop="DataType">
            <el-select v-model="data.DataType" placeholder="请选择" :disabled="isDisabled">
              <el-option v-for="item in dataTypeOptions" :key="item.value" :label="item.text" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="类型" prop="ColumnType">
            <el-select v-model="data.ColumnType" style="width: 100px;margin-left: 3px;" :disabled="isDisabled" size="mini" placeholder="请选择">
              <el-option label="物理字段" value="base" />
              <el-option label="虚拟字段" value="virtual" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="长度" prop="AttrLength">
        <el-input-number v-model="data.AttrLength" placeholder="" style="width: 200px;" />
        <el-radio-group v-model="widthRadio" style="width: 400px;margin-left: 10px;" @change="changeWidthRadio">
          <el-radio :label="36">36</el-radio>
          <el-radio :label="50">50</el-radio>
          <el-radio :label="64">64</el-radio>
          <el-radio :label="128">128</el-radio>
          <el-radio :label="256">256</el-radio>
          <el-radio :label="512">512</el-radio>
          <el-radio :label="1024">1024</el-radio>
          <el-radio :label="2048">2048</el-radio>
          <el-radio :label="4000">4000</el-radio>
        </el-radio-group>
        <br>
        单附件字段长度至少256，多附件字段长度至少1024，请结合实际情况合理配置字段长度。
      </el-form-item>

      <el-form-item label="备注">
        <el-input v-model="data.ColumnRemark" type="textarea" :rows="4" placeholder="" />
      </el-form-item>
      <div class="dialogfooter2">
        <div class="red font14 tl" style="padding-left:100px; text-align:left;margin-bottom: 10px;">警告：您正在进行非常规操作，非特殊情况，通常不在这里做字段新增或修改，请到数据建模中维护字段。在此新增的字段并不会自动产生数据建模中的表单控件。</div>
        <el-button v-if="formAction!='View'" size="small" type="primary" @click="submitForm('save')"><i class="fa fa-save" />保存
        </el-button>
        <el-button v-if="formAction=='Add'" size="small" type="primary" @click="submitForm('saveAndNew')"><i class="fa fa-save" />保存并新增
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
        keyId: '',
        formAction: null,
        isCreateTable: 0,
        // 禁用状态
        isDisabled: false,
        dataTypeOptions: [],
        widthRadio: null,
        treeData: [],
        data: {
          ColumnTitle: '',
          ColumnName: '',
          AttrLength: 64,

          // 隐藏域
          TenantId: '',
          ColumnId: '',
          TableId: '',
          Creator: '',
          CreatedTime: '',
          ColumnType: 'base',
          DataType: 'string',
          DecimalLen: '',
          DbColumnName: '',
          IsSysField: '',
          IsCreatedInDB: 0
        },
        // stand:表单校验规则
        formRules: {
          ColumnTitle: [
            { required: true, validator: FUI.Validator.required },
            { validator: FUI.GetValidatorRule('len[2,200]') }
          ],
          ColumnType: [
            { required: true, validator: FUI.Validator.required }
          ],
          DataType: [
            { required: true, validator: FUI.Validator.required }
          ],
          AttrLength: [
            { required: true, validator: FUI.Validator.required }
          ],
          ColumnName: [
            { required: true, validator: FUI.Validator.required },
            { validator: FUI.GetValidatorRule('englishchar') },
            { validator: FUI.GetValidatorRule('len[2,32]') }
          ]
        }
      };
    },
    created: function () {
      var that = this;
      var isCreateTable = Object.toQueryString('isCreateTable');
      that.formAction = formAction;
      that.keyId = keyId;
      that.isCreateTable = isCreateTable;
      var arr = Object.toDeepClone(FUI.Data.baseDataTypeDic);
      arr.push({ text: "虚拟字段", value: "virtual" });
      that.dataTypeOptions = arr;
      that.loadData();
    },
    methods: {
      closeEdit() {
        FUI.Window.closeEdit();
      },
      loadData() {
        var that = this;
        if (formAction == FUI.FormAction.Add) {
          var tableId = Object.toQueryString('tableId');
          that.data.TableId = tableId;

          const currUser = FUI.Sys.getAuthor();
          that.data.Creator = decodeURI(currUser.realName);
          that.data.CreatedTime = Object.toGetCurrentDateTimeString();
          that.data.TenantId = currUser.tenantId;
        } else if (formAction != FUI.FormAction.Add) {
          FUI.Form.bindDataToForm(that, FUI.Handlers.FuiFrameworkHandler, FUI.Method.AutoGetViewModelMethod, keyId, null, mainTable);
          if (that.data.IsCreatedInDB == 1) {
            that.isDisabled = true;
          }
        }
      },
      submitForm(btnType) {
        var that = this;
        var success = that.validateForm('formRef');
        if (!success) return;
        if (that.isCreateTable == 0 || (that.isCreateTable != 0 && that.formAction != FUI.FormAction.Add)) {
          FUI.Form.submitForm(that, that.data, FUI.Handlers.FuiFrameworkHandler, FUI.Method.AutoSaveMethod, formAction, keyId, parentGridId, mainTable, null, null, null, function (obj) {
            if (obj.success) {
              FUI.Window.showMsg2(that, obj.msg, null, 1, function () {
                if (btnType == 'save') {
                  FUI.Window.closeEdit(true, parentGridId);
                } else {
                  FUI.Window.refreshParentGrid();
                  // 继续新增
                  window.location.reload();
                }
              });
            } else {
              FUI.Window.showMsg(that, obj.msg);
            }
          });
        } else {
          FUI.Window.confirm(that, '您确定要新增加字段吗，提交保存后将在的数据库表中添加本字段，并且不可修改！', null, function (r) {
            FUI.Form.submitForm(that, that.data, FUI.Handlers.SmartFormHandler, 'saveTableColumn', formAction, keyId, parentGridId, mainTable, null, null, null, function (obj) {
              if (obj.success) {
                FUI.Window.showMsg2(that, obj.msg, null, 1, function () {
                  if (btnType == 'save') {
                    FUI.Window.closeEdit(true);
                  } else {
                    FUI.Window.refreshParentGrid();
                    // 继续新增
                    window.location.reload();
                  }
                });
              } else {
                FUI.Window.showMsg(obj.msg);
              }
            });
          });
        }
      },
      validateForm(refFormName) {
        // stand:表单校验
        var success = false;
        this.$refs[refFormName].validate(valid => {
          success = valid;
        });
        return success;
      },
      changeWidthRadio(val) {
        this.data.AttrLength = val;
      },
      toPinYin(sourceField, targetField) {
        if (!this.data[targetField]) {
          const source = this.data[sourceField];
          var s = Object.toPinyinFirst(source);
          // s=s.substr(0,1).toLocaleLowerCase()+s.substr(1);
          this.data[targetField] = s;
        }
      }
    }
  }
</script>