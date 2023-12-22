<template>
  <div class="maincontainer" style="padding: 0px;margin: 0px;height: 100%;">
    <!--内容-->
    <div class="chart-report">
      <div v-if="report_error_msg!=''" class="report_error_msg"><span v-html="report_error_msg" /> </div>
      <div v-if="echart.chartType!='table'&&echart.chartType!='totalnum'" style="height: 100%;overflow: auto;">
        <div :id="reportCode" :style="'width:'+reportWidth+';  height: 98%; margin: 0 auto;' " />
      </div>
      <div v-else-if="echart.chartType=='table'">
        <div v-if="echart.showTitle">
          <span class="data-table-title" v-html="echart.title" />
          <span v-if="echart.subtitle!=''" class="data-table-sub-title" v-html="echart.subtitle" />
        </div>
        <table id="mytable" class="f2bpm-datatable">
          <tr>
            <th v-for="(c,index) in table.columns" :key="index"><span v-html="c.title" /></th>
          </tr>
          <tr v-for="(r,rindex) in table.data" :key="rindex">
            <td v-for="(c,index) in table.columns" :key="index"><span>{{ r[c.field] | numFilter(digit) }}</span></td>
          </tr>
        </table>
      </div>
      <div v-else-if="echart.chartType=='totalnum'" class="my-totalnumtable-container">
        <div v-if="echart.showTitle">
          <span class="data-table-title" v-html="echart.title" />
          <span v-if="echart.subtitle!=''" class="data-table-sub-title" v-html="echart.subtitle" />
        </div>
        <table class="f2bpm-datatable noboder-table mytotalnumtable">
          <tr>
            <td v-for="(c,index) in table.columns" :key="index" class="totalnum-title"><span v-html="c.title" /></td>
          </tr>
          <tr v-for="(r,rindex) in table.data" :key="rindex">
            <td v-for="(c,index) in table.columns" :key="index" class="totalnum-num" :style="'color:'+c.color"><span>{{ r[c.field] | numFilter }}</span></td>
          </tr>
        </table>
      </div>
    </div>
  </div>
</template>

