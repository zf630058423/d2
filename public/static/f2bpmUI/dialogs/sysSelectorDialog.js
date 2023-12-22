/*******************************************************************************
 * 
 * 工作流选择对话框
 * 
 * 作者：luoxw
 * 邮箱: 1827528476 
 * 日期: 2016-5-14
 * 版权：广州致博软件科技有限公司
 * 
 ******************************************************************************/
//选择对话框
var Sys = {};
Sys.SelectorDialog = {
    selectResource: _selectResource,
    selectResourceCallBack:_selectResourceCallBack
};


//选择菜单资源
//inputKey:存放Key的输入框ID,多个之间使用英文逗号隔开
//inputName：存放标题文字的输入框ID
//singleSelect:true单选,false多选，默认单选
//checkedIds:初始化选中的菜单，多个之间使用英文逗号隔开
//vueDataObj回填写的对象，默认为$vm.data  可传入示例$vm.data.parms
function _selectResource($vm,inputKey, inputName,  singleSelect,vueDataObj) {
    var targetBindData=vueDataObj?vueDataObj:$vm.data;
    var initablValue =targetBindData[inputId]|| "";
	checkedIds=checkedIds||"";
    if (singleSelect == undefined) {
        singleSelect = true;
    }
    var parm;
    if (initablValue == "" || inputName == null || inputKey == null) {
        parm = {  singleSelect: singleSelect,  checkedIds: checkedIds }
    }
    else {
        var ids =initablValue;
        for (index in ids) {
            parm = {  singleSelect: singleSelect, checkedIds:ids}
        }
    }
    FUI.dialog(__webpath + "/admin/resource/selectResource/", "选择菜单资源", parm, 350, 520, function (objectData, index,layer) {
        if (objectData.length > 0) {
            var ids = [];
            var titles = [];
            $.each(objectData, function (i, item) {
                ids.push(item.nodeId);
                titles.push(item.context);
            })
            targetBindData[inputId]=ids.toString();
            targetBindData[inputName]=titles.toString();

        }
        else {
            targetBindData[inputId]="";
            targetBindData[inputName]="";
        }
        layer.close(index);;
    }, true);
}

//选择菜单资源并调用回调函数
//singleSelect:true单选,false多选，默认单选
//checkedIds:初始化选中的菜单，多个之间使用英文逗号隔开
function _selectResourceCallBack(callBack,singleSelect,checkedIds) {
  checkedIds=checkedIds||"";
  if (singleSelect == undefined) {
      singleSelect = true;
  }
  var   parm = {  singleSelect: singleSelect,  checkedIds: checkedIds }
  FUI.dialog(__webpath + "/admin/resource/selectResource/", "选择菜单资源", parm, 350, 520, function (objectData, index,layer) {
      if (objectData.length > 0) {
    	  callBack(objectData,index)
      }
      else {
    	  callBack("",index)
      }
      layer.close(index);
  }, true);
}



