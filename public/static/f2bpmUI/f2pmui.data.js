
/**
 * 扩展的公共方法，在vue文件、js脚本文本编辑是可调用myData里面的方法
 * author: zhangfeng
 * updateTime: 2023.5.6
 */
myData = {
  getData: getFnCurrentData,   //获取单个控件data值，以前是myvm.data[''];
  setData: setFnCurrentData,  //设置单个控件data值，以前是myvm.data['']='123';
  setArrData: setFnArrCurrentData, //给多个字段赋值
  setTempData: setFunTempData, //给多个字段清空值
  getFieldsDef: getFnCurrentFieldsDef, //获取单个控件属性，以前是myvm.fieldsDefs['']._isReadOnly
  setFieldsDef: setFnCurrentFieldsDef,  //获取单个控件属性，以前是myvm.fieldsDefs['']._isReadOnly = false 现在： myData.setFieldsDef('字段','_isReadOnly',value)
  setSameFieldsDefs: fnSameTypeFieldsDef,  //相同类型的赋值 多个
  setDiffFieldsDefs: fnDiffTypeFieldsDef,  //不同类型的赋值  多个不同
  getById: fnGetById, //获取当前控件 以前：document.getElementById('')  现在: myData.setById('Id')
  setById: fnSetById,  //设置当前控件 以前：document.getElementById('').style.display = 'block',  现在： myData.setById('Id','block')
  getSum: fnGetSum,  //求和
  getToFixed: fnNumberToFiexd,   //数字和千分位计算后默认保留两位小数
  firstToUpper: fnFirstToUpper,   //首字母大写
  randomRange: fnRandomRange,
  progressData: [],  //存放消息框的内容
  fnTimer: null,  //定时器
  themeValue: 'solarized',   //js脚本默认主题
  setTimeout: fnSetTimeout,  //无参数
  setParamTimeout: overrideSetTimeout(setTimeout), //setTimeout传参数
  getTenantId: fnTenantId,
  getHint: fnHint,
  getAddNum: fnNumAdd,  //加法运算，避免数据相加小数点后产生多位数和计算精度损失。
  getSubNum: fnNumSub,   //减法运算，避免数据相减小数点后产生多位数和计算精度损失。
  getMulNum: fnNumMulti,  //乘法运算，避免数据相乘小数点后产生多位数和计算精度损失。
  getDivNum: fnNumDiv,   //除法运算，避免数据相除小数点后产生多位数和计算精度损失。
  getTextWidth: fnGetTextWidth,  //获取当前文字的宽度
  getDayByDate: fnCalculatByDate,  //根据日期计算当前天数
  getCopyAmout: fnCopyAmount,  //千分符复制时去掉逗号
  getCompareCurDate: fnCompareCurDate, //比较选择的日期是否大于当前时间
  getCompareExceedDate: fnCompareExceedDate,  //比较两个日期不能大于多少月
  getList: fnGetList
}

//获取单独的控件值
function getFnCurrentData(name) {
  return myvm.data[name];
}

//给单独的控件设置值
function setFnCurrentData(name, value) {
  myvm.data[name] = value;
}

/**
 * 给多个字段赋值
 * @param {*} arr 需要赋值的字段和值
 * @param {*} tenderDocument 表名
 */
function setFnArrCurrentData(arr, tenderDocument) {
  if (arr && arr.length > 0) {
    arr.forEach(item => {
      if (item.value) {
        myvm.data[`${tenderDocument}.${item.name}`] = item.value;
      }
    })
  }
}

/**
 * 给多个字段清空值
 * @param {*} arr 需要清空的字段数组
 * @param {*} tenderDocument 
 */
function setFunTempData(arr, tenderDocument) {
  if (arr.length > 0) {
    arr.forEach(name => {
      myvm.data[`${tenderDocument}.${name}`] = '';
    })
  }
}

//获取单独的控件属性
function getFnCurrentFieldsDef(name, atrrName) {
  return myvm.fieldsDef[name][atrrName];
}

//给单独的控件属性设置值
function setFnCurrentFieldsDef(name, attrName, newAttr) {
  myvm.fieldsDef[name][attrName] = newAttr;
}

