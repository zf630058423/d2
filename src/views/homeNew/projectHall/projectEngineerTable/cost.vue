<template>
  <div class="costTable">
    <div >
      <el-row :gutter="20">
        <el-col :span="12">
          <div class="costTable-title">
            <span class="costTable-tittle-BlueBar"></span>
            <span class="costTable-title-text">单据类型维度</span>
          </div>
          <div>
            <el-table v-loading="loading1" :data="tableData_1"  style="width: 100%;min-height: 300px" v-bind:header-cell-style="{background:'#f7f7f7',color:'#000000',fontWeight:'normal'}">
              <el-table-column type="index" width="50" label="序号">
              </el-table-column>
              <el-table-column label="单据类型" >
                <template slot-scope="scope">
                  <span >{{ scope.row.billType }}</span>
                </template>
              </el-table-column>
              <el-table-column label="单据编号">
                <template slot-scope="scope">
                  <span >{{ scope.row.billNo }}</span>
                </template>
              </el-table-column>
              <el-table-column label="收款方" >
                <template slot-scope="scope">
                  <span >{{ scope.row.but }}</span>
                </template>
              </el-table-column>
              <el-table-column label="付款金额(元)" >
                <template slot-scope="scope">
                  <span >{{ scope.row.payAmount | qianfenWeiFormat}}</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="costTable-title">
            <span class="costTable-tittle-BlueBar"></span>
            <span class="costTable-title-text">费用项维度</span>
          </div>
          <div>
            <el-table v-loading="loading2" :data="tableData_2"  style="width: 100%;min-height: 300px" v-bind:header-cell-style="{background:'#f7f7f7',color:'#000000',fontWeight:'normal'}">
              <el-table-column type="index" width="50" label="序号">
              </el-table-column>
              <el-table-column label="费用项" >
                <template slot-scope="scope">
                  <span >{{ scope.row.reItemName }}</span>
                </template>
              </el-table-column>
              <el-table-column label="付款金额(元)">
                <template slot-scope="scope">
                  <span >{{ scope.row.paymentAmount | qianfenWeiFormat}}</span>
                </template>
              </el-table-column>
              <el-table-column label="占比(%)" >
                <template slot-scope="scope">
                  <span >{{ scope.row.rate}}</span>
                </template>
              </el-table-column>
            </el-table>

          </div>
        </el-col>
        <el-col :span="6">
          <div class="costTable-title">
            <span class="costTable-tittle-BlueBar"></span>
            <span class="costTable-title-text">结算方式维度</span></div>
          <div>
            <el-table v-loading="loading3" :data="tableData_3"  style="width: 100%;min-height: 300px" v-bind:header-cell-style="{background:'#f7f7f7',color:'#000000',fontWeight:'normal'}">
              <el-table-column type="index" width="50" label="序号">
              </el-table-column>
              <el-table-column label="结算方式" >
                <template slot-scope="scope">
                  <span >{{ scope.row.balaType }}</span>
                </template>
              </el-table-column>
              <el-table-column label="付款金额">
                <template slot-scope="scope">
                  <span >{{ scope.row.paymentAmount | qianfenWeiFormat}}</span>
                </template>
              </el-table-column>
              <el-table-column label="占比(%)" >
                <template slot-scope="scope">
                  <span >{{ scope.row.rate}}</span>
                </template>
              </el-table-column>
            </el-table>

          </div>
        </el-col>
      </el-row>

    </div>
  </div>
</template>

<script>
  export default {
    name: "leaseTable",
    data(){
      return{
        loading1: false,
        loading2: false,
        loading3: false,
        form: {
          projectId: null,
          projectNo: null,
          billType: '',
          contType: null,
          sort: 'CreateTime',
          pageIndex: 1,
          pageSize: 100
        },
        tableData_1:[],
        tableData_2:[],
        tableData_3:[]
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
          that.getTableList1();
          that.getTableList2();
          that.getTableList3();
        }, 500)
      },
      // 获取单据类型维度
      getTableList1(){
        var that = this;
        that.loading = true;
        $.extendAjax(`/extend/projectSummary/documentDimensionCost`, JSON.stringify(that.form), "post", function (d) {
          if(d.code === 200){
            that.loading1 = false;
            that.tableData_1 = d.rows;
          }
        });
      },
      // 获取费用项维度
      getTableList2(){
        var that = this;
        that.loading = true;
        $.extendAjax(`/extend/projectSummary/costDimension`, JSON.stringify(that.form), "post", function (d) {
          if(d.code === 200){
            that.loading2 = false;
            that.tableData_2 = d.rows;
          }
        });
      },
      // 获取结算方式维度
      getTableList3(){
        var that = this;
        that.loading = true;
        $.extendAjax(`/extend/projectSummary/methodDimension`, JSON.stringify(that.form), "post", function (d) {
          if(d.code === 200){
            that.loading3 = false;
            that.tableData_3 = d.rows;
          }
        });
      },

    }
  }
</script>

<style scoped>
  .costTable{
    /*background: #FFFFFF;*/
  }
  .costTable-tittle-BlueBar{
    display: inline-block;
    width: 3px;
    height: 20px;
    background: #006EFF;
  }
  .costTable-title{
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding: 10px 0;
    background: #FFFFFF;
  }
  .costTable-title-text{
    font-size: 14px;
    font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
    margin-left: 10px;font-weight: 500
  }
</style>
