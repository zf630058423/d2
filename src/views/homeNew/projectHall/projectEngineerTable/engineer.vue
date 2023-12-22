<template>
  <div class="engineerTable">
    <div class="engineerTable-table-box">
      <div class="engineerTable-table-menu">
        <span v-for="(item,index) in engineerTableMenu" :key="index" @click="handleEngineerTableMenu(index)"
              :class="{'engineerTable-menu-active':getMenuIndx === index}">
              {{item}}
              </span>
      </div>
    </div>
    <div class="engineerTable-table-content">
      <el-table :data="tableData_1" v-loading="loading" style="width: 100%" v-bind:header-cell-style="{background:'#f7f7f7',color:'#000000',fontWeight:'normal'}"  :row-style="{fontSize:'13px'}">
        <el-table-column type="index" width="50" label="序号">
        </el-table-column>
        <el-table-column label="合同编号" show-tooltip-when-overflow>
          <template slot-scope="scope">
            <span >{{ scope.row.billno }}</span>
          </template>
        </el-table-column>
        <el-table-column label="合同名称" show-tooltip-when-overflow>
          <template slot-scope="scope">
            <span >{{ scope.row.contract }}</span>
          </template>
        </el-table-column>
        <el-table-column label="合同供应商" show-tooltip-when-overflow>
          <template slot-scope="scope">
            <span >{{ scope.row.supplier }}</span>
          </template>
        </el-table-column>
        <el-table-column label="合同总金额(元)" >
          <template slot-scope="scope">
            <span >{{ scope.row.contractsumamount | qianfenWeiFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column label="核量金额(元)" >
          <template slot-scope="scope">
            <span >{{ scope.row.theamountofthisaudit | qianfenWeiFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column label="结算金额(元)" >
          <template slot-scope="scope">
            <span >{{ scope.row.settlementamount | qianfenWeiFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column label="税率" >
          <template slot-scope="scope">
            <span >{{ scope.row.taxRate | baifenbiFormat}}</span>
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
            <span >{{ scope.row.retmoney | qianfenWeiFormat}}</span>
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
    name: "engineer",
    data(){
      return{
        engineerTableMenu: ['劳务分包合同', '班组合同', '专业分包合同'],
        getMenuIndx: 0,
        loading: false,
        form: {
          projectId: null,
          projectNo: null,
          billType: null,
          contType: null,
          sort: 'CreateTime',
          pageIndex: 1,
          pageSize: 100
        },
        tableData_1:[]
      }
    },
    methods:{
      // 点击
      handleEngineerTableMenu(val) {
        let that = this;
        that.getMenuIndx = val;
        that.getTableList();
        console.log(val)
      },
      getData(obj){
        var that = this;
        var time;
        that.form.projectId = obj.projectId;
        that.form.projectNo = obj.projectNo;
        that.getMenuIndx = 0;
        clearTimeout(time);
        time = setTimeout(function(){
          that.getTableList()
        }, 500)
      },
      // 获取表单信息 /extend/projectSummary/purchaseContract
      getTableList(){
        var that = this;
        that.loading = true;
        that.form.billType = that.engineerTableMenu[that.getMenuIndx];
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
  .engineerTable-table-menu {
    /*border-bottom: 1px solid #EEEEEE;*/
  }

  .engineerTable-table-menu span {
    font-size: 14px;
    font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
    /*font-weight: bold;*/
    /*line-height: 25px;*/
    opacity: 1;
    /*border: 1px solid;*/
    display: inline-block;
    padding: 15px 20px;
    cursor: pointer;

  }

  .engineerTable-menu-active {
    border-bottom: 2px solid #538eff;
    color: #538eff !important;
    font-family:"Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;

  }

  .engineerTable-table-box {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #EEEEEE;
    background: #FFFFFF;
  }
</style>
