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
      ,formatterState(state) {
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
      , loadReport(year, startOpenBizDate, endOpenBizDate, appId, appName) {
        var that=this;
        var ajaxUrl = FUI.Handlers.WorkflowMonitorHandler;
        var jsonData = Object.toAjaxJson(ajaxUrl, 'workflowInstanceStateReport', { startOpenBizDate: startOpenBizDate, endOpenBizDate: endOpenBizDate, appId: appId });
        var total = 0;
        var data = [];
        var newData = [];
        var stateArr = [1, 2, 3, 4, 5, 99];
        appName = appName || '【所有】';
        var categories = [];
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
          // 类别
          categories.push(that.formatterState(item.workflowinstancestate));
        });

        var name = year + appName + '流程实例-总实例数：' + total;
        var columData = [];

        $.each(jsonData, function (i, item) {
          var itemSum = item.total;
          var bl = Object.toDecimal((itemSum / total) * 100, 2);
          var g = { itemTotal: itemSum, y: bl };
          data.push(g);
          columData.push(itemSum);
        });

        var myChart = echarts.init(document.getElementById('container'));
        // "数量：" + point.itemTotal + "<br />比例：" + this.y + '%';
        // s = "<b>数量：</b>" + point.itemTotal + '<br /><b>比例：</b>' + this.y + '% <br>';
        var option = {
          color: ['#3398DB'],
          title: {
            text: appName + '流程实例状态数量分析',
            subtext: name,
            x: 'center'
          },
          toolbox: {
            feature: {
              saveAsImage: {}
            }
          },
          tooltip: {
            trigger: 'axis'
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: [
            {
              type: 'category',
              data: categories
            }
          ],
          yAxis: [
            {
              type: 'value'
            }
          ],
          series: [
            {
              name: '实例数',
              type: 'bar',
              barWidth: '30%',
              data: columData
            }
          ]
        };
        myChart.setOption(option);
      }

    }
  }



</script>