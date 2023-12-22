/***Jquery扩展&JavaScript 通用工具类 zibort luo 2014-06-10***/

//使用说明：所有扩展的方法都使用to开头
//1、Object.toXXX   Object为JavaScript自身的Object,每个方法都有中文提示
//2、Date扩展，包括Date的实例对象扩展 如var date=new Date();  Date.toXXXX(),  date.toXXX();
//3、String扩展，包括String实例对象如 var a="aaaa"; a.toXXXX;
//4、Number 数字 扩展，也是toXXX的用法
//5、Function 函数对象 扩展 也是toXXX的用法

/*********************Base*********************/
(function () {
  //闭包环境，防止变量冲突，任何变量在外部不可用
  var _toString = Object.prototype.toString,
    NULL_TYPE = 'Null',
    UNDEFINED_TYPE = 'Undefined',
    BOOLEAN_TYPE = 'Boolean',
    NUMBER_TYPE = 'Number',
    STRING_TYPE = 'String',
    OBJECT_TYPE = 'Object',
    FUNCTION_CLASS = '[object Function]',
    BOOLEAN_CLASS = '[object Boolean]',
    NUMBER_CLASS = '[object Number]',
    STRING_CLASS = '[object String]',
    ARRAY_CLASS = '[object Array]',
    DATE_CLASS = '[object Date]',
    NATIVE_JSON_STRINGIFY_SUPPORT = window.JSON &&
      typeof JSON.stringify === 'function' &&
      JSON.stringify(0) === '0';

  // 一个静态方法表示继承, 目标对象将拥有源对象的所有属性和方法
  Object.extend = function (destination, source) {
    for (var property in source) {
      destination[property] = source[property];   // 利用动态语言的特性, 通过赋值动态添加属性与方法
    }
    return destination;   // 返回扩展后的对象
  };

  Object.extend(Object, {
    // 一个静态方法, 传入一个对象, 返回对象的字符串表示
    toInspect: function (object) {
      try {
        if (object == undefined) return 'undefined'; // 处理undefined情况
        if (object == null) return 'null';     // 处理null情况
        // 如果对象定义了inspect方法, 则调用该方法返回, 否则返回对象的toString()值
        return object.inspect ? object.inspect() : object.toString();
      } catch (e) {
        if (e instanceof RangeError) return '...'; // 处理异常情况
        throw e;
      }
    },
    // 一个静态方法, 传入一个对象, 返回该对象中所有的属性, 构成数组返回
    toKeys: function (object) {
      var keys = [];
      for (var property in object) {
        keys.push(property);
      }     // 将每个属性压入到一个数组中
      return keys;
    },
    // 一个静态方法, 传入一个对象, 返回该对象中所有属性所对应的值, 构成数组返回
    toValues: function (object) {
      var values = [];
      // 将每个属性的值压入到一个数组中
      for (var property in object) values.push(object[property]);
      return values;
    },
    // 一个静态方法, 传入一个对象, 克隆一个新对象并返回
    toClone: function (object) {
      return Object.extend({}, object);
    }

  });

  //判断类型
  function Type(o) {
    switch (o) {
      case null:
        return NULL_TYPE;
      case (void 0):
        return UNDEFINED_TYPE;
    }
    var type = typeof o;
    switch (type) {
      case 'boolean':
        return BOOLEAN_TYPE;
      case 'number':
        return NUMBER_TYPE;
      case 'string':
        return STRING_TYPE;
    }
    return OBJECT_TYPE;
  }

  //克隆数组
  //hasObjcet,数组是否存在对象
  function cloneArray(array, hasObjcet) {
    var newArray = [];
    if (array) {
      if (hasObjcet == true) {
        for (var i = 0, len = array.length; i < len; i++) {
          if (typeof (array[i]) == 'object') {
            newArray.push(Object.toClone(array[i]));
          } else {
            newArray.push(array[i]);
          }
        }
      } else {
        newArray = null;
      }
    }
    return newArray;
  }

  //深度克隆
  function deepClone(obj) {
    var result, oClass = isClass(obj);
    //确定result的类型
    if (oClass === 'Object') {
      result = {};
    } else if (oClass === 'Array') {
      result = [];
    } else {
      return obj;
    }
    for (key in obj) {
      var copy = obj[key];
      if (isClass(copy) == 'Object') {
        result[key] = arguments.callee(copy);//递归调用
      } else if (isClass(copy) == 'Array') {
        result[key] = arguments.callee(copy);
      } else {
        result[key] = obj[key];
      }
    }
    return result;
  }



  //返回传递给他的任意对象的类
  function isClass(o) {
    if (o === null) return 'Null';
    if (o === undefined) return 'Undefined';
    return Object.prototype.toString.call(o).slice(8, -1);
  }

  //是否为对象元素
  function isElement(object) {
    return !!(object && object.nodeType == 1);
  }

  //是否为数组
  function isArray(object) {
    return _toString.call(object) === ARRAY_CLASS;
  }

  var hasNativeIsArray = (typeof Array.isArray == 'function')
    && Array.isArray([]) && !Array.isArray({});

  if (hasNativeIsArray) {
    isArray = Array.isArray;
  }

  //格式化为Html
  function toHTML(object) {
    return object && object.toHTML ? object.toHTML() : String.interpret(object);
  }

  function isHash(object) {
    return object instanceof Hash;
  }

  //隐私字符串，使用指定字符隐藏关键信息，默认是使用*代替，只显示第一个汉字，隐藏其它汉字
  function toSecrecy(str, character) {
    if (str) {
      character = character || '*';
      str = str.replace(/([\u4E00-\u9FA5]{1})([\u4E00-\u9FA5]+)$/, '$1' + character + character + character + character);
    }
    return str;
  }

  //流程处理人姓名隐私
  function toProcSecrecy(str, character) {
    try {
      if (str && $f2bpmProcSecrecy == true) {
        character = character || '*';
        str = str.replace(/([\u4E00-\u9FA5]{1})([\u4E00-\u9FA5]+)$/, '$1' + character + character + character + character);
      }
    } catch (e) {
      return str;
    }
    return str;
  }

  //是否为函数类型
  function isFunction(object) {
    return _toString.call(object) === FUNCTION_CLASS;
  }

  //是否为字符串类型
  function isString(object) {
    return _toString.call(object) === STRING_CLASS;
  }

  //是否为数字类型:true数字，false非数字。null或“”空都认为是数字。undefined不是数字
  function isNumber(value) {
    return !Number.isNaN(Number(value));
  }

  //是否为日期类型
  function isDate(object) {
    return _toString.call(object) === DATE_CLASS;
  }

  //获取当前日期时间
  function getCurrentDateTimeString() {
    var myDate = new Date();
    return myDate.toDateFormat('yyyy-MM-dd HH:mm:ss');
  }
  //获取日期时间毫秒构建字符串
  function getCurrentDateTimeMillisecond() {
    var myDate = new Date();
    return myDate.toDateFormat('yyyyMMddHHmmssS');
  }
  //日期字符串2016-12-12 23:22:3 形式转为日期对象
  function _getDateObjectFromstr(dateString) {
    if (!dateString) return '';
    return new Date(dateString.replace(/-/g, '/'));
  }

  ///获取当前日期
  function getCurrentDateString() {
    var myDate = new Date();
    return myDate.toDateFormat('yyyy-MM-dd');
  }

  //是否为日期2015-1-01 23:59的字符串形式
  function isDateStr(dateStr) {
    if (!isNaN(dateStr) && (typeof dateStr == 'string') && dateStr.length.toString() == 13) return false;
    var r = /^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})/.test(dateStr);
    return r;
  }
  /**
   * [dateAddDays 从某个日期增加n天后的日期]
   * @param  {[string]} dateStr  [日期字符串]
   * @param  {[int]} dayCount [增加的天数]
   * @return {[string]}[增加n天后的日期字符串]
   */
  function dateAddDays(dateStr, dayCount) {
    var tempDate = new Date(dateStr.replace(/-/g, "/"));//把日期字符串转换成日期格式
    var resultDate = new Date((tempDate / 1000 + (86400 * dayCount)) * 1000);//增加n天后的日期
    var resultDateStr = resultDate.getFullYear() + "-" + (resultDate.getMonth() + 1) + "-" + (resultDate.getDate());//将日期转化为字符串格式
    return resultDateStr;
  }

  dateAddDays('2019-03-18', 27); //"2019-4-14"
  function isJavaDateObject(dateObject) {
    if (dateObject.time) {
      return true;
    }
    return false;
  }

  //是否为Undefined
  function isUndefined(object) {
    return typeof object === 'undefined';
  }

  //转换为Json对象
  function toJSON(value) {
    return Str('', { '': value }, []);
  }

  function stringify(object) {
    return JSON.stringify(object);
  }

  function stringToJson(str) {
    return eval('(' + str + ')');
  }

  function inspect(object) {
    try {
      if (typeof object === 'undefined') return 'undefined';
      if (object === null) return 'null';
      return object.inspect ? object.inspect() : String(object);
    } catch (e) {
      if (e instanceof RangeError) return '...';
      throw e;
    }
  }

  function Str(key, holder, stack) {
    var value = holder[key],
      type = typeof value;

    if (Type(value) === OBJECT_TYPE && typeof value.toJSON === 'function') {
      value = value.toJSON(key);
    }

    var _class = _toString.call(value);

    switch (_class) {
      case NUMBER_CLASS:
      case BOOLEAN_CLASS:
      case STRING_CLASS:
        value = value.valueOf();
    }

    switch (value) {
      case null:
        return 'null';
      case true:
        return 'true';
      case false:
        return 'false';
    }

    type = typeof value;
    switch (type) {
      case 'string':
        return value.inspect(true);
      case 'number':
        return isFinite(value) ? String(value) : 'null';
      case 'object':

        for (var i = 0, length = stack.length; i < length; i++) {
          if (stack[i] === value) {
            throw new TypeError();
          }
        }
        stack.push(value);

        var partial = [];
        if (_class === ARRAY_CLASS) {
          for (var i = 0, length = value.length; i < length; i++) {
            var str = Str(i, value, stack);
            partial.push(typeof str === 'undefined' ? 'null' : str);
          }
          partial = '[' + partial.join(',') + ']';
        } else {
          var keys = Object.keys(value);
          for (var i = 0, length = keys.length; i < length; i++) {
            var key = keys[i], str = Str(key, value, stack);
            if (typeof str !== 'undefined') {
              partial.push(key.inspect(true) + ':' + str);
            }
          }
          partial = '{' + partial.join(',') + '}';
        }
        stack.pop();
        return partial;
    }
  }

  //是否 为空，null,undefined
  function isEmpty(object) {
    if (object == null || object == undefined || object == 'null' || object == '') {
      return true;
    }
    return false;
  }

  function getFunctionName(obj) {
    if (typeof obj == 'string') {
      return obj;
    }
    if (typeof obj != 'function' || obj === null) {
      return null;
    } else {
      var funName = obj.toString();
      if (funName.indexOf("[native code]") > -1) {
        return obj;
      }
    }

  }

  //在指定的控件光标处插入字符串
  function insertAtCursor(inputId, myValue) {
    var myField = document.getElementById(inputId);
    //IE support
    if (document.selection) {
      myField.focus();
      sel = document.selection.createRange();
      sel.text = myValue;
      sel.select();
    }
    //MOZILLA/NETSCAPE support
    else if (myField.selectionStart || myField.selectionStart == '0') {
      var startPos = myField.selectionStart;
      var endPos = myField.selectionEnd;
      // save scrollTop before insert www.keleyi.com
      var restoreTop = myField.scrollTop;
      myField.value = myField.value.substring(0, startPos) + myValue + myField.value.substring(endPos, myField.value.length);
      if (restoreTop > 0) {
        myField.scrollTop = restoreTop;
      }
      myField.focus();
      myField.selectionStart = startPos + myValue.length;
      myField.selectionEnd = startPos + myValue.length;
    } else {
      myField.value += myValue;
      myField.focus();
    }
  }

  //字符串替换全部
  //str:字符串
  //s1:要替换的值
  //s2:替换成的新值
  function replaceAll(str, s1, s2, ignoreCase) {
    if ('.' == s1) {
      while (str.indexOf(s1) != -1) {
        str = str.replace(s1, s2);
      }
      return str;
    } else {
      if (!RegExp.prototype.isPrototypeOf(s1)) {
        return str.replace(new RegExp(s1, (ignoreCase ? 'gi' : 'g')), s2);
      } else {
        return str.replace(s1, s2);
      }
    }
  };
  //========数字相关=====
  //转十六进制
  function toColorPart() {
    return this.toPaddedString(2, 16);
  }

  //加1
  function succ() {
    return this + 1;
  }

  //位数，不足左边加0，radix：进制基数，即2二进制，10十进制，8八进制，16进制
  function toPaddedString(length, radix) {
    var string = this.toString(radix || 10);
    return '0'.toCopyTimes(length - string.length) + string;
  }

  //取绝对数
  function abs() {
    return Math.abs(this);
  }

  //四舍五入取整
  function round() {
    return Math.round(this);
  }

  //向上取整
  function ceil() {
    return Math.ceil(this);
  }

  //向下取整
  function floor() {
    return Math.floor(this);
  }

  //========数字相关结束=====

  //========日期Date 开始=====
  var R_ISO8601_STR = /^(\d{4})-?(\d\d)-?(\d\d)(?:T(\d\d)(?::?(\d\d)(?::?(\d\d)(?:\.(\d+))?)?)?(Z|([+-])(\d\d):?(\d\d))?)?$/;

  function toISOString() {
    return this.getUTCFullYear() + '-' +
      (this.getUTCMonth() + 1).toPaddedString(2) + '-' +
      this.getUTCDate().toPaddedString(2) + 'T' +
      this.getUTCHours().toPaddedString(2) + ':' +
      this.getUTCMinutes().toPaddedString(2) + ':' +
      this.getUTCSeconds().toPaddedString(2) + 'Z';
  }

  function toJSON() {
    return this.toISOString();
  }

  //将2019-01-01 21:11:11或2019-01-01 转为date
  function stringToDate(str) {
    str = str.replace(/-/g, '/'); // "2010/08/01";
    var date = new Date(str);
    return date;
  }

  //两个日期相隔多少天
  function getDatePeriodDay(startDate, endDate) {
    return (Math.abs(startDate * 1 - endDate * 1) / 60 / 60 / 1000 / 24).toFloor();
  }

  //获取日期所在月的第一天
  function getFirstDateInMonth(date) {
    if (date == null) date = this;
    return new Date(date.getFullYear(), date.getMonth(), 1);
  }

  //获取日期所在月的最后天
  function getLastDateInMonth(date) {
    if (date == null) date = this;
    return new Date(date.getFullYear(), date.getMonth() + 1, 0);
  }

  //获取日期所在季的第一天
  function getFirstDateInQuarter(date) {
    if (date == null) date = this;
    return new Date(date.getFullYear(), ~~(date.getMonth() / 3) * 3, 1);
  }

  //获取日期所在季的第一天
  function getLastDateInQuarter(date) {
    if (date == null) date = this;
    return new Date(date.getFullYear(), ~~(date.getMonth() / 3) * 3 + 3, 0);
  }

  //是否为闰年
  function isLeapYear() {
    return new Date(this.getFullYear(), 2, 0).getDate() == 29;
  }

  //获取当前月份的天数
  function getDaysInMonth(date) {
    if (date == null) date = this;
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  }

  function dateTimeFormatter(value) {
    return formatDate(value, 'yyyy-MM-dd hh:mm:ss');
  }

  function dateFormatter(value) {
    return formatDate(value, 'yyyy-MM-dd');
  }
  function dateMonthFormatter(value) {
    return formatDate(value, 'yyyy-MM');
  }
  function formatDate(v, dateFormat) {
    try {
      if (v == null || v == '') return '';

      if (Object.toIsDateStr(v) && dateFormat == 'yyyy-MM-dd hh:mm:ss' && v.length > 10) {
        return v;
      } else if (Object.toIsDateStr(v) && dateFormat == 'yyyy-MM-dd' && v.length == 10) {
        return v;
      } else if (Object.toIsDateStr(v)) {
        return new Date(v).toDateFormat(dateFormat);
      }
      if (dateFormat == undefined || typeof dateFormat != 'string') {
        dateFormat = 'yyyy-MM-dd';
      }

      if ((typeof v) == 'number') {
        var o = new Date(v * 1000);
        return o.toDateFormat(dateFormat);
      }
      if ((typeof v) == 'string' && v.indexOf('/Date(') == 0) {
        var date = eval('new ' + eval(v).source);
        return date.toDateFormat(dateFormat);
      }
      if (v instanceof Date) {
        return v.toDateFormat(dateFormat);
      }
      if (v.time) {
        var o = new Date(v.time);
        return o.toDateFormat(dateFormat);
      }
      if (v.getDay()) {
        return v.toDateFormat(dateFormat);
      } else {
        if (v) {
          v = v.replace(/\//g, '-');
          if (v == '1900-01-01 00:00:00') {
            return '--';
          }
          if (v.split(' ')) {
            var myDate = v.split(' ')[0];
          } else {
            var myDate = v;
            var myTime = '';
          }
          myDate = myDate.replace('-0', '-').replace('-0', '-');
          var nowDate = new Date();
          /*TD 7111*/
          if (myDate.split('-')[0] == '1900') {
            return '--';
          }
          if (myDate.split('-')[0] == nowDate.getFullYear()) {//本年度 For td 5858
            return myDate.split('-')[0] + '年' + myDate.split('-')[1] + '月' + myDate.split('-')[2] + '日';

          } else {//非本年度
            return myDate.split('-')[0] + '年' + myDate.split('-')[1] + '月' + myDate.split('-')[2] + '日';
          }
        } else {
          return '--';
        }
      }
    } catch (e) {
      console.info(e);
    }
    return '--';
  };
  function toPinYin(content, isFirstToLower) {
    var v = $.toPinyinByText(content);
    if (isFirstToLower == true) {
      v = v.substr(0, 1).toLowerCase() + v.substr(1);
    }
    return v;
  }
  function toPinYin2(content) {
    var v = $.toPinyinByText(content);
    return v;
  }
  function toPinyinFirst(content) {
    var v = $.toPinyinFirstByText(content);
    return v;
  }
  function getBrowserType() {
    var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
    var isOpera = userAgent.indexOf('Opera') > -1;
    if (isOpera) { //判断是否Opera浏览器
      return 'Opera';
    }
    ;
    if (userAgent.indexOf('Firefox') > -1) { //判断是否Firefox浏览器
      return 'FF';
    }
    ;
    if (userAgent.indexOf('Chrome') > -1) {
      return 'Chrome';
    }
    ;
    if (userAgent.indexOf('Safari') > -1) { //判断是否Safari浏览器
      return 'Safari';
    }
    ;
    if (userAgent.indexOf('compatible') > -1 && userAgent.indexOf('MSIE') > -1 && !isOpera) { //判断是否IE浏览器
      return 'IE';
    }
    ;
    if (userAgent.indexOf('Edge') > -1 && !isOpera) { //判断是否IE浏览器
      return 'IE';
    }
    ;
  }

  //========日期Date 结束=====
  //获取一个Dom元素的绝对坐标
  function getPosition(jqObject) {
    var t = jqObject.offset().left;
    var l = jqObject.offset().top;
    return {
      top: t,
      left: l
    };
  };

  //获取鼠标真实位置
  function getMousePosition(ev) {
    if (!ev) ev = window.event;
    if (ev.pageX || ev.pageY) {
      return { x: ev.pageX, y: ev.pageY };
    }
    return {
      x: ev.clientX + document.documentElement.scrollLeft - document.body.clientLeft,
      y: ev.clientY + document.documentElement.scrollTop - document.body.clientTop
    };
  };

  function showDropMenu(dropMenuId, targetId, offsetX, offsetY) {
    var postion = Object.toGetPosition($('#' + targetId));
    var leftX = postion.left - offsetX;
    var topX = postion.top + offsetY;

    $('#' + dropMenuId).css({ left: leftX + 'px', top: topX + 'px', display: 'block' });
    setTimeout(function () {
      $(document).one('click', function () {
        $('#' + dropMenuId).hide();

      });
    }, 1000);
  }

  Object.extend(Object, {
    //闭包内
    toType: Type,
    toHTML: toHTML,
    toIsElement: isElement,
    toIsArray: isArray,
    toIsHash: isHash,
    toIsFunction: isFunction,
    toIsString: isString,
    toIsNumber: isNumber,
    toIsUndefined: isUndefined,
    toPinYin: toPinYin,
    toPinYin2: toPinYin2,
    toPinyinFirst: toPinyinFirst,
    toStringToJson: stringToJson,
    toJson: stringToJson,
    toCloneArray: cloneArray,
    toDeepClone: deepClone,
    toGetFunctionName: getFunctionName,
    toReplaceAll: replaceAll,
    toInsertAtCursor: insertAtCursor,//在光标处插入字符串
    //数字相关
    toColorPart: toColorPart,//转十六进制
    toSucc: succ,
    toPaddedString: toPaddedString,
    toAbs: abs,
    toTound: round,
    toCeil: ceil,
    toFloor: floor,

    //日期相关
    toIsDate: isDate,
    toJsonDateTimeFormatter: dateTimeFormatter,
    toJsonDateFormatter: dateFormatter,
    toJsonDateMonthFormatter: dateMonthFormatter,
    //格式化日期，传入值和格式化样式
    toDateFormatDate: formatDate,
    toIsDateStr: isDateStr,
    toIsJavaDateObj: isJavaDateObject,
    toGetDateObjectFromstr: _getDateObjectFromstr,
    toDateAddDays: dateAddDays,
    toGetCurrentDateTimeString: getCurrentDateTimeString,
    toGetCurrentDateTimeMillisecond: getCurrentDateTimeMillisecond,
    toGetCurrentDateString: getCurrentDateString,
    toDateObjectFormat: _DateObjectFormat,
    toISOString: toISOString,
    toJSON: toJSON,
    toStringToDate: stringToDate,
    toGetDatePeriodDay: getDatePeriodDay,
    toGetFirstDateInMonth: getFirstDateInMonth,
    toGetLastDateInMonth: getLastDateInMonth,
    toGetFirstDateInQuarter: getFirstDateInQuarter,
    toGetLastDateInQuarter: getLastDateInQuarter,
    toIsLeapYear: isLeapYear,
    toGetDaysInMonth: getDaysInMonth,

    //获取坐标
    toGetPosition: getPosition,
    toGetMousePosition: getMousePosition,
    toShowDropMenu: showDropMenu,
    toGetBrowserType: getBrowserType,
    //==外部也可直接使用的函数==========================
    toIsExitsFunction: __isExitsFunction,
    toQueryParmJson: _QueryParmJson,
    toQueryString: _QueryString,
    toStringFormat: _StringFormat,
    toIsJSON: _IsJSON,
    toEvalScripts: _EvalScripts,
    toEscapeHTML: _EscapeHTML,
    toUnescapeHTML: _UnescapeHTML,
    toEscapeWeizhichar: _EscapeWeizhichar,
    toDecimal: _ToDecimal,
    toCheckStringLength: _CheckStringLength,
    toJsonToString: _JsonToString,
    toIsEmpty: isEmpty,
    toGetDaysBefore: _getDaysBefore,
    toGetDaysAfter: _getDaysAfter,
    toAjaxJson: _ajaxJson,
    toExtendAjax: _extendAjax,

    toAjaxDownloadFile: _ajaxDownloadFile,
    toOpenUrlGetRequestDownloadFile: _openUrlGetRequestDownloadFile,
    toJsonToArr: _JsonToArr,
    toArrToJon: _ArrToJson,
    toShowLoading: _showLoading,
    toCloseLoading: _closeLoading,
    toNotification: _Notification,
    toClearNotification: clearAllNotification,
    toCreateXmlDoc: _createXmlDoc,
    toRefreshPage: _refreshPage,
    toBuildUrl: buildUrl,
    toGetTimeRandomNum: _GetTimeRandomNum,
    toGetRandomNum: _GetRandomNum,
    //获取两个时间差
    toGetDateDiff: _GetDateDiff,
    toGetSecondToZwDate: _GetSecondToZwDate,
    toGuid: _GetGuid,
    toGetIEVersionNo: _getIEVersionNumber,
    toIsHadBindClickEvent: _isHadBindClickEvent,
    toCopyToClipboard: _copyToClipboard,
    toIframeHeightAdapt: _iframeHeightAdapt,
    toParentIframeHeightAdapt: _parentIframeHeightAdapt,
    toIsMobile: _isMobile,
    toSecrecy: toSecrecy,
    toProcSecrecy: toProcSecrecy,
    toTrim: _Stringtrim,
    toTrimTags: _StringtrimTags,
    toStartWith: _StringStartWith,
    toEndWith: _StringEndWith,
    toCapitalize: _StringCapitalize,//首字母大写
    toIncludeString: _IncludeString,
    toTruncate: _Truncate2,//保留指定中文长度，默认25中文字符长度，truncation：默认为...
    toSucc: _Succ,//加1操作，对数字类型的字符串
    toCopyTimes: _CopyTimes//复制N次字符串
    //数字转为大写金额
    , toChinaNum: _number_to_Chinese
    //对数组排序，默认升序
    , dataSort: _dataSort
    , toConvertToNameValData: __convertToNameValData
    , toConvertToPropertyData: __convertToPropertyData
    , toConvertArrToPropertyData: __convertArrToPropertyData
    //树形递归查询指定的项
    , toTreeFindItem: _treeFindItem
    //树形递归收集指定属性值列表
    , toTreeCollection: _toTreeCollection
    , toPascal: __convertToPascal
    , toArrayEqueals: _arrayEqueals
    //在字符串中对指定关键字标红
    , toFlagInString: __toFlagInString
    //判断字符串是否为图片名称
    , toIsImageFileName: __isImageFileName
    , toFileDownload: __fileDownload
    , toBase64toFile: __base64toFile
    //在字符串中提取变量名
    , toGetVarsInStr: __getVarsInStr
    , toQianfenWeiStr: __QianfenWeiStr
    // //千分符和保留两位小数
    , tofixed: __Tofixed
    // ,numFixed:__ToNumFixed
  });

})();
String.prototype.toStartWith = _StringStartWith;
String.prototype.toTruncate = _Truncate;
Date.prototype.toDateFormat = _DateFormat;
/*********************Function扩展开始******************************************/
Object.extend(Function.prototype, (function () {
  var slice = Array.prototype.slice;

  //内部用
  function update(array, args) {
    var arrayLength = array.length, length = args.length;
    while (length--) array[arrayLength + length] = args[length];
    return array;
  }

  //合并两个数据到第一个数组中
  function merge(array, args) {
    //截取数组
    array = slice.call(array, 0);
    return update(array, args);
  }

  //获取函数的形参，以字符串数组形式返回
  function argumentNames() {
    var names = this.toString().match(/^[\s\(]*function[^(]*\(([^)]*)\)/)[1]
      .replace(/\/\/.*?[\r\n]|\/\*(?:.|[\r\n])*?\*\//g, '')
      .replace(/\s+/g, '').split(',');
    return names.length == 1 && !names[0] ? [] : names;
  }

  function bind(context) {
    if (arguments.length < 2 && typeof arguments[0] === 'undefined') return this;
    var __method = this, args = slice.call(arguments, 1);
    return function () {
      var a = merge(args, arguments);
      return __method.apply(context, a);
    };
  }

  function bindAsEventListener(context) {
    var __method = this, args = slice.call(arguments, 1);
    return function (event) {
      var a = update([event || window.event], args);
      return __method.apply(context, a);
    };
  }

  //函数的柯里化，用于一个操作分成多步进行，并可以改变原函数的行为
  function curry() {
    if (!arguments.length) return this;
    var __method = this, args = slice.call(arguments, 0);
    return function () {
      var a = merge(args, arguments);
      return __method.apply(this, a);
    };
  }

  //SetTimeOut的用法，推迟多少秒
  function delay(timeout) {
    var __method = this, args = slice.call(arguments, 1);
    timeout = timeout * 1000;
    return window.setTimeout(function () {
      return __method.apply(__method, args);
    }, timeout);
  }

  //强制延迟0.01秒才执行原函数
  function defer() {
    var args = update([0.01], arguments);
    return this.delay.apply(this, args);
  }

  //AOP的实现
  function wrap(wrapper) {
    var __method = this;
    return function () {
      var a = update([__method.bind(this)], arguments);
      return wrapper.apply(this, a);
    };
  }

  function methodize() {
    if (this._methodized) return this._methodized;
    var __method = this;
    return this._methodized = function () {
      var a = update([this], arguments);
      return __method.apply(null, a);
    };
  }
})());

/*********************Function扩展结束******************************************/

/*********************共用的对象最小单元通用独立方法开始*********************/



//首字母大写
function _StringCapitalize() {
  return this.charAt(0).toUpperCase();
}

//判断字符串是否以指定字符开头
function _StringStartWith(str, startStr, ignorecase) {
  if (ignorecase == undefined || ignorecase == null) {
    ignorecase = true;
  }
  if (str == undefined || str == null) {
    return false;
  }
  if (typeof str == "number") {
    return false;
  }
  var startString = str.substr(0, startStr.length);
  return ignorecase ? startString.toLocaleLowerCase() == startStr.toLocaleLowerCase() : startString == startStr;
}

//判断字符串是否以指定字符结尾
function _StringEndWith(str, endStr, ignorecase) {
  ignorecase = ignorecase || true;
  var endString = str.substring(str.length - endStr.length);
  return ignorecase ? endString.toLocaleLowerCase() == endStr.toLocaleLowerCase() : endString == endStr;

}

//去除字符两边的标签
function _StringtrimTags(str) {
  return str.replace(/<\w+(\s+("[^"]*"|'[^']*'|[^>])+)?>|<\/\w+>/gi, '');
}

//去除字符两边的空隔
function _Stringtrim(str) {
  if (str == undefined || str.length == 0) return '';
  return str.replace(/^\s+|\s+$/g, '');
}

//是否包含了指定字符串
function _IncludeString(str, pattern) {
  return str.indexOf(pattern) > -1;
}

//格式化日期时间：format：yyyy-MM-dd,yyyy-MM-dd hhmmss
function _DateFormat(format) {

  var o = {
    'M+': this.getMonth() + 1, //month
    'd+': this.getDate(),    //day
    'h+': this.getHours(),   //hour
    'H+': this.getHours(),   //hour
    'm+': this.getMinutes(), //minute
    's+': this.getSeconds(), //second
    'q+': Math.floor((this.getMonth() + 3) / 3),  //quarter
    'S': this.getMilliseconds().toString().padStart(3, '0') //millisecond
  };
  if (/(y+)/.test(format)) {
    format = format.replace(RegExp.$1,
      (this.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(format)) {
      format = format.replace(RegExp.$1,
        RegExp.$1.length == 1 ? o[k] :
          ('00' + o[k]).substr(('' + o[k]).length));
    }
  }
  return format;
}

//保留指定中文长度，默认25中文字符长度，truncation：默认为...
function _Truncate2(str, length, truncation) {
  if (str.length == 0) return '';
  length = length || 25;
  truncation = Object.toIsUndefined(truncation) ? '...' : truncation;
  return str.length > length ? str.slice(0, length) + truncation : str;
}

//保留指定中文长度，默认25中文字符长度，truncation：默认为...
function _Truncate(length, truncation) {
  if (this.length == 0) return '';
  length = length || 25;
  truncation = Object.toIsUndefined(truncation) ? '...' : truncation;
  return this.length > length ?
    this.slice(0, length) + truncation : String(this);
}

//加1操作，对数字类型的字符串
function _Succ(str) {
  return str.slice(0, str.length - 1) +
    String.fromCharCode(str.charCodeAt(str.length - 1) + 1);
}

//复制N次字符串
function _CopyTimes(str, count) {
  return count < 1 ? '' : new Array(count + 1).join(str);
}

/*********************this 对象最小单元通用独立方法结束*********************/

/*********************最小单元通用独立方法开始 也可被页面直接使用，供prototype或类使用*********************************/

//类似 StringFormat的格式化，这里更强大，支持JSON键值方式
//例子 var a=StringFormat("Result is {0},{1}",22,33);
//var b=StringFormat("Result is {Name},{Age}",{Name:"Jhon",Age:14});
function _StringFormat(str, object) {
  var array = Array.prototype.slice.call(arguments, 1);
  return str.replace(/\\?\{([^{}]+)\}/gm, function (match, name) {
    if (match.charAt(0) == '\\') {
      return match.slice(1);
    }
    var index = Number(name);
    if (index >= 0) {
      return array[index];
    }
    if (object && object[name] != void 0) {
      return object[name];
    }
    return '';

  });
}

//获取Url传递的参数值
function _QueryString(Parametername) {
  var reg = new RegExp('(^|&)' + Parametername + '=([^&]*)(&|$)');
  var search = window.location.search;
  if (!search) {
    var index = window.location.href.indexOf("?");
    search = window.location.href.substr(index);
  }
  var r = search.substr(1).match(reg);
  if (r != null) return decodeURIComponent(r[2]);
  return "";
}

//获取Url传弟的所有参数Json
function _QueryParmJson() {
  var parmString = window.location.search.substr(1);
  if (parmString) {
    var arrPara = parmString.split('&');
    var json = {};
    $.each(arrPara, function (i, item) {
      var arr = item.split('=');
      json[arr[0]] = decodeURI(arr[1]);
    });
    return json;
  }
  return "";
}

function __isExitsFunction(funcName) {
  if (funcName == null || funcName == "" || funcName == undefined) {
    return false;
  }
  try {
    if (typeof (eval(funcName)) == 'function' || typeof (eval(funcName)) == 'object') {
      return true;
    }
  } catch (e) {
  }
  return false;
}

//判断是否为Json对象
function _IsJSON(object) {
  var str = object;
  if (str.blank()) return false;
  str = str.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@');
  str = str.replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']');
  str = str.replace(/(?:^|:|,)(?:\s*\[)+/g, '');
  return (/^[\],:{}\s]*$/).test(str);
}

//生成随机guid数,isMiddline是否加黄线，默认true
function _GetGuid(isMiddline) {
  isMiddline = isMiddline == undefined ? true : isMiddline;
  var charStr = isMiddline ? '-' : '';
  var S4 = function () {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  };
  return (S4() + S4() + charStr + S4() + charStr + S4() + charStr + S4() + charStr + S4() + S4() + S4());
}

//转换为脚本原型
function _EvalScripts(object) {
  return object.extractScripts().map(function (script) {
    return eval(script);
  });
}

//进行HTML编码，即代码转为显示字符
function _EscapeHTML(object) {
  if (object == null) return null;
  object = object + "";
  return object.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

//Html反编码，即转为编程代码
function _UnescapeHTML(object) {
  if (object == null) return null;
  object = object + "";
  return object._StringtrimTags.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
}

//编码为中文符号：<转为〈
function _EscapeWeizhichar(object) {
  if (object == null) return null;
  object = object + "";
  return object.replace(/&/g, '＆').replace(/=/g, '＝').replace(/</g, '＜').replace(/>/g, '＞');
  ;
}

/*四舍五入 将数字转换成指定保留位数 v要保留的位数*/
function _ThisToDecimal(v) {
  return _ToDecimal(this, v);
}

/*非数字时返回本身 四舍五入 将数字转换成指定保留位数 num要转换的数,v要保留的位数*/
function _ToDecimal_1(number, n) {
  // 如果 digits 参数太小或太大。0 到 20（包括）之间的值不会引起 RangeError。实现环境（implementations）也可以支持更大或更小的值
  if (n > 20 || n < 0) {
    throw new RangeError('toFixed() digits argument must be between 0 and 20')
  }
  // 如果该方法在一个非Number类型的对象上调用
  if (isNaN(number)) {
    return number;
  }
  // 如果数值大于 1e+21，该方法会简单调用 Number.prototype.toString()并返回一个指数记数法格式的字符串
  if (number >= Math.pow(10, 21)) {
    return number.toString()
  }
  // 如果忽略该参数，则默认为 0，进行四舍五入，不包括小数部分
  if (n === undefined || n === 0) {
    return Math.round(number).toString()
  }

  let result = number.toString()
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
    return result
  }
  // 小数情况（原位数 > 需求位数，需四舍五入）
  result = integer + '.' + decimal.substring(0, n)
  const last = decimal.substring(n, n + 1)
  if (parseInt(last, 10) >= 5) {
    const multiple = Math.pow(10, n)
    result = ((Math.round(parseFloat(result) * multiple) + 1) / multiple).toString() // 使用 Math.round 防止结果无限小数
    // 0 补足小数
    decimal = result.split('.')[1]
    if (decimal.length < n) {
      for (let i = 0; i < n - decimal.length; i++) {
        result += '0'
      }
      return result
    }
  }
  return result
}
function _ToDecimal(num, v) {
  if (isNaN(num)) {
    return num;
  }
  let index = (num + "").indexOf(".");
  if (index > 0 && v >= (num + "").length - (index + 1)) {
    return num;
  }
  // if(index>0&&index==(num + "").length-1){
  //   return num;
  // }
  var vv = Math.pow(10, v);
  return Math.round(num * vv) / vv;
}
//检查输入的字符数长度。
function _CheckStringLength(strTemp) {
  var i, sum;
  sum = 0;
  for (i = 0; i < strTemp.length; i++) {
    if ((strTemp.charCodeAt(i) >= 0) && (strTemp.charCodeAt(i) <= 255)) {
      sum = sum + 1;
    } else {
      sum = sum + 2;
    } //汉字占有两个字符
  }
  return sum;
}

//Json转换为String
function _JsonToString(object) {
  return JSON.stringify(object);
}

//获取指定时间N天前的时间
function _getDaysBefore(dateObject, nDay) {
  var date = dateObject || new Date();
  var timestamp = date.getTime();
  var newDate = new Date(timestamp - nDay * 24 * 3600 * 1000);
  return newDate;
}

//获取指定时间N天后的时间
function _getDaysAfter(dateObject, nDay) {
  var date = dateObject || new Date();
  var timestamp = date.getTime();
  var newDate = new Date(timestamp + nDay * 24 * 3600 * 1000);
  return newDate;
}

//格式化日期"yyyy-MM-dd hh:mm:ss",默认yyyy-MM-dd
function _DateObjectFormat(dateObject, format) {
  format = format || 'yyyy-MM-dd';
  var o = {
    'M+': dateObject.getMonth() + 1, //month
    'd+': dateObject.getDate(),    //day
    'h+': dateObject.getHours(),   //hour
    'm+': dateObject.getMinutes(), //minute
    's+': dateObject.getSeconds(), //second
    'q+': Math.floor((dateObject.getMonth() + 3) / 3),  //quarter
    'S': dateObject.getMilliseconds() //millisecond
  };
  if (/(y+)/.test(format)) {
    format = format.replace(RegExp.$1,
      (dateObject.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(format)) {
      format = format.replace(RegExp.$1,
        RegExp.$1.length == 1 ? o[k] :
          ('00' + o[k]).substr(('' + o[k]).length));
    }
  }
  return format;
}

//Json转数组
function _JsonToArr(jsonObject) {
  var arr = [];
  for (var property in jsonObject) {
    var arrItem = { name: property, value: jsonObject[property] };
    arr.push(arrItem);
  }
  return arr;
}

//将name value对象的数组转Json
function _ArrToJson(arrObject) {
  var n = arrObject.length;
  var jsonString = '{';

  for (var i = 0; i < n; i++) {
    jsonString += ':"';
    jsonString += arrObject[i].name;
    jsonString += ':"';

    jsonString += ':"';
    jsonString += arrObject[i].value;
    jsonString += ':"';

    if (i != n - 1) jsonString += ',';
  }
  var jsonString = '}';
  return Object.toJSON(jsonString);
}

//获取一个随机数
function _GetRandomNum(Min, Max) {
  var Range = Max - Min;
  var Rand = Math.random();
  return (Min + Math.round(Rand * Range));
}

///获取一个时间戳
function _GetTimeRandomNum() {
  var randomCode = new Date().valueOf();
  return randomCode;
}

//reload方式刷新
function _refreshPage() {
  window.location.reload();
}

function _getIEVersionNumber() {
  if (/msie/.test(navigator.userAgent.toLowerCase())) {
    var ua = navigator.userAgent.toLowerCase();
    return IEVersion = ua.match(/msie ([\d.]+)/)[1];
  }
  return '';
}

/*
* 获得时间差,时间格式为 年-月-日 小时:分钟:秒 或者 年/月/日 小时：分钟：秒
* 其中，年月日为全格式，例如 ： 2010-10-12 01:00:00
* 返回精度为：秒，分，小时，天
*diffType：day，minute，hour，second,zw中文读法显示
*var result = GetDateDiff("2010-02-26 16:00:00", "2011-07-02 21:48:40", "day");
*var result = GetDateDiff(date1, date2, "day");
* startTime和endTime:可以是字符串也可以是date对象
*/
function _GetDateDiff(startTime, endTime, diffType) {
  //将xxxx-xx-xx的时间格式，转换为 xxxx/xx/xx的格式
  var sTime = null;
  var eTime = null;
  if (typeof startTime == 'string') {
    startTime = startTime.replace(/\-/g, '/');
    endTime = endTime.replace(/\-/g, '/');
    sTime = new Date(startTime);      //开始时间
    eTime = new Date(endTime);  //结束时间
  } else {
    sTime = startTime;
    eTime = endTime;
  }
  //将计算间隔类性字符转换为小写
  diffType = diffType.toLowerCase();

  //作为除数的数字
  var divNum = 1;
  if (diffType == 'zw') {
    var time = parseFloat((eTime.getTime() - sTime.getTime())) / 1000;
    return _GetSecondToZwDate(time);
  }
  switch (diffType) {
    case 'second':
      divNum = 1000;
      break;
    case 'minute':
      divNum = 1000 * 60;
      break;
    case 'hour':
      divNum = 1000 * 3600;
      break;
    case 'day':
      divNum = 1000 * 3600 * 24;
      break;
    default:
      break;
  }
  var subdif = parseFloat((eTime.getTime() - sTime.getTime()) / parseInt(divNum));
  return _ToDecimal(subdif, 1);
}

//将秒数转为多少天多少小时多少分的中文字符串
function _GetSecondToZwDate(msd) {
  var time = msd;
  if (null != time && '' != time) {
    if (time > 60 && time < 60 * 60) {
      time = parseInt(time / 60.0) + '分钟' + parseInt((parseFloat(time / 60.0) -
        parseInt(time / 60.0)) * 60) + '秒';
    } else if (time >= 60 * 60 && time < 60 * 60 * 24) {
      time = parseInt(time / 3600.0) + '小时' + parseInt((parseFloat(time / 3600.0) -
        parseInt(time / 3600.0)) * 60) + '分钟' +
        parseInt((parseFloat((parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60) -
          parseInt((parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60)) * 60) + '秒';
    } else if (time >= 60 * 60 * 24) {
      time = parseInt(time / 3600.0 / 24) + '天' + parseInt((parseFloat(time / 3600.0 / 24) -
        parseInt(time / 3600.0 / 24)) * 24) + '小时' + parseInt((parseFloat(time / 3600.0) -
          parseInt(time / 3600.0)) * 60) + '分钟' +
        parseInt((parseFloat((parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60) -
          parseInt((parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60)) * 60) + '秒';
    } else {
      time = parseInt(time) + '秒';
    }
  }
  return time;
}

function _copyToClipboard(txt) {
  if (window.clipboardData) {
    window.clipboardData.clearData();
    window.clipboardData.setData('Text', txt);
    return true;
  }
  if (window.copy) {
    window.copy(txt);
    return true;
  } else if (navigator.userAgent.indexOf('Opera') != -1) {
    window.location = txt;
    return true;
  } else if (window.netscape) {
    try {
      netscape.security.PrivilegeManager.enablePrivilege('UniversalXPConnect');
    } catch (e) {
      alert('被浏览器拒绝！\n请在浏览器地址栏输入\'about:config\'并回车\n然后将\'signed.applets.codebase_principal_support\'设置为\'true\'');
    }
    var clip = Components.classes['@mozilla.org/widget/clipboard;1'].createInstance(Components.interfaces.nsIClipboard);
    if (!clip) return;
    var trans = Components.classes['@mozilla.org/widget/transferable;1'].createInstance(Components.interfaces.nsITransferable);
    if (!trans) return;
    trans.addDataFlavor('text/unicode');
    var str = new Object();
    var len = new Object();
    var str = Components.classes['@mozilla.org/supports-string;1'].createInstance(Components.interfaces.nsISupportsString);
    var copytext = txt;
    str.data = copytext;
    trans.setTransferData('text/unicode', str, copytext.length * 2);
    var clipid = Components.interfaces.nsIClipboard;
    if (!clip) return false;
    clip.setData(trans, null, clipid.kGlobalClipboard);
    return true;
  }
}

function _parentIframeHeightAdapt(iframeId) {
  if (window.parent && window.parent._iframeHeightAdapt) {
    window.parent._iframeHeightAdapt(iframeId);
  }
}

function _iframeHeightAdapt(iframeId) {
  var ifm = document.getElementById(iframeId);
  var subWeb = document.frames ? document.frames[iframeId].document : ifm.contentDocument;
  if (ifm != null && subWeb != null) {
    ifm.height = subWeb.body.scrollHeight;
    ifm.width = subWeb.body.scrollWidth;
  }
}

//返回true false
function _isMobile() {
  var ua = navigator.userAgent;
  var ipad = ua.match(/(iPad).*OS\s([\d_]+)/),
    isIphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/),
    isAndroid = ua.match(/(Android)\s+([\d.]+)/),
    isMobile = isIphone || isAndroid;
  return isMobile != null && isMobile != '';
}

function _number_to_Chinese(Num) {
  if (Num == "" || Num == undefined || Num == null) {
    return "";
  }
  Num = Num + '';
  for (i = Num.length - 1; i >= 0; i--) {
    Num = Num.replace(',', '');//替换tomoney()中的“,”
    Num = Num.replace(' ', '');//替换tomoney()中的空格
  }
  Num = Num.replace('￥', '');//替换掉可能出现的￥字符
  if (!Object.toIsNumber(Num)) { //验证输入的字符是否为数字
    alert('请检查小写金额是否正确');
    return;
  }
  //是否为负数
  var isFuShu = Num.indexOf("-") != -1;
  Num = Num.replace('-', '');
  //---字符处理完毕，开始转换，转换采用前后两部分分别转换---//
  part = String(Num).split('.');
  newchar = '';
  //是否个位数只有一个零
  var isOnlyZero = false;
  if (part[0].length == 1 && part[0].charAt(0) == '0') {
    isOnlyZero = true;
  }
  if (part[0].length > 12) {
    alert('位数过大，无法转换超过仟亿的大写金额');
    return '';
  } //若数量超过仟亿单位
  //小数点前进行转化
  for (i = part[0].length - 1; i >= 0; i--) {
    tmpnewchar = '';
    perchar = part[0].charAt(i);
    //读出数字
    switch (perchar) {
      case '0':
        tmpnewchar = '零' + tmpnewchar;
        break;
      case '1':
        tmpnewchar = '壹' + tmpnewchar;
        break;
      case '2':
        tmpnewchar = '贰' + tmpnewchar;
        break;
      case '3':
        tmpnewchar = '叁' + tmpnewchar;
        break;
      case '4':
        tmpnewchar = '肆' + tmpnewchar;
        break;
      case '5':
        tmpnewchar = '伍' + tmpnewchar;
        break;
      case '6':
        tmpnewchar = '陆' + tmpnewchar;
        break;
      case '7':
        tmpnewchar = '柒' + tmpnewchar;
        break;
      case '8':
        tmpnewchar = '捌' + tmpnewchar;
        break;
      case '9':
        tmpnewchar = '玖' + tmpnewchar;
        break;
    }
    //确定位置
    switch (part[0].length - i - 1) {
      case 0:
        tmpnewchar = tmpnewchar + '元';
        break;
      case 1:
        if (perchar != 0) tmpnewchar = tmpnewchar + '拾';
        break;
      case 2:
        if (perchar != 0) tmpnewchar = tmpnewchar + '佰';
        break;
      case 3:
        if (perchar != 0) tmpnewchar = tmpnewchar + '仟';
        break;
      case 4:
        tmpnewchar = tmpnewchar + '万';
        break;
      case 5:
        if (perchar != 0) tmpnewchar = tmpnewchar + '拾';
        break;
      case 6:
        if (perchar != 0) tmpnewchar = tmpnewchar + '佰';
        break;
      case 7:
        if (perchar != 0) tmpnewchar = tmpnewchar + '仟';
        break;
      case 8:
        tmpnewchar = tmpnewchar + '亿';
        break;
      case 9:
        if (perchar != 0) tmpnewchar = tmpnewchar + '拾';
        break;
      case 10:
        if (perchar != 0) tmpnewchar = tmpnewchar + '佰';
        break;
      case 11:
        if (perchar != 0) tmpnewchar = tmpnewchar + '仟';
        break;
    }

    newchar = tmpnewchar + newchar;
  }
  //小数点之后进行转化
  if (Num.indexOf('.') != -1) {
    if (part[1].length > 2) {
      //alert("小数点之后只能保留两位,系统将自动截段");
      part[1] = part[1].substr(0, 2);
    }
    for (i = 0; i < part[1].length; i++) {
      tmpnewchar = '';
      perchar = part[1].charAt(i);
      switch (perchar) {
        case '0':
          tmpnewchar = '零' + tmpnewchar;
          break;
        case '1':
          tmpnewchar = '壹' + tmpnewchar;
          break;
        case '2':
          tmpnewchar = '贰' + tmpnewchar;
          break;
        case '3':
          tmpnewchar = '叁' + tmpnewchar;
          break;
        case '4':
          tmpnewchar = '肆' + tmpnewchar;
          break;
        case '5':
          tmpnewchar = '伍' + tmpnewchar;
          break;
        case '6':
          tmpnewchar = '陆' + tmpnewchar;
          break;
        case '7':
          tmpnewchar = '柒' + tmpnewchar;
          break;
        case '8':
          tmpnewchar = '捌' + tmpnewchar;
          break;
        case '9':
          tmpnewchar = '玖' + tmpnewchar;
          break;
      }
      if (i == 0) tmpnewchar = tmpnewchar + '角';
      if (i == 1) tmpnewchar = tmpnewchar + '分';
      newchar = newchar + tmpnewchar;
    }
  }
  //替换所有无用汉字
  while (newchar.search('零零') != -1) {
    newchar = newchar.replace('零零', '零');
  }
  newchar = newchar.replace('零亿', '亿');
  newchar = newchar.replace('亿万', '亿');
  newchar = newchar.replace('零万', '万');
  if (isOnlyZero == false) {
    newchar = newchar.replace('零元', '元');
  }
  newchar = newchar.replace('零角', '');
  newchar = newchar.replace('零分', '');

  if (newchar.charAt(newchar.length - 1) == '元' || newchar.charAt(newchar.length - 1) == '角') {
    newchar = newchar + '整';
  }
  if (isFuShu) {
    newchar = "负" + newchar;
  }
  return newchar;

}
//将1行对象数据{key1:v1,k2:v2}数据转为[{name:,value},{name:value}]格式
function __convertToNameValData(row) {
  //去掉实体对象前缀名称
  var rowNV = [];
  $.each(row, function (key, value) {
    var index = key.lastIndexOf(".");
    var k = index > 0 ? key.substr(index + 1) : key;
    rowNV.push({ "name": k, "value": value });
  });
  return rowNV;
}
//将1行数组数据[{name:value},{name:value}],[{name:value}]转为{key:v,key2:v2}格式
function __convertToPropertyData(rowArr) {
  //去掉实体对象前缀名称
  var obj = {};
  $.each(rowArr, function (index, item) {
    var index = item.name.lastIndexOf(".");
    var keyName = index > 0 ? item.name.substr(index + 1) : item.name;
    obj[keyName] = item.value;
  });
  return obj;
}
//将多行数组数据[[{name:value},{name:value}],[{name:value}]]转为[{key:v,key2:v2}]格式
function __convertArrToPropertyData(arrList) {
  //去掉实体对象前缀名称
  var data = [];
  $.each(arrList, function (index, rowArr) {
    var item = __convertToPropertyData(rowArr);
    data.push(item);
  });
  return data;
}
//将字段串转为Pascal命名规则:即首字段大写并且每个下划线的首字母大写如：AaBbCc
//sourceStr:要转换的字段串
//removePreLevel:删除几级的下划线前缀，1时，如sys_abc,只取abc
//splitChar:分隔符，默认为“_”
//isFirstToLower:是否将首字母转为小写即abcAaBb
function __convertToPascal(sourceStr, removePreLevel, splitChar, isFirstToLower) {
  if (removePreLevel == undefined || removePreLevel == null) {
    removePreLevel = 0;
  }
  splitChar = splitChar || "_";
  var propertyName = sourceStr;
  var result = "";
  var arr = propertyName.split(splitChar);
  for (i = 0; i < arr.length; i++) {
    var item = arr[i];
    if (removePreLevel > 0 && removePreLevel - 1 >= i) {
      continue;
    }
    var v = item.substring(0, 1).toUpperCase() + item.substring(1).toLowerCase();
    result += v;
  }
  propertyName = result;
  if (isFirstToLower) {
    propertyName = propertyName.substring(0, 1).toLowerCase() + propertyName.substring(1).toLowerCase();
  }
  return propertyName;
}

/**
 * 比较两个数组是否相等，只比较一层深度，比如：[1,2,3]与[1,2,4]
 * @param {} arrA  数据A
 * @param {*} arrB  数据B
 * @returns
 */
function _arrayEqueals(arrA, arrB) {
  if (!arrA) {
    return false;
  }
  if (!arrB) {
    return false;
  }
  if (arrA.length != arrB.length) {
    return false;
  }
  var isEqusl = true;
  for (var i = 0, l = arrA.length; i < l; i++) {
    var value = arrA[i];
    if ($.inArray(value, arrB) == -1) {
      isEqusl = false;
      break;
    }
  }
  return isEqusl;

}

function __toFlagInString(key, str) {
  var reg = new RegExp("(" + key + ")");
  var newStr = str.replace(reg, "<font color='red'>$1</font>");
  return newStr;
}
//判断文件名是否为图片类型
function __isImageFileName(filePath) {
  var arr = ['png', 'jpg', 'jpeg', 'bmp', 'gif', 'svg', 'tiff'];
  var index = filePath.lastIndexOf(".");
  //获取后缀
  var ext = filePath.substr(index + 1);
  return arr.indexOf(ext.toLowerCase()) !== -1;
}
//文件转base64
function __base64toFile(base64, fileName) {
  let arr = base64.split(","),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], fileName, { type: mime });
}
/**
 * 在字符串中提取变量名
 * @param {变更} str  字符串
 * @param {*} isMeiYunFuHao  是否为美元符号$，默认为#号，
 */
function __getVarsInStr(str, isMeiYunFuHao) {
  var result = [];
  //aaaa#a#bb#cc# 提取结果为bb  cc
  var rule = /#([a-zA-Z0-9_-]{1,}[#]{1})/g;
  if (isMeiYunFuHao === true) {
    rule = /\$([a-zA-Z0-9_-]{1,}[\$]{1})/g;
  }
  str.replace(rule, function (match) {
    console.info(match);
    result.push(match);
    return match;
  });
  return result;
}
//将数字转为千分位的字符串
function __QianfenWeiStr(num) {
  if (num == "" || num == undefined || num == null) {
    return "";
  }
  if (!Object.toIsNumber(num)) {
    return "";
  }
  num = num ? $.trim(num) + '' : '';
  //是否为负数
  var isFuShu = num.indexOf("-") != -1;
  num = num.replace('-', '');
  let [int, fraction = ''] = num.split('.');
  let ans = '';
  const len = int.length;
  int = int.split('').reverse();
  for (let i = 0; i < len; i++) {
    if (i !== 0 && i % 3 === 0) {
      ans = int[i] + ',' + ans;
    } else {
      ans = int[i] + ans;
    }
  }
  if (fraction !== '') ans += '.' + fraction;
  if (isFuShu) {
    ans = '-' + ans;
  }
  return ans;
}
//保留两位小数四舍五入
function __Tofixed(number, n) {
  // debugger
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


//点击下载文件
function __fileDownload(downloadUrl, fileName) {
  let aLink = document.createElement("a");
  aLink.style.display = "none";
  aLink.href = downloadUrl;
  aLink.download = fileName;
  document.body.appendChild(aLink);
  aLink.click();
  document.body.removeChild(aLink);
}
/*********************最小单元通用独立方法结束******************************************/

/*********************Aajx操作******************************************/
//获取json数据ajax请求 methodName:方法名,
//methodName可为null, 为null时默认请求地址方法，如 handler的 ProcessRequest
//async是否异步：默认false,异步请求需要传入回调函数
//data Json参数如{a:"aValue",b:"bValue"}
//data 数组参数形式[{name:"a",value"aValue"},{name:"b",value"bValue"}]
//type:请求类别默认post
//dataType:预期服务器返回的数据类型[string,xml,html,script,json(默认),text]
//isloading:是否加载遮罩层，默认为true
function _ajaxJson(url, method, data, async, type, callback, dataType, isloading) {
  if (url == undefined) {
    alert('ajaxjson url is not empty');
    return false;
  }
  if (async && (isloading == undefined || isloading == null)) {
    isloading = true;
  } else if (isloading == undefined || isloading == null || async == undefined || async == null) {
    isloading = false;
  }
  method = method || '';
  var index = url.indexOf('?');
  if (index > -1 && method) {
    var controller = url.substr(0, index);
    var parmStr = url.substring(index);

    url = controller + method + '/' + parmStr;
  } else if (method) {
    url = url + method;
  }
  if (__serverpath != '' && !Object.toStartWith(url, __serverpath) && !Object.toStartWith(url, 'http')) {
    url = __serverpath + url;
  }
  var json = {};
  var isAsync = async || false;
  var theData = [];
  if (!Object.toIsArray(data)) {
    //Json参数形式
    theData = data;
    //转为数据形式
    var arr = Object.toJsonToArr(data);
    theData = arr;
  } else {
    //数组参数形式
    theData = data;
  }
  var isCorsRequest = false;
  var isWithCredentials = false;
  if (Object.toStartWith(url, 'http')) {
    isCorsRequest = true;
    isWithCredentials = true;
  }
  if (_isMobile() == true) {
    //$.showPreloader();
  } else if (isloading) {
    Object.toShowLoading();
  }
  var f2bpmToken = "";
  var author = window.localStorage.getItem('f2bpmAuthor');
  if (author) {
    author = eval("(" + author + ")");
    f2bpmToken = author.token;
    // XMLHttpRequest.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    // XMLHttpRequest.setRequestHeader('f2bpmToken', f2bpmToken);
  }
  $.ajax({
    type: type || 'POST',
    async: isAsync,
    url: url,
    data: theData,
    dataType: dataType || 'json',
    //xhrFields: {
    //需要允许Ajax请求写Cookie时才需要开启此配置
    //withCredentials: isWithCredentials
    //},
    crossDomain: true,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      "f2bpmToken": f2bpmToken
    }
    , success: function (d) {
      //"token过期",112：账号在另一处登录， 111 "无效的token", 110 "无效签名", 104 "api key无效", 101
      if (d && typeof (d) == 'object' && d.success != undefined && d.success == false && d.code != undefined && d.code != null && (d.code == 110 || d.code == 112 || d.code == 111 || d.code == 101 || d.code == 104)) {
        var errmsg = d.code || "";
        console.info(d);
        console.info(url);
        console.info(f2bpmToken);
        window.location.href = __webpath + '/login?err=' + errmsg;
        return false;
      }
      if (callback && typeof (callback) != 'function') {
        throw TypeError('the callback parameter not is a function');
      } else if (callback) {
        callback(d);
      }
      json = d;
    },
    beforeSend: function (XMLHttpRequest) {
      // if (isCorsRequest) {
      //   var author = window.sessionStorage.getItem('f2bpmAuthor');
      //   if (author) {
      //     author = eval("(" + author + ")");
      //     var f2bpmToken = author.token;
      //     XMLHttpRequest.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
      //     XMLHttpRequest.setRequestHeader('f2bpmToken', f2bpmToken);
      //   }
      // }
    },
    complete: function (d) {
      try {
        //请求成功或失败时均调用
        setTimeout(function () {
          if (_isMobile() == true) {
            //$.hidePreloader();
          } else {
            Object.toCloseLoading();
          }
        }, 100);
      } catch (e) {

      }
    }
    ,
    error: function (d) {
      var responseText = d.responseText;
      if (d.statusText && d.statusText.indexOf("NetworkError: Failed") != -1) {
        throw new Error('服务器请求异常请联系管理员：' + d.statusText);
        return false;
      }
      json = { success: false, msg: '请求出错，请联系管理员' };
      var errMsg = typeof (d) == 'object' ? JSON.stringify(d) : d.toString();
      console.error('请求异常' + errMsg);
      setTimeout(function () {
        Object.toCloseLoading();
      }, 100);
      if (callback && typeof (callback) != 'function') {
        throw TypeError('the callback parameter not is a function');
      } else if (callback) {
        callback(json);
      } else {
        if (typeof (d) == 'object') {
          throw new Error('请求出错，请联系管理员' + JSON.stringify(d));
        } else {
          throw new Error('服务器返回出错，请联系管理员' + d.toString());
        }
      }
    }
  }
  )
    ;
  return json;
}
/*********************Aajx操作******************************************/
//获取json数据ajax请求 methodName:方法名,
//methodName可为null, 为null时默认请求地址方法，如 handler的 ProcessRequest
//async是否异步：默认false,异步请求需要传入回调函数
//data Json参数如{a:"aValue",b:"bValue"}
//data 数组参数形式[{name:"a",value"aValue"},{name:"b",value"bValue"}]
//type:请求类别默认post
//dataType:预期服务器返回的数据类型[string,xml,html,script,json(默认),text]
//isloading:是否加载遮罩层，默认为true
//url, '', data, null, type, callback,contentType
function _extendAjax(url, method, data, async, type, callback, contentType, dataType, isloading) {


  if (url == undefined) {
    alert('ajaxjson url is not empty');
    return false;
  }
  if (async && (isloading == undefined || isloading == null)) {
    isloading = true;
  } else if (isloading == undefined || isloading == null || async == undefined || async == null) {
    isloading = false;
  }
  method = method || '';
  var index = url.indexOf('?');
  if (index > -1 && method) {
    var controller = url.substr(0, index);
    var parmStr = url.substring(index);

    url = controller + method + '/' + parmStr;
  } else if (method) {
    url = url + method;
  }
  if (__serverpath != '' && !Object.toStartWith(url, __serverpath) && !Object.toStartWith(url, 'http')) {
    url = __serverpath + url;
  }
  var json = {};
  var isAsync = async || false;
  // var theData = [];
  // if (!Object.toIsArray(data)) {
  //   //Json参数形式
  //   theData = data;
  //   //转为数据形式
  //   var arr = Object.toJsonToArr(data);
  //   theData = arr;
  // } else {
  //   //数组参数形式
  //   theData = data;
  // }
  var isCorsRequest = false;
  var isWithCredentials = false;
  if (Object.toStartWith(url, 'http')) {
    isCorsRequest = true;

    isWithCredentials = true;
  }
  if (_isMobile() == true) {
    //$.showPreloader();
  } else if (isloading) {
    Object.toShowLoading();
  }
  var f2bpmToken = "";
  var author = window.localStorage.getItem('f2bpmAuthor');
  if (!contentType) {
    contentType = 'application/json'
  }
  if (author) {
    author = eval("(" + author + ")");
    f2bpmToken = author.token;
    // XMLHttpRequest.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    // XMLHttpRequest.setRequestHeader('f2bpmToken', f2bpmToken);
  }
  $.ajax({
    type: type || 'POST',
    async: isAsync,
    url: url,
    data: data,
    dataType: dataType || 'json',
    //xhrFields: {
    //需要允许Ajax请求写Cookie时才需要开启此配置
    //withCredentials: isWithCredentials
    //},
    crossDomain: true,
    headers: {
      'Content-Type': contentType,
      "f2bpmToken": f2bpmToken
    }
    , success: function (d) {
      //"token过期",112：账号在另一处登录， 111 "无效的token", 110 "无效签名", 104 "api key无效", 101
      if (d && typeof (d) == 'object' && d.success != undefined && d.success == false && d.code != undefined && d.code != null && (d.code == 110 || d.code == 112 || d.code == 111 || d.code == 101 || d.code == 104)) {
        var errmsg = d.code || "";
        console.info(d);
        console.info(url);
        console.info(f2bpmToken);
        window.location.href = __webpath + '/login?err=' + errmsg;
        return false;
      }
      if (callback && typeof (callback) != 'function') {
        throw TypeError('the callback parameter not is a function');
      } else if (callback) {
        callback(d);
      }
      json = d;
    },
    beforeSend: function (XMLHttpRequest) {
      // if (isCorsRequest) {
      //   var author = window.localStorage.getItem('f2bpmAuthor');
      //   if (author) {
      //     author = eval("(" + author + ")");
      //     var f2bpmToken = author.token;
      //     XMLHttpRequest.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
      //     XMLHttpRequest.setRequestHeader('f2bpmToken', f2bpmToken);
      //   }
      // }
    },
    complete: function (d) {
      try {
        //请求成功或失败时均调用
        setTimeout(function () {
          if (_isMobile() == true) {
            //$.hidePreloader();
          } else {
            Object.toCloseLoading();
          }
        }, 100);
      } catch (e) {

      }
    }
    ,
    error: function (d) {
      var responseText = d.responseText;
      if (d.statusText && d.statusText.indexOf("NetworkError: Failed") != -1) {
        throw new Error('服务器请求异常请联系管理员：' + d.statusText);
        return false;
      }
      json = { success: false, msg: '请求出错，请联系管理员' };
      var errMsg = typeof (d) == 'object' ? JSON.stringify(d) : d.toString();
      console.error('请求异常' + errMsg);
      setTimeout(function () {
        Object.toCloseLoading();
      }, 100);
      if (callback && typeof (callback) != 'function') {
        throw TypeError('the callback parameter not is a function');
      } else if (callback) {
        callback(json);
      } else {
        if (typeof (d) == 'object') {
          throw new Error('请求出错，请联系管理员' + JSON.stringify(d));
        } else {
          throw new Error('服务器返回出错，请联系管理员' + d.toString());
        }
      }
    }
  });
  return json;
}
//console.log(parseParam(obj));//name=tom&class.className=class1&classMates[0].name=lily
//console.log(parseParam(obj, 'stu'));//stu.name=tom&stu.class.className=class1&stu.classMates[0].name=lily
function parseParam(param, key) {
  var paramStr = "";
  if (param instanceof String || param instanceof Number || param instanceof Boolean) {
    paramStr += "&" + key + "=" + encodeURIComponent(param);
  } else {
    $.each(param, function (i) {
      var k = (key == null || key == undefined) ? i : key + (param instanceof Array ? "[" + i + "]" : "." + i);
      paramStr += '&' + parseParam(this, k);
    });
  }
  return paramStr.substr(1);
}
function _ajaxDownloadFile(url, method, data, isBigData, callback, newFileName, isLoading) {
  if (isBigData == undefined) {
    isBigData = false;
  }
  var postUrl = url + method;
  if (__serverpath != '' && !Object.toStartWith(postUrl, __serverpath) && !Object.toStartWith(postUrl, 'http')) {
    postUrl = __serverpath + postUrl;
  }
  if (data && isBigData == false) {
    postUrl = postUrl + "?" + parseParam(data);
  }
  var author = window.localStorage.getItem('f2bpmAuthor');
  author = eval("(" + author + ")");
  var f2bpmToken = author.token;

  let xhr = new XMLHttpRequest();
  xhr.open('post', postUrl, true);
  xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  //如果需要请求头中这是token信息可以在这设置
  xhr.setRequestHeader('f2bpmToken', f2bpmToken);
  // xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8')
  xhr.responseType = 'blob';
  xhr.addEventListener('progress', function (event) {
    // 响应头要有Content-Length
    //console.log(event)
    if (event && callback) callback(event.loaded, event.total)
  }, false);
  if (isLoading) {
    Object.toShowLoading("正在导出");
  }
  if (isBigData) {
    //发送大数据,大数据只能是字符串，后端使用data参数来接收这些数据
    xhr.send("data=" + encodeURI(data));

  } else {
    xhr.send(null);
  }
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      if (isLoading) {
        Object.toCloseLoading();
      }
      if (!xhr.response || xhr.response.size <= 0) return;
      const blob = new Blob([xhr.response]);
      let url = window.URL.createObjectURL(blob);
      //创建一个a标签元素，设置下载属性，点击下载，最后移除该元素
      let link = document.createElement('a');
      link.href = url;
      link.style.display = 'none';
      //取出下载文件名
      var contentDisposition = xhr.getResponseHeader('Content-Disposition');
      var arr = [];
      if (contentDisposition.indexOf(";") > -1) {
        arr = contentDisposition.split(";");
      }
      var fileName = "";
      $.each(arr, function (i, str) {
        if (str.indexOf("filename=") > -1) {
          fileName = str.substring(str.indexOf("filename=") + 9);
          fileName = decodeURI(fileName.toLowerCase());
        }
      });
      if (newFileName) {
        fileName = newFileName
      } else {
        fileName = fileName.replace(/%/g, '%25');
      }
      const downlaodFileName = decodeURIComponent(fileName);

      link.setAttribute('download', downlaodFileName);
      link.click();
      window.URL.revokeObjectURL(url);
    }
  };
}
//打开新窗口地址进行请求下载附件（手机浏览器或微信端需要使用此方式才能下载）
function _openUrlGetRequestDownloadFile(url, method, data) {
  var getUrl = url + method;
  if (__serverpath != '' && !Object.toStartWith(getUrl, __serverpath) && !Object.toStartWith(getUrl, 'http')) {
    getUrl = __serverpath + getUrl;
  }
  if (data) {
    getUrl = getUrl + "?" + parseParam(data);
  }

  var author = window.sessionStorage.getItem('f2bpmAuthor');
  author = eval("(" + author + ")");
  var f2bpmToken = author.token;
  if (getUrl.indexOf("?") > -1) {
    getUrl = getUrl + "&f2bpmToken=" + f2bpmToken;
  } else {
    getUrl = getUrl + "?f2bpmToken=" + f2bpmToken;
  }
  console.info(getUrl);
  window.top.location.href = getUrl;
}


// function _ajaxDownloadFileXXX(url, method, params) {
//   var postUrl = url + method;
//   if (__serverpath != '' && !Object.toStartWith(postUrl, __serverpath) && !Object.toStartWith(postUrl, 'http')) {
//     postUrl = __serverpath + postUrl;
//   }
//   $.ajax({
//     type: "POST",
//     url: postUrl,
//     data: params,
//     beforeSend: function (XMLHttpRequest) {
//       var author = window.sessionStorage.getItem('f2bpmAuthor');
//       if (author) {
//         author = eval("(" + author + ")");
//         var f2bpmToken = author.token;
//         XMLHttpRequest.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
//         XMLHttpRequest.setRequestHeader('f2bpmToken', f2bpmToken);
//       }
//     },
//     success: function (response, status, request) {
//       //缺少head的鉴权
//       var disp = request.getResponseHeader('Content-Disposition');
//       if (disp && disp.search('attachment') != -1) {
//         var form = $('<form method="POST" action="' + postUrl + '">');
//         $.each(params, function (k, v) {
//           form.append($('<input type="hidden" name="' + k +
//             '" value="' + v + '">'));
//         });
//         $('body').append(form);
//         form.submit();
//       }
//     }
//   });
// }
function _ajaxDownloadFileXXXX(url, method, data) {
  var theData = [];
  var item = { name: 'method', value: method };
  if (!Object.toIsArray(data)) {
    //Json参数形式,需转数组
    var arr = Object.toJsonToArr(data);
    theData = arr;
  } else {
    //数组参数形式
    theData = data;
  };
  var postUrl = url + method;
  if (__serverpath != '' && !Object.toStartWith(postUrl, __serverpath) && !Object.toStartWith(postUrl, 'http')) {
    postUrl = __serverpath + postUrl;
  }
  var form = $("<form method='GET' action='" + postUrl + "'>");
  $('body').append(form);
  var author = window.localStorage.getItem('f2bpmAuthor');
  author = eval("(" + author + ")");
  var f2bpmToken = author.token;
  form.ajaxSubmit({
    data: theData,
    url: postUrl,
    type: 'POST',
    responseType: 'blob',
    headers: {
      "f2bpmToken": f2bpmToken
    }
    , beforeSubmit: function () {
      Object.toShowLoading();
    },
    success: function (data, status, response) {
      form.remove();
      Object.toCloseLoading();
      console.info(response.getResponseHeader('Content-Disposition'));
      var contentDisposition = response.getResponseHeader('Content-Disposition');
      if (contentDisposition && contentDisposition.indexOf("attachment") > -1) {
        var arr = contentDisposition.split(";");
        var fileName = "";
        $.each(arr, function (i, str) {
          if (str.indexOf("filename=") > -1) {
            fileName = str.substring(str.indexOf("filename=") + 9);
            fileName = decodeURI(fileName.toLowerCase());
          }
        });
        var blob = new Blob([data], { type: 'application/x-msdownload;charset=utf-8' });
        var downloadElement = document.createElement('a');
        var href = window.URL.createObjectURL(blob); // 创建下载的链接
        downloadElement.href = href;
        downloadElement.download = fileName; // 下载后文件名
        document.body.appendChild(downloadElement);
        downloadElement.click(); // 点击下载
        window.URL.revokeObjectURL(href); // 释放掉blob对象
      } else {
        alert("下载出错");
      }

    },
    error: function (data) {
      form.remove();
      console.info(data);
      Object.toCloseLoading();
      alert("提交出错：" + data.responseText);
    }
  });
}
/*********************Aajx操作结束******************************************/

/**
 * 给URL最后面加上时间戳,参数 paramObject.a=a paramObject.b=bbb;
 */
function buildUrl(url, paramObject) {
  if (paramObject) {
    var queryString = '';
    var attrs = paramObject.attributes;
    for (var attr in paramObject) {
      var name = attr;
      var value = paramObject[attr];

      if (queryString.length > 0) {
        queryString += '&';
      }
      queryString += name + '=' + encodeURI(value);
    }
    if (queryString.length > 0) {
      if (url.indexOf('?') >= 0) {
        url = url + '&' + queryString;
      } else {
        url = url + '?' + queryString;
      }
    }
  }
  return url;
}

//判断Jquery是否绑定了点击事件：示例： Object.toIsHadBindClickEvent($("#myli"));
function _isHadBindClickEvent(jqueryObject) {
  var objEvt = $._data(jqueryObject[0], 'events');
  if (objEvt && objEvt['click']) {
    return true;
  }
  return false;
}

//加载遮罩层
function _showLoading2(message, loadingId) {
  if ($('#' + loadingId).length > 0) return false;
  var msg = message || ' ';
  if (window && window.document) {
    var paddingtop = parseInt(window.document.documentElement.clientHeight / 2);
    var opacity = 'opacity:0.4;';
    //IE 7 8 9
    if (/msie/.test(navigator.userAgent.toLowerCase())) {
      var ua = navigator.userAgent.toLowerCase();
      var IEVersion = ua.match(/msie ([\d.]+)/)[1];
      if (parseInt(IEVersion) < 10) {
        opacity = 'filter: alpha(opacity =40);';
      }
    }
    //opacity = "filter: alpha(opacity =70);";
    loadingId = loadingId || 'LoadingDiv';
    var srcUrl = __webpath + "/static/images/mask_loading.gif";
    var loadingHtml = '<div id="' + loadingId + '" style=\'text-align:center; border:solid 2px #D4F0FC; font-weight: bold; float: left; width: 98%;  height:98%;line-height: 98%;  position: absolute;  top: 1px; left: 1px; z-index: 99000000;' + opacity + '" style="text-align: center; background-color:#F6F6F6;  font-size: 14px; color:#FE9A81; padding-top:' + paddingtop + 'px;\'><div><img alt="" style=\'margin-bottom:3px;height:32px;width:32px;cursor:pointer\' title=\'关闭遮罩层\' onclick="_closeLoading(\'' + loadingId + '\');" src="' + srcUrl + '"  /></div><div>' + msg + '</div></div>';
    if ($('body')) {
      if ($('#' + loadingId)[0]) {
        $('#' + loadingId).show();
      } else {
        $(document.body).append(loadingHtml);
        $('#' + loadingId).show();
      }
    }
  }
}

/**
 * 全局定义notification提示框
 * @param {*} type 类型 消息通知(normal)、对话框消息(confirm)、进度条消息(progress)
 * @param {*} iconType 标题图标类型(成功、警告、错误)
 * @param {*} closeType 是否显示关闭图标
 * @param {*} title 通知消息的标题
 * @param {*} msg 消息内容
 * @param {*} duration 动画时间 默认是600毫秒
 * @param {*} easing 动画方式  默认线性 "linear"
 * @param {*} title 标题
 * @param {*} msg 展示的消息
 * @param {*} clearTimer 多长时间弹框消失
 * @param {*} isAutoClearNotificat 是否自动关闭消息框
 * @param {*} key 当前消息框唯一的key
 * @param {*} current 当前的进度 只有为进度条(progress)类型时才有这个值
 * @param {*} total 进度的总长度 只有为进度条(progress)类型时才有这个值
 */
function _Notification(data) {
  let { type, iconType, closeType, title, msg, duration, easing, clearTimer, isAutoClearNotificat, key, current, total } = data;
  let elLength = $(".el-notification").length;
  let top = elLength * 80 + 20;
  let name = `el_${elLength}`;
  let progress = (type === 'PROGRESS') ? 'bolck' : 'none';
  let regProgress = (type === 'PROGRESS') ? 'none;' : 'block;';

  if (current >= total) {
    current = total;
  }

  let percentVal = Math.floor(current / total * 100); //计算百分比
  if (total === 0) {
    percentVal = 100;
  }

  //进度条背景颜色
  let curBgColor = (type === 'PROGRESS') ? fnGetBgColor(percentVal) : '#909399';
  console.log("current/total/percent:", `${current}/${total}/${percentVal}%`);
  let lineStyle = 'overflow:hidden;text-overflow:-o-elllipsis-lastline;text-overflow:elllipsis;display:box;-webkit-line-clamp: 2;line-clamp:2;-webkit-box-orient: vertical;display: -webkit-box;font-size: 13px;';

  let lineLimit = (type !== 'PROGRESS') ? lineStyle : '';
  let msgTip = (type !== 'PROGRESS') ? msg : '';

  let titleTip = '';
  if (msgTip.indexOf('(') > -1 && msgTip.indexOf(')') && msgTip.indexOf("</a>") > -1 && msgTip.indexOf("【") > -1 && msgTip.indexOf("】") > -1) {
    let div = `<div>${msgTip}</div>`;
    let aHtml = $(div).find("a").html();
    let index = msgTip.indexOf("(");
    let last = msgTip.indexOf(")");
    titleTip = msgTip.substr(0, index + 1) + aHtml + msgTip.substr(last, msgTip.length - 1);
  } else {
    titleTip = msgTip;
  }
  //进度条
  let progressDiv = `<div role="progressbar" aria-valuenow="${percentVal}" aria-valuemin="0" aria-valuemax="${total}" class="el-progress el-progress--line">
                       <div class="el-progress-bar">
                         <div class="el-progress-bar__outer" style="height: 6px; background-color: rgb(235, 238, 245);">
                           <div class="el-progress-bar__inner" key="${key}" style="width: ${percentVal}%; background-color:${curBgColor}"></div>
                         </div>
                       </div>
                       <div class="el-progress__text" key="${key}" style="font-size: 14.4px; color: rgb(96, 98, 102);">${percentVal}%</div>
                      </div>`;

  let popDiv = `<div role="alert" class="el-notification right" name="${name}" key="${key}" style="top:${top}px; z-index: 9999992000;">
                  <i class="el-notification__icon ${iconType}"></i>
                  <div class="el-notification__group is-with-icon" style="width:100%;">
                    <h2 class="el-notification__title">${title}</h2>
                    <div class="el-notification__content" style="line-height:16px;text-align:left;">
                      <div style="display:${progress}">
                        ${progressDiv}
                      </div>
                      <p title="${titleTip}" style="display:${regProgress}${lineLimit}">${msg}</p>
                    </div>
                    <div key="${key}" class="el-notification__closeBtn ${closeType}" onClick="fnRemovePopDiv(this, '${key}', '${type}')"></div>
                  </div>
                </div>`;


  if (type === 'PROGRESS') {
    let len = window.top.document.getElementsByClassName("el-notification").length;
    let keys = getProgressData().map(item => item.key);
    if (!keys.includes(key) || len === 0) {
      if (window.frames.length > 0 || parent.frames.length > 0) {
        $(window.top.document.body).append(popDiv);
      } else {
        $(document.body).append(popDiv);
      }
      $(`.el-notification[key='${key}']`).css("right", '-350px');
      $(`.el-notification[key='${key}']`).animate({ right: "16px" }, { duration: duration }, easing);
      progressCurData(key, current, total);
      fnSetBgColor(key, current, total);
      removeNotification(key, 6000);
      if (current === total) {
        fnFadeAway(key, 10000);
      }
    } else {
      progressCurData(key, current, total);
      $(`.el-notification[key='${key}']`).css("right", '16px');
      let finishKeys = [];
      let progressData = getProgressData();
      progressData.forEach(item => {
        if (item.current < item.total) {
          fnSettingProgress(item.key, item.current, item.total);
          removeNotification(item.key, 6000);
        }
        else if (item.current == item.total) {
          fnSettingProgress(item.key, item.current, item.total);
          finishKeys.push(item.key);
        } else {
          if (item.current > item.total) {
            item.current = item.total;
            fnSettingProgress(item.key, item.current, item.total);
            finishKeys.push(item.key);
          }
          removeNotification(item.key, 6000);
        }
        fnSetBgColor(item.key, item.current, item.total);
      })

      if (finishKeys.length > 0) {
        for (let j = 0; j < finishKeys.length; j++) {
          let curTimer = 5000 + j * 600;
          fnFadeAway(key, curTimer);
        }
      }
    }
  } else {
    let keys = getProgressData().map(item => item.key);
    if (!keys.includes(key)) {
      if (window.frames.length > 0 || parent.frames.length > 0) {
        $(window.top.document.body).append(popDiv);
      } else {
        $(document.body).append(popDiv);
      }
      $(`.el-notification[key='${key}']`).css("right", '-350px');
      $(`.el-notification[key='${key}']`).animate({ right: "16px" }, { duration: duration }, easing);
    }
    progressCurData(key, 0, 100);
  }

  if (isAutoClearNotificat) {  //true为普通消息框
    if (window.popTimer) {
      clearTimeout(window.popTimer);
    }
    let progressObj = getProgressData();
    let curTimer = 0;
    for (let i = 0; i <= progressObj.length; i++) {
      curTimer = clearTimer + i * 800;
      window.popTimer = setTimeout(() => {
        $(`.el-notification[key='${key}']`).remove();
        filterProgressData(String(key));
      }, curTimer);
    }
    setTimeout(() => { elNotificationNum(); }, curTimer + 800)
  }
}

//设置进度条的宽度和数值
function fnSettingProgress(key, current, total) {
  let percentVal = Math.floor(current / total * 100);
  $(`.el-progress__text[key= ${key}]`).html(`${percentVal}%`);
  $(`.el-progress-bar__inner[key=${key}]`).css("width", `${percentVal}%`);
}

//消息框逐渐消失
function fnFadeAway(key, timer) {
  setTimeout(() => {
    $(`.el-notification[key='${key}']`).remove();
    filterProgressData(key);
    clearNotification();
  }, timer)
}

//过滤掉当前key的对象
function filterProgressData(key) {
  let progressData = getProgressData().filter(item => item.key !== key);
  localStorage.setItem("progressData", JSON.stringify(progressData))
}

//清除进度条进行移位
function clearNotification() {
  // let elData = myData.progressData;
  let elData = getProgressData();
  if (elData.length > 0) {
    let top = 80;
    for (let i = 0; i <= elData.length; i++) {
      if (elData[i] && elData[i].key && $(`.el-notification[key='${elData[i].key}']`).position()) {
        $(`.el-notification[key='${elData[i].key}']`).css("top", `${top * i + 20}px`);
      }
    }
  }
}

//点击删除图标
function fnrRemovePopDiv(_this, mKey) {
  $(_this).parent().parent().remove();
  filterProgressData(String(mKey));
  clearNotification();
}

//移除当前的消息框
function fnRemovePopDiv(_this, _key, _type) {
  $(_this).parent().parent().remove();
  filterProgressData(_key);
  clearNotification();
}

//显示当前的消息框的关闭按钮
function removeNotification(key, timer) {
  setTimeout(() => {
    $(`.el-notification__closeBtn[key=${key}]`).addClass('el-icon-close');
  }, timer);
}

//根据current获取当前进度条的背景颜色
function fnGetBgColor(current) {
  if (current <= 30) {
    return '#909399';
  } else if (current > 30 && current < 70) {
    return '#e6a23c';
  } else {
    return '#67c23a';
  }
}

/**
 * 改变进度条的背景颜色
 * @param {*} key
 * @param {*} current
 * @param {*} total
 */
function fnSetBgColor(key, current, total) {
  let percentVal = Math.floor(current / total * 100);
  let bgColor = fnGetBgColor(percentVal);
  $(`.el-progress-bar__inner[key=${key}]`).css('background-color', bgColor);
}

//存储当前进度条的对象
function progressCurData(key, current, total) {
  let progressArray = getProgressData();
  let keys = progressArray.map(item => item.key);
  if (keys.includes(key)) {
    let progressData = getProgressData();
    progressData.find(f => f.key === key).current = current;
    progressData.find(f => f.key === key).total = total;
    localStorage.setItem('progressData', JSON.stringify(progressData));
  } else {
    let pData = { key: key, current: current, total: total };
    let pArray = [pData, ...getProgressData()];
    localStorage.setItem('progressData', JSON.stringify(pArray));
  }
}

function getProgressData() {
  let progressData = localStorage.getItem("progressData");
  return progressData ? JSON.parse(progressData) : [];
}

//重新定义所有消息框的位置
function elNotificationNum() {
  let elData = getProgressData();
  if (elData.length > 0) {
    let top = 80;
    for (let i = elData.length; i >= 0; i--) {
      if (elData[i] && elData[i].key && $(`.el-notification[key='${elData[i].key}']`).position()) {
        $(`.el-notification[key='${elData[i].key}']`).css("top", `${top * i + 20}px`);
      }
    }
  }
}

//清除所有的消息框
function clearAllNotification() {
  let elData = getProgressData();
  if (elData.length > 0) {
    for (let i = 0; i <= elData.length; i++) {
      if (elData[i] && elData[i].key && $(`.el-notification[key='${elData[i].key}']`)) {
        $(`.el-notification[key='${elData[i].key}']`).remove();
      }
    }
    localStorage.removeItem("progressData")
  }
}

//加载遮罩层
function _showLoading(message, loadingId) {
  if (loadingId && $('#' + loadingId).length > 0) return false;
  var opacity = 'opacity:0.2;';
  //IE 7 8 9
  if (/msie/.test(navigator.userAgent.toLowerCase())) {
    var ua = navigator.userAgent.toLowerCase();
    var IEVersion = ua.match(/msie ([\d.]+)/)[1];
    if (parseInt(IEVersion) < 10) {
      opacity = 'filter: alpha(opacity =20);';
    }
  }
  var msg = message || ' ';
  loadingId = loadingId || 'LoadingDiv';//background-color:#F6F6F6;
  var srcUrl = __webpath + "/static/images/mask_loading.gif";
  var loadingHtml = '<div id="' + loadingId + '" style=\'width:99%; height: 99%; text-align:center; border:0;   position: absolute;  top:1px; z-index: 29891015;  ' + opacity + '\'><div style="position: relative;  top:40%;"><img alt="" style=\'margin-bottom:3px;height:32px;width:32px;cursor:pointer\' title=\'关闭遮罩层\' onclick="_closeLoading(\'' + loadingId + '\');" src="' + srcUrl + '" /><div>' + msg + '</div></div></div>';
  if (loadingId == 'LoadingDiv' && $('#' + loadingId).length > 0) {
    $('#' + loadingId).remove();
  }
  if ($('body')) {
    if ($('#' + loadingId).length > 0) {
      $('#' + loadingId).show();
    } else {
      $(document.body).append(loadingHtml);
      $('#' + loadingId).show();
    }
  }
}

//关闭遮罩层
function _closeLoading(loadingId) {
  loadingId = loadingId || 'LoadingDiv';
  if ($('#' + loadingId).length > 0) {
    $('#' + loadingId).remove();
    //$('#' + loadingId).hide();
  }
}

/////////////////////////////////////////////////// 窗口结束///////////////////////////////////

///////////////////////////////////////////////////Xml操作///////////////////////////////////
//创建Xml文档对象
//是否给xmlText加一个Root根节点,默认否
//$(xmlDoc).find("Root>Item").each(function () {
//$(this).attr("Text")取属性
//$(this).text() 取内容
//});
function _createXmlDoc(xmlText, isNeedAddRoot) {
  var xmlDoc = null;
  var addRoot = isNeedAddRoot || false;
  if (addRoot) {
    xmlText = '<Root>' + xmlText + '</Root>';
  }
  try //Internet Explorer
  {
    xmlDoc = new ActiveXObject('Microsoft.XMLDOM');
    xmlDoc.async = 'false';
    xmlDoc.loadXML(xmlText);

  } catch (e) {
    try //Firefox, Mozilla, Opera, etc.
    {
      parser = new DOMParser();
      xmlDoc = parser.parseFromString(xmlText, 'text/xml');
    } catch (e) {
    }
  }
  return xmlDoc;
}

///////////////////////////////////////////////////Xml操作结束///////////////////////////////////

// 根据某个字段实现对json数组的排序
//data:要排序的数据
//field:排序的字段
//isreverse:是否倒序
//isReSetOrderNum：是否重置排序号从小到大
//stepLength:重置排序号的步长，默认为1
function _dataSort(data, field, reverse, isReSetOrderNum, stepLength) {
  if (stepLength == undefined) {
    stepLength = 1;
  }
  //数组长度小于2 或 没有指定排序字段 或 不是json格式数据
  if (data.length < 2 || !field || typeof data[0] !== "object") return data;
  //数字类型排序
  if (typeof data[0][field] === "number") {
    data.sort(function (x, y) { return x[field] - y[field]; });
  }
  //字符串类型排序
  if (typeof data[0][field] === "string") {
    data.sort(function (x, y) { return x[field].localeCompare(y[field]); });
  }
  //倒序
  if (reverse) {
    data.reverse();
  }
  if (isReSetOrderNum) {
    data.forEach(function (item, index, arr) {
      item[field] = index + stepLength;
    });
  }
  return data;
}
//======================================================
//递归在树形结构中查找某个项[{id:,title:,children:[]}]
//arr:树形结构的数据源
//id:要查找的项
//返回项定义实体
//isDirectReturn:找到一个时是否直接返回，true,false
function _treeFindItem(arr, id, isDirectReturn) {
  if (arr == null) return null;
  for (let obj of arr) {
    if (obj.id == id) {
      if (isDirectReturn) {
        return obj;
      } else {
        return _tree_rec_find_collect(obj);
      }
    }
    let ret = _treeFindItem(obj.children, id, isDirectReturn);
    if (ret) return ret;
  }
  return null;
}
function _tree_rec_find_collect(obj) {
  let ret = obj;
  if (obj.children) {
    for (let o of obj.children) {
      //数组的合并
      ret = [...ret, ..._tree_rec_find_collect(o)];
    }
  }
  return ret;
}
/**
 * 递归收集树形列表中指定属性的值，可指定收集的层级
 * [{id:,title:,children:[]}]
 * list:树形结构数据
 * idFieldName:属性名
 * listResult:收集的结果
 * levelN:收集到第几级，默认不限级数，从第一级开始
 */
function _toTreeCollection(arr, fieldName, listResult, levelN) {
  if (arr == null) return null;
  for (let item of arr) {
    let idValue = item[fieldName];
    listResult.push(idValue);
    var children = item.children;
    if (children && children.length > 0) {
      _toTreeCollectionItem(children, fieldName, listResult, levelN, 2);
    }
  }
  return listResult;
}
function _toTreeCollectionItem(children, fieldName, listResult, levelN, currLevel) {
  if (children == null) return null;
  if (levelN != null && levelN != undefined && levelN != 0 && levelN == currLevel) {
    return;
  }
  currLevel++;
  for (let item of children) {
    let idValue = item[fieldName];
    listResult.push(idValue);
    var theChildren = item.children;
    if (theChildren && theChildren.length > 0) {
      _toTreeCollectionItem(theChildren, fieldName, listResult, levelN, currLevel);
    }
  }
}
//======================================================


$.mypost = function (url, parms, callback) {
  Object.toAjaxJson(url, '', parms, null, null, callback);
};
$.extendAjax = function (url, data, type, callback, contentType) {
  Object.toExtendAjax(url, '', data, null, type, callback, contentType);
};
