<template>
  <div :id="setId" :style="style" :title="title" class="manageMarketing-chart-content">
  </div>
</template>

<script>
  import getColors from '../../../../resources/jscript/colors'
  export default {
    name: "Pie",
    props:{
      setId: {
        type: String
      },
      width: {
        type: String,
        default: '100%'
      },
      height: {
        type: String,
        default: '100%'
      },
      title:{
        type: String,
        default: ''
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
        newColors: getColors.customData()
      }
    },
    mounted() {
    },
    computed: {
      style() {
        return {
          width: this.width,
          height: this.height
        }
      }
    },

    methods: {
      drawChart(data) {
        //console.log(data);
        var setData = data.map(x => {
          var item = {
            name: x.itemtype,
            value: x.money,
            num: x.num,
            proportion: x.proportion
          };
          return item;
        });
        var chartName = '';
        var tooltipCont = '';
        if(this.setId === 'chart-12'){
          chartName = '收款方式占比';
          tooltipCont = function (parms) {
            var str = parms.marker+""+ parms.data.name+"</br>"+
              "金额："+ Object.tofixed(Number(parms.data.value))+'万'+"</br>"+
              "占比："+ parms.data.proportion+"%"+"</br>";
            return  str ;
          }
        }else if(this.setId === 'chart-13'){
          chartName = '产品线占比';
          tooltipCont = function (parms) {
            var str = parms.marker+""+ parms.data.name+"</br>"+
              "金额："+ Object.tofixed(Number(parms.data.value))+'万'+"</br>"+
              "占比："+ parms.data.proportion+"%"+"</br>"+
              "数量："+ Object.formatDefaultValue(parms.data.num) + '个';
            return  str ;
          }
        }else if(this.setId === 'chart-14'){
          chartName = '年度累计产值占比';
          tooltipCont = function (parms) {
            var str = parms.marker+""+ parms.data.name+"</br>"+
              "金额："+ Object.tofixed(Number(parms.data.value))+'万'+"</br>"+
              "占比："+ parms.data.proportion+"%"+"</br>";
            return  str ;
          }
        }else if(this.setId === 'chart-15'){
          chartName = '年度累计回款占比';
          tooltipCont = function (parms) {
            var str = parms.marker+""+ parms.data.name+"</br>"+
              "金额："+ Object.tofixed(Number(parms.data.value))+'万'+"</br>"+
              "占比："+ parms.data.proportion+"%"+"</br>";
            return  str ;
          }
        }else if(this.setId === 'chart-5'){
          chartName = '年度立项造价占比';
          tooltipCont = function (parms) {
            var str = parms.marker+""+ parms.data.name+"</br>"+
              "金额："+ Object.tofixed(Number(parms.data.value))+'万'+"</br>"+
              "占比："+ parms.data.proportion+"%"+"</br>"+
              "数量："+ Object.formatDefaultValue(parms.data.num) + '个';
            return  str ;
          }
        }else if(this.setId === 'chart-6'){
          chartName = '年度中标金额占比';
          tooltipCont = function (parms) {
            var str = parms.marker+""+ parms.data.name+"</br>"+
              "金额："+ Object.tofixed(Number(parms.data.value))+'万'+"</br>"+
              "占比："+ parms.data.proportion+"%"+"</br>"+
              "数量："+ Object.formatDefaultValue(parms.data.num) + '个';
            return  str ;
          }
        }else if(this.setId === 'chart-7'){
          chartName = '招标方式占比';
          tooltipCont = function (parms) {
            var str = parms.marker+""+ parms.data.name+"</br>"+
              "金额："+ Object.tofixed(Number(parms.data.value))+'万'+"</br>"+
              "占比："+ parms.data.proportion+"%"+"</br>";
            return  str ;
          }
        }
        // 基于准备好的dom，初始化echarts实例  这个和上面的main对应
        //let myChart = this.$echarts.init(document.getElementById(this.setId));
        let mycharts = this.$echarts.getInstanceByDom(document.getElementById(this.setId));
        if(mycharts == null){
          mycharts = this.$echarts.init(document.getElementById(this.setId));
        }
        // 指定图表的配置项和数据
        let option = {
          grid: {
            containLabel: true
          },
          title: {
            text: this.title,
            // subtext: 'Fake Data',
            left: 'center'
          },
          tooltip: {
            trigger: "item",
            formatter:tooltipCont
          },
          // color: ['#538eff', '#FF8307', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#c3fc1f', '#9a60b4', '#ea7ccc','#320EC6', '#91cc75','#E6064F','#F56C6C','#67C23A'],
          color: this.newColors,
          legend: {
            left: 'left',
            type: 'scroll',
            orient: 'vertical'
          },
          series: [
            {
              name: chartName,
              type: 'pie',
              radius: '50%',
              center: ['65%','50%'],
              data: setData,
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            },
            // {
            //   name: chartName,
            //   type: 'pie',
            //   radius: [20, 140],
            //   center: ['25%', '50%'],
            //   roseType: 'radius',
            //   itemStyle: {
            //     borderRadius: 5
            //   },
            //   label: {
            //     show: false
            //   },
            //   emphasis: {
            //     label: {
            //       show: true
            //     }
            //   },
            //   data:setData
            // },
          ]
        };
        // 使用刚指定的配置项和数据显示图表。
        mycharts.setOption(option);
      },
    }
  }
</script>

<style scoped>
  .manageMarketing-chart-content {
    padding-top: 10px;
    /*width: 718px;*/
    /*height: 346px;*/
    /*border: 1px solid;*/
  }
</style>
