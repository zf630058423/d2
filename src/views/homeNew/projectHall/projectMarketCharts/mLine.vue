<template>
  <div :id="setId" class="manageMarketing-chart-content" style="width: 100%;height: 346px;">
  </div>
</template>

<script>
  export default {
    name: "mLine",
    props:{
      setId: {
        type: String
      },
      yearData:{
        type: Object/Array,
        default: () => {}
      }
    },
    watch: {
      yearData(v1, v2) {
        var that = this;
        setTimeout(() => {
          //这个是绘制图形的函数
          if(v1){
            that.drawChart(v1)
          }
        }, 500)
      }
    },
    data() {
      return {
        form: {},
        value1: '',
        value2: '',
        myChart: null
      }
    },
    methods: {
      drawChart(data) {
        // 基于准备好的dom，初始化echarts实例  这个和上面的main对应
        var year = [];
        year[0] = JSON.stringify(data.current.years);
        this.myChart = this.$echarts.init(document.getElementById(this.setId));
        var chartName = '';
        if(this.setId === 'chart-3'){
          chartName = '中标率(%)';
        }else if(this.setId === 'chart-4'){
          chartName = '投标转化率(%)';
        }
        // 指定图表的配置项和数据
        let option = {
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              crossStyle: {
                color: '#999'
              }
            }
          },
          legend: {
            data: year
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
          },
          color: ['#538eff', '#FF8307','#73c0de', '#fac858', '#ee6666',  '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc'],
          yAxis: {
            type: 'value',
            name: chartName,
            min: 0,
            // max: 250,
            // interval: 100000000,
            axisLabel: {
              formatter: '{value} %'
            }
          },
          series: [
            {
              name: data.current.years,
              data: data.current.compared,
              type: 'line',
              smooth: true,
              areaStyle: {
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [{
                    offset: 0, color: '#538eff', // 0% 处的颜色
                  }, {
                    offset: 1, color: '#fff' // 100% 处的颜色
                  }],
                  global: false // 缺省为 false
                }
              }
            }
          ]
        };
        // 使用刚指定的配置项和数据显示图表。
        this.myChart.setOption(option);
      },
    }
  }
</script>

<style scoped>
  .manageMarketing-chart-content {
    padding-top: 10px;
    width: 100%;
    height: 346px;
    /*border: 1px solid;*/
  }
</style>
