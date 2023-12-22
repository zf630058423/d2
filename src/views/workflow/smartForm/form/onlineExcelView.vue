<template>
  <div>
    <el-container>
      <el-header id="header" style="background: #2B3541; color: white; height: 45px;line-height: 45px;box-shadow: #BCC2CD ">
        <el-row>
          <el-col :span="4">
            <span class="brand"><i class="fa fa-print " style="margin-right: 3px;" />打印<span id="deviceTypeTitle" />【<span v-html="formProperty.formTitle" />】</span>
          </el-col>
          <el-col :span="20">
            <div id="normalModeToolbar">
              <el-button-group>
                <el-button v-if="previewType=='inpreview'" size="mini" type="default" icon="fa fa-print font14" @click="printPreview()">打印</el-button>
                <el-button :loading="exportLoading" size="mini" type="default" title="如果表格中遇到的图片无法导出，需要自己手动下载后插入到Excel中" v-if="isPrintPreview!=1" @click="exportCurrentDataToExcel()" icon="icon icon-daochu">导出EXCEL</el-button>
              </el-button-group>
            </div>
          </el-col>
        </el-row>
      </el-header>
      <el-container id="maincontainer">
        <el-main style="padding: 3px;">
          <div id="contentContainer" style="overflow: auto">
            <div id="drapDesignContainer" class="drapDesignContainer">
              <div id="onlineExcel" class="onlineExcel" style="margin:0 auto;" />
            </div>
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
  import ret from 'bluebird/js/release/util';


  window.excel = null;
  // 是否为预览
  window.isPrintPreview = Object.toQueryString('isPrintPreview') || 0;
  // =============实例打印时：formId与wfformId传任何一个都可以，优先使用formId==========
  // 打印模板自己的formId
  window.formId = Object.toQueryString('formId') || '';
  // 流程实例打印时,流程实例的表单应用ID
  window.wfformId = Object.toQueryString('wfformId') || '';
  // 流程实例ID
  window.wiid = Object.toQueryString('wiid') || '';
  window.onlineSheetName = 'onlineSheet';

  export default {
    data() {
      return {
        exportLoading: false,
        // ==========所引用的流程表单===========
        // 流程上下文
        wfContext: {},
        // 工流程表单字段定义
        fieldList: {},
        // 表单数据
        onLineFormData: [],
        // ====================================
        // Url参数
        wiid: '',
        deviceType: 'pc',
        formDefId: '',
        formId: '',

        isPrintPreview: 0,
        previewType: 'inpreview',
        formAction: null,
        isPropertyCollapsed: false,
        isCollapsed: false,
        // editHtml,editJs,designer
        currentEditType: 'designer',
        isShowEditHtml: true,
        // 右键相关
        currentRightData: null,
        currentRightParms: null,
        menuVisible: false,
        // 抽屉
        drawerTitle: '查看',
        drawerContent: '',
        drawer: false,
        direction: 'rtl',

        // 表单应用设计JSON
        pageViewData: {},
        htmlcontent: '',
        // 数据源
        data: {},
        //数组扁平化的页面组件字段定义
        pageFieldList: [],
        // 页面组件字段数据
        pageFieldData: {},
        jscript: '',
        optionsData: [],
        //打印图片设置
        printImgSet: {},
        //打印子表设置
        printSubTableSet: {},
        printArea: {},
        formProperty: {}

      };
    },
    computed: {
      rotatePropertyIcon() {
        return this.isPropertyCollapsed ? 'fa fa-angle-double-left' : 'fa fa-angle-double-right';
      },
      rotateIcon() {
        return this.isCollapsed ? 'icon icon-arrow-right-bold cur' : 'icon icon-arrow-left-bold cur';
      }
    },
    created: function () {
      var that = this;
      that.formId = formId;
      that.wiid = wiid;
      that.isPrintPreview = isPrintPreview;
      if (isPrintPreview == 1) {
        // 表格预览时
        var $parentVue = window.opener.window.myvm;
        that.pageFieldData = Object.toDeepClone($parentVue.pageFieldData);
        that.pageFieldList = Object.toDeepClone($parentVue.pageFieldList);
        that.htmlcontent = $parentVue.htmlcontent;
        that.wfContext = $parentVue.wfContext;
        WFContext = that.wfContext;
        $('title').html(that.formProperty.formTitle);
        // 预览时的属性实时从后台获取
        var res = Object.toAjaxJson(FUI.Handlers.SmartFormHandler, 'getFormOptionsData', { formId: formId });
        that.optionsData = res.data;
        var printImgSet = that.optionsData.find(r => r.ruleCode == 'printImgSet');
        that.printImgSet = printImgSet;
        var printSubTableSet = that.optionsData.find(r => r.ruleCode == 'printSubTableSet');
        that.printSubTableSet = printSubTableSet;
        var printArea = that.optionsData.find(r => r.ruleCode == 'printArea');
        that.printArea = printArea;

      } else {
        var parm = {};
        if (formId) {
          parm.formId = formId;
        } else if (wfformId) {
          parm.wfformId = wfformId;
        }
        var res = Object.toAjaxJson(FUI.Handlers.SmartFormHandler, 'getOnlineExcelViewJson', parm);
        if (!res.success) {
          FUI.Window.showMsg(res.msg);
          return false;
        }
        that.pageViewData = res.data;
        that.formProperty = that.pageViewData.formProperty;
        that.optionsData = that.formProperty.optionsData;
        var printImgSet = that.optionsData.find(r => r.ruleCode == 'printImgSet');
        that.printImgSet = printImgSet;
        var printSubTableSet = that.optionsData.find(r => r.ruleCode == 'printSubTableSet');
        that.printSubTableSet = printSubTableSet;
        var printArea = that.optionsData.find(r => r.ruleCode == 'printArea');
        that.printArea = printArea;
        $('title').html(that.formProperty.formTitle);
        if (that.pageViewData.htmlcontent) {
          that.htmlcontent = that.pageViewData.htmlcontent;
          that.jscript = that.pageViewData.jscript;
        } else {
          that.htmlcontent = '';
        }
        // 获取表单业务数据
        var $parentVue = window.opener.window.myvm;
        that.onLineFormData = $parentVue.onLineFormData;
        that.data = Object.toDeepClone($parentVue.data);
        that.fieldList = $parentVue.fieldList;
        that.pageFieldData = Object.toDeepClone($parentVue.pageFieldData);
        that.pageFieldList = Object.toDeepClone($parentVue.pageFieldList);
        that.wfContext = $parentVue.wfContext;
        WFContext = that.wfContext;
      }
    },
    mounted() {
      var that = this;
      window.myvm = that;
      that.initailExcel();
      that.previewOnlineForm('inpreview');
      that.loadExcelData();
      // 加载表单的动态脚本
      if (that.jscript) {
        try {
          const script = document.createElement('script');
          script.type = 'text/javascript';
          script.text = `
          console.info('========加载表单动态脚本==========');
            //========加载表单动态脚本==========
            ${that.jscript}
          `;
          document.getElementsByTagName('head')[0].appendChild(script);
        } catch (err) {
          console.info(err);
          FUI.Window.showMsg2('扩展脚本出错，请联系管理员');
        }
        if (Object.toIsExitsFunction('extend_fuiOnPageLoad')) {
          window.extend_fuiOnPageLoad();
        }
      }
      $('body').css('overflow', 'auto');
    },
    methods: {
      initailExcel() {
        var that = this;
        var browserType = Object.toGetBrowserType();
        if (browserType != 'Chrome') {
          FUI.Window.showMsg('检测到当前浏览器是IE较早前版本，建议使用“谷歌浏览器”获取最佳体验效果！');
        }
        var formName = that.formProperty.formTitle;
        excel = FUI.Excel.Create('onlineExcel');
        excel.excelName = '在线Excel';
        if (that.htmlcontent != '') {
          var sheet = FUI.Excel.getNewSheet({ sheetId: onlineSheetName, sheetName: formName, html: that.htmlcontent });
          //可在此设置宽度sheet.width
          excel.sheets.push(sheet);
        } else {
          var sheet = FUI.Excel.getNewSheet({ sheetId: onlineSheetName, sheetName: formName, html: '', rowNum: 31, colNum: 20 });
          excel.sheets.push(sheet);
        }
        excel.previewType = 'inpreview';
        excel.bind();
        that.setExcelWidth(excel);

      },
      setExcelWidth(excel) {
        var that = this;
        if (excel && that.printArea && that.printArea.ruleParams && that.printArea.ruleParams.excelWidth && that.printArea.ruleParams.excelWidth > 200) {
          var excelWidth = that.printArea.ruleParams.excelWidth;
          $(".f2bpm-sheet-table").width(excelWidth + "px");
        } else {
          $(".f2bpm-sheet-table").width("");
        }
      }
      , getImgWidthHeightExpress(filedFullName) {
        var that = this;
        var width = "";
        var height = "";
        var whexpress = "";
        if (Object.toStartWith(filedFullName, "page.")) {
          var whset = that.pageFieldList.find(a => a.vModel == filedFullName);
          if (whset && whset.imgWidth) {
            whexpress = "width:" + whset.imgWidth + "px;";
          }
          if (whset && whset.imgHeight) {
            whexpress = "height:" + whset.imgHeight + "px;";
          }
          return whexpress;
        }
        var printImgSet = that.printImgSet;

        if (printImgSet && printImgSet.ruleParams.length > 0) {
          var whset = printImgSet.ruleParams.find(a => a.fieldName == filedFullName);
          if (whset && whset.width) {
            whexpress = "width:" + whset.width + "px;";
          }
          if (whset && whset.height) {
            whexpress = "height:" + whset.height + "px;";
          }
        }
        return whexpress;
      }
      , getSubtableIsAutoRowCreated(tableName) {
        var that = this;
        var printSubTableSet = that.printSubTableSet;
        var isRowCreatedAuto = true;
        if (printSubTableSet && printSubTableSet.ruleParams.length > 0) {
          var item = printSubTableSet.ruleParams.find(a => a.tableName == tableName);
          if (item && item.autoCreated != undefined) {
            isRowCreatedAuto = item.autoCreated;
          }
        }
        return isRowCreatedAuto;
      }
      //rowNo从1开始
      , getObjectValue(val, filedFullName, fieldDef, rowNo) {
        var that = this;
        var openerDoc = window.opener.document;
        var ctrType = fieldDef ? fieldDef.ctrType : "";
        if (ctrType != 'qrcode' && (val == '' || val == undefined || val == null)) {
          return "";
        }
        var arr = filedFullName.split(".");
        var isSubTable = arr.length >= 3;
        var mainTableName = arr[0];
        var subTableName = arr[1];
        var generalobj = {};
        if (fieldDef && fieldDef.fieldOptions) {
          var fieldOptions = eval("(" + fieldDef.fieldOptions + ")");
          var general = fieldOptions.find(a => a.opttype == 'general');
          if (general) {
            var kvData = general.params.kvData;
            $.each(kvData, function (index, item) {
              generalobj[item.key] = item.value;
            });
          }
        }
        if (ctrType == "datetime" && fieldDef.format != "" && val) {
          if (fieldDef.format == 'daterange' || fieldDef.format == 'datetimerange' || fieldDef.format == 'monthrange') {
            val = eval("(" + val + ")").toString().replaceAll(",", "至");
          } else if (fieldDef.format == 'dates') {
            val = eval("(" + val + ")").toString();
          } else if (fieldDef.format == 'date') {
            val = Object.toDateFormatDate(val, "yyyy-MM-dd");
          } else {
            val = Object.toDateFormatDate(val, fieldDef.format);
          }

        }
        else if ((ctrType == 'file' || ctrType == 'extend_file') && val && typeof val == "string") {
          //附件只显示名称
          var result = "";
          var fileArr = eval("(" + val + ")");
          $.each(fileArr, function (i, item) {
            if (i != 0) {
              result += "<br>";
            }
            result += item.fileName;

          });
          val = result;
        }
        else if ((ctrType == 'stamp' || ctrType == 'picture' || ctrType == 'extend_picture') && typeof val == "string" && val && val.indexOf("\{\"fileName\":") > -1 && val.indexOf("\"groupName\":") > -1 && val.indexOf("\"filePathName\":") > -1) {
          //判断是否为图片
          var imgArr = eval("(" + val + ")");
          var imgsHtml = "";
          var isImg = false;
          $.each(imgArr, function (i, item) {
            if (Object.toIsImageFileName(item.fileName)) {
              isImg = true;
              //需要显示图片字段
              var pathType = "";
              if (ctrType == "stamp") {
                pathType = "seal";
              }
              var src = __serverpath + FUI.Handlers.Common + 'getShowImage/?pathType=' + pathType + '&groupName=' + item.groupName + '&filePath=' + item.filePathName;
              var whexpress = that.getImgWidthHeightExpress(filedFullName);
              var img = "<img  id='img_" + Object.toGuid(false) + "'  src='" + src + "'  style='" + whexpress + "' />";
              imgsHtml = imgsHtml + img;
            }
          });
          if (isImg) {
            val = imgsHtml;
          }

        }
        else if (typeof val === 'object') {
          val = JSON.stringify(val);
        }
        else if (typeof val == "string" && Object.toStartWith(val, "bpm_handsign_")) {
          //手写签名
          var signId = val;
          var res = Object.toAjaxJson('/workflow/public/', 'getHandSignData', {
            'signId': val
          });
          if (res.success == true) {
            var signimgData = res.data.imgData;
            var whexpress = that.getImgWidthHeightExpress(filedFullName);
            if (!whexpress) {
              whexpress = "width:250px";
            }
            var img = "<img id='img_" + signId + "' signId='" + signId + "' style='" + whexpress + "' src='" + signimgData + "'   /><div>签名时间：" + res.data.createdTime + "</div>";
            val = img;
          }
        }
        else if (ctrType == 'qrcode') {
          //二维码或条形码
          var dom = null;
          if (isSubTable) {
            var table = $("table[tablename='" + subTableName + "']", openerDoc);
            var tr = table.children("tr:eq(" + rowNo + ")");
            dom = $("div[fieldname='" + filedFullName + "']", tr);
          } else {
            dom = $("div[fieldname='" + filedFullName + "']", openerDoc);
          }
          if (dom) {
            var fieldtextDom = $("div[fieldtext]", dom);
            var fieldtext = fieldtextDom.attr("fieldtext") || "";
            if (fieldtext) {
              let qrcodeData = fieldDef.inputCtrlOption ? eval("(" + fieldDef.inputCtrlOption + ")") : {};
              let width = fieldDef.width || 150;
              let whexpress = "width:" + width + "px";
              let linktype = qrcodeData.linktype;
              let qrtype = qrcodeData.qrtype;
              let res = Object.toAjaxJson('/workflow/selector/', 'getQRCodeData', {
                linkType: linktype,
                qrtype: qrtype,
                qrCodeUrl: fieldtext
              });
              if (res.success == true) {
                var imgData = res.data;
                var img = "<img  qrCodeUrl='" + fieldtext + "' linkType='" + linktype + "' qrtype='" + qrtype + "'  style='" + whexpress + "' src='" + imgData + "'   /> ";
                val = img;
              }
            }
          }
        }
        else if (ctrType == 'switch') {
          var checked = '';
          var isCheckBoxMode = generalobj.isCheckBoxMode;
          var checkBoxModeTitle = generalobj.checkBoxModeTitle || "";
          var isCustomActiveValue = generalobj.isCustomActiveValue;
          var activeValue = null;
          if (isCustomActiveValue) {
            activeValue = generalobj.activeValue;
          }
          if (activeValue != undefined && activeValue != "" && activeValue == val) {
            checked = 'checked';
          }
          else if (val == 1 || val === true || val == 'true' || val == '1') {
            checked = 'checked';
          }
          if (isCheckBoxMode) {
            val = checked == 'checked' ? FUI.Characters.checkedBox : FUI.Characters.checkBox;
            val += checkBoxModeTitle;
          } else {
            val = checked == 'checked' ? FUI.Characters.checkedBox : FUI.Characters.checkBox;
          }
        }
        else if (ctrType == 'radio') {
          var dom = null;
          if (isSubTable) {
            var table = $("table[tablename='" + subTableName + "']", openerDoc);
            var tr = table.children("tr:eq(" + rowNo + ")");
            dom = $("div[fieldname='" + filedFullName + "']", tr);
          } else {
            dom = $("div[fieldname='" + filedFullName + "']", openerDoc);
          }
          if (dom) {
            var fieldtextDom = $("div[fieldtext]", dom);
            var fieldtext = fieldtextDom.attr("fieldtext") || "";
            var fieldalltext = fieldtextDom.attr("fieldalltext") || "";
            if (fieldalltext) {
              var arrAllText = fieldalltext.split(',');
              var arrText = fieldtext.split(',');
              var result = "";
              $.each(arrAllText, function (i, text) {
                if ($.inArray(text, arrText) > -1) {
                  result = result + FUI.Characters.tick + text + "  ";
                } else {
                  result = result + FUI.Characters.otimes + text + "  ";
                }
              });
              val = result;
            }
          }
        }
        else if (ctrType == "checkbox") {
          var dom = null;
          if (isSubTable) {
            var table = $("table[tablename='" + subTableName + "']", openerDoc);
            var tr = table.children("tr:eq(" + rowNo + ")");
            dom = $("div[fieldname='" + filedFullName + "']", tr);
          } else {
            dom = $("div[fieldname='" + filedFullName + "']", openerDoc);
          }
          if (dom) {
            var fieldtextDom = $("div[fieldtext]", dom);
            var fieldtext = fieldtextDom.attr("fieldtext") || "";
            var fieldalltext = fieldtextDom.attr("fieldalltext") || "";
            if (fieldalltext) {
              var arrAllText = fieldalltext.split(',');
              var arrText = fieldtext.split(',');
              var result = "";
              $.each(arrAllText, function (i, text) {
                if ($.inArray(text, arrText) > -1) {
                  result = result + FUI.Characters.checkedBox + text + "  ";
                } else {
                  result = result + FUI.Characters.checkBox + text + "  ";
                }
              });
              val = result;
            }
          }
        }
        else if (ctrType == "select") {
          var dom = null;
          if (isSubTable) {
            var table = $("table[tablename='" + subTableName + "']", openerDoc);
            var tr = table.children("tr:eq(" + rowNo + ")");
            dom = $("div[fieldname='" + filedFullName + "']", tr);
          } else {
            dom = $("div[fieldname='" + filedFullName + "']", openerDoc);
          }
          if (dom) {
            var fieldtextDom = $("div[fieldtext]", dom);
            val = fieldtextDom.attr("fieldtext") || "";
          }
        }
        else if (ctrType == "droptree") {
          var dom = null;
          if (isSubTable) {
            var table = $("table[tablename='" + subTableName + "']", openerDoc);
            var tr = table.children("tr:eq(" + rowNo + ")");
            dom = $("div[fieldname='" + filedFullName + "']", tr);
          } else {
            dom = $("div[fieldname='" + filedFullName + "']", openerDoc);
          }
          if (dom) {
            var fieldtextDom = $("div[fieldtext]", dom);
            val = fieldtextDom.attr("fieldtext") || "";
          }
        } else if (ctrType == "text" || ctrType == "customdialog" || ctrType == "selector") {
          var len = fieldDef.fieldDecimalLen; // 设置的小数点位数
          if(len >0&&!isNaN(val)){
            var s_x= Object.tofixed(val,len);
            // val = Object.toDecimal(val, len);
            // var s_x = val.toString(); //将数字转换为字符串
            // var pos_decimal = s_x.indexOf('.'); //小数点的索引值
            // // 当整数时，pos_decimal=-1 自动补0
            // if (pos_decimal < 0) {
            //   pos_decimal = s_x.length;
            //   s_x += '.';
            // }
            // // 当数字的长度< 小数点索引+2时，补0
            // while (s_x.length <= pos_decimal + 2) {
            //   s_x += '0';
            // }
            val = s_x;
            }
          val = that.getFormatterValue(fieldDef, val);
        }

        return val;
      }
      , getFormatterValue(fieldDef, value) {
        var that = this;
        let showFormat = "";
        var ctrType = fieldDef ? fieldDef.ctrType : "";
        var len = fieldDef.fieldDecimalLen; // 设置的小数点位数
        if (fieldDef && fieldDef.fieldOptions) {
          var fieldOptions = typeof fieldDef.fieldOptions === 'string' ? eval('(' + fieldDef.fieldOptions + ')') : fieldDef.fieldOptions;
          var general = fieldOptions.find(a => a.opttype == 'general');
          if (general) {
            var kvData = general.params.kvData;
            var item = kvData.find(a => a.key == 'showFormat');
            if (item) {
              showFormat = item.value || "";
            }
          }
        }
        if (showFormat == "") {
          return value;
        }
        if (showFormat == 'qianfenwei') {
          return Object.toQianfenWeiStr(value);
        } else if (showFormat == 'daxiejine') {
          return Object.toChinaNum(value);
        } else if (showFormat == 'percent') {
          if (value == undefined || value == 0 || value == "") {
            return "";
          }
          let num = (parseFloat(value) * 1000 / 10);
          if ((num + "").indexOf(".") > -1) {
            //保留两位小数
            num = Object.toDecimal(num, 2);
          }
          return num + '%';
        }
      }
      , loadSubTable(subTable, tableDef, data, tds) {
        var that = this;
        // =====================翻译某一个子列表=====================
        //子表第一个字段被发现时复制出数据所需要的空行
        var isHavedAppendEmptyRows = false;
        var subTableAutoCreateRows = that.getSubtableIsAutoRowCreated(subTable);
        var firstSubFieldExpress = "";
        $.each(tableDef.columns, function (index, cobj) {
          var key = cobj.vModel;
          var index = key.lastIndexOf('.');
          var k = index > 0 ? key.substr(index + 1) : key;
          var ctrType = cobj.ctrType;
          var tdFieldExpress = '{' + key + '}';
          var fieldTdDom = null;
          var filedFullName = key;
          $.each(tds, function (i, td) {
            var innerHtml = $(td).html();
            innerHtml = Object.toTrim(innerHtml);
            if (innerHtml == tdFieldExpress) {
              fieldTdDom = td;
              if (isHavedAppendEmptyRows == false) {
                firstSubFieldExpress = tdFieldExpress;
              }
              return false;
            }
          });
          //找到所有子列表中的第一个字段位置
          if (fieldTdDom) {
            var tdPosition = excel.getTdPosition($(fieldTdDom));
            var rowNo = tdPosition.row;
            var colNo = tdPosition.col;
            var table = excel.getTableBySheetId(excel.sheets[0].sheetId);
            if (subTableAutoCreateRows && isHavedAppendEmptyRows == false) {
              //发现第一个明细行字段，复制插入创建数据所需的空行
              var currentRow = $(fieldTdDom).parent();
              var total = data.length - 1;
              for (var i = 0; i < total; i++) {
                var copyTr = currentRow.clone();
                currentRow.after(copyTr);
              }
              isHavedAppendEmptyRows = true;
            }
            if (data == null || data.length == 0) {
              //子表是空的
              excel.setTargetCellValue(table, { "row": rowNo, "col": colNo }, "");
            } else {
              $.each(data, function (index, row) {
                var val = row[k];
                val = that.getObjectValue(val, filedFullName, cobj, index + 1);
                excel.setTargetCellValue(table, { "row": rowNo, "col": colNo }, val);
                rowNo++;
              });
            }

          }
        });
        return firstSubFieldExpress;
      }
      , loadExcelData() {
        var that = this;
        var $sheet = $('#' + onlineSheetName);
        var sheetHtml = $sheet.html();
        var $table = $('.f2bpm-sheet-table', $sheet);
        var tds = $table.find('td:visible');
        // ===========翻译流程上下文==========
        var wfVars = {
          AppId: that.wfContext.AppId,
          SheetId: that.wfContext.SheetId,
          CurrentActivityName: that.wfContext.CurrentActivityName,
          ProcInstCreatorRealName: that.wfContext.ProcInstCreatorRealName,
          ProcInstCreatorOrgName: that.wfContext.ProcInstCreatorOrgName,
          WorkflowInstinceStateName: that.wfContext.WorkflowInstinceStateName,
          WorkflowName: that.wfContext.WorkflowName,
          WorkflowTitle: that.wfContext.WorkflowTitle,
          FinishedTime: that.wfContext.FinishedTime,
          StartedTime: that.wfContext.StartedTime,
          CurrentDate: Object.toGetCurrentDateString(),
          CurrentDateTime: Object.toGetCurrentDateTimeString()

        };
        $.each(wfVars, function (key, value) {
          var express = '{' + key + '}';
          $.each(tds, function (i, td) {
            var innerHtml = $(td).html();
            innerHtml = innerHtml.replaceAll(express, value);
            $(td).html(innerHtml);
          });
        });


        // ===========翻译模板中的业务数据==========
        //=====翻译页面组件数据====
        var thePageData = that.pageFieldData;
        $.each(thePageData, function (key, value) {
          var name = key;
          var val = typeof value == "object" ? JSON.stringify(value) : value;
          var filedFullName = name;
          var express = '{' + filedFullName + '}';
          var fieldDef = that.pageFieldList.find(c => c.vModel == filedFullName);
          fieldDef["fieldName"] = fieldDef.vModel;
          val = that.getObjectValue(val, filedFullName, fieldDef);
          $.each(tds, function (i, td) {
            var innerHtml = $(td).html();
            if (express == innerHtml) {
              $(td).html(val);
            } else {
              innerHtml = innerHtml.replaceAll(express, val);
              $(td).html(innerHtml);
            }
          });
        });
        //=====翻译主表数据====
        if (that.onLineFormData && that.onLineFormData.length == 0) {
          return false;
        }
        var busObjectData = that.onLineFormData[0];
        var mainTable = busObjectData.mainTable;
        var theData = busObjectData.data;
        $.each(theData, function (i, nv) {
          // 翻译主表
          var name = nv.name;
          var val = nv.value.toString();
          if (name == "shangChuanTuZhang") {
            var a = 1;
          }
          var filedFullName = mainTable + '.' + name;
          var express = '{' + filedFullName + '}';
          var fieldDef = that.fieldList.find(c => c.vModel == filedFullName);
          val = that.getObjectValue(val, filedFullName, fieldDef);
          $.each(tds, function (i, td) {
            var innerHtml = $(td).html();
            if (express == innerHtml) {
              $(td).html(val);
            } else {
              innerHtml = innerHtml.replaceAll(express, val);
              $(td).html(innerHtml);
            }
          });
        });
        // =====================翻译子列表=====================
        // =====================翻译子列表=====================
        //新的翻译子表方式
        var subTables = busObjectData.subTables;
        $.each(subTables, function (i, sub) {
          var subTable = sub.subTable;
          var subData = sub.data;
          console.info(subData);
          var subDataObj = that.data['subtable.' + subTable];
          var tableName = 'subtable.' + subTable;
          var tableDef = that.fieldList.find(c => c.type == 'subtable' && c.vModel == tableName);
          if (tableDef == undefined || tableDef == null) {
            return true;
          }
          var data = Object.toConvertArrToPropertyData(subData);
          var tableColumn = [];
          let n = 2;
          let firstSubFieldExpress = that.loadSubTable(subTable, tableDef, data, tds);
          console.info(firstSubFieldExpress);
          console.info(sheetHtml.indexOf(firstSubFieldExpress) > -1);
          //防止由于缺少翻译的所需数据导致无限循环,限制为最多10次相同的子列表
          let maxTimes = 10;
          while (maxTimes > 0 &&subData.length>0&&firstSubFieldExpress != "" && firstSubFieldExpress != undefined && sheetHtml.indexOf(firstSubFieldExpress) > -1) {
            maxTimes--;
            firstSubFieldExpress = that.loadSubTable(subTable, tableDef, data, tds);
          }
        });
        // =================系统列表占位构建=============================
        var approalTableHtml = "<table id='datatable_approalRecordList' ></table>";
        var commentTableHtml = "<table id='datatable_processinstCommentList' ></table>";
        var circulatedTableHtml = "<table id='datatable_circulatedRecordList' ></table>";

        var approal_express = '{ApproalRecordList}';
        var comment_express = '{ProcessinstCommentList}';
        var circulated_express = '{CirculatedRecordList}';
        $.each(tds, function (i, td) {
          var innerHtml = $(td).html();
          innerHtml = innerHtml.replaceAll(circulated_express, circulatedTableHtml).replaceAll(approal_express, approalTableHtml).replaceAll(comment_express, commentTableHtml);
          $(td).html(innerHtml);
        });
        sheetHtml = $sheet.html();
        // =========================翻译审批过程======================
        var approval_TableColumn = [
          {
            field: 'activityName',
            title: '处理节点'
          },
          {
            field: 'realName',
            title: '处理人'
          },
          {
            field: 'userDpName',
            title: '处理人部门'
          },
          {
            field: 'createdTime',
            title: '到达时间',
            formatter: function (value, rec, index) {
              if (value == '' || value == null) {
                return '';
              }
              return Object.toJsonDateTimeFormatter(value);
            }
          }, {
            field: 'completedTime',
            title: '完成时间',
            formatter: function (value, rec, index) {
              var value = rec.completedTime;
              if (value == '' || value == null) {
                return '';
              }
              return Object.toJsonDateTimeFormatter(value);
            }
          }, {
            field: 'taskState',
            title: '处理状态',
            width: 50,
            formatter: function (value, rec, index) {
              var text = taskStateFormatter(rec);
              return text;
            }
          },
          {
            field: 'opinion',
            title: '处理意见',
            formatter: function (value, rec, index) {
              var value = rec.opinion || "";
              if (value == null) { value = ''; }
              var result = '';
              switch (rec.completedType) {
                case 'Invalid':
                  result = '<em>【流程作废】</em>';
                  break;
                case 'Activation':
                  result = '<em>【流程重新激活】</em>';
                  break;
                case 'Reject':
                  result = '<em>【退回】</em>';
                  break;
                case 'Referred':
                  result = '<em>【转办】</em>';
                  break;
                case 'TaskCommunication':
                  result = '【沟通】';
                  break;
              }
              if (rec.approAction) {
                result += '【' + rec.approAction + '】';
              }
              return result + value;
            }
          }
        ];
        setTimeout(function () {
          if (sheetHtml.indexOf('datatable_approalRecordList') > -1) {
            // 加载列表数据
            var approvalDataTObj = FUI.DataTable.Create('datatable_approalRecordList');
            approvalDataTObj.Columns = approval_TableColumn;
            var parm = {};
            parm.wiid = that.wiid;
            parm.page = 1;
            parm.rows = 20000;
            parm.sort = 'createdTime asc,taskSeq';
            parm.order = 'asc';
            var res = Object.toAjaxJson(FUI.Handlers.WorkflowBusinessHandler, 'loadApprovalHistory', parm, false);
            if (res.success) {
              approvalDataTObj.Data = res.rows;
            } else {
              FUI.Window.showMsg(that, res.msg);
            }
            approvalDataTObj.Bind();
          }
        }, 200);
        // =========================翻译流程评论、流程传阅过程======================
        var commentColumns = [
          { field: 'message', title: '评论内容' },
          {
            field: 'creator', title: '评论者', width: 90
          },
          {
            field: 'createdTime', title: '评论时间', width: 100,
            formatter: function (value, rec, index) {
              return Object.toJsonDateTimeFormatter(value);
            }
          }
        ];
        var circulatedColumns = [
          { field: 'activityName', title: '传阅环节' }, { field: 'fromCreator', title: '传阅者' },
          {
            field: 'realName', title: '传阅到', width: 120, align: 'center',
            formatter: function (value, rec, index) {
              var depName = rec.userDpName == null ? '' : '(' + rec.userDpName + ')';
              return rec.realName + depName;
            }
          },
          {
            field: 'createdTime', title: '传阅时间', width: 150, formatter: function (value, rec, index) {
              if (value == '' || value == null) {
                return '';
              }
              return Object.toJsonDateTimeFormatter(value);
            }
          }, {
            field: 'completedTime', title: '审阅时间', width: 150,
            formatter: function (value, rec, index) {
              if (value == '' || value == null) {
                return '';
              }
              return Object.toJsonDateTimeFormatter(value);
            }
          }, {
            field: 'taskState', title: '处理状态', width: 150,
            formatter: function (value, rec, index) {
              var text = taskStateFormatter(rec);
              return text;
            }
          },
          {
            field: 'opinion', title: '传阅留言', align: 'center'
          }
        ];
        setTimeout(function () {
          if (sheetHtml.indexOf('datatable_circulatedRecordList') > -1) {
            // 加载传阅列表数据
            var circulatedDataTObj = FUI.DataTable.Create('datatable_circulatedRecordList');
            circulatedDataTObj.Columns = circulatedColumns;
            var parm = {};
            parm.wiid = that.wiid;
            parm.page = 1;
            parm.rows = 20000;
            parm.sort = 'createdTime';
            parm.order = 'asc';
            var res = Object.toAjaxJson(FUI.Handlers.WorkflowBusinessHandler, 'loadCirculatedHistory', parm, false);
            if (res.success) {
              circulatedDataTObj.Data = res.rows;
            } else {
              FUI.Window.showMsg(that, res.msg);
            }
            circulatedDataTObj.Bind();
          }

          if (sheetHtml.indexOf('datatable_processinstCommentList') > -1) {
            // 加载评论列表数据
            var commentDataTObj = FUI.DataTable.Create('datatable_processinstCommentList');
            commentDataTObj.Columns = commentColumns;
            var parm = {};
            parm.wiid = that.wiid;
            parm.page = 1;
            parm.rows = 20000;
            parm.sort = 'createdTime';
            parm.order = 'asc';
            var res = Object.toAjaxJson(FUI.Handlers.WorkflowBusinessHandler, 'loadProcessInstanceComment', parm, false);
            if (res.success) {
              commentDataTObj.Data = res.rows;
            } else {
              FUI.Window.showMsg(that, res.msg);
            }
            commentDataTObj.Bind();
          }
        }, 200);
      },
      saveAs(obj, fileName) {
        var tmpa = document.createElement('a');
        tmpa.download = fileName || '下载';
        tmpa.href = URL.createObjectURL(obj); // 绑定a标签
        tmpa.click(); // 模拟点击实现下载
        setTimeout(function () { // 延时释放
          URL.revokeObjectURL(obj); // 用URL.revokeObjectURL()来释放这个object URL
        }, 100);
      },
      cleanStyle() {
        excel.cleanSheetStyle(onlineSheetName);
      },
      importDemoJson() {
        var that = this;
        that.importExcelJsonData(demoExcelData);
        FUI.Window.showMsg2('导入示例Excel成功', null, 1);
      },
      collapsedSider() {
        this.isCollapsed = !this.isCollapsed;
      },
      propertyCollapsedSider() {
        this.isPropertyCollapsed = !this.isPropertyCollapsed;
      },
      closeEdit() {
        FUI.Window.closeEdit();
      },
      drawerClose(done) {
        done();
      },
      previewOnlineForm(operaType) {
        var that = this;
        that.previewType = operaType;
        var printArea = that.optionsData.find(r => r.ruleCode == 'printArea');
        excel.preview(onlineSheetName, operaType, printArea ? printArea.ruleParams : null);
      },
      printPreview() {
        $('#header').hide();
        window.print();
        $('#header').show();
      }
      // 通过后台导出到Excel
      , exportCurrentDataToExcel() {
        var that = this;
        var data = excel.getSheetData(onlineSheetName);
        try {
          that.exportLoading = true;
          //console.info(data);
          var currentDataJson = JSON.stringify(data);
          console.info(currentDataJson);
          Object.toAjaxDownloadFile(FUI.Handlers.SmartFormHandler, 'downloadOnlineExcelJsonToExcelFile', currentDataJson, true);
          setTimeout(function () {
            that.exportLoading = false;
          }, 2000);

        } catch (err) {
          that.exportLoading = false;
          console.info(err);
          console.info(data);
          console.info(currentDataJson);
        }

      }
    }
  }
</script>
<style lang="scss" scoped>
  @import "/static/f2bpmUI/onlineExcel/exceldesigner.css";

  @media print {
    body {
      -webkit-print-color-adjust: exact;
    }
  }

  * {
    -webkit-print-color-adjust: exact !important;
    /* Chrome, Safari */
    color-adjust: exact !important;
    /*Firefox*/
  }
</style>
