<template>
  <div class="f2bpm-page-layout">
    <div id="layui_container" class="layui-container" style="width: 100%; margin: 0px; padding: 0px;font-size: 3rem;">
      <div style="font-size: 3rem; padding: 15px;">
        <i class="fa fa-edit"></i> 请在下方直接手写签名<br />
      </div>
      <div id="signature" style="border: 1px solid #ccc; min-height: 30rem; margin-bottom: 30px;"></div>
      <br />
      <div style="margin-top: 10px;">
        <button role="button" class="btn btn-primary   mr2" style="width: 100%; height: 8rem; font-size: 4rem;" @click="submit(this);">
          <i class="fa fa-save"></i>提交
        </button>
      </div>
      <div style="margin-top: 5rem;">
        <button role="button" @click="reset()" style="width: 100%; height: 8rem; font-size: 4rem;" class="btn btn-light   mr2">
          <i class="fa fa-undo"></i>重置
        </button>
      </div>
    </div>
  </div>
</template>

<script>
  window.$signature = null;
  export default {
    created() {
      var that = this;
      var signId = Object.toQueryString("signId");
      var linkType = Object.toQueryString("linkType") || "";
      var linkEntityId = Object.toQueryString("linkEntityId") || "";
      var creatorId = Object.toQueryString("creatorId") || "";

      that.signId = signId;
      that.linkType = linkType;
      that.linkEntityId = linkEntityId;
      that.creatorId = creatorId;
      $signature = $("#signature").jSignature({
        height: '30rem',
        width: '100%',
        'UndoButton': true
      });
    }
    , data() {
      return {
        creatorId: "",
        signId: "",
        linkType: "",
        linkEntityId: "",
        QrCodeImgPath: ""
      };
    },

    methods: {
      reset() {
        $signature.jSignature('reset')
      }
      , submit() {
        var that = this;
        var data = $signature.jSignature('getData', 'default');
        var data = Object.toAjaxJson("/workflow/public/", "handSignSave", {
          "imgdata": data,
          "signId": that.signId,
          "linkType": that.linkType,
          "linkEntityId": that.linkEntityId,
          "creatorId": that.creatorId
        });
        if (data.success) {
          //FUI.Window.showMsg2(data.msg, null, 1);
          $("#layui_container").html("签名提交成功");
          $("#layui_container").css("padding-top", "10rem");
        } else {
          FUI.Window.showMsg(data.msg);
        }
      }
      , show() {
        var data = $signature.jSignature('getData', 'default');
        var img = new Image();
        img.src = data;
        $(img).appendTo($('#signimg'));
        $('#text').text(data);
      }
      , getResult() {
        return this.signId;
      }
    }
    , mounted() {
      window.myvm = this;
    }
  }

  window.getResult = function () {
    return myvm.getResult();
  }
</script>