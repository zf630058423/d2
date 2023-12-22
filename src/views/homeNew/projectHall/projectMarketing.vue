<template>
  <div class="projectEngineer">
    <div class="ml20 mr20 projectMarketing-form">
      <el-row>
        <el-form ref="form" :inline="true" :model="form" size="small">
          <el-col :span="18" class="topDataBox">
            <el-col :span="24" class="searchBox">
              <el-col :span="8">
                <el-form-item label="立项编号：">
                  <!--<div class="el-input searchInput">-->
                    <!--<span class="searchCont">{{form.BillNo}}</span>-->
                    <!--<span class="el-icon-search searchBth" @click="handleOpenNo"></span>-->
                  <!--</div>-->
                  <el-input placeholder="请选择" readonly v-model="form.BillNo" class="input-searchCont">
                    <el-button slot="append" icon="el-icon-search" @click="handleOpenNo"></el-button>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="立项名称：">
                  <span class="projectMarketing-form-item-value">{{form.ItemName}}</span>
                </el-form-item>
              </el-col>
            </el-col>
            <el-col :span="24">
              <el-col :span="8">
                <el-form-item label="客户：">
                  <span class="projectMarketing-form-item-value">{{form.Customer}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="立项状态：">
                  <span class="projectMarketing-form-item-value">{{form.ItemStatus | filterState}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="立项类型：">
                  <span class="projectMarketing-form-item-value">{{form.ItemType}}</span>
                </el-form-item>
              </el-col>
            </el-col>
            <el-col :span="24">
              <el-col :span="8">
                <el-form-item label="产品线：">
                  <span class="projectMarketing-form-item-value">{{form.Productline}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="资质范围：">
                  <span class="projectMarketing-form-item-value">{{form.ScopeQualification}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="营销单位：">
                  <span class="projectMarketing-form-item-value">{{form.MarketingUnit}}</span>
                </el-form-item>
              </el-col>
            </el-col>
            <el-col :span="24">
              <el-col :span="8">
                <el-form-item label="项目负责人：">
                  <span class="projectMarketing-form-item-value">{{form.ProjectLeader}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="联系方式：">
                  <span class="projectMarketing-form-item-value">{{form.ProjectLeaderTelephoneNumber}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="是否中标：">
                  <span class="projectMarketing-form-item-value" v-if="Number(form.bidPrice) >0">
                   是
                  </span>
                  <span class="projectMarketing-form-item-value" v-else>
                   否
                  </span>
                </el-form-item>
              </el-col>
            </el-col>
            <el-col :span="24" class="formData">
              <el-col :span="8">
                <el-form-item label="营销跟进人：">
                  <span class="projectMarketing-form-item-value">{{form.Follower}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="联系方式：">
                  <span class="projectMarketing-form-item-value">{{form.FollowerTel}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="项目地址：">
                  <span class="projectMarketing-form-item-value">{{form.ProjectAddress}}</span>
                </el-form-item>
              </el-col>
            </el-col>
          </el-col>
          <el-col :span="6">
            <div class="amountBox">
              <div class="amountTitle"><span class="el-icon-coin" style="font-size: 20px;margin-right: 5px"></span> 工程造价(元)</div>
              <div class="amountNum">
                <span>{{form.ConstructionCosts | numberFixed}}</span>
              </div>
            </div>
            <div class="amountBox2">
                <div class="amountTitle"><span class="el-icon-coin" style="font-size: 20px;margin-right: 5px;"></span> 中标价(元)</div>
                <div class="amountNum">
                  <span>{{form.bidPrice | numberFixed}}</span>
                </div>
            </div>
          </el-col>
        </el-form>
      </el-row>
    </div>
    <div class="ml20 mr20  projectMarketing-process">
      <customSteps ref="steps"></customSteps>
    </div>
    <div class="ml20 mr20  projectMarketing-menu">
      <el-row :gutter="20">
        <div class="projectMarketing-item-menu">
          <div class="engineerTable-table-menu">
            <span v-for="(item,index) in tableMenuList" :key="index" @click="handleTableMenu(index)"
                  :class="{'engineerTable-menu-active':getMenuIndx === index}">
              {{item}}
              </span>
          </div>
          <div style="display: inline-block;float: right">
            <!--<div style="font-weight: normal;font-size: 15px;padding-right: 20px;display: inline-block">单位：元</div>-->
            <!--<el-button type="primary" size="small" style="margin-right: 20px">导出<i class="el-icon-download el-icon&#45;&#45;right"></i></el-button>-->
          </div>
        </div>
      </el-row>
    </div>
    <div class="ml20 mr20 projectMarketing-table">
      <div class="projectMarketing-table-content">
        <div v-show="getMenuIndx === 0">
          <agreement-table ref="agreement"></agreement-table>
        </div>
        <div v-show="getMenuIndx === 1">
          <follow-table ref="follow"></follow-table>
        </div>
        <div v-show="getMenuIndx === 2">
          <files-table ref="files"></files-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import AgreementTable from './projectMarketTable/agreement';
  import FollowTable from './projectMarketTable/follow';
  import customSteps from '@/components/customSteps.vue';
  import SpeedChart from '../projectHall/projectMarketCharts/speed';
  import FilesTable from "./projectMarketTable/file";

  export default {
    name: "projectMarketing",
    components: {
      FilesTable,
      AgreementTable, FollowTable, customSteps, SpeedChart
    },
    data() {
      return {
        form: {
          BillName: null,
          BillNo: null,
          MarketingUnit: null,
          ConstructionCosts: 0,
          ItemName: null,
          Productline: null,
          Customer: null,
          ScopeQualification: null,
          ProjectAddress: null,
          ItemType: null,
          ProjectLeader: null,
          Follower: null,
          ItemStatus: null,
          ProjectLeaderTelephoneNumber: null,
          FollowerTel: null,
          MyId: null,
          bidPrice: 0
        },
        getMyId: null,
        getCurrent: 0,
        getSetp: 0,
        tableMenuList: ['项目协议', '跟进情况','文档'],
        getMenuIndx: 0,
        activeName: '1',
        stepData: {
          bidOpeningResultCount: 0,
          bidProductionApplyCount: 0,
          preBidReviewCount: 0,
          projectConstructionApprovalCount: 0,
          takeAndOtherContraCount: 0,
          tenderDocumentReviewCount: 0,
        },
        active: 0,
        stepList: [
          {name: 'aaa', index: 1, title: 'aaa的title信息'},
          {name: 'bbb', index: 2, title: 'bbb的title信息'},
          {name: 'ccc', index: 3, title: 'ccc的title信息'},
        ]
      }
    },
    mounted(){
      var that = this;
      var myId = Object.toQueryString('myId');
      var oIndex = Object.toQueryString('oIndex');
      if(oIndex){
        // 获取进度信息、
        setTimeout(function () {
          that.$emit('showData',oIndex);
          that.getMyId = myId;
          that.getDetailInfo();
          that.getProjectFollow();
          that.$refs.agreement.getParentVal(that.getMyId)
        }, 500);

        // that.$emit('showData',oIndex);
        // that.getMyId = myId;
        // that.getDetailInfo();
      }else if(sessionStorage.latelyMarketingMyId){
        // 获取缓存内容,读取最近一次的数据
        that.getMyId = sessionStorage.latelyMarketingMyId;
        that.getDetailInfo();
        that.getProjectFollow();
        that.$refs.agreement.getParentVal(that.getMyId);
      }
    },
    methods: {
      handleClick(tab, event) {
        console.log(tab, event);
      },
      // 点击
      handleTableMenu(val) {
        let that = this;
        that.getMenuIndx = val;
        if (val === 0) {
          that.$refs.agreement.getParentVal(that.getMyId)
        } else if(val === 1) {
          that.$refs.follow.getParentVal(that.getMyId)
        } else {
          that.$refs.files.getParentVal(that.getMyId)
        }
        console.log(val)
      },
      // 打开立项编号model
      handleOpenNo() {
        var that = this;
        that.getMenuIndx = 0;
        that.getMyId = null;
        that.openCustomDialog('', '项目大厅（营销项目层）营销立项', 'BPM_MarketingProject_9093_CP569', 'ct_bpm_marketingproject', 700, 400, false)
      },
      // 弹框调用 获取字段绑定
      // id：自定义对话框id
      // name：自定义对话框名称
      // code：自定义对话框别名
      // ObjName：自定义对话框数据对象名称（数据库表名）
      // width：弹框宽度
      // height：弹框高度
      // radioMultiple：是否多选
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
            that.getMyId = obj.MyId;
            // 把myid保存到缓存
            sessionStorage.setItem('latelyMarketingMyId',obj.MyId);
            // 获取进度信息、
            setTimeout(function () {
              that.getDetailInfo();
              that.getProjectFollow();
              that.$refs.agreement.getParentVal(that.getMyId)
            }, 500);

          }
        });
      },

      //获取进度信息
      getProjectFollow() {
        let that = this;
        let id = that.getMyId;
        $.extendAjax(`/extend/marketing/marketingProject/queryMarketingProjectStage?myId=${id}`, '', "get", function (res) {
          if (res.code === 200 && res.data) {
            that.$set(that.form, 'bidPrice', res.data.bidPrice);
            that.stepData = res.data;
            that.$refs.steps.setDatas(that.stepData);

          }
        });
      },
      // 营销基本信息
      getDetailInfo(){
        let that = this;
        let id = that.getMyId ;
        $.extendAjax(`/extend/marketing/marketingProject/queryMarketingProject?id=${id}`, '', "get", function (res) {
          if (res.code === 200 && res.data) {
            const obj = res.data;
            that.form = {
              BillNo: obj.billNo,
              MarketingUnit: obj.marketingUnit,
              ConstructionCosts: obj.constructionCosts,
              ItemName: obj.itemName,
              Productline: obj.productline,
              Customer: obj.customer,
              ScopeQualification: obj.scopeQualification,
              ProjectAddress: obj.projectAddress,
              ItemType: obj.itemType,
              ProjectLeader: obj.projectLeader,
              Follower: obj.follower,
              ItemStatus: obj.itemStatus,
              ProjectLeaderTelephoneNumber: obj.projectLeaderTelephoneNumber,
              FollowerTel: obj.followerTel,
              MyId: obj.myId
            };
          }
        });
      }
    }
  }
</script>

<style scoped>
  @import "qian~@/resources/css/projechHall.css";

  .projectMarketing-form {
    /*border: 1px solid;*/
    /*background: #FFFFFF;*/
    border-radius: 4px;
    margin-bottom: 15px;
  }

  .projectMarketing-form-item-value {
    font-size: 13px;
    font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
    /*font-weight: bold;*/
    line-height: 18px;
    color: #FFFFFF;
    opacity: 1;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .projectMarketing-form /deep/ .el-form-item__label {
    font-size: 13px;
    font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
    font-weight: 500;
    color: #FFFFFF;
    opacity: 1;
  }
  .projectMarketing-form /deep/ .el-form-item__content {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .projectMarketing-data-item {
    /*border: 1px solid #eaeaea;*/
    height: 85px;
    padding: 13px 20px;
    margin: 10px auto;
    background: #FFFFFF;
  }

  .projectMarketing-data-item .projectMarketing-data-item-title {
    font-size: 18px;
    height: 28px;
    font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
    font-weight: 800;
    line-height: 28px;
    color: #161616;
    opacity: 1;

  }

  .projectMarketing-data-item .projectMarketing-data-item-num {
    margin-top: 10px;
    font-size: 14px;
    height: 20px;
    font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
    font-weight: 400;
    line-height: 20px;
    color: #595959;
    opacity: 1;

  }

  .projectMarketing-data-item .projectMarketing-icon-class {
    font-size: 15px;
    margin-right: 6px;
  }

  .projectMarketing .projectMarketing-menu {
    /*border: 1px solid;*/
    margin: 20px 10px 20px 10px;
    height: auto;
  }

  .projectMarketing .projectMarketing-item-menu span {
    width: 102px;
    height: 25px;
    border: 1px solid #538EFF;
    opacity: 1;
    border-radius: 16px;
    font-size: 18px;
    font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
    line-height: 25px;
    font-weight: 400;
    padding: 3.5px 20px;
    margin-right: 23px;
    color: #538EFF;
    cursor: pointer;
  }

  .projectItem-menu-active {
    border: 1px solid #538eff;
    border-radius: 16px;
    background: #538eff;
    color: #FFFFFF !important;
    font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
  }

  .projectMarketing-item-menu {
    margin: 0 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #EEEEEE;
    background: #FFFFFF;
    border-top: 1px solid #EEEEEE;
  }

  .projectMarketing-table {
    /*background: #FFFFFF;*/
    /*border: 1px solid;*/
  }

  .engineerTable-table-menu span {
    font-size: 14px;
    font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
    font-weight: bold;
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
    font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;

  }

  .engineerTable-table-box {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #EEEEEE;
    background: #FFFFFF;
  }

  .projectMarketing-process {
    background: #FFFFFF;
    /*border: 1px solid;*/
    height: 100px;
    padding: 22px;
  }

  /*顶部模块样式*/
  .topDataBox {
    padding: 0 20px;
    min-height: 265px;
    background-image: url("../../../resources/images/desktop/bg4.png");
    background-position: left bottom;
    background-origin: content-box;
    background-repeat: no-repeat;
    background-size: 75%;
    background-color: #0974f1;
    color: #FFFFFF;
    /*border: 1px solid #007aff;*/
    border-radius: 4px;
    box-shadow: 0 0 8px #0974f1;
  }

  .searchBox {
    padding-top: 15px;
    border-bottom: 1px dotted;
    margin-bottom: 10px;
    min-width: 950px;
  }

  .searchInput {
    width: 100%;
    border: 1px solid;
    border-radius: 4px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0px 12px;
  }

  .searchBth {
    font-size: 20px;
    cursor: pointer;
  }

  .searchCont {
    width: 200px;
    height: 32px;
    line-height: 32px;
    /*超出隐藏*/
    overflow:hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    -o-text-overflow:ellipsis;
  }

  .searchBox /deep/ .el-form-item {
    margin-bottom: 15px;

  }
  .input-searchCont /deep/ input{
    background: transparent;
    color: white;
  }
  .input-searchCont /deep/ .el-input-group__append{
    background: transparent;
    color: #FFFFFF;
    border-color: #FFFFFF;
  }
  .input-searchCont /deep/ .el-input__inner{
    border-color: #FFFFFF;
    color: #FFFFFF;
  }
  .input-searchCont /deep/ input::placeholder{
    color: #FAFAFA;
  }
  .input-searchCont /deep/ input::-webkit-input-placeholder{
    color: #FAFAFA;
  }
  .input-searchCont /deep/ input:-moz-placeholder{
    color: #FAFAFA;
  }
  .input-searchCont /deep/ input::-moz-placeholder{
    color: #FAFAFA;
  }
  .input-searchCont /deep/ input:-ms-input-placeholder{
    color: #FAFAFA;
  }
  .input-searchCont /deep/ input::-ms-input-placeholder{
    color: #FAFAFA;
  }
  .amountBox{
    height: 120px;
    /* border: 1px solid; */
    padding: 20px;
    background: linear-gradient(250deg, #ffa500 0%, #f76b1c 100% );
    box-shadow: 0 0 8px #f76b1c;
    border-radius: 4px;
    margin: 10px 20px 0 20px;
  }
  .amountBox2{
    height: 120px;
    /* border: 1px solid; */
    padding: 20px;
    background: linear-gradient(250deg, #0974f1 0%, #5151E5 100% );
    box-shadow: 0 0 8px #5151E5;
    border-radius: 4px;
    margin: 15px 20px 0 20px
  }
  .amountTitle{
    font-size: 14px;
    color: #FFFFFF;
    padding-top: 10px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
  }
  .amountNum{
    font-size: 20px;font-weight: bold;margin-top: 10px;
    color: #FFFFFF;
    padding: 10px 0;
  }
</style>
