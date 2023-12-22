<template>
  <div class="f2bpm-page-layout">
    <el-container>
      <el-main class="f2bpm-page-right">
        <div region="north" border="false" style="overflow-y: hidden;">
          <div id="gridSearch" class="cont-list-form " style="display: block;">
            <table>
              <tr>
                <td>
                  <label class="wf-label">提单时间：</label>
                  <el-date-picker v-model="data.StartTime" size="mini" type="date" class="textBoxShort" value-format="yyyy-MM-dd" />
                </td>
                <td>
                  <label class="wf-label">至：</label>
                  <el-date-picker v-model="data.EndTime" size="mini" type="date" class="textBoxShort" value-format="yyyy-MM-dd" />
                </td>

                <td style="height: 28px;">
                  <a class="btn btn-primary btn-sm mr2" @click="searchReport"><i class="fa fa-search" />{{$t('search')}}</a>
                  <a class="btn btn-primary btn-sm mr2" @click="searchReSet"><i class="fa fa-undo" />重置</a>
                </td>
              </tr>
            </table>
          </div>
        </div>
        <div region="center" border="false" style="overflow-y: auto;">
          <div id="container" style="min-width: 310px; height: 400px; margin: 0 auto" />
          <div style="margin-left: 150px;">
            说明：流程涉及的各环节内部耗时分布，如环节的平均等待时间与平均处理时间对比分析等； <br>（“节点”被“创建”到此节点被“处理完成前”期间视为等待时间，存在等待时间是当前节点正在进行中。“节点创建时间”至“节点完成关闭”期间视为处理时间） <br> X 轴——流程中各环节名称；Y 轴——该环节等待时长 / 处理时长；
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
          AppName: '',
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
        var yearMonth = startOpenBizDate + '至' + endOpenBizDate;
        that.loadReport(yearMonth, startOpenBizDate, endOpenBizDate, appId, appName);
        $("text[text-anchor='end']").hide();
      },
      updateFieldValue(fieldName, newVal) {
        var that = this;
        that.data[fieldName] = newVal;
      },
      selectUser() {
        var that = this;
        WF.SelectorDialog.selectorUserString(that, 'UserId', 'RealName', null, true);
      }
      , loadReport(year, startOpenBizDate, endOpenBizDate, appId) {
        var ajaxUrl = FUI.Handlers.WorkflowMonitorHandler;
        var jsonData = Object.toAjaxJson(ajaxUrl, 'getWorkflowInstanceAppIdReportJson', { startOpenBizDate: startOpenBizDate, endOpenBizDate: endOpenBizDate, appId: appId });
        var total = 0;
        var data = [];
        var newData = [];
        var categories = [];

        $.each(jsonData, function (i, item) {
          total += item.total;
          // 类别
          categories.push(item.appid);
        });
        var name = '流程实例发起总数：' + total;
        $.each(jsonData, function (i, item) {
          var itemSum = item.total;
          var bl = Object.toDecimal((itemSum / total) * 100, 2);
          var g = { itemTotal: itemSum, y: bl };
          data.push(g);
          newData.push(itemSum);
        });

        var myChart = echarts.init(document.getElementById('container'));
        var option = {
          color: ['#3398DB'],
          title: {
            text: '流程发起实例总数',
            subtext: name,
            x: 'center'
          },
          toolbox: {
            feature: {
              saveAsImage: {}
            }
          },
          grid: {
            top: 120
          },
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} '
          },
          legend: {
            data: ['实例数'],
            top: 50
          },
          xAxis: {
            data: categories
          },
          yAxis: {},
          series: [{
            name: '实例数',
            type: 'bar',
            data: newData
          }]
        };

        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
      }
    }
  }



</script>