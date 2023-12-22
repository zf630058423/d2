var $temp;
window.load_layout = function () {
  $("#onlinedesigner_maincontainer").delegate(".drag-box", "click", function (md) {
    md.preventDefault();
    md.stopPropagation();
    $('.drag-row-tool-bar').removeClass("active");
    $('.drag-row-tool-bar:first', $(this)).addClass("active");
    console.info(".drag-box click");

  });
  $("#onlinedesigner_maincontainer").delegate(".drag-label", "mousedown", function (md) {
    md.stopPropagation();
    md.preventDefault();
    var btnNum = md.button;
    if (btnNum == 2) {
      return false;
    }
    var delayed = null;
    //防止双击事件
    if ($(".drag-row-box-virtual").length > 0) {
      clearInterval(delayed);
      layout_cleanDrap();
      return false;
    }
    var tops = [];
    var topContainer = [];
    var mouseX = md.pageX;
    var mouseY = md.pageY;
    var timeout;
    var $this = $(this).parent().parent();
    var delays = {
      main: 0,
      form: 0
    };
    var type;

    if ($this.parent().attr("id") === "drap_boxs") {
      type = "main";
    } else {
      type = "form";
    }

    delayed = setTimeout(function () {
      var $target = $("#drapDesignContainer");
      var temwidht = $this.width();
      if (temwidht < 300) temwidht = 300;
      if (type === "main") {
        var $cloneRow = $this.clone();
        $temp = $("<form class='drag-row-box-virtual' type='main'  style='width:" + temwidht + "px; ' id='temp'></form>").append($cloneRow);
      } else {
        var $cloneRow = $this.clone();
        $(".drag-row-tool-bar", $cloneRow).remove();

        $temp = $("<form class='drag-row-box-virtual' rowid='" + $this.attr("id") + "' type='form' style='width:" + temwidht + "px; '  id='temp'></form>").append($cloneRow);
      }
      $("body").append($temp);
      $temp.css({
        "position": "absolute",
        "top": mouseY - 10 + "px",
        "left": mouseX - 60 + "px",
        "opacity": "0.9"
      }).show();


      var half_box_height = ($temp.height() / 2);
      var half_box_width = ($temp.width() / 2);

      var tar_pos = $target.position();
      var $tar_containers = $("#drapDesignContainer .container");
      var $target_rows = $("#drapDesignContainer .drag-row");
      var positionLineHtml = "<hr class=\"position-line\"/>";
      var $drapDesignContainer = $("#drapDesignContainer");
      $(document).delegate("body", "mousemove", function (mm) {
        mm.stopPropagation();
        var mm_mouseX = mm.pageX;
        var mm_mouseY = mm.pageY;
        $temp.css({
          "top": (mm_mouseY - 10) + "px",
          "left": (mm_mouseX - 60) + "px"
        });
        //清样式
      /*   $target_rows.css({ "border-top": "none", "border-bottom": "none" });
        $tar_containers.css({ "border-top": "none", "border-bottom": "none" }); */
        $("hr.position-line").remove();
        if (mm_mouseX > (tar_pos.left - 200) &&
          mm_mouseX < (tar_pos.left + $target.width() + $temp.width() / 2) &&
          mm_mouseY > tar_pos.top &&
          mm_mouseY < (tar_pos.top + $target.height() + $temp.height() / 2+100)) {
          //找行
          tops = $.grep($target_rows, function (e) {
            var rowTop = parseInt($(e).offset().top);
            var rowheight = parseInt($(e).height());
            var half = rowheight > 100 ? 100 : rowheight;
            var mousetop = mm_mouseY;
            var sub = mousetop - rowTop;
            var title = $(".form-section-title", $(e)).html();
            return sub > 0 && sub < half;
          });
          //查找容器
          topContainer = $.grep($tar_containers, function (e) {
            var ctTop = parseInt($(e).offset().top);
            var ctHeight = parseInt($(e).height());
            var mousetop = mm_mouseY + half_box_height;
            var subTop = (ctHeight + ctTop) - mousetop;

            var colLeft = parseInt($(e).offset().left);
            var mouseleft = mm_mouseX - 60;
            var subleft = mouseleft - colLeft;
            return subTop > 0 && subTop < 150 && subleft > 0 && Math.abs(subleft) < 150;
          });
          //console.info("找到容器数：" + topContainer.length)
          //容器和行都有时，看谁的X轴更小
          if (tops.length > 0 && topContainer.length > 0) {
            var rowLeft = parseInt($(tops[0]).offset().left);
            var containerLeft = parseInt($(topContainer[0]).offset().left);
            var rowLeftSub = mm_mouseX - rowLeft;
            var containerSub = mm_mouseX - containerLeft;
            if (Math.abs(containerSub) <= Math.abs(rowLeftSub)) {
              tops = [];
            } else {
              topColumns = [];
            }
          }
          if (tops.length > 0) {
           /*  $(tops[0]).css("border-top", "2px solid #22aaff"); */
            $(tops[0]).before($(positionLineHtml))
          } else if (topContainer.length > 0) {
            //找最近的容器
           /*  $(topContainer[0]).css("border-top", "2px solid #22aaff"); */
            $(topContainer[0]).append($(positionLineHtml));
          } else {
            //没有找到任何容器时，放到面板容器中最后一行
            $("#drapDesignContainer").append($(positionLineHtml));
          }
        } else {
          /* $target_rows.css({ "border-top": "none", "border-bottom": "none" }); */
         /*  $tar_containers.css({ "border-top": "none", "border-bottom": "none" }); */
          $("hr.position-line").remove();
          $target.css("background-color", "#fff");
        }
      });

      $("body").delegate("#temp", "mouseup", function (mu) {
        mu.preventDefault();
        var mu_mouseX = mu.pageX;
        var mu_mouseY = mu.pageY;
        var tar_pos = $target.position();
        $("hr.position-line").remove();
       /*  $("#drapDesignContainer .drag-row").css({ "border-top": "none", "border-bottom": "none" }); */
      /*   $("#drapDesignContainer .container").css({ "border-top": "none", "border-bottom": "none" }); */
        //vue的变量定义
        var dataName = "fields";
        var $vm = myvm;

        //控制在有效范围内
        if (mu_mouseX + half_box_width > tar_pos.left &&
          mu_mouseX - half_box_width < tar_pos.left + $target.width() &&
          mu_mouseY + half_box_height > tar_pos.top &&
          mu_mouseY - half_box_height < tar_pos.top + $target.height()+100
        ) {
          $temp.attr("style", null);
          var rowId = $(".drag-row", $temp).attr("id");
          var type = $temp.attr("type");
          if (tops.length > 0) {
            if (type == 'main') {
              var $top = $(tops[0]);
              var colSpans = $("input", $temp).val().split(",");
              var toOrderNum = parseFloat($top.attr("ordernum"));

              var toRowId = $top.attr("parent_rowid");
              var toColId = $top.attr("parent_colid");
              var containerId = $top.attr("container_id");
              var subcontainerId = $top.attr("subcontainer_id");
              var sub2containerId = $top.attr("sub2container_id") || "";
              if (toRowId && toColId && containerId && subcontainerId) {
                //拖到容器行中间
                layout_addRowToContainer($vm, dataName, toOrderNum, colSpans, "", toRowId, toColId, containerId, subcontainerId, sub2containerId);
              } else {
                layout_addRow($vm, dataName, toOrderNum, colSpans);
              }
            } else if (type == 'form') {
              var rowId = $temp.attr("rowid");
              var $rowDom = $(".drag-row", $temp);
              var $top = $(tops[0]);
              var toOrderNum = parseFloat($top.attr("ordernum"));
              var from_parentRowId = $rowDom.attr("parent_rowid");
              var from_parentColId = $rowDom.attr("parent_colid");
              var from_containerId = $rowDom.attr("container_id");
              var from_subContainerId = $rowDom.attr("subcontainer_id");
              var from_sub2ContainerId = $rowDom.attr("sub2container_id");

              var to_parentRowId = $top.attr("parent_rowid");
              var to_parentColId = $top.attr("parent_colid");
              var to_containerId = $top.attr("container_id");
              var to_subContainerId = $top.attr("subcontainer_id");
              var to_sub2ContainerId = $top.attr("sub2container_id");
              layout_dragRow($vm, dataName, toOrderNum, rowId, from_parentRowId, from_parentColId, from_containerId, from_subContainerId, from_sub2ContainerId, to_parentRowId, to_parentColId, to_containerId, to_subContainerId, to_sub2ContainerId);
            }
          } else if (topContainer.length > 0) {
            //找到最近的容器
            if (type == 'main') {
              var colSpans = $("input", $temp).val().split(",");
              var $targetContainer = $(topContainer[0]);
              var toOrderNum = 99;
              var toRowId = $targetContainer.attr("rowid");
              var toColId = $targetContainer.attr("colid");
              var containerId = $targetContainer.attr("container_id");
              var subcontainerId = $targetContainer.attr("subcontainer_id");
              var sub2containerId = $targetContainer.attr("sub2container_id");
              layout_addRowToContainer($vm, dataName, toOrderNum, colSpans, "", toRowId, toColId, containerId, subcontainerId, sub2containerId);
            } else if (type == 'form') {
              //拖放到此容器最后一行
              var rowId = $temp.attr("rowid");
              var $rowDom = $(".drag-row", $temp);
              var $targetContainer = $(topContainer[0]);
              var toOrderNum = 99;
              var from_parentRowId = $rowDom.attr("parent_rowid");
              var from_parentColId = $rowDom.attr("parent_colid");
              var from_containerId = $rowDom.attr("container_id");
              var from_subContainerId = $rowDom.attr("subcontainer_id");
              var from_sub2ContainerId = $rowDom.attr("sub2container_id");

              var to_parentRowId = $targetContainer.attr("rowid");
              var to_parentColId = $targetContainer.attr("colid");
              var to_containerId = $targetContainer.attr("container_id");
              var to_subContainerId = $targetContainer.attr("subcontainer_id");
              var to_sub2ContainerId = $targetContainer.attr("sub2container_id");
              layout_dragRow($vm, dataName, toOrderNum, rowId, from_parentRowId, from_parentColId, from_containerId, from_subContainerId, from_sub2ContainerId, to_parentRowId, to_parentColId, to_containerId, to_subContainerId, to_sub2ContainerId);
            }
          } else {
            //放到设置面板的最后面
            if (type == 'main') {
              var colSpans = $("input", $temp).val().split(",");
              var toOrderNum = $vm[dataName].length + 2;
              layout_addRow($vm, dataName, toOrderNum, colSpans);
            } else if (type == 'form') {
              var rowId = $temp.attr("rowid");
              var $rowDom = $(".drag-row", $temp);
              var data = $vm[dataName];
              var toOrderNum = data[data.length - 1].orderNum + 1;
              var from_parentRowId = $rowDom.attr("parent_rowid");
              var from_parentColId = $rowDom.attr("parent_colid");
              var from_containerId = $rowDom.attr("container_id");
              var from_subContainerId = $rowDom.attr("subcontainer_id");
              var from_sub2ContainerId = $rowDom.attr("sub2container_id");
              layout_dragRow($vm, dataName, toOrderNum, rowId, from_parentRowId, from_parentColId, from_containerId, from_subContainerId, from_sub2ContainerId);
            }
          }

        } else {
          // no add
          /* $("#drapDesignContainer .drag-row").css({ "border-top": "none", "border-bottom": "none" }); */
        /*   $("#drapDesignContainer .container").css({ "border-top": "none", "border-bottom": "none" }); */
          $("hr.position-line").remove();
          tops = [];
          topContainer = [];
        }
        $target.css("background-color", "#fff");
        //释放拖拽事件
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
};

function layout_cleanDrap() {
  $(document).undelegate("body", "mousemove");
  $("body").undelegate("#temp", "mouseup");
  if ($temp) {
    $temp.remove();
  }
  $(".drag-row-box-virtual").remove();
}
function layout_addRow($vm, dataName, toOrderNum, colSpans, rowId, label) {
  var data = $vm[dataName];
  rowId = rowId || 'row_' + Object.toGuid(false);
  label = label || "";
  var rowEmptyItem = Object.toDeepClone(row_template);
  rowEmptyItem.id=rowId;

  var spanArr = colSpans;
  $.each(spanArr, function (_, spanValue) {
    spanValue = parseInt(spanValue);
    rowEmptyItem.children.push({ type: 'col', id: 'col_' + Object.toGuid(false), label: label, span: spanValue, style: '', children: [] });
  });
  rowEmptyItem.orderNum = toOrderNum - 0.5;
  data.push(rowEmptyItem);
  var newData = Object.dataSort(data, "orderNum", false, true);
  $vm[dataName] = newData ? newData : $vm[dataName];
}

function layout_addRowToContainer($vm, dataName, toOrderNum, colSpans, label, toRowId, toColId, toContainerId, subContainerId, sub2ContainerId) {
  var data = $vm[dataName];
  rowId = 'row_' + Object.toGuid(false);
  label = label || "";
  var rowEmptyItem = Object.toDeepClone(row_template);
  rowEmptyItem.id=rowId;
  var spanArr = colSpans;
  $.each(spanArr, function (_, spanValue) {
    spanValue = parseInt(spanValue);
    rowEmptyItem.children.push({ type: 'col', id: 'col_' + Object.toGuid(false), label: label, span: spanValue, style: '', children: [] });
  });
  rowEmptyItem.orderNum = toOrderNum - 0.5;

  //找到容器
  var row = data.find(a => a.id == toRowId);
  var col = row.children.find(a => a.id == toColId);
  var container = col.children.find(a => a.id == toContainerId);
  if (subContainerId) {
    if (sub2ContainerId) {
      var subct = container.children.find(a => a.id == subContainerId);
      var sub2ct = subct.children.find(a => a.id == sub2ContainerId);
      sub2ct.orderNum = toOrderNum - 0.5;
      sub2ct.children.push(rowEmptyItem);
      var newData = Object.dataSort(sub2ct.children, "orderNum", false, true);
      sub2ct.children = newData;
    } else {
      var subct = container.children.find(a => a.id == subContainerId);
      subct.orderNum = toOrderNum - 0.5;
      subct.children.push(rowEmptyItem);
      var newData = Object.dataSort(subct.children, "orderNum", false, true);
      subct.children = newData;
    }
  } else {
    container.orderNum = toOrderNum - 0.5;
    container.children.push(rowEmptyItem);
    var newData = Object.dataSort(container.children, "orderNum", false, true);
    container.children = newData;
  }

}

function layout_dragRow($vm, dataName, toOrderNum, rowId, fromParentRowId, fromParentColId, fromContainerId, fromSubContainerId,
  toParentRowId, toParentColId, toContainerId, toSubContainerId) {
  var data = $vm[dataName];

  var fromData = null;
  var todata = null;
  var fcontainer = null;
  var tcontainer = null;
  if (fromParentRowId && fromParentColId) {
    var prow = data.find(a => a.id == fromParentRowId);
    var pcol = prow.children.find(a => a.id == fromParentColId);
    var fromcontainer = pcol.children.find(a => a.id == fromContainerId);
    if (fromSubContainerId) {
      if (fromSub2ContainerId) {
        var from_subContainer = fromcontainer.children.find(a => a.id == fromSubContainerId);
        var from_sub2Container = from_subContainer.children.find(a => a.id == fromSub2ContainerId);
        fromData = from_sub2Container.children;
        fcontainer = from_sub2Container;
      } else {
        var from_subContainer = fromcontainer.children.find(a => a.id == fromSubContainerId);
        fromData = from_subContainer.children;
        fcontainer = from_subContainer;
      }
    } else {
      fromData = fromcontainer.children;
      fcontainer = fromcontainer;
    }
  }
  if (toParentRowId && toParentColId) {
    var to_prow = data.find(a => a.id == toParentRowId);
    var to_pcol = to_prow.children.find(a => a.id == toParentColId);
    var to_container = to_pcol.children.find(a => a.id == toContainerId);
    if (toSubContainerId) {
      if (toSub2ContainerId) {
        var to_subContainer = to_container.children.find(a => a.id == toSubContainerId);
        var to_sub2Container = to_subContainer.children.find(a => a.id == toSub2ContainerId);
        todata = to_sub2Container.children;
        tcontainer = to_sub2Container;
      } else {
        var to_subContainer = to_container.children.find(a => a.id == toSubContainerId);
        todata = to_subContainer.children;
        tcontainer = to_subContainer;
      }
    } else {
      todata = to_container.children;
      tcontainer = to_container;
    }
  }

  if (!fromParentRowId && !fromParentColId && !toParentRowId && !toParentColId) {
    //外部行与行之间拖动
    var myRow = data.find(a => a.id == rowId);
    myRow.orderNum = toOrderNum - 0.5;
    var newData = Object.dataSort(data, "orderNum", false, true);
    $vm[data] = newData;
  } else if (fromParentRowId && fromParentColId && toParentRowId && toParentColId) {
    if (fromParentRowId && fromParentColId && fromContainerId == toContainerId && fromSubContainerId == toSubContainerId) {
      //========【相同的小容器内部的行拖动】========
      var myRow = fromData.find(a => a.id == rowId);
      myRow.orderNum = toOrderNum - 0.5;
      var newData = Object.dataSort(fromData, "orderNum", false, true);
      fcontainer.children = newData;
    } else if (fromParentRowId && fromParentColId && fromSubContainerId != toSubContainerId) {
      //========【不同小容器之间的拖动】========
      var myRow = fromData.find(a => a.id == rowId);
      myRow.orderNum = toOrderNum - 0.5;
      fromData = fromData.filter(a => a.id != rowId);
      fcontainer.children = fromData;
      //加到目标
      todata.push(myRow);
      var newData = Object.dataSort(todata, "orderNum", false, true);
      tcontainer.children = newData;
    }
  } else if (!fromParentRowId && toParentRowId) {
    //========【容器外拖动到容器内】========
    console.info("容器外拖动到容器内");
    var myRow = data.find(a => a.id == rowId);
    myRow.orderNum = toOrderNum - 0.5;
    //将行加到容器内
    todata.push(myRow);
    var newData = Object.dataSort(todata, "orderNum", false, true);
    tcontainer.children = newData;
    //删除容器外的行
    var fromData = data.filter(a => a.id != rowId);
    $vm[dataName] = fromData ? fromData : $vm[dataName];

  } else if (fromParentRowId && !toParentRowId) {
    //========【容器内拖动到容器外】========
    console.info("容器内拖动到容器外");
    var myRow = fromData.find(a => a.id == rowId);
    myRow.orderNum = toOrderNum - 0.5;
    //删除容器内的行
    fromData = fromData.filter(a => a.id != rowId);
    fcontainer.children = fromData;
    //将行加到容器外
    data.push(myRow);
    var newData = Object.dataSort(data, "orderNum", false, true);
    $vm[dataName] = newData ? newData : $vm[dataName];
  }

  setTimeout(function () {
    $('.drag-row-tool-bar').removeClass("active");
    $('.drag-row-tool-bar', $("#" + rowId)).addClass("active");
  }, 90);
}

