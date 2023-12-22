<template>
  <div class="progress-plus" style="width: 100%">
    <div class="progress-box">
      <div class="gray" />
      <div class="colors" :style="setColor()" />
      <div class="icon icon1" />
      <div class="icon icon2" />
      <div class="icon icon3" />
      <div class="icon icon4" />
    </div>
    <span style="display: inline-block;padding-left: 15px" :style="{color:color}">{{ percent }}%</span>
  </div>
</template>

<script>
  export default {
    name: 'ProgressPlus',
    props: {
      color: {
        type: String,
        default: 'green'
      },
      percent: {
        type: Number,
        default: 0
      },
      width: {
        type: Number,
        default: 200
      }
    },
    methods: {
      setColor() {
        return {
          'background-color': this.color,
          'left': (this.percent - 100) + '%'
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  .progress-plus{
    display: flex;
    align-items: center;
    &>span{
      width: 50px;
    }
    .progress-box{
      display: inline-block;
      position: relative;
      overflow: hidden;
      flex: 1;
      &>div{
        width: 100%;
        height: 10px;
      }
      .gray{
        background-color: #F2F6FC;
      }
      .colors{
        /*background-color: green;*/
        position: absolute;
        top: 0;
        transition: left 1s;
      }

      .icon{
        position: absolute;
        width: 2px;
        bottom: 0;
        top: 0;
        background-color: #FFFFFF;
        &.icon1{
          left: 20%;
        }
        &.icon2{
          left: 40%;
        }
        &.icon3{
          left: 60%;
        }
        &.icon4{
          left: 80%;
        }
      }
    }
  }
</style>

