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

                <td style="height: 28px;">
                  <a class="btn btn-primary btn-sm mr2" @click="searchReport"><i class="fa fa-search" />{{$t('search')}}</a>
                  <a class="btn btn-primary btn-sm mr2" @click="searchReSet"><i class="fa fa-undo" />重置</a>
                </td>
              </tr>
            </table>
          </div>
        </div>
        <div region="center" border="false" style="overflow-y: auto;">
          <div>
            <div id="containerTask" style="min-width: 300px; height: 600px; margin-left: 50px; margin: 0 auto; margin-top: 20px;" />
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
        that.loadReport(timePeriod, startOpenBizDate, endOpenBizDate, userId, realName, appId, appName);
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
      , loadReport(timePeriod, startOpenBizDate, endOpenBizDate, userId, realName, appId, appName) {
        var ajaxUrl = FUI.Handlers.WorkflowMonitorHandler;
        var jsonData = Object.toAjaxJson(ajaxUrl, 'taskStateByCategoryReport', {
          'startOpenBizDate': startOpenBizDate,
          'endOpenBizDate': endOpenBizDate,
          'userId': userId,
          'appId': appId
        });
        var title = realName != '' ? '【' + realName + ' 】' : '';
        if (title != '') { title = title + '-'; }
        var total = 0;
        // 计算总数
        $.each(jsonData, function (i, item) {
          total += item.value;
        });
        var charData = jsonData;
        var myChart = echarts.init(document.getElementById('containerTask'));
        var option = {
          color: ['#68BC31', '#D53F40', '#6FB3E0'],
          title: {
            text: '任务状态数量分布',
            subtext: title + appName + timePeriod + '(任务数:' + total + ')',
            x: 'center'
          },
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
          toolbox: {
            feature: {
              dataView: {
                readOnly: false
              },
              saveAsImage: {}
            }
          },
          legend: {
            orient: 'vertical',
            left: 'left',
            data: [charData[0].name, charData[1].name, charData[2].name],
            top: 50
          },
          grid: {
            top: 180
          },
          calculable: true,
          series: [{
            name: '任务数量',
            type: 'pie',
            left: '10%',
            top: 60,
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
          }]
        };
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option, true);
      }
    }
  };




</script>