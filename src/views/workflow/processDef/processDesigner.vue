<template>
  <div class="f2bpm-page-layout">
    <el-container>
      <el-main class="f2bpm-page-right">
        <form id="form1">
          <div id="layoutDiv" style="width: 100%; overflow: hidden;">
            <div id="northDiv" style="height: 80px;">
              <div style="font-size: 20px;">
                <div id="headRibbon" class="layui-tab F2Workflow" style="width: 100%; border-bottom: solid 1px silver; height: 80px; overflow: hidden">
                  <ul targetId="my-f2bpm-tab-content" class="f2bpm-tab-title">
                    <li>开始</li>
                    <li class="f2bpm-this">流程设计</li>
                    <li>使用帮助</li>
                  </ul>
                  <div id="my-f2bpm-tab-content" class="f2bpm-tab-content">
                    <div title="开始" class="f2bpm-tab-item">
                      <div class="ribbon-group">
                        <div class="ribbon-toolbar" style="padding: 5px;  ">
                          <img id="saveWorkflowImg" style="cursor: pointer" src="/static/f2bpmDesigner/image/save.png" onclick="saveWorkflowDesigner()" title="保存流程">
                        </div>
                      </div>
                      <div class="ribbon-group-sep" />
                      <div id="F2Workflow_myhead" class="ribbon-group " style="display: inline-block; float: left;width: 700px;   font-size: 12px;">
                        <div id="f2bpm_head_buttons" />
                      </div>
                    </div>
                    <div title="流程设计" class="f2bpm-tab-item f2bpm-tab-item-show">
                      <div class="ribbon-group">
                        <div class="ribbon-toolbar" style="padding: 5px;">
                          <img id="saveWorkflowImg2" style="cursor: pointer" src="/static/f2bpmDesigner/image/save.png" onclick="saveWorkflowDesigner()" title="保存流程">
                        </div>
                      </div>
                      <div class="ribbon-group-sep" />
                      <div class="ribbon-group">
                        <div id="f2bpm_head_act_operator_toolbar" />
                      </div>
                      <div class="ribbon-group">
                        <div id="f2bpm_head_act_toolbar" />
                      </div>
                    </div>
                    <div title="使用帮助" class="f2bpm-tab-item">
                      <div class="ribbon-group" style="line-height:20px">
                        <span onclick="drapMapOperationHelper()" style="display: inline-block;">画图操作</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div id="centerDiv" style="overflow: hidden;">
              <div id="f2bpmflow" style="float: left;" />
              <div id="east" style="width: 320px; float: right; overflow-x: hidden; overflow-y: auto;background-color: #fff">
                <div id="right" style="margin-left: 10px; width: 320px; overflow-y: hidden; background-color: #fff">
                  <table id="mytable" class="mytable" />
                </div>
              </div>
            </div>
          </div>
        </form>
      </el-main>
    </el-container>
  </div>
</template>

