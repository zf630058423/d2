<template>
  <div class="dashboard-container">
    <div ref="charts" style="width: 1000px; height: 800px"></div>
  </div>
</template>


<script>
  import * as echarts from "echarts";
  import zhongguo from '@/resources/json/ch_areaData.json'
  import { getMap } from "@/resources/jscript/maputil.js";
  export default {
    name:'mapchart',
    props:['yearData'],
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
            that.initCharts(v1)
          }
        }, 500)
      }
    },
    created () {
    },
    methods: {
      tranNumber(num, point){
         // 将数字转换为字符串,然后通过split方法用.分隔,取到第0个
        let numStr = num.toString().split('.')[0]
        if (numStr.length < 5) { // 判断数字有多长,如果小于6,,表示10万以内的数字,让其直接显示
          return numStr;
        } else if (numStr.length >= 5 && numStr.length <= 7) { // 如果数字大于5位,小于8位,让其数字后面加单位万
          let decimal = numStr.substring(numStr.length - 4, numStr.length - 4 + point)
          // 由千位,百位组成的一个数字
          return parseFloat(parseInt(num / 10000) + '.' + decimal) + '万'
        } else if (numStr.length > 7) { // 如果数字大于8位,让其数字后面加单位亿
          let decimal = numStr.substring(numStr.length - 8, numStr.length - 8 + point);
          return parseFloat(parseInt(num / 100000000) + '.' + decimal) + '亿'
        }
      },
      initCharts(datas) {
        let _this = this;
        const charts = echarts.init(this.$refs["charts"]);
        var arr = zhongguo.features;
        var newArr = [];
        var arr2 = arr.map(x => {
          var item = {
            name: x.properties.name,
            value: x.properties.center
          };
          return item
        });
        for(var i=0;i<arr2.length;i++){
          for(var j=0;j<datas.length;j++){
            if(arr2[i].name && datas[j].province.includes(arr2[i].name)){
              var arrValue = arr2[i].value;
              arrValue.push(datas[j].projectAmount,datas[j].projectNum,datas[j].accumulatedValue,datas[j].proportion);
              newArr.push(arr2[i]);
            }

          }
        }
        console.log(newArr,datas,'地图数据');
        const option = {
          // 背景颜色
          backgroundColor: "#ffffff",
          // 提示浮窗样式
          tooltip: {
            show: true,
            trigger: "item",
            alwaysShowContent: false,
            backgroundColor: "#ffffff",
            borderColor: "rgba(255, 255, 255, 0.16);",
            hideDelay: 100,
            triggerOn: "mousemove",
            enterable: true,
            textStyle: {
              color: "#616161",
              fontSize: "12",
              width: 20,
              height: 30,
              overflow: "break",
            },
            showDelay: 100,
            formatter(params) {
              return `地区：${params.name}</br>项目金额：${params.value[2]}</br>项目个数：${params.value[3]}</br>累计完成产值：${params.value[4]}</br>占比：${params.value[5]}`;
            },
          },
          // 地图配置
          geo: {
            map: "china",
            zoom: 1.2,
            label: {
              // 通常状态下的样式
              normal: {
                show: true,
                textStyle: {
                  color: "#616161",
                },
              },
              // 鼠标放上去的样式
              emphasis: {
                textStyle: {
                  color: "#ffffff",
                },
              },
            },
            // 地图区域的样式设置
            itemStyle: {
              borderColor: "#ffffff",
              borderWidth: 1,
              areaColor: "#D8E5FC",
              shadowColor: "RGBA(167, 199, 255, 0.2)",
              shadowOffsetX: -2,
              shadowOffsetY: 2,
              shadowBlur: 10,
              // 鼠标放上去高亮的样式
              emphasis: {
                areaColor: "#A7C7FF",
                borderWidth: 0,
              },
            },
          },
          // 水印
          graphic: [
            {
              type: "text",
              left: "10%",
              top: "10%",
              style: {
                text: "中国",
                font: 'bolder 1.5rem "Microsoft YaHei", sans-serif',
                fill: "#616161",
              },
              onclick: () => {
                // 利用函数的作用域，可以直接拿上面的name来用
                const [grahpName, graphJson] = getMap(name);
                var index = option.graphic.findIndex(i => i.style.text === name);
                // 点击元素之后的所有元素全部删除
                option.graphic.length = 1;
                // 很多操作重复了，你可以将公共部分抽离出来
                option.geo.map = mapName;
                echarts.registerMap(grahpName, graphJson);
                charts.setOption(option, true);
              },
            },

          ],
          visualMap: {
            // 是否展示左下角，即是是false，也仅是不显示，不影响数据的映射
            show: true,
            // 上下端文字
            text: ["高", "低"],
            // 最小值和最大值，必须指定
            min: 0,
            max: 1000000,
            // 位置
            left: "10%",
            bottom: "20%",
            // 是否展示滑块
            calculable: true,
            // 指定映射的数据，对应的是option.series，这里根据自己的实际需要进行配置
            seriesIndex: [0],
            // 从下到上的颜色
            inRange: {
              color: ['#00467F', '#A5CC82'],
            },
            //字体颜色
            textStyle: {
              color: "#616161",
              map: "china",
            },
          },
          roam: true,
          series: [
            {
              type: "scatter",
              coordinateSystem: "geo",
              symbol:'pin',
              legendHoverLink: true,
              symbolSize: [44, 43],
              // 这里渲染标志里的内容以及样式
              label: {
                show: true,
                fontSize: '7',
                formatter(value) {
                  return _this.tranNumber(value.data.value[2],1);
                },
                color: "#fff",
              },
              // 标志的样式
              itemStyle: {
                normal: {
                  color: "rgba(255,0,0,.7)",
                  shadowBlur: 2,
                  shadowColor: "#D8BC37",
                },
              },
              // 数据格式，其中name,value是必要的，value的前两个值是数据点的经纬度，其他的数据格式可以自定义
              // 至于如何展示，完全是靠上面的formatter来自己定义的
              // data: [
              //   { name: "西藏", value: [91.23, 29.5, 2333] },
              //   { name: "黑龙江", value: [128.03, 47.01, 1007] },
              // ],
              data: newArr,
              showEffectOn: "render",
              rippleEffect: {
                brushType: "stroke",
              },
              hoverAnimation: true,
              zlevel: 1,
            }
          ],

        };
        // 地图注册，第一个参数的名字必须和option.geo.map一致
        //echarts.registerMap("china",zhongguo)

        //charts.setOption(option);
        // 不传name默认会返回中国地图
        const [mapName, mapJson] = getMap();
        option.geo.map = mapName;
        // 地图注册，第一个参数的名字必须和option.geo.map一致
        charts.showLoading();
        echarts.registerMap(mapName, mapJson);

        charts.setOption(option);
        charts.hideLoading()
        // 在容器大小发生改变时改变图表尺寸
        window.onresize = function() {
          charts.resize()
        }
        // 防止graph里频繁添加click事件，在添加click事件之前先全部清空掉。
        charts.off();
        charts.on("click", ({name}) => {
          // 如果option.graphic里已经有了城市名称，则不进行任何操作，防止频繁点击
          const index = option.graphic.findIndex(i => i.style.text === name);
          if (!name || index !== -1) return
          const [mapName, mapJson] = getMap(name);

          option.geo.zoom = 0.8;
          option.geo.map = mapName;
          if(mapName === 'china'){
            // var oindex = option.graphic.findIndex(i => i.style.text === name);
            // 点击元素之后的所有元素全部删除
            //option.graphic.splice(oindex);
            var len = option.graphic.length;
            option.graphic.length = len -1;
            const [grahpName, graphJson] = getMap(name);
            option.geo.map = mapName;
            echarts.registerMap(grahpName, graphJson);
            charts.setOption(option, true);
            console.log(len,'hahaha');
            return
          }
          // 为了重新定位，这里使用了length
          const idx = option.graphic.length + 1;
          option.graphic.push({
            type: "text",
            left: `${idx * 10}%`,
            top: "10%",
            style: {
              text: name,
              font: 'bolder 1.5rem "Microsoft YaHei", sans-serif',
              fill: "#616161",
            },
            onclick: () => {
              // 利用函数的作用域，可以直接拿上面的name来用
              const [grahpName, graphJson] = getMap(name);
              var index = option.graphic.findIndex(i => i.style.text === name);
              // 点击元素之后的所有元素全部删除
              option.graphic.splice(index + 1);
              // 很多操作重复了，你可以将公共部分抽离出来
              option.geo.map = mapName;
              echarts.registerMap(grahpName, graphJson);
              charts.setOption(option, true);
            },
          });
          echarts.registerMap(mapName, mapJson);
          charts.setOption(option, true);
        });
      }
    },

  };
</script>
<style lang="scss" scoped>

  .dashboard {
    &-container {
      width: 100%;
      height: 100%;
    }
  }
</style>
