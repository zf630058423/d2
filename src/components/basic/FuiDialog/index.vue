<template>
  <el-dialog
    class="wd-dialog"
    :class="type === 'input' ? 'dialog__input' : 'dialog__info'"
    append-to-body
    :width="width"
    :height="height"
    :center="type === 'input'"
    :visible.sync="currentVisible"
    :close-on-click-modal="isCloseModal"
    :fullscreen="isFullscreen"
    @close="closeDialog"
  >
    <div slot="title" class="wd-dialog-title">
      <!-- Todo 目前UI指出了警告图样，其他的状态需和业务及UI 确认后再处理 -->
      <div>
        <i v-if="type == 'info'" class="dialog-icon el-icon-warning" />
        <slot name="title">{{ title }}</slot>
      </div>
      <i class="el-icon-full-screen fullscreen" v-if="fullScreen" @click="onFullScreen"></i>
    </div>
    <div class="wd-dialog-body">
      <slot />
    </div>
    <div v-if="isBottom" slot="footer" class="wd-dialog-footer">
      <slot name="footer">
        <el-button type="primary" @click="onConfirm">{{ confirmText }}</el-button>
        <el-button v-if="isCancel" @click="onCancel">{{ cancelText }}</el-button>
      </slot>
    </div>
  </el-dialog>
</template>

<script>
/**
 * 公共组件弹框
 */
  export default {
    name: 'BaseDialog',
    props: {
      // 弹窗类型 info-信息，input-输入框弹窗
      type: {
        type: String,
        default: 'info',
      },
      //弹框标题
      title: {
        type: String,
        default: '',
      },
      //点击遮罩层 是否关闭弹框
      isCloseModal:{  
        type: Boolean,
        default: false
      },
      //是否显示弹框
      visible: {
        type: Boolean,
        default: false,
      },
      //弹框取消或关闭文字
      cancelText: {
        type: String,
        default: '关闭',
      },
      //弹框确认、提交或保存文字
      confirmText: {
        type: String,
        default: '确定',
      },
      //弹框宽度
      width: {
        type: String,
        default: '500px',
      },
      //弹框高度
      height: {
        type: String,
        default: '550px'
      },
      // 是否显示底部按钮
      isBottom: {
        type: Boolean,
        default: true,
      },
      // 是否展示取消按钮
      isCancel: {
        type: Boolean,
        default: true,
      },
      // 弹框是否显示全屏
      fullScreen:{
        type: Boolean,
        default:false
      }
    },
    data(){
      return {
        isFullscreen: false
      }
    },
    computed: {
      currentVisible: {
        get({ visible }) {
          return visible;
        },
        set(val) {
          this.$emit('update:visible', val);
        },
      },
    },
    methods: {
      show() {
        this.currentVisible = true;
      },
      hide() {
        this.currentVisible = false;
      },
      closeDialog(){
        this.$emit('on-cancel');
      },
      onCancel() {
        this.hide();
        this.$emit('on-cancel');
      },
      onConfirm() {
        this.$emit('on-confirm');
      },
      onFullScreen(){
        this.isFullscreen = !this.isFullscreen;
      }
    },
  };
</script>

<style lang="scss" scoped>
  .wd-dialog {
    .dialog-icon {
      margin-right: 10px;
      &.el-icon-warning {
        color: #ff9c23;
      }
    }
    .wd-dialog-title {
      text-align: left;
      padding: 0px 10px;
      display: flex;
      align-items: center;
      flex-direction: revert;
      width:100%;
      justify-content: space-between;

      .fullscreen{
        margin-right: 14px;
        cursor: pointer;
      }
    }
    .el-button {
      min-height: unset;
      width: 72px;
      height: 32px;
      padding: 0;
      // padding: 8px 20px;
    }
    .el-button + .el-button {
      margin-left: 30px;
    }
  }
  ::v-deep .el-dialog {
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    margin: 0 !important;
    .el-dialog__header {
      width: 100%;
      height: 40px;
      line-height: 40px;
      padding: 0px;
      display: flex;
      justify-items: center;
      justify-content: space-between;
      background: #F8F8F8;
    }
    .el-dialog__body {
      padding: 0 !important;
    }

    
  }

  ::v-deep .dialogfooter{
      display: none;
    }

  ::v-deep .el-dialog__headerbtn{
    position: relative;
    top:0;
  }
</style>
