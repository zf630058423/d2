<template>
  <div class="marketingClass">
    <el-row :gutter="20" class="market-data-box">
      <el-col :span="24" style="margin-top: 10px">
        <el-col :span="3" class="market-data-item">
          <div class="market-data-item-title">
            <span class="market-icon-class icon icon-img-1"></span>
            <span>营销立项</span>
            <span class="el-icon-info linkBtn" style="font-size: 13px" @click="handleLink('1')"></span>
          </div>
          <div class="market-data-item-num">{{marketList.constructionCosts | numberFixed}} <span class="danwei">万</span>
          </div>
        </el-col>
        <el-col :span="3" class="market-data-item">
          <div class="market-data-item-title">
            <span class="market-icon-class icon-img-2"></span>
            <span>中标金额</span>
            <span class="el-icon-info linkBtn" style="font-size: 13px" @click="handleLink('2')"></span>
          </div>
          <div class="market-data-item-num">{{marketList.bidPrice | numberFixed}} <span class="danwei">万</span></div>
        </el-col>
        <el-col :span="3" class="market-data-item">
          <div class="market-data-item-title">
            <span class="market-icon-class icon icon-img-3"></span>
            <span>已签合同</span>
          </div>
          <div class="market-data-item-num">{{marketList.norigsigntaxmny | numberFixed}} <span class="danwei">万</span>
          </div>
        </el-col>
        <el-col :span="3" class="market-data-item">
          <div class="market-data-item-title">
            <span class="market-icon-class icon icon-img-4"></span>
            <span>投标转化率</span>
          </div>
          <div class="market-data-item-num">{{marketList.tenderDocumentReviewRate}} <span class="danwei">%</span></div>
        </el-col>
        <el-col :span="3" class="market-data-item">
          <div class="market-data-item-title">
            <span class="market-icon-class icon icon-img-5"></span>
            <span>中标率</span>
          </div>
          <div class="market-data-item-num">{{marketList.bidRate}} <span class="danwei">%</span></div>
        </el-col>
        <el-col :span="3" class="market-data-item">
          <div class="market-data-item-title">
            <span class="market-icon-class icon icon-img-6"></span>
            <span>签约率</span>
          </div>
          <div class="market-data-item-num">{{marketList.signingRate}} <span class="danwei">%</span></div>
        </el-col>
        <el-col :span="3" class="market-data-item">
          <div class="market-data-item-title">
            <span class="market-icon-class icon icon-img-7"></span>
            <span>立项数量</span>
          </div>
          <div class="market-data-item-num">{{marketList.lxCount}} <span class="danwei">个</span></div>
        </el-col>

      </el-col>
      <el-col :span="24">
        <el-col :span="3" class="market-data-item">
          <div class="market-data-item-title">
            <span class="market-icon-class icon icon-img-8"></span>
            <span>跟进中</span>
          </div>
          <div class="market-data-item-num">{{marketList.followingUp}} <span class="danwei">个</span></div>
        </el-col>
        <el-col :span="3" class="market-data-item">
          <div class="market-data-item-title">
            <span class="market-icon-class icon icon-img-9"></span>
            <span>停止跟进</span>
          </div>
          <div class="market-data-item-num">{{marketList.followingStop}} <span class="danwei">个</span></div>
        </el-col>

        <el-col :span="3" class="market-data-item">
          <div class="market-data-item-title">
            <span class="market-icon-class icon icon-img-10"></span>
            <span>投标阶段</span>
            <span class="el-icon-info linkBtn" style="font-size: 13px" @click="handleLink('3')"></span>
          </div>
          <div class="market-data-item-num">{{marketList.biddingStageCount}} <span class="danwei">个</span></div>
        </el-col>

        <el-col :span="3" class="market-data-item">
          <div class="market-data-item-title">
            <span class="market-icon-class icon icon-img-11"></span>
            <span>中标数量</span>
          </div>
          <div class="market-data-item-num">{{marketList.bidOpeningResultCount}} <span class="danwei">个</span></div>
        </el-col>
        <el-col :span="3" class="market-data-item">
          <div class="market-data-item-title">
            <span class="market-icon-class icon icon-img-12"></span>
            <span>施工立项</span>
          </div>
          <div class="market-data-item-num">{{marketList.projectConstructionApprovalCount}} <span
            class="danwei">个</span></div>
        </el-col>
        <el-col :span="3" class="market-data-item">
          <div class="market-data-item-title">
            <span class="market-icon-class icon icon-img-13"></span>
            <span>签约数量</span>
          </div>
          <div class="market-data-item-num">{{marketList.takeAndOtherContraCount}} <span class="danwei">个</span></div>
        </el-col>
        <el-col :span="3" class="market-data-item">
          <div class="market-data-item-title">
            <span class="market-icon-class icon icon-img-14"></span>
            <span>待签约</span>
          </div>
          <div class="market-data-item-num">{{(!Number(marketList.signUp))?0:(Number(marketList.signUp)) <= 0?0:(Number(marketList.signUp))}} <span class="danwei">个</span></div>
        </el-col>
      </el-col>
    </el-row>
    <el-row>
      <div class="market-table-screen">
        <el-form ref="form" :model="form" label-width="100px" size="small" :inline="true">
          <el-form-item label="立项编号：">
            <el-input placeholder="请输入" v-model="form.BillNo" class="input-with-select" readonly>
              <el-button slot="append" icon="el-icon-search" @click="handleOpenNo"></el-button>
            </el-input>
          </el-form-item>
          <el-form-item label="营销单位：">
            <el-input placeholder="请输入" v-model="form.marketingUnitName" class="input-with-select" readonly>
              <el-button slot="append" icon="el-icon-search" @click="handleOpenDept"></el-button>
            </el-input>
          </el-form-item>
          <el-form-item label="立项状态：">
            <el-checkbox-group v-model="checkList" style="display: inline-block" size="small">
              <el-checkbox label="3">跟进中</el-checkbox>
              <el-checkbox label="4">停止跟进</el-checkbox>
              <el-checkbox label="1">已中标</el-checkbox>
              <el-checkbox label="5">未中标</el-checkbox>
              <el-checkbox label="2">已施工立项</el-checkbox>
              <el-checkbox label="6">已签合同</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" icon="el-icon-search" style="margin-left: 15px"
                       @click="handleQueryForm">搜索
            </el-button>
            <el-button size="small" style="margin-left: 15px"
                       @click="handleRestForm">重置
            </el-button>
            <el-button type="primary" size="small" plain>导出<i class="el-icon-download el-icon--right"></i></el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table :data="tableData" style="width: 99%"
                v-bind:header-cell-style="{background:'#f7f7f7',color:'#000000',fontWeight:'bold'}" v-loading="loading">
        <el-table-column type="index" width="50" label="序号" fixed="left">
        </el-table-column>
        <el-table-column label="立项编号" show-tooltip-when-overflow width="150">
          <template slot-scope="scope">
            <span class="linkClass" @click="toProjectMarketing(scope.row)">{{ scope.row.billNo }}</span>
          </template>
        </el-table-column>
        <el-table-column label="立项名称" show-tooltip-when-overflow width="180">
          <template slot-scope="scope">
            <span>{{ scope.row.itemName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="客户" show-tooltip-when-overflow width="180" :show-tooltip-when-overflow="true">
          <template slot-scope="scope">
            <span>{{ scope.row.customer }}</span>
          </template>
        </el-table-column>
        <el-table-column label="营销单位" width="120" show-tooltip-when-overflow>
          <template slot-scope="scope">
            <span>{{ scope.row.marketingUnit }}</span>
          </template>
        </el-table-column>
        <el-table-column label="立项状态" width="100" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.itemStatus === '6' || scope.row.itemStatus === '1'" class="state_6">{{ scope.row.itemStatus | filterState }}</span>
            <span v-else-if="scope.row.itemStatus === '2'" class="state_6" style="font-size: 12px">{{ scope.row.itemStatus | filterState }}</span>
            <span v-else-if="scope.row.itemStatus === '3'" class="state_3">{{ scope.row.itemStatus | filterState }}</span>
            <span v-else-if="scope.row.itemStatus === '4'" class="state_4">{{ scope.row.itemStatus | filterState }}</span>
            <span v-else>{{ scope.row.itemStatus | filterState }}</span>
          </template>
        </el-table-column>
        <el-table-column label="营销跟进人" width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.follower }}</span>
          </template>
        </el-table-column>
        <el-table-column label="工程造价(元)" width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.constructionCosts | numberFixed}}</span>
          </template>
        </el-table-column>
        <el-table-column label="是否中标" width="100" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.isBid }}</span>
          </template>
        </el-table-column>
        <el-table-column label="中标金额(元)" width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.bidAmount | numberFixed}}</span>
          </template>
        </el-table-column>
        <el-table-column label="项目阶段" min-width="400" align="center">
          <template slot-scope="scope">
            <div class="steps">
              <div :class="{'active':stepIndex=== Steps1}"><span style="cursor: pointer;text-decoration: underline;"  @click="handleToLink(scope.row,'0')">营销立项</span></div>
              <div :class="{'active':stepIndex=== (scope.row.preBidReviewCount ? 1:0 )}">
                <span v-if="scope.row.preBidReviewCount" style="cursor: pointer;text-decoration: underline;"  @click="handleToLink(scope.row,'1')">标前评审</span>
                <span v-else>标前评审</span>
              </div>
              <div :class="{'active':stepIndex=== (scope.row.bidProductionApplyCount? 1:0) }">
                <span v-if="scope.row.bidProductionApplyCount" style="cursor: pointer;text-decoration: underline;"  @click="handleToLink(scope.row,'2')">标书制作</span>
                <span v-else>标书制作</span>
              </div>
              <div :class="{'active':stepIndex=== (scope.row.tenderDocumentReviewCount? 1:0) }">
                <span v-if="scope.row.tenderDocumentReviewCount" style="cursor: pointer;text-decoration: underline;"  @click="handleToLink(scope.row,'3')">投标评审</span>
                <span v-else>投标评审</span>
              </div>
              <div :class="{'active':stepIndex=== (scope.row.bidOpeningResultCount? 1:0) }">
                <span v-if="scope.row.bidOpeningResultCount" style="cursor: pointer;text-decoration: underline;"  @click="handleToLink(scope.row,'4')">开标结果</span>
                <span v-else>开标结果</span>
              </div>
              <div :class="{'active':stepIndex=== (scope.row.projectConstructionApprovalCount ? 1:0)}">
                <span v-if="scope.row.projectConstructionApprovalCount" style="cursor: pointer;text-decoration: underline;"  @click="handleToLink(scope.row,'5')">施工立项</span>
                <span v-else>施工立项</span>
              </div>
              <div :class="{'active':stepIndex=== (scope.row.takeAndOtherContraCount ? 1:0) }">
                <span v-if="scope.row.takeAndOtherContraCount" style="cursor: pointer;text-decoration: underline;"  @click="handleToLink(scope.row,'6')">收入合同</span>
                <span v-else>收入合同</span>
              </div>
            </div>
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
  import customStepsMini from '@/components/customStepsMini.vue'
  import {exportDatas} from "../../../Api/common";
  import api from '@/Api/home/workSpace';

  export default {
    name: "Marketing",
    components: {customStepsMini},
    data() {
      return {
        input3: null,
        checkList: [],
        getStepsData: {},
        activeName: '1',
        total: null,
        loading: false, // 加载中~
        form: {
          myId: null,
          BillNo: null,
          itemStatus: null,
          marketingUnitId: null,
          marketingUnitName: null,
          pageIndex: 1,
          pageSize: 10
        },
        marketList: {},
        marketList2: [],
        tableData: [],
        stepIndex: 1,
        Steps1: 1,
        Steps2: 0,
        Steps3: 0,
        Steps4: 0,
        Steps5: 0,
        Steps6: 0,
        Steps7: 0,
        setData: ['营销立项', '标前立项', '标书制作', '投标评审', '开标结果', '施工立项', '收入合同']
      }
    },
    methods: {
      // 打开立项编号model
      handleOpenNo() {
        var that = this;
        that.openCustomDialog('', '首页营销立项', 'BPM_MarketingProject_9093_CP569', 'ct_bpm_marketingproject', 700, 400, false)
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
            //console.log(data);
           // that.form.value = data[0].ItemName;
            const obj = data[0];
            that.form = {
              BillNo: obj.BillNo,
              myId: obj.MyId
            };
            that.$forceUpdate()
          }
        });
      },
      // 选择营销单位
      handleOpenDept() {
        var that = this;
        var parm = {"needRoot": false, singleSelect: true, resultFieldKey: '', data: []};
        FUI.dialog(__webpath + "/workflow/selector/selectOrg_custom", "选择营销单位", parm, 500, 560, function (objectData, index, layerObject) {
          console.log(objectData)
          if (objectData.length > 0) {
            that.form.marketingUnitId = objectData[0].id;
            that.form.marketingUnitName = objectData[0].text;
            that.$forceUpdate(); // 强制刷新表单
          }
          layerObject.close(index);
        }, true);
      },
      // 搜索方法
      handleQueryForm() {
        var that = this;
        that.form.pageIndex = 1;
        that.form.pageSize = 10;
        that.getTableData();
        that.getData();
      },
      // 重置方法
      handleRestForm() {
        this.form = {
          myId: null,
          BillNo: null,
          itemStatus: [],
          marketingUnitId: '',
          marketingUnitName: '',
          pageIndex: 1,
          pageSize: 10
        };
        this.checkList = [];
        this.getData();
        this.getTableData();
      },
      // 获取数据box
     async getData() {
        let that = this;
        let isOk = false;
        let list;
        if (that.checkList.length === 0) {
          list = '';
        } else {
          let str = that.checkList.join();
          list = str;
        }

        console.log(list);
        const dataParam = {
          myId: that.form.myId,
          marketingUnitId: that.form.marketingUnitId,
          itemStatus: list
        }
        let { data } = await api.queryMarketingProjectStageCount(dataParam);
        that.marketList = data || {};
      },
      // 获取table的数据
      async getTableData() {
        let that = this;
        let isOk = false;
        let list;
        if (that.checkList.length === 0) {
          list = '';
        } else {
          let str = that.checkList.join();
          list = str;
        }
        that.loading = true;
        that.tableData = [];
        var obj = {
          myId: that.form.myId,
          marketingUnitId: that.form.marketingUnitId,
          itemStatus: list,
          pageIndex: that.form.pageIndex,
          pageSize: that.form.pageSize
        };
        let { rows, total } = await api.queryHomePageMarketingProject(obj);
        that.tableData = rows || {};
        that.total = total;
        that.loading = false;
      },
      handleSizeChange(val) {
        this.form.pageSize = val;
        this.getTableData()
      },
      handleCurrentChange(val) {
        this.form.pageIndex = val;
        this.getTableData()
      },
      // 跳转到项目营销页面
      toProjectMarketing(row) {
        this.$router.push({
          path: '/home/projectHall',
          query: {
            myId: row.myId,
            oIndex: 0
          }
        });
      },
      // 跳转链接
      handleLink(oIndex) {
        var code = '';
        if (oIndex === '1') {
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
      handleToLink(row,oIndex) {
        var tableName = '';
        var appId= '';
        var id = row.myId;
        var wiid = '';
        if(oIndex === '0'){
           tableName = 'ct_BPM_MarketingProject';
           appId = 'AE';
           wiid = row.wiid;
        }else if(oIndex === '1'){
          tableName = 'ct_BPM_PreBidReview';
          appId = 'BD';
          wiid = row.preBidReviewCount;
        }else if(oIndex === '2'){
          tableName = 'ct_BPM_BidProductionApply';
          appId = 'BE';
          wiid = row.bidProductionApplyCount;
        }else if(oIndex === '3'){
          tableName = 'ct_BPM_TenderDocumentReview';
          appId = 'BF';
          wiid = row.tenderDocumentReviewCount;
        }else if(oIndex === '4'){
          tableName = 'ct_BPM_BidOpeningResult';
          appId = 'AC';
          wiid = row.bidOpeningResultCount;
        }else if(oIndex === '5'){
          tableName = 'ct_BPM_ProjectConstructionApproval';
          appId = 'AF';
          wiid = row.projectConstructionApprovalCount;
        }else if(oIndex === '6'){
          tableName = 'ct_BPM_RevenueContractLedger';
          appId = '';
          wiid = row.takeAndOtherContraCount;
        }
         this.openPages(appId,3, wiid)
        //this.getWiid(tableName,id)
      },
      openPages(appId,formAction,wiid){
        var url = __webpath + '/workflow/workflowform/index/?appId=' + appId + '&formAction=' + formAction + '&wiid=' + wiid;
        window.open(url, '_blank');
      },
      // 流程表单跳转
     async getWiid(tableName, id) {
        //tableName:需要跳转到的表单的表名
        // id： 需要跳转到的表单的myID
        var data = [{
          "tableName": tableName,
          "myId": id
        }];
        const __webpath = '';
        const res = await api.getHyperLink(data);
        const wiid = res && res.data ? res.data[0].wiId : '';
        const url = `${__webpath}/workflow/workflowform/index/?appId=${appId}&formAction=3&wiid=${wiid}`;
        window.open(url, '_blank');
      },
      //导出数据
      handleExportData(){
        var that = this;
        let list;
        if (that.checkList.length === 0) {
          list = '';
        } else {
          let str = that.checkList.join();
          list = str;
        }
        var obj = {
          myId: that.form.myId,
          marketingUnitId: that.form.marketingUnitId,
          itemStatus: list,
          pageIndex: that.form.pageIndex,
          pageSize: that.form.pageSize
        };
        exportDatas(obj,0).then((res) =>{
          if (res) {
            console.log(res);
            const link=document.createElement('a');
            try{
              let blob =  res;
              var myDate = new Date();
              let _fileName = '营销立项--'+ myDate.toDateFormat('yyyyMMddHHmmssS')+'.xlsx'; //文件名，
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
      }
    }
  }
</script>

<style scoped>
  .market-data-item {
    border: 1px solid #f2f6fc;
    box-shadow: 0 2px 12px 0 #f2f6fc;
    height: 100%;
    padding: 25px;
    margin: 10px 0.888%;
    border-radius: 2px;
  }

  .market-data-item .market-data-item-title {
    font-size: 16px;
    font-weight: 500;
    /*font-family: Microsoft YaHei;*/
    display: flex;
    align-items: center;
    justify-content: flex-start;
    color: #909399;
    font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", Helvetica, Roboto, Arial, "PingFang SC", "Hiragino Sans GB", "Microsoft Yahei", "Microsoft Jhenghei", sans-serif;
  }

  .market-data-item .market-data-item-num {
    font-size: 17px;
    margin-top: 10px;
    padding-left: 35px;
    color: #000000;
    font-family: Microsoft YaHei;
    font-weight: bold;
  }

  .market-data-item .market-icon-class {
    font-size: 20px;
    margin-left: 10px;
    font-weight: normal;
  }

  .market-table-screen {
    padding: 20px 0 0 0;
  }

  .market-table-screen-input {
    margin-right: 20px;
  }

  .linkClass {
    color: #538EFF;
    cursor: pointer;
    list-style: decimal;
    text-decoration: underline;
  }

  /*----------------------------------------自定义步骤条---------------------------------------------------------------*/
  .steps {
    width: 100%;
    position: relative;
    height: 40px;
    /* margin-bottom: 30px;*/
    counter-reset: step; /*创建步骤数字计数器*/
  }

  /*步骤描述*/
  .steps div {
    list-style-type: none;
    font-size: 12px;
    text-align: center;
    width: 14%;
    position: relative;
    float: left;
    padding: 0 5px;
    /*border: 1px solid;*/
    z-index: 1;
  }

  /*步骤数字*/
  .steps div:before {
    display: block;
    font-family: element-icons;
    content: "\e6da";
    width: 20px;
    height: 20px;
    background-color: #909399;
    line-height: 20px;
    border-radius: 25px;
    font-size: 14px;
    color: #fff;
    text-align: center;
    font-weight: 500;
    margin: 0 auto 4px auto;
    z-index: 1;
  }

  /*连接线*/
  .steps div:after {
    content: "";
    width: 100%;
    height: 2px;
    background-color: #909399;
    position: absolute;
    left: 50%;
    top: 10px;
    z-index: -1; /*放置在数字后面*/
  }

  .steps div:last-child:after {
    background-color: #FFFFFF;
    height: 0;
  }

  /*将当前/完成步骤之前的数字及连接线变绿*/
  .steps div.active {
    color: #538EFF;
    /*background-color: #019875;*/
  }

  .steps div.active:before {
    font-family: element-icons;
    content: "\e6da";
    color: #FFFFFF;
    background-color: #538EFF;
    font-size: 16px;
  }

  .steps div.active:after {
    background-color: #538EFF;
  }

  /*将当前/完成步骤之后的数字及连接线变灰*/
  .steps div.active ~ div:before,
  .steps div.active ~ div:after {
    /*background-color: #333333;*/
  }

  /*-----------------------------小图标展示-----------------------------------------------------*/
  .icon-img-1 {
    width: 25px;
    height: 25px;
    background: url("../../../resources/images/desktop/css_sprites.png") no-repeat -95px 0;
    background-size: cover;
  }

  .icon-img-2 {
    width: 25px;
    height: 25px;
    background: url("../../../resources/images/desktop/css_sprites.png") no-repeat -245px 0;
    background-size: cover;
  }

  .icon-img-3 {
    width: 25px;
    height: 25px;
    background: url("../../../resources/images/desktop/css_sprites.png") no-repeat -320px 0;
    background-size: cover;
  }

  .icon-img-4 {
    width: 25px;
    height: 25px;
    background: url("../../../resources/images/desktop/css_sprites.png") no-repeat -270px 0;
    background-size: cover;
  }

  .icon-img-5 {
    width: 25px;
    height: 25px;
    background: url("../../../resources/images/desktop/css_sprites.png") no-repeat -145px 0;
    background-size: cover;
  }

  .icon-img-6 {
    width: 25px;
    height: 25px;
    background: url("../../../resources/images/desktop/css_sprites.png") no-repeat -270px 0;
    background-size: cover;
  }

  .icon-img-7 {
    width: 25px;
    height: 25px;
    background: url("../../../resources/images/desktop/css_sprites.png") no-repeat -70px 0;
    background-size: cover;
  }

  .icon-img-8 {
    width: 25px;
    height: 25px;
    background: url("../../../resources/images/desktop/css_sprites.png") no-repeat -170px 0;
    background-size: cover;
  }

  .icon-img-9 {
    width: 25px;
    height: 25px;
    background: url("../../../resources/images/desktop/css_sprites.png") no-repeat -220px 0;
    background-size: cover;
  }

  .icon-img-10 {
    width: 25px;
    height: 25px;
    background: url("../../../resources/images/desktop/css_sprites.png") no-repeat -120px 0;
    background-size: cover;
  }

  .icon-img-11 {
    width: 25px;
    height: 25px;
    background: url("../../../resources/images/desktop/css_sprites.png") no-repeat -20px 0;
    background-size: cover;
  }

  .icon-img-12 {
    width: 25px;
    height: 25px;
    background: url("../../../resources/images/desktop/css_sprites.png") no-repeat -45px 0;
    background-size: cover;
  }

  .icon-img-13 {
    width: 25px;
    height: 25px;
    background: url("../../../resources/images/desktop/css_sprites.png") no-repeat -245px 0;
    background-size: cover;
  }

  .icon-img-14 {
    width: 25px;
    height: 25px;
    background: url("../../../resources/images/desktop/css_sprites.png") no-repeat -195px 0;
    background-size: cover;
  }

  .danwei {
    font-size: 14px;
    color: #616161;
    font-weight: normal;
    padding: 0 2px;
  }

  .state_6 {
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

  .state_3 {
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

  .state_4 {
    display: inline-block;
    width: 72px;
    height: 27px;
    background: rgba(255, 102, 95, 0.19);
    /* opacity: 0.1; */
    border-radius: 101px;
    color: #FF665F;
    text-align: center;
    line-height: 27px;
    /*padding: 2px 10px;*/
    font-size: 13px;
    font-weight: 400;
  }

  .linkBtn {
    cursor: pointer;
    color: #538EFF;
  }
</style>
