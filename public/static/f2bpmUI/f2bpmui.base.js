/*******************************************************************************
 *
 * 基础的上下文对象
 * 邮箱: 1827528476
 * 日期: 2020-11-11
 * 版权：广州致博软件科技有限公司
 *
 ******************************************************************************/

//防止IE进行数据缓存
$.ajaxSetup({ cache: false });
//全局变量
var F2Global = {}

//对象类
function FUIObject() {
}

function WFObject() {

}

var FUI = new FUIObject();
//WF的封装通用工具类
var WF = new WFObject();
//本站项目前缀项目名 
var __webpath = "";
//var __webpath = "/f2web";
//本地国际化语言
var __f2bpmLanguage=localStorage.getItem('f2bpm-language') ? localStorage.getItem('f2bpm-language') : 'zh-CN';
$(function () {
  setTimeout(function () {
    autoPageHeight();
  }, 1000);
  //自动适应窗口高度
  $(window).resize(function () {
    autoPageHeight();
  });
});
function autoPageHeight() {
  $(".auto-window-height-select").height($(window).height() - 50);
  $(".auto-window-height-content").height($(window).height()-30);
  $(".auto-window-height").height($(window).height() - 100);
  $(".auto-window-height-small").height($(window).height() - 120);
  $(".auto-window-height-smaller").height($(window).height() - 140);
  $(".auto-window-height-full-200").height($(window).height() - 200);
  $(".auto-window-height-full-250").height($(window).height() - 250);
}

//=========富文本编辑的编辑的数据赋值到输入框中=========
function fui_global_richeditorArrValueToInput($vm) {
  if (undefined != richeditorArr && richeditorArr != null && richeditorArr.length > 0) {
    for (var i = 0; i < richeditorArr.length; i++) {
      var name = richeditorArr[i].name;
      var html = richeditorArr[i].editor.getContent();
      //过滤
      var result = filterXSS(html);
      var arr = name.split(".");
      if (arr.length >= 3) {
        //如果是子列表时,dataSelf为子列表所在行的数据对象
        if (richeditorArr[i].dataSelf && richeditorArr[i].dataSelf.hasOwnProperty(name)) {
          richeditorArr[i].dataSelf[name] = result;
        }
      } else {
        $vm.data[name] = result;
      }
    }
  }
}