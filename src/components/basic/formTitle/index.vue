<template>
  <div class="form-title" style="padding-top: 0">
        <span class="prefix-blue-Bar" v-if="showIcon"></span>
        <span class="title">{{title}}</span>
        <span class="form-text" v-if="text">{{text}}</span>
      </div>
</template>
<script>
export default {
  props: {
    //标题
    title: {
      type: String,
      default: '项目信息'
    },
    //标题后面是否跟踪提示信息
    text: {
      type: String,
      default: ''
    },
    //是否展示图标
    showIcon: {
      type: Boolean,
      default: true
    }
  },
  data() { 
    return {

    }
  }
}
</script>
<style scoped lang="scss">

.form-title{
    // margin: 0px 10px 0px 10px;
    border-bottom: 1px solid #eee;
    padding-left: 4px;
    display: flex;
    align-items: center;
    margin-bottom: 24px;

    color: #0D1126;
    font-size: 12px;
    min-height: 40px;
    line-height: 40px;
    border-radius: 3px;
    font-weight: bold;
    background-color: #FFFFFF;
    border-bottom: solid 1px #F7F7FA;

    .title{
      margin-left: 6px;
    }

    .prefix-blue-Bar{
      display: inline-block;
      width: 12px;
      height: 12px;
      opacity: 1;
      border: 3px solid #0052D9;
      border-radius: 50%;
    }

    .form-text{
      // margin-left: 16px;
      font-size: 12px;
      color: #FF0F6C;
      transform: scale(.9);
    }
}


</style>
