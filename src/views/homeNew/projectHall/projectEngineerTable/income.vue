<template>
  <div class="incomeTable">
    <div>
      <div class="incomeTable-title">
        <span class="incomeTable-tittle-BlueBar"></span>
        <span class="incomeTable-title-text">收入合同</span></div>
      <el-table :data="tableData_1"  v-loading="loading_1" style="width: 100%"
                show-summary  :summary-method="getSummaries1"
                v-bind:header-cell-style="{background:'#f7f7f7',color:'#000000',fontWeight:'normal'}"
                :row-style="{fontSize:'13px'}">
        <el-table-column type="index" width="50" label="序号">
        </el-table-column>
        <el-table-column label="合同编号" >
          <template slot-scope="scope">
            <span >{{ scope.row.vbillCode }}</span>
          </template>
        </el-table-column>
        <el-table-column label="合同名称">
          <template slot-scope="scope">
            <span >{{ scope.row.contract }}</span>
          </template>
        </el-table-column>
        <el-table-column label="合同金额(含税)(元)" >
          <template slot-scope="scope">
            <span >{{ scope.row.norigsigntaxmny | qianfenWeiFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column label="合同总金额(含税)(元)" >
          <template slot-scope="scope">
            <span >{{ scope.row.norigsigntaxmnySum | qianfenWeiFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column label="合同客户" >
          <template slot-scope="scope">
            <span >{{ scope.row.customer }}</span>
          </template>
        </el-table-column>
        <el-table-column label="合同供应商" >
          <template slot-scope="scope">
            <span >{{ scope.row.supplier }}</span>
          </template>
        </el-table-column>
        <el-table-column label="协议编号" >
          <template slot-scope="scope">
            <span >{{ scope.row.projectAgreementNo }}</span>
          </template>
        </el-table-column>
        <el-table-column label="协议名称" >
          <template slot-scope="scope">
            <span >{{ scope.row.projectAgreementName }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="mt10">
      <div class="incomeTable-title">
        <span class="incomeTable-tittle-BlueBar"></span>
        <span class="incomeTable-title-text">增补合同</span></div>
      <el-table :data="tableData_2"  v-loading="loading_2" style="width: 100%"
                show-summary  :summary-method="getSummaries2"
                :row-style="{fontSize:'13px'}"
                v-bind:header-cell-style="{background:'#f7f7f7',color:'#000000',fontWeight:'normal'}">
        <el-table-column type="index" width="50" label="序号">
        </el-table-column>
        <el-table-column label="主合同编号" >
          <template slot-scope="scope">
            <span >{{ scope.row.mastercontCode}}</span>
          </template>
        </el-table-column>
        <el-table-column label="主合同名称">
          <template slot-scope="scope">
            <span >{{ scope.row.mastercontName}}</span>
          </template>
        </el-table-column>
        <el-table-column label="合同编号" >
          <template slot-scope="scope">
            <span >{{ scope.row.vbillCode}}</span>
          </template>
        </el-table-column>
        <el-table-column label="合同名称" >
          <template slot-scope="scope">
            <span >{{ scope.row.contract}}</span>
          </template>
        </el-table-column>
        <el-table-column label="合同金额(含税)(元)" >
          <template slot-scope="scope">
            <span >{{ scope.row.norigsigntaxmny | qianfenWeiFormat}}</span>
          </template>
        </el-table-column>
        <!--<el-table-column label="合同总金额(含税)(元)" >-->
        <!--<template slot-scope="scope">-->
        <!--<span >{{ scope.row.norigsigntaxmnySum | qianfenWeiFormat}}</span>-->
        <!--</template>-->
        <!--</el-table-column>-->
        <el-table-column label="合同客户" >
          <template slot-scope="scope">
            <span >{{ scope.row.customer }}</span>
          </template>
        </el-table-column>
        <el-table-column label="合同供应商" >
          <template slot-scope="scope">
            <span >{{ scope.row.supplier }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="mt10 mb10">
      <div class="incomeTable-title">
        <span class="incomeTable-tittle-BlueBar"></span>
        <span class="incomeTable-title-text">合同变更</span></div>
      <el-table :data="tableData_3"  v-loading="loading_3" style="width: 100%"
                :row-style="{fontSize:'13px'}"
                show-summary  :summary-method="getSummaries3"
                v-bind:header-cell-style="{background:'#f7f7f7',color:'#000000',fontWeight:'normal'}">
        <el-table-column type="index" width="50" label="序号">
        </el-table-column>
        <el-table-column label="单据编号" >
          <template slot-scope="scope">
            <span >{{ scope.row.billNo }}</span>
          </template>
        </el-table-column>
        <el-table-column label="主合同编号">
          <template slot-scope="scope">
            <span >{{ scope.row.mastercontNo }}</span>
          </template>
        </el-table-column>
        <el-table-column label="主合同名称" >
          <template slot-scope="scope">
            <span >{{ scope.row.mastercontName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="变更类型" ><!--changeTypeType-->
          <template slot-scope="scope">
            <span v-if="scope.row.changeTheType" v-for="item in JSON.parse(scope.row.changeTheType)"> {{ Number(item) | changeTypeType }} </span>
          </template>
        </el-table-column>
        <el-table-column label="本次变更金额(含税)(元)" >
          <template slot-scope="scope">
            <span >{{ scope.row.amountOfThisChange | qianfenWeiFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column label="变更后客户" >
          <template slot-scope="scope">
            <span >{{ scope.row.afterChangeCustomer }}</span>
          </template>
        </el-table-column>
        <el-table-column label="变更后结算方式" >
          <template slot-scope="scope">
            <span >{{ scope.row.changeBalaType }}</span>
          </template>
        </el-table-column>
        <el-table-column label="代付款单位" >
          <template slot-scope="scope">
            <span >{{ scope.row.agentOfPayment }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
  export default {
    name: "incomeTable",
    data(){
      return{
        form: {
          projectId: null,
          projectNo: null,
          billType: null,
          contType: null,
          sort: 'CreateTime',
          pageIndex: 1,
          pageSize: 100
        },
        tableData_1:[],
        tableData_2:[],
        tableData_3:[],
        loading_1: false,
        loading_2: false,
        loading_3: false
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
      // 获取主合同
      getTableList1(){
        var that = this;
        that.loading_1 = true;
        that.form.contType = 1;
        $.extendAjax(`/extend/projectSummary/incomeContract`, JSON.stringify(that.form), "post", function (d) {
          if(d.code === 200){
            that.loading_1 = false;
            that.tableData_1 = d.rows;
          }
        });
      },
      // 获取增补合同
      getTableList2(){
        var that = this;
        that.loading_2 = true;
        that.form.contType = 2;
        $.extendAjax(`/extend/projectSummary/incomeContract`, JSON.stringify(that.form), "post", function (d) {
          if(d.code === 200){
            that.loading_2 = false;
            that.tableData_2 = d.rows;
          }
        });
      },
      // 获取合同变更
      getTableList3(){
        var that = this;
        that.loading_3 = true;
        $.extendAjax(`/extend/projectSummary/contractChange`, JSON.stringify(that.form), "post", function (d) {
          if(d.code === 200){
            that.loading_3 = false;
            that.tableData_3 = d.rows;
          }
        });
      },
      // 合计
      getSummaries1(param){
        const { columns, data } = param;
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '合计';
            return;
          }
          const values = data.map(item => Number(item['norigsigntaxmny'])); // 合同金额
          const values2 = data.map(item => Number(item['norigsigntaxmnySum'])); // 合同总金额
          if (!values.every(value => isNaN(value))) {
            sums[3] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
            sums[3] = Object.tofixed(sums[3]) + '元';
          } else {
            sums[3] = '';
          }
          if (!values2.every(value => isNaN(value))) {
            sums[4] = values2.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
            sums[4] = Object.tofixed(sums[4]) + '元';
          } else {
            sums[4] = '';
          }
        });

        return sums;
      },
      // 合计
      getSummaries2(param){
        const { columns, data } = param;
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '合计';
            return;
          }
          const values = data.map(item => Number(item['norigsigntaxmny']));
          // const values2 = data.map(item => Number(item['norigsigntaxmnySum'])); // 合同总金额
          if (!values.every(value => isNaN(value))) {
            sums[5] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
            sums[5] = Object.tofixed(sums[5]) + '元';
          } else {
            sums[5] = '';
          }
          // if (!values2.every(value => isNaN(value))) {
          //   sums[6] = values.reduce((prev, curr) => {
          //     const value = Number(curr);
          //     if (!isNaN(value)) {
          //       return prev + curr;
          //     } else {
          //       return prev;
          //     }
          //   }, 0);
          //   sums[6] = Object.tofixed(sums[6]) + '元';
          // } else {
          //   sums[6] = '';
          // }
        });

        return sums;
      },
      // 合计
      getSummaries3(param){
        const { columns, data } = param;
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '合计';
            return;
          }
          const values = data.map(item => Number(item['amountOfThisChange']));
          if (!values.every(value => isNaN(value))) {
            sums[5] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
            sums[5] = Object.tofixed(sums[5]) + '元';
          } else {
            sums[5] = '';
          }
        });

        return sums;
      },
    }
  }
</script>

<style scoped>
  .incomeTable-tittle-BlueBar{
    display: inline-block;
    width: 3px;
    height: 20px;
    background: #006EFF;
  }
  .incomeTable-title{
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding: 10px 0;
    background: #FFFFFF;
  }
  .incomeTable-title-text{
    font-size: 14px;
    font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
    margin-left: 10px;
    font-weight: 500
  }
</style>
