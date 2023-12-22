<template>
  <div>
    <el-form ref="formRef" size="mini" :model="data" class="f2bpm-editform" label-width="110px">

      <el-form-item label="是否启用:">
        <el-switch v-model="data.enabled" size="mini" :inactive-value="0" :active-value="1" active-color="#13ce66" inactive-color="#DEDEDE" />
        <a id="clearEmpty2" href="javascript:void(0)" class="ml15 red" @click="onClearEmpty"><i class="fa fa-minus-circle  ml5" aria-hidden="true" />清空</a>
      </el-form-item>
      <el-form-item label="事件类型:">
        <el-radio-group v-model="data.type">
          <el-radio label="java">JAVA类</el-radio>
          <el-radio label="rest">数据服务</el-radio>
        </el-radio-group>

      </el-form-item>
      <el-form-item v-if="data.type=='java'" label="JAVA类:">
        <el-input v-model="data.java" :clearable="true" placeholder="填写Java插件类的全路径名 " />
        <span>Java类的自定义参数</span>
        <el-input v-model="data.javaParm" :clearable="true" placeholder="将会把填写的参数内容原样的传入到Java类的执行函数中" />
        <br>
        <div style="line-height: 25px;font-size: 12px;">
          <span class="fa fa-book cur red mt10 " @click="inputHelper('CreatingEvent')">查看示例代码</span>
          <span class="mt10"> 插件示例：com.f2bpm.demo.customExtension.DemoAssemblyEvent</span>
        </div>
      </el-form-item>


      <el-form-item v-if="data.type=='rest'" label="数据服务:">
        <span class="cube bg-blue   font12  " style=" min-width: 80px;display: inline-block;height: 30px; line-height:24px;" v-html="data.title" />
        <span class="ml10"> <a id="selectDataService" href="javascript:void(0)" title="选择数据服务" @click="selectDataService('rest','title')"><i class="fa fa-search" />选择 </a> </span>
      </el-form-item>
      <el-form-item label="使用说明:">
        <span style=" line-height: 10px;font-size: 12px;">
          实际场景当中“后置事件”较为常用。
        </span>
      </el-form-item>
    </el-form>
    <div v-if="data.type=='java'" class="CreatingEvent CompletedEvent" style="display: none;padding-left: 10px;padding-right: 10px;">
      <textarea style="width: 98%; height: 150px; border: rgb(207, 202, 202) solid 1px;" class="textBoxLong" cols="20" rows="2">
        public class DemoAssemblyEvent implements IAssemblyEvent {
          @Override
          public void resolve(ProcessInstance processInstance,ActivityInstance ativityInstance, Activity activity, EventTypeEnum eventType) {
            // **********节点实例获取相关信息**********************//
            // 当前节点名称
            // activity.getActivityName();
            // 当前节点编码
            // activity.getActivityCode();
            // 工作流API
            // base.WorkflowAPI
            // ativityInstance 为节点实例
            // eventType事件来源类别
            // /当前流程实例ID
            String wiid = ativityInstance.getWorkflowInstanceId();
            // 当前节点实例ID
            String aiid = ativityInstance.getActivityInstanceId();
            //流程状态
            int status=processInstance.getWorkflowInstanceState();
            System.out.println(status);
            System.out.println(activity.getActivityName());
          }
        }
         </textarea>
    </div>

    <div class="dialogfooter2">
      <a role="button" href="javascript:void(0)" class="btn btn-primary btn-sm mr2" @click="save()"><i class="fa fa-save" />确定</a>
      <a role="button" href="javascript:void(0)" class="btn  btn-sm btn-primary " @click="closeEdit()"><i class="fa fa-minus-circle" />取消</a>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        wid: '',
        nameText: '',
        attrName: '',
        data: {
          enabled: 1,
          type: 'java',
          title: '请选择',
          rest: {},
          java: '',
          javaParm: ''
        }
      };
    },
    created: function () {
      var that = this;
      var obj;
      var wid;
      var attrName;
      var value;
      obj = parent.window.currentWindowTargetObjectValue;
      var title = obj.title;
      value = obj.value;
      if (value != null && value != '' && Object.toStartWith(value, '#')) {
        value = value.toString().substr(1, value.toString().length - 2);
        try {
          value = Object.toStringToJson(value);
          that.data = value;
        } catch (err) {
        }
      }
      attrName = obj.name;
      var otherParm = null;
      if (obj.otherParm) {
        otherParm = eval("(" + obj.otherParm + ")");
      }
      wid = otherParm.wid;
      that.attrName = attrName;
      if (wid) {
        that.wid = wid;
      }
    },
    methods: {
      // ===stand:标准化方法============
      closeEdit() {
        // stand:关闭编辑窗口
        FUI.Window.closeEdit();
      },
      selectDataService(inputId, inputName) {
        var that = this;
        var inputIdValue = that.data[inputId];
        var obj = null;
        if (inputIdValue) {
          var json = inputIdValue;
          try {
            obj = eval('(' + inputIdValue + ')');
          } catch (err) {
            console.info('JSON解析出错：' + json);
          }
        }
        var width = 680;
        var height = 500;
        var url = '';
        var parms = obj;
        var implType = 'Workflow';
        var url = '/workflow/flowDesigner/dataActorService/?apply=assemblyEvent&implType=' + implType + "&wid=" + that.wid;
        var title = '节点事件触发服务';
        FUI.dialog(__webpath + url, title, parms, width, height, function (dataObject, index, layer) {
          if (dataObject == false) {
            return false;
          }
          var resultStr = JSON.stringify(dataObject);
          that.data[inputId] = resultStr;
          that.data[inputName] = dataObject.title;
          layer.close(index);
        }, true);
      },
      inputHelper(name) {
        $('.' + name).toggle();
      },
      onClearEmpty() {
        var that = this;
        that.data = {
          enabled: 0,
          type: 'java',
          title: '请选择',
          rest: {},
          java: ''
        };
      },
      // ===stand:标准化方法结束============
      save() {
        var that = this;
        if (that.data.type == 'java') {
          that.data.rest = null;
          that.data.title = '';
        } else {
          that.data.java = '';
        }
        var content = JSON.stringify(that.data);
        FUI.Window.confirm('您确定要修改？', '温馨提示', function () {
          parent.setTargetValue(that.attrName, '#' + content + '#');
          FUI.Window.closeEdit();
        });
      }
    }
  }
</script>