<template>
  <div class="f2bpm-page-layout">
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

            <td style="height: 28px;padding: 10px;">
              <a class="btn btn-primary btn-sm mr2" @click="searchReport"><i class="fa fa-search" />{{$t('search')}}</a>
              <a class="btn btn-primary btn-sm mr2" @click="searchReSet"><i class="fa fa-undo" />重置</a>
            </td>
          </tr>
        </table>
      </div>
    </div>
    <div style="overflow-y: auto;padding-top: 20px;">
      <div id="container" style="width: 480px;float:left;  height: 450px; margin-left:120px;" />
      <div id="containerTaskState" style="width: 480px;float:left;  height: 450px;  margin-left:120px;" />
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        data: {
          AppId: '',
          StartTime: '',
          EndTime: ''
        }
      };
    },
    created: function () {
      var that = this;
      var now = new Date();
      that.data.StartTime = now.toDateFormat('yyyy-01-01');
      that.data.EndTime = now.toDateFormat('yyyy-MM-dd');
    },
    methods: {
      searchReSet() {
        var that = this;
        that.data.StartTime = '';
        that.data.EndTime = '';
        that.data.AppId = '';
      },
      searchReport() {
        var that = this;
        var startOpenBizDate = that.data.StartTime;
        var endOpenBizDate = that.data.EndTime;
        var appId = that.data.AppId;
        var appName = appId;
        var timePeriod = startOpenBizDate + '至' + endOpenBizDate;
        that.loadReport(timePeriod, startOpenBizDate, endOpenBizDate, appId, appName);
        that.loadReport2(timePeriod, startOpenBizDate, endOpenBizDate, appId, appName);
      },

      updateFieldValue(fieldName, newVal) {
        var that = this;
        that.data[fieldName] = newVal;
      }
      , formatterState(state) {
        switch (state) {
          case 1:
            return '草稿';
          case 2:
            return '运行中';
          case 3:
            return '已完成';
          case 4:
            return '已挂起';
          case 5:
            return '退回提单';
          case 99:
            return '已作废';
        }
      }
      , loadReport(timePeriod, startOpenBizDate, endOpenBizDate, appId, appName) {
        var that = this;
        var ajaxUrl = FUI.Handlers.WorkflowMonitorHandler;
        var jsonData = Object.toAjaxJson(ajaxUrl, 'workflowInstanceStateReport', { startOpenBizDate: startOpenBizDate, endOpenBizDate: endOpenBizDate, appId: appId });
        var total = 0;
        var data = [];
        var newData = [];
        var stateArr = [1, 2, 3, 4, 5, 99];
        appName = appName || '【所有】';
        // 取出从数据库有的状态
        var stateExistArr = [];
        $.each(jsonData, function (i, item) {
          stateExistArr.push(item.workflowinstancestate);
        });
        // 补齐缺的状态
        $.each(stateArr, function (i, stateItem) {
          if ($.inArray(stateItem, stateExistArr) == -1) {
            jsonData.push({ 'workflowinstancestate': stateItem, 'total': 0 });
          }
        });

        // 计算总数
        $.each(jsonData, function (i, item) {
          total += item.total;
        });

        var s1 = ['草稿', 0]; var s2 = ['运行中', 0]; var s3 = ['已完成', 0]; var s4 = ['已挂起', 0]; var s5 = ['退回提单', 0]; var s99 = ['已作废', 0];
        var charData = [];

        var name = timePeriod + appName + '流程实例-总数：' + total;
        $.each(jsonData, function (i, item) {
          var itemSum = item.total;
          var bl = Object.toDecimal((itemSum / total) * 100, 2);
          // var g = { itemTotal: itemSum, y: bl, color: colors[i] }
          var g = { value: itemSum, name: that.formatterState(item.workflowinstancestate), y: bl };
          switch (item.workflowinstancestate) {
            case 1:
              s1 = g;
              break;
            case 2:
              s2 = g;
              break;
            case 3:
              s3 = g;
              break;
            case 4:
              s4 = g;
              break;
            case 5:
              s5 = g;
              break;
            case 99:
              s99 = g;
              break;
          }
        });
        charData.push(s1);
        charData.push(s2);
        charData.push(s3);
        charData.push(s4);
        charData.push(s5);
        charData.push(s99);
        var myChart = echarts.init(document.getElementById('container'));
        var option = {
          color: ['#999999', '#68BC31', '#6FB3E0', '#E8B110', '#D53F40', '#434348'],
          title: {
            text: appName + '-流程实例状态分析',
            subtext: timePeriod + '(总实例数:' + total + ')',
            x: 'center'
          },
          toolbox: {
            feature: {
              saveAsImage: {}
            }
          },

          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
          legend: {
            orient: 'vertical',
            left: 'left',
            data: ['草稿', '运行中', '已完成', '已挂起', '退回提单', '已作废']
          },
          series: [
            {
              name: '实例数量',
              type: 'pie',
              radius: '55%',
              center: ['50%', '60%'],
              data: charData,
              itemStyle: {
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
        };
        myChart.setOption(option);
      }
      , loadReport2(timePeriod, startOpenBizDate, endOpenBizDate, appId, appName) {
        var that=this;
        var ajaxUrl = FUI.Handlers.WorkflowMonitorHandler;
        var jsonData = Object.toAjaxJson(ajaxUrl, 'taskStateByCategoryReport', { 'startOpenBizDate': startOpenBizDate, 'endOpenBizDate': endOpenBizDate, 'appId': appId });
        var total = 0;
        // 计算总数
        $.each(jsonData, function (i, item) {
          total += item.value;
        });
        appName = appName || '【所有】';
        var charData = jsonData;
        var myChart = echarts.init(document.getElementById('containerTaskState'));
        var option = {
          color: ['#68BC31', '#D53F40', '#6FB3E0'],
          title: {
            text: appName + '-待办任务状态分析',
            subtext: timePeriod + '(任务数:' + total + ')',
            x: 'center'
          },
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
          toolbox: {
            feature: {
              dataView: { readOnly: false },
              saveAsImage: {}
            }
          },
          legend: {
            data: [charData[0].name, charData[1].name, charData[2].name],
            top: 40
          },
          grid: {
            top: 180
          },
          calculable: true,
          series: [
            {
              name: '任务状态分析',
              type: 'funnel',
              left: '10%',
              top: 60,
              // x2: 80,
              bottom: 60,
              width: '90%',
              // height: {totalHeight} - y - y2,
              min: 0,
              max: 100,
              minSize: '0%',
              maxSize: '100%',
              sort: 'descending',
              gap: 2,
              label: {
                normal: {
                  show: true,
                  position: 'inside'
                },
                emphasis: {
                  textStyle: {
                    fontSize: 20
                  }
                }
              },
              labelLine: {
                normal: {
                  length: 10,
                  lineStyle: {
                    width: 1,
                    type: 'solid'
                  }
                }
              },
              itemStyle: {
                normal: {
                  borderColor: '#fff',
                  borderWidth: 1
                }
              },
              data: charData
            }
          ]
        };
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option, true);
      }
    }
  };






</script>