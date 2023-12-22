<template>
  <div class="f2bpm-page-dialog-layout">
    <div>
      <el-form ref="formRef" :rules="formRules" size="small" :model="data" class="f2bpm-editform" label-width="120px">
        <el-form-item label="表定义" prop="refTitle">
          <el-input v-model="data.refTitle" placeholder="请选择表定义" :disabled="true" />
          <a v-if="formAction=='Add'" id="tableSelector" href="javascript:void(0)" role="button" class="btn btn-primary  btn-xs" @click="tableSelector('refTableId','refTitle')"><i class="fa fa-search">选择</i></a>
          <a v-if="formAction=='Edit'" id="tableSelector" href="javascript:void(0)" role="button" class="btn btn-primary  btn-xs" @click="tableDefinition"><i class="fa fa-search">查看表定义</i></a>

        </el-form-item>
        <el-form-item label="业务对象名" prop="busObjectTitle">
          <el-input v-model="data.busObjectTitle" placeholder="" />
        </el-form-item>
        <el-form-item label="序号" prop="orderNo">
          <el-input-number v-model="data.orderNo" placeholder="" />
          </el-input-number>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="data.remark" type="textarea" :rows="4" placeholder="" />
        </el-form-item>

        <el-form-item v-if="isShowRuleOptions" label="规则配置">
          <el-tabs value="first">
            <el-tab-pane label="常规设置" name="first">
              <div>
                <el-descriptions class="margin-top" title="排序表达式" :column="1" size="small" border>
                  <el-descriptions-item>
                    <template slot="label">
                      排序字段
                    </template>
                    <el-input v-model="optionItems.orderByStr" placeholder="填写示例: name asc,thetime desc" />
                    <span class="fa fa-search cur" @click="selectBoColumn('orderByStr','optionItems.orderByStr')">选择字段</span>
                  </el-descriptions-item>
                  <el-descriptions-item>
                    <template slot="label">
                      <i class="el-icon-tickets"></i>
                      说明
                    </template>
                    1、当只有一个字段排序且不指定排序方向时默认为升序。
                    <br>2、当不指定排序字段时，如果表中包含有CreatedTime字段，侧默认使用此字段进行升序排序，否则忽略排序。
                  </el-descriptions-item>
                </el-descriptions>

                <el-descriptions class="margin-top" title="合计行设置" :column="4" size="small" border>
                  <el-descriptions-item>
                    <template slot="label">
                      去除合计行
                    </template>
                    <el-switch v-model="optionItems.general.removeFooterRow" active-color="#87DC48" inactive-color="#DEDEDE" />
                  </el-descriptions-item>
                  <el-descriptions-item>
                    <template slot="label">
                      隐藏复选框列
                    </template>
                    <el-switch v-model="optionItems.general.hideCheckbox" active-color="#87DC48" inactive-color="#DEDEDE" />
                  </el-descriptions-item>
                  <el-descriptions-item>
                    <template slot="label">
                      隐藏序号列
                    </template>
                    <el-switch v-model="optionItems.general.hideNumber" active-color="#87DC48" inactive-color="#DEDEDE" />
                  </el-descriptions-item>
                  <el-descriptions-item>
                    <template slot="label">
                      隐藏操作列
                    </template>
                    <el-switch v-model="optionItems.general.hideOperate" active-color="#87DC48" inactive-color="#DEDEDE" />
                  </el-descriptions-item>
                  <el-descriptions-item>
                    <template slot="label">
                      合计行显示格式：
                    </template>
                    <el-radio-group size="mini" v-model="optionItems.general.showFormat">
                      <el-radio-button label="qianfenwei">千分位</el-radio-button>
                      <el-radio-button label="daxiejine">大写金额</el-radio-button>
                      <el-radio-button label="percent">百分比%</el-radio-button>
                      <el-radio-button label="">无</el-radio-button>
                    </el-radio-group>
                  </el-descriptions-item>
                  <el-descriptions-item>
                    <template slot="label">
                      <i class="el-icon-tickets"></i>
                      说明
                    </template>
                    <div class="font8"> 设置保存后需要在表单设计器上重新右键“编辑控件”更新子表控件。</div>
                  </el-descriptions-item>
                </el-descriptions>


                <!-- <i class="fa fa-edit"></i>是否使用弹窗添加行
                <div>
                  <el-radio v-model="optionItems.general.addWay" label="dialog">是（弹窗方式）</el-radio>
                  <el-radio v-model="optionItems.general.addWay" label="default">否（默认方式）</el-radio>
                </div>
                <div class="p10">择“是”将明细子表添加时使用弹出窗口方式，选择“否”则为行内编辑添加方式。</div> -->
              </div>
            </el-tab-pane>
            <el-tab-pane label="过滤条件" name="second">
              <el-descriptions class="margin-top" title="where条件" :column="1" size="small" border>
                <el-descriptions-item>
                  <template slot="label">
                    <i class="el-icon-tickets"></i>
                    过滤Where
                  </template>
                  <el-input v-model="optionItems.whereQuery.whereStr" placeholder="填写示例: name='李三' s_and type=1 " />
                  <div class="mt5">
                    <span class="fa fa-search cur" @click="selectBoColumn('whereStr','optionItems.whereQuery')">选择字段</span>
                    <i class="fa fa-search cur ml10" @click="selectSystemVars('whereStr')">选择系统变量</i>
                    <i class="fa fa-search cur ml10" @click="selectProcInstContextVar('whereStr')">选择流程变量</i>
                  </div>
                </el-descriptions-item>
                <el-descriptions-item>
                  <template slot="label">
                    <i class="el-icon-tickets"></i>
                    where执行时机
                  </template>
                  <div class="mb10">
                    1、任何时候都执行：
                    <el-switch v-model="optionItems.whereQuery.isAnytime" :inactive-value="0" :active-value="1" active-color="#13ce66" inactive-color="#DEDEDE" />
                    2、子流程中任何时候都执行：
                    <el-switch v-model="optionItems.whereQuery.isSubWorkflowAnytime" :inactive-value="0" :active-value="1" active-color="#13ce66" inactive-color="#DEDEDE" />
                    3、在指定节点执行（必须将“任何时候都执行”设置为“否”时才生效）
                  </div>
                  <el-input v-model="optionItems.whereQuery.excuteOnActName" :disabled="true" placeholder="请选择节点" />
                  <div class="mt5">
                    <span v-for="app in processAppList" @click="onSelectAppId(app)" :class="selectAppId==app.appId?'cube bg-red mr4 cur':'cube bg-blue mr4 cur'">【{{app.appId}}】{{app.appName}}</span>
                    <span class="fa fa-search cur mr4" @click="selectActivity('excuteOnActCode','excuteOnActName')">选择节点</span>
                    <span class="fa fa-minus-circle cur red" @click="cleanInputEmpty('excuteOnActCode','excuteOnActName')"> 清空</span>
                  </div>

                </el-descriptions-item>
              </el-descriptions>
            </el-tab-pane>

            <el-tab-pane label="子列表自定义按钮" name="buttons">

              <el-descriptions class="margin-top" title="子列表自定义按钮" :column="4" size="small" border>
                <el-descriptions-item>
                  <template slot="label">
                    <i class="el-icon-tool"></i>
                    操作列按钮
                  </template>
                  <input id="formSubTableCustButton" type="hidden" class="textBoxLong" name="formSubTableCustButton">
                  <a class="btn btn-sm btn-white btn-info btn-bold mr10" @click="customButtonSelect('formSubTableCustButton','min','自定义操作列按钮')"> <i class="ace-icon fa fa-pencil  bigger-120  " />操作列按钮</a>
                </el-descriptions-item>
                <el-descriptions-item>
                  <template slot="label">
                    <i class="el-icon-tool"></i>
                    工具栏按钮
                  </template>
                  <input id="formSubTableToolbarCustButton" type="hidden" class="textBoxLong" name="formSubTableToolbarCustButton">
                  <a class="btn btn-sm btn-white btn-info btn-bold" @click="customButtonSelect('formSubTableToolbarCustButton','min','工具栏按钮')"> <i class="ace-icon fa fa-pencil  bigger-120  " />工具栏按钮</a>
                </el-descriptions-item>

              </el-descriptions>
            </el-tab-pane>
          </el-tabs>
        </el-form-item>
        <div class="dialogfooter">
          <el-button v-if="formAction!='View'" size="small" type="primary" @click="submitForm(0)"><i class="fa fa-save" />保存
          </el-button>
          <el-button id="btn_cancel" size="small" @click="closeEdit"><i class="fa fa-minus-circle" />关闭
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
        formDefId: '',
        leveltype: '',
        parentId: '',
        formAction: null,
        isShowRuleOptions: false,
        resultData: [],
        treeData: [],
        //当表单被多个流程应用绑定时，点击选择时临时存到此属性中
        processAppList: [],
        selectAppId: '',
        optionItems: {
          general: {
            removeFooterRow: false,
            hideCheckbox: false,
            hideNumber: false,
            hideOperate: false,
            showFormat: "",
            addWay: 'default'
          },
          orderByStr: '',
          whereQuery: {
            whereStr: '',
            isAnytime: 1,
            isSubWorkflowAnytime: 1,
            excuteOnActCode: '',
            excuteOnActName: ''
          },
          // 操作列按钮
          formSubTableCustButton: [],
          // 工具栏按钮
          formSubTableToolbarCustButton: []

        },
        data: {
          // 额外
          categoryCode: null,
          formDefId: '',
          // 表
          refTitle: '',
          refTableId: '',
          // 业务对象
          busObjectTitle: '',
          parentId: '',
          isMain: 1,
          busObjectId: '',
          orderNo: 1,
          ruleOptions: '',
          tenantId: ''
        },
        formRules: {
          refTitle: [
            { required: true, validator: FUI.Validator.required }
          ],
          busObjectTitle: [
            { required: true, validator: FUI.Validator.required }
          ],
          orderNo: [
            { required: true, message: '必填项不能为空', trigger: 'blur' }
          ]
        }
      };
    },
    created: function () {
      var that = this;
      // main,sub
      var categoryCode = Object.toQueryString('categoryCode') || '';
      // formDefId
      var formDefId = Object.toQueryString('formDefId') || '';
      //表单应用的FormKey
      var formKey = Object.toQueryString('formKey') || '';
      var leveltype = Object.toQueryString('leveltype') || 'main';
      that.leveltype = leveltype;
      that.formDefId = formDefId;
      that.formKey = formKey;
      const currUser = that.$store.state.user.author;
      that.formAction = formAction;
      if (formAction == FUI.FormAction.Add) {
        if (that.leveltype && that.leveltype == 'sub') {
          // 子表情况
          var parentId = Object.toQueryString('parentId');
          that.parentId = parentId;
          that.data.parentId = parentId;
          that.data.isMain = 0;
          that.isShowRuleOptions = true;
        } else {
          // 主表情况
          that.data.isMain = 1;
          that.isShowRuleOptions = false;
        }

        that.data.tenantId = currUser.tenantId;
        that.data.createdTime = Object.toGetCurrentDateTimeString();
        that.data.creator = decodeURI(currUser.realName);
        that.data.categoryCode = categoryCode;
        that.data.formDefId = formDefId;
      } else if (formAction != FUI.FormAction.Add) {
        var res = Object.toAjaxJson(FUI.Handlers.SmartFormHandler, 'getFormBusObjectEditData', { busObjectId: keyId });
        if (res.success) {
          that.data = res.data;
          that.data.refTitle = res.data.busObjectTitle;
        }
        if (that.data.isMain != 1) {
          that.isShowRuleOptions = true;
          that.loadRuleOptions();
        }
      }
    },
    mounted() {
      window.myvm = this;

    },
    methods: {
      closeEdit() {
        FUI.Window.closeEdit();
      },
      // ===stand:标准化方法结束============
      submitForm() {
        var that = this;
        var success = that.validateForm('formRef');
        if (!success) return;
        var success = that.saveAndClose();
        if (success == true) {
          // 保存表定义、业务对象定义、业务对象及表单关系
          FUI.Form.submitForm(that, that.data, FUI.Handlers.SmartFormHandler, 'saveFormBusObject', formAction, keyId, 'grid', mainTable);
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
      toPinYin(sourceField, targetField) {
        if (!this.data[targetField]) {
          const source = this.data[sourceField];
          this.data[targetField] = Object.toPinYin(source);
        }
      },
      selectSystemVars(inputId) {
        WF.SelectorDialog.selectSystemVars(this, inputId, null, true, null, this.optionItems.whereQuery);
      },
      selectProcInstContextVar(inputId) {
        var that = this;
        var formKey = that.formKey;
        var appId = "";
        var wid = "";
        WF.SelectorDialog.selectProcInstContextVar(that, "WfContextVars", wid, appId, formKey, inputId, true, that.optionItems.whereQuery);
      },

      tableDefinition() {
        var that = this;
        var tableTitle = that.data.refTitle;
        var tableId = that.data.refTableId;
        var url = '/workflow/smartForm/tableColumnList/?&tableId=' + tableId;
        FUI.Window.openEdit(url, '数据表【' + tableTitle + '】', FUI.FormAction.Edit, null, 880, 450, null, null, null, true);
      },
      tableSelector(inputKey, inputName) {
        var that = this;
        var parm = that.data[inputKey] == '' ? { singleSelect: true, data: [] } : {
          singleSelect: true,
          data: [{
            'refTableId': that.data[inputKey],
            'refTitle': that.data[inputName]
          }]
        };
        FUI.dialog(__webpath + '/workflow/selector/formDefTableRelSelect?formDefId=' + that.formDefId, '选择关联表定义', parm, 900, 560, function (objectData, index, layer) {
          if (objectData.length > 0) {
            that.data[inputKey] = objectData[0].TableId;
            that.data[inputName] = objectData[0].TableTitle;
            that.data.busObjectTitle = objectData[0].TableTitle;
          } else {
            that.data[inputKey] = '';
            that.data[inputName] = '';
            that.data.busObjectTitle = '';
          }
          layer.close(index);
        }, true);
      },
      loadRuleOptions() {
        var that = this;
        var ruleOptions = that.data.ruleOptions;
        if (ruleOptions != null && ruleOptions != '') {
          that.resultData = Object.toStringToJson(ruleOptions);
        }
        console.info(that.resultData);
        $.each(that.resultData, function (i, jsonObj) {
          if (jsonObj.ruleType == 'orderBy') {
            that.initailOrderByResult(jsonObj);
          } else if (jsonObj.ruleType == 'whereQuery') {
            that.initailWhereQueryResult(jsonObj);
          } else if (jsonObj.ruleType == 'formSubTableCustButton') {
            that.initailOperationCustomButtonResult(jsonObj);
          } else if (jsonObj.ruleType == 'formSubTableToolbarCustButton') {
            that.initailToolbarCustomButtonResult(jsonObj);
          } else if (jsonObj.ruleType == 'busObjectGeneral') {
            that.initailGeneralResult(jsonObj);
          }
        });
      },
      saveAndClose() {
        var that = this;
        try {
          var data = [];
          var orderByObject = that.getOrderByResult();
          data.push(orderByObject);

          var whereQueryObject = that.getWhereQueryResult();
          data.push(whereQueryObject);

          var operationCustomButtonObject = that.getOperationCustomButtonResult();
          data.push(operationCustomButtonObject);

          var toolbarCustomButtonObject = that.getToobarCustomButtonResult();
          data.push(toolbarCustomButtonObject);

          var generalObject = that.getGeneralResult();
          data.push(generalObject);

          var resultStr = JSON.stringify(data);
          if (resultStr == '[]') {
            that.data.ruleOptions = '';
          } else {
            that.data.ruleOptions = resultStr;
          }
          return true;
        } catch (err) {
          FUI.Window.showMsg(that, err);
          return false;
        }
      },

      // =============== 常规的key value设置====================//
      initailGeneralResult(jsonObj) {
        var that = this;
        var kvData = jsonObj.ruleParams.kvData || [];
        var kvObj = {};
        $.each(kvData, function (i, item) {
          kvObj[item.key] = item.value;
        });
        var removeFooterRow = kvObj.removeFooterRow;
        if (removeFooterRow == undefined) {
          removeFooterRow = false;
        }
        var hideNumber = kvObj.hideNumber;
        if (hideNumber == undefined) {
          hideNumber = false;
        }
        var hideOperate = kvObj.hideOperate;
        if (hideOperate == undefined) {
          hideOperate = false;
        }
        var showFormat = kvObj.showFormat;
        if (showFormat == undefined) {
          showFormat = "";
        }
        var hideCheckbox = kvObj.hideCheckbox;
        if (hideCheckbox == undefined) {
          hideCheckbox = false;
        }

        var addWay = kvObj.addWay || 'default';

        that.optionItems.general.removeFooterRow = removeFooterRow;
        that.optionItems.general.hideNumber = hideNumber;
        that.optionItems.general.hideOperate = hideOperate;
        that.optionItems.general.showFormat = showFormat;
        that.optionItems.general.hideCheckbox = hideCheckbox;
        that.optionItems.general.addWay = addWay;
      },
      getGeneralResult() {
        var that = this;
        var removeFooterRow = that.optionItems.general.removeFooterRow;
        var hideCheckbox = that.optionItems.general.hideCheckbox;
        var hideNumber = that.optionItems.general.hideNumber;
        var hideOperate = that.optionItems.general.hideOperate;
        var showFormat = that.optionItems.general.showFormat;
        var addWay = that.optionItems.general.addWay;
        var kvData = [];
        kvData.push({
          'key': 'removeFooterRow',
          'value': removeFooterRow
        });
        kvData.push({
          'key': 'hideCheckbox',
          'value': hideCheckbox
        });
        kvData.push({
          'key': 'hideNumber',
          'value': hideNumber
        });
        kvData.push({
          'key': 'hideOperate',
          'value': hideOperate
        });
        kvData.push({
          'key': 'showFormat',
          'value': showFormat
        });
        kvData.push({
          'key': 'addWay',
          'value': addWay
        });
        var paramsObj = {
          'kvData': kvData
        };
        var itemJson = {
          ruleTitle: '业务对象键值对常规设置',
          ruleType: 'busObjectGeneral',
          ruleCode: 'busObjectGeneral',
          whenExcute: '',
          ruleParams: paramsObj
        };
        return itemJson;
      },
      // =============== formSubTableCustButton====================//
      initailOperationCustomButtonResult(jsonObj) {
        var that = this;
        that.optionItems.formSubTableCustButton = jsonObj.ruleParams;
      },
      getOperationCustomButtonResult() {
        var that = this;
        var json = that.optionItems.formSubTableCustButton;
        var itemJson = {
          ruleTitle: '操作列自定义按钮',
          ruleType: 'formSubTableCustButton',
          ruleCode: 'formSubTableCustButton',
          whenExcute: '',
          ruleParams: json
        };
        return itemJson;
      },
      // =============== formSubTableToolbarCustButton====================//
      initailToolbarCustomButtonResult(jsonObj) {
        var that = this;
        that.optionItems.formSubTableToolbarCustButton = jsonObj.ruleParams;
      },
      getToobarCustomButtonResult() {
        var that = this;
        var json = that.optionItems.formSubTableToolbarCustButton;
        var itemJson = {
          ruleTitle: '工具栏自定义按钮',
          ruleType: 'formSubTableToolbarCustButton',
          ruleCode: 'formSubTableToolbarCustButton',
          whenExcute: '',
          //按钮数据
          ruleParams: json
        };
        return itemJson;
      },
      // =============== orderByStr====================//
      initailOrderByResult(jsonObj) {
        var that = this;
        that.optionItems.orderByStr = jsonObj.ruleParams;
      },
      getOrderByResult() {
        var that = this;
        var str = that.optionItems.orderByStr;
        var itemJson = {
          ruleTitle: '排序',
          ruleType: 'orderBy',
          ruleCode: 'orderBy',
          whenExcute: '',
          ruleParams: str
        };
        return itemJson;
      },
      // =============== whereQuery====================//
      initailWhereQueryResult(jsonObj) {
        var that = this;
        that.optionItems.whereQuery.whereStr = jsonObj.ruleParams;
        var whenExcuteJson = jsonObj.whenExcute;
        that.optionItems.whereQuery.isAnytime = whenExcuteJson.isAnytime;
        that.optionItems.whereQuery.isSubWorkflowAnytime = whenExcuteJson.isSubWorkflowAnytime;
        that.optionItems.whereQuery.excuteOnActCode = whenExcuteJson.excuteOnActCode;
        that.optionItems.whereQuery.excuteOnActName = whenExcuteJson.excuteOnActName;
      },
      getWhereQueryResult() {
        var that = this;
        var str = that.optionItems.whereQuery.whereStr;
        var excuteOnActCode = that.optionItems.whereQuery.excuteOnActCode;
        var excuteOnActName = that.optionItems.whereQuery.excuteOnActName;
        var isAnytime = that.optionItems.whereQuery.isAnytime;
        var isSubWorkflowAnytime = that.optionItems.whereQuery.isSubWorkflowAnytime;
        if (isAnytime == undefined || isAnytime == null) {
          isAnytime = 1;
        }
        if (isSubWorkflowAnytime == undefined || isSubWorkflowAnytime == null) {
          isSubWorkflowAnytime = 1;
        }
        isSubWorkflowAnytime;
        var itemJson = {
          ruleTitle: '条件过滤',
          ruleType: 'whereQuery',
          ruleCode: 'whereQuery',
          whenExcute: {
            'isAnytime': isAnytime,
            'isSubWorkflowAnytime': isSubWorkflowAnytime,
            'excuteOnActCode': excuteOnActCode,
            'excuteOnActName': excuteOnActName
          },
          ruleParams: str
        };
        return itemJson;
      },
      onSelectAppId(app) {
        var that = this;
        that.selectAppId = app.appId;
      }
      , selectActivity(inputId, inputText) {
        var that = this;
        var appId = "";
        if (that.selectAppId != "") {
          appId = that.selectAppId;
          WF.SelectorDialog.selectorTextValue(that, inputId, inputText, 'HistoryActivity', { appId: appId }, false, true, that.optionItems.whereQuery);
          return;
        }
        if (that.selectAppId == "" && that.processAppList.length > 0) {
          FUI.Window.showMsg("由于本表单被多个流程绑定，请先点击选择对应流程，然后再点击“选择节点”");
          return false;
        }
        //通过formDefId换回appId
        var res = Object.toAjaxJson(FUI.Handlers.SmartFormHandler, "getProcessAppListByFormKey", { formKey: that.formKey });
        if (res.success) {
          var appIdArr = [];
          if (res.data.length > 1) {
            //表单被多个流程应用绑定
            that.processAppList = res.data;
            return;
          } else {
            appId = res.data[0].appId;
            that.selectAppId = appId;
          }
          WF.SelectorDialog.selectorTextValue(that, inputId, inputText, 'HistoryActivity', { appId: appId }, false, true, that.optionItems.whereQuery);
        }

      },
      cleanInputEmpty(inputId, inputText) {
        var that = this;
        that.optionItems.whereQuery[inputId] = "";
        that.optionItems.whereQuery[inputText] = "";
      }
      , selectBoColumn(inputId, ObjName) {
        var that = this;
        if (formAction == FUI.FormAction.Add) {
          FUI.Window.showMsg(that, '新增状态时不可选择，请先保存后再次进入编辑页面时方可选择。');
          return false;
        }
        var currentBoId = keyId;
        FUI.dialog(__webpath + '/workflow/smartForm/busObjectColumnSelect/?busObjectId=' + currentBoId, '选择业务对象字段', null, 800, 450, function (objectData, index, layer) {
          var resultStr = objectData.columnName || '';
          if (ObjName == 'optionItems.whereQuery') {
            var oleValue = that.optionItems.whereQuery[inputId];
            that.optionItems.whereQuery[inputId] = oleValue + ' ' + resultStr;
          }
          else if (ObjName == 'optionItems.orderByStr') {
            var oleValue = that.optionItems[inputId];
            that.optionItems[inputId] = oleValue + ' ' + resultStr;
          }
          layer.close(index);
        }, true);
      },
      customButtonSelect(inputId, type, title) {
        var that = this;
        WF.SelectorDialog.customButtonSelect(that, inputId, type, title, that.optionItems, that.formDefId);
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