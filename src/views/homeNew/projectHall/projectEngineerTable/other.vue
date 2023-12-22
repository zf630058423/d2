<template>
  <div class="otherTable">
    <div>
      <el-table :data="tableData_1" v-loading="loading" style="width: 100%" v-bind:header-cell-style="{background:'#f7f7f7',color:'#000000',fontWeight:'normal'}" show-summary>
        <el-table-column type="index" width="50" label="序号">
        </el-table-column>
        <el-table-column label="合同编号" >
          <template slot-scope="scope">
            <span >{{ scope.row.billno }}</span>
          </template>
        </el-table-column>
        <el-table-column label="合同名称">
          <template slot-scope="scope">
            <span >{{ scope.row.contract }}</span>
          </template>
        </el-table-column>
        <el-table-column label="合同供应商" >
          <template slot-scope="scope">
            <span >{{ scope.row.supplier }}</span>
          </template>
        </el-table-column>
        <el-table-column label="合同总金额(元)" >
          <template slot-scope="scope">
            <span >{{ scope.row.contractsumamount | qianfenWeiFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column label="结算金额(元)" >
          <template slot-scope="scope">
            <span >{{ scope.row.settlementamount | qianfenWeiFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column label="合同占目标比" >
          <template slot-scope="scope">
            <span >{{ scope.row.ratioContract | baifenbiFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column label="已付金额(元)" >
          <template slot-scope="scope">
            <span >{{ scope.row.amountofthisapplication | qianfenWeiFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column label="已付占比" >
          <template slot-scope="scope">
            <span >{{ scope.row.proportionpaid | baifenbiFormat}}</span>
          </template>
        </el-table-column>

        <el-table-column label="未付金额(元)" >
          <template slot-scope="scope">
            <span >{{ scope.row.unpaidamount | qianfenWeiFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column label="质保金(元)" >
          <template slot-scope="scope">
            <span >{{ scope.row.retmone | qianfenWeiFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column label="成本发票" >
          <template slot-scope="scope">
            <span >{{ scope.row.contractclaimamount | qianfenWeiFormat}}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
  export default {
    name: "otherTable",
    data(){
      return{
        loading: false,
        form: {
          projectId: null,
          projectNo: null,
          billType: '其他支出合同',
          contType: null,
          sort: 'CreateTime',
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
        $.extendAjax(`/extend/projectSummary/purchaseContract`, JSON.stringify(that.form), "post", function (d) {
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
