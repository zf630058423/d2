<template>
  <div class="engineeringClass">
    <el-row :gutter="20" class="engineer-data-box">
      <el-col :span="24" style="margin-top: 10px">
        <el-col :span="3" class="engineer-data-item">
          <div class="engineer-data-item-title">
            <span class="engineer-icon-class icon-img-1" ></span>
            <span>项目金额</span>
          </div>
          <div class="engineer-data-item-num">{{engineerList.projectAmount }} <span class="danwei">万</span></div>
        </el-col>
        <el-col :span="3" class="engineer-data-item">
          <div class="engineer-data-item-title">
            <span class="engineer-icon-class icon-img-2" ></span>
            <span>累计完成产值</span>
            <span class="el-icon-info linkBtn" style="font-size: 13px" @click="handleLink('0')"></span>
          </div>
          <div class="engineer-data-item-num">{{engineerList.totalOutputValue }} <span class="danwei">万</span></div>
        </el-col>
        <el-col :span="3" class="engineer-data-item">
          <div class="engineer-data-item-title">
            <span class="engineer-icon-class icon-img-3" ></span>
            <span>剩余产值</span>
          </div>
          <div class="engineer-data-item-num">{{engineerList.surplusOutputValue }} <span class="danwei">万</span></div>
        </el-col>
        <el-col :span="3" class="engineer-data-item">
          <div class="engineer-data-item-title">
            <span class="engineer-icon-class icon-img-4" ></span>
            <span>累计应收</span>
          </div>
          <div class="engineer-data-item-num">{{engineerList.receivable}} <span class="danwei">万</span></div>
        </el-col>
        <el-col :span="3" class="engineer-data-item">
          <div class="engineer-data-item-title">
            <span class="engineer-icon-class icon-img-5" ></span>
            <span>累计收款</span>
          </div>
          <div class="engineer-data-item-num">{{engineerList.accumulatedReceipts }} <span class="danwei">万</span></div>
        </el-col>
        <el-col :span="3" class="engineer-data-item">
          <div class="engineer-data-item-title">
            <span class="engineer-icon-class icon-img-6" ></span>
            <span>施工立项</span>
          </div>
          <div class="engineer-data-item-num">{{engineerList.projectConstructionApproval}} <span class="danwei">个</span></div>
        </el-col>
        <el-col :span="3" class="engineer-data-item">
          <div class="engineer-data-item-title">
            <span class="engineer-icon-class icon-img-7" ></span>
            <span>已签合同</span>
          </div>
          <div class="engineer-data-item-num">{{engineerList.signedContract}} <span class="danwei">个</span></div>
        </el-col>
      </el-col>
      <el-col :span="24">
        <el-col :span="3" class="engineer-data-item">
          <div class="engineer-data-item-title">
            <span class="engineer-icon-class icon-img-8" ></span>
            <span>支出类合同</span>
          </div>
          <div class="engineer-data-item-num">{{engineerList.expenditureContract }} <span class="danwei">万</span></div>
        </el-col>
        <el-col :span="3" class="engineer-data-item">
          <div class="engineer-data-item-title">
            <span class="engineer-icon-class icon-img-9" ></span>
            <span>累计应付</span>
          </div>
          <div class="engineer-data-item-num">{{engineerList.accumulativeTotal }} <span class="danwei">万</span></div>
        </el-col>
        <el-col :span="3" class="engineer-data-item">
          <div class="engineer-data-item-title">
            <span class="engineer-icon-class icon-img-10" ></span>
            <span>累计付款</span>
          </div>
          <div class="engineer-data-item-num">{{engineerList.cumulativePayment }} <span class="danwei">万</span></div>
        </el-col>
        <el-col :span="3" class="engineer-data-item">
          <div class="engineer-data-item-title">
            <span class="engineer-icon-class icon-img-11" ></span>
            <span>现金流</span>
          </div>
          <div class="engineer-data-item-num">{{engineerList.cashFlow}} <span class="danwei">万</span></div>
        </el-col>
        <el-col :span="3" class="engineer-data-item">
          <div class="engineer-data-item-title">
            <span class="engineer-icon-class icon-img-12" ></span>
            <span>利润</span>
          </div>
          <div class="engineer-data-item-num">{{engineerList.profit}} <span class="danwei">万</span></div>
        </el-col>
        <el-col :span="3" class="engineer-data-item">
          <div class="engineer-data-item-title">
            <span class="engineer-icon-class icon-img-13" ></span>
            <span>风险项目</span>
          </div>
          <div class="engineer-data-item-num">{{engineerList.riskItems}} <span class="danwei">个</span></div>
        </el-col>
        <el-col :span="3" class="engineer-data-item">
          <div class="engineer-data-item-title">
            <span class="engineer-icon-class icon-img-14" ></span>
            <span>未签合同</span>
          </div>
          <div class="engineer-data-item-num">{{engineerList.unsignedContract}} <span class="danwei">个</span></div>
        </el-col>
      </el-col>
    </el-row>
    <el-row>
      <div class="engineer-table-screen">
        <el-form ref="form" :model="form" label-width="100px" size="small" :inline="true">
          <el-form-item label="项目编号：">
            <el-input placeholder="请输入" v-model="form.BillNo" class="input-with-select" readonly clearable @clear="handleClearBillNo">
              <el-button slot="append" icon="el-icon-search" @click="handleOpenNo"></el-button>
            </el-input>
          </el-form-item>
          <el-form-item label="施工单位：">
            <el-input placeholder="请输入" v-model="form.marketingUnitName" class="input-with-select" readonly clearable @clear="handleClearMarketing">
              <el-button slot="append" icon="el-icon-search" @click="handleOpenDept"></el-button>
            </el-input>
          </el-form-item>
          <el-form-item label="项目状态：">
            <el-checkbox-group v-model="checkList" style="display: inline-block" size="small">
              <el-checkbox label="未开工">未开工</el-checkbox>
              <el-checkbox label="在建中">在建中</el-checkbox>
              <el-checkbox label="已完工">已完工</el-checkbox>
              <el-checkbox label="已竣工">已竣工</el-checkbox>
              <el-checkbox label="停工中">停工中</el-checkbox>
              <el-checkbox label="已结算">已结算</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" icon="el-icon-search" style="margin-left: 15px" @click="handleQueryForm">搜索
            </el-button>
            <el-button size="small"  style="margin-left: 15px" @click="handleRestForm">重置
            </el-button>
            <el-button type="primary" size="small" plain @click="handleExportData">导出<i class="el-icon-download el-icon--right"></i></el-button>
            <el-button size="small"  style="margin-left: 15px" @click="handleTest">数据同步
            </el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table :data="tableData" fit style="width: 99%;min-height: 300px" v-bind:header-cell-style="{background:'#f7f7f7',color:'#000000',fontWeight:'bold'}" v-loading="loading"
                v-bind:row-style="{fontSize: '13px',fontFamily:'微软雅黑'}">
        <el-table-column type="index" width="50" label="序号" fixed>
        </el-table-column>
        <el-table-column label="项目编号" width="150px">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" :content="scope.row.projectNo" placement="top-start" show-tooltip-when-overflow>
              <span class="linkClass" @click="toProjectEngineer(scope.row)">{{ scope.row.projectNo }}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="项目名称" width="150px" show-tooltip-when-overflow>
          <template slot-scope="scope">
            <span >{{ scope.row.projectName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="收入合同编号" width="150px" show-tooltip-when-overflow>
          <template slot-scope="scope">
            <span >{{ scope.row.contractNo }}</span>
          </template>
        </el-table-column>
        <el-table-column label="收入合同名称" width="150px">
          <template slot-scope="scope">
            <span >{{ scope.row.contractName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="客户" width="150px" show-tooltip-when-overflow>
          <template slot-scope="scope">
            <span>{{ scope.row.customer }}</span>
            <!--<span @click="handelCustomerLink(scope.row)">{{ scope.row.customer }}</span>-->
          </template>
        </el-table-column>
        <el-table-column label="施工单位" width="150px" show-tooltip-when-overflow>
          <template slot-scope="scope">
            <span >{{ scope.row.constructionUnit }}</span>
          </template>
        </el-table-column>
        <el-table-column label="项目状态" width="100px" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.projectStatus === '在建中'" class="state_4">{{ scope.row.projectStatus }}</span>
            <span v-else-if="scope.row.projectStatus === '停工中'" class="state_2">{{ scope.row.projectStatus }}</span>
            <span v-else-if="scope.row.projectStatus === '已完工' || scope.row.projectStatus === '已竣工' || scope.row.projectStatus === '已结算'" class="state_5">{{ scope.row.projectStatus }}</span>
            <span v-else>{{ scope.row.projectStatus }}</span>
          </template>
        </el-table-column>
        <el-table-column label="项目经理" width="120px">
          <template slot-scope="scope">
            <span >{{ scope.row.projectManager }}</span>
          </template>
        </el-table-column>
        <el-table-column label="项目金额(元)" width="150px">
          <template slot-scope="scope">
            <span >{{ scope.row.projectAmount | numberFixed}}</span>
          </template>
        </el-table-column>
        <el-table-column label="累计完成产值(元)" width="150px">
          <template slot-scope="scope">
            <span >{{ scope.row.outputValue | numberFixed}}</span>
          </template>
        </el-table-column>
        <el-table-column label="累计应收(元)" width="150px">
          <template slot-scope="scope">
            <span >{{ scope.row.receivable | numberFixed }}</span>
          </template>
        </el-table-column>
        <el-table-column label="累计应付(元)" width="150px">
          <template slot-scope="scope">
            <span >{{ scope.row.accumulativeTotal | numberFixed }}</span>
          </template>
        </el-table-column>
        <el-table-column label="累计收款(元)" width="150px">
          <template slot-scope="scope">
            <span >{{ scope.row.accumulatedReceipts | numberFixed }}</span>
          </template>
        </el-table-column>
        <el-table-column label="累计付款(元)" width="150px">
          <template slot-scope="scope">
            <span >{{ scope.row.cumulativePayment | numberFixed }}</span>
          </template>
        </el-table-column>
        <el-table-column label="进度" width="160px">
          <template slot-scope="scope">
            <!--<span >{{ scope.row.speed }}</span>-->
            <progress-plus style="width: 150px" :color="'#67C23A'" :percent="scope.row.speed * 100  >= 100?100:scope.row.speed*100" />
          </template>
        </el-table-column>
      </el-table>
      <div class="block" style="padding: 10px">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="form.pageIndex"
          :page-sizes="[10, 20, 30, 40,50]"
          :page-size="form.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
    </el-row>
  </div>
</template>

<script>
  import ProgressPlus from '@/components/progressPlus.vue'
  import {exportDatas} from "../../../Api/common";
  import api from '@/Api/home/workSpace';

  export default {
    name: "engineering",
    components:{
      ProgressPlus
    },
    data() {
      return {
        input3: null,
        checkList:[],
        total: null,
        loading: false, // 加载中~
        form:{
          myId: null,
          BillNo: null,
          itemStatus: null,
          marketingUnitId: null,
          marketingUnitName: null,
          pageIndex: 1,
          pageSize: 10
        },
        tableData: [],
        engineerList:{}
      }
    },
    methods:{
      getData(){
        console.log(1)
      },
      // 查询方法
      handleQueryForm(){
        var that = this;
        that.getSumData();
        that.handleCurrentChange(1);
      },
      // 重置方法
      handleRestForm(){
        this.form = {
          myId: null,
          BillNo: null,
          itemStatus: [],
          marketingUnitId: null,
          marketingUnitName: null,
          pageIndex: 1,
          pageSize: 10
        };
        this.checkList = [];
        this.getSumData();
        this.getTableList();
      },
      // 查询汇总数据
     async getSumData(){
        let that = this;
        let isOk = false;
        let list;
        if (that.checkList.length === 0) {
          list = [];
        } else {
          list = that.checkList;
        }

        console.log(list);
        const params = {
          "projectId": that.form.myId,
          "constructionUnitId": that.form.marketingUnitId,
          "projectStatus": list
        };
        // $.extendAjax("/extend/projectSummary/projectDatSummary", JSON.stringify(data), "post", function (res) {
        //   if (res.code === 200) {
        //     that.engineerList = res.data === null?{}:res.data;
        //   } else {
        //     return isOk
        //   }
        // });
        let { data } = await api.projectDatSummary(params);
        that.engineerList = data || {};
      },
      // 查询列表数据
      async getTableList(){
        let that = this;
        let isOk = false;
        let list;
        if (that.checkList.length === 0) {
          list = [];
        } else {
          list = that.checkList;
        }
        that.loading = true;
        that.tableData = [];
        console.log(list);
        const data = {
          "projectId": that.form.myId,
          "constructionUnitId": that.form.marketingUnitId,
          "projectStatus": list,
          "pageIndex": that.form.pageIndex,
          "pageSize": that.form.pageSize
        };
        // $.extendAjax("/extend/projectSummary/pageProjectList", JSON.stringify(data), "post", function (res) {
        //   if (res.code === 200) {
        //     that.loading = false;
        //     that.tableData = res.rows;
        //     that.total = res.total;
        //   } else {
        //     return isOk
        //   }
        // });
        let res = await api.pageProjectList(data);
        that.loading = false;
        that.tableData = res.rows;
        that.total = res.total;
      },
      // 打开项目列表选择
      handleOpenNo(){
        var that = this;
        that.openCustomDialog('', '项目档案', 'BPM_XiangMuBianHao_4419', 'ct_bpm_projectfiles', 700, 400, false)
      },
      openCustomDialog(id, name, code, ObjName, width, height, radioMultiple) {
        var that = this;
        var multi = radioMultiple == '1';
        CustomDialog(that, {
          customDialog: code,
          isTest: false,
          width: width,
          height: height,
          isMulti: multi,
          data: [
            {
              field: 'testName',
              property: 'myid'
            }
          ],
          callBack: function (data) {
            //自定义回调函数不是必须的，可删除
            console.log(data);
            that.form.value = data[0].ItemName;
            const obj = data[0];
            that.form = {
              BillNo: obj.BillNo,
              myId: obj.MyId
            };
            that.$forceUpdate()
          }
        });
      },
      // 打开施工单位
      handleOpenDept() {
        var that = this;
        var parm = {"needRoot": false, singleSelect: true, resultFieldKey: '', data: []};
        FUI.dialog(__webpath + "/workflow/selector/selectOrg_custom", "选择施工单位", parm, 500, 560, function (objectData, index, layerObject) {
          console.log(objectData)
          if (objectData.length > 0) {
            that.form.marketingUnitId = objectData[0].id;
            that.form.marketingUnitName = objectData[0].text;
            that.$forceUpdate()
          }
          layerObject.close(index);
        }, true);
      },
      handleSizeChange(val) {
        this.form.pageSize = val;
        this.getTableList()
      },
      handleCurrentChange(val) {
        this.form.pageIndex = val;
        this.getTableList()
      },
      toProjectEngineer(row){
        this.$router.push({
          path: '/home/projectHall',
          query: {
            myId: row.projectId,
            projectNo: row.projectNo,
            oIndex: 1
          }
        });

      },
      // 清空
      handleClearBillNo(){
        var that = this;
        that.form = {
          BillNo: null,
          myId: null
        };
      },
      //清空
      handleClearMarketing(){
        var that = this;
        that.form = {
          marketingUnitId: null,
          marketingUnitName: null,
        };
      },
      //导出数据
      handleExportData(){
        var that = this;
        let list;
        if (that.checkList.length === 0) {
          list = [];
        } else {
          list = that.checkList;
        }
        const data = {
          "projectId": that.form.myId,
          "constructionUnitId": that.form.marketingUnitId,
          "projectStatus": list,
          "pageIndex": that.form.pageIndex,
          "pageSize": that.form.pageSize
        };
        exportDatas(data,1).then((res) =>{
          if (res) {
            console.log(res);
            const link=document.createElement('a');
            try{
              let blob =  res;
              var myDate = new Date();
              let _fileName = '项目工程--'+ myDate.toDateFormat('yyyyMMddHHmmssS')+'.xlsx'; //文件名，
              link.style.display='none';
              const url = window.URL || window.webkitURL || window.moxURL;
              link.href=url.createObjectURL(blob);
              link.download = _fileName;   //下载的文件名称
              link.click();
              window.URL.revokeObjectURL(url);
            }catch (e) {
              console.log('下载的文件出错',e)
            }
          }
        })
      },
      // 跳转链接
      handleLink(oIndex) {
        var code = '';
        if(oIndex === '0'){
          code = 'custGrid_WorkflowForm_BPM_ChanXianTianBao';
        } else if (oIndex === '1') {
          // 营销立项
          code = 'custGrid_WorkflowForm_BPM_MarketingProject';
        } else if (oIndex === '2') {
          // 开标结果
          code = 'custGrid_WorkflowForm_BPM_BidOpeningResult';
        } else if (oIndex === '3') {
          // 标前评审
          code = 'custGrid_WorkflowForm_BPM_PreBidReview_0268';
        }
        // 跳转列表
        // this.$router.push({path: '/workflow/security/customDataGrid/customDataGridView/?code='+code});
        var url = __webpath + '/workflow/security/customDataGrid/customDataGridView/?code=' + code;
        window.open(url, '_blank');
      },
      // 打开客户档案
      handelCustomerLink(row){
        var that = this;
        var tableName = "ct_BPM_CustomerFiles";
        var id = ''
        Object.siteLink(that,)

      },
      // 数据同步，仅供测试使用
     async handleTest(){
        var isOk = false;
        var that = this;
        // $.extendAjax("/extend/projectSummary/test", '', "get", function (res) {
        //   if (res.code === 200) {
        //     that.getSumData();
        //     that.getTableList();
        //     return !isOk
        //   } else {
        //     return isOk
        //   }
        // });
        await api.handleTest();
        that.getSumData();
        that.getTableList();
      }
    }
  }
</script>

<style scoped>
  .engineer-data-item {
    border: 1px solid #f2f6fc;
    box-shadow: 0 2px 12px 0 #f2f6fc;
    height: 100%;
    padding: 25px;
    margin: 10px 0.888%;
    border-radius: 2px;
  }

  .engineer-data-item .engineer-data-item-title {
    font-size: 16px;
    font-weight: 500;
    /*font-family: Microsoft YaHei;*/
    display: flex;
    align-items: center;
    justify-content: flex-start;
    color: #909399;
    font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", Helvetica, Roboto, Arial, "PingFang SC", "Hiragino Sans GB", "Microsoft Yahei", "Microsoft Jhenghei", sans-serif;


  }

  .engineer-data-item .engineer-data-item-num {
    font-size: 17px;
    margin-top: 10px;
    padding-left: 40px;
    color: #000000;
    font-family: Microsoft YaHei;
    font-weight: bold;

  }

  .engineer-data-item .engineer-icon-class {
    font-size: 22px;
    margin-right: 6px;
    margin-left: 10px
  }
  .engineer-table-screen{
    padding: 20px 0 0 0;
  }
  .engineer-table-screen-input{
    margin-right: 20px;
  }
  /*-----------------------------小图标展示-----------------------------------------------------*/
  .icon-img-1{
    width: 25px;
    height: 25px;
    background: url("../../../resources/images/desktop/css_sprites3.png") no-repeat -318px 0 ;
    background-size: cover;
  }
  .icon-img-2{
    width: 25px;
    height: 25px;
    background: url("../../../resources/images/desktop/css_sprites3.png") no-repeat -340px 0 ;
    background-size: cover;
  }
  .icon-img-3{
    width: 25px;
    height: 25px;
    background: url("../../../resources/images/desktop/css_sprites3.png") no-repeat -68px 0 ;
    background-size: cover;
  }
  .icon-img-4{
    width: 25px;
    height: 25px;
    background: url("../../../resources/images/desktop/css_sprites.png") no-repeat -48px 0 ;
    background-size: cover;
  }
  .icon-img-5{
    width: 25px;
    height: 25px;
    background: url("../../../resources/images/desktop/css_sprites3.png") no-repeat -90px 0 ;
    background-size: cover;
  }
  .icon-img-6{
    width: 25px;
    height: 25px;
    background: url("../../../resources/images/desktop/css_sprites.png") no-repeat -68px 0 ;
    background-size: cover;
  }
  .icon-img-7{
    width: 25px;
    height: 25px;
    background: url("../../../resources/images/desktop/css_sprites.png") no-repeat -320px 0 ;
    background-size: cover;
  }
  .icon-img-8{
    width: 25px;
    height: 25px;
    background: url("../../../resources/images/desktop/css_sprites3.png") no-repeat -158px 0 ;
    background-size: cover;
  }
  .icon-img-9{
    width: 25px;
    height: 25px;
    background: url("../../../resources/images/desktop/css_sprites3.png") no-repeat -136px 0 ;
    background-size: cover;
  }
  .icon-img-10{
    width: 25px;
    height: 25px;
    background: url("../../../resources/images/desktop/css_sprites3.png") no-repeat -248px 0 ;
    background-size: cover;
  }
  .icon-img-11{
    width: 25px;
    height: 25px;
    background: url("../../../resources/images/desktop/css_sprites3.png") no-repeat -205px 0 ;
    background-size: cover;
  }
  .icon-img-12{
    width: 25px;
    height: 25px;
    background: url("../../../resources/images/desktop/css_sprites3.png") no-repeat -226px 0 ;
    background-size: cover;
  }
  .icon-img-13{
    width: 25px;
    height: 25px;
    background: url("../../../resources/images/desktop/css_sprites.png") no-repeat -194px 0 ;
    background-size: cover;
  }
  .icon-img-14{
    width: 25px;
    height: 25px;
    background: url("../../../resources/images/desktop/css_sprites.png") no-repeat -223px 0 ;
    background-size: cover;
  }
  .danwei{
    font-size: 14px;
    color: #616161;
    font-weight: normal;
    padding: 0 2px;
  }
  .state_5 {
    display: inline-block;
    width: 72px;
    height: 27px;
    background: rgba(56, 183, 129, 0.19);
    /* opacity: 0.1; */
    border-radius: 101px;
    color: #38B781;
    text-align: center;
    line-height: 27px;
    /*padding: 2px 10px;*/
    font-size: 13px;
    font-weight: 400;
  }

  .state_4 {
    display: inline-block;
    width: 72px;
    height: 27px;
    background: rgba(83, 142, 255, 0.19);
    /* opacity: 0.1; */
    border-radius: 101px;
    color: #538EFF;
    text-align: center;
    line-height: 27px;
    /*padding: 2px 10px;*/
    font-size: 13px;
    font-weight: 400;
  }
  .state_2 {
    display: inline-block;
    width: 72px;
    height: 27px;
    background: rgba(255,102,95, 0.19);
    /* opacity: 0.1; */
    border-radius: 101px;
    color: #FF665F;
    text-align: center;
    line-height: 27px;
    /*padding: 2px 10px;*/
    font-size: 13px;
    font-weight: 400;
  }
  .linkClass {
    color: #538EFF;
    cursor: pointer;
    list-style: decimal;
    text-decoration: underline;
  }
  .linkBtn {
    cursor: pointer;
    color: #538EFF;
  }
</style>
