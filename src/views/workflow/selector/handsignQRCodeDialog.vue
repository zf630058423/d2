<template>
  <div class="f2bpm-page-dialog-layout">
    <div style="width: 100%; margin-top: 5px; padding: 0px;text-align: center">
      <div v-if="QrCodeImgPath!=''" id="title_div">
        <i class="fa fa-info" /> 请使用手机扫描下面二维码进行签名：
      </div>
      <div v-if="show_reSign_btn" class="mt10">
        请点击确认您的签名 <span class=" btn btn-minier btn-light cur" @click="reSign()">重新签名</span>
      </div>
      <img v-if="show_QrCodeImgPath" :src="QrCodeImgPath" width="200" height="200" style="border: 0px; margin: 3px;">
      <div id="signimg" style="margin-top: 20px;">
        <img :src="signimgData" width="350">
      </div>
    </div>
  </div>
</template>

<script>
  window.timer1 = null;
  export default {
    data() {
      return {
        show_reSign_btn: false,
        show_QrCodeImgPath: true,

        userId: '',
        signId: '',
        linkType: '',
        linkEntityId: '',
        isreSign: 0,
        QrCodeImgPath: '',
        signimgData: "",
      };
    },
    created() {
      var that = this;
      var signId = Object.toQueryString('signId');
      var linkType = Object.toQueryString('linkType') || '';
      var linkEntityId = Object.toQueryString('linkEntityId') || '';
      var isreSign = Object.toQueryString('isreSign') || 0;
      that.signId = signId;
      that.linkType = linkType;
      that.linkEntityId = linkEntityId;
      that.isreSign = isreSign;

    },
    mounted() {
      var that = this;
      window.myvm = this;
      that.userId = that.$store.state.user.author.userId;
      if (that.isreSign == 1) {
        that.show();
      } else {
        that.getQrCodeImg();
        that.setTimerInterval();
      }
    },
    methods: {
      getQrCodeImg() {
        var that = this;
        that.show_QrCodeImgPath = true;
        //获取签名二维码数据
        var res = Object.toAjaxJson('/workflow/selector/', 'getHandsignQRCodeData', {
          'signId': that.signId,
          linkEntityId: that.linkEntityId,
          linkType: that.linkType,
          creatorId: that.userId
        });
        if (res.success) {
          that.QrCodeImgPath = res.data;
          that.show_reSign_btn = false;
        }
      },
      setTimerInterval() {
        var that = this;
        setTimeout(function () {
          timer1 = setInterval(function () {
            that.show();
          }, 4000);
        }, 4000);
      },
      show() {
        //显示签名
        var that = this;
        var data = Object.toAjaxJson('/workflow/public/', 'getHandSignData', {
          'signId': that.signId
        });
        if (data.success == true) {
          that.show_reSign_btn = true;
          that.show_QrCodeImgPath = false;
          that.QrCodeImgPath="";
          that.signimgData = data.data.imgData;
          //清除定时器
          clearInterval(timer1);
        } else {
          that.getQrCodeImg();
          that.setTimerInterval();
        }
        if (data.success == true&&data.data.imgData == '') {
          that.show_reSign_btn = true;
          that.getQrCodeImg();
          that.setTimerInterval();
        }
      },
      reSign() {
        var that = this;
        var data = Object.toAjaxJson('/workflow/public/', 'reSignData', {
          'signId': that.signId
        });
        if (data.success) {
          that.show_QrCodeImgPath = true;
          that.signimgData = "";
          that.show_reSign_btn = false;
          that.getQrCodeImg();
          that.setTimerInterval();
        }
      },
      getResult() {
        return this.signId;
      }
    }
  };
  window.getResult = function () {
    return myvm.getResult();
  }
</script>