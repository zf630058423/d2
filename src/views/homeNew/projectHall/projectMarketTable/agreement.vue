<template>
    <div class="agreementTable">
      <div>
        <div class="agreementTable-title">
          <span class="agreementTable-tittle-BlueBar"></span>
          <span class="agreementTable-title-text">项目协议</span></div>
        <el-table :data="tableData_1" v-loading="loading1" show-summary  :summary-method="getSummaries1" style="width: 100%;" v-bind:header-cell-style="{background:'#f7f7f7',color:'#000000',fontWeight:'normal'}">
          <el-table-column type="index" width="50" label="序号">
          </el-table-column>
          <el-table-column label="单据编号" prop="billNo">
          </el-table-column>
          <el-table-column label="协议名称" prop="scheme">
          </el-table-column>
          <el-table-column label="预估合作金额(元)" >
            <template slot-scope="scope">
              <span >{{ scope.row.estimatedAmountOfCooperation | qianfenWeiFormat}}</span>
            </template>
          </el-table-column>
          <el-table-column label="有效开始日期" >
            <template slot-scope="scope">
              <span >{{ scope.row.effectiveBeginDate | formatDay}}</span>
            </template>
          </el-table-column>
          <el-table-column label="有效结束日期" >
            <template slot-scope="scope">
              <span >{{ scope.row.effectiveEndDate | formatDay}}</span>
            </template>
          </el-table-column>
          <el-table-column label="最新有效结束日期" >
            <template slot-scope="scope">
              <span v-if="scope.row.toHandleTheType === '1'">{{ scope.row.theLatestValidEndDate | formatDay}}</span>
            </template>
          </el-table-column>
          <el-table-column label="办理类型" >
            <template slot-scope="scope">
              <span >{{ scope.row.toHandleTheType | filtertoHandleTheType}}</span>
            </template>
          </el-table-column>
          <el-table-column label="主协议编号" prop="masterProtocolNo">
          </el-table-column>
          <el-table-column label="主协议名称" prop="masterProtocolName">
          </el-table-column>
        </el-table>
      </div>
      <div class="mt10">
        <div class="agreementTable-title">
          <span class="agreementTable-tittle-BlueBar"></span>
          <span class="agreementTable-title-text">收入合同</span></div>
        <el-table :data="tableData_2" v-loading="loading2" show-summary :summary-method="getSummaries2" style="width: 100%;" v-bind:header-cell-style="{background:'#f7f7f7',color:'#000000',fontWeight:'normal'}">
          <el-table-column type="index" width="50" label="序号">
          </el-table-column>
          <el-table-column label="项目编号" prop="projectCode">
          </el-table-column>
          <el-table-column label="项目名称" prop="projectName">
          </el-table-column>
          <el-table-column label="合同编号" prop="vbillCode">
          </el-table-column>
          <el-table-column label="合同名称" prop="mastercontName">
          </el-table-column>
          <el-table-column label="合同总金额(元)" >
            <template slot-scope="scope">
              <span >{{ scope.row.norigsigntaxmny | numberFixed}}</span>
            </template>
          </el-table-column>
          <el-table-column label="主协议编号" prop="projectAgreementNo">
          </el-table-column>
          <el-table-column label="主协议名称" prop="projectAgreementName">
          </el-table-column>
        </el-table>
      </div>

    </div>
</template>

<script>
    export default {
        name: "agreementTable",
        data(){
          return{
            getMyId: null,
            loading1: false,
            loading2: false,
            tableData_1: [],
            tableData_2: [],
          }
        },
      methods:{
        // 接收父级传值
        getParentVal(id){
          this.getTableData_1(id);
          this.getTableData_2(id);
        },
        //获取项目协议
        getTableData_1(id) {
          var that = this;
          if(id){
            that.loading1 = true;
            $.extendAjax(`/extend/engmanager/buildsecuritycontract/queryProjectAgreementByProjectID?myId=${id}`, '', "get", function (d) {
              if (d.data) {
                that.loading1 = false;
                that.tableData_1 = d.data
              }
            });
          }

        },
        // 获取收入合同
        getTableData_2(id) {
          var that = this;
          if(id){
            that.loading2 = true;
            $.extendAjax(`/takeAContract/queryTakeaAndOtherContractByProjectID?myId=${id}`, '', "get", function (d) {
              if (d.data) {
                that.loading2 = false;
                that.tableData_2 = d.data
              }
            });
          }

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
            const values = data.map(item => Number(item['estimatedAmountOfCooperation']));
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
          });

          return sums;
        },
        // 合计
        getSummaries2(param) {
          const { columns, data } = param;
          const sums = [];
          columns.forEach((column, index) => {
            if (index === 0) {
              sums[index] = '合计';
              return;
            }
            const values = data.map(item => Number(item['norigsigntaxmny']));
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
        }
      }
    }
</script>

<style scoped>
  .agreementTable{
    /*margin-top: 10px;*/
  }
  .agreementTable-tittle-BlueBar{
    display: inline-block;
    width: 3px;
    height: 20px;
    background: #006EFF;
  }
  .agreementTable-title{
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding: 10px 0;
    background: #FFFFFF;
  }
  .agreementTable-title-text{
    font-size: 14px;
    font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
    margin-left: 10px;
    font-weight: normal;
  }
</style>