/**
 * 相同类型的赋值
 * @param {*} arr 字段数组 arr = ['','',...]
 * @param {*} tenderDocument 字段名称，如： TenderDocumentReview
 * @param {*} attrName 属性名 如： _isShowPower、_isReadOnly、_isRequired
 * @param {*} status 设置的当前的状态  true or false 
 */
function fnSameTypeFieldsDef(arr, tenderDocument, attrName, status) {
  arr.forEach(item => {
    myvm.fieldsDef[`${tenderDocument}.${item}`][attrName] = status;
  })
}

/**
 * 不同类型的赋值 多个赋值 myData.setDiffFieldsDefs(arr,'TenderDocumentReview');
 * @param {*} arr 
 * [
 * {name:'IsMultipleIots',_isShowPower:false,_isReadOnley:false},
 * {name:'IsInvestAndInvest',_isRequired:true}
 * ] name是要设置的字段 _isShowPower是要设置的值
 * 备注： 包含myvm.fieldsDef下面所有属性都可以设置改变值
 * @param {*} tenderDocument 字段一级名称，如： TenderDocumentReview
 */
function fnDiffTypeFieldsDef(arr, tenderDocument) {
  arr.forEach(item => {
    let propertyArray = Object.keys(myvm.fieldsDef[`${tenderDocument}.${item.name}`]);
    let key = propertyArray.filter(n => item.hasOwnProperty(n)).join(',');
    if (key.includes(",")) {
      let keyArray = key.split(",");
      keyArray.forEach(k => {
        myvm.fieldsDef[`${tenderDocument}.${item.name}`][k] = item[k];
      })
    } else {
      myvm.fieldsDef[`${tenderDocument}.${item.name}`][key] = item[key];
    }
  })
}

/**
 * 通过id获取
 * @param {} Id 控件Id
 * @returns 
 */
function fnGetById(Id) {
  return document.getElementById(Id);
}

/**
 * 
 * @param {} Id 元素的Id
 * @param {*} disValue 值，显示还是隐藏 block none inline-block
 * @returns 
 */
function fnSetById(Id, disValue) {
  return document.getElementById(Id).style.display = disValue;
}

/**
 * 求和
 * @param {*} arr [1,2,3,4,5]
 * @returns 
 */
function fnGetSum(arr) {
  return arr ? arr.reduce((preVal, curVal) => { return preVal + curVal }, 0) : 0;
}

/**
 * 首字母大写
 * @param {*} str 
 * @returns 
 */
function fnFirstToUpper(str) {
  const characters = [...str];
  characters[0] = characters[0].toUpperCase();
  return characters.join("");
}

/**
 * 数字、千分位默认保留2位小数，最后一位进行四舍五入
 * @param {*} str 传入的数字
 * @param {*} num 保留的位数
 * @returns 
 */
function fnNumberToFiexd(str, num = 2) {
  let arr = [];
  let newStr = '';
  if (String(str).includes(",")) {
    arr = (str && str.includes(".")) ? str.split(".") : [];
    let regStr = (arr.length > 0 && arr[1]) ? `0.${arr[1]}` : '0';
    if (regStr.includes(".")) {
      let newNum = Number(regStr).toFixed(num);
      newStr = `${arr[0]}.${newNum.split(".")[1]}`;
    } else {
      let curNum = '';
      for (let i = 0; i < num; i++) {
        curNum += '0';
      }
      newStr = `${str}.${curNum}`;
    }
  } else {
    newStr = Number(str).toFixed(num);
  }
  return newStr;
}

/**
 * 随机生成min到max的整数
 * @param {*} min 
 * @param {*} max 
 * @returns 
 */
function fnRandomRange(min, max) { // min最小值，max最大值
  return Math.floor(Math.random() * (max - min)) + min;
}

/**
 * 定时器，用定时器之前先清除，避免造成全局污染
 * @param {*} callback 要执行的方法
 * @param {*} timer 时间
 * 用法如： myData.setTimeout(() => { console.log("延长3秒钟执行"); }, 3000)
 */
function fnSetTimeout(callback, timer) {
  if (myData.fnTimer) {
    clearTimeout(myData.fnTimer);
  }
  myData.fnTimer = setTimeout(() => {
    callback();
  }, timer);
}

