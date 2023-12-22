+function ($) {
    var _is_drag_form_field = false;
    FUI.Excel = {
        Create: function (excelId, options) {
            var op = $.extend({}, options);
            op.excelId = excelId;
            var targetExcel = new ExcelObject(op);
            return targetExcel;
        },
        getNewSheet: function (opt) {
            var sheetOjb = { sheetId: null, sheetName: null, sheet: null, data: null, html: null, rowNum: 0, colNum: 13, width: null };
            return $.extend(sheetOjb, opt);
        }
    };
    function ExcelObject(options) {
        //一个Excel可以有多个sheet 
        this.excelId = options.excelId;
        //Jquery对象
        this.excel = null;
        this.excelName = options.excelName;
        this.sheets = [];//格式：{sheetId:,data:json,html:}
        //在线表单模式
        this.type = "onlineform";
    };
    ExcelObject.prototype = {
        bind: function () {
            var targetExcel = this;
            targetExcel.excel = $("#" + targetExcel.excelId);
            var sheets = targetExcel.sheets;
            $.each(sheets, function (index, sheet) {
                targetExcel.initSheet(sheet, "init");
            });
        }
        //初始化Sheet，常规初始化：init,新增：add ，重载：reload，清空：clear
        , initSheet: function (sheet, initType) {
            var targetExcel = this;
            var sheetRowNum = sheet.rowNum < 31 ? 31 : sheet.rowNum;
            var $sheet = targetExcel.excel.find("div[sheetId='" + sheet.sheetId + "']");
            if ($sheet.length == 0) {
                $sheet = $("<div id='" + sheet.sheetId + "' sheetId='" + sheet.sheetId + "'></div>");
                $sheet.appendTo(targetExcel.excel);
                if (sheet.width && sheet.width > 0) {
                    $sheet.width(sheet.width);
                };
            };
            sheet.sheet = $sheet;
            $sheet.addClass("f2bpm-excel-sheet");
            var table;
            if (sheet.html) {
                $sheet.html(sheet.html);
                table = $sheet.find("table.f2bpm-sheet-table:eq(0)").first();
                var fir = table.children("tbody").children("tr:eq(0)");
                //恢复显示第一行
                fir.removeClass("row-hidden");
                //恢复显示第一列
                table.children("tbody").children("tr").find("td:eq(0)").removeClass("row-hidden");
            } else {
                //构建空白Excel表格
                if(!sheet.colNum||initType=='clear'){
                  sheet.colNum =  13;
                }
                 
                $sheet.html("");
                table = $("<table class='f2bpm-sheet-table'></table>").appendTo($sheet);
                if (sheet.data && sheet.data["!widthHeight"]) {
                    var rowsHeight = sheet.data["!widthHeight"].rowsHeight;
                    var colsWidth = sheet.data["!widthHeight"].colsWidth;
                    for (var i = 0; i < sheetRowNum; i++) {
                        var tr = "";
                        var rowHieht = rowsHeight["" + i + ""];
                        tr = (rowHieht && i > 0) ? $("<tr style='height:" + parseInt(rowHieht ) + "px;'></tr>").appendTo(table) : $("<tr></tr>").appendTo(table);
                        for (var j = 0; j <= sheet.colNum; j++) {
                            var a = (i == 0 && colsWidth["" + j + ""]) ? $("<td style='width:" + parseInt(colsWidth["" + j + ""]  ) + "px;'></td>").appendTo(tr) : $("<td></td>").appendTo(tr);
                        };
                    };
                } else {
                    for (var i = 0; i < sheetRowNum; i++) {
                        var tr = $("<tr></tr>").appendTo(table);
                        for (var j = 0; j < sheet.colNum; j++) {
                            $("<td></td>").appendTo(tr);
                        };
                    };
                };
            };
            targetExcel.drawRangeNo(table);
            if(targetExcel.previewType==undefined||targetExcel.previewType!="inpreview"){
                targetExcel.cellsEventbind(table, sheet);
            }
            targetExcel.drugCells(table, sheet.sheet);
            if (sheet.data) {
                //填写内容
                var dataObj = sheet.data;
                var abcNumberArr = targetExcel.get26AbcNameArr();
                $.each(dataObj, function (name, vObj) {
                    //A12取字母
                    var char = name.replace(/[^A-Z]/ig, "");
                    var col = abcNumberArr[char];
                    if (col) {
                        //取行号
                        var row = name.replace(/[^0-9]/ig, "");
                        var value = vObj["v"];
                        targetExcel.setTargetCellValue(table, { "row": row, "col": col }, value);
                        var td = targetExcel.getTdCell(table, row, col);
                        //设置样式
                        if (vObj["s"]) {
                            var s = vObj["s"];
                            //边框样式
                            var border = s.border;
                            if (border) {
                                var rgb;
                                if (border.top && border.top.style == "thin") {
                                    rgb = "#" + border.top.color.rgb;
                                    $(td).css("border-top", "solid 1px " + rgb);
                                };
                                if (border.left && border.left.style == "thin") {
                                    rgb = "#" + border.left.color.rgb;
                                    $(td).css("border-left", "solid 1px  " + rgb);
                                };
                                if (border.right && border.right.style == "thin") {
                                    rgb = "#" + border.right.color.rgb;
                                    $(td).css("border-right", "solid 1px  " + rgb);
                                };
                                if (border.bottom && border.bottom.style == "thin") {
                                    rgb = "#" + border.bottom.color.rgb;
                                    $(td).css("border-bottom", "solid 1px " + rgb);
                                };
                            };
                            //字体样式
                            var font = s.font;
                            if (font) {
                                if (font.sz && font.sz != 11) $(td).css("font-size", font.sz + "pt");
                                if (font.bold) $(td).css("font-weight", "bold");
                                if (font.italic) $(td).css("font-style", "italic");
                                if (font.strike) $(td).css("text-decoration", "line-through");
                                if (font.underline) $(td).css("text-decoration", "underline");
                                if (font.color && font.color != "000000") $(td).css("color", "#" + font.color);

                            };
                            //填充色
                            var fill = s.fill;
                            if (fill) {
                                if (fill.fgColor && fill.fgColor.rgb) $(td).css("background-color", "#" + fill.fgColor.rgb);
                            };

                            //对齐方式
                            var alignment = s.alignment;
                            if (alignment) {
                                if (alignment.horizontal) $(td).css("text-align", alignment.horizontal);
                                if (alignment.vertical) $(td).css("vertical-align", alignment.vertical);
                            };
                        };
                    };
                });

                //合并单元格
                var merges =  dataObj["!merges"];
                $.each(merges, function (i, merge) {
                    var s = merge.s;
                    var e = merge.e;
                    s.col = s.c + 1;
                    s.row = s.r + 1;
                    e.col = e.c + 1;
                    e.row = e.r + 1;  
                    targetExcel.mergeCellbyPosition(table, s, e);
                });

            };
            $sheet.unbind("contextmenu");
            $sheet.on('contextmenu', function () {
                return false;
            });
            if (initType == "add" || initType == "reload") {
                var tempSheets = [];
                $.each(targetExcel.sheets, function (index, s) {
                    if (s.sheetId != sheet.sheetId) {
                        tempSheets.push(s);
                    }
                    if (s.sheetId == sheet.sheetId && initType == "add") {
                        tempSheets.push(sheet);
                    }
                    if (s.sheetId == sheet.sheetId && initType == "reload") {
                        tempSheets.push($.extend(s, sheet));
                    }
                });
                targetExcel.sheets = tempSheets;
            };
            return sheet;
        }
        //根据SheetId获取Table的Html
        , getSheetTableHtmlBySheetId: function (sheetId) {
            var targetExcel = this;
            if ($("#" + sheetId)) {
                return targetExcel.getSheetHtml($("#" + sheetId));
            }
            return null;
        }
        //获取Sheet的Table的Html   
        , getSheetHtml: function ($sheet) {
            var targetExcel = this;
            var table = $sheet.find("table").first();
            if (table.length == 1) {
                var clone = table.clone(false);
                clone.find("tr:eq(0)").addClass("row-hidden");
                clone.find("td").removeClass("cell-position-css").removeClass("cell-chosen-css").removeClass("cell-chosen-mask-css").removeAttr("contenteditable");
                clone.find("td[class='']").removeAttr("class");
                clone.children("tbody").children("tr").find("td:eq(0)").addClass("row-hidden");
                return clone.prop("outerHTML");
            } else {
                return ""
            };
        }

        , getSheetObj: function (sheetId) {
            var targetExcel = this;
            var sheet = null;
            $.each(targetExcel.sheets, function (i, s) {
                if (s.sheetId == sheetId) {
                    sheet = s;
                };
            });
            return sheet;
        }
        , addSheetHtml: function (sheetId, tableHtml) {
            var targetExcel = this;
            var sheet = FUI.Excel.getNewSheet({ "sheetId": sheetId, html: tableHtml });
            targetExcel.initSheet(sheet, "add");
        }
        , reloadSheetData: function (sheetId, data) {
            var targetExcel = this;
            var refArea = data["!ref"].split(":");
            var col_s = targetExcel.getCodeByName(refArea[0], "abc");
            var col_e = targetExcel.getCodeByName(refArea[1], "abc");
            var row_s = targetExcel.getCodeByName(refArea[0], "num");
            var row_e = targetExcel.getCodeByName(refArea[1], "num");
            var abcNumberArr = targetExcel.get26AbcNameArr();
            //包括字母列
            var colNum = abcNumberArr[col_e] - abcNumberArr[col_s] +1;
            var rowNum = row_e - row_s + 2;
            var oldSheet = targetExcel.getSheetObj(sheetId);
            oldSheet.data = data;
            oldSheet.html = null;
            oldSheet.colNum = colNum;
            oldSheet.rowNum = rowNum;
            targetExcel.initSheet(oldSheet, "reload");
        }
        //仅重置Html
        , reloadSheetHtml: function (sheetId, tableHtml) {
            var targetExcel = this;
            var oldSheet = targetExcel.getSheetObj(sheetId);
            oldSheet.data = null;
            oldSheet.html = tableHtml;
            targetExcel.initSheet(oldSheet, "reload");
        }
        //清空当前sheet内容
        , clearSheetHtml: function (sheetId) {
            var targetExcel = this;
            var sheet = targetExcel.getSheetObj(sheetId);
            sheet.html = "";
            sheet.data=null;
            targetExcel.initSheet(sheet, "clear");
        }
        //预览:previewType操作类型：inpreview,outpreview;
        //printArea:打印的边界{rowno:123,colno:J},非必传
        ,preview:function (sheetId,previewType,printArea) {
            this.previewType=previewType;
            var $sheet=$("#"+sheetId);
            var $table=$(".f2bpm-sheet-table",$sheet);
            if(previewType=="inpreview"){
                $sheet.addClass("f2bpm-sheet-preview");
            }else{
                $sheet.removeClass("f2bpm-sheet-preview");
            }
            if(printArea){
                if(printArea.rowno&&printArea.rowno>10){
                    var rowno=printArea.rowno-1;
                    var trs=$table.find("tr:gt("+rowno+")").remove();
                }
                if(printArea.colno){
                    var colno=this.getAbcNumber(printArea.colno+1);
                    var trs=$table.find("tr");
                    $.each(trs,function(i,tr){
                        $(tr).find("td:gt("+colno+")").remove();
                    });
                }
            }
        }
        , showRightMenuOfIndex: function (table, t, e) {
            var targetExcel = this;
            if(targetExcel.previewType&&targetExcel.previewType=="inpreview"){
                return false;
            }
            var postTd = $(e.target);
            var posi = targetExcel.getTdPosition(postTd);
            var rowIndex = posi.row;
            var colIndex = posi.col;
            var indexType = colIndex == 0 ? "col" : "row";
            if (colIndex == 0 && rowIndex == 0) return;
            var mousePosition = targetExcel.getMousePosition(e, t);
            //如果是行或列多选的话，则不进行单选选中
            var isHeadMutiSelect = table.children("tbody").children("tr").find(".drug-ele-td.cell-position-css").length >= 2;
            if (!isHeadMutiSelect) {
                targetExcel.clearChosenCss(table);
                targetExcel.clearPositionCss(table);
                postTd.addClass("cell-position-css");
                targetExcel.closeRightPanel(t);
            };
            var beginTdPosi, endTdPosi;
            if (indexType == "col" && !isHeadMutiSelect) {
                //选中整行
                targetExcel.chosenfullRow(table, t, rowIndex);
            } else if (indexType == "row" && !isHeadMutiSelect) {
                //选中整列
                targetExcel.chosenfullCol(table, t, colIndex);
            };

            var rightMousePanel = $("<div class='rightmouse-panel-div'></div>").css("left", mousePosition.left).css("top", mousePosition.top).insertBefore(table);
            var leftPanel = $("<div class='panel-div-left'></div>").width(200).appendTo(rightMousePanel);

            if (indexType == "col") {
                $("<div class='menu insertAboveRow'></div>").html("<span class='excel-rightmomuse-icon-css'><i class='fa fa-angle-up'></i></span><span class='excel-rightmomuse-text-css'>上方插入一行</span>").appendTo(leftPanel);
                $("<div class='menu insertBelowRow'></div>").html("<span class='excel-rightmomuse-icon-css'><i class='fa fa-angle-down'></i></span><span class='excel-rightmomuse-text-css'>下方插入一行</span>").appendTo(leftPanel);
                $("<div class='menu deleteRow'></div>").html("<span class='excel-rightmomuse-icon-css'><i class='fa fa-minus-square-o'></i></span><span class='excel-rightmomuse-text-css'>删除行</span>").appendTo(leftPanel);
            };
            if (indexType == "row") {
                $("<div class='menu insertLeftCol'></div>").html("<span class='excel-rightmomuse-icon-css'><i class='fa fa-angle-left'></i></span><span class='excel-rightmomuse-text-css'>左边插入一列</span>").appendTo(leftPanel);
                $("<div class='menu insertRightCol'></div>").html("<span class='excel-rightmomuse-icon-css'><i class='fa fa-angle-right'></i></span><span class='excel-rightmomuse-text-css'>右边插入一列</span>").appendTo(leftPanel);
                $("<div class='menu deleteCol'></div>").html("<span class='excel-rightmomuse-icon-css'><i class='fa fa-minus-square'></i></span><span class='excel-rightmomuse-text-css'>删除列</span>").appendTo(leftPanel);

            };
            $("<div class='menu deleteChonseAreaContent'></div>").html("<span class='excel-rightmomuse-icon-css'><i class='fa fa-trash'></i></span><span class='excel-rightmomuse-text-css'>删除内容</span>").appendTo(leftPanel);
            $("<div class='menu cleanChonseAreaStyle'></div>").html("<span class='excel-rightmomuse-icon-css'><i class='fa fa-trash-o'></i></span><span class='excel-rightmomuse-text-css'>清除样式</span>").appendTo(leftPanel);
            $("<div class='menu undo' title='只能结构改变撤销'></div>").html("<span class='excel-rightmomuse-icon-css'><i class='fa fa-reply-all'></i></span><span class='excel-rightmomuse-text-css'>撤销</span>").appendTo(leftPanel);
            var coll = table.find(".cell-chosen-css");
            rightMousePanel.find(".menu").click(function () {
                var obj = $(this);
                if (!obj.hasClass("undo")) {
                    targetExcel.recordData(t);
                };

                if (obj.hasClass("insertAboveRow")) {
                    targetExcel.addRowCol(table, 0, t);
                }
                else if (obj.hasClass("insertBelowRow")) {
                    targetExcel.addRowCol(table, 1, t);
                }
                else if (obj.hasClass("insertLeftCol")) {
                    targetExcel.addRowCol(table, 2, t);
                }
                else if (obj.hasClass("insertRightCol")) {
                    targetExcel.addRowCol(table, 3, t);
                }
                else if (obj.hasClass("deleteRow")) {
                    targetExcel.addRowCol(table, 4, t);
                }
                else if (obj.hasClass("deleteCol")) {
                    targetExcel.addRowCol(table, 5, t);
                }
                else if (obj.hasClass("cleanChonseAreaStyle")) {
                    targetExcel.cleanChonseAreaStyle(table);
                }
                else if (obj.hasClass("deleteChonseAreaContent")) {
                    targetExcel.deleteChonseAreaContent(table);
                }
                else if (obj.hasClass("undo")) {
                    targetExcel.undo(t);
                };
                rightMousePanel.remove();
            });
            if (!(t.data("record") != undefined && t.data("record").length > 0)) {
                leftPanel.find(".undo").remove();
            };
        }
        , showMouseRightMenu: function (table, t, e) {
            var targetExcel = this;
            if(targetExcel.previewType&&targetExcel.previewType=="inpreview"){
                return false;
            }
            var mousePosition = targetExcel.getMousePosition(e, t);
            var coll = table.find(".cell-chosen-css");
            targetExcel.closeRightPanel(t);
            var rightMousePanel = $("<div class='rightmouse-panel-div'></div>").css("left", mousePosition.left).css("top", mousePosition.top).insertBefore(table);
            var leftPanel = $("<div class='panel-div-left'></div>").width(200).appendTo(rightMousePanel);
            $("<div class='menu merge_cells'></div>").html("<span class='excel-rightmomuse-icon-css'><i class='fa fa-columns'></i></span><span class='excel-rightmomuse-text-css'>合并单元格</span>").appendTo(leftPanel);
            $("<div class='menu fontWeight'></div>").html("<span class='excel-rightmomuse-icon-css'><i class='fa fa-bold'></i></span><span class='excel-rightmomuse-text-css'>加粗</span>").appendTo(leftPanel);
            $("<div class='menu unfontWeight'></div>").html("<span class='excel-rightmomuse-icon-css'><i class='fa fa-bold'></i></span><span class='excel-rightmomuse-text-css'>去除加粗</span>").appendTo(leftPanel);
            $("<div class='menu textAlignCenter'></div>").html("<span class='excel-rightmomuse-icon-css'><i class='fa fa-align-justify'></i></span><span class='excel-rightmomuse-text-css'>居中对齐</span>").appendTo(leftPanel);
            $("<div class='menu textAlignLeft'></div>").html("<span class='excel-rightmomuse-icon-css'><i class='fa fa-align-left'></i></span><span class='excel-rightmomuse-text-css'>左对齐</span>").appendTo(leftPanel);
            $("<div class='menu textAlignRight'></div>").html("<span class='excel-rightmomuse-icon-css'><i class='fa fa-align-right'></i></span><span class='excel-rightmomuse-text-css'>右对齐</span>").appendTo(leftPanel);
            $("<div class='menu verticalAlign'></div>").html("<span class='excel-rightmomuse-icon-css'><i class='fa fa-navicon'></i></span><span class='excel-rightmomuse-text-css'>垂直居中</span>").appendTo(leftPanel);
            $("<div class='menu deleteChonseAreaContent'></div>").html("<span class='excel-rightmomuse-icon-css'><i class='fa fa-trash'></i></span><span class='excel-rightmomuse-text-css'>删除内容</span>").appendTo(leftPanel);
            $("<div class='menu cleanChonseAreaStyle'></div>").html("<span class='excel-rightmomuse-icon-css'><i class='fa fa-trash-o'></i></span><span class='excel-rightmomuse-text-css'>清除样式</span>").appendTo(leftPanel);
            $("<div class='menu setcellstyle'></div>").html("<span class='excel-rightmomuse-icon-css'><i class='fa fa-cog'></i></span><span class='excel-rightmomuse-text-css'>设置单元格格式</span>").appendTo(leftPanel);
            $("<div class='menu undo' title='只能对结构布局改变的撤销'></div>").html("<span class='excel-rightmomuse-icon-css'><i class='fa fa-reply-all'></i></span><span class='excel-rightmomuse-text-css'>撤销</span>").appendTo(leftPanel);

            rightMousePanel.find(".menu").click(function () {
                var obj = $(this);
                if (!obj.hasClass("undo")) {
                    targetExcel.recordData(t);
                };
                if (obj.hasClass("merge_cells")) {
                    targetExcel.mergeCell(table);
                }
                else if (obj.hasClass("fontWeight")) {
                    targetExcel.setTargetChosenCells(table, { fontWeight: "bold" });
                }
                else if (obj.hasClass("unfontWeight")) {
                    targetExcel.setTargetChosenCells(table, { fontWeight: "" });
                }

                else if (obj.hasClass("textAlignCenter")) {
                    targetExcel.setTargetChosenCells(table, { textAlign: "center" });
                }
                else if (obj.hasClass("textAlignLeft")) {
                    targetExcel.setTargetChosenCells(table, { textAlign: "left" });
                }
                else if (obj.hasClass("textAlignRight")) {
                    targetExcel.setTargetChosenCells(table, { textAlign: "right" });
                }
                else if (obj.hasClass("verticalAlign")) {
                    targetExcel.setTargetChosenCells(table, { verticalAlign: "middle" });
                }
                else if (obj.hasClass("cleanChonseAreaStyle")) {
                    targetExcel.cleanChonseAreaStyle(table);
                }
                else if (obj.hasClass("deleteChonseAreaContent")) {
                    targetExcel.deleteChonseAreaContent(table);
                }
                else if (obj.hasClass("setcellstyle")) {
                    targetExcel.openStyleEdit(table);
                }
                else if (obj.hasClass("undo")) {
                    targetExcel.undo(t);
                };
                rightMousePanel.remove();
            });
            if (!(t.data("record") != undefined && t.data("record").length > 0)) {
                leftPanel.find(".undo").remove();
            };
        }
        //==================构建=======================
        //构建行列范围编号
        , drawRangeNo: function (table) {
            console.info(table.children("tbody").children("tr").length);
            console.info(table.children("tr").length);
            //构建表格范围的索引，第一行字母，第一列为数字
            var ind = 0;
            //第一行第一列
            table.find("tr").first().find("td:gt(0)").unbind("click");
            table.find("tr").find("td:eq(0)").unbind("click");
            //加特殊标识
            table.find("tr").first().find("td").first().addClass("first-td-all");
            table.find("tr").first().addClass("first-row");
            //构建第一行字母索引
            table.find("tr").first().find("td:gt(0)").each(function () {
                var char = String.fromCharCode(65 + ind);
                if (ind >= 26) {
                    char = String.fromCharCode(65 + (parseInt(ind / 26) - 1)) + String.fromCharCode(65 + ind % 26);
                };
                $(this).addClass("drug-ele-td").css("text-align", "center").html(char);
                ind++
            });
            //构建第一列数字索引
            //ind = 0;
            //table.find("tr").find("td:eq(0)").each(function () {
            //    $(this).width(30).addClass("drug-ele-td").css("text-align", "center").html(ind == 0 ? "" : ind);
            //    ind++
            //});
            ind = 0;
            //只取Table子元素tr,防止嵌套的控件子表被当成Excel
            var trs = table.children("tbody").children("tr");
            if (trs==undefined||trs.length == 0) {
                trs= table.children("tr");
            }
            trs.find("td:eq(0)").each(function () {
                $(this).width(30).addClass("drug-ele-td").css("text-align", "center").html(ind == 0 ? "" : ind);
                ind++
            });
        }

        //===================事件=======================
        //单元格事件绑定
        , cellsEventbind: function (table, sheet) {
            var t = sheet.sheet;
            var targetExcel = this;
            //常规格选择
            var isNormalChosen = false;
            //索引格选择
            var isIndexChosen = false;
            var indexChonseType = "";
            table.mousedown(function (e) {
                if (_is_drag_form_field) return true;
                if (e.button != 2 && e.target.tagName == "TD") {
                    //左键单击
                    targetExcel.clearPositionCss(table);
                    if (!$(e.target).hasClass("drug-ele-td")) {
                        isNormalChosen = true;
                        targetExcel.onclickNormalCell(table, sheet, e);
                    } else {
                        isIndexChosen = true;
                        indexChonseType = targetExcel.onclickIndexCell(table, sheet, e);
                    };
                };
            }).mousemove(function (e) {
                if (_is_drag_form_field) return true;
                var beginPosit;
                var endPosit;
                var ele = $(e.target);
                var posi = targetExcel.getTdPosition(ele);
                var canDraw = false;
                //单击所在
                beginPosit = targetExcel.getTdPosition(table.data("beg-td-ele"));
                if (isNormalChosen == true) {
                    if (!$(e.target).hasClass("drug-ele-td")) {
                        endPosit = targetExcel.getTdPosition(ele);
                        canDraw = true;
                    };
                }
                else if (isIndexChosen == true) {
                    //行或列头选中时的拖拽
                    var trs = table.children("tbody").children("tr");
                    var rowNum = trs.length;
                    var colNum = table.children("tr").first().children("td").length;
                    var movePosit = targetExcel.getTdPosition(ele);
                    var beginRowHeadPosition;
                    var endRowHeadPosition;
                    if (indexChonseType == "col") {
                        //如果是列
                        endPosit = { row: rowNum - 1, col: movePosit.col };
                        canDraw = true;

                        beginRowHeadPosition = { row: 0, col: beginPosit.col };
                        endRowHeadPosition = { row: 0, col: movePosit.col };
                    } else if (indexChonseType == "row") {
                        //如查是行
                        endPosit = { row: movePosit.row, col: colNum - 1 };
                        canDraw = true;
                        //行索引列范围选取
                        beginRowHeadPosition = { row: beginPosit.row, col: 0 };
                        endRowHeadPosition = { row: movePosit.row, col: 0 };
                    }
                    targetExcel.drawHeadArea(table, beginRowHeadPosition, endRowHeadPosition);
                };
                if (canDraw) {
                    //范围选取
                    targetExcel.drawChosenList(table, beginPosit, endPosit);
                    targetExcel.drawChosenArea(table, sheet.sheet);
                };
            }).mouseup(function (e) {
                if (_is_drag_form_field) return true;
                isNormalChosen = false;
                isIndexChosen = false;
                if (e.target.tagName != "TD") return true;
                if (e.button == 2 && !$(e.target).hasClass("drug-ele-td")) {
                    //普通格右键菜单
                    if (table.find(".cell-chosen-css").length == 0) {
                        $(e.target).addClass("cell-chosen-css");
                    };
                    targetExcel.showMouseRightMenu(table, t, e);
                } else if (e.button == 2 && $(e.target).hasClass("drug-ele-td")) {
                    //索引格右键菜单
                    if (table.find(".cell-chosen-css").length == 0) {
                        $(e.target).addClass("cell-chosen-css");
                    };
                    targetExcel.showRightMenuOfIndex(table, t, e);
                } else if (e.target.tagName == "TD") {
                    //左键抬起事件，选单元格范围
                    targetExcel.closeRightPanel(t);
                    var ele = $(e.target);
                    if (!ele.hasClass("drug-ele-td")) {
                        if (!ele.is("table") && table.data("beg-td-ele") && table.data("beg-td-ele").is(ele)) {
                            //开始格与结束格为同一个
                            ele.addClass("cell-chosen-css");
                            table.find("td").removeAttr("contenteditable");
                            if (t.data("contentChange") && t.data("contentChange") == "yes") {
                                targetExcel.drugCells(table, t);
                                t.removeData("contentChange");
                            }
                            if (ele.attr("readonly") == undefined) {
                                ele.attr("contenteditable", true);
                                if (window.getSelection) {
                                    ele[0].focus();
                                    var range = window.getSelection();
                                    if (range.focusOffset == 0) {
                                        range.selectAllChildren(ele[0]);
                                        range.collapseToEnd();
                                    }
                                } else if (document.selection) {
                                    var range = document.selection.createRange();
                                    range.moveToElementText(obj);
                                    range.collapse(false);
                                    range.select();
                                }
                            }
                            targetExcel.clearPositionCss(table);
                            var posi = targetExcel.getTdPosition(ele);
                            table.children("tbody").children("tr").find("td:eq(" + posi.col + ")").addClass("cell-position-css");
                            table.children("tbody").children("tr:eq(" + posi.row + ")").children("td").addClass("cell-position-css");
                        } else {
                            targetExcel.clearPositionCss(table);
                            targetExcel.drawChosenList(table, targetExcel.getTdPosition(table.data("beg-td-ele")), targetExcel.getTdPosition(ele));
                        }
                        targetExcel.drawChosenArea(table, t);
                    };
                };
            });
            $(document).unbind("keydown");
            $(document).keydown(function (e) {
                if (_is_drag_form_field) return true;
                if (e.ctrlKey && e.keyCode == 90) {
                    //Z:90  Enter:108  Backspace:8,Delete:46
                    targetExcel.undo(t);
                };

                if (e.ctrlKey && e.keyCode == 46) {
                    targetExcel.cleanChonseAreaStyle(table);
                } else if (e.keyCode == 46) {
                    targetExcel.deleteChonseAreaContent(table);
                };
            });
            table.children("tbody").children("tr").find("td").keyup(function () {
                if (_is_drag_form_field) return true;
                t.data("contentChange", "yes");
            });
        }
        //单击普通格
        , onclickNormalCell: function (table, sheet, e) {
            var targetExcel = this;
            if(targetExcel.previewType&&targetExcel.previewType=="inpreview"){
                return false;
            }
            //设置开始格子位置，drug-ele-td为索引号的格子：即第一行或第一列，e.target为接受事件的目标DOM元素
            targetExcel.clearChosenCss(table);
            table.removeData("beg-td-ele");
            //记录开始开始格
            table.data("beg-td-ele", $(e.target));
        }
        //单击索引格
        , onclickIndexCell: function (table, sheet, e) {
            var targetExcel = this;
            //返回：row,col,all类别
            //左键单击索引格
            targetExcel.clearChosenCss(table);
            table.removeData("beg-td-ele");
            table.find("td").removeAttr("contenteditable");
            var ele = $(e.target);
            var posit = targetExcel.getTdPosition(ele);
            ele.addClass("cell-position-css");
            if (posit.row == 0 && posit.col != 0) {
                //列选择
                targetExcel.chosenfullCol(table, sheet, posit.col);
                var td = targetExcel.getTdCell(table, 1, posit.col);
                table.data("beg-td-ele", $(td));
                return "col";
            } else if (posit.row != 0 && posit.col == 0) {
                //行选择
                targetExcel.chosenfullRow(table, sheet, posit.row);
                var td = targetExcel.getTdCell(table, posit.row, 1);
                table.data("beg-td-ele", $(td));
                return "row";
            } else if (posit.row == 0 && posit.col == 0) {
                //全部
                targetExcel.chosenAll(table, sheet);
                return "all";
            };
        }
        //列拖动，行拖动
        , drugCells: function (table, t) {
            var targetExcel = this;
            t.find(".col-width-panel,.row-height-panel").remove();
            t.find(".chosen-area-p").remove();
            var colWidthPanel = $("<div class='col-width-panel'></div>");
            var rowHeightPanel = $("<div class='row-height-panel'></div>");
            var left = 0,
                top = 0;
            var firstTr = table.find("tr").first();
            table.find("td").removeAttr("contenteditable");
            colWidthPanel.insertBefore(table);
            rowHeightPanel.insertBefore(table);
            table.children("tbody").children("tr").find("td").each(function () {
                //只有显示指定宽度的才强制写回Style中，否则是由样式文件决定
                if ($(this).attr("style") && $(this).attr("style").indexOf("width:") != -1) {
                    $(this).width($(this).width());
                };
            });
            table.find("tr").first().children("td").each(function () {
                left += this.offsetWidth;
                var inds = $(this).closest("tr").children("td").index($(this));
                $("<div class='col-width-panel-item'></div>").attr("draggable", true).mousedown(function (e) {
                    if (_is_drag_form_field) return true;
                    e.preventDefault && e.preventDefault();
                    var ele = $(e.target);
                    if (ele.data("left") == undefined) {
                        targetExcel.recordData(t);
                        ele.data("left", ele.css("left"));
                        ele.data("e-left", e.clientX);
                        t.data("drug-ele", ele);
                    }
                }).mouseup(function () {
                    if (_is_drag_form_field) return true;
                    //列拖块
                    targetExcel.clearDurgEle(table, t);
                }).css("left", left - 4).css("height", firstTr[0].offsetHeight).appendTo(colWidthPanel);
            });
            table.children("tbody").children("tr").each(function () {
                top += this.offsetHeight;
                var wdd = $(this).height();
                $(this).height($(this).height());
                $("<div class='row-height-panel-item'></div>").attr("draggable", true).mousedown(function (e) {
                    if (_is_drag_form_field) return true;
                    e.preventDefault && e.preventDefault();
                    var ele = $(e.target);
                    if (ele.data("top") == undefined) {
                        targetExcel.recordData(t);
                        ele.data("top", ele.css("top"));
                        ele.data("e-top", e.clientY);
                        t.data("drug-ele", ele);
                    }
                }).mouseup(function () {
                    if (_is_drag_form_field) return true;
                    targetExcel.clearDurgEle(table, t);
                    //行拖块
                }).css("top", top - 4).css("width", firstTr.children("td")[0].offsetWidth).appendTo(rowHeightPanel);
            });
            colWidthPanel.find(".col-width-panel-item:first,.col-width-panel-item:last").css("display", "none");
            rowHeightPanel.find(".row-height-panel-item:first,.row-height-panel-item:last").css("display", "none");
            t.unbind("mouseup").unbind("mousemove");
            t.mouseup(function (e) {
                if (_is_drag_form_field) return true;
                targetExcel.clearDurgEle(table, t);
            }).mousemove(function (e) {
                if (t.data("drug-ele") != undefined) {
                    targetExcel.closeRightPanel(t);
                    var ele = t.data("drug-ele");
                    if (ele.hasClass("col-width-panel-item") && ele.data("left") != undefined) {
                        var left = parseInt(ele.data("left")) + (e.clientX - ele.data("e-left"));
                        var ind = colWidthPanel.find(".col-width-panel-item").index(ele);
                        var upLeft = 0;
                        if (ind > 0) {
                            upLeft = parseInt(ele.prev(".col-width-panel-item").css("left")) + 4;
                        }
                        var nextLeft = table.width();
                        if (ind < colWidthPanel.find(".col-width-panel-item").length - 1) {
                            nextLeft = parseInt(ele.next(".col-width-panel-item").css("left")) + 4;
                        }
                        if (left - upLeft > 30) {
                            var now = table.children("tbody").children("tr").find("td:eq(" + ind + ")");
                            //var next = table.find("tr").find("td:eq(" + (ind + 1) + ")");
                            now.width(left - upLeft);
                            //next.width(nextLeft - left);
                            ele.css("left", left);
                        }
                    };
                    if (ele.hasClass("row-height-panel-item") && ele.data("top") != undefined) {
                        var top = parseInt(ele.data("top")) + (e.clientY - ele.data("e-top"));
                        var ind = rowHeightPanel.find(".row-height-panel-item").index(ele);
                        var upTop = 0;
                        if (ind > 0) {
                            upTop = parseInt(ele.prev(".row-height-panel-item").css("top")) + 4;
                        }
                        if (top - upTop > 5) {
                            var now = table.children("tbody").children("tr:eq(" + ind + ")");
                            now.height(top - upTop);
                            ele.css("top", top);
                        }
                    };
                };
            })
        }
        //===================选中=======================
        //选择整行
        , chosenfullRow: function (table, t, rowIndex) {
            var targetExcel = this;
            var colNum = table.find("tr").first().children("td").length;
            //选中整行
            var beginTdPosi = { row: rowIndex, col: 1 };
            var endTdPosi = { row: rowIndex, col: colNum - 1 };
            targetExcel.drawChosenList(table, beginTdPosi, endTdPosi);
            targetExcel.drawChosenArea(table, t);
        }
        //选择整列
        , chosenfullCol: function (table, t, colIndex) {
            var targetExcel = this;
            var rowNum = table.children("tbody").children("tr").length;
            //选中整列
            var beginTdPosi = { row: 1, col: colIndex };
            var endTdPosi = { row: rowNum - 1, col: colIndex };
            targetExcel.drawChosenList(table, beginTdPosi, endTdPosi);
            targetExcel.drawChosenArea(table, t);
        }
        //选择全部
        , chosenAll: function (table, t) {
            var targetExcel = this;
            var rowNum = table.children("tbody").children("tr").length;
            var colNum = table.find("tr").first().children("td").length;
            //选中整行
            var beginTdPosi = { row: 1, col: 1 };
            var endTdPosi = { row: rowNum - 1, col: colNum - 1 };
            targetExcel.drawChosenList(table, beginTdPosi, endTdPosi);
            targetExcel.drawChosenArea(table, t);
        }

        //===================绘制范围=======================
        //绘制索引区域
        , drawHeadArea: function (table, sp, ep) {
            table.children("tbody").children("tr").find("td:eq(0)").removeClass("cell-position-css");
            table.find("tr:eq(0)").children("td").removeClass("cell-position-css");
            var coll = [];
            if (sp != undefined && ep != undefined) {
                var coll = [];
                for (var i = (sp.row > ep.row ? ep.row : sp.row) ; i <= (sp.row > ep.row ? sp.row : ep.row) ; i++) {
                    var tr = table.children("tbody").children("tr:eq(" + i + ")");
                    for (var j = (sp.col > ep.col ? ep.col : sp.col) ; j <= (sp.col > ep.col ? sp.col : ep.col) ; j++) {
                        var td = tr.children("td:eq(" + j + ")");
                        td.addClass("cell-position-css");
                        coll[coll.length] = td;
                    };
                };
            };
            return coll;
        }
        //绘制蒙板区域
        , drawChosenArea: function (table, t) {
            var targetExcel = this;
            var coll = table.find(".cell-chosen-css");
            table.find("td").removeClass("cell-chosen-mask-css");
            if (coll.length > 0) {
                var first = coll.first();
                var posi = targetExcel.getTdPosition(first);
                var width = 0,
                    height = 0;
                var p = table.parent();
                coll.each(function () {
                    var p = targetExcel.getTdPosition($(this));
                    if (p.row == posi.row) {
                        width += this.offsetWidth;
                    };
                    if (p.col == posi.col) {
                        height += this.offsetHeight;
                    };
                });
                if (coll.length > 1) {
                    coll.addClass("cell-chosen-mask-css");
                    if (p.find(".chosen-area-p-drug").length == 1) {
                        var con = false;
                        var fir = coll.first();
                        if (p.find(".chosen-area-p-drug").data("text") != undefined) {
                            targetExcel.recordData(t);
                            coll.html(p.find(".chosen-area-p-drug").data("text"));
                            p.find(".chosen-area-p-drug").removeData("text");
                            con = true;
                        };
                        if (p.find(".chosen-area-p-drug").data("textNum") != undefined) {
                            targetExcel.recordData(t);
                            var n = p.find(".chosen-area-p-drug").data("textNum");
                            var v = Number($.trim(fir.text()));
                            coll.each(function () {
                                $(this).html(v);
                                v += n;
                            });
                            p.find(".chosen-area-p-drug").removeData("textNum");
                            con = true;
                        };
                        if (con) {
                            if (fir.attr("valign") && fir.attr("valign") != "") {
                                coll.attr("valign", fir.attr("valign"));
                            };
                            if (fir.css("text-align") && fir.css("text-align") != "") {
                                coll.css("text-align", fir.css("text-align"));
                            };
                        };
                    };
                }
                p.find(".chosen-area-p").remove();
                $("<div class='chosen-area-p'></div>").width(1).height(height + 1).css("margin-top", first[0].offsetTop - 1).css("margin-left", first[0].offsetLeft - 1).insertBefore(table);
                $("<div class='chosen-area-p'></div>").width(width + 1).height(1).css("margin-top", first[0].offsetTop - 1).css("margin-left", first[0].offsetLeft - 1).insertBefore(table);
                $("<div class='chosen-area-p'></div>").width(1).height(height - 4).css("margin-top", first[0].offsetTop - 1).css("margin-left", first[0].offsetLeft + width - 1).insertBefore(table);
                $("<div class='chosen-area-p'></div>").width(width - 4).height(1).css("margin-top", first[0].offsetTop + height - 1).css("margin-left", first[0].offsetLeft - 1).insertBefore(table);
                $("<div class='chosen-area-p chosen-area-p-drug'></div>").mousedown(function () {
                    if (_is_drag_form_field) return true;
                    if (coll.length == 1) {
                        $(this).data("text", $.trim(coll.first().text()));
                    };
                    if (coll.length == 2) {
                        var reg = /^\d{1,9}$/;
                        if (reg.test($.trim(coll.first().text())) && reg.test($.trim($(coll.get(1)).text()))) {
                            $(this).data("textNum", Number($.trim($(coll.get(1)).text())) - Number($.trim(coll.first().text())));
                        };
                    };
                }).width(3).height(3).css("padding", "2px").css("margin-top", first[0].offsetTop + height - 3).css("margin-left", first[0].offsetLeft + width - 3).insertBefore(table);
            };
        }
        //绘制指定范围内的单元格,begPosi中的row和col是数字号从1开始
        , drawChosenList: function (table, begPosi, endPosi) {
            var targetExcel = this;
            targetExcel.clearChosenCss(table);
            if (begPosi != undefined && endPosi != undefined) {
                var coll = [];
                for (var i = (begPosi.row > endPosi.row ? endPosi.row : begPosi.row) ; i <= (begPosi.row > endPosi.row ? begPosi.row : endPosi.row) ; i++) {
                    var tr = table.children("tbody").children("tr:eq(" + i + ")");
                    for (var j = (begPosi.col > endPosi.col ? endPosi.col : begPosi.col) ; j <= (begPosi.col > endPosi.col ? begPosi.col : endPosi.col) ; j++) {
                        var td = tr.children("td:eq(" + j + ")");
                        td.addClass("cell-chosen-css");
                        coll[coll.length] = td;
                    };
                };
                var coll = table.find(".cell-chosen-css");
                var firstPosi = targetExcel.getTdPosition($(coll[0]));
                var beg_row = firstPosi.row;
                var beg_col = firstPosi.col;
                table.find("td").removeData("add-chosen-state").removeData("get-father-state");
                while (true) {
                    //收集合并单元格所涉及的单元格
                    var end_row = 0;
                    var end_col = 0;
                    var con = false;
                    var err = false;
                    coll.each(function () {
                        var p = targetExcel.getTdPosition($(this));
                        var r = p.row + (($(this).attr("rowspan") == undefined || $(this).attr("rowspan") == "1" || $(this).attr("rowspan") == "0") ? 0 : (Number($(this).attr("rowspan")) - 1));
                        var c = p.col + (($(this).attr("colspan") == undefined || $(this).attr("colspan") == "1" || $(this).attr("colspan") == "0") ? 0 : (Number($(this).attr("colspan")) - 1));
                        end_row = end_row < r ? r : end_row;
                        end_col = end_col < c ? c : end_col;
                        //最小所在行索引
                        beg_row = beg_row > p.row ? p.row : beg_row;
                        //最小所在列索引
                        beg_col = beg_col > p.col ? p.col : beg_col;
                        if (beg_row == -1) {
                            err = true;
                            console.info("err:" + p.row + "|" + p.col);
                        };
                    });
                    if (err) {
                        break;
                    }
                    for (var i = beg_row; i <= end_row; i++) {
                        var tr = table.children("tbody").children("tr:eq(" + i + ")");
                        for (var j = beg_col; j <= end_col; j++) {
                            var dt = tr.children("td:eq(" + j + ")");
                            if (dt.is(":hidden") && dt.data("get-father-state") == undefined) {
                                var p = targetExcel.getFatherCell(dt);
                                dt.data("get-father-state", 0);
                                if (p != null && p.length == 1) {
                                    p.data("add-chosen-state", 0);
                                    if (p != null && coll.index(p) == -1) {
                                        p.addClass("cell-chosen-css");
                                        coll = table.find(".cell-chosen-css");
                                        con = true;
                                    };
                                };
                            } else {
                                if (!dt.hasClass("cell-chosen-css")) {
                                    dt.addClass("cell-chosen-css");
                                    coll = table.find(".cell-chosen-css");
                                    con = true;
                                };
                            };
                        };
                    };
                    if (!con) {
                        break;
                    };

                };
                return coll;
            };
        }

        //===================删除=======================
        //删除多行或多列
        , deleteMutiRowOrCol: function (table, t, delType) {
            var targetExcel = this;
            var chosenColl = delType == "col" ? table.children("tbody").children("tr:eq(0)").find(".drug-ele-td.cell-position-css") : table.children("tbody").children("tr:gt(0)").find(".drug-ele-td.cell-position-css");
            var trs = [];
            var cols = [];
            if (chosenColl.length > 0) {
                $.each(chosenColl, function (i, chosen) {
                    var tr = $(chosen.closest("tr"));
                    if (delType == "row") {
                        //删除行
                        targetExcel.addRowColSpan(tr, 4);
                        trs.push(tr);
                    }
                    else if (delType == "col") {
                        var colIndex = tr.children("td").index(chosen);
                        table.children("tbody").children("tr").each(function (_, t) {
                            var col = $(this).children("td:eq(" + colIndex + ")");
                            targetExcel.addRowColSpan(col, 5);
                            cols.push(col);
                        });
                    };
                });
                if (delType == "row") {
                    //删除行
                    $.each(trs, function (i, r) {
                        r.remove();
                    });
                } else if (delType == "col") {
                    //删除列
                    $.each(cols, function (i, c) {
                        c.remove();
                    });
                };
            };
            table.find("td[rowspan=1][colspan=1]").removeAttr("rowspan").removeAttr("colspan");
            t.find(".chosen-area-p").remove();
            targetExcel.clearDurgEle(table, t);
            targetExcel.drawRangeNo(table);
            //清除 add
            targetExcel.clearChosenCss(table);
            targetExcel.clearPositionCss(table);
        }
        //删除选区内的内容 
        , deleteChonseAreaContent: function (table) {
            table.find(".cell-chosen-css").html("");
        }

        //===================清除=======================
        //清除指定Sheet的全部样式
        , cleanSheetStyle: function (sheetId) {
            var table = $("#" + sheetId).find("table").first();
            if (table.length == 1) {
                table.children("tbody").children("tr:gt(0)").children("td:visible").filter(function (index) {
                    var s = $(this).is(":visible") && !$(this).hasClass("drug-ele-td");
                    return s;
                }).removeAttr("style");
            };
        }
        //删除选区内的单元格样式  
        , cleanChonseAreaStyle: function (table) {
            table.find(".cell-chosen-css").filter(function (index) {
                var s = $(this).is(":visible") && !$(this).hasClass("drug-ele-td");
                return s;
            }).removeAttr("style");
        }
        , clearChosenCss: function (table) {
            //console.info("清除全部选中的格子选择及蒙面");
            table.find("td").removeClass("cell-chosen-css").removeClass("cell-chosen-mask-css");
        }
        //清除拖拽元素数据
        , clearDurgEle: function (table, t) {
            var targetExcel = this;
            if (t.data("drug-ele") != undefined) {
                t.data("drug-ele").removeData("left").removeData("e-left").removeData("top").removeData("e-top");
                t.removeData("drug-ele");
                targetExcel.drugCells(table, t)
            };
        }
        //清除拖拽范围的选框和可编辑的TD标识
        , clearChosenAareaP: function ($sheet) {
            $sheet.find(".chosen-area-p").remove();
            $sheet.find("td").removeAttr("contenteditable");
        }
        //清除鼠标焦点位置
        , clearPositionCss: function (table) {
            //console.info("清除鼠标焦点位置样式");
            table.find("td").removeClass("cell-position-css");
        }
        //===================插入，合并，更改结构=======================

        //合并单元格（根据起止坐标）
        , mergeCellbyPosition: function (table, sp, ep) {
            var targetExcel = this;
            if (sp.col == ep.col && sp.row == ep.row) { return true; };
            //选中这个区域，然后调用单元格合并
            targetExcel.drawChosenList(table, sp, ep);
            targetExcel.mergeCell(table);
            targetExcel.clearChosenCss(table);
        }
        //合并单元格
        , mergeCell: function (table) {
            var targetExcel = this;
            if (table.length == 1) {
                var coll = table.find(".cell-chosen-css");
                if (coll.length > 1) {
                    var fir = $(coll.get(0));
                    var posi = targetExcel.getTdPosition(fir);
                    var r = 0,
                        c = 0;
                    if (fir.attr("rowspan") != undefined && fir.attr("colspan") != undefined) {
                        r = Number(fir.attr("rowspan")) - 1;
                        c = Number(fir.attr("colspan")) - 1;
                    };
                    coll.each(function () {
                        var p = targetExcel.getTdPosition($(this));
                        r = (p.row - posi.row) > r ? p.row - posi.row : r;
                        c = (p.col - posi.col) > c ? (p.col - posi.col) : c;
                        if (!$(this).is(fir)) {
                            $(this).removeClass("cell-chosen-css").css("display", "none");
                            if ($(this).attr("rowspan") != undefined && $(this).attr("colspan") != undefined) {
                                r = (p.row + (Number($(this).attr("rowspan")) - 1) - posi.row) > r ? (p.row + (Number($(this).attr("rowspan")) - 1) - posi.row) : r;
                                c = (p.col + (Number($(this).attr("colspan")) - 1) - posi.col) > c ? (p.col + (Number($(this).attr("colspan")) - 1) - posi.col) : c;
                            };
                        };
                    });
                    $(coll.get(0)).attr("rowspan", r + 1).attr("colspan", c + 1).css("display", "");
                } else if (coll.length == 1) {
                    var fir = $(coll.get(0));
                    if (fir.attr("rowspan") != undefined && fir.attr("colspan") != undefined) {
                        var posi = targetExcel.getTdPosition(fir);
                        for (var i = posi.row; i <= (posi.row + (Number($(fir).attr("rowspan")) - 1)) ; i++) {
                            var tr = table.children("tbody").children("tr:eq(" + i + ")");
                            for (var j = posi.col; j <= (posi.col + (Number($(fir).attr("colspan")) - 1)) ; j++) {
                                var td = tr.children("td:eq(" + j + ")").css("display", "");
                                if (!td.is(fir)) {
                                    td.removeAttr("rowspan").removeAttr("colspan");
                                };
                            };
                        };
                        fir.removeAttr("rowspan").removeAttr("colspan");
                    };
                };
            };
        }
        //撤消合并单元格
        , undo: function (t) {
            var targetExcel = this;
            var sheetId = t.attr("id");
            if (t.data("record") != undefined) {
                var record = t.data("record");
                if (record.length > 0) {
                    targetExcel.reloadSheetHtml(sheetId, record[record.length - 1]);
                    record.splice(record.length - 1, 1);
                };
            };
        }
        , addRowCol: function (table, type, t) {
            var targetExcel = this;
            var chosenColl = table.find(".cell-chosen-css");
            if (chosenColl.length > 0) {
                var chosen = chosenColl.first();
                var tr = chosen.closest("tr");
                var colIndex = tr.children("td").index(chosen);
                var colList = [];
                if (type == 2 || type == 3) {
                    table.children("tbody").children("tr").each(function () {
                        var col = $(this).children("td:eq(" + colIndex + ")");
                        colList.push(col);
                    });
                };
                colList = $(colList);
                if (type == 0) {
                    //上方插入一行
                    targetExcel.addRowColSpan(tr, type).insertBefore(tr);
                } else if (type == 1) {
                    targetExcel.addRowColSpan(tr, type).insertAfter(tr);
                } else if (type == 4) {
                    targetExcel.deleteMutiRowOrCol(table, t, "row");
                } else if (type == 2) {
                    //左插入列
                    targetExcel.addRowColSpan(colList, type);
                } else if (type == 3) {
                    //右插入列
                    targetExcel.addRowColSpan(colList, type);
                } else if (type == 5) {
                    targetExcel.deleteMutiRowOrCol(table, t, "col");
                };
            };
            table.find("td[rowspan=1][colspan=1]").removeAttr("rowspan").removeAttr("colspan");
            t.find(".chosen-area-p").remove();
            targetExcel.clearDurgEle(table, t);
            targetExcel.drawRangeNo(table);
            targetExcel.clearChosenCss(table);
            targetExcel.clearPositionCss(table);
        }
        //插入行或列， List为整个列或整个行的单元格
        , addRowColSpan: function (list, ty) {
            var targetExcel = this;
            //合并的单元格
            var coll = [];
            if (ty == 0 || ty == 1 || ty == 4) {
                //0：上插行，1：下插行，4：删除行
                var tr = list;
                tr.children("td").each(function () {
                    //调整合并单元格的跨行数量
                    if ($(this).is(":hidden")) {
                        var p = targetExcel.getFatherCell($(this));
                        var con = true;
                        for (var i = 0; i < coll.length; i++) {
                            if (coll[i].is(p)) {
                                con = false;
                                break;
                            }
                        };
                        if (con && p != null) {
                            coll[coll.length] = p;
                            p.attr("rowspan", targetExcel.spanNum(p.attr("rowspan"), ty == 4 ? -1 : 1));
                        };
                    } else {
                        if ($(this).attr("rowspan") && $(this).attr("colspan")) {
                            coll[coll.length] = $(this);
                            if (ty == 4) {
                                var nextTr = tr.next("tr");
                                if (nextTr.length == 1 && Number($(this).attr("rowspan")) > 1) {
                                    var ind = tr.children("td").index($(this));
                                    nextTr.children("td:eq(" + ind + ")").attr("rowspan", targetExcel.spanNum($(this).attr("rowspan"), -1)).attr("colspan", $(this).attr("colspan")).css("display", "");
                                };
                            } else {
                                $(this).attr("rowspan", Number($(this).attr("rowspan")) + 1);
                            };
                        };
                    };
                });
                //复制整行
                var clone = tr.clone(true);
                if (ty == 0) {
                    tr.children("td[rowspan][colspan]").each(function () {
                        $(this).removeAttr("rowspan").removeAttr("colspan").css("display", "none");
                    });
                };
                if (ty == 1) {
                    clone.children("td[rowspan][colspan]").each(function () {
                        $(this).removeAttr("rowspan").removeAttr("colspan").css("display", "none");
                    });
                };
                clone.height(30);
                clone.children("td").removeClass("cell-chosen-css").removeClass("cell-chosen-mask-css").removeClass("cell-position-css").html("");
                return clone;
            } else {
                //2左插入列，3右插入列， 5为删除列 
                var cloneLs = [];
                list.each(function () {
                    if ($(this).is(":hidden")) {
                        //找到合并的单元格
                        var p = targetExcel.getFatherCell($(this));
                        var con = true;
                        for (var i = 0; i < coll.length; i++) {
                            if (coll[i].is(p)) {
                                //防止重复记录合并单元格
                                con = false;
                                break;
                            };
                        };
                        if (con && p != null) {
                            coll[coll.length] = p;
                            //修改合并单元格的跨列数，删除时减1，插入列时加1， 2左插入列，3右插入列， 5为删除列（list为所在列的所有单元格）
                            p.attr("colspan", targetExcel.spanNum(p.attr("colspan"), ty == 5 ? -1 : 1));
                        };
                    } else {
                        if ($(this).attr("rowspan") && $(this).attr("colspan")) {
                            //正好在合并单元格上
                            coll[coll.length] = $(this);
                            if (ty == 5) {
                                //删除列
                                var nextTd = $(this).next("td");
                                if (nextTd.length == 1 && Number($(this).attr("colspan")) > 1) {
                                    nextTd.width($(this).width()).attr("rowspan", $(this).attr("rowspan")).attr("colspan", targetExcel.spanNum($(this).attr("colspan"), -1)).css("display", "");
                                };
                            } else {
                                //合并单元格跨列数加1
                                $(this).attr("colspan", Number($(this).attr("colspan")) + 1);
                            };
                        };
                    };
                    //复制原所有单元格
                    var clone = $(this).clone(true);
                    clone.css("width", "");
                    clone.removeClass("cell-chosen-css").removeClass("cell-chosen-mask-css").removeClass("cell-position-css").html("");
                    //收集复制的单元格
                    cloneLs[cloneLs.length] = clone;
                });
                for (var i = 0; i < cloneLs.length; i++) {
                    if (ty == 2) {
                        //左插入列
                        cloneLs[i].insertBefore($(list.get(i)));
                        var t = $(list.get(i));
                        if (t.attr("rowspan") && t.attr("colspan")) {
                            //刚好在左插入列时，原列是合并单元格，所以需要修改为隐藏并去除跨行列的属性，因为合并单元格已复制了
                            t.removeAttr("rowspan").removeAttr("colspan").css("display", "none");
                        };
                    };
                    if (ty == 3) {
                        //右插入列
                        cloneLs[i].insertAfter($(list.get(i)));
                        var t = cloneLs[i];
                        if (t.attr("rowspan") && t.attr("colspan")) {
                            t.removeAttr("rowspan").removeAttr("colspan").css("display", "none");
                        };
                    };
                };
            };
        }

        //===================获取目标值=======================
        //获取Sheet数据
        //格式：  var head2 = {"!ref": "A1:L19","A1": {"t": "s", "v": "费用报销审批单head2",  
        //     "s": {
        //        font: {
        //                name: '宋体',
        //                sz: 20,
        //                color: { rgb: "#FFFF0000" },
        //                bold: false,
        //                italic: false,
        //                underline: false
        //        }
        //        //数字格式化
        //        //numFmt:"0"
        //        , border: {
        //                top: { style: "thin", color: { rgb: "000000" } },
        //                bottom: { style: "thin", color: { rgb: "000000" } },
        //                left: { style: "thin", color: { rgb: "000000" } },
        //                right: { style: "thin", color: { rgb: "000000" } }
        //        }
        //        //,fill:{}
        //        , alignment: {
        //                horizontal: "left",
        //                vertical: "center"
        //        }
        //    }
        //  }
        // "!merges": [{ "s": { "c": 0, "r": 10 }, "e": { "c": 11, "r": 11 } }]
        //}
        , getSheetData: function (sheetId) {
            var targetExcel = this;
            var data = targetExcel.getCellsObjData(sheetId);
            var merges = targetExcel.getStandarMerges(sheetId);
            var posit = targetExcel.getLastCellPosit(sheetId);
            var lastCellName = targetExcel.getPositionName(posit);
            data["!sheetName"] = targetExcel.getSheetObj(sheetId).sheetName || "sheet1";
            data["!ref"] = "A1:" + lastCellName;
            data["!widthHeight"] = targetExcel.getRowColWidthHeight(sheetId);
            data["!merges"] = merges;
            return data;
        }
        //获取Sheet最后一个单元格的坐标
        , getLastCellPosit: function (sheetId) {
            var obj = {};
            var $sheet = $("#" + sheetId);
            var table = $sheet.find("table").first();
            obj.row = table.children("tbody").children("tr").length - 1;
            obj.col = table.children("tbody").children("tr:eq(0)").children("td").length - 1;
            return obj;
        }
        //获取所有单元格数据对象
        // {"A1": {"t": "s", "v": "费用报销审批单head2"}}
        , getCellsObjData: function (sheetId) {
            var targetExcel = this;
            var obj = {};
            var $sheet = $("#" + sheetId);
            var table = $sheet.find("table").first();
            table.children("tbody").children("tr:gt(0)").children("td:gt(0)").each(function () {
                var posiName = targetExcel.getTdPositionName($(this));
                var s = targetExcel.getCellStyle($(this)) || {};
                if (posiName != "") {
                    obj[posiName] = { "t": "s", "v": $(this).text().trim(), "s": s };
                };
            });
            return obj;
        }
        //获取所有合并单元格的坐标集合(索引从1开始)
        //格式：[{"row":1,"col":1,"rowspan":3,"colspan":1}]
        , getMergeCell: function (sheetId) {
            var targetExcel = this;
            var cellPosit = [];
            var $sheet = $("#" + sheetId);
            var table = $sheet.find("table").first();
            table.find("td[rowspan][colspan]").each(function () {
                var posi = targetExcel.getTdPosition($(this));
                var rowspan = parseInt($(this).attr("rowspan"));
                var colspan = parseInt($(this).attr("colspan"));
                if (!(rowspan == 1 && colspan == 1)) {
                    posi["rowspan"] = rowspan;
                    posi["colspan"] = colspan;
                    cellPosit.push(posi);
                };
            });
            return cellPosit;
        }
        //获取标准合并单元格坐标集体（索引从0开始，格式： [{  "s": { "c": 0, "r": 10 }, "e": { "c": 11, "r": 11 }  }]）
        , getStandarMerges: function (sheetId) {
            var merges = [];
            var targetExcel = this;
            var cellPosit = targetExcel.getMergeCell(sheetId);
            if (cellPosit && cellPosit.length > 0) {
                $.each(cellPosit, function (i, cell) {
                    var merge = {};
                    var c = cell.col - 1;
                    var r = cell.row - 1;
                    var ec = c + cell.colspan - 1;
                    var er = r + cell.rowspan - 1;
                    merge.s = { "c": c, "r": r };
                    merge.e = { "c": ec, "r": er };
                    merges.push(merge);
                });
            };
            return merges;
        }
        //获取单元格所在的左上角的合并单元格
        , getFatherCell: function (noneTd) {
            var targetExcel = this;
            var table = noneTd.closest("table");
            var p = targetExcel.getTdPosition(noneTd);
            var fatherCell = [];
            table.find("td[rowspan][colspan]").each(function () {
                var posi = targetExcel.getTdPosition($(this));
                var cell = $(this);
                var coll = [];
                var con = false;
                for (var i = posi.row; i <= (posi.row + (Number($(this).attr("rowspan")) - 1)) ; i++) {
                    var tr = table.children("tbody").children("tr:eq(" + i + ")");
                    for (var j = posi.col; j <= (posi.col + (Number($(this).attr("colspan")) - 1)) ; j++) {
                        var dt = tr.children("td:eq(" + j + ")");
                        if (noneTd.is(dt)) {
                            fatherCell[fatherCell.length] = cell;
                            con = true;
                            break
                        };
                    };
                    if (con) {
                        break;
                    };
                };
            });
            if (fatherCell.length == 1) {
                return fatherCell[0];
            } else {
                return null;
            };
        }


        //获取单元格位置,返回格式：{row:1,col:1}
        , getTdPosition: function (td) {
            if (td != undefined && td.length == 1) {
                var table = td.closest("table");
                var pos = {};
                var tr = td.closest("tr");
                pos.row = table.children("tbody").children("tr").index(tr);
                pos.col = tr.children("td").index(td);
                return pos;
            }
        }
        //获取单元格的位置名称,返回格式：A11,B12
        , getTdPositionName: function (td) {
            var targetExcel = this;
            if (td != undefined && td.length == 1) {
                var table = td.closest("table");
                var pos;
                var tr = td.closest("tr");
                var row = table.children("tbody").children("tr").index(tr);
                var col = tr.children("td").index(td);
                if (row == 0 || col == 0) return "";
                pos = targetExcel.getAbcName(col - 1) + "" + row;
                return pos;
            };
        }
        //获取指定坐标的位置名：返回如A22
         , getPositionName: function (position) {
             var targetExcel = this;
             var pos = targetExcel.getAbcName(position.col - 1) + "" + position.row;
             return pos;
         }
        , getTableBySheetId: function (sheetId) {
            var $sheet = $("#" + sheetId);
            var table = $sheet.find("table").first();
            return table;
        }
        //获取每行高与每列的宽
        , getRowColWidthHeight: function (sheetId) {
            var targetExcel = this;
            var $sheet = $("#" + sheetId);
            var table = $sheet.find("table").first();
            var widthHeight = {};
            widthHeight.rowsHeight = {};
            widthHeight.colsWidth = {};
            table.children("tbody").children("tr:eq(0)").children("td").each(function (index, td) {
                if (index > 0 && $(this).attr("style") && $(this).css("width") && $(this).css("width").replace("px", "") > 65) {
                    var w = parseInt($(this).css("width").replace("px", "")) * 8.1 / 64;
                    widthHeight.colsWidth["" + index + ""] = w;
                };
            });
            table.children("tbody").children("tr").each(function (index, tr) {
                if ($(this).attr("style") && $(this).css("height") && $(this).css("height").replace("px", "") > 27) {
                    var h = parseInt($(this).css("height").replace("px", "")) * 20 / 26;
                    widthHeight.rowsHeight["" + index + ""] = h;
                };
            });
            return widthHeight;
        }
        //获取单元格样式
    , getCellStyle: function (td) {
        var targetExcel = this;
        // font: { name: '宋体',sz: 20, color: { rgb: "#FFFF0000" }, bold: false,italic: false, underline: false
        //, border: {  top: { style: "thin", color: { rgb: "000000" } },bottom: { style: "thin", color: { rgb: "000000" } }, left: { style: "thin", color: { rgb: "000000" } },  right: { style: "thin", color: { rgb: "000000" } } }
        // ,alignment: {horizontal: "left", vertical: "center"}
        //,fill:{"fgColor": { "rgb": "9bbb59" } }
        if (td.attr("style")) {
            var arr = td.attr("style").split(";");
            var tdCss = {};
            $.each(arr, function (i, item) {
                if (item.trim() != "") {
                    var k = item.split(":")[0].trim();
                    var v = item.split(":")[1].trim();
                    tdCss[k] = v;
                };
            });
            var style = {};
            var font = {};
            font.sz = tdCss["font-size"] || 11;
            if (tdCss["font-size"]) font.sz = font.sz.replace("px", "").replace("pt", "").trim();
            var fontColor = targetExcel.getRgbToHexColor(tdCss["color"], true) || "000000";
            font.color = { rgb: fontColor };
            font.bold = tdCss["font-weight"] && tdCss["font-weight"].trim() == "bold";
            font.italic = tdCss["font-style"] && tdCss["font-style"].trim() == "italic";
            font.underline = tdCss["text-decoration"] && tdCss["text-decoration"].trim() == "underline";
            //删除线
            font.strike = tdCss["text-decoration"] && tdCss["text-decoration"].trim() == "line-through";

            style.font = font;

            var border = {};
            //border-top: 1px solid rgb(0, 0, 0);
            var bt = tdCss["border-top"];
            if (bt) {
                border.top = targetExcel.getBorderStyle(bt);
            };
            bt = tdCss["border-bottom"];
            if (bt) {
                border.bottom = targetExcel.getBorderStyle(bt);
            };
            bt = tdCss["border-left"];
            if (bt) {
                border.left = targetExcel.getBorderStyle(bt);
            };
            bt = tdCss["border-right"];
            if (bt) {
                border.right = targetExcel.getBorderStyle(bt);
            };
            style.border = border;
            if (tdCss["border-style"] && tdCss["border-color"]) {
                var color = targetExcel.getRgbToHexColor(tdCss["border-color"], true);
                var so = tdCss["border-style"] == "solid" ? "thin" : tdCss["border-style"];
                var b = { "style": so, "color": { rgb: color } };
                border.top = b;
                border.right = b;
                border.left = b;
                border.bottom = b;
                style.border = border;
            };
            var alignment = {};
            alignment.horizontal = tdCss["text-align"] || "center";
            alignment.vertical = td.attr("align") || "center";
            if (td.attr("align") && td.attr("align") == "middel") {
                alignment.vertical = "center";
            };
            style.alignment = alignment;

            var fill = {};
            var backgroundColor = targetExcel.getRgbToHexColor(tdCss["background-color"], true);
            fill.fgColor = { "rgb": backgroundColor };
            style.fill = fill;

            return style;
        };
        return null;
    }
    , getBorderStyle: function (borderStyle) {
        var targetExcel = this;
        if (borderStyle) {
            if (borderStyle.indexOf("#") > -1) {
                var arr = borderStyle.split(" ");
                var sty = arr[1] == "solid" ? "thin" : arr[1];
                var color = arr[2].replace("#", "");
                return { "style": sty, "color": { rgb: color } };
            }
            else if (borderStyle.indexOf("rgb") > -1) {
                var arr = borderStyle.split("rgb");
                var a1 = arr[0];
                var rgb = "rgb" + arr[1];
                var sty = a1.split(" ")[1] == "solid" ? "thin" : a1.split(" ")[1];
                color = targetExcel.getRgbToHexColor(rgb, true);
                return { "style": sty, "color": { rgb: color } };
            };
        };
        return null;
    }
        //获取指定坐标的单元格
        , getTdCell: function (table, row, col) {
            return table.children("tbody").children("tr:eq(" + row + ")").children("td:eq(" + col + ")");
        }
        //设置选中的单元格样式及数据
        , setTargetChosenCells: function (table, data) {
            var targetExcel = this;
            var chosenCells = table.find(".cell-chosen-css");
            if (data.backgroundColor != undefined) {
                chosenCells.css("background-color", data.backgroundColor);
            };

            //边框
            var lineStyle = "solid";
            var lineColor = "#000000";
            var lineWidth= "1px";
            if (data.borderlineStyle != undefined) {
                lineStyle = data.borderlineStyle;
            };
            if (data.borderlineColor != undefined) {
                lineColor = data.borderlineColor;
            };
            if (data.borderlineWidth != undefined) {
                lineWidth = data.borderlineWidth;
            };

            var borderStyle = lineStyle + " " + lineWidth + " " + lineColor;
            if (data.isNoBorder != undefined && data.isNoBorder != ""&&data.isNoBorder==1) {
                chosenCells.css("border", "");
            };
            if ((data.isNoBorder == undefined || data.isNoBorder == ""||  data.isNoBorder == 0) && data.isOutsideBorder != undefined  ) {
                var outBorderCSS=data.isOutsideBorder==1?borderStyle:"";
                //外边框
                //找出选中区域的左上角单元格和右下角单元格位置
                var lastrow = 0;
                var lastcol = 0;
                var firstrow = 0;
                var firstcol = 0;
                $.each(chosenCells, function (i, td) {
                    var posi = targetExcel.getTdPosition($(td));
                    if (firstrow == 0 || posi.row < firstrow) {
                        firstrow = posi.row;
                    };
                    if (firstcol == 0 || posi.col < firstcol) {
                        firstcol = posi.col;
                    };
                    if (posi.row > lastrow) {
                        lastrow = posi.row;
                    };
                    if (posi.col > lastcol) {
                        lastcol = posi.col;
                    };
                });
                $.each(chosenCells, function (i, td) {
                    var posi = targetExcel.getTdPosition($(td));
                    //上边框：只要是第一行
                    if (posi.row == firstrow) {
                        $(td).css("border-top", outBorderCSS);
                    };
                    //下边框：只要是最后一行
                    if (posi.row == lastrow) {
                        $(td).css("border-bottom", outBorderCSS);
                    };
                    //左边框：只要是第一列
                    if (posi.col == firstcol) {
                        $(td).css("border-left", outBorderCSS);
                    };
                    //右边框：只要是最后一列
                    if (posi.col == lastcol) {
                        $(td).css("border-right", outBorderCSS);
                    };
                });
            }
            if ((data.isNoBorder == undefined || data.isNoBorder == ""||  data.isNoBorder == 0) && data.isInsideBorder != undefined) {
                var inBorderCSS=data.isInsideBorder==1?borderStyle:"";
                //内边框
                var firstrow = 0;
                var firstcol = 0;
                var lastrow = 0;
                var lastcol = 0;
                $.each(chosenCells, function (i, td) {
                    var posi = targetExcel.getTdPosition($(td));
                    if (firstrow == 0 || posi.row < firstrow) {
                        firstrow = posi.row;
                    };
                    if (firstcol == 0 || posi.col < firstcol) {
                        firstcol = posi.col;
                    };
                    if (posi.row > lastrow) {
                        lastrow = posi.row;
                    };
                    if (posi.col > lastcol) {
                        lastcol = posi.col;
                    };
                    //console.info("row:" + posi.row + " col:" + posi.col);
                });
                $.each(chosenCells, function (i, td) {
                    var posi = targetExcel.getTdPosition($(td));
                    //左边框：只要不是第一列
                    if (posi.col != firstcol) {
                        $(td).css("border-left", inBorderCSS);
                    };
                    //上边框：只要不是第一行
                    if (posi.row != firstrow) {
                        $(td).css("border-top", inBorderCSS);
                    };
                });
            };

            if (data.fontWeight != undefined) {
                chosenCells.css("font-weight", data.fontWeight);
            };
            if (data.fontStyle != undefined) {
                chosenCells.css("font-style", data.fontStyle);
            };
            if (data.textDecoration != undefined) {
                chosenCells.css("text-decoration", data.textDecoration);
            };
            if (data.textAlign != undefined) {
                chosenCells.css("text-align", data.textAlign);
            };
            if (data.verticalAlign != undefined) {
                chosenCells.css("vertical-align", data.verticalAlign);
            };
            if (data.color != undefined) {
                chosenCells.css("color", data.color);
            };
            if (data.fontFamily != undefined) {
                chosenCells.css("font-family", data.fontFamily);
            };
            if (data.fontSize != undefined) {
                chosenCells.css("font-size", data.fontSize);
            };
            if (data.lineHeight != undefined) {
                chosenCells.css("line-height", data.lineHeight);
            };
            targetExcel.clearChosenCss(table);
        }
        //设置指定位置的单元格内容
        , setTargetCellValue: function (table, tp, v) {
            var td = table.children("tbody").children("tr:eq(" + tp.row + ")").children("td:eq(" + tp.col + ")");
            $(td).html(v);
        }
        , closeRightPanel: function (t) {
            t.find(".rightmouse-panel-div").remove();
        }
        //记录操作前版本历史数据
        , recordData: function (t) {
            var targetExcel = this;
            var record = [];
            if (t.data("record") != undefined) {
                record = t.data("record");
            };
            record[record.length] = targetExcel.getSheetHtml(t);
            t.data("record", record);
        }
        //===============工具类通用方法=====================
        //rgb转为16进制,needJh:是否加#号
        , getRgbToHexColor: function (color, notJin) {
            if (!color) return "";
            if (color.indexOf("#") > -1) {
                if (notJin == true) {
                    return color.substr(1);
                };
                return color;
            };
            //rgb转16进制
            var rgb = color.split(",");
            var r = parseInt(rgb[0].split("(")[1]);
            var g = parseInt(rgb[1]);
            var b = parseInt(rgb[2].split(")")[0]);
            var hex = ((r << 16) + (g << 8) + b).toString(16);
            if (notJin == true) {
                return hex;
            };
            hex = "#" + hex;
            return hex;
        }
        //根据索引获取字母（索引从0开始）
        , getAbcName: function (index) {
            var char = String.fromCharCode(65 + index);
            return char;
        }
        //根据字母获取索引（索引从0开始）
        , getAbcNumber: function (charStr) {
            if(charStr==""||charStr==undefined)return -1;
            var result= charStr.charCodeAt()-65;
            return result;
        }
        //根据名称获取其中的字母或数字，type:abc,num
        , getCodeByName: function (name, type) {
            if (type == "abc") {
                var char = name.replace(/[^A-Z]/ig, "");
                return char;
            }
            else if (type == "num") {
                var char = name.replace(/[^0-9]/ig, "");
                return char;
            };
        }
        //获取26个字母与数字编号（数字从1开始,即{A:1,B:2,.....AA:27,AB:28}）
        , get26AbcNameArr: function () {
            var abcNumberArr = {};
            for (i = 0; i < 26; i++) {
                var char = String.fromCharCode(65 + i);
                abcNumberArr[char] = i + 1;
            };
            for (i = 0; i < 26; i++) {
              var char = String.fromCharCode(65 + i);
              abcNumberArr['A'+char] = i + 1+26;
            };
            return abcNumberArr;
        }
        , spanNum: function (spanNum, n) {
            var num = Number(spanNum) + n;
            num = num < 1 ? 1 : num;
            return num;
        }
        //获取鼠标坐标
        , getMousePosition: function (e, t) {
            var targetExcel = this;
            var scrollTop = Math.abs($(t).parent().offset().top - 48);
            var scrollLeft = $(t).parent().offset().left;
            //clientX是参照可视化左上角为基准点，这个基准点随滚动条滚动而变化
            //PageX:是参照页面0.0，不随滚动条变化而变化
            var x = e.pageX - 203;//+ scrollLeft-203;
            var y = e.pageY - 48 + scrollTop;//+ scrollTop-48;
            return { "left": x, "top": y };
        }
        //===============页面=====================
        , openStyleEdit: function (table) {
            var targetExcel = this;
            var url = FUI.Handlers.SmartFormHandler+"onlineExcelCellStyle";
            FUI.dialog(url, "设置单元格格式", null, 580, 500, function (objectData, index,layer) {
                targetExcel.setTargetChosenCells(table, objectData);
                layer.close(index);
            }, false, null, { sure: { text: "确定" } });
        }
    };
}(window.jQuery);