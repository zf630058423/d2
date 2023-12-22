const filters = {
  // 立项状态
  filterState(value) {
    const arr = {
      '1': '已中标',
      '2': '已施工立项',
      '3': '跟进中',
      '4': '停止跟进',
      '5': '未中标',
      '6': '已签合同'
    };
    return arr[value]
  },
  // 办理类型
  filtertoHandleTheType(value) {
    const arr = {
      '1': '新办',
      '2': '续签'
    };
    return arr[value]
  },
  // 时间转换
  formatDates(datetime) {
    let date = new Date(datetime) //datetime时间戳为13位毫秒级别,如为10位需乘1000
    let month = ('0' + (date.getMonth() + 1)).slice(-2);	// getMonth是从1-11,所以需要加1
    let sdate = ('0' + date.getDate()).slice(-2);	// -2表示从倒数第二个元素开始截取
    let h = ('0' + date.getHours()).slice(-2) ;
    let m = ('0' + date.getMinutes()).slice(-2);
    let s = ('0' + date.getSeconds()).slice(-2) ;
    let thatDate = date.getFullYear() + '-' + month + '-' + sdate + ' '+h+':'+m+':'+s
    return thatDate
  },
  // 设置默认值
  formatValue(value){
    if(value === '' || value === null || value === undefined || value === 'null' || value === 'undefined'){
      return '0'
    }
    return value
  },
  // 设置默认值
  formatValue2(value){
    if(value === '' || value === null || value === undefined || value === 'null' || value === 'undefined'){
      return ''
    }
    return value
  },
  // 千分位
  qianfenWeiFormat(value, row, index) {
    if(value){
      value = Object.tofixed(value, 2);
      var data = Object.toQianfenWeiStr(value);
      return data;
    }else {
      return 0;
    }
  },
  // 百分比
  baifenbiFormat(value) {
    if (value == undefined || value == "") {
      return "";
    }
    let num = (parseFloat(value) * 1000 / 10);
    if ((num + "").indexOf(".") > -1) {
      //保留两位小数
      num = Object.toDecimal(num, 2);
    }
    return num + '%';
  },
  // 时间转换
  formatDay(datetime) {
    if(datetime){
      let date = new Date(datetime); //datetime时间戳为13位毫秒级别,如为10位需乘1000
      let month = ('0' + (date.getMonth() + 1)).slice(-2);	// getMonth是从1-11,所以需要加1
      let sdate = ('0' + date.getDate()).slice(-2);	// -2表示从倒数第二个元素开始截取
      let thatDate = date.getFullYear() + '-' + month + '-' + sdate;
      return thatDate
    }else {
      return '--'
    }
  },
  //保留两位小数和千分符 四舍五入
  numberFixed(value){
    if(value){
      var data = Object.numberFixed(value);
      return data;
    }else {
      return '';
    }
  },
  // 状态
  userStateType(value) {
    const arr = {
      1: '启用',
      0: '禁用'
    };
    return arr[value]
  },
  // 变更类型
  changeTypeType(value) {
    const arr = {
      1: '客户',
      2: '结算方式',
      3: '金额',
      4: '代付款单位',
      5: '其他',
    };
    return arr[value]
  },
  // 单据状态
  procInstStateType(value) {
    const arr = {
      '0':'拟稿',
      '1': '草稿',
      '2': '审核中',
      '3': '已完成',
      '99': '已作废'
    };
    return arr[value]
  },
  // 状态
  isAbleFilter(value) {
    const arr = {
      1: false,
      0: true
    };
    return arr[value]
  },
  // 纳税信用等级
  CreditRatingFilter(value) {
    const arr = {
      '0':'未评级',
      '1': 'A',
      '2': 'B',
      '3': 'C',
      '4': 'D',
      '5': 'M',
    };
    return arr[value]
  },
  // 经营场所属性
  BusinessPremisesFilter(value) {
    const arr = {
      '1': '自有',
      '2': '租赁'
    };
    return arr[value]
  },
  // 供应商性质
  SupplierNatureFilter(value) {
    const arr = {
      '0': '外部',
      '1': '内部'
    };
    return arr[value]
  },
  // 纳税信用等级
  OwnershipFilter(value) {
    const arr = {
      '1': '上市企业',
      '2': '国有企业',
      '3': '私营企业',
      '4': '中外合资',
      '5': '外商独资',
      '6': '其他',
    };
    return arr[value]
  },
  // 注册状态
  RegStateFilter(value) {
    const arr = {
      '0': '未注册',
      '1': '已注册'
    };
    return arr[value]
  },
  // 收支项目类型
  subjCodeFilter(value) {
    const arr = {
      '22': '资产处理收益',
      '5': '罚没利得',
      '13': '捐献利得',
      '99': '政府补助',
      '4': '税费返还',
      '10': '债务重组利得',
      '14': '利息收入(一般存款)',
      '19': '利息收入(理财收益)',
      '55': '工会经费',
    };
    return arr[value]
  },
  // 发票业务类型
  invoiceBizTypeFilter(value) {
    const arr = {
      '1': '合同材料收票',
      '2': '无合同材料收票',
      '3': '劳务分包收票',
      '4': '专业分包收票',
      '5': '租赁收票',
      '6': '其他收票',
      '7': '其他合同收票'
    };
    return arr[value]
  },
};
export default (Vue) => {
  Object.keys(filters).forEach(key => {
    Vue.filter(key, filters[key])
  })
}
