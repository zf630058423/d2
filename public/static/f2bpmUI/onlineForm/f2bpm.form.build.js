var $temp;
var isWorking = false;
window.load_frombuild = function () {
  $("#onlinedesigner_maincontainer").delegate(".component", "mouseover", function (md) {
    var $this = $(this);
    var $thisColumn = $this.parent();

    $('.online-form-item').removeClass("border-blue");
    $this.addClass("border-blue");

    $('.component-drag-widget').removeClass("active");
    $('.component-drag-widget:first', $this).addClass("active");
    md.stopPropagation();
    md.preventDefault();
  });

  $("#onlinedesigner_maincontainer").delegate(".component-drag-widget", "mousedown", function (md) {
    md.stopPropagation();
    md.preventDefault();
    var btnNum = md.button;
    if (btnNum == 2) {
      return false;
    }
    //防止双击事件
    if ($(".drap-form-item-virtual").length> 0) {
      canceldrag();
      return false;
    }
    if (isWorking) {
      return false;
    }
    isWorking = true;
    var tops = [];
    var topColumns = [];
    var mouseX = md.pageX;
    var mouseY = md.pageY;

    var timeout;
    var $this = $(this).parent();
    var $thisColumn = $this.parent();

    var delays = {
      main: 0,
      form: 5
    };
    var type;

    if ($this.parent()[0].tagName == "LI") {

      if ($this.parent().parent().parent().hasClass("ctrs") || $this.parent().parent().parent().parent().parent().hasClass("ctrs")) {
        type = "main";
        $thisColumn = null;
      } else {
        type = "form";
      }
    } else {
      if ($this.parent().hasClass("ctrs")) {
        type = "main";
        $thisColumn = null;
      } else {
        type = "form";
      }
    }
    ;
    var delayed = setTimeout(function () {
      if (type === "main") {
        if ($this.attr("filedid")) {
          //字段
          var inputHtml = "";
          var attributesJson = $this.attr("attributes") ? eval("(" + $this.attr("attributes") + ")") : { type: "none" };
          //子表，字段，元器件的具体类型： report等
          var fieldType = attributesJson.type;
          if (fieldType == "subtable") {
            //子表字段
            var tableId = attributesJson.tableId;
            var busObjectId = attributesJson.busObjectId;
            var id = busObjectId;
            //inputHtml = Object.toAjaxJson(FUI.Handlers.SmartFormHandler, "getOnlineSubTableHtmlByFormDefIdBusObjectId", { "formDefId": formDefId, "busObjectId": busObjectId, "type": deviceType }, null, null, null, 'html');
            var defJson = JSON.stringify({ buildtype: 'pageData', id: id, fieldType: 'table' });
            inputHtml = "<textarea  style='display:none' class=\"jsonItem\">" + defJson + "</textarea>";
          } else if (fieldType == "field") {
            //普通字段
            var dbFieldId = attributesJson.fieldId;
            var id = dbFieldId;
            var defJson = JSON.stringify({ buildtype: 'pageData', id: id, fieldType: 'field' });
            inputHtml = "<textarea  style='display:none' class=\"jsonItem\">" + defJson + "</textarea>";
          } else if (fieldType == "fence") {
            //图表元器件
            var id = attributesJson.id;
            var defJson = JSON.stringify({ buildtype: 'pageData', id: id, fieldType: 'field' });
            inputHtml = "<textarea  style='display:none' class=\"jsonItem\">" + defJson + "</textarea>";
          }
          //console.info(inputHtml);
          if (inputHtml == "") {
            return false;
          }
          $cloneFormItem = $(inputHtml);
        } else {
          var $cloneFormItem = $this.clone();
          $(".online-form-label i", $cloneFormItem).remove();
          $cloneFormItem.attr("id", "form_item_" + Object.toGuid(false));
          var ctr_type = $cloneFormItem.attr("ctr_type");
          if (ctr_type == "extend_label") {
            var jsonItem = Object.toClone(field_template);
            jsonItem.type = 'label';
            jsonItem.ctrType = ctr_type;
            jsonItem.label = "扩展文字标签";
            jsonItem.content = "扩展文字标签内容";
            jsonItem.labelWidth = "0px";
            jsonItem.showLabel = false;
            jsonItem.id = "form_item_" + Object.toGuid(false);
            var str = JSON.stringify(jsonItem);
            $(".jsonItem", $cloneFormItem).val(str);
          }
          else if (ctr_type == "extend_textbox") {
            var jsonItem = Object.toClone(field_template);
            jsonItem.type = "textbox";
            jsonItem.ctrType = ctr_type;
            jsonItem.label = "扩展单行文本框";
            jsonItem.id = "form_item_" + Object.toGuid(false);
            var str = JSON.stringify(jsonItem);
            $(".jsonItem", $cloneFormItem).val(str);
          } else if (ctr_type == "extend_custhtml") {
            var jsonItem = Object.toClone(field_template);
            jsonItem.type = 'html';
            jsonItem.ctrType = ctr_type;
            jsonItem.labelWidth = "0px";
            jsonItem.showLabel = false;
            jsonItem.label = "扩展自定义HTML";
            jsonItem.content = "扩展自定义HTML";
            jsonItem.id = "form_item_" + Object.toGuid(false);
            var str = JSON.stringify(jsonItem);
            $(".jsonItem", $cloneFormItem).val(str);
          } else if (ctr_type == "extend_tabs") {
            var jsonItem = Object.toClone(tabs_template);
            jsonItem.ctrType = ctr_type;
            jsonItem.label = "页签容器";
            jsonItem.id = "tabs_" + Object.toGuid(false);
            //页签容器
            jsonItem.children[0].id = 'tabpane_' + Object.toGuid(false);
            var str = JSON.stringify(jsonItem);
            $(".jsonItem", $cloneFormItem).val(str);
          }
          else if (ctr_type == "extend_table") {
            var jsonItem = Object.toClone(table_template);
            jsonItem.ctrType = ctr_type;
            jsonItem.label = "表格容器";
            jsonItem.id = "table_" + Object.toGuid(false);
            //row容器
            jsonItem.children[0].id = 'tr_' + Object.toGuid(false);
            $.each(jsonItem.children[0].children, function (i, td) {
              var td_RowColTemplate = Object.toDeepClone(table_td_RowColTemplate);
              td_RowColTemplate.id = + "row_" + Object.toGuid(false);
              td_RowColTemplate.children[0].id = "col_" + Object.toGuid(false);
              td.children = [];
              td.children.push(td_RowColTemplate);
              td.id = 'td_' + Object.toGuid(false);
            });
            var str = JSON.stringify(jsonItem);
            $(".jsonItem", $cloneFormItem).val(str);
          }
          else if (ctr_type == "extend_container") {
            var jsonItem = Object.toClone(container_template);
            jsonItem.ctrType = ctr_type;
            jsonItem.label = "布局容器";
            jsonItem.id = "container_" + Object.toGuid(false);
            //子容器
            jsonItem.children[0].id = 'containerPane_' + Object.toGuid(false);

            var str = JSON.stringify(jsonItem);
            $(".jsonItem", $cloneFormItem).val(str);
          } else if (ctr_type == "extend_tabtoolbar") {
            //按钮组工具条
            var jsonItem = Object.toClone(tabtoolbar_template);
            jsonItem.ctrType = ctr_type;
            jsonItem.label = "按钮组工具条";
            jsonItem.id = "container_" + Object.toGuid(false);
            //子容器
            jsonItem.children[0].id = 'tabbtn_' + Object.toGuid(false);
            jsonItem.children[1].id = 'tabbtn_' + Object.toGuid(false);

            var str = JSON.stringify(jsonItem);
            $(".jsonItem", $cloneFormItem).val(str);
          } else if (ctr_type == "extend_button") {
            var jsonItem = Object.toClone(button_template);
            jsonItem.ctrType = ctr_type;
            jsonItem.label = "自定义按钮";
            jsonItem.id = "extend_button_" + Object.toGuid(false);
            var str = JSON.stringify(jsonItem);
            $(".jsonItem", $cloneFormItem).val(str);
          } else if (ctr_type == "extend_iframe") {
            var jsonItem = Object.toClone(iframe_template);
            jsonItem.ctrType = ctr_type;
            jsonItem.label = "iframe";
            jsonItem.id = "extend_iframe_" + Object.toGuid(false);
            var str = JSON.stringify(jsonItem);
            $(".jsonItem", $cloneFormItem).val(str);
          } else if (ctr_type == "extend_selectbutton") {
            //选择器按钮
            $("input", $cloneFormItem).attr("id", "extend_selectbutton_" + Object.toGuid(false));
            $("input", $cloneFormItem).attr("field", "extend_selectbutton_" + Object.toGetTimeRandomNum());
          } else if (ctr_type == "extend_custgrid") {
            //显示列表
            var gridId = "extend_custgrid_" + Object.toGetTimeRandomNum();
            $("div.layui-table", $cloneFormItem).attr("id", gridId);
            $("div.layui-table", $cloneFormItem).attr("configTableName", gridId);
            $("div.layui-table", $cloneFormItem).attr("lay-filter", gridId);
          } else if (ctr_type == "extend_divider") {
            //分割线
            var jsonItem = Object.toClone(divider_template);
            jsonItem.ctrType = ctr_type;
            jsonItem.id = "extend_divider_" + Object.toGuid(false);
            var str = JSON.stringify(jsonItem);
            $(".jsonItem", $cloneFormItem).val(str);
          } else if (ctr_type == "extend_picture") {
            //页面组件：图片上传
            var jsonItem = Object.toClone(field_template);
            jsonItem.type = "picture";
            jsonItem.ctrType = ctr_type;
            jsonItem.label = "上传图片";
            jsonItem.value = "";
            //显示宽度
            jsonItem.imgWidth="150";
            //显示高度，可不填
            jsonItem.imgHeight="";
            jsonItem.vModel = "page.picture_" + Object.toGetRandomNum(100, 999);
            jsonItem.id = "extend_picture_" + Object.toGuid(false);
            var str = JSON.stringify(jsonItem);
            $(".jsonItem", $cloneFormItem).val(str);
          } else if (ctr_type == "extend_file") {
            //页面组件：附件上传
            var jsonItem = Object.toClone(field_template);
            jsonItem.type = "file";
            jsonItem.ctrType = ctr_type;
            jsonItem.label = "上传附件";
            jsonItem.value = "";
            jsonItem.vModel = "page.file_" + Object.toGetRandomNum(100, 999);
            jsonItem.id = "extend_picture_" + Object.toGuid(false);
            var str = JSON.stringify(jsonItem);
            $(".jsonItem", $cloneFormItem).val(str);
          }
        }
        $temp = $("<form class='drap-form-item-virtual' style='height:40px;overflow-y: hidden;'  id='temp'></form>").append($cloneFormItem);
      } else {
        var $cloneFormItem = $this.clone();
        $temp = $("<form class='drap-form-item-virtual' style='height:40px;overflow-y: hidden;'   id='temp'></form>").append($cloneFormItem);
      }
      ;
      $("body").append($temp);
      //鼠标在控件左上角
      $temp.css({
        "position": "absolute",
        "top": mouseY - 20 + "px",
        "left": mouseX - 20 + "px",
        "opacity": "0.9"
      }).show();
      var half_box_height = ($temp.height() / 2);
      var half_box_width = ($temp.width() / 2);
      var $target = $("#drapDesignContainer");// $("#target");
      var tar_pos = $target.position();
      var $tar_columns = $("#drapDesignContainer .column");
      var $target_component = $("#drapDesignContainer .component");
      var positionLineHtml = "<hr class=\"position-line\"/>";
      var _isInsertComponentTop = false;
      $(document).delegate("body", "mousemove", function (mm) {
        $("hr.position-line").remove();
        mm.stopPropagation();
        var mm_mouseX = mm.pageX;
        var mm_mouseY = mm.pageY;
        //鼠标在控件左上角
        $temp.css({
          "position": "absolute",
          "top": mm_mouseY - 20 + "px",
          "left": mm_mouseX - 20 + "px",
          "opacity": "0.9"
        }).show();
        var bottom_panel = tar_pos.top + $target.height() + $temp.height() / 2 + 100;
        var right_panel = tar_pos.left + $target.width() + $temp.width() / 2;
        // $temp.html("mm_mouseX:"+mm_mouseX+",mm_mouseY:"+mm_mouseY);
        var isInner = mm_mouseX > (tar_pos.left - 100) &&
          mm_mouseX < right_panel &&
          mm_mouseY > tar_pos.top &&
          mm_mouseY < bottom_panel;
        //console.info("面板坐标：x:"+(tar_pos.left-100)+";y:"+ tar_pos.top+";y_bottom_panel:"+ bottom_panel+"|鼠标坐标:"+mm_mouseX+";y:"+ mm_mouseY+"|结果："+isInner);
        //在面板范围内
        if (isInner) {
          //查找最近的控件
          //$target_component.css({"border-top": "none", "border-bottom": "none"});
          //$target_component.attr("style", "");

          tops = $.grep($target_component, function (e) {
            var componentLeft = parseInt($(e).offset().left);
            var componentTop = parseInt($(e).offset().top);
            var componentWidth = parseInt($(e).width());
            var componentheight = parseInt($(e).height());
            var linmingHeight = componentheight + 30;//<80?componentheight:80;
            var mouseleft = mm_mouseX;
            var mousetop = mm_mouseY;
            //鼠标在目标的下边
            var sub = mousetop - componentTop;
            //鼠标在对象的右边
            var subleft = mouseleft - componentLeft;
            var isInnerA = sub > 0 && Math.abs(sub) < linmingHeight && subleft > 0 && Math.abs(subleft) < componentWidth;
            if (isInnerA == false) {
              //是否插入到列控件中的最前面
              var isInnerTop = sub < 0 && Math.abs(sub) < 20 && subleft > 0 && Math.abs(subleft) < componentWidth;
              isInnerA = isInnerTop;
              if (_isInsertComponentTop == false && isInnerTop == true) {
                _isInsertComponentTop = true;
              }
            }
            //console.info("控件:"+componentLeft+";y:"+ componentTop+"|鼠标坐标:"+mouseleft+";y:"+ mousetop+"|结果："+isInnerA);
            return isInnerA;
          });
          //console.info("找到控件：" + tops.length);
          //查找最近列
          //$("hr.position-line").remove();
          topColumns = $.grep($tar_columns, function (e) {
            var colTop = parseInt($(e).offset().top);
            var colLeft = parseInt($(e).offset().left);
            var columnHeight = parseInt($(e).height());
            var columnWidth = parseInt($(e).width());

            var mouseleft = mm_mouseX;
            //因为超过80，说明里面有控件了
            var linmingHeight = columnHeight < 80 ? columnHeight : 80;
            var mousetop = mm_mouseY;

            //鼠标在列的右下边
            var subTop = mousetop - colTop;
            var subleft = mouseleft - colLeft;
            var isInnerB = subTop > 0 && subTop < linmingHeight && subleft > 0 && Math.abs(subleft) < columnWidth;
            //console.info("列坐标：x:"+colLeft+";y:"+ colTop+"|鼠标坐标:"+mouseleft+";y:"+ mousetop+"subleft:"+subleft+"|结果："+isInnerB);
            return isInnerB;
          });
          //console.info("找到列：" + topColumns.length);
          //列和控件(排除容器控件)都有时，取Y轴差值最小者
          if (tops.length > 0 && topColumns.length > 0) {
            if ($(tops[0]).attr("ctrtype") == "extend_table") {
              tops = [];
            } else {
              var compontTop = parseInt($(tops[0]).offset().top);
              var colTop = parseInt($(topColumns[0]).offset().top);
              var compontSub = mm_mouseY - compontTop;
              var colSub = mm_mouseY - colTop;
              if (Math.abs(colSub) <= Math.abs(compontSub)) {
                tops = [];
              } else {
                topColumns = [];
              }
            }
          }
          if (tops.length > 0) {
            if (_isInsertComponentTop && tops.length == 1) {
              //光标所在控件的上边
              $(tops[0]).before($(positionLineHtml));
            } else {
              _isInsertComponentTop = false;
              //光标所在控件的下边
              $(tops[0]).after($(positionLineHtml));
            }

          } else if (topColumns.length > 0) {
            //找不到控件时，则进一步找出光标所在列
            var targetColumn = topColumns[0];
            if (topColumns.length > 1) {
              $.each(topColumns, function (i, c) {
                //优先取容器内的行列
                if ($(c).attr("subcontainer_id")) {
                  targetColumn = c;
                  return false;
                };
              });
            }
            $(targetColumn).append($(positionLineHtml));
            topColumns = [];
            topColumns.push(targetColumn);
          } else if ($thisColumn) {
            $thisColumn.append($(positionLineHtml));
          } else if ($tar_columns.length > 0 && type != "main") {
            //默认为所有列中的第一列
            $($tar_columns[0]).append($(positionLineHtml));
          }
        } else {
          $target_component.attr("style", "");

        }
      });

      $("body").delegate("#temp", "mouseup", function (mu) {
        mu.stopPropagation();
        var mu_mouseX = mu.pageX;
        var mu_mouseY = mu.pageY;
        var tar_pos = $target.position();
        //删除定位线
        $("hr.position-line").remove();

        //vue的变量定义
        var dataName = "fields";
        var $vm = myvm;

        //控制在有效范围内
        if (mu_mouseX + half_box_width > tar_pos.left &&
          mu_mouseX - half_box_width < tar_pos.left + $target.width() &&
          mu_mouseY + half_box_height > tar_pos.top &&
          mu_mouseY - half_box_height < tar_pos.top + $target.height() + 100
        ) {
          $temp.attr("style", null);
          var insertSuccess = false;
          if (tops.length > 0) {
            //插入到控件后
            var $topFormItem = $(tops[0]);
            var toOrderNum = parseInt($topFormItem.attr("ordernum"));
            var rowId = $topFormItem.attr("rowid");
            var colId = $topFormItem.attr("colid");

            var parentRowId = $topFormItem.attr("parent_rowid");
            var parentColId = $topFormItem.attr("parent_colid");
            var containerId = $topFormItem.attr("container_id");
            var subContainerId = $topFormItem.attr("subcontainer_id");
            var sub2ContainerId = $topFormItem.attr("sub2container_id");
            if (type == "main") {
              var jsonItem = $(".jsonItem", $temp).val();
              if (jsonItem) {
                var isCanAdd = true;
                var fieldItem = eval("(" + jsonItem + ")");
                if (fieldItem.buildtype && fieldItem.buildtype == "pageData") {
                  //从vue的数据中拿定义
                  var id = fieldItem.id;
                  var leftFieldListJson = myvm.leftFieldListJson || [];
                  var item = leftFieldListJson.find(f => f.id == id);
                  if (item) {
                    fieldItem = Object.toClone(item.data);
                  } else {
                    isCanAdd = false;
                    FUI.Window.showMsg("找不到控件定义");
                  }
                }
                if (isCanAdd) {
                  form_addField($vm, dataName, rowId, colId, fieldItem, toOrderNum, parentRowId, parentColId, containerId, subContainerId, sub2ContainerId, _isInsertComponentTop ? 'down' : 'plus');
                }
              } else {
                FUI.Window.showMsg("暂未实现此控件");
              }
            } else if (type == "form") {
              var formItemId = $($temp.html()).attr("id");
              var $topFormItem = $("#" + formItemId).parent();
              var formRowId = $topFormItem.attr("rowid");
              var formColId = $topFormItem.attr("id");
              var toRowId = rowId;
              var toColId = colId;


              var from_parentRowId = $topFormItem.attr("parent_rowid");
              var from_parentColId = $topFormItem.attr("parent_colid");
              var from_containerId = $topFormItem.attr("container_id");
              var from_subContainerId = $topFormItem.attr("subcontainer_id");
              var from_sub2ContainerId = $topFormItem.attr("sub2container_id");
              var to_parentRowId = parentRowId;
              var to_parentColId = parentColId;
              var to_containerId = containerId;
              var to_subContainerId = subContainerId;
              var to_sub2ContainerId = sub2ContainerId;

              form_dragField($vm, dataName, formRowId, formColId, formItemId, toRowId, toColId, toOrderNum, from_parentRowId, from_parentColId, from_containerId, from_subContainerId, from_sub2ContainerId, to_parentRowId, to_parentColId, to_containerId, to_subContainerId, to_sub2ContainerId, _isInsertComponentTop ? 'down' : 'plus');
            }
            insertSuccess = true;
          } else if (topColumns.length > 0) {
            //插入到找到的列中
            var $topCol = $(topColumns[0]);
            var rowId = $topCol.attr("rowid");
            var colId = $topCol.attr("id");
            var parentRowId = $topCol.attr("parent_rowid");
            var parentColId = $topCol.attr("parent_colid");
            var containerId = $topCol.attr("container_id");
            var subContainerId = $topCol.attr("subcontainer_id");
            var sub2ContainerId = $topCol.attr("sub2container_id");
            var toOrderNum = 99;
            if (type == "main") {
              var jsonItem = $(".jsonItem", $temp).val();
              if (jsonItem) {
                var fieldItem = eval("(" + jsonItem + ")");
                var isCanAdd = true;
                if (fieldItem.buildtype && fieldItem.buildtype == "pageData") {
                  //从vue的数据中拿定义
                  var id = fieldItem.id;
                  var leftFieldListJson = myvm.leftFieldListJson || [];
                  var item = leftFieldListJson.find(f => f.id == id);
                  if (item) {
                    fieldItem = Object.toClone(item.data);
                  } else {
                    isCanAdd = false;
                    FUI.Window.showMsg("找不到控件定义");
                  }
                }
                if (isCanAdd) {
                  form_addField($vm, dataName, rowId, colId, fieldItem, toOrderNum, parentRowId, parentColId, containerId, subContainerId, sub2ContainerId, 'plus');
                  isCanAdd = false;
                }

              } else {
                FUI.Window.showMsg("暂未实现此控件");
              }
            } else if (type == "form") {
              var formItemId = $($temp.html()).attr("id");
              var $topFormItem = $("#" + formItemId).parent();
              var formRowId = $topFormItem.attr("rowid");
              var formColId = $topFormItem.attr("id");
              var toRowId = rowId;
              var toColId = colId;

              var from_parentRowId = $topFormItem.attr("parent_rowid");
              var from_parentColId = $topFormItem.attr("parent_colid");
              var from_containerId = $topFormItem.attr("container_id");
              var from_subContainerId = $topFormItem.attr("subcontainer_id");
              var from_sub2ContainerId = $topFormItem.attr("sub2container_id");

              var to_parentRowId = parentRowId;
              var to_parentColId = parentColId;
              var to_containerId = containerId;
              var to_subContainerId = subContainerId;
              var to_sub2ContainerId = sub2ContainerId;
              form_dragField($vm, dataName, formRowId, formColId, formItemId, toRowId, toColId, toOrderNum, from_parentRowId, from_parentColId, from_containerId, from_subContainerId, from_sub2ContainerId, to_parentRowId, to_parentColId, to_containerId, to_subContainerId, to_sub2ContainerId);
            }
            insertSuccess = true;
          } else if ($thisColumn && type == "form") {
            //仅拖拽时才有此情况，放到原来列的最后面
            var formItemId = $($temp.html()).attr("id");
            var $topFormItem = $thisColumn;
            var formRowId = $topFormItem.attr("rowid");
            var formColId = $topFormItem.attr("id");
            var toRowId = formRowId;
            var toColId = formColId;

            var from_parentRowId = $topFormItem.attr("parent_rowid");
            var from_parentColId = $topFormItem.attr("parent_colid");
            var from_containerId = $topFormItem.attr("container_id");
            var from_subContainerId = $topFormItem.attr("subcontainer_id");

            var to_parentRowId = parentRowId;
            var to_parentColId = parentColId;
            var to_containerId = containerId;
            var to_subContainerId = subContainerId;
            var toOrderNum = 99;
            form_dragField($vm, dataName, formRowId, formColId, formItemId, toRowId, toColId, toOrderNum, from_parentRowId, from_parentColId, from_containerId, from_subContainerId, to_parentRowId, to_parentColId, to_containerId, to_subContainerId);
            //$($temp.html()).appendTo($thisColumn);

            insertSuccess = true;
          } else if ($tar_columns.length > 0 && type != "main") {
            $($temp.html()).appendTo($tar_columns[0]);
            insertSuccess = true;
          }
        } else {
          $("hr.position-line").remove();
          tops = [];
          topColumns = [];
        }
        isWorking = false;
        $(document).undelegate("body", "mousemove");
        $("body").undelegate("#temp", "mouseup");
        $temp.remove();
      });
    }, delays[type]);
    isWorking = false;
    $(document).mouseup(function () {
      clearInterval(delayed);
      return false;
    });
    $(document).dblclick(function () {
      $temp.remove();
    });
    $(this).mouseout(function () {
      clearInterval(delayed);
      return false;
    });
  });
};

