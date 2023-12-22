<template>
  <div :id="setId" class="manageMarketing-chart-content" style="width:100%;height: 346px;">
  </div>
</template>

<script>
  export default {
    name: "LineAndBar",
    props: ['setId', 'yearData'],
    watch: {
      yearData(v1, v2) {
        var that = this;
        setTimeout(() => {
          //这个是绘制图形的函数
          if(v1){
            // if(that.myChart){
            //   that.myChart.dispose();
            //   that.myChart.clear();
            // }
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
    mounted() {
      let that = this;
      // setTimeout(() => {
      //   that.drawChart()//这个是绘制图形的函数
      //   console.log(that.yearData)
      // }, 500)
    },
    methods: {
      drawChart(data) {
        // 基于准备好的dom，初始化echarts实例  这个和上面的main对应
        var that = this;
        that.myChart = this.$echarts.init(document.getElementById(that.setId));
        var year = [];
        var am = []; // 金额
        year[0] = JSON.stringify(data.last.years) ;
        year[1] = JSON.stringify(data.current.years);
        am[0] = data.last.money;
        am[1] = data.current.money;
        var dataArr = [
          {
            name: data.last.years,
            type: 'bar',
            tooltip: {
              valueFormatter: function (value) {
                return value + ' 万';
              }
            },
            data: data.last.money,
          },
          {
            name: data.current.years,
            type: 'bar',
            tooltip: {
              valueFormatter: function (value) {
                return value + ' 万';
              }
            },
            data: data.current.money,
          }];
        // 指定图表的配置项和数据
        let option = {
          grid: {
            containLabel: true
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              crossStyle: {
                color: '#999'
              }
            },
            formatter: function(params) {
              //console.log(params)
              let html = `<div style="height:auto;min-width: 163px;">
          <div style="font-size:14px;font-weight:bold;color:#333;margin-bottom:16px;line-height:1;">
            ${params[0].axisValue}
          </div>
          ${params.map((item) => `<div style="font-size:12px;color:#808080;margin-bottom:8px;display:flex;align-items:center;justify-content:flex-start;line-height:1;">
                <span style="display:inline-block;margin-right:8px;border-radius:6px;width:6px;height:6px;background-color:${item.color};"></span>
                ${item.seriesName}
                <span style="flex:1;text-align:left;padding-right: 10px;padding-left: 10px">¥${Object.tofixed(Number(item.value)) || 0} 万</span>
                <span style="flex:1;text-align:right;padding-right: 10px">${item.componentIndex === 1? '同比 '+data.current.compared[item.dataIndex] + '(%)' : ''}</span>
                <span style="flex:1;text-align:right;padding-right: 10px">${item.componentIndex === 1? '环比 '+ data.current.sequential[item.dataIndex] + '(%)': ''}</span>
              </div>`).join("")}
        </div>`;
              return html;
            },
          },
          //color: ['#538eff', '#FF8307', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc'],
          color: [
            {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {offset: 0, color: '#65ACFF'}, // 设置颜色渐变
                {offset: 1, color: '#4094FF'}
              ]
            },
            {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {offset: 0, color: '#FFC107'},
                {offset: 1, color: '#FF8307'}
              ]
            }
          ],
          legend: {
            data: year
          },
          xAxis: {
            type: 'category',
            data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
            axisPointer: {
              type: 'shadow'
            }
          },
          yAxis: [
            {
              type: 'log',
              name: '金额(万)',
              min: 1,
              // max: 250,
              // interval: 100000000,
            }
          ],
          series: dataArr,
        };
        // 使用刚指定的配置项和数据显示图表。
        that.myChart.setOption(option);
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
