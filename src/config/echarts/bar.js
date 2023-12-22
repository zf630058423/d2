let option = {
  title: {
    text: '',
    subtext: ''
  },
  grid: {
    top: 22,
    left: 40,
    right: 40,
    bottom: 25
  },
  xAxis: {
    data: [],
    axisLabel: {
      // inside: true,
      // color: '#fff'
    },
    axisTick: {
      show: false
    },
    axisLine: {
      show: false
    },
    z: 10
  },
  yAxis: {
    axisLine: {
      show: false
    },
    axisTick: {
      show: false
    },
    axisLabel: {
      color: '#999',
    }
  },
  series: [
    {
      type: 'bar',
      showBackground: false,
      itemStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: '#006EFF' },
          { offset: 0.7, color: '#66CCFF' },
          { offset: 1, color: '#66CCFF' }

        ])
      },
      emphasis: {
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#66CCFF' },
            { offset: 0.7, color: '#006EFF' },
            { offset: 1, color: '#006EFF' }
          ])
        }
      },
      data: []
    }
  ]
};

export default option;