/* 函数节流 */
function throttle(fn, interval) {
  let enterTime = 0; // 触发的时间
  const gapTime = interval || 300; // 间隔时间，如果interval不传，则默认300ms
  return function () {
    const context = this;
    const backTime = new Date(); // 第一次函数return即触发的时间
    if (backTime - enterTime > gapTime) {
      fn.call(context, arguments);
      enterTime = backTime; // 赋值给第一次触发的时间，这样就保存了第二次触发的时间
    }
  };
}

/* 函数防抖 */
function debounce(fn, interval) {
  let timer;
  const gapTime = interval || 500; // 间隔时间，如果interval不传，则默认1000ms
  return function () {
    clearTimeout(timer);
    const context = this;
    const args = arguments; // 保存此处的arguments，因为setTimeout是全局的，arguments不是防抖函数需要的。
    timer = setTimeout(function () {
      fn.call(context, args);
    }, gapTime);
  };
}

// 对象浅拷贝实现深拷贝(包含多级)
function deepCopy(dest, obj) {
  const o = dest;
  for (const k in obj) {
    o[k] = obj[k];
    if (typeof obj[k] === 'object') {
      obj[k] = obj[k].constructor ? [] : {};
      deepCopy(o[k], obj[k]);
    } else {
      o[k] = obj[k];
    }
  }
  return o;
}

/**
 * 表头标题的宽度设置
 * @param {*} isDefault
 * @param {*} title
 * @returns
 */
function fnTiteWidth(isDefault, title, len = 0) {
  let chinaLen = 0;
  if (isDefault) {
    return 35;
  } else {
    const reg = /[\u4E00-\u9FA5]/g;
    if (title.match(reg)) {
        chinaLen = title.match(reg).length;  //中文的个数 汉字的个数
      }
    return chinaLen * 16 + len || 120;
  }

}


/**
 * 保留小数
 * @param {*} number 数字
 * @param {*} n 保留位数
 * @returns
 */
function getFixed(number, n) {

  // 如果 digits 参数太小或太大。0 到 20（包括）之间的值不会引起 RangeError。实现环境（implementations）也可以支持更大或更小的值
  if (n < 0) {
    n = 0;
  }
  if (n > 20) {
    console.log("抱歉！小数位不能超过20位");
    throw new RangeError('tofixed() digits argument must be between 0 and 20')
  }
  // 如果该方法在一个非Number类型的对象上调用
  if (isNaN(number)) {
    throw new TypeError(number + '.tofixed() is not a function')
  }
  if (number == 'Infinity' || number == '-Infinity') {
    number = '0';
  }
  number = Object.tofixed(number,n);
  // 如果数值大于 1e+21，该方法会简单调用 Number.prototype.toString()并返回一个指数记数法格式的字符串
  if (number >= Math.pow(10, 21)) {
    return number.toString()
  }
  // 如果忽略该参数，则默认为 0，进行四舍五入，不包括小数部分
  if (n === undefined || n === 0) {
    // return Math.round(number).toString()
    return number.toString();
  }

  let result = number ? number.toString() : '0';
  const arr = result.split('.')
  // 整数情况
  if (arr.length < 2) {
    result += '.'
    for (let i = 0; i < n; i++) {
      result += '0'
    }
    return result
  }

  // 小数情况（原位数 <= 需求位数）
  const integer = arr[0]
  let decimal = arr[1]
  if (decimal.length === n) {
    return result
  }
  if (decimal.length < n) {
    for (let i = 0; i < n - decimal.length; i++) {
      result += '0'
    }
    return integer.length === 0 ? 0 + result : result;
  }
  // 小数情况（原位数 > 需求位数，需四舍五入）
  result = integer.length === 0 ? 0 : integer + '.' + decimal.substring(0, n)
  const last = decimal.substring(n, n + 1)
  if (parseInt(last, 10) >= 5) {

    // const multiple = Math.pow(10, n);
    // if (Number(result) > 0) {
    //   // result = ((Math.round(parseFloat(result) * multiple) + 1) / multiple).toString() // 使用 Math.round 防止结果无限小数
    //   result = ((parseFloat(parseFloat(result) * multiple) + 1) / multiple).toString() // 使用 Math.round 防止结果无限小数
    // } else {
    //   // 判断result为负数的情况
    //   // result = ((Math.round(parseFloat(result) * multiple) - 1) / multiple).toString() // 使用 Math.round 防止结果无限小数
    //   result = ((parseFloat(parseFloat(result) * multiple) - 1) / multiple).toString() // 使用 Math.round 防止结果无限小数
    // }
    // 0 补足小数
    if (result.split('.').length <= 1) {
      result += ".";
      decimal = "";
    } else {
      decimal = result.split('.')[1]
    }

    if (decimal.length < n) {
      for (let i = 0; i < n - decimal.length; i++) {
        result += '0'
      }
      return result
    }
  }
  return result
}

/**
 * 保留小数四舍五入
 * @param {*} number 数字
 * @param {*} n 保留位数
 * @returns
 */
function getTofixed(number, n) {
  // 如果 digits 参数太小或太大。0 到 20（包括）之间的值不会引起 RangeError。实现环境（implementations）也可以支持更大或更小的值
  if (n < 0) {
    n = 0;
  }
  if (n > 20) {
    console.log("抱歉！小数位不能超过20位");
    throw new RangeError('tofixed() digits argument must be between 0 and 20')
  }
  // 如果该方法在一个非Number类型的对象上调用
  if (isNaN(number)) {
    throw new TypeError(number + '.tofixed() is not a function')
  }
  if (number == 'Infinity' || number == '-Infinity') {
    number = '0';
  }
  // 如果数值大于 1e+21，该方法会简单调用 Number.prototype.toString()并返回一个指数记数法格式的字符串
  if (number >= Math.pow(10, 21)) {
    return number.toString()
  }
  // 如果忽略该参数，则默认为 0，进行四舍五入，不包括小数部分
  if (n === undefined || n === 0) {
    return Math.round(number).toString()
  }

  let result = number ? number.toString() : '0';
  const arr = result.split('.')
  // 整数情况
  if (arr.length < 2) {
    result += '.'
    for (let i = 0; i < n; i++) {
      result += '0'
    }
    return result
  }

  // 小数情况（原位数 <= 需求位数）
  const integer = arr[0]
  let decimal = arr[1]
  if (decimal.length === n) {
    return result
  }
  if (decimal.length < n) {
    for (let i = 0; i < n - decimal.length; i++) {
      result += '0'
    }
    return integer.length === 0 ? 0 + result : result;
  }
  // 小数情况（原位数 > 需求位数，需四舍五入）
  result = integer.length === 0 ? 0 : integer + '.' + decimal.substring(0, n)
  const last = decimal.substring(n, n + 1)
  if (parseInt(last, 10) >= 5) {
    const multiple = Math.pow(10, n);
    if (Number(result) > 0) {
      result = ((Math.round(parseFloat(result) * multiple) + 1) / multiple).toString() // 使用 Math.round 防止结果无限小数
    } else {
      // 判断result为负数的情况
      result = ((Math.round(parseFloat(result) * multiple) - 1) / multiple).toString() // 使用 Math.round 防止结果无限小数
    }
    // 0 补足小数
    if (result.split('.').length <= 1) {
      result += ".";
      decimal = "";
    } else {
      decimal = result.split('.')[1]
    }

    if (decimal.length < n) {
      for (let i = 0; i < n - decimal.length; i++) {
        result += '0'
      }
      return result
    }
  }
  return result
}

export default {
  throttle,
  debounce,
  deepCopy,
  fnTiteWidth,
  getFixed,
  getTofixed
};
