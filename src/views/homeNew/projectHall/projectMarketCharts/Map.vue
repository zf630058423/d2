<template>
  <div class="dashboard-container">
    <div ref="chart" class="dashboard-chart" />
  </div>
</template>

<script>

  import { mapGetters } from 'vuex'
  import ch from '@/resources/json/ch_areaData.json'
  export default {
    name: 'InternalSealsAddressMap',
    props:{
      yearData:{
        type: Object/Array,
        default: () => {}
      }
    },
    watch: {
      yearData(v1, v2) {
        var that = this;
        console.log(v1, v2);
        setTimeout(() => {
          //这个是绘制图形的函数
          // if(v1){
          //   that.drawChart(v1)
          // }
          that.drawChart(v1)
        }, 500)
      }
    },
    data() {
      return {
        barOption: {
          title: {
            show: false,
            text: '导入数量统计',
            z: 10
          },
          roam: true,
          tooltip: {
            show: true,
            trigger: 'item',
            formatter: (params) => {
              return `${params.name}<br />总订单 ${params.value || 0}单`
            }
          },
          color:['#D8E5FC', '##A7C7FF', '#FC9637'],
          visualMap: {
            min: 0,
            max: 2000,
            text: ['High', 'Low'],
            realtime: false,
            calculable: true,
            position:'top',
            inRange: {
              color: ['lightskyblue', 'yellow', 'blue']
            }
          },
          series: []
        }
      }
    },
    computed: {
      ...mapGetters(['name'])
    },
    created() {
    },
    mounted() {
      // 选取dom元素

      const chartDom = this.$refs.chart;
      const myChart = this.$echarts.init(chartDom);
      // 添加loading加载
      myChart.showLoading();
      this.$echarts.registerMap('china', ch);
      myChart.setOption(this.barOption);
      myChart.hideLoading()
      // 在容器大小发生改变时改变图表尺寸
      window.onresize = function() {
        myChart.resize()
      }
    },
    drawChart(dataObj){
      this.barOption.series[0] = {
        data: dataObj,
        type: 'map',
        map: 'china',
        // label 在省份上显示的文本
        label: {
          show: false,
          color: 'Maroon',
          position: 'top',
          formatter: (params) => {
            return `${params.name} ${params.value || 0}`
          }
        }
      };

    }
  }
</script>

<style lang="scss" scoped>

  .dashboard {
    &-container {
      width: 100%;
      height: 100%;
    }
    &-text {
      font-size: 30px;
      line-height: 46px;
    }
    &-chart {
      padding-top: 10px;
      width: 900px;
      height: 600px;
    }
  }
</style>
