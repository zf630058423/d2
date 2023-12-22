<template>
  <div class="f2bpm-page-layout">
    <el-container>
      <el-main class="f2bpm-page-right">
        <div region="north" border="false" style="overflow-y: hidden;">
          <div id="gridSearch" class="cont-list-form " style="display: block;">
            <table>
              <tr>

                <td>
                  <label class="wf-label">指定流程：</label>
                  <f2bpmui-select sqlkey="dbType_CB_AppIdList" props="{style:'width: 200px'}" :fieldvalue="data.AppId" field="AppId" @updatevalue="updateFieldValue" />
                </td>
                <td>
                  <label class="wf-label">提单时间：</label>
                  <el-date-picker v-model="data.StartTime" size="mini" type="date" class="textBoxShort" value-format="yyyy-MM-dd" />
                </td>
                <td>
                  <label class="wf-label">至：</label>
                  <el-date-picker v-model="data.EndTime" size="mini" type="date" class="textBoxShort" value-format="yyyy-MM-dd" />
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
          <div id="container" style="min-width: 310px; height: 400px; margin: 0 auto" />
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
      , loadReport(timePeriod, startOpenBizDate, endOpenBizDate, appId, appName) {
        var ajaxUrl = FUI.Handlers.WorkflowMonitorHandler;
        var jsonData = Object.toAjaxJson(ajaxUrl, 'workflowInstanceAppIdYearMonthDayChartReportJson', { startOpenBizDate: startOpenBizDate, endOpenBizDate: endOpenBizDate, appId: appId });
        var total = 0;
        appName = appName || '【所有】';
        var categories = [];// X轴的天数
        var data = [];// 线数据， 格式：[{ name: 线名,data各点数: [7.0, 6.9,] },name: 线名,data: [7.0, 6.9,]]
        var lineType = [];// 线类别，即有多少条线
        $.each(jsonData, function (i, item) {
          total += item.total;
          if ($.inArray(item.openbizdate, categories) == -1) {
            // 类别
            categories.push(item.openbizdate);
          }
          if ($.inArray(item.appid, lineType) == -1) {
            // 类别
            lineType.push(item.appid);
          }
        });
        categories = categories.sort();
        lineType = lineType.sort();

        // 构建各线的数据
        $.each(lineType, function (i, lineAppId) {
          var lineData = [];
          // 取各月数据
          $.each(categories, function (i, month) {
            var theValue = 0;
            $.each(jsonData, function (i, item) {
              if (item.appid == lineAppId && month == item.openbizdate) {
                theValue = item.total;
              }
            });
            lineData.push(theValue);
          });
          var lineObject = { name: lineAppId, type: 'line', data: lineData };
          data.push(lineObject);
        });

        var myChart = echarts.init(document.getElementById('container'));
        var option = {
          title: {
            text: appName + '流程每日新增实例数量',
            subtext: timePeriod + '（总实例数：' + total + ')',
            x: 'center'
          },

          toolbox: {
            feature: {
              saveAsImage: {}
            }
          },
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c}'
          },
          legend: {
            data: lineType,
            x: 'center',
            top: 60
          },
          grid: {
            top: 140,
            bottom: 50
          },
          xAxis: {
            type: 'category',
            name: '日期',
            splitLine: { show: false },
            data: categories
          },
          grid: {
            top: 120,
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          yAxis: {
            type: 'value',
            name: '数量',
            min: 0,
            scale: false
          },
          series: data
        };
        myChart.setOption(option, true);
      }

    }
  }


</script>