/**
 * setTimeout带参数
 * @param {*} fn setTimeout函授 可以传参数
 * @returns 
 * 用法如：
 * myData.setTimeout((a,b) => {
 *   console.log(a+b);
 * },3000,1,3)
 */
function overrideSetTimeout(fn) {
  return function (callback, delay, params) {
    let args = Array.prototype.slice.call(arguments, 2);
    let _callback = function () {
      callback.apply(null, args);
    }
    fn(_callback, delay);
  }
}

/**
 * 获取tenantId
 * @returns 
 */
function fnTenantId() {
  return myvm.$store.state.user.author.tenantId;
}

function fnHint(cm) {
  var cur = cm.getCursor();
  var token = cm.getTokenAt(cur);
  var start = token.start;
  var end = token.end;
  var line = cm.getLine(cur.line);
  var before = line.slice(0, start);
  var after = line.slice(end);
  var word = line.slice(start, end);

  // 根据当前光标位置和文本内容，提供提示
  if (before.endsWith('console.')) {
    return {
      list: ['log', 'warn', 'error'],
      from: CodeMirror.Pos(cur.line, start - 8),
      to: CodeMirror.Pos(cur.line, end)
    };
  }
}

/**
 * 加法运算，避免数据相加小数点后产生多位数和计算精度损失。
 * @param {*} num1 
 * @param {*} num2 
 * @returns 
 */
function fnNumAdd(num1, num2) {
  let r1, r2, m;
  try {
    r1 = num1.toString().split('.')[1].length;
  } catch (e) {
    r1 = 0;
  }
  try {
    r2 = num2.toString().split(".")[1].length;
  } catch (e) {
    r2 = 0;
  }
  m = Math.pow(10, Math.max(r1, r2));
  return Math.round(num1 * m + num2 * m) / m;
}

/**
 * 减法运算，避免数据相减小数点后产生多位数和计算精度损失。
 * @param {*} num1 
 * @param {*} num2 
 * @returns 
 */
function fnNumSub(num1, num2) {
  let baseNum, baseNum1, baseNum2;
  let precision;// 精度
  try {
    baseNum1 = num1.toString().split(".")[1].length;
  } catch (e) {
    baseNum1 = 0;
  }
  try {
    baseNum2 = num2.toString().split(".")[1].length;
  } catch (e) {
    baseNum2 = 0;
  }
  baseNum = Math.pow(10, Math.max(baseNum1, baseNum2));
  precision = (baseNum1 >= baseNum2) ? baseNum1 : baseNum2;
  return ((num1 * baseNum - num2 * baseNum) / baseNum).toFixed(precision);
}

/**
 * 乘法运算，避免数据相乘小数点后产生多位数和计算精度损失。
 * @param {*} num1 
 * @param {*} num2 
 * @returns 
 */
function fnNumMulti(num1, num2) {
  let baseNum = 0;
  try {
    baseNum += num1.toString().split(".")[1].length;
  } catch (e) {
  }
  try {
    baseNum += num2.toString().split(".")[1].length;
  } catch (e) {
  }
  return Number(num1.toString().replace(".", "")) * Number(num2.toString().replace(".", "")) / Math.pow(10, baseNum);
}

/**
 * 除法运算，避免数据相除小数点后产生多位数和计算精度损失。
 * @param {*} num1 
 * @param {*} num2 
 * @returns 
 */
function fnNumDiv(num1, num2) {
  let baseNum1 = 0, baseNum2 = 0;
  let baseNum3, baseNum4;
  try {
    baseNum1 = num1.toString().split(".")[1].length;
  } catch (e) {
    baseNum1 = 0;
  }
  try {
    baseNum2 = num2.toString().split(".")[1].length;
  } catch (e) {
    baseNum2 = 0;
  }
  //with (Math) {
  baseNum3 = Number(num1.toString().replace(".", ""));
  baseNum4 = Number(num2.toString().replace(".", ""));
  return (baseNum3 / baseNum4) * Math.pow(10, baseNum2 - baseNum1);
  //}
}

