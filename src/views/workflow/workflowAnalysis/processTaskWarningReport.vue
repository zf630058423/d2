<template>
  <div class="f2bpm-page-layout">
    <el-container>
      <el-main class="f2bpm-page-right">
        <div region="north" border="false" style="overflow-y: hidden;">
          <div id="gridSearch" class="cont-list-form " style="display: block;">
            <table>
              <tr>
                <td style="width: 300px;" v-if="!data.IsAllUser">
                  <label class="wf-label" style="width: 140px;">指定人员：</label>
                  <el-input v-model="data.RealName" size="mini" class="textBoxShort" /> <a role="button" @click="selectUser()"><i class="fa fa-search" />选择人员</a>

                </td>
                <td>
                  <label class="wf-label" style="width: 140px;">所有人：</label>
                  <el-switch v-model="data.IsAllUser" active-color="#13ce66" inactive-color="#DEDEDE" />

                </td>
                <td class="p10">
                  <a class="btn btn-primary btn-sm mr2" @click="searchReport"><i class="fa fa-search" />{{$t('search')}}</a>
                  <a class="btn btn-primary btn-sm mr2" @click="searchReSet"><i class="fa fa-undo" />重置</a>
                </td>
              </tr>
            </table>
          </div>
        </div>
        <div region="center" border="false" style="overflow-y: auto;">
          <div>
            <div style="text-align: center;font-size: 26px;font-weight: bold;"><span>{{title}}</span></div>
            <div id="container" style="min-width: 300px; height: 600px; margin-left: 50px; margin: 0 auto; margin-top: 20px;" />
          </div>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
  import pie from '@/config/echarts/pie';
  export default {
    data() {
      return {
        treeFilterText: '',
        isCollapsed: false,
        treeData: [],
        title: "",
        data: {
          AppId: '',
          StartTime: '',
          EndTime: '',
          UserId: '',
          RealName: '',
          IsAllUser: false
        }
      };
    },
    computed: {
      countGridHeight() {
        return $(window).height() - global_selector_datagridHeightDiff;
      },
      countGridHeight2() {
        return $(window).height() - 30;
      },
      rotateIcon() {
        return this.isCollapsed ? 'fa fa-angle-double-right' : 'fa fa-angle-double-left';
      }
    },
    created: function () {
      var that = this;
      var now = new Date();
      that.data.StartTime = now.toDateFormat('yyyy-01-01');
      that.data.EndTime = now.toDateFormat('yyyy-MM-dd');
    },
    methods: {
      collapsedSider() {
        this.isCollapsed = !this.isCollapsed;
      },
      searchReSet() {
        var that = this;
        that.data.StartTime = '';
        that.data.EndTime = '';
        that.data.AppId = '';
        that.data.UserId = '';
        that.data.RealName = '';
      },
      searchReport() {
        var that = this;
        var userId = that.data.IsAllUser ? 'all' : that.data.UserId;
        var realName = that.data.IsAllUser ? '所有人' : that.data.RealName;
        that.title = realName;
        that.loadReport(userId, realName);
      },
      updateFieldValue(fieldName, newVal) {
        var that = this;
        that.data[fieldName] = newVal;
      },
      selectUser() {
        var that = this;
        WF.SelectorDialog.selectorUserString(that, 'UserId', 'RealName', null, true, 'userId');
      }
      , getTypeTitle(name) {
        switch (name) {
          case 'TimeOutTotalCount': return '已超时总数';
          case 'WillbeTimeOutCount': return '1天内将超时';
          case 'WeekWillbeTimeOutCount': return '7天内将超时';

        }
      }
      , loadReport(userId, realName) {
        var that=this;
        var ajaxUrl = FUI.Handlers.WorkflowMonitorHandler;
        var jsonData = Object.toAjaxJson(ajaxUrl, 'taskExpireTimeReportByUserId', { userId: userId });
        var total = 0;
        var categories = [];
        let seriesData = [];
        // 计算总数
        $.each(jsonData, function (key, v) {
          total += v;
          // 类别
          categories.push(that.getTypeTitle(key));
        });
        const obj = {
          WillbeTimeOutCount: '1天内将超时',
          WeekWillbeTimeOutCount: '7天内将超时',
          TimeOutTotalCount: '当前已超时数',
        };
        realName = realName || '';
        var name = realName + '待办超时任务总数：' + total;
        $.each(jsonData, function (key, v) {
          seriesData.push({
            value: jsonData[key],
            name: obj[key],
          });
        });
        var myChart = echarts.init(document.getElementById('container'));
        let options = pie;
        options.series[0].data = seriesData;
        myChart.setOption(options, true);
        myChart.dispatchAction({ type: 'highlight', dataIndex: 0 }); // dataIndex属性为data传入的索引值
        myChart.on('mouseover', (e) => {
          if (e.dataIndex !== 1) {
            // 当鼠标移除的时候 使默认的索引值去除默认选中
            myChart.dispatchAction({ type: 'downplay', dataIndex: 0 });
          }
        });
      }
    }
  };


</script>