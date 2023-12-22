
$(document).ready(function () {
  setTimeout(function () {
    load_excel_build();
  }, 2000);
});
var $temp;
function load_excel_build() {
  $("#excel_maincontainer").delegate(".component", "mousedown", function (md) {
    md.stopPropagation();
    md.preventDefault();
    var topColumns = [];
    var mouseX = md.pageX;
    var mouseY = md.pageY;
    var timeout;
    var $this = $(this);
    var $thisColumn = $this.parent();
    var delays = {
      main: 0,
      form: 120
    };
    var _is_drag_form_field = false;
    var isDrapFieldTitle = $("#drapFieldTitle").is(":checked");
    var type = "main";
    if ($this.parent()[0].tagName == "LI") {
      //表单字段
      if ($this.parent().parent().parent().hasClass("ctrs") || $this.parent().parent().parent().parent().parent().hasClass("ctrs")) {
        type = "main";
        $thisColumn = null;
      } else {
        type = "form";
      }
    } else {
      //系统字段
      if ($this.parent().hasClass("ctrs")) {
        type = "main";
        $thisColumn = null;
      } else {
        type = "form";
      }
    };
    var delayed = setTimeout(function () {
      _is_drag_form_field = true;
      //清除相关在线Excel事件
      if (excel) {
        var table = excel.getTableBySheetId("onlineSheet");
        excel.clearChosenCss(table);
        excel.clearPositionCss(table);
        var sheet = $("#onlineSheet");
        excel.clearChosenAareaP(sheet);
        excel.clearDurgEle(table, sheet);
      }
      var $cloneFormItem = null;
      console.info(type);
      if (type === "main") {
        if ($this.attr("filedid")) {
          //字段
          var inputHtml = "";
          var attributesJson = eval("(" + $this.attr("attributes") + ")");
          var fieldType = attributesJson.type;
          if (fieldType == "pageField") {
            //页面组件
            var ctrType = $this.attr("ctrType");
            inputHtml = $this.clone();
          } else if (fieldType == "table") {
            var tableId = attributesJson.tableId;
            var subtable = attributesJson.tableName;
            inputHtml = $this.clone();
            inputHtml.attr("filedid", "subtable." + subtable);
          } else {
            var columnId = attributesJson.columnId;
            var fieldName = $this.attr("filedid");
            var title = $this.attr("title");
            var preFix = fieldName.substring(0, fieldName.lastIndexOf("."));
            inputHtml = $this.clone();
          }
          if (inputHtml == "") {
            return false;
          }
          $cloneFormItem = $(inputHtml);
        } else if ($this.attr("ctr_type") == 'extend_process_vars') {
          //扩展字段
          $cloneFormItem = $this.clone();
          var ctr_type = $this.attr("ctr_type");
          var title = $(".label-title", $this).html();
          var fieldName = $(".jsonItem", $this).val();
          $cloneFormItem.attr("filedid", fieldName);
          $cloneFormItem.attr("title", title);
        };
        $temp = $("<form class='drap-form-item-excel-virtual'  id='temp'></form>").append($cloneFormItem);
      }
      $("body").append($temp);
      //鼠标在控件左上角
      $temp.css({
        "position": "absolute",
        "top": mouseY - 10 + "px",
        "left": mouseX - 20 + "px",
        "opacity": "0.9"
      }).show();
      var half_box_height = ($temp.height() / 2);
      var half_box_width = ($temp.width() / 2);
      var $target = $("#drapDesignContainer");// $("#target");
      var tar_pos = $target.position();
      var $tar_columns = $("#drapDesignContainer  td:visible").not($(".drug-ele-td"));
      var positionLineHtml = "<hr class=\"position-line\"/>";
      $(document).delegate("body", "mousemove", function (mm) {
        _is_drag_form_field = true;
        var mm_mouseX = mm.pageX;
        var mm_mouseY = mm.pageY;
        //鼠标在控件左上角
        $temp.css({
          "position": "absolute",
          "top": mm_mouseY - 10 + "px",
          "left": mm_mouseX - 20 + "px",
          "opacity": "0.9"
        }).show();
        if (mm_mouseX > tar_pos.left &&
          mm_mouseX < tar_pos.left + $target.width() + $temp.width() / 2 &&
          mm_mouseY > tar_pos.top &&
          mm_mouseY < tar_pos.top + $target.height() + $temp.height() / 2
        ) {
          //查找最近列
          $("hr.position-line").remove();
          topColumns = $.grep($tar_columns, function (e) {
            var colTop = parseInt($(e).offset().top);
            var columnHeight = parseInt($(e).height());
            var mousetop = mm_mouseY;
            var subTop = (columnHeight + colTop) - mousetop;
            var colLeft = parseInt($(e).offset().left);
            var mouseleft = mm_mouseX;
            var subleft = mouseleft - colLeft;
            return subTop > 0 && subTop < 100 && subleft > 0 && Math.abs(subleft) < 100;
          });
          if (topColumns.length > 0) {
            $(topColumns[0]).append($(positionLineHtml));

          } else if ($thisColumn) {
            $thisColumn.append($(positionLineHtml));
          }
          else if ($tar_columns.length > 0 && type != "main") {
            $($tar_columns[0]).append($(positionLineHtml));
          }
        }
      });

      $("body").delegate("#temp", "mouseup", function (mu) {
        _is_drag_form_field = false;
        var cellValue = "";
        var $htmlItem = $($temp.html());
        var title = $htmlItem.attr("title");
        var fieldName = $htmlItem.attr("filedid");
        if (isDrapFieldTitle && type == "main") {
          cellValue = title;
        } else {
          //cellValue="{"+fieldName+":"+title+"}";
          cellValue = "{" + fieldName + "}";
        }
        mu.preventDefault();
        var mu_mouseX = mu.pageX;
        var mu_mouseY = mu.pageY;
        var tar_pos = $target.position();
        $("#drapDesignContainer .component").css({ "border-top": "none", "border-bottom": "none" });
        $("hr.position-line").remove();
        //控制在有效范围内
        if (mu_mouseX + half_box_width > tar_pos.left &&
          mu_mouseX - half_box_width < tar_pos.left + $target.width() &&
          mu_mouseY + half_box_height > tar_pos.top &&
          mu_mouseY - half_box_height < tar_pos.top + $target.height()
        ) {
          $temp.attr("style", null);
          var insertSuccess = false;
          if (topColumns.length > 0) {
            topColumns[0].append(cellValue);
            insertSuccess = true;
          }
          else if ($thisColumn) {
            $thisColumn.append(cellValue);
            insertSuccess = true;
          }
          else if ($tar_columns.length > 0 && type != "main") {
            $($temp.html()).appendTo($tar_columns[0]);
            insertSuccess = true;
          }
          if (insertSuccess == true && isDrapFieldTitle == false) {
            setTimeout(function () {
              var itemId = $($temp.html()).attr("id");
              //$("#" + itemId).contextMenu('onlineFormItemMenu', formItemContextMenuOption);
            }, 100);
          }

        } else {
          $("#drapDesignContainer .component").css({ "border-top": "none", "border-bottom": "none" });
          $("hr.position-line").remove();
          tops = [];
          topColumns = [];
        }
        $(document).undelegate("body", "mousemove");
        $("body").undelegate("#temp", "mouseup");
        $temp.remove();

      });
    }, delays[type]);

    $(document).mouseup(function () {
      clearInterval(delayed);
      return false;
    });
    $(this).mouseout(function () {
      clearInterval(delayed);
      return false;
    });
  });
}