/**
 * 获取当前文字的宽度
 * @param {*} text 
 * @param {*} fontSize 
 * @returns 
 */
function fnGetTextWidth(text, fontSize) {
  // 创建临时元素
  const _span = document.createElement('span')
  // 放入文本
  _span.innerText = text;
  // 设置文字大小
  _span.style.fontSize = fontSize + 'px';
  // span元素转块级
  _span.style.position = 'absolute';
  // span放入body中
  document.body.appendChild(_span)
  // 获取span的宽度
  let width = _span.offsetWidth;
  // 从body中删除该span
  document.body.removeChild(_span)
  // 返回span宽度
  return width
}

/**
 * 计算两个日期的相差的天数
 * @param {*} startDate 
 * @param {*} endDate 
 * @returns 
 */
function fnCalculatByDate(startDate, endDate) {
  let startDateTime = startDate ? new Date(startDate) : 0;
  let endDateTime = endDate ? new Date(endDate) : 0;
  let startTime = startDateTime ? startDateTime.getTime() : 0;
  let endTime = endDateTime ? endDateTime.getTime() : 0;
  let Difference_In_Time = endTime - startTime;
  let Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
  return Difference_In_Days;
  // console.log("日期： <br>" + date1 + "<br>和<br>" + date2 + "<br>相差的天数为：" + Difference_In_Days);
}

/**
 * 千分符复制时去掉逗号
 * @param {*} value 
 */
function fnCopyAmount(value) {
  let curVal = '';
  if (value && typeof (value) === 'string' && value.includes(",")) {
    curVal = Number(value.replace(/[,]/g, ""));
  }
  return curVal;
}

/**
 * 传过来的时间  如果大于今天的时间返回1 小于今天时间-1 等于今天的时间0
 * @param {*} dateTime 
 */
function fnCompareCurDate(dateTime) {
  let date = new Date();
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();
  let h = date.getHours();
  let m = date.getMinutes();
  let s = date.getSeconds();
  let curDate = `${year}-${month}-${day} ${h}:${m}:${s}`;
  console.log("当前时间：", curDate);
  let curDateTime = new Date(curDate).valueOf();
  let dTime = new Date(dateTime).valueOf();
  if (curDateTime < dTime) {
    return 1;
  } else if (curDateTime == dTime) {
    return 0;
  } else {
    return -1;
  }
}

/**
 * 比较两个日期不能大于多少月，即结束日期(endDate)不能大于开始日期(beginDate)的month月
 * @param {*} beginDate 开始日期
 * @param {*} endDate 结束日期
 * @param {*} month 月份
 * @returns 
 */
function fnCompareExceedDate(beginDate, endDate, month) {
  if (beginDate && endDate) {
    let arr1 = beginDate.split('-');
    let arr2 = endDate.split('-');
    arr1[1] = parseInt(arr1[1]);
    arr1[2] = parseInt(arr1[2]);
    arr2[1] = parseInt(arr2[1]);
    arr2[2] = parseInt(arr2[2]);
    let flag = true;
    if (arr1[0] == arr2[0]) {//同年
      if (arr2[1] - arr1[1] > month) { //月间隔超过3个月
        flag = false;
      } else if (arr2[1] - arr1[1] == month) { //月相隔3个月，比较日
        if (arr2[2] > arr1[2]) { //结束日期的日大于开始日期的日
          flag = false;
        }
      }
    } else { //不同年
      if (arr2[0] - arr1[0] > 1) {
        flag = false;
      } else if (arr2[0] - arr1[0] == 1) {
        if (arr1[1] < 10) { //开始年的月份小于10时，不需要跨年
          flag = false;
        } else if (arr1[1] + month - arr2[1] < 12) { //月相隔大于3个月
          flag = false;
        } else if (arr1[1] + month - arr2[1] == 12) { //月相隔3个月，比较日
          if (arr2[2] > arr1[2]) { //结束日期的日大于开始日期的日
            flag = false;
          }
        }
      }
    }
    if (!flag) {
      console.log(`时间跨度不得超过${month}个月！`);
      return false;
    }
    return true;
  }
}



/**
 * 
 */
function fnGetList() {
  return [];
}