<script>
  window.oper = 1;// 用于保存的 操作:0 add,1 update,2Upgrade。
  window.isSysWorking = false;// 是否系统加载中。
  window.wfData = {};
  var wid = Object.toQueryString('wid');
  var procInfoType = Object.toQueryString('procInfoType') || "";
  var categoryCode = Object.toQueryString('categoryCode') || "";

  window.prodessDefData = Object.toAjaxJson('/workflow/processDef/', 'getProcessDesignerJson', { "wid": wid, "categoryCode": categoryCode, "procInfoType": procInfoType });
  window.wf = prodessDefData.data.xmlToJson;
  window.wfClone = $.extend(true, {}, wf);
  window.gf = prodessDefData.data.designerJson;
  window.gfClone = $.extend(true, {}, gf);
  window.wfTemp = {};
  window.wfNodeTemp = {};
  window.wfLineTemp = {};
  function initTemp() {
    var jsonTemp = prodessDefData.data.xmlTempToJson;
    var alist = jsonTemp.ProcessDef.ActivityList;
    wfNodeTemp = (alist.Activity instanceof Array) ? alist.Activity[0] : alist.Activity;
    wfLineTemp = wfNodeTemp.TransitionList.Transition;
    jsonTemp.ProcessDef.ActivityList.Activity = [];
    wfNodeTemp.TransitionList.Transition = [];
    wfTemp = jsonTemp;
  }
  initTemp();
  var openDesign = true;
  window.openDesign = true;
  window.designer = null;
  window.focusID = null;
  window.focusType = null;
  $(function () {
    if (window.location.toString().indexOf('localhost') > -1) {
      this.title = '流程设计器';
      $('#productTitle').html(this.title);
    } else {
      this.title = '流程设计器';
    }
    setTimeout(function () {
      var saveImgSrc = __webpath + "/static/f2bpmDesigner/image/save.png";
      $("#saveWorkflowImg").attr("src", saveImgSrc);
      $("#saveWorkflowImg2").attr("src", saveImgSrc);
      $('.f2bpm-tab-title li').click(function () {
        var index = $(this).index();
        $('.f2bpm-tab-title li').removeClass('f2bpm-this');
        $(this).addClass('f2bpm-this');

        var targetId = $(this).parent().attr('targetId');
        var $targetContent = $('#' + targetId);
        $('div.f2bpm-tab-item', $targetContent).removeClass('f2bpm-tab-item-show');
        $("div.f2bpm-tab-item:eq('" + index + "')", $targetContent).addClass('f2bpm-tab-item-show');
      }
      );
    }, 1000);
  });

  var isJson = false;
  var editValue;
  window.dg;
  window.loadFlowDesigner = function () {
    $('#northDiv').css('background', "url('" + __webpath + "/static/f2bpmDesigner/image/flowdesingerBnnnerBg.png')");
    designer = F2BPM.FlowDesigner.create('f2bpmflow');
    //画布的大小，默认为宽5000，高3000
    designer.canvasHeight=5000;
    designer.canvasWidth=8000;
    designer.designerPath = __webpath + '/static/f2bpmDesigner';
    isSysWorking = true;
    if (wf && wf != '' && $.isEmptyObject(wf) != true) {
      designer.loadFlowData(gf);
    }
    isSysWorking = false;
    var buttons = designer.headButtons;
    buttons.push({ name: 'importactivity', title: '导入其它流程节点', alt: '导入其它流程的节点', fa: ' fa-deafness' });
    buttons.push({ name: 'configurationCheckView', title: '流程配置检查', alt: '流程配置检查', fa: ' fa-search' });
    designer.onExtendClick = function (name, domThis) {
      if (name == 'importactivity') {
        FUI.Window.confirm('前当前流程图如果有修改请先点击左上角的保存按钮，然后再进行导入其它流程节点。避免当前所做的修改没有保存。点击“取消”去保存当前流程的修改，点击“确定”继续进入导入其它流程节点？', '温馨提示', function (r) {
          FUI.Window.openEdit('/workflow/flowDesigner/importActivity/?wid=' + Object.toQueryString('wid'), '导入其它流程节点', 'edit', null, 700, 500, null, '', '');
        });
      } else if (name == 'configurationCheckView') {
        FUI.Window.confirm('“流程配置检查”只能看到保存后的配置，如有流程修改未保存，前请先保存流程，再点击“流程配置检查”。点击“取消”去保存当前流程的修改，点击“确定”继续进流程配置检查？', '温馨提示', function (r) {
          FUI.Window.openEdit('/workflow/flowDesigner/configurationCheckView/?wid=' + Object.toQueryString('wid'), '流程配置检查', 'edit', null, 700, 500, null, '', '', true);
        });
      }
    };
    designer.bind();
    var tableColumn = [{
      field: 'group',
      title: '分组',
      width: 20,
      hide: true,
      align: 'center'
    }, {
      field: 'orderno',
      title: 'No',
      hide: true,
      width: 40,
      sort: true,
      align: 'left'
    }, {
      field: 'name',
      title: '名称',
      width: 140,
      align: 'left',
      formatter: formatterAdaptName
    }, {
      field: 'value',
      title: '值',
      align: 'left',
      formatter: formatterAdaptvalue
    }];
    dg = FUI.DataTable.Create('mytable');
    dg.SortName = 'orderno';
    dg.Columns = tableColumn;
    dg.Bind();

    if (!wf || $.isEmptyObject(wf)) {
      designer.onButtonNewClick();
    }
    designer.onFlowTitleClick();
    window.windLoad();
  };
  $(function () {
    setTimeout(function () {
      window.loadFlowDesigner();
    }, 500);
  });
  window.saveWorkflowDesigner = function () {
    designer.onButtonSaveClick();
  };
  window.formatterAdaptName = function (value, row, index) {
    return designer.formatName(row.name, row, index);
  };
  window.formatterAdaptvalue = function (value, row, index) {
    return designer.formatValue(row.value, row, index);
  };

  window.currentWindowTargetObjectValue = null;
  window.setTargetValue = function (name, resultValue) {
    var objId = designer.currEidtObjId;
    var objtype = designer.currEidtObjType;
    designer.updateAttrToWfData(objId, objtype, name, resultValue, 'content');
  };
  window.drapMapOperationHelper = function () {
    let node = "1、节点画法：拖拽节点到画板上画出节点，当节点跟随没释放时，点击一下鼠标左键即可。<br> 2、线画法：选择工具条上的迁移连线，然后在画板上从节点点击拖向另一个节点 。3、折线和多段线画法：点击节点之间的迁移线，可选择直线、折线、多段线并对折线进行位置调整。4、点击节点上的图标对节点进行位置移动操作。5、双击节点可修改节点文字。6、点击标尺工具可画参考线，参考线只在画图时辅助作用，并不会保存持久化";
    FUI.Window.showMsg(node, null, 1);
  };
  window.windLoad = function () {
    var height = $(window).height() - 90;
    var width = $(window).width() - 320;
    $('#east').height(height);
    if (designer) {
      designer.reinitDrawingSize(width, height);
    }
    $(window).resize(function () {
      height = $(window).height() - 90;
      width = $(window).width() - 320;
      if (designer) {
        designer.reinitDrawingSize(width, height);
      }
      $('#east').height(height - 100);
    });
  }

</script>
<style>
  @import "/static/f2bpmDesigner/f2bpm.flowdesigner.css";

  .datagrid-cell {
    line-height: 30px;
  }

  .flow-grid-attrname {
    font-weight: bold;
    display: inline-block;
    color: #414c67;
  }

  .polyline {
    background-color: #FF7F15;
    color: #fff
  }

  .ribbon-group {
    display: inline-block;
    float: left;
    font-size: 12px;
    padding-top: 5px;
  }

  .ribbon-group-sep {
    display: inline-block;
    float: left;
    border-left: 1px solid silver;
    border-right: 1px solid #fff;
    height: 47px;
    margin-right: 10px;
    margin-left: 10px;
  }
</style>