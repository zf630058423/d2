<template>
  <el-dialog
  class="progress-pop"
  ref="dialog"
  width="500px"
  :visible.sync="show"
  modal-append-to-body
  :append-to-body="true"
  style="z-index: 999999999;"
  :title="title">
     <el-progress :text-inside="true" :stroke-width="20" :percentage="percentage" status="success"></el-progress>
  </el-dialog>
</template>
<script>

export default {
  name: 'progress-pop',
  props: {
    percentage:{
      type: Number,
      default: 0
    },
    visible: {
        type: Boolean,
        default: false,
      },
    title: {
      type: String,
      default: '进度'
    }
  },
  computed: {
      show: {
        get() {
          return this.visible;
        },
        set(val) {
          this.$emit('update:visible', val);
        },
      },
    },
  data(){
    return {
      
    }
  },
  methods: {
    
  }
}
</script>

<style lang="scss">
.progress-pop{
  display: flex;
  flex-direction: column;
  margin:0 !important;
  position:absolute;
  top:50%;
  left:50%;
  transform:translate(-50%,-50%);
  /*height:600px;*/
  max-height:calc(100% - 200px);
  max-width:calc(100% - 30px);
  z-index: 999999999; 

  .el-dialog__body {
    flex:1;
    overflow: auto;
  }

  .el-dialog__header{
    padding: 10px 10px 0px;

    .el-dialog__title{
      font-size: 14px;
    }
  }

}

</style>