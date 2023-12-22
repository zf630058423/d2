<template>
  <el-card class="box-card">
    <div class="box-nav">
    <div class="title">
      DRP系统包括旧版本、新版本两套系统,此指引主要包括常用业务流程的说明,描述如果需要办理什么业务时,在系统里面怎样走流程。
    </div>
    <div class="title">系统登录地址：</div>
    <div class="title">
      旧系统：<span @click="jump(1)">{{ oldUrl }}</span>
    </div>
    <div class="title">
      新系统： <span @click="jump(2)">{{ newUrl }}</span>
    </div>
    <div class="box-title">{{ title }}</div>
    
    </div>
    <div style="font-size: 20px; margin: 0px 20px;height:40px;line-height:40px;text-align: center;color: #000000;border: 1px solid #ebeef5;">
      DRP系统(升级版)流程指引
    </div>
    
    <div class="box-banner">
      <table class="table table-hover">
        <thead>
          <tr style="color: #b3b3b3">
            <td style="color: #000000; width: 60px;padding:0 25px;background-color: #ffc000;">序号</td>
            <td style="color: #000000;background-color: #ffc000;">我要做什么？</td>
            <td style="color: #000000;background-color: #ffc000;">怎么做(系统里面需要走哪些流程)</td>
            <td style="color: #000000;background-color: #ffc000;">其他说明</td>
          </tr>
        </thead>
        <tbody id="tbody">
          <tr class="active">
            <td>1</td>
            <td>办理支付项目材料款的业务</td>
            <td>
              <div>必须要按这个流程顺序在系统中走完流程</div>
              <div>1.一般材料合同付款:</div>
              <div>
              <span @click="handleInfo('BPM_PurchaseOrder')" style="color:blue;text-decoration:underline;">采购合同</span>-> <span @click="handleInfo('BPM_MaterialsPutInStorage')" style="color:blue;text-decoration:underline;">材料入库</span>-> <span @click="handleInfo('BPM_ProcurementSettlement')" style="color:blue;text-decoration:underline;">采购结算</span>(<span style="color: red"
                  >非必须流程</span
                >,当需要<span style="color: red">付结算款时</span>需要走此流程)
                -> 材料付款
              </div>
              <div>2.零星材料付款:</div>
              <div><span @click="handleInfo('BPM_MaterialsPutInStorage')" style="color:blue;text-decoration:underline;">材料入库</span>-> <span @click="handleInfo('BPM_MaterialPayment')" style="color:blue;text-decoration:underline;">材料付款</span></div>
            </td>
            <td>
              <div style="color: red">涉及到的基础档案</div>
              <div style="color: red">供应商信息、零星供应商信息</div>
              <div>
                <span style="color: red">注意事项:</span>
                关联发票时，对应的发票没有做任何认领动作的，可以在付款时直接关联
              </div>
              <div>
                若已经做过认领，合同付款时只能关联认领到对应材料合同的发票
              </div>
            </td>
          </tr>
          <tr class="active">
            <td>2</td>
            <td>办理支付项目劳务款的业务</td>
            <td>
              <div>必须要按这个流程顺序在系统中走完流程</div>
              <div>
                <span @click="handleInfo('BPM_SubcontractOfLaborService_2568')" style="color:blue;text-decoration:underline;">劳务分包合同</span>-> <span @click="handleInfo('BPM_BanZuHeTong')" style="color:blue;text-decoration:underline;">班组合同</span>-> <span @click="handleInfo('BPM_TheShiftAmountOfNuclear_1678')" style="color:blue;text-decoration:underline;">班组核量 </span>-> <span @click="handleInfo('BanZuGongZiQueRenDan')" style="color:blue;text-decoration:underline;">班组工资确认单</span>->
                <span @click="handleInfo('BPM_TeamToSettle')" style="color:blue;text-decoration:underline;">班组结算</span>(<span style="color: red">非必须流程</span>,当需要<span
                  style="color: red"
                  >付结算款时</span
                >需要走此流程) -> 劳务付款
              </div>
            </td>
            <td>
              <div style="color: red">涉及到的基础档案：</div>
              <div style="color: red">劳务分包商</div>
              <div>
                <span style="color: red">注意事项:</span>
                关联发票时，对应的发票没有做任何认领动作的，可以在付款时直接关联
              </div>
              <div>
                若已经做过认领，合同付款时只能关联认领到对应班组合同的发票
              </div>
            </td>
          </tr>
          <tr class="active">
            <td>3</td>
            <td>
              <div>报销项目上的其他费用</div>
              <div>(对私非材料非劳务款)</div>
            </td>
            <td>
              <div>必须要按这个流程顺序在系统中走完流程</div>
              <div>
             <span @click="handleInfo('BPM_TheConstructionProject')" style="color:blue;text-decoration:underline;">施工立项</span>(承接项目时只需要走一次流程就可以) -> <span @click="handleInfo('BPM_XiangMuFeiYongBaoXiao')" style="color:blue;text-decoration:underline;">项目费用报销</span> 
              </div>
            </td>
            <td>
              <div>对私：意思是付给【公司在职人员】的项目费用报销款项</div>
            </td>
          </tr>
          <tr class="active">
            <td>4</td>
            <td>
              <div>报销项目上的其他费用</div>
              <div>(对公非材料非劳务款)</div>
            </td>
            <td>
              <div>必须要按这个流程顺序在系统中走完流程</div>
              <div><span @click="handleInfo('BPM_TheConstructionProject')" style="color:blue;text-decoration:underline;">施工立项</span>(承接项目时只需要走一次流程就可以) ->  <span @click="handleInfo('BPM_QiTaFuKuan')" style="color:blue;text-decoration:underline;">其他付款</span></div>
            </td>
            <td>对公：意思是付给【外部单位】的项目费用报销款项</td>
          </tr>
          <tr class="active">
            <td>5</td>
            <td>报项目的产值</td>
            <td>
              <div>必须要按这个流程顺序在系统中走完流程</div>
              <div>
                <span @click="handleInfo('BPM_TheConstructionProject')" style="color:blue;text-decoration:underline;">施工立项</span>(承接项目时只需要走一次流程就可以) -> <span @click="handleInfo('BPM_JianAnHeTong_2357')">建安合同</span>
                (与甲方签订合同时走完流程即可) -> <span @click="handleInfo('BPM_ChanXianTianBao')" style="color:blue;text-decoration:underline;">产值填报</span>
              </div>
            </td>
            <td>
              <div style="color: red">
                系统每月25号上午9:00自动推送待办给【项目档案】的编制人/编制人所属部门负责人（若编制人离职）
              </div>
              <div>
                项目状态为未开工、在建中、停工中、已完工未送审，且产值填报的项目状态≠已竣工的才会发送待办
              </div>
            </td>
          </tr>
          <tr class="active">
            <td>6</td>
            <td>申请开销售发票</td>
            <td>
              <div>必须要按这个流程顺序在系统中走完流程</div>
              <div>
                <span @click="handleInfo('BPM_TheConstructionProject')" style="color:blue;text-decoration:underline;">施工立项</span>(承接项目时只需要走一次流程就可以) -> <span @click="handleInfo('BPM_JianAnHeTong_2357')" style="color:blue;text-decoration:underline;">建安合同</span>
                (与甲方签订合同时走完流程即可) -> <span @click="handleInfo('BPM_KaiPiaoShenQing')" style="color:blue;text-decoration:underline;">开票申请</span>
              </div>
            </td>
            <td></td>
          </tr>
          <tr class="active">
            <td>7</td>
            <td>如何分类上传项目的资料文件</td>
            <td>
              <div>必须要按这个流程顺序在系统中走完流程</div>
              <div>
                <span @click="handleInfo('BPM_TheConstructionProject')" style="color:blue;text-decoration:underline;">施工立项</span> (承接项目时只需要走一次流程就可以) ->
                <span @click="handleInfo('BPM_JianAnHeTong_2357')" style="color:blue;text-decoration:underline;">建安合同</span>
                /<span @click="handleInfo('BPM_OtherRevenueContract')" style="color:blue;text-decoration:underline;">其他收入合同</span>
                /<span @click="handleInfo('BPM_SubcontractOfLaborService_2568')" style="color:blue;text-decoration:underline;">劳务分包合同</span>
                /<span @click="handleInfo('BPM_BanZuHeTong')" style="color:blue;text-decoration:underline;">班组合同</span>
                /<span @click="handleInfo('BPM_ct_BPM_Subcontract')" style="color:blue;text-decoration:underline;">专业分包合同</span>
                /<span @click="handleInfo('BPM_PurchaseOrder')" style="color:blue;text-decoration:underline;">采购合同</span>
                /<span @click="handleInfo('BPM_QiTaZhiChuHeTong')" style="color:blue;text-decoration:underline;">其他支出合同</span>
              </div>
              <div>
                (属于合同归档的必须要对应的合同流程审核通过) -> <span @click="handleInfo('XiangMuZiLiao')" style="color:blue;text-decoration:underline;">项目资料</span>
              </div>
            </td>
            <td>
              <div>竣工验收报告、其他工程管控过程中的资料都可以上传到此处</div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
   <div style="font-size: 20px; margin: 0 20px;height:40px;line-height:40px;text-align: center;color: #000000;border: 1px solid #ebeef5;">
      DRP系统(旧版)流程指引
    </div>
    <div class="box-banner">
      <table class="table table-hover">
        <thead>
          <tr style="color: #b3b3b3">
            <td style="color:  #000; width: 60px;padding:0 25px;background-color: #ffc000;">序号</td>
            <td style="color: #000;background-color: #ffc000;">我要做什么？</td>
            <td style="color: #000;background-color: #ffc000;">怎么做(系统里面需要走哪些流程)</td>
            <td style="color: #000;background-color: #ffc000;">其他说明</td>
          </tr>
        </thead>
        <tbody id="tbody">
          <tr class="active">
            <td>1</td>
            <td>办理支付项目材料款的业务</td>
            <td>
              <div>必须要按这个流程顺序在系统中走完流程</div>
              <div>一、营销类项目</div>
              <div>
                1、招标材料合同付款：
              </div>
              <div>
                材料招标申请→材料招标限价/材料招标供应商审批→材料定标申请→采购合同→合同归档→材料入库→采购结算（非必须流程，当需要付结算款时需要走此流程）→材料付款
              </div>
              <div>
                2、比价/免招标材料合同付款:
              </div>
              <div>
                材料免招标申请/材料比价→采购合同→合同归档→材料入库→采购结算（非必须流程，当需要付结算款时需要走此流程）→材料付款
              </div>

              <div>3.零星材料付款:</div>
              <div>
                材料入库→零星材料付款
              </div>
              <div>
                二、区域类项目
              </div>
              <div>
                1.材料合同付款：
              </div>
              <div>
                采购合同（区域项目）→合同归档（区域项目）→材料入库（区域项目）→采购结算（区域项目）（非必须流程，当需要付结算款时需要走此流程）→材料付款（区域项目）
              </div>
              <div>2.零星材料付款:</div>
              <div>
                材料入库（区域项目）→零星材料付款（区域项目）
              </div>
            </td>
            <td>
              <div style="color: red">涉及到的基础档案</div>
              <div style="color: red">供应商信息、零星供应商信息（没有供应商的时候，需要在DRP系统（升级版）中新增，审核通过后系统会定时同步到DRP系统（旧版）里面，才能选到，目前同步频率为1小时）</div>
              <div>
                <span style="color: red">注意事项:</span>
                关联发票时，对应的发票没有做任何认领动作的，可以在付款时直接关联
              </div>
              <div>
                若已经做过认领，合同付款时只能关联认领到对应材料合同的发票
              </div>
            </td>
          </tr>
          <tr class="active">
            <td>2</td>
            <td>办理支付项目劳务款的业务</td>
            <td>
              <div>必须要按这个流程顺序在系统中走完流程</div>
              <div>
                一、营销类项目
              </div>
              <div>
                劳务分包合同→劳务班组合同→合同归档→劳务班组核量→劳务结算（非必须流程，当需要付结算款时需要走此流程）→劳务付款
              </div>
              <div>
                二、区域类项目
              </div>
              <div>
                劳务分包合同（区域项目）→劳务班组合同（区域项目）→合同归档（区域项目）→劳务班组核量（区域项目）→劳务结算（区域项目）（非必须流程，当需要付结算款时需要走此流程）→劳务付款（区域项目）
              </div>
            </td>
            <td>
              <div style="color: red">涉及到的基础档案：</div>
              <div style="color: red">劳务分包商</div>
              <div>
                <span style="color: red">注意事项:</span>
                关联发票时，对应的发票没有做任何认领动作的，可以在付款时直接关联
              </div>
              <div>
                若已经做过认领，合同付款时只能关联认领到对应班组合同的发票
              </div>
            </td>
          </tr>
          <tr class="active">
            <td>3</td>
            <td>
              <div>报销项目上的其他费用</div>
              <div>(对私非材料非劳务款)</div>
            </td>
            <td>
              <div>必须要按这个流程顺序在系统中走完流程</div>
              <div>
                一、营销类项目
              </div>
              <div>
                项目立项和开工报告（承接项目时只需要走一次流程就可以）→营销项目费用报销
              </div>
              <div>
                二、区域类项目
              </div>
              <div>
                区域项目施工立项（承接项目时只需要走一次流程就可以）→区域项目费用报销
              </div>
            </td>
            <td>
              <div>对私：意思是付给【公司在职人员】的项目费用报销款项</div>
            </td>
          </tr>
          <tr class="active">
            <td>4</td>
            <td>
              <div>报销项目上的其他费用</div>
              <div>(对公非材料非劳务款)</div>
            </td>
            <td>
              <div>必须要按这个流程顺序在系统中走完流程</div>
              <div>
                一、营销类项目
              </div>
              <div>
                项目立项和开工报告（承接项目时只需要走一次流程就可以）→营销项目其他付款
              </div>
              <div>
                二、区域类项目
              </div>
              <div>
                区域项目施工立项（承接项目时只需要走一次流程就可以）→区域项目其他付款
              </div>
            </td>
            <td>对公：意思是付给【外部单位】的项目费用报销款项</td>
          </tr>
          <tr class="active">
            <td>5</td>
            <td>报项目的产值</td>
            <td>
              <div>必须要按这个流程顺序在系统中走完流程</div>
              <div>
               项目立项和开工报告/区域施工立项（承接项目时只需要走一次流程就可以）→施工合同（与甲方签订合同时走完流程即可）→产值填报
              </div>
            </td>
            <td>
              <div>
                营销项目:系统每月25号上午9:00自动推送待办给【项目立项和开工报告】的执行项目经理/施工公司负责人（若执行项目经理离职）
              </div>
              <div>
                区域项目:系统每月25号上午9:00自动推送待办给【区域项目施工立项】的营销人员/营销人员所属中心工程部负责人或部门负责人（若营销人员离职）
              </div>
              <div>
                项目状态为未开工、在建中、停工中、已完工未送审，且产值填报的项目状态≠已竣工的才会发送待办
              </div>
            </td>
          </tr>
          <tr class="active">
            <td>6</td>
            <td>报销固定资产费用</td>
            <td>
              <div>必须要按这个流程顺序在系统中走完流程</div>
              <div>
               固定资产申请→固定资产登记→发票信息采集（先查询系统是否有对应发票，如果没有就需要新增并且需要税务复核）→员工费用报销
              </div>
            </td>
            <td></td>
          </tr>
          <tr class="active">
            <td>7</td>
            <td>报销差旅费</td>
            <td>
              <div>必须要按这个流程顺序在系统中走完流程</div>
              <div>
                外出申请→发票信息采集（先查询系统是否有对应发票，如果没有就需要新增并且需要税务复核）→员工费用报销
              </div>
            </td>
            <td>
              <div>包括出差补助、交通费、住宿费</div>
            </td>
          </tr>
          <tr class="active">
            <td>8</td>
            <td>报销业务招待费</td>
            <td>
              <div>必须要按这个流程顺序在系统中走完流程</div>
              <div>
                发票信息采集（先查询系统是否有对应发票，如果没有就需要新增并且需要税务复核）→员工费用报销
              </div>
             
            </td>
            <td>
            
            </td>
          </tr>
          <tr class="active">
            <td>9</td>
            <td>报销办公用品费用</td>
            <td>
              <div>必须要按这个流程顺序在系统中走完流程</div>
              <div>
               办公用品采购申请→发票信息采集（先查询系统是否有对应发票，如果没有就需要新增并且需要税务复核）→员工费用报销
              </div>
             
            </td>
            <td>
              
            </td>
          </tr>
          <tr class="active">
            <td>10</td>
            <td>离职</td>
            <td>
              <div>涉及到需要走的流程：</div>
              <div>
                1、固定资产异动(如果名下有固定资产需要进行转移到其他人名下)
              </div>
              <div>
                2、人员与岗位匹配申请(如果是负责某些流程的审核的，需要走这个申请转移自己的审批权限给其他人)
              </div>
             
            </td>
            <td>
              <div>查询是否有固定资产可通过【我的固定资产】查询</div>
            </td>
          </tr>
          <tr class="active">
            <td>11</td>
            <td>外出</td>
            <td>
              <div>外出申请</div>
              
            </td>
            <td>
              <div>因工作需要出差时请通过【外出申请】发起流程申请，此流程会影响后续差旅费用的报销流程发起</div>
            </td>
          </tr>
          <tr class="active">
            <td>12</td>
            <td>补交上下班打卡记录</td>
            <td>
              <div>未打卡申请</div>
            </td>
            <td>
              <div>因忘记打卡或其他原因需要补打卡时通过【未打卡申请】在考勤周期内进行补打卡申请</div>
            </td>
          </tr>
          <tr class="active">
            <td>13</td>
            <td>申请开通权限</td>
            <td>
              <div>IT权限申请</div>
             
            </td>
            <td>
              <div>共享文件权限、VPN、远程访问权限、系统其他权限</div>
            </td>
          </tr>
          <tr class="active">
            <td>14</td>
            <td>电脑故障/网络/软件/邮箱/会议支持等问题</td>
            <td>
              <div>IT报修申请</div>
            </td>
            <td>
             
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      title:
        "注意: 2022年之后施工立项的项目流程全部在新系统发起,2022之前的项目需要在新系统发起流程的在旧系统已控制选不到对应的项目,不可发起流程",
      newUrl: "http://zzdrp.com/",
      oldUrl: "http://drp.zhongzhuang.com/",
    };
  },
  methods: {
    
    handleInfo(code) {
      let value = ''
      if(code == 'BPM_PurchaseOrder'){
        value = '采购合同'
      }else if(code == 'BPM_MaterialsPutInStorage'){
        value = '材料入库'
      } else if(code == 'BPM_ProcurementSettlement'){
        value = '采购结算'
      } else if(code == 'BPM_MaterialPayment'){
        value = '材料付款'
      }else if(code == 'BPM_SubcontractOfLaborService_2568'){
        value = '劳务分包合同'
      } else if(code == 'BPM_BanZuHeTong'){
        value = '班组合同'
      }else if(code == 'BPM_TheShiftAmountOfNuclear_1678'){
        value = '班组核量'
      }else if(code == 'BanZuGongZiQueRenDan'){
        value = '班组工资确认单'
      }else if(code == 'BPM_TeamToSettle'){
        value = '班组结算'
      }else if(code == 'BPM_TheConstructionProject'){
        value = '施工立项'
      }else if(code == 'BPM_XiangMuFeiYongBaoXiao'){
        value = '项目费用报销'
      }else if(code == 'BPM_QiTaFuKuan'){
        value = '其他付款'
      }else if(code == 'BPM_ChanXianTianBao'){
        value = '产值填报'
      }else if(code == 'BPM_JianAnHeTong_2357'){
        value = '建安合同'
      }else if(code == 'BPM_KaiPiaoShenQing'){
        value = '开票申请'
      }else if(code == 'BPM_OtherRevenueContract'){
        value = '其他收入合同'
      }else if(code == 'BPM_SubcontractOfLaborService_2568'){
        value = '劳务分包合同'
      }else if(code == 'BPM_ct_BPM_Subcontract'){
        value = '专业分包合同'
      }else if(code == 'BPM_QiTaZhiChuHeTong'){
        value = '其他支出合同'
      }else if(code == 'XiangMuZiLiao'){
        value = '项目资料'
      }
      
      this.$store.dispatch('app/setCurrMenuId', {
        currMenuId: '',
        currMenuTitle: value,
        functionUrl: `/workflow/security/customDataGrid/customDataGridView/?code=custGrid_WorkflowForm_${code}`
      })
      this.$store.state.app.currState.currMenuId  
      this.$router.push(
        `/workflow/security/customDataGrid/customDataGridView/?code=custGrid_WorkflowForm_${code}`
      );
    },
    jump(type) {
      switch (type) {
        case 1:
          window.open(this.oldUrl);
          break;
        case 2:
          window.open(this.newUrl);
          break;
        default:
          break;
      }
    },
  },
};
</script>

<style scoped lang='scss'>
.box-card {
  width: 100%;
  height: 100%;
  cursor: pointer;
  .box-nav{
     border: 1px solid #ebeef5;
     margin: 0px 20px;
     padding-bottom: 0px;
  }
  .title {
    font-size: 14px;
    margin: 10px;
  }
  .box-title {
    color: red;
    font-size: 14px;
    margin: 10px;
  }
  .box-banner {
    margin: 0px 20px 0px 20px;
    .table {
      border-collapse: collapse;
    }
    table,
    th,
    td {
      font-size: 14px;
      color: #606266;
      padding: 10px 40px;
      border: 1px solid #ebeef5;
    }
    div {
      padding-bottom: 6px;
      
     
      
      
    }
  }
}
</style>