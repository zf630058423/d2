<template>
  <div class="f2bpm-page-dialog-layout">
    <div style="padding: 4px; ">
      <el-tabs value="常规">
        <el-tab-pane label="常规" name="常规">
          <div class="pl5" style="height:360px; ">
            <legend style="font-size: 12px; margin: 0px;"><i class="fa fa-square" />是否多选</legend>
            <div class="p10">
              <el-radio-group v-model="generalKeyValueObj.isMultiple">
                <el-radio :label="true">是（多选）</el-radio>
                <el-radio :label="false">否（单选）</el-radio>
              </el-radio-group>
              <br>
              <em>说明：</em>仅对“下拉选择框”、“附件上传”、“图片上传”...有效
            </div>
            <legend style="font-size: 12px; margin: 0px;"><i class="fa fa-square" />是否支持清空</legend>
            <div class="p10">
              <el-radio-group v-model="generalKeyValueObj.clearable">
                <el-radio :label="true">是 </el-radio>
                <el-radio :label="false">否 </el-radio>
              </el-radio-group>
              <br>
            </div>
            <legend style="font-size: 12px; margin: 0px;"><i class="fa fa-square" />文件上传配置</legend>
            <div class="p10">
              <div class="p3">
                上传提示描述：
                <el-input v-model="generalKeyValueObj.uploadtip" size="mini" placeholder="上传提示的描述" />
              </div>
              <div class="p3">
                上传文件类型：
                <el-input v-model="generalKeyValueObj.uploadextension" size="mini" placeholder="以逗号隔开如：.jpg,.gif,.jpeg,.bmp,.png,.doc" />
              </div>
              <div class="p5">
                上传限制个数：
                <el-input-number v-model="generalKeyValueObj.uploadlimit" size="mini" :min="0" :max="100000" label="0或空表示不限制" />(0或空表示不限制)
              </div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="配置" name="配置">
          <div class="pl5" style="height:360px; ">
            <legend style="font-size: 12px; margin: 0px;"><i class="fa fa-square" />高德地图访问KEY</legend>
            <div class="p10">
              <el-input v-model="generalKeyValueObj.amapAccessKey" size="mini" placeholder="高德地图访问KEY,需要向高德地官方申请" />
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
      <div class="dialogfooter">
        <el-button size="small" type="primary" @click="saveAndClose()"><i class="fa fa-save" />确定</el-button>
        <el-button id="btn_cancel" size="small" @click="closeEdit"><i class="" />取消
        </el-button>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        fieldId: '',
        initailData: [],
        generalKeyValueObj: { amapAccessKey: '', isColumnHide: false, isMultiple: false, clearable: false, uploadtip: '', uploadlimit: '', uploadextension: '' },
        data: {
          general: { opttitle: '字段属性键值对常规设置', opttype: 'general', params: { 'kvData': [] } }
        }
      };
    },
    created() {
    },
    mounted() {
      var that = this;
      window.myvm = that;
      var fieldId = Object.toQueryString('fieldId');
      setTimeout(function () {
        that.fieldId = fieldId;
        var win = window.openerWin;
        var data = win.getFieldOptions();
        if (typeof data === 'string' && data) {
          data = eval('(' + data + ')');
        }
        that.initailData = data;
        that.initail();
      }, 1000);
    },
    methods: {
      closeEdit() {
        // stand:关闭编辑窗口
        FUI.Window.closeEdit();
      },
      initail() {
        var that = this;
        if (that.initailData == null || that.initailData.length == 0) {
          return false;
        }
        $.each(that.initailData, function (opttype, item) {
          if (item != null) {
            var opttype = item.opttype;
            that.data[opttype] = item;
            if (opttype == 'general') {
              that.initailGeneralResult(item);
            }
          }
        });
      },
      validateForm(refFormName) {
        // stand:表单校验
        var success = false;
        this.$refs[refFormName].validate(valid => {
          success = valid;
        });
        return success;
      },
      collectData() {
        var that = this;
        try {
          var data = [];
          var kvData = [];
          $.each(that.generalKeyValueObj, function (key, value) {
            kvData.push({ 'key': key, 'value': value });
          });
          that.data.general.params.kvData = kvData;
          var general = that.data.general;
          data.push(general);

          var resultStr = JSON.stringify(data);
          if (resultStr == '[]') {
            return '';
          } else {
            return resultStr;
          }
        } catch (err) {
          FUI.Window.showMsg(that, err);
          return false;
        }
      },
      initailGeneralResult(jsonObj) {
        var that = this;
        var kvData = jsonObj.params.kvData || [];
        $.each(kvData, function (i, item) {
          that.generalKeyValueObj[item.key] = item.value;
        });
      },
      saveAndClose() {
        var that = this;
        var formOptions = that.collectData().replace(/\"/g, "'");
        try {
          window.openerWin.saveFieldOptions(formOptions);
          FUI.Window.closeEdit();
        } catch (err) {
        }
      },
      selectorUserTextValue(inputKey, inputName, passParm, singleSelect, keyName) {
        var that = this;
        WF.SelectorDialog.selectorUserTextValue(that, inputKey, inputName, passParm, singleSelect, keyName, null, null, that.data.autoCirculated);
      }
    }
  };
  window.getResult = function () {
    return myvm.getResult();
  }
</script>