<template>
  <div>
    <div>
      <el-tabs value="常规" type="border-card" style="height:440px; ">
        <el-tab-pane label="常规" name="常规">
          <div class="pl5" style="height:360px; ">
            <legend style="font-size: 12px; margin: 0px; display: none;"><i class="icon icon-edit " />是否隐藏列（只对子列表有效）</legend>
            <div class="p10" style="display:none">
              <el-radio-group v-model="generalKeyValueObj.isColumnHide">
                <el-radio :label="true">是（隐藏列）</el-radio>
                <el-radio :label="false">否（非隐藏列）</el-radio>
              </el-radio-group>
            </div>
            <legend style="font-size: 12px; margin: 0px;"><i class="icon icon-edit " />是否多选</legend>
            <div class="p10">
              <el-radio-group v-model="generalKeyValueObj.isMultiple">
                <el-radio :label="true">是（多选）</el-radio>
                <el-radio :label="false">否（单选）</el-radio>
              </el-radio-group>
              <br>
              <em>说明：</em>仅对“附件上传”、“图片上传”...有效
            </div>
            <legend style="font-size: 12px; margin: 0px;"><i class="icon icon-edit " />是否支持清空</legend>
            <div class="p10">
              <el-radio-group v-model="generalKeyValueObj.clearable">
                <el-radio :label="true">是 </el-radio>
                <el-radio :label="false">否 </el-radio>
              </el-radio-group>
              <br>

            </div>

          </div>
        </el-tab-pane>
        <el-tab-pane label="控件属性" name="控件属性">
          <el-tabs :value="ctrType" tab-position="left" style="height: 360px;">
            <el-tab-pane v-if="ctrType=='text'" label="文本框" name="text">
              <div class="pl5">
                <div class="p10">
                  显示格式：
                  <el-radio-group size="mini" v-model="generalKeyValueObj.showFormat">
                    <el-radio-button label="qianfenwei">千分位</el-radio-button>
                    <el-radio-button label="daxiejine">大写金额</el-radio-button>
                    <el-radio-button label="percent">百分比%</el-radio-button>
                    <el-radio-button label="">无</el-radio-button>
                  </el-radio-group>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane v-if="ctrType=='customdialog'" label="自定义对话框" name="customdialog">
              <div class="pl5">
                <div class="p10">
                  显示格式：
                  <el-radio-group size="mini" v-model="generalKeyValueObj.showFormat">
                    <el-radio-button label="qianfenwei">千分位</el-radio-button>
                    <el-radio-button label="daxiejine">大写金额</el-radio-button>
                    <el-radio-button label="percent">百分比%</el-radio-button>
                    <el-radio-button label="">无</el-radio-button>
                  </el-radio-group>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane v-if="ctrType=='selector'" label="自定义(开发)选择器" name="selector">
              <div class="pl5">
                <div class="p10">
                  显示格式：
                  <el-radio-group size="mini" v-model="generalKeyValueObj.showFormat">
                    <el-radio-button label="qianfenwei">千分位</el-radio-button>
                    <el-radio-button label="daxiejine">大写金额</el-radio-button>
                    <el-radio-button label="percent">百分比%</el-radio-button>
                    <el-radio-button label="">无</el-radio-button>
                  </el-radio-group>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane v-if="ctrType=='switch'" label="开关控件" name="switch">
              <div>
                <div class="p10">
                  使用复选框模式
                  <el-switch v-model="generalKeyValueObj.isCheckBoxMode" size="mini">(1:选中状态，0为非选中状态)
                  </el-switch>
                  <el-input class="ml10" style="width:300px" v-model="generalKeyValueObj.checkBoxModeTitle" size="mini" placeholder="复选框的内容" />
                </div>
                <div class="p10">
                  启用自定义活值
                  <el-switch v-model="generalKeyValueObj.isCustomActiveValue" size="mini">
                  </el-switch>
                  <span class="ml20">激活值：</span>
                  <el-input class="textBoxMinShort" v-model="generalKeyValueObj.activeValue" size="mini" placeholder="默认为1" />
                  非激活值：
                  <el-input class="textBoxMinShort" v-model="generalKeyValueObj.inActiveValue" size="mini" placeholder="默认为0" />
                </div>
                <div class="p10">
                  启用自定义标题
                  <el-switch v-model="generalKeyValueObj.isCustomActiveTitle" size="mini">
                  </el-switch>
                  <span class="ml20">激活标题：</span>
                  <el-input class="textBoxMinShort" v-model="generalKeyValueObj.activeTitle" size="mini" placeholder="激活标题" />
                  非激活标题：
                  <el-input class="textBoxMinShort" v-model="generalKeyValueObj.inActiveTitle" size="mini" placeholder="非激活标题" />
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane v-if="ctrType=='file'" label="文件上传" name="file">
              <legend style="font-size: 12px; margin: 0px;padding-left: 12px;"><i class="icon icon-edit " />文件上传配置</legend>
              <div class="p10">
                <div class="p3">
                  <div class="mb5">上传提示描述：</div>
                  <el-input v-model="generalKeyValueObj.uploadtip" size="mini" placeholder="上传提示的描述" />
                </div>
                <div class="p3">
                  <div class="mb5">上传文件类型：</div>
                  <el-input v-model="generalKeyValueObj.uploadextension" size="mini" placeholder="以逗号隔开如：.jpg,.gif,.jpeg,.bmp,.png,.doc" />
                </div>
                <div class="p5">
                  <div class="mb5">上传限制个数：(0或空表示不限制)</div>
                  <el-input-number v-model="generalKeyValueObj.uploadlimit" size="mini" :min="0" :max="100000" label="0或空表示不限制" />
                </div>
              </div>
            </el-tab-pane>

            <el-tab-pane v-if="ctrType=='droptree'" label="下拉树" name="droptree">
              <legend style="font-size: 12px; margin: 0px;padding-left: 12px;"><i class="icon icon-edit " />选项标签回填目标字段</legend>
              <div class="p10">
                <div class="p3">
                  <div class="mb5"></div>
                  <el-input v-model="generalKeyValueObj.textBindToFields" style="width:300px" size="mini" placeholder="选择要回填的目标字段" />
                  <i class="fa fa-search cur ml5" @click="selectFormField(generalKeyValueObj,'textBindToFields')">选择</i>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane v-if="ctrType=='select'" label="下拉选择框" name="select">
              <legend style="font-size: 12px; margin: 0px;padding-left: 12px;"><i class="icon icon-edit " />选项标签回填目标字段</legend>
              <div class="p10">
                <div class="p3">
                  <div class="mb5"></div>
                  <el-input v-model="generalKeyValueObj.textBindToFields" style="width:300px" size="mini" placeholder="选择要回填的目标字段" />
                  <i class="fa fa-search cur ml5" @click="selectFormField(generalKeyValueObj,'textBindToFields')">选择</i>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane v-if="ctrType=='radio'" label="单选按钮组" name="radio">
              <legend style="font-size: 12px; margin: 0px;padding-left: 12px;"><i class="icon icon-edit " />选项标签回填目标字段</legend>
              <div class="p10">
                <div class="p3">
                  <div class="mb5"></div>
                  <el-input v-model="generalKeyValueObj.textBindToFields" style="width:300px" size="mini" placeholder="选择要回填的目标字段" />
                  <i class="fa fa-search cur ml5" @click="selectFormField(generalKeyValueObj,'textBindToFields')">选择</i>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane v-if="ctrType=='checkbox'" label="复选框组" name="checkbox">
              <legend style="font-size: 12px; margin: 0px;padding-left: 12px;"><i class="icon icon-edit " />选项标签回填目标字段</legend>
              <div class="p10">
                <div class="p3">
                  <div class="mb5"></div>
                  <el-input v-model="generalKeyValueObj.textBindToFields" style="width:300px" size="mini" placeholder="选择要回填的目标字段" />
                  <i class="fa fa-search cur ml5" @click="selectFormField(generalKeyValueObj,'textBindToFields')">选择</i>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="地址控件" v-if="ctrType=='mapAddress'" name="mapAddress">
              <div class="pl5" style="height:360px; ">
                <legend style="font-size: 12px; margin: 0px;"><i class="icon icon-edit " />高德地图访问KEY</legend>
                <div class="p10">
                  <el-input clearable v-model="generalKeyValueObj.amapAccessKey" size="mini" placeholder="高德地图访问KEY,需要向高德地官方申请" />
                </div>
                <legend style="font-size: 12px; margin: 0px;"><i class="icon icon-edit " />经度回填字段（有需要时才填写）</legend>
                <div class="p10">
                  <el-input clearable v-model="generalKeyValueObj.lonBindToFields" style="width:300px" size="mini" placeholder="选择要回填的经度目标字段" />
                  <i class="fa fa-search cur ml5" @click="selectFormField(generalKeyValueObj,'lonBindToFields')">选择</i>
                </div>
                <legend style="font-size: 12px; margin: 0px;"><i class="icon icon-edit " />纬度回填字段（有需要时才填写）</legend>
                <div class="p10">
                  <el-input clearable v-model="generalKeyValueObj.latBindToFields" style="width:300px" size="mini" placeholder="选择要回填的纬度目标字段" />
                  <i class="fa fa-search cur ml5" @click="selectFormField(generalKeyValueObj,'latBindToFields')">选择</i>
                </div>

              </div>
            </el-tab-pane>


          </el-tabs>
        </el-tab-pane>
        <el-tab-pane label="里程碑" name="里程碑">
          <div class="pl5" style="height:360px; ">
            <legend style="font-size: 12px; margin: 0px;"><i class="icon icon-edit " />显示方向</legend>
            <div class="p10">
              <el-radio-group v-model="generalKeyValueObj.steps_direction" size="mini">
                <el-radio-button label="horizontal">水平</el-radio-button>
                <el-radio-button label="vertical">垂直</el-radio-button>
              </el-radio-group>
            </div>
            <legend style="font-size: 12px; margin: 0px;"><i class="icon icon-edit " /> 每个step 的间距</legend>
            <div class="p10">
              <el-input v-model="generalKeyValueObj.steps_space" size="mini" placeholder="每个 step 的间距，不填写将自适应间距。支持百分比。" />
            </div>
          </div>
        </el-tab-pane>


      </el-tabs>
      <div class="dialogfooter">
        <el-button size="small" type="primary" @click="saveAndClose()"><i class="fa fa-save" />确定</el-button>
        <el-button id="btn_cancel" size="small" @click="closeEdit"><i class="fa fa-minus-circle" />取消
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        ctrType: "",
        fieldId: '',
        initailData: [],
        generalKeyValueObj: {
          steps_space: '', steps_direction: 'horizontal', amapAccessKey: '', lonBindToFields:"", latBindToFields:"",isColumnHide: false, isMultiple: true, clearable: false, uploadtip: '', uploadlimit: '', uploadextension: '', activeTitle: "", inActiveTitle: "", isCheckBoxMode: false, activeValue: 1, inActiveValue: 0,
          isCustomActiveValue: false, isCustomActiveTitle: false, showFormat: "", textBindToFields: ''
        },
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
      var formDefId = Object.toQueryString('formDefId');
      var ctrType = Object.toQueryString('ctrType');
      that.ctrType = ctrType;
      setTimeout(function () {
        that.fieldId = fieldId;
        that.formDefId = formDefId;
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
      , selectFormField(item, inputId) {
        var that = this;
        var parm = {
          formDefId: that.formDefId,
          isMulti: true,
          data: []
        };
        FUI.dialog(__webpath + '/workflow/selector/selectFormField/?formDefId=' + that.formDefId, '选择表单字段', parm, 450, 500, function (objectData, index, layer) {
          if (objectData.length > 0) {
            var ids = [];
            $.each(objectData, function (i, item) {
              ids.push(item.value);
            });
            item[inputId] = ids.toString();
          } else {
            item[inputId] = '';
          }
          layer.close(index);
        }, true);
      }
    }
  };
  window.getResult = function () {
    return myvm.getResult();
  }
</script>
