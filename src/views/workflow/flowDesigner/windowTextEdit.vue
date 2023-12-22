<template>
  <div>
    <div style="padding: 5px;">
      <div>
        <span v-html="nameText" />
        <div class="space-4" />
        <el-input v-model="content" type="textarea" :rows="4" placeholder="" />
        <div v-if="isdescription" v-html="description" class="mt10" ></div>
      </div>
    </div>
    <div class="dialogfooter">
      <a role="button" href="javascript:void(0)" class="btn btn-primary btn-sm mr2" @click="save()"><i class="fa fa-save" />确定</a>
      <a role="button" href="javascript:void(0)" class="btn  btn-sm btn-primary " @click="closeEdit()"><i class="fa fa-minus-circle" />取消</a>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        oldSubAppId: "",
        attrName: '',
        description: '',
        isdescription: false,

        nameText: '',
        content: ''

      };
    },
    created: function () {
      var that=this;
      var obj;
      var wid;
      var attrName;
      var value;
      obj = parent.window.currentWindowTargetObjectValue;
      var title = obj.title;
      value = obj.value;
      attrName = obj.name;
      wid = obj.otherParm;
      this.content = value;
      this.attrName = attrName;
      if (attrName == 'SubAppId') {
        this.oldSubAppId = value;
      }
      if (that.attrName == "Width" || that.attrName == "Height") {
        that.isdescription = true;
        that.description = "说明：宽度范围116、126~300，高度范围44~120；建议值：宽136、高52;需将流程图保存后才能显示效果。";
      }
      this.nameText = title;
      console.info(attrName);
    },
    methods: {
      // ===stand:标准化方法============
      closeEdit() {
        // stand:关闭编辑窗口
        FUI.Window.closeEdit();
      },
      // ===stand:标准化方法结束============
      save() {
        var that = this;
        var content = that.content;
        console.info(that);

        if (that.attrName == "Width") {
          if (isNaN(content)) {
            FUI.Window.showMsg("请填写数字");
            return false;
          }
          if (parseInt(content) < 116) {
            FUI.Window.showMsg("宽度不能小于116");
            return false;
          }
          if (parseInt(content) > 300) {
            FUI.Window.showMsg("宽度不能大于300");
            return false;
          }
        }
        if (that.attrName == "Height") {
          if (isNaN(content)) {
            FUI.Window.showMsg("请填写数字");
          }
          if (parseInt(content) < 44) {
            FUI.Window.showMsg("高度不能小于44");
            return false;
          }
          if (parseInt(content) > 116) {
            FUI.Window.showMsg("高度不能大于116");
            return false;
          }
        }
        if (that.attrName == "SubAppId" && that.oldSubAppId && that.oldSubAppId != content) {
          var isPass = that.checkHaveProcessInstByAppId(that.oldSubAppId);
          if (isPass == false) {
            that.content = oldSubAppId;
            return false;
          }
        }
        content = content.replace(/</g, '〈');
        FUI.Window.confirm('您确定要修改？', '温馨提示', function () {
          parent.setTargetValue(that.attrName, content);
          FUI.Window.closeEdit();
        });
      }
      , checkHaveProcessInstByAppId() {
        var that = this;
        var res = Object.toAjaxJson("/workflow/flowDesigner/", "checkHaveProcessInstByAppId", { appId: that.oldSubAppId });
        if (!res.success) {
          FUI.Window.showMsg(res.msg);
          return false;
        }
        return true;
      }
    }
  }
</script>