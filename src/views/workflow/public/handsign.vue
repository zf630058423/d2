<template>
  <div class="f2bpm-page-layout overauto">
    <div id="layui_container" class="layui-container" style="width: 100%; margin: 0px; padding: 0px;font-size: 12px;">
      <div style="font-size:20px; padding: 15px;">
        <i class="fa fa-edit"></i> 请在下方直接手写签名<br />
      </div>
      <div id="signature" style="border: 1px solid #ccc; min-height: 150px; margin-bottom: 30px;"></div>
      <br />
      <div style="margin-top: 2px;text-align: center;">
        <el-button style="width: 80%; height: 60px; font-size: 24px;" size="small" type="primary" @click="submitSave"><i class="fa fa-save" />提交
        </el-button>
      </div>
      <div style="margin-top: 20px;text-align: center;">
        <button role="button" @click="reset" style="width: 80%; height:60px; font-size: 24px;" class="btn btn-light   mr2">
          <i class="fa fa-undo"></i>重置
        </button>
      </div>
    </div>
  </div>
</template>

<script type="text/javascript">
  window.$signature = null;
  export default {
    created() {
      var that = this;
      var signId = Object.toQueryString("signId");
      var linkType = Object.toQueryString("linkType") || "";
      var linkEntityId = Object.toQueryString("linkEntityId") || "";
      var creatorId = Object.toQueryString("creatorId") || "";
      var tenantId = Object.toQueryString("tenantId") || "";
      that.signId = signId;
      that.creatorId = creatorId;
      that.linkType = linkType;
      that.linkEntityId = linkEntityId;
      that.tenantId = tenantId;
    }
    , mounted() {
      $signature = $("#signature").jSignature({
        height: '300px',
        width: '100%',
        'UndoButton': true
      });
      window.myvm = this;
    }
    , data() {
      return {
        tenantId: "",
        creatorId: "",
        signId: "",
        linkType: "",
        linkEntityId: ""
      };
    },
    methods: {
      submitSave() {
        var that = this;
        var data = $signature.jSignature('getData', 'default');
        try {
          var data = Object.toAjaxJson("/workflow/public/", "handSignSave", {
            "imgdata": data,
            "signId": that.signId,
            "linkType": that.linkType,
            "linkEntityId": that.linkEntityId,
            "creatorId": that.creatorId,
            "tenantId": that.tenantId
          });
        } catch (err) {
          alert(err);
        }
        if (data.success) {
          $("#layui_container").html("<div style='font-size:36px;text-align: center;'>签名提交成功</div>");
          $("#layui_container").css("padding-top", "20px");
        } else {
          FUI.Window.showMsg(data.msg);
        }
      }
      , reset() {
        $signature.jSignature('reset');
      }
      , getResult() {
        return this.signId;
      }
    }

  };
  window.getResult = function () {
    var result = myvm.getResult();
    return result;
  }

</script>