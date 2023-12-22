<template>
  <div class="f2bpm-page-layout">
    调用方法：
    <br>
    <textarea style="height:600px;width: 100%;border:1px solid #ddd">
    编程调用方法：
         var parm={
         customDialog:"配置的编码",
         isMulti:true,//是否多选,
         data:[{ field: "绑定到目标的输入框的name", property: "返回字段值的属性名"}]
          callBack:myCallBack //回调函数，如果配置了回调，而返回值不自动绑定到目标指定的输入框，则会把选中的值填写到回调函数中
        }
        data配置说明：是指把结果中“property”指定的属性值绑定到页面上“field”所指向的带有"name"属性的输入框中
       CustomDialog(vm,parm);

     调用示例：
        <input name="MyInputNameRoomId" />
        <input name="MyInputNameRoomName" />
        var parm={
        customDialog:"${model.code}",
        isMulti:false,//是否多选,
        data:[{property: "RoomId", field: "MyInputNameRoomId"},{property: "RoomName", field: "MyInputNameRoomName"}],
		width : 800,
		height :500,
        callBack: function(data){
				//自定义回调函数不是必须的，可删除
			}
        }
        CustomDialog(vm,parm);

    function myCallBack(data){

    }
     返回值说明：
       对话框返回值Json的属性有
       ${model.resultField}

    </textarea>

  </div>
</template>

<script>
  var code = Object.toQueryString('code')
</script>
