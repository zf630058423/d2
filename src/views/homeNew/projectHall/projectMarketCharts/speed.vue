<template>
  <div>
    <div :id="setId" :ref="refName" class="manageMarketing-chart-content" style="width: 350px;height: 250px;"></div>
  </div>
</template>

<script>
  export default {
    name: "pieChart",
    props: {
      setId: {
        type: String,
        default: "chart",
      },
      refName: {
        type: String,
        default: "chart",
      },
      data1:{
        type: String,
        default: "",
      },
      data2:{
        type: String,
        default: "",
      }
    },
    data() {
      return {chart: null};
    },

    computed: {},
    mounted() {
      let that = this;
      setTimeout(()=>{
        that.initChart()//这个是绘制图形的函数
      },500)
    },
    components: {},
    methods: {
      // 初始化图表
      initChart() {
        // 如果使用id，this.chart = this.$echarts.init(document.getElementById(this.id));
        let myChart = this.$echarts.init(document.getElementById(this.setId));
        let data1 = this.data1;
        let data2 = this.data2;
        let color = "#FF4754";
        let option = {
          color: ["#FF4754",'#fafafa'],
          series: [
            {
              name: "",
              type: "pie",
              radius: ["65%", "90%"], // 决定圆环的位置及粗细
              avoidLabelOverlap: false, // 是否启用防止标签重叠策略
              hoverAnimation: false, // 关闭放大动画
              selectedOffset: 10, // 选中块的偏移量
              label: {
                show: false,
                position: "center",
                formatter: "{d}%",
              },
              labelLine: {
                show: false,
              },
              data: [
                { // 进度条数据data
                  value: data1,
                  name: "xx",
                  selected: true, //默认选中第一块
                  label: {
                    show: true, //默认显示第一块
                    fontSize: "20",
                    color: color,
                  },
                },
                { // 灰色块data
                  value: data2,
                  name: "xx",
                  itemStyle: { // 设置相同的默认颜色和高亮颜色
                    normal: {color: "#EEF0F6"},
                    emphasis: {color: "#eee"},
                  },
                },
              ],
              itemStyle: {
                borderWidth: 5, //设置的是每项之间的留白
                borderColor: "#fff",
              },
            },
          ],
        };
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
      }
    }
  }
</script>
<style scoped>
  .manageMarketing-chart-content {
    padding-top: 10px;
    width: 350px;
    height: 250px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    margin: 0 auto;
    /*border: 1px solid;*/
  }
</style>
