export default {

  fnPercent(arr, data) {
    return (arr && arr.length > 0) ? arr.map(item => ({
      ...item,
      percent: data[item.id] ? data[item.id] : '0',
    })) : [];
  },

  fnOption(obj) {
    const { type, title, data, isShowLegend, isShowToolBox, labelHeight } = obj;
    let sData = [];

    //非设计类项目数量转化率
    let searieData = [
      { value: 100, name: '营销立项', id: 'yxlx', percent: '' },
      { value: 83.5, name: '标前评审', id: 'bqps', percent: '' },
      { value: 67, name: '投标文件评审', id: 'tbwjps', percent: '' },
      { value: 50.5, name: '开标结果', id: 'kbjg', percent: '' },
      { value: 34, name: '施工立项', id: 'sglx', percent: '' },
      { value: 17, name: '建安合同', id: 'jaht', percent: '' },
    ]

    //设计类项目数量转化率
    let numberDesignData = [
      { value: 100, name: '营销立项', id: 'yxlx', percent: '' },
      { value: 80, name: '资格预审文件', id: 'zgyswjps', percent: '' },
      { value: 60, name: '开标结果', id: 'kbjg', percent: '' },
      { value: 40, name: '设计施工立项', id: 'sjsglx', percent: '' },
      { value: 20, name: '设计收入合同', id: 'sjsrht', percent: '' },
    ]

    //非设计类项目金额转化率
    let amountTaxNoDesignData = [
      { value: 100, name: '标前评审', id: 'bqps', percent: '' },
      { value: 80, name: '投标文件评审', id: 'tbwjps', percent: '' },
      { value: 60, name: '开标结果', id: 'kbjg', percent: '' },
      { value: 40, name: '施工立项', id: 'sglx', percent: '' },
      { value: 20, name: '建安合同', id: 'jaht', percent: '' },
    ]

    //设计类项目金额转化率
    let amountTaxDesignData = [
      { value: 100, name: '资格预审文件', id: 'zgyswjps', percent: '' },
      { value: 75, name: '开标结果', id: 'kbjg', percent: '' },
      { value: 50, name: '设计施工立项', id: 'sjsglx', percent: '' },
      { value: 25, name: '设计收入合同', id: 'sjsrht', percent: '' },
    ];

    let typeData = {
      1: this.fnPercent(searieData, data),
      2: this.fnPercent(numberDesignData, data),
      3: this.fnPercent(amountTaxNoDesignData, data),
      4: this.fnPercent(amountTaxDesignData, data)
    }
    sData = typeData[type];

    return {
      title: {
        text: title || '',
        show: true,
        subtext: '',
        textAlign: 'left',
        left: '30%',
        top: '0px',
      },
      tooltip: {
        trigger: 'item',
        formatter: function (params, ticket, callback) {
          const content = `<div>
                            <span style="font-weight: bold;">${params.data.name}</span>
                            <br/>
                            <span>转化率：<span style="color:red;">${params.data.percent}</span></span>
                          </div>`;
          return content;
        }
      },
      toolbox: {
        show: isShowToolBox || false,
        top: '0px',
        feature: {
          dataView: { readOnly: false },
          restore: {},
          saveAsImage: {}
        }
      },
      legend: {
        show: isShowLegend || false,
        top: `${isShowLegend ? (sData.length < 5) ? '40px' : '32px' : '0px'}`,
        bottom: '10px',
        data: sData.map(item => item.name)
      },
      calculable: true,
      series: [
        {
          name: title || '',
          type: 'funnel',
          left: '10%',
          top: `${isShowLegend ? 90 : 50}`,
          bottom: 60,
          width: '90%',
          min: 0,
          max: 100,
          minSize: '20%',              //每一块的最小宽度
          maxSize: '90%',               //每一块的最大快递   一次去除掉尖角
          sort: 'descending',
          gap: 0,                //每一块之间的间隔
          label: {            //设置每一块的名字是显示在图里面还是外面
            show: true,
            position: 'inside',
            formatter: function (params, ticket) {
              return '{title|' + params.data.name + '}\n{percent|转化率：' + params.data.percent + '}';
            },
            rich: {
              title: {
                color: '#333',
                align: 'center',
                fontSize: 15,
                fontWeight: 500
              },
              percent: {
                color: '#333',
                fontSize: 12,
                lineHeight: 20
              }
            }
          },
          labelLine: {
            length: 100,             //设置每一块的名字前面的线的长度
            lineStyle: {
              width: 1,         //设置每一块的名字前面的线的宽度
              type: 'solid'    //设置每一块的名字前面的线的类型
            }
          },
          itemStyle: {
            normal: {
              height: labelHeight ? labelHeight : 70,
              borderColor: '#fff',        //每一块的边框颜色
              borderWidth: 0,             //每一块边框的宽度
              shadowBlur: 0,             //整个外面的阴影厚度
              shadowOffsetX: 0,
              shadowOffsetY: 0,          //每一块的x轴的阴影
              shadowColor: 'rgba(0, 0, 0, 0.5)',    //阴影颜色
              color: function (params) {
                //自定义颜色
                const colorList = [
                  "#33CCFF",
                  "#CC66CC",
                  "#99CC66",
                  "#FFCC66",
                  "#FFC635",
                  "#31DC72",
                ];
                return colorList[params.dataIndex];
              }
            },
            borderWidth: 0,
          },
          emphasis: {
            label: {
              fontSize: 16
            }
          },
          data: sData
        }
      ]
    }
  }
}