function canceldrag() {
  isWorking = false;
  $(document).undelegate("body", "mousemove");
  $("body").undelegate("#temp", "mouseup");
  $("hr.position-line").remove();
  if ($temp) {
    $temp.remove();
  }
  $(".drap-form-item-virtual").remove();
}
//默认放在目标的下边
//容器内部的行列布局时：
//parentRowId:第一级行
//parentColId: 第一级列
//containerId: 大容器
//subContainerId: 子容器项
//sub2ContainerId: 孙容器项
function form_addField($vm, dataName, rowId, colId, fieldItem, toOrderNum, parentRowId, parentColId, containerId, subContainerId, sub2ContainerId, plusOrdown) {
  plusOrdown = plusOrdown || "plus";
  //检查表单字段控件是否已存在
  if (fieldItem.vModel) {
    var n = $("div[vModel='" + fieldItem.vModel + "']").length;
    if (n > 0) {
      canceldrag();
      FUI.Window.showMsg(null, "【" + fieldItem.label + "】已存在，不可重复摆放");
      return false;
    }
  }

  var data = $vm[dataName];
  if (fieldItem.fieldId) {
    fieldItem.id = "form_item_" + fieldItem.fieldId;
  } else {
    fieldItem.id = "form_item_" + Object.toGuid(false);
  }
  if (parentRowId == undefined) {
    var row = data.find(a => a.id == rowId);
    var col = row.children.find(a => a.id == colId);
    fieldItem.orderNum = plusOrdown == 'plus' ? toOrderNum + 0.5 : toOrderNum - 0.5;
    col.children.push(fieldItem);
    var fieldList = col.children;
    var newData = Object.dataSort(fieldList, "orderNum", false, true);
    col.children = newData;
  } else if (parentRowId && parentColId) {
    var prow = data.find(a => a.id == parentRowId);
    var pcol = prow.children.find(a => a.id == parentColId);
    var container = pcol.children.find(a => a.id == containerId);
    if (subContainerId) {
      if (sub2ContainerId) {
        //孙容器：表格容器的列
        var subContainer = container.children.find(a => a.id == subContainerId);
        var sub2Container = subContainer.children.find(a => a.id == sub2ContainerId);
        var row = sub2Container.children.find(a => a.id == rowId);
        var col = row.children.find(a => a.id == colId);
        var fieldList = col.children;
        fieldItem.orderNum = plusOrdown == 'plus' ? toOrderNum + 0.5 : toOrderNum - 0.5;
        fieldList.push(fieldItem);
        var newData = Object.dataSort(fieldList, "orderNum", false, true);
        col.children = newData;
      } else {
        var subContainer = container.children.find(a => a.id == subContainerId);
        var row = subContainer.children.find(a => a.id == rowId);
        var col = row.children.find(a => a.id == colId);
        var fieldList = col.children;
        fieldItem.orderNum = plusOrdown == 'plus' ? toOrderNum + 0.5 : toOrderNum - 0.5;
        fieldList.push(fieldItem);
        var newData = Object.dataSort(fieldList, "orderNum", false, true);
        col.children = newData;
      }

    } else {
      var row = container.children.find(a => a.id == rowId);
      var col = row.children.find(a => a.id == colId);
      var fieldList = col.children;
      fieldItem.orderNum = plusOrdown == 'plus' ? toOrderNum + 0.5 : toOrderNum - 0.5;
      fieldList.push(fieldItem);
      var newData = Object.dataSort(fieldList, "orderNum", false, true);
      col.children = newData;
    }
  }
};
//默认放在目标的下边
function form_dragField($vm, dataName, formRowId, formColId, formItemId, toRowId, toColId, toOrderNum, from_parentRowId, from_parentColId, from_containerId, from_subContainerId, from_sub2ContainerId, to_parentRowId, to_parentColId, to_containerId, to_subContainerId, to_sub2ContainerId, plusOrdown) {
  plusOrdown = plusOrdown || "plus";
  //这两个数据会互相影响
  var data = $vm[dataName];
  var todata = $vm[dataName];
  if (from_parentRowId && from_parentColId) {
    var prow = data.find(a => a.id == from_parentRowId);
    var pcol = prow.children.find(a => a.id == from_parentColId);
    var fromcontainer = pcol.children.find(a => a.id == from_containerId);
    if (from_subContainerId) {
      if (from_sub2ContainerId) {
        var from_subContainer = fromcontainer.children.find(a => a.id == from_subContainerId);
        var from_sub2Container = from_subContainer.children.find(a => a.id == from_sub2ContainerId);
        data = from_sub2Container.children;
      } else {
        var from_subContainer = fromcontainer.children.find(a => a.id == from_subContainerId);
        data = from_subContainer.children;
      }

    } else {
      data = fromcontainer.children;
    }
  }
  var toContainer = null;
  if (to_parentRowId && to_parentColId) {
    var to_prow = todata.find(a => a.id == to_parentRowId);
    var to_pcol = to_prow.children.find(a => a.id == to_parentColId);
    var to_container = to_pcol.children.find(a => a.id == to_containerId);
    if (to_subContainerId) {
      if (to_sub2ContainerId) {
        var to_subContainer = to_container.children.find(a => a.id == to_subContainerId);
        var to_sub2Container = to_subContainer.children.find(a => a.id == to_sub2ContainerId);
        toContainer = to_sub2Container;
      } else {
        var to_subContainer = to_container.children.find(a => a.id == to_subContainerId);
        toContainer = to_subContainer;
      }
      todata = toContainer.children;
    } else {
      todata = to_container.children;
      toContainer = to_container;
    }
  }
  if (!data) {
    return;
  }
  var row = data.find(a => a.id == formRowId);
  var col = row.children.find(a => a.id == formColId);
  var fieldList = col.children;
  var fieldItem = fieldList.find(a => a.id == formItemId);
  if (!fieldItem) {
    return false;
  }
  var fromFieldType = fieldItem.type;
  //如果是容器，不允再次拖放到容器中
  if ((fromFieldType == "table" || fromFieldType == "tabs" || fromFieldType == "container") && toContainer && (toContainer.type == 'tabpane' || toContainer.type == 'containerPane')) {
    FUI.Window.showMsg("不允许在容器中嵌套容器");
    return false;
  }
  if (formRowId == toRowId && formColId == toColId) {
    fieldItem.orderNum = plusOrdown == 'plus' ? toOrderNum + 0.5 : toOrderNum - 0.5;
    var newData = Object.dataSort(fieldList, "orderNum", false, true);
    col.children = newData;
  } else {
    var toRow = todata.find(a => a.id == toRowId);
    var toCol = toRow.children.find(a => a.id == toColId);
    var toFieldList = toCol.children;
    fieldItem.orderNum = plusOrdown == 'plus' ? toOrderNum + 0.5 : toOrderNum - 0.5;
    toFieldList.push(fieldItem);
    var newData = Object.dataSort(toFieldList, "orderNum", false, true);
    toCol.children = newData;

    //删除原来的
    var fieldList = fieldList.filter(a => a.id != formItemId);
    var newData2 = Object.dataSort(fieldList, "orderNum", false, true);
    col.children = newData2;
  }

};