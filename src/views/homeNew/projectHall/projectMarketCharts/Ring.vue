<template>
  <div :id="setId" :style="style" :title="title" class="manageMarketing-chart-content">
  </div>
</template>

<script>
  import getColors from '../../../../resources/jscript/colors'
  export default {
    name: "Ring",
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
      let that = this;
      // setTimeout(()=>{
      //   that.drawChart()//这个是绘制图形的函数
      // },500)
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
        if(this.setId === 'chart-7'){
          chartName = '招标方式占比';
          tooltipCont = function (parms) {
            var str = parms.marker+""+ parms.data.name+"</br>"+
              "金额："+ Object.tofixed(Number(parms.data.value))+'万'+"</br>"+
              "占比："+ parms.data.proportion+"%"+"</br>";
            return  str ;
          }
        }else if(this.setId === 'chart-6'){
          chartName = '年度中标金额占比';
          tooltipCont = function (parms) {
            var str = parms.marker+""+ parms.data.name+"</br>"+
              "金额："+ Object.tofixed(Number(parms.data.value))+'万'+"</br>"+
              "占比："+ parms.data.proportion+"%"+"</br>"+
              "数量："+ parms.data.num + '个';
            return  str ;
          }
        }else if(this.setId === 'chart-12'){
          chartName = '收款方式占比';
          tooltipCont = function (parms) {
            var str = parms.marker+""+ parms.data.name+"</br>"+
              "金额："+ Object.tofixed(Number(parms.data.value))+'万'+"</br>"+
              "占比："+ parms.data.proportion+"%"+"</br>";
            return  str ;
          }
        }else{
          chartName = '产品线占比';
          tooltipCont = function (parms) {
            var str = parms.marker+""+ parms.data.name+"</br>"+
              "金额："+ Object.tofixed(Number(parms.data.value))+'万'+"</br>"+
              "占比："+ parms.data.proportion+"%"+"</br>"+
              "数量："+ parms.data.num + '个';
            return  str ;
          }
        }
        // 基于准备好的dom，初始化echarts实例  这个和上面的main对应
        let myChart = this.$echarts.init(document.getElementById(this.setId));
        // 指定图表的配置项和数据
        let option = {
          tooltip: {
            trigger: 'item',
            formatter:tooltipCont
          },
          legend: {
            // top: '5%',
            // orient: 'horizontal',
            // align: 'auto',
            // left: 'left'
            left: 'left',
            type: 'scroll',
            orient: 'vertical'
          },
          // color: ['#538eff', '#FF8307', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc'],
          color: this.newColors,
          series: [
            {
              name: chartName,
              type: 'pie',
              radius: ['40%', '70%'],
              center: ['60%','50%'],
              avoidLabelOverlap: false,
              itemStyle: {
                borderRadius: 10,
                borderColor: '#fff',
                borderWidth: 2
              },
              label: {
                show: false,
                position: 'center'
              },
              emphasis: {
                label: {
                  show: true,
                  fontSize: '20',
                  fontWeight: 'bold'
                }
              },
              labelLine: {
                show: false
              },
              data: setData
              // data: [
              //   { value: 1048, name: 'Search Engine' },
              //   { value: 735, name: 'Direct' },
              //   { value: 580, name: 'Email' },
              //   { value: 484, name: 'Union Ads' },
              //   { value: 300, name: 'Video Ads' }
              // ]
            }
          ]
        };
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
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
