<template>
  <div class="p15">
    <div class="f2bpm-online-subtable-title" style="text-align: right;">
      <label class="online-form-label online-label-subtable" v-show="field.showLabel" style="float: left;">
        <span class="label-title" v-html="field.label"></span>{{field.labelSuffix}}
      </label>
      &nbsp; &nbsp;
      <div style="text-align: right; display: inline-block;  ">
        <a role="button" v-if="buttonIsHaveWritePower(props.tableName+'.default_addRow')&&!isView"
           :field="props.tableName+'.addRow'" actionname="subAddButton" class="btn btn-primary btn-sm mr5"
           @click="addRow"><span class="fa fa-plus"></span>{{$t('onlineFormSubtable.add')}}</a>
        <a role="button" v-if="buttonIsHaveWritePower(props.tableName+'.default_deleteRow')&&!isView"
           :field="props.tableName+'.deleteRow'" actionname="subAddButton" class="btn btn-primary btn-sm mr5"
           @click="delBathRow"><span class="fa fa-trash-o"></span>{{$t('onlineFormSubtable.delete')}}</a>

        <!-- 解决v-for和v-if同时使用的问题 -->
        <template v-for="(btn,bIndex) in toolbar">
            <a role="button" v-if="buttonIsHaveWritePower(props.tableName+'.toolbar_'+btn.buttonName)"
              :key="bIndex"
              :field="props.tableName+'.'+btn.buttonName"
              :class="'btn btn-'+ btn.btnColor+'  btn-sm mr5'"
              :actionname="props.tableName+'.'+btn.buttonName"
              :maintablename="props.mainTableName"
              @click="toolbarCustBtnOnClick(btn,props.tableName,rows)"><i
              :class="btn.faClass.indexOf('fa-')>-1?'fa '+btn.faClass:'icon '+btn.faClass"></i>{{btn.buttonTitle}}
            </a>
        </template>
      </div>
    </div>
    <div class="f2bpm-online-subtable-divcontainer" :style="field.style">
      <table :key="subtableKey" class="f2bpm-datatable f2bpm-online-subtable" :tablename="props.tableName"
             cellpadding="0" cellspacing="0">
        <tr class="head">
          <th class="subtable-number-cell" v-if="!props.hideNumber">{{$t('onlineFormSubtable.seqNum')}}</th>
          <th class="subtable-checkbox-cell" v-if="!props.hideCheckbox">
            <el-checkbox v-model="isCheckAll" @change="checkAll"></el-checkbox>
          </th>
          <!-- 解决v-for和v-if同时使用的问题 -->
          <template v-for="(col,colno) in colunms">
            <th :class="col.vModel.replace(/\./g,'_')+'_th'" v-if="isHaveShowPower(col)" :key="colno" v-show="col.ctrType!='hidden'&&col._isShowPower">
              <em v-if="col._isRequired" class="red mr2">*</em>{{col.label}}
            </th>
          </template>

          <th v-show="!props.hideOperate" :class="props.tableName+'_operate_th'">{{$t('onlineFormSubtable.operate')}}
          </th>
        </tr>
        <tr :key="onlineformKey+r.tempid" v-for="(r,rowno) in tempRows" :myid="r[primaryKey]" :tempid="r.tempid">
          <td class="subtable-number-cell" v-if="!props.hideNumber">{{rowno+1}}</td>
          <td class="subtable-checkbox-cell" v-if="!props.hideCheckbox">
            <el-checkbox v-model="checkList" @change="checkBox" :label="r.tempid" class="checkbox" :myid="r[primaryKey]"></el-checkbox>
          </td>
          <!-- 解决v-for和v-if同时使用的问题 -->
          <template v-for="(col,colindex) in colunms">
            <td :key="colindex" v-if="isHaveShowPower(col)"
              :class="col.vModel.replace(/\./g,'_')+'_td'" v-show="col.ctrType!='hidden'&&col._isShowPower">
               <f2bpm-onlineformitem
                :parentdata="r"
                :rowindex="rowno"
                :colindex="colindex"
                :field="col"
                :fieldvalue="r[col.vModel]" 
                @updatevalue="updateFieldValue"
                @appendfieldvalue="appendFieldValue">
              </f2bpm-onlineformitem>
            </td>
          </template>

          <td v-show="!props.hideOperate" :class="props.tableName+'_operate_td'">
            <i class="fa fa-times cur" actionname="deleteRow" :maintablename="props.mainTableName"
               v-if="buttonIsHaveWritePower(props.tableName+'.default_deleteRow')&&!isView"
               :field="props.tableName+'.deleteRow'" @click="delRow(r.tempid)">删除</i>
               <!-- 解决v-for和v-if同时使用的问题 -->
               <template v-for="(btn,index) in operation">
                <i
                  :key="index"
                  :class="btn.faClass&&btn.faClass.indexOf('icon')>-1?'cur ml4 icon '+btn.faClass: 'cur ml4 fa '+btn.faClass"
                  v-if="buttonIsHaveWritePower(props.tableName+'.operation_'+btn.buttonName)"
                  :actionname="props.tableName+'.'+btn.buttonName" :maintablename="props.mainTableName"
                  :field="props.tableName+'.'+btn.buttonName"
                  @click="operationCustBtnOnClick(btn,props.tableName,r)">{{btn.buttonTitle}}
                </i>
               </template>
          </td>
        </tr>
        <tr :key="footerKey" class="foot" v-if="!props.removeFooterRow">
          <td class="subtable-number-cell" v-if="!props.hideNumber"></td>
          <td class="subtable-checkbox-cell" v-if="!props.hideCheckbox"></td>
          <!-- 解决v-for和v-if同时使用的问题 -->
          <template v-for="(col,colno) in colunms">
            <td v-if="isHaveShowPower(col)" v-show="col.ctrType!='hidden'" :key="colno">
              <span v-if="colno==0">合计：</span>
              <span v-else-if="colno!=0&&col.isColumnCount" v-html="getFormatterValue(columnCountData[col.vModel],props.showFormat)"> </span>
            </td>
          </template>

          <td v-show="!props.hideOperate" :class="props.tableName+'_operate_td'"></td>
        </tr>
      </table>
      <div class="block" style="padding: 5px">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[20,50,100]"
          :page-size="currentSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="rows.length">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import TemplateEdit from '../../opinion/templateEdit.vue';
  export default {
    name: 'f2bpmSubtable',
    components: {TemplateEdit},
    // fieldvalue:它是data的子表数据，它是数组
    props: ['field', 'fieldvalue'],
    data: function () {
      return {
        language: "",
        resultPower: {hidden: false, read: false, write: true, required: false},
        onlineformKey: '101',
        primaryKey: '',
        subtableKey: '201',
        footerKey: '301',
        // 还有更多的属性
        props: {
          mainTableName: '',
          tableName: '',
          preFix: '',
          hideOperate: false,
          hideCheckbox: false,
          hideNumber: false,
          addWay: 'default'
        },
        toolbar: [],
        operation: [],
        colunms: [],
        isView: false,

        isCheckAll: false,
        checkList: [],
        // 所有行数据
        rows: [],
        //当前也数据
        tempRows: [],
        // 列合计结果数据
        columnCountData: {},
        currentPage: 1,
        currentSize: 20,
        total: null,
        bthState: ''
      };
    }, computed: {
      langTitle() {
        return function (item) {
          var enTitle = item.alias || item.fieldAlias;
          if (enTitle == "" || enTitle == null) {
            enTitle = item.label;
          }
          var zhTitle = item.label;
          return this.language == 'en-US' ? enTitle : zhTitle;
        };
      },
      btnLangTitle() {
        return function (item) {
          var enTitle = item.buttonAlias;
          if (enTitle == "" || enTitle == null) {
            enTitle = item.buttonTitle;
          }
          var zhTitle = item.buttonTitle;
          return this.language == 'en-US' ? enTitle : zhTitle;
        };
      },
      getFormatterValue() {
        return function (value, showFormat) {
          if (showFormat == 'qianfenwei') {
            return Object.toQianfenWeiStr(value);
            // return this.getTotalValue(this.fieldvalue);
          } else if (showFormat == 'daxiejine') {
            return Object.toChinaNum(value);
          } else if (showFormat == 'percent') {
            if (value == undefined || value == 0 || value == "") {
              return "";
            }
            let num = (parseFloat(that.value) * 1000 / 10);
            if ((num + "").indexOf(".") > -1) {
              //保留两位小数
              num = Object.toDecimal(num, 2);
            }
            return num + '%';
          } else {
            return value;
          }
        };
      }
      , isHaveShowPower() {
        return function (field) {
          var result = FUI.F2Grid.isHaveShowPower(field.vModel);
          return result;
        };
      },
      buttonIsHaveWritePower() {
        return function (fieldName) {
          var result = FUI.F2Grid.isHaveWritePower(fieldName);
          return result;
        };
      },
      isHaveShowPowerByFieldName() {
        return function (fieldName) {
          var result = FUI.F2Grid.isHaveShowPower(fieldName);
          return result;
        };
      }
    },
    watch: {
      rows: {
        handler(n, o) {
          var that = this;
          if (o != undefined && f2grid_global_mainVueLoadComplated) {
            that.columnMath(true, n);
          }
          that.tempRows = [];
          var rowData = JSON.stringify(n);
          var index = that.currentPage;
          that.total = n.length;
          if (o.length === 0) {
            index = 1;
          } else if (n.length > o.length) {
            index = Math.ceil(n.length / that.currentSize);
          } else if (n.length < o.length) {
            console.log(index, '页码')
            index = Math.ceil(n.length / that.currentSize) >= index ? index : Math.ceil(n.length / that.currentSize);
          } else if (n.length === o.length && (that.bthState === 'del' || that.bthState === 'add')) {
            index = Math.ceil(n.length / that.currentSize);
          }
          if (n.length !== o.length && index === that.currentPage) {
            var s = (index - 1) * that.currentSize;
            var e = s + that.currentSize;
            // that.tempRows = n.slice(s, e);
            that.bthState = '';
            that.tempRows = JSON.parse(rowData).slice(s, e);
          } else {
            that.currentPage = index;
            var s = (that.currentPage - 1) * that.currentSize;
            var e = s + that.currentSize;
            // that.tempRows = n.slice(s, e);
            that.tempRows = JSON.parse(rowData).slice(s, e);
            that.bthState = '';
          }
          //计算合计 这里要获取所有数据
          if (o != undefined && f2grid_global_columnCountData) { 
             let allRows = JSON.parse(rowData);
             that.totalPrice(allRows);
          }
        },
        deep: true,
        // 立即的
        immediate: false
      },
      currentSize: {
        handler(n, o) {
          //console.log(this.rows.length,this.total,n,o);
          this.tempRows = [];
          var rowData = JSON.stringify(this.rows);
          var s = (this.currentPage - 1) * n;
          var e = s + n;
          // this.tempRows = this.rows.slice(s, e);
          this.tempRows = JSON.parse(rowData).slice(s, e);
        },
        // 立即的
        immediate: false
      },
      currentPage: {
        handler(n, o) {
          //console.log(this.rows.length,this.total,n,o);
          this.tempRows = [];
          
          var rowData = JSON.stringify(this.rows);
          var s = (n - 1) * this.currentSize;
          var e = s + this.currentSize;
          // this.tempRows = this.rows.slice(s, e);
          this.tempRows = JSON.parse(rowData).slice(s, e);

          //点击分页时重新计算合计金额
          let allRows = JSON.parse(rowData);
          this.totalPrice(allRows);
        },
        // 立即的
        immediate: false
      },
      tempRows: {
        handler(n, o) {
          //如果删除，则rows也要删除指定的数据
          //新增rows也要新增
          //修改
          var that = this;
          var a = JSON.stringify(n);
          var rowData = JSON.parse(a);
          if (n.length > 0) {
            var arr = that.rows;
            for (var i = 0; i < arr.length; i++) {
              for (var j = 0; j < rowData.length; j++) {
                if (rowData[j].tempid === arr[i].tempid) {
                  arr[i] = rowData[j];
                  // that.columnMath(true, that.rows);
                }
              }
            }
             that.totalPrice(that.rows);
          } else {
            that.currentPage = 1;
          }
        },
        deep: true,
        // 立即的
        immediate: false
      }
    },
    mounted() {
      var that = this;
      that.$nextTick(function () {
        that.columnMath(false, that.rows);
      });
      let subVm = that.props.tableName + "_vm";
      window[subVm] = that;
    },
    created: function () {
      // JavaScript中对象和数组是引用类型，指向同一个内存空间，如果 prop 是一个对象或数组
      // 在子组件内部改变它会影响父组件的状态,所以它data的变化会直接影响到父组件的data
      var that = this;
      window[that.field.vModel+"_vm"] = that;
      that.language = that.$store.state.app.language;
      that.props = that.field.props;
      that.toolbar = that.field.toolbar;
      that.operation = that.field.operation;
      that.colunms = that.field.columns;
      that.primaryKey = that.props.preFix + '.MyId';
      var isView = WFContext.WorkflowformAction > 2;
      that.isView = isView;
      that.loadRows(that.fieldvalue);
      that.resultPower = FUI.F2Grid.excuteFieldPowerByVueFormItem(that.field.vModel);
      that.handleCurrentChange(1)
    },
  methods: {
    //子表合计的重新计算(主要解决导入时的合计)
    totalPrice(arr) { 
      let that = this;
      let ctrArray = ['text','select','selector','customdialog','datetime'];
      arr.forEach(item => { 
        that.colunms.forEach(cItem => { 
          let field = cItem;
          // let fieldvalue = item[field.vModel];
           if (!f2grid_global_mainVueLoadComplated) {
            return false;
          }
          // 检查我的变化是否要触发行内公式计算
          // 只有 输入框、下拉框、选择器，自定义选择器，日期才会有公式计算，才需要去判断触发公式
          if (!ctrArray.includes(field.ctrType)) {
            return false;
          }
          var isCanMath = FUI.F2Grid.checkMyChangeIsNeedToExcuteMath(field.vModel);
          if (isCanMath) {
            // console.info("【执行公式】:" + that.field.fieldTitle)
            // 因为公式字段会被链条式的使用，所以需要触发所有公式进行计算
            FUI.F2Grid.excuteAllMath(field.vModel, item);
          }
        })
      })
      that.$nextTick(() => {
        that.columnMath(true, arr);
      });
    },
      loadRows(fieldvalue) {
        var that = this;
        that.rows = fieldvalue;
        if (that.rows && that.rows.length > 0) {
          var isCols=true;
          var needCountCols = that.colunms.filter(c => c.isColumnCount);
          if (needCountCols.length == 0) {
            isCols= false;
          }
          $.each(that.rows, function (index, row) {
            row.tempid = 'temp_' + Object.toGuid();
          });
        }
      },
      fieldMath(isMounted){
        var that = this;
          if(isMounted){
            $.each(that.rows, function (index, row) {
              $.each(that.colunms, function (itemIndex, colName) {
                FUI.F2Grid.excuteAllMath(colName.vModel, row);
              });
          });
        }
      },
    columnMath(isMounted, allRows) {
        isMounted = isMounted == undefined ? false : isMounted;
        var that = this;
        if (WFContext.isDesign == true || that.colunms.length == 0) {
          return false;
        }
        // 列合计
        var needCountCols = that.colunms.filter(c => c.isColumnCount);
        if (needCountCols.length == 0) {
          return false;
        }
        // 初始化为0
        $.each(needCountCols, function (index, c) {
          var name = c.vModel;
          that.columnCountData[name] = 0;
          f2grid_global_columnCountData[name] = 0;
        });
        if (allRows && allRows.length > 0) {
          // 遍历行进行合计
          $.each(allRows, function (index, r) {
            $.each(needCountCols, function (index, c) {
              var name = c.vModel;
              var value = r[name] || 0;
              // that.columnCountData[name]+=Number(value);
              f2grid_global_columnCountData[name] += Number(value);
              // f2grid_global_columnCountData[name] +=  (Number(value)).toFixed(2);
            });
          });
        }else{
          $.each(needCountCols, function (index, c) {
            var name = c.vModel;
            FUI.F2Grid.excuteAllMath(name, null);
          });
        }

        // 保留小数位
        $.each(needCountCols, function (index, c) {
          var name = c.vModel;
          var digitlen = 2;
          var countRule = c.countRule;
          if (countRule && countRule.digitlen != undefined) {
            digitlen = countRule.digitlen;
          }
          var result = (Number(f2grid_global_columnCountData[name])).toFixed(digitlen);
          // Object.toDecimal(num, 2); 四舍五入
          // var result = Object.toDecimal(Number(f2grid_global_columnCountData[name]), digitlen);
          f2grid_global_columnCountData[name] = result;
          that.columnCountData[name] = result;
        });

        $.each(needCountCols, function (index, c) {
          var name = c.vModel;
          // if (isMounted == false) {
          //   // 子表列统计变化时，需要触发所有与合计列小计有关的公式进行计算，比如主表总计字段
          //   FUI.F2Grid.excuteAllMath(name, null);
          // } else {
          //    that.footerKey = Object.toGuid();
          // }
          FUI.F2Grid.excuteAllMath(name, null);
          if (isMounted) { 
            that.footerKey = Object.toGuid();
          }
        });
      },
      checkBox() {
        console.info(this.checkList);
      },
      checkAll(val) {
        var that = this;
        this.isCheckAll = val;
        that.checkList = [];
        if (val == true) {
          $.each(that.rows, function (index, r) {
            that.checkList.push(r.tempid);
          });
        }
      },
      delBathRow() {
        if (WFContext.isDesign === true) {
          FUI.Window.showMsg2('当前为设计状态');
          return false;
        }
        var that = this;
        FUI.F2Grid.delBathRow(that);
      },
      delRow(tempid) {
        if (WFContext.isDesign === true) {
          FUI.Window.showMsg2('当前为设计状态');
          return false;
        }
        var that = this;
        FUI.F2Grid.delRow(that, tempid);
        that.bthState = 'del';
      },
      addRow() {
        if (WFContext.isDesign === true) {
          FUI.Window.showMsg2('当前为设计状态');
          return false;
        }
        var that = this;
        FUI.F2Grid.addRow(that);
        that.bthState = 'add';
      },
      toolbarCustBtnOnClick(btn, tableName, rows) {
        if (WFContext.isDesign === true) {
          FUI.Window.showMsg2('当前为设计状态');
          return false;
        }
        var that = this;
        var btnType = btn.buttonType;
        if (btnType == "customdialog") {
          that.onToolBarCustCustomDialogClick(btn.buttonOptions, "ToolBar");
          //调用自定义对话框
          //FUI.F2Grid.addRowData('CostPayItem', 'cost_pay', rowData);
        } else if (btnType == "excelImport") {
          //统一的导入界面
          that.importCommonExcel('subtable', that.props.mainTableName, tableName);
        } else if (btnType == "excelExport") {
          //统一的导出事件
          that.exportCommonExcel('subtable', that.props.mainTableName, tableName);

        } else {
          // 工具栏自定义按钮事件
          // btn:按钮本身
          // tableName：实体对象名
          // rows:子表所有行数据
          FUI.F2Grid.toolBarCustbtnOnClick(that, btn, tableName, rows);
        }
      },
      operationCustBtnOnClick(btn, tableName, row) {
        // 操作列自定义按钮事件
        var that = this;
        FUI.F2Grid.custbtnOnClick(that, btn, tableName, row);
      }
      //获取高级参数：[{'key':'A','value':'1','orderNum':1}]
      , getAdParms(inputCtrlOptionJson) {
        var that = this;
        var parms = "";
        var data = {};
        if (inputCtrlOptionJson.data && typeof inputCtrlOptionJson.data == "string") {
          data = eval("(" + inputCtrlOptionJson.data + ")");
          parms = data.parms || "";
        } else if (typeof inputCtrlOptionJson.data == "object") {
          parms = inputCtrlOptionJson.data.parms || "";
        }
        var parmsArr = parms || [];
        if (parmsArr && typeof parmsArr === 'string') {
          parmsArr = eval('(' + parmsArr + ')');
        }
        return parmsArr;
      }
      //获取表单字段参数[{key:"",value:""}];
      , getFormFieldParams(inputCtrlOptionJson) {
        var that = this;
        //携带表单字段做为变量参数（需要在自定义对话框的过滤条件中配置对应的变量表达式，字段名为变量名）
        var formFieldParams = "";
        var data = {};
        if (inputCtrlOptionJson.data && typeof inputCtrlOptionJson.data == "string") {
          data = eval("(" + inputCtrlOptionJson.data + ")");
          formFieldParams = data.formFieldParams || "";
        } else if (typeof inputCtrlOptionJson.data == "object") {
          formFieldParams = inputCtrlOptionJson.data.formFieldParams || "";
        }
        var arrs = [];
        if (formFieldParams) {
          arrs = eval('(' + formFieldParams + ')');
        }
        var varParams = [];
        $.each(arrs, function (i, kvItem) {
          let key = kvItem.key;
          let fieldName = kvItem.value;
          var isSub = fieldName.split(".").length >= 3;
          var value = isSub == false ? myvm.data[fieldName] : that.$parent.data[fieldName];
          varParams.push({"key": key, "value": value});
        });
        return varParams;
      }
      //获取全部配置参数返回格式：[{key:"",value:""}]
      , getArrParms(inputCtrlOptionJson) {
        var that = this;
        var allArr = [];
        var adParms = that.getAdParms(inputCtrlOptionJson);
        if (adParms && adParms.length > 0) {
          $.each(adParms, function (i, item) {
            allArr.push(item);
          });
        }
        var formFieldParms = that.getFormFieldParams(inputCtrlOptionJson);
        if (formFieldParms && formFieldParms.length > 0) {
          $.each(formFieldParms, function (i, item) {
            allArr.push(item);
          });
        }
        console.info(allArr);
        return allArr;
      }
      , onToolBarCustCustomDialogClick(inputCtrlOption, tableName, openType) {
        var that = this;
        if (inputCtrlOption) {
          var customJSON = inputCtrlOption.data;
          if (typeof customJSON == "string" && customJSON) {
            customJSON = eval("(" + customJSON + ")");
          }
          customJSON.backBindIsdetail = true;
          if (customJSON.isMulti == 'true') {
            customJSON.isMulti = true;
          }
          if (customJSON.isMulti == 'false') {
            customJSON.isMulti = false;
          }
          var varParams = that.getArrParms(inputCtrlOption);
          if (varParams.length > 0) {
            customJSON.varParams = varParams;
          }
          customJSON.formFieldParams = "";

          var customDialogName = customJSON.customDialog;
          var customDialog = eval(CustomDialog);
          customJSON.isSubTableAdd = true;
          customDialog(that, customJSON);
        }
        return false;
      },
      // 重新渲染指定的组件
      renderComponent(keyName) {
        var that = this;
        that.subtableKey = Object.toGetRandomNum(100, 2000);
      },
      updateParentSubData(actionType) {
        // 添加或删除时修改主Vue的子表数据结果
        var that = this;
        that.$emit('updatevalue', 'subtable.' + that.props.tableName, that.rows);
        if (actionType == 'delete' || actionType == 'add') {
          // 让子控件重新渲染
          //console.info('让子控件重新渲染');
          // that.onlineformKey = Object.toGetTimeRandomNum();
          that.subtableKey = Object.toGetTimeRandomNum();
        }
      },
      // field: 可以是字段名也可以是字段定义的对象
      updateFieldValue(field, newValue, vueDataName, subVueDataName) {
        // 因数是对象引用，所以不需要使用此方法
        // console.info("updateFieldValue")
        var that = this;
      },
      appendFieldValue(fieldName, newValue, vueDataName, subVueDataName) {
        // 因数是对象引用，所以不需要使用此方法
        var that = this;
      },
      importCommonExcel(type, mainTableName, tableName) {
        var that = this;
        if (WFContext.isDesign === true) {
          FUI.Window.showMsg2('当前为设计状态');
          return false;
        }
        
        //导入前置事件
        var extendFunName = tableName + "_importBeforeEvent";
        var isExist = Object.toIsExitsFunction(extendFunName);
        if (isExist) {
          var exfunc = eval(extendFunName);
          var isPass = exfunc(that, mainTableName, tableName, that.rows);
          if (isPass === false) {
            return false;
          }
        }
        var url = '/workflow/security/commonImport/commonExcelImport?type=' + type + '&tableName=' + tableName;
        FUI.dialog(url, "数据导入", null, 600, 400, function (objectData, index, layerObject) {
          if (objectData == undefined || objectData == null || objectData == false) {
            return false;
          }
          //console.log("判断是否是二维数组：", that.isMultiArr(objectData))
          //console.log("objectData===:",objectData);
          //tableName === 'InvoiceApplicationDetails'
          //如果是子表 并且 是开票申请的导入  如果不是二维数组， 给重新定义键(name)值(value)对数组
          //这里的导入是后台重新写的接口，然后返回的数据和之前系统配置的的数据不一样。所以需要重新定义二维数组键值对
          if (!that.isMultiArr(objectData) && type === 'subtable') { 
            let currArray = [];
            if (objectData.length > 0) { 
              objectData.forEach(el => { 
                let elArray = [];
                Object.keys(el).forEach(key => { 
                  elArray.push({
                    'name': key,
                    'value': el[key] || ''
                  })
                })
                currArray.push(elArray);
              })
              objectData = currArray;
            }
          }
          if (objectData.length > 0) {
            FUI.F2Grid.subAddNVRows(that, mainTableName, tableName, objectData);
            // console.info(objectData);
            //自定义 导入后置事件
            var extendFunName = tableName + "_importAfterEvent";
            var isExist = Object.toIsExitsFunction(extendFunName);
            if (isExist) {
              var exfunc = eval(extendFunName);
              var isPass = exfunc(objectData, mainTableName, tableName, that.rows);
              // if (isPass === false) {
              //   return false;
              // }
            }
            layerObject.close(index);
          }
        }, true, null, {sure: {iconClass: "", text: "确定导入"}});
    },
    //判断是否是二维数组
    isMultiArr(arr) {
      return arr.every((el) => Object.prototype.toString.call(el) === '[object Array]');

    },
      exportCommonExcel(type, mainTableName, tableName) {
        var that = this;
        // 获取主表id
        var parentId = that.$parent.data[mainTableName+'.MyId'];
        if (WFContext.isDesign === true) {
          FUI.Window.showMsg2('当前为设计状态');
          return false;
        }
        // if (that.checkList.length == 0) {
        //   FUI.Window.showMsg2("请选择要导出的记录");
        //   return false;
        // }
        var myids = [];
        //收集要导出MyId键值
        // $.each(that.checkList, function (index, checkId) {
        //   var checkRow = that.rows.find(a => a.tempid == checkId);
        //   if (checkRow != null && checkRow[that.primaryKey]) {
        //     var key = checkRow[that.primaryKey];
        //     myids.push(key);
        //   }
        // });
        // if (myids.length == 0) {
        //   //自定义 导出前前置事件
        //   var extendFunNames = tableName + "_exportLeadingEvent";
        //   var isExists = Object.toIsExitsFunction(extendFunNames);
        //   if (isExists) {
        //     var exfuncs = eval(extendFunNames);
        //     var isPasss = exfuncs(that, myids);
        //     if (isPasss === false) {
        //       return false;
        //     }
        //   }
        //   // FUI.Window.showMsg2("请选择要导出的记录（数据库存在的记录）");
        //    return false;
        // }
        //--------------------------------------自定义 导出前前置事件
        if (!parentId) {
          //自定义 导出前前置事件
          var extendFunNames = tableName + "_exportLeadingEvent";
          var isExists = Object.toIsExitsFunction(extendFunNames);
          if (isExists) {
            var exfuncs = eval(extendFunNames);
            var isPasss = exfuncs(that, parentId);
            if (isPasss === false) {
              return false;
            }
          }
        }
        //--------------------------------------导出前置事件
        var extendFunName = tableName + "_exportBeforeEvent";
        var isExist = Object.toIsExitsFunction(extendFunName);
        if (isExist) {
          var exfunc = eval(extendFunName);
          var isPass = exfunc(that, mainTableName, tableName, that.rows, parentId);
          if (isPass === false) {
            return false;
          }
        }
        var downUrl = "/workflow/security/CommonImport/exportData?type=subtable&tableName="+tableName;
        Object.toAjaxDownloadFile(downUrl, "", JSON.stringify({
          "selectedId": parentId
        }),true);
      }
      , listens() {

      },
      handleSizeChange(val) {
        var that = this;
        that.currentPage = 1;
        that.currentSize = val;
        console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        var that = this;
        that.currentPage = val;
        console.log(`当前页: ${val}`);
      }
    }
  }
</script>
