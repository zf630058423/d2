<template>
    <div class="costTable">
      <el-table :data="sourceData" style="width: 100%;" :key="tableKey" border stripe size="small"
                ref="cimsDictTable"
                tooltip-effect="dark" height="400px" header-row-class-name="data-table-header"
                :show-overflow-tooltip="true">
        <el-table-column label="序号" type="index" width="50"></el-table-column>
        <el-table-column label="费用项目">
          <template slot-scope="scope">
            <span>{{scope.row.expenseItemType}}</span>
          </template>
        </el-table-column>
        <el-table-column label="合同金额(元)" class="is-required">
          <template slot-scope="scope">
            <el-input style="width: 80%" type="number" v-model="scope.row.norigsignmny" size="small" disabled></el-input>
            <!--<span v-else>{{scope.row.contractAmount}}</span>-->
          </template>
        </el-table-column>
        <el-table-column label="目标成本(元)" class="is-required">
          <template slot-scope="scope">
            <el-input style="width: 80%" type="number" v-model="scope.row.targetCost" size="small" disabled></el-input>
            <!--<span v-else>{{scope.row.targetCost}}</span>-->
          </template>
        </el-table-column>
        <el-table-column label="调整后成本(元)" class="is-required">
          <template slot-scope="scope">
            <el-input style="width: 80%" type="number" v-model="scope.row.costAfterAdjustment" size="small" disabled></el-input>
            <!--<span v-else>{{scope.row.targetCost}}</span>-->
          </template>
        </el-table-column>
        <el-table-column label="累计调整成本(元)" class="is-required">
          <template slot-scope="scope">
            <el-input style="width: 80%" type="number" v-model="scope.row.cumulativeAdjustment" size="small" disabled></el-input>
            <!--<span v-else>{{scope.row.targetCost}}</span>-->
          </template>
        </el-table-column>
        <el-table-column label="支出合同金额(含税)(元)" class="is-required">
          <template slot-scope="scope">
            <el-input style="width: 80%" type="number" v-model="scope.row.expenditureAmount" size="small" disabled></el-input>
            <!--<span v-else>{{scope.row.targetCost}}</span>-->
          </template>
        </el-table-column>
        <el-table-column label="结算金额(含税)(元)" class="is-required">
          <template slot-scope="scope">
            <el-input style="width: 80%" type="number" v-model="scope.row.settlementAmount" size="small" disabled></el-input>
            <!--<span v-else>{{scope.row.targetCost}}</span>-->
          </template>
        </el-table-column>
        <el-table-column label="累计付款(含税)(元)" class="is-required">
          <template slot-scope="scope">
            <el-input style="width: 80%" type="number" v-model="scope.row.totalPayment" size="small" disabled></el-input>
            <!--<span v-else>{{scope.row.targetCost}}</span>-->
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
        methods:{
          // 接收上级传值
          getObj(obj){

            this.sourceData = obj;
          }
        },
        mounted() {
          //高度撑开
          this.$emit('changeHeight');
        }
    }
</script>

<style scoped>

</style>
