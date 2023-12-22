<template>
  <div class="memberTable">
    <div >
      <el-table :data="tableData_1" v-loading="loading" style="width: 100%" v-bind:header-cell-style="{background:'#f7f7f7',color:'#000000',fontWeight:'normal'}" show-summary>
        <el-table-column type="index" width="50" label="序号">
        </el-table-column>
        <el-table-column label="职务" >
          <template slot-scope="scope">
            <span >{{ scope.row.post }}</span>
          </template>
        </el-table-column>
        <el-table-column label="姓名">
          <template slot-scope="scope">
            <span >{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="联系电话" >
          <template slot-scope="scope">
            <span >{{ scope.row.phone }}</span>
          </template>
        </el-table-column>
        <el-table-column label="部门" >
          <template slot-scope="scope">
            <span >{{ scope.row.dept }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
  export default {
    name: "memberTable",
    data(){
      return{
        loading: false,
        form: {
          projectId: null,
          projectNo: null,
          billType: null,
          contType: null,
          sort: 'MyId',
          pageIndex: 1,
          pageSize: 100
        },
        tableData_1:[]
      }
    },
    methods:{
      getData(obj){
        var that = this;
        var time;
        that.form.projectId = obj.projectId;
        that.form.projectNo = obj.projectNo;
        clearTimeout(time);
        time = setTimeout(function(){
          that.getTableList()
        }, 500)
      },
      // 获取表单信息
      getTableList(){
        var that = this;
        that.loading = true;
        $.extendAjax(`/extend/projectSummary/member`, JSON.stringify(that.form), "post", function (d) {
          if(d.code === 200){
            that.loading = false;
            that.tableData_1 = d.rows;
          }
        });
      }
    }
  }
</script>

<style scoped>
</style>
