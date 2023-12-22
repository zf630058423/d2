<template>
  <div class="object-menu">
    <el-popover v-model="show1"
      placement="left"
      width="50"
      trigger="click">
      <div class="menuCont">
        <div class="menuItem" @click="toHome">返回首页</div>
      </div>
      <el-button slot="reference" type="primary" circle>
        <span v-if="!show1" class="el-icon-plus" style="font-size: 20px"></span>
        <span v-else class="el-icon-close" style="font-size: 20px"></span>
      </el-button>
    </el-popover>

  </div>


</template>

<script>
  export default {
    name: "customMenu",
    data() {
      return {
        show1: false,
        gridData: [{
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }]
      }
    },
    methods: {
      toHome(){
        this.$router.push('/')
      }
    }
  }
</script>

<style scoped>
  .btnClass{
    border-radius: 25px;
  }
  .menuCont{
    width: 100%;
    height: auto;
    /*border: 1px solid;*/
  }
  .menuItem{
    width: 100%;
    height: 30px;
    line-height: 30px;
    text-align: center;
    font-size: 14px;
    /*border-bottom:1px solid;*/
    cursor: pointer;
  }
</style>
