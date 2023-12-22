<template>
  <div class="followTable">
    <div>
      <el-table :data="tableData" style="width: 100%;min-height: 300px" v-bind:header-cell-style="{background:'#f7f7f7',color:'#000000',fontWeight:'normal'}">
        <el-table-column type="index" width="50" label="序号">
        </el-table-column>
        <el-table-column label="拜访对象">
          <template slot-scope="scope">
            <span >{{ scope.row.visitObject }}</span>
          </template>
        </el-table-column>
        <el-table-column label="跟进方式" >
          <template slot-scope="scope">
            <span >{{ scope.row.followUpWay }}</span>
          </template>
        </el-table-column>
        <el-table-column label="跟进日期" >
          <template slot-scope="scope">
            <span >{{ scope.row.followUpDate | formatDates}}</span>
          </template>
        </el-table-column>
        <el-table-column label="跟进内容及情况" >
          <template slot-scope="scope">
            <span >{{ scope.row.followUpSituation }}</span>
          </template>
        </el-table-column>
        <el-table-column label="编制人" >
          <template slot-scope="scope">
            <span >{{ scope.row.createName}}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
  export default {
    name: "followTable",
    data(){
      return{
        tableData: []
      }
    },
    methods:{
      // 接收父级传值
      getParentVal(id){
        this.getTableData(id);
      },
      //获取项目协议
      getTableData(id) {
        var that = this;
        $.extendAjax(`/extend/marketing/projectfollowup/queryProjectFollowUpByProjectID?myId=${id}`, '', "get", function (d) {
          if (d.data) {
            that.tableData = d.data
          }
        });
      },
    }
  }
</script>

<style scoped>
</style>
