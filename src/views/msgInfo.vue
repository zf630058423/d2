<template>
  <div class="wscn-http404-container">
    <div class="wscn-http404">
      <div class="pic-404">
        <f2bpmui-msg :imgClass="'f2bpm-pic-msg-'+infoType" :isShow="isShowImg"></f2bpmui-msg>
      </div>
      <div class="bullshit" style="display: inline-block;">
        <div class="bullshit__oops">{{title}}</div>
        <div class="bullshit__headline">{{ subtitle }}</div>
        <div class="bullshit__info">{{ message }}</div>
        <a :href="redirect" class="bullshit__return-home cur">返回</a>
        <span v-if="showCloseButton" @click="closeEdit" class="bullshit__return-close cur ml20">关闭</span>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'msgInfo',
    data() {
      return {
        showCloseButton:false,
        isShowImg: true,
        infoType: "",
        title: "提交成功",
        subtitle: "这里是二级标题消息",
        message: "继续新增发起流程申请单击下面的按钮返回。",
        redirect: "",
      };
    }
    , created() {
      var that = this;
      var infoType = Object.toQueryString("infoType");
      var title = Object.toQueryString("title");
      var subtitle = Object.toQueryString("subtitle");
      var message = Object.toQueryString("message");
      var redirect = Object.toQueryString("redirect");
      var showCloseButton = Object.toQueryString("showCloseButton");
      
      that.title = title;
      that.subtitle = subtitle;
      that.message = message;
      that.redirect = redirect;

      that.infoType = infoType;
      that.showCloseButton = showCloseButton=="true";
    }
    , computed: {
    }
    , methods: {
      closeEdit() {
        try {
          FUI.Window.closeEdit();
        } catch (err) {
          if (window.opener != null) {
            window.close();
          }
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .wscn-http404-container {
    transform: translate(-50%, -50%);
    position: absolute;
    top: 40%;
    left: 50%;
  }

  .wscn-http404 {
    position: relative;
    width: 1200px;
    padding: 0 50px;
    overflow: hidden;

    .pic-404 {
      position: relative;
      float: left;
      width: 600px;
      overflow: hidden;

      &__parent {
        width: 100%;
      }

      &__child {
        position: absolute;

        &.left {
          width: 80px;
          top: 17px;
          left: 220px;
          opacity: 0;
          animation-name: cloudLeft;
          animation-duration: 2s;
          animation-timing-function: linear;
          animation-fill-mode: forwards;
          animation-delay: 1s;
        }

        &.mid {
          width: 46px;
          top: 10px;
          left: 420px;
          opacity: 0;
          animation-name: cloudMid;
          animation-duration: 2s;
          animation-timing-function: linear;
          animation-fill-mode: forwards;
          animation-delay: 1.2s;
        }

        &.right {
          width: 62px;
          top: 100px;
          left: 500px;
          opacity: 0;
          animation-name: cloudRight;
          animation-duration: 2s;
          animation-timing-function: linear;
          animation-fill-mode: forwards;
          animation-delay: 1s;
        }

        @keyframes cloudLeft {
          0% {
            top: 17px;
            left: 220px;
            opacity: 0;
          }

          20% {
            top: 33px;
            left: 188px;
            opacity: 1;
          }

          80% {
            top: 81px;
            left: 92px;
            opacity: 1;
          }

          100% {
            top: 97px;
            left: 60px;
            opacity: 0;
          }
        }

        @keyframes cloudMid {
          0% {
            top: 10px;
            left: 420px;
            opacity: 0;
          }

          20% {
            top: 40px;
            left: 360px;
            opacity: 1;
          }

          70% {
            top: 130px;
            left: 180px;
            opacity: 1;
          }

          100% {
            top: 160px;
            left: 120px;
            opacity: 0;
          }
        }

        @keyframes cloudRight {
          0% {
            top: 100px;
            left: 500px;
            opacity: 0;
          }

          20% {
            top: 120px;
            left: 460px;
            opacity: 1;
          }

          80% {
            top: 180px;
            left: 340px;
            opacity: 1;
          }

          100% {
            top: 200px;
            left: 300px;
            opacity: 0;
          }
        }
      }
    }

    .bullshit {
      position: relative;
      float: left;
      width: 500px;
      padding: 120px 0;
      overflow: hidden;

      &__oops {
        font-size: 32px;
        font-weight: bold;
        line-height: 40px;
        color: #1482f0;
        opacity: 0;
        margin-bottom: 20px;
        animation-name: slideUp;
        animation-duration: 0.5s;
        animation-fill-mode: forwards;
      }

      &__headline {
        font-size: 20px;
        line-height: 24px;
        color: #222;
        font-weight: bold;
        opacity: 0;
        margin-bottom: 10px;
        animation-name: slideUp;
        animation-duration: 0.5s;
        animation-delay: 0.1s;
        animation-fill-mode: forwards;
      }

      &__info {
        font-size: 13px;
        line-height: 21px;
        color: grey;
        opacity: 0;
        margin-bottom: 30px;
        animation-name: slideUp;
        animation-duration: 0.5s;
        animation-delay: 0.2s;
        animation-fill-mode: forwards;
      }

      &__return-home {
        display: block;
        float: left;
        width: 110px;
        height: 36px;
        background: #1482f0;
        border-radius: 100px;
        text-align: center;
        color: #ffffff;
        opacity: 0;
        font-size: 14px;
        line-height: 36px;
        cursor: pointer;
        animation-name: slideUp;
        animation-duration: 0.5s;
        animation-delay: 0.3s;
        animation-fill-mode: forwards;
      }&__return-close {
        display: block;
        float: left;
        width: 110px;
        height: 36px;
        background: #ffffff;
        border-radius: 100px;
        text-align: center;
        border: 1px solid #d3cdcd;
        color: #252222;
        opacity: 0;
        font-size: 14px;
        line-height: 36px;
        cursor: pointer;
        animation-name: slideUp;
        animation-duration: 0.5s;
        animation-delay: 0.3s;
        animation-fill-mode: forwards;
      }

      @keyframes slideUp {
        0% {
          transform: translateY(60px);
          opacity: 0;
        }

        100% {
          transform: translateY(0);
          opacity: 1;
        }
      }
    }
  }
</style>