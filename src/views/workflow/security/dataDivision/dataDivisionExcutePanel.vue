<template>
  <div class="f2bpm-page-dialog-layout p20">
    <div class="division-title">{{data.title}}</div>
    <div>
      <el-steps :active="active" size="mini" align-center>
        <el-step title="未执行" description=""></el-step>
        <el-step title="存储表已创建" description="存放数据的物理表"></el-step>
        <el-step title="已执行分割" description="可再次继续点击执行"></el-step>
      </el-steps>
    </div>
    <div>
      <el-descriptions class="margin-top" title="切割方案信息" :column="2" size="small" border>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-s-ticket"></i>
            切割方式
          </template>
          <el-tag size="small"> {{data.divisionType=='procInstYear'?'流程实例创建时间所在年份':""}}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-s-management"></i>
            切割依据值
          </template>
          <el-tag size="small"> {{data.divisionValue }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-user-solid"></i>
            创建人
          </template>
          {{data.creatorRealName }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-date"></i>
            创建时间
          </template>
          {{data.createdTime }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-user-solid"></i>
            最新修改人
          </template>
          {{data.lastUpdateRealName }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-date"></i>
            最新修改时间
          </template>
          {{data.lastUpdateTime }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-date"></i>
            最近执行
          </template>
          {{data.executeTimes }} {{data.executeRealName}}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-document"></i>
            {{data.divisionValue }}年<br>归档表当前实例数
          </template>


          <span class="circle circle-warning">
            {{numData.procInstTotal==-1?'':numData.procInstTotal }}
          </span>

        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            移到目标存储表
          </template>
          <el-tag class="m2" v-for="item in prohitables">{{item+data.divisionValue}}</el-tag>
          <span v-if="formAction!='View'&&data.divisionStatus!=3&&data.divisionStatus==1" size="mini" class="blue cur" @click="dropTable" style="float: right;">删除表</span>
          <span>目标表流程实例数： <span class="circle circle-warning">{{numData.targetProcInstTotal==-1?'':numData.targetProcInstTotal }}</span></span>
        </el-descriptions-item>
      </el-descriptions>
      <div class="p10">

      </div>
    </div>
    <div>
      <el-descriptions class="margin-top" title="执行切割操作" :column="1" size="small" border>
        <el-descriptions-item>
          <template slot="label">
            <i class="fa fa-file-o"></i>
            说明
          </template>
          执行切割数据需要花费比较多的时间，执行期间请不要关闭网页，将自动以每次设定的数量分批执行。当执行完一批后将自动发起请求执行下一批。
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="fa fa-search"></i>
            查看
          </template>
          <span class="fa fa-search cur" @click="dataDivisionDetailList">查看执行记录</span>
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="fa fa-cog"></i>
            操作
          </template>
          <div style="display: inline-block;margin-right: 20px;">
            每次请求执行
            <el-select v-model="bathSize" size="mini" style="width:80px;" @change="bathSizeChange">
              <el-option label="1" :value="1" />
              <el-option label="100" :value="100" />
              <el-option label="200" :value="200" />
              <el-option label="500" :value="500" />
              <el-option label="1000" :value="1000" />
            </el-select>
            条数据进行切割，当前剩余 <span class="cube bg-blue">{{bathCount}}</span> 批次
            <span v-if="isEnabledAutoExecute" class="cube bg-orange">自动运行中...</span>
          </div>
          <el-button v-if="formAction!='View'&&data.divisionStatus==0" size="small" type="primary" @click="divisionTableCreate"><i class="icon  icon-peizhishujuyuan" />创建存储表
          </el-button>
          <el-button v-if="formAction!='View'" size="small" type="default" @click="loadData"><i class="icon icon-shuaxin" />刷新
          </el-button>
          <el-button v-if="formAction!='View'&&data.divisionStatus!=3&&data.divisionStatus>0" :disabled="isEnabledAutoExecute" size="small" type="primary" @click="dataDivisionExcute"><i class="icon icon-jianqie" />执行切割
          </el-button>
          <el-button v-if="formAction!='View'&&data.divisionStatus!=3&&data.divisionStatus>0&&isEnabledAutoExecute" size="small" type="danger" @click="stopDataDivisionExcute"><i class="icon icon-jianqie" />停止执行切割
          </el-button>

        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="fa fa-file-o"></i> 信息
          </template>
          <div id="msg-list">
            <div v-for="(msg,index) in msgData">{{index+1}}：{{msg}}</div>
          </div>
        </el-descriptions-item>
      </el-descriptions>
    </div>
    <div class="dialogfooter2">

      <el-button id="btn_cancel" size="small" @click="closeEdit"><i class="fa fa-minus-circle" />关闭
      </el-button>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        active: 1,
        loading: false,
        formAction: null,
        isReadOnly: false,
        treeData: [],
        msgData: [],
        divisionId: "",
        bathSize: 1,
        bathCount: 0,
        isEnabledAutoExecute: false,
        numData: { procInstTotal: -1, targetProcInstTotal: -1 },
        prohitables: ["f2bpm_hi_processinstance", "f2bpm_hi_taskinstance", "f2bpm_hi_activityinstance", "f2bpm_hi_transitioninstance"]
        , data: {
          id: "",
          title: "",
          divisionInfo: "procInst",
          divisionDescript: "",
          creatorRealName: "",
          lastUpdateOperatorId: "",
          divisionValue: "",
          creatorId: "",
          executeTimes: "",
          lastUpdateRealName: "",
          divisionType: "procInstYear",
          lastUpdateTime: "",
          createdTime: "",
          divisionStatus: 0

        },
        formRules: {
          title: [
            { required: true, message: '必填项不能为空' }
          ]
        }
      };
    },
    mounted() {
      var that = this;
      window.myvm = that;
    },
    created: function () {
      var that = this;
      that.formAction = formAction;
      that.isReadOnly = formAction == FUI.FormAction.View;
      var divisionId = Object.toQueryString('divisionId');
      that.divisionId = divisionId;
      that.loadData();

    },
    methods: {
      closeEdit() {
        FUI.Window.closeEdit();
      },
      procInstTotal() {
        var that = this;
        Object.toAjaxJson("/workflow/security/dataDivision/", 'getFromTargetHiProcInstYearCount', { year: that.data.divisionValue }, true, null, function (res) {
          let data = res.data.split(",");
          that.numData.procInstTotal = data[0];
          that.numData.targetProcInstTotal = data[1];
          that.bathCount = Math.ceil(that.numData.procInstTotal / that.bathSize);
        }
        );
      }
      , bathSizeChange(v) {
        var that = this;
        that.bathCount = Math.ceil(that.numData.procInstTotal / that.bathSize);
      }

      , loadData() {
        var that = this;
        Object.toAjaxJson("/workflow/security/dataDivision/", "getModel", { keyId: that.divisionId }, true, null, function (res) {
          if (res.success) {
            console.info(res.data);
            that.data = res.data;
            that.active = res.data.divisionStatus + 1;
            that.procInstTotal();
          } else {
            FUI.Window.showMsg(res.msg);
          }
        });
      }
      , generateExecutionBatch(value, row, index) {
        var that = this;
        var parm = {};
        parm.divisionId = that.divisionId;
        FUI.Window.confirm(that, "您确定要生成批次吗？<em>请警慎操作</em>", null, function () {
          Object.toAjaxJson("/workflow/security/dataDivision/", "generateExecutionBatch", parm, true, null,
            function (res) {
              if (res.success) {
                FUI.Window.showMsg(res.msg, null, 1);
                FUI.Window.refreshParentGrid();
                that.loadData();
              } else {
                FUI.Window.showMsg(res.msg);
              }
            });
        });
      }
      , stopDataDivisionExcute() {
        that.isEnabledAutoExecute = false;
      }
      , dataDivisionExcute(value, row, index) {
        var that = this;
        var parm = {};
        parm.divisionId = that.divisionId;
        parm.bathSize = that.bathSize;
        FUI.Window.confirm(that, "您确定要执行数据切割吗？<em>请警慎操作</em>", null, function () {
          that.isEnabledAutoExecute = true;
          that.bathExcute(parm);
          that.loadData();
          FUI.Window.refreshParentGrid();
        });
      }
      , bathExcute(parm) {
        var that = this;
        Object.toAjaxJson("/workflow/security/dataDivision/", "dataDivisionExcute", parm, true, null,
          function (res) {
            if (res.success) {
              that.msgData.push(res.msg);
              that.procInstTotal();
              if (that.bathCount == 0) {
                that.isEnabledAutoExecute = false;
              }
              if (that.isEnabledAutoExecute && that.bathCount > 0) {
                setTimeout(function () {
                  that.bathExcute(parm);
                }, 5000);
              }
            } else {
              FUI.Window.showMsg(res.msg);
              that.isEnabledAutoExecute = false;
            }
          });
      }
      , dropTable() {
        var that = this;
        var parm = {};
        parm.divisionId = that.divisionId;
        FUI.Window.confirm(that, "您确定要删除切割存储表吗，将导致表数据也被删除？<br><em>请警慎操作</em>", null, function () {
          Object.toAjaxJson("/workflow/security/dataDivision/", "divisionTableDrop", parm, true, null,
            function (res) {
              if (res.success) {
                FUI.Window.showMsg(res.msg, null, 1);
                FUI.Window.refreshParentGrid();
                that.loadData();
              } else {
                FUI.Window.showMsg(res.msg);
              }
            });
        });
      }
      , divisionTableCreate(value, row, index) {
        var that = this;
        var parm = {};
        parm.divisionId = that.divisionId;
        FUI.Window.confirm(that, "您确定要创建执行方案的数据存储物理表吗？<br><em>请警慎操作</em>", null, function () {
          Object.toAjaxJson("/workflow/security/dataDivision/", "divisionTableCreate", parm, true, null,
            function (res) {
              if (res.success) {
                FUI.Window.showMsg(res.msg, null, 1);
                FUI.Window.refreshParentGrid();
                that.loadData();
              } else {
                FUI.Window.showMsg(res.msg);
              }
            });
        });
      }
      , dataDivisionDetailList() {
        var that = this;
        var divisionId = that.divisionId;
        var url = __webpath + "/workflow/security/dataDivision/dataDivisionDetailList/?divisionId=" + divisionId;
        FUI.Window.openEdit(url, "批次明细", 2, null, 700, 450, null, null, null, true);
      }
    }
  }
</script>
<style>
  .division-title {
    font-weight: bold;
    text-align: center;
    line-height: 30px;
    font-size: 20px;
    padding: 5px;
    margin-bottom: 10px;
  }
</style>