<template>
  <div class="f2bpm-page-layout">
    <el-container>
      <el-main class="f2bpm-page-right">
        <div region="north" border="false" style="overflow-y: hidden;">
          <div id="gridSearch" class="cont-list-form " style="display: block;">
            <table>
              <tr>
                <td style="width: 300px;">
                  <label class="wf-label" style="width: 140px;">指定人员：</label>
                  <el-input v-model="data.RealName" size="mini" class="textBoxShort" /> <a role="button" @click="selectUser()"><i class="fa fa-search" />选择人员</a>
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
            <div id="container" style="min-width: 300px; height: 600px; margin-left: 50px; margin: 0 auto; margin-top: 20px;" />
          </div>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        treeFilterText: '',
        isCollapsed: false,
        treeData: [],
        data: {
          AppId: '',
          StartTime: '',
          EndTime: '',
          UserId: '',
          RealName: ''
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
        var startOpenBizDate = that.data.StartTime;
        var endOpenBizDate = that.data.EndTime;
        var appId = that.data.AppId;
        var userId = that.data.UserId;
        var appName = appId;
        var realName = that.data.RealName;
        var timePeriod = startOpenBizDate + '至' + endOpenBizDate;
        var timePeriod = startOpenBizDate + '至' + endOpenBizDate;
        that.loadReport(userId, realName);
        $("text[text-anchor='end']").hide();
      },
      updateFieldValue(fieldName, newVal) {
        var that = this;
        that.data[fieldName] = newVal;
      },
      selectUser() {
        var that = this;
        WF.SelectorDialog.selectorUserString(that, 'UserId', 'RealName', null, true, 'userId');
      }
      , loadReport(userId, realName) {
        var ajaxUrl = FUI.Handlers.WorkflowMonitorHandler;
        var jsonData = Object.toAjaxJson(ajaxUrl, 'totalReportByTargetUserId', { userId: userId });
        var total = 0;
        var data = [];
        var newData = [];
        var categories = [];

        // 计算总数
        $.each(jsonData, function (i, item) {
          if (item.myname == 'TouchTotal') {
            total = item.total;
          }
          // 类别
          categories.push(item.mytitle);
        });

        realName = realName || '';
        var name = realName + '参与任务数：' + total;
        var newData = [];
        $.each(jsonData, function (i, item) {
          var itemSum = item.total;
          var bl = Object.toDecimal((itemSum / total) * 100, 2);
          var g = { itemTotal: itemSum, y: bl };
          data.push(g);
          newData.push(itemSum);
        });
        function setChart(name, categories, data, color) {
          chart.xAxis[0].setCategories(categories, false);
          chart.series[0].remove(false);
          chart.addSeries({
            name: name,
            data: data,
            color: color || 'white'
          }, false);
          chart.redraw();
        }

        var myChart = echarts.init(document.getElementById('container'));
        var option = {
          color: ['#3398DB'],
          title: {
            text: '流程任务参考数量分析',
            subtext: name,
            x: 'center'
          },
          toolbox: {
            feature: {
              saveAsImage: {}
            }
          },
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} '
          },
          grid: {
            top: 120
          },
          legend: {
            data: ['任务数'],
            top: 80
          },
          xAxis: {
            data: categories
          },
          yAxis: {},
          series: [{
            name: '任务数',
            type: 'bar',
            data: newData
          }]
        };
        myChart.setOption(option);
      }

    }
  }



</script>