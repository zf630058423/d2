let option = {
    color: [  '#006EFF','#F9C14A','#07CBAF'],
    tooltip: {
        trigger: 'item'
    },
    legend: {
        // right: 0,
        top: 'bottom',
        orient: 'horizontal',//'vertical',
        icon: "circle",
        align: 'left',
        selectedMode: false
    },
    series: [
        {
            name: '',
            type: 'pie',
            radius: ['55%', '80%'],
            avoidLabelOverlap: false,
            label: {
                show: false,
                position: 'center',
                fontSize: 24,
                formatter: '{b} \n {d}%'
            },
            emphasis: {
                label: {
                  show: true,
                  fontWeight: 'bold'
                }
              },
            data: []
        }
    ]
};

export default option