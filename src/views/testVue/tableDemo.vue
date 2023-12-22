<template>
  <div class="costTable">
    <div style="border-bottom: 1px solid #f3f3f3;display:flex;justify-content:space-between;padding-bottom:5px;align-items:center;padding-right: 20px">
      <div class="title" style="border:none;">合同明细
      </div>
      <div class="contentBtn-box">
        <el-button type="primary" size="small">新增</el-button>
        <el-button type="primary" size="small">删除</el-button>
        <el-button type="primary" size="small">导入</el-button>
        <el-button type="primary" size="small">导出</el-button>
      </div>
    </div>
    <div class="tableBox"></div>
    <el-table :data="sourceData" style="width: 100%;margin-top: 10px;border: 1px solid" :key="tableKey" border stripe size="small"
              ref="cimsDictTable"  @selection-change="handleSelectionChange"
              tooltip-effect="dark" height="400px" header-row-class-name="data-table-header"
              :show-overflow-tooltip="true">
      <el-table-column label="序号" type="index" width="50"></el-table-column>
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column label="名称" align="center">
        <template slot-scope="scope">
          <el-input style="width: 80%" type="number" v-model="scope.row.norigsignmny" size="small" disabled></el-input>
        </template>
      </el-table-column>
      <el-table-column label="说明" class="is-required" align="center">
        <template slot-scope="scope">
          <el-input style="width: 80%" type="number" v-model="scope.row.norigsignmny" size="small" disabled></el-input>
          <!--<span v-else>{{scope.row.contractAmount}}</span>-->
        </template>
      </el-table-column>
      <el-table-column label="单位" class="is-required" align="center">
        <template slot-scope="scope">
          <el-input style="width: 80%" type="number" v-model="scope.row.targetCost" size="small" disabled></el-input>
          <!--<span v-else>{{scope.row.targetCost}}</span>-->
        </template>
      </el-table-column>
      <el-table-column label="合同数量" class="is-required" align="center">
        <template slot-scope="scope">
          <el-input style="width: 80%" type="number" v-model="scope.row.costAfterAdjustment" size="small" disabled></el-input>
          <!--<span v-else>{{scope.row.targetCost}}</span>-->
        </template>
      </el-table-column>
      <el-table-column label="累计核量" class="is-required" align="center">
        <template slot-scope="scope">
          <el-input style="width: 80%" type="number" v-model="scope.row.cumulativeAdjustment" size="small" disabled></el-input>
          <!--<span v-else>{{scope.row.targetCost}}</span>-->
        </template>
      </el-table-column>
      <el-table-column label="本次核量" class="is-required" align="center">
        <template slot-scope="scope">
          <el-input style="width: 80%" type="number" v-model="scope.row.expenditureAmount" size="small" disabled></el-input>
          <!--<span v-else>{{scope.row.targetCost}}</span>-->
        </template>
      </el-table-column>
      <el-table-column label="上期累计核量" class="is-required" align="center">
        <template slot-scope="scope">
          <el-input style="width: 80%" type="number" v-model="scope.row.settlementAmount" size="small" disabled></el-input>
          <!--<span v-else>{{scope.row.targetCost}}</span>-->
        </template>
      </el-table-column>
      <el-table-column label="单价(含税)(元)" class="is-required" align="center">
        <template slot-scope="scope">
          <el-input style="width: 80%" type="number" v-model="scope.row.totalPayment" size="small" disabled></el-input>
          <!--<span v-else>{{scope.row.targetCost}}</span>-->
        </template>
      </el-table-column>
      <el-table-column label="金额(含税)(元)" class="is-required" align="center">
        <template slot-scope="scope">
          <el-input style="width: 80%" type="number" v-model="scope.row.totalPayment" size="small" disabled></el-input>
          <!--<span v-else>{{scope.row.targetCost}}</span>-->
        </template>
      </el-table-column>
      <el-table-column label="操作" class="is-required" align="center">
        <template slot-scope="scope">
          <el-button type="text" size="small"><i class="el-icon-close"></i> 删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  export default {
    name: "costSubtable",
    data(){
      return{
        tableKey: 0,
        enableSel: false,
        tableData: [],
        sourceData: [
          {
            id: 1,
            expenseItemType: "【料】",
            norigsignmny:'',
            targetCost:'',
            costAfterAdjustment:'',
            cumulativeAdjustment:'',
            expenditureAmount:'',
            settlementAmount:'',
            totalPayment:'',
            pid: null,
            details: []
          },
          {
            id: 2,
            expenseItemType: "【工】",
            norigsignmny:'',
            targetCost:'',
            costAfterAdjustment:'',
            cumulativeAdjustment:'',
            expenditureAmount:'',
            settlementAmount:'',
            totalPayment:'',
            pid: null,
            details: []
          },
          {
            id: 3,
            expenseItemType: "【专业分包】",
            norigsignmny:'',
            targetCost:'',
            costAfterAdjustment:'',
            cumulativeAdjustment:'',
            expenditureAmount:'',
            settlementAmount:'',
            totalPayment:'',
            pid: null,
            details: []
          }, {
            id: 4,
            expenseItemType: "【费】",
            norigsignmny:'',
            targetCost:'',
            costAfterAdjustment:'',
            cumulativeAdjustment:'',
            expenditureAmount:'',
            settlementAmount:'',
            totalPayment:'',
            pid: null,
            details: []

          }, {
            id: 5,
            expenseItemType: "【预缴税金】",
            norigsignmny:'',
            targetCost:'',
            costAfterAdjustment:'',
            cumulativeAdjustment:'',
            expenditureAmount:'',
            settlementAmount:'',
            totalPayment:'',
            pid: null,
            details: []

          }, {
            id: 6,
            expenseItemType: "【增值税及附加】",
            norigsignmny:'',
            targetCost:'',
            costAfterAdjustment:'',
            cumulativeAdjustment:'',
            expenditureAmount:'',
            settlementAmount:'',
            totalPayment:'',
            pid: null,
            details: []

          }
        ],
      }
    },
    created(){

    },
    methods:{
      handleMessage(event){
        console.log(event.data);
        const {data} = event;
        if(data.type === 'ytzg'){
          console.log('通信成功')
        }
      },
      handleSelectionChange(val) {
        console.log(val);
      }
    },
    mounted(){
      window.addEventListener('message',this.handleMessage)
      this.$on('hook:beforeDestory',()=>{
        window.removeEventListener('message',this.handleMessage)
      })
    }
  }
</script>

<style scoped>
  .costTable{
    margin-top: 10px;
    /*background: rgb(245 246 248);*/
  }
  .title {
    vertical-align: middle;
    display: flex;
    align-items: center;
    font-size: 12px;
    font-weight: bold;
    color: #0D1126;
    border-bottom: 1px solid #f3f3f3;
    padding: 5px 0;
  }

  .title::before {
    content: "";
    display: inline-block;
    width: 4px;
    height: 20px;
    margin-right: 15px;
    background-color: #006EFF;
  }
</style>