<script>

  export default {
    name: 'f2bpm-report',
    filters: {
      numFilter(value, digit) {
        // 截取当前数据到小数点后两位,四舍五入
        if (isNaN(value)) {
          return value
        }
        const realVal = value
        if (digit) {
          // var digit = that.options.chart.properties.digit;
          const realVal = Object.toDecimal(value, digit)
        }
        return realVal
      }
    },
    props: {
      code: {
        type: String,
        required: true
      }
    },
    data() {
      return {
        digit: 2,
        reportWidth: '100%',
        report_error_msg: '',
        formAction: null,
        // 图表显示的数据
        chartData: [],
        // Model Json
        data: {},
        // 图表JSON
        designerJson: {},
        // 高级属性
        adOptions: {},
        // 数据源参数配置
        dataSorceOpt: {},
        // 扩展的脚本
        jscript: '',
        // 当前编辑的属性
        activeProperty: {},
        // echart 展现
        echart: {},
        digit: 2,
        // table展现
        table: {},
        formRules: {}

      }
    },
    computed: {
      rotatePropertyIcon() {
        return this.isPropertyCollapsed ? 'fa fa-angle-double-left' : 'fa fa-angle-double-right'
      },
      rotateIcon() {
        return this.isCollapsed ? 'fa fa-angle-double-right' : 'fa fa-angle-double-left'
      }
    },
    created: function() {
      var default_options = {
        'chart': {
          'title': '',
          'subtitle': '',
          'xName': '',
          'yName': '',
          'axisLabel': {
            'rotate': '',
            'interal': ''
          },

          'showTitle': true,
          'groupbys': [],
          'legends': [],
          'legend': [],
          'legendColor': ''
        },
        'grid': {
          'sort': '',
          'order': 'desc'
        }
      }
      var res = { success: false }
      var that = this
      that.reportCode = that.code
      if (that.reportCode) {
        res = Object.toAjaxJson(FUI.Handlers.Report, 'getModelByCode', {
          reportCode: that.reportCode
        })
      }
      if (res.success) {
        that.data = res.data
        that.dataSorceOpt = that.data.dataSorceOpt ? eval('(' + that.data.dataSorceOpt + ')') : {
          processform: {
            formKey: '',
            title: ''
          },
          tableview: {
            name: '',
            title: ''
          }
        }

        that.options = res.data.options ? eval('(' + res.data.options + ')') : default_options
        that.adOptions = res.data.adOptions ? eval('(' + res.data.adOptions + ')') : {
          where: '',
          whereAssembly: '',
          isJoinAssembly: '',
          whereOption: []
        }
        that.jscript = res.data.jscript
        if (!that.options.chart.legends) {
          that.options.chart.legends = []
        }
        if (!that.options.chart.groupbys) {
          that.options.chart.groupbys = []
        }
        if (!that.options.chart.colors) {
          that.options.chart.colors = []
        }
        if (!that.options.chart.chartType) {
          that.options.chart.chartType = 'column'
        }
        // 其它属性
        if (!that.options.chart.properties) {
          that.options.chart.properties = {
            digit: 2
          }
        } else {
          that.digit = that.options.chart.properties.digit
        }
        // 当前属性
        that.activeProperty = that.options.chart
      }
    },
    mounted() {
      var that = this
      if (!WFContext.isDesign) {
        that.refreshChart()
      }
    },
    methods: {
      previewChart() {
        var that = this
        // 根据legends构建legend和legendColor;
        var legendArr = []
        var legendColorArr = []
        $.each(that.options.chart.legends, function(index, item) {
          legendArr.push(item.title)
          legendColorArr.push(item.color)
        })
        that.options.chart.legend = legendArr
        that.options.chart.legendColor = legendColorArr
        // 显示图表
        that.echart = Object.toDeepClone(that.options.chart)
        that.echart.data = that.chartData
        // 选中
        if (that.echart.chartType != 'pie' && that.echart.chartType != 'totalnum' && that.echart.chartType != 'table') {
          var legendN = legendArr.length
          var categoriesN = that.echart.data.length
          var reportWidth = categoriesN * 30 * legendN
          // if (reportWidth > 500) {
          //   that.reportWidth = reportWidth + "px";
          // }
        }
        that.loadChartReport(that.echart)
        console.info(that.echart)
      },
      refreshChart() {
        var that = this
        var reportCode = that.data.reportCode
        var res = Object.toAjaxJson(FUI.Handlers.Report, 'getChartDataByCode', {
          isSet: 0,
          reportCode: reportCode
        })
        if (res.success) {
          that.chartData = res.data
          that.previewChart()
        } else {
          console.info(res.msg)
          that.report_error_msg = '预览无法展示，请继续完善图表配置后点击保存。'
        }
      }, // title:正标题；
      // subtitle:副标题
      // xName:x轴名称
      // yName:y轴名称
      // legend:类别名，示例：['人次', '请假天数']

      loadChartReport(chart) {
        var that = this
        // 支持bar,line
        var digit = chart.properties.digit
        var chartType = chart.chartType
        var title = ''
        var subtitle = ''
        if (chart.showTitle) {
          title = chart.title || ''
          subtitle = chart.subtitle || ''
        }
        var xName = chart.xName || ''
        var yName = chart.yName || ''
        // Y轴指标
        var legend = chart.legend || []
        var legendColor = chart.legendColor || ''
        var textValueList = chart.data || []
        var jsonData = textValueList
        var colorArr = legendColor || ['#3398DB', '#FACDCA', '#ffd800', '#ff0000', '#00ff90']
        var axisLabelParm = {
          interal: 0,
          rotate: 0
        }
        if (chart.axisLabel && !isNaN(chart.axisLabel.interal)) {
          axisLabelParm.interal = chart.axisLabel.interal
        }
        if (chart.axisLabel && !isNaN(chart.axisLabel.rotate)) {
          // 旋转角度
          axisLabelParm.rotate = chart.axisLabel.rotate
        }
        var total = 0
        var nvData = []
        var categoriesAndMax = []
        var categories = []
        var markPoint = {
          data: [{
            type: 'max',
            name: '最大值'
          }, {
            type: 'min',
            name: '最小值'
          }]
        }
        var markLine = {
          data: [{
            type: 'average',
            name: '平均值'
          }]
        }
        $.each(jsonData, function(i, item) {
          var name = item.name || item.NAME
          var v = item.value || item.VALUE
          v = Object.toDecimal(v, digit)
          categories.push(name)
          categoriesAndMax.push({
            name: name,
            max: 0
          })
          nvData.push({
            name: name,
            value: v
          })
          total = total + v
        })
        var seriesItemType = chartType
        if (chartType == 'column') {
          seriesItemType = 'bar'
        }
        if (chartType == 'area') {
          seriesItemType = 'line'
        }
        // seriesData结构：[{name:"张本",data:[1,2,3]}]
        var seriesData = []
        if (seriesItemType == 'radar') {
          // 雷达
          var radarSeries = {}
          radarSeries.name = ''
          radarSeries.type = 'radar'
          radarSeries.data = []
          // legend:指标
          $.each(legend, function(index, le) {
            var seriesItem = {}
            seriesItem.name = le
            seriesItem.value = []
            $.each(jsonData, function(i, item) {
              var fieldName = index == 0 ? 'value' : 'value' + index
              var value = item[fieldName] || item[fieldName.toUpperCase()]
              value = Object.toDecimal(value, digit)
              categoriesAndMax[i].max = categoriesAndMax[i].max < value ? value
                : categoriesAndMax[i].max
              seriesItem.value.push(value)
            })
            radarSeries.data.push(seriesItem)
          })
          seriesData.push(radarSeries)
        } else if (seriesItemType != 'table' && seriesItemType != 'totalnum') {
          // 其它
          $.each(legend, function(index, le) {
            var seriesItem = {}
            seriesItem.name = le
            seriesItem.type = seriesItemType
            seriesItem.data = []
            if (seriesItemType == 'bar') {
              seriesItem.markPoint = markPoint
              seriesItem.markLine = markLine
            }
            if (chartType == 'area') {
              seriesItem.areaStyle = {}
              seriesItem.stack = '总量'
            }
            if (chartType == 'area' || chartType == 'line') {
              // 在点在显示数值
              seriesItem.label = {
                normal: {
                  show: true,
                  position: 'top'
                }
              }
            }
            $.each(jsonData, function(i, item) {
              var fieldName = index == 0 ? 'value' : 'value' + index
              var value = item[fieldName] || item[fieldName.toUpperCase()]
              value = Object.toDecimal(value, digit)
              seriesItem.data.push(value)
            })
            seriesData.push(seriesItem)
          })
        }
        var containerId = that.reportCode
        var myChart = echarts.init(document.getElementById(containerId))
        var option = {
          color: colorArr,
          title: {
            text: title,
            subtext: subtitle,
            x: 'center'
          },
          toolbox: {
            show: true,
            feature: {
              dataView: {
                show: true,
                readOnly: false
              },
              magicType: {
                show: false
              },
              restore: {
                show: false
              },
              saveAsImage: {
                show: true
              }
            }
          },
          grid: {
            top: 160
          },
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c}'
          },
          legend: {
            data: legend,
            top: 50
          },
          // xAxis: {
          //   data: categories,
          //   name: xName,
          //   axisLabel: axisLabelParm
          // },
          // yAxis: {
          //   name: yName,
          //   type: 'value'
          // },
          series: seriesData
        }
        if (chartType == 'column' || chartType == 'line') {
          option.xAxis = {
            data: categories,
            name: xName,
            axisLabel: axisLabelParm
          }
          option.yAxis = {
            name: yName,
            type: 'value'

          }
          if (chartType == 'line') {
            option.xAxis.boundaryGap = false
          }
        } else if (chartType == 'area') {
          // 面积
          var areaOpt = that.getAreaOpt(categories, axisLabelParm)
          option = Object.extend(option, areaOpt)
        } else if (chartType == 'bar') {
          // 条形图
          option.xAxis = {
            type: 'value',
            boundaryGap: [0, 0.01]
          }
          option.yAxis = {
            type: 'category',
            data: categories
          }
        } else if (chartType == 'pie') {
          // 饼图
          option.title.subtext = ' 总数：' + Object.toDecimal(total, digit)
          if (!chart.colors || chart.colors.length <= 0) {
            that.report_error_msg = '饼图需要配置各项目标状态的颜色,请在右侧“通用颜色”进行配置，本图表需要配置【' + categories.length + '】种颜色'
            FUI.Window.showMsg2(that.report_error_msg)
            return false
          }
          if (chart.colors && chart.colors[0].title == '') {
            // 取通用颜色，没有配置标题时，按顺序取颜色
            option.color = []
            $.each(chart.colors, function(i, item) {
              option.color.push(item.color)
            })
          } else if (chart.colors && chart.colors[0].title != '') {
            option.color = []
            // 取分类取颜色
            $.each(categories, function(i, cate) {
              var item = chart.colors.find(a => a.title == cate)
              if (item) {
                option.color.push(item.color)
              } else {
                option.color.push(chart.colors[i])
              }
            })
          }
          var pieOtp = that.getPieOpt(legend[0], categories, nvData)
          option = Object.extend(option, pieOtp)
        } else if (chartType == 'funnel') {
          // 漏斗
          option.title.subtext = ' 总数：' + Object.toDecimal(total, digit)
          if (chart.colors && chart.colors[0].title == '') {
            // 取通用颜色
            option.color = []
            $.each(chart.colors, function(i, item) {
              option.color.push(item.color)
            })
          } else if (chart.colors && chart.colors[0].title != '') {
            option.color = []
            // 取分类取颜色
            $.each(categories, function(i, cate) {
              var item = chart.colors.find(a => a.title == cate)
              if (item) {
                option.color.push(item.color)
              } else {
                option.color.push(chart.colors[i])
              }
            })
          }
          var radarOpt = that.getFunnelOpt(legend[0], categories, nvData)
          option = Object.extend(option, radarOpt)
        } else if (chartType == 'radar') {
          // 雷达
          var radarOpt = that.getRadarOpt(legend, categories, categoriesAndMax, nvData)
          option = Object.extend(option, radarOpt)
        } else if (chartType == 'table' || chartType == 'totalnum') {
          // 表格 或统计表格
          that.getTable(chart, jsonData)
          return
        } else if (chartType == 'map') {
        }
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option)
      },
      getTable(chart, jsonData) {
        var that = this
        var legends = chart.legends
        var groupbys = chart.groupbys
        var data = jsonData
        var table = {
          columns: [],
          data: []
        }

        $.each(groupbys, function(i, item) {
          table.columns.push({
            title: item.title,
            field: item.field.toLowerCase()
          })
        })
        $.each(legends, function(i, item) {
          var fieldName = i == 0 ? 'value' : 'value' + i
          table.columns.push({
            title: item.title,
            field: fieldName.toLowerCase(),
            color: item.color
          })
        })

        table.data = jsonData
        that.table = table
        console.info(table.columns)
        console.info(table.data)
        console.info(that.table)
      },
      getPieOpt(legendTitle, categories, charData) {
        var option = {
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
          legend: {
            orient: 'vertical',
            left: 'left',
            data: categories
          },
          series: [{
            name: legendTitle,
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
          }]
        }
        return option
      },
      getAreaOpt(categories, axisLabelParm) {
        console.info('getAreaOpt')
        var option = {
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              label: {
                backgroundColor: '#6a7985'
              }
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            top: 120,
            containLabel: true
          },
          xAxis: {
            type: 'category',
            // 铺满
            boundaryGap: false,
            data: categories,
            axisLabel: axisLabelParm
          },
          yAxis: [{
            type: 'value'
          }]
        }
        return option
      },
      getRadarOpt(legend, categories, categoriesAndMax, charData) {
        var indicator = []
        $.each(categoriesAndMax, function(i, item) {
          item.max = item.max + 200
          indicator.push(item)
        })
        var option = {
          legend: {
            left: 'left',
            data: legend,
            top: 20
          },
          tooltip: {},
          radar: {
            // shape: 'circle',
            name: {
              textStyle: {
                color: '#fff',
                backgroundColor: '#999',
                borderRadius: 3,
                padding: [3, 5]
              }
            },
            indicator: indicator
          }
        }
        return option
      },
      getFunnelOpt(legendTitle, categories, nvData) {
        // nvData=[
        //         {value: 60, name: '南昌'},
        //         {value: 40, name: '张三'},
        //         {value: 20, name: '李四'},
        //         {value: 80, name: '海门'},
        //         {value: 100, name: '系统管理员'},
        //         {value: 120, name: '阳江'}
        //  ]
        // 漏斗
        var option = {
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
          legend: {
            orient: 'vertical',
            left: 'left',
            data: categories
          },
          series: [{
            name: legendTitle,
            type: 'funnel',
            left: '10%',
            top: 60,
            // x2: 80,
            bottom: 60,
            width: '80%',
            // height: {totalHeight} - y - y2,
            // min: 0,
            // max: 100,
            minSize: '0%',
            maxSize: '100%',
            sort: 'descending',
            gap: 2,
            label: {
              show: true,
              position: 'inside'
            },
            labelLine: {
              length: 10,
              lineStyle: {
                width: 1,
                type: 'solid'
              }
            },
            itemStyle: {
              borderColor: '#fff',
              borderWidth: 1
            },
            emphasis: {
              label: {
                fontSize: 20
              }
            },
            data: nvData
          }]
        }
        return option
      },
      getMapOpt(geoCoordMap, charNVdata) {
        return null
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import "~@/resources/css/reportdisginer.css";
</style>
