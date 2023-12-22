// 千分位
function qianfenWeiFormat(value, row, index) {
    if(value === 0){
      return '0.00'
    }else{
      var data = Object.toQianfenWeiStr(value);
      return data;
    }
}

// 百分比
function percentFormat(value, row, index) {
    if (value === undefined || value === "" || value === null) {
        return "";
    }else if( value == 0 || value == '0' ){
        return "0.00%";
    }

    let num = (parseFloat(value) * 1000 / 10);
    if ((num + "").indexOf(".") > -1) {
        //保留两位小数
        num = Object.toDecimal(num, 2);
    }
    return num + '%';
}
// 日期 yymmdd
function dateFormat(value, row, index){
    var data = Object.toJsonDateFormatter(value)
    return data
}
//保留两位小数和千分符 四舍五入
function numberFixed(value, row, index){
    // var data = Object.tofixed(value)
    // return data
  var data = Object.tofixed(value, 2);
  data = Object.toQianfenWeiStr(data);
  return data;
}

//保留两位小数

function numFixed(value, row, index){
    var data = Object.numFixed(value)
    return data
}
// 日期 yymm
function dateFormat2(value, row, index){
  var data = Object.toJsonDateMonthFormatter(value)
  return data
}
