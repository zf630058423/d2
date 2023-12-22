var f2bpm_VlidateRules = {
  required: [
    /[\S]+/
    , '必填项不能为空'
  ],
  ip: [
    /((25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))/,
    'IP地址不正确'
  ]
  , mobile: [
    /^1\d{10}$/
    , '请输入正确的手机号'
  ],
  phone: function (value, domObj) {
    if (value != '' && !(/^1\d{10}$/.test(value))) {
      return '请输入正确的手机号';
    }
  }
  , email: [
    /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/
    , '邮箱格式不正确'
  ]
  , url: [
    /(^#)|(^http(s*):\/\/[^\s]+\.[^\s]+)/
    , '链接格式不正确'
  ]
  , number: [
    /^\d+(\.\d+)?$/
    , '只能填写数字'
  ]
  , date: [
    /^(\d{4})[-\/](\d{1}|0\d{1}|1[0-2])([-\/](\d{1}|0\d{1}|[1-2][0-9]|3[0-1]))*$/
    , '日期格式不正确，正确格式为：yyyy-MM-dd'
  ]
  , datetime: [
    /^((\d{2}(([02468][048])|([13579][26]))[\-\/\s]?((((0?[13578])|(1[02]))[\-\/\s]?((0?[1-9])|([1-2][0-9])|(3[01])))|(((0?[469])|(11))[\-\/\s]?((0?[1-9])|([1-2][0-9])|(30)))|(0?2[\-\/\s]?((0?[1-9])|([1-2][0-9])))))|(\d{2}(([02468][1235679])|([13579][01345789]))[\-\/\s]?((((0?[13578])|(1[02]))[\-\/\s]?((0?[1-9])|([1-2][0-9])|(3[01])))|(((0?[469])|(11))[\-\/\s]?((0?[1-9])|([1-2][0-9])|(30)))|(0?2[\-\/\s]?((0?[1-9])|(1[0-9])|(2[0-8]))))))(\s((([0-1][0-9])|(2?[0-3]))\:([0-5]?[0-9])((\s)|(\:([0-5]?[0-9])))))?$/
    , '日期时间格式不正确，正确格式为：yyyy-MM-dd HH:mm:ss'
  ]
  , identity: [
    /(^\d{15}$)|(^\d{17}(x|X|\d)$)/
    , '请输入正确的身份证号'
  ]
  , username: function (value, item) { // value：表单的值、item：字段字义
    if (value != '' && !new RegExp('^[a-zA-Z0-9_\u4e00-\u9fa5\\s·]+$').test(value)) {
      return '用户名不能有特殊字符';
    }
    if (value != '' && /(^\_)|(\__)|(\_+$)/.test(value)) {
      return '用户名首尾不能出现下划线\'_\'';
    }
    if (value != '' && /^\d+\d+\d$/.test(value)) {
      return '用户名不能全为数字';
    }
  }
  , CHS: [/^[\u0391-\uFFE5]+$/, '请输入汉字']
  , ZIP: [/^[1-9]\d{5}$/, '邮政编码格式不正确']
  , QQ: function (value, domObj) {
    if (value != '' && !(/^[1-9]\d{4,10}$/.test(value))) {
      return 'QQ号码格式不正确';
    }
  }
  , englisthOrNumberChar: [/^[A-Za-z0-9]+$/, '只能输入数字或英文字母组成的字符串']
  , englisthOrChar: [/^[A-Za-z_]+$/, '只能输入英文字母或下划线组成的字符串']
  , onlyenglisth: [/^[A-Za-z]+$/, '只能输入英文字母组成的字符串']
  , onlyBigEnglisthChar: [/^[A-Z]+$/, '只能输入大写英文字母']
  , englishchar: [/^[a-zA-Z][a-zA-Z0-9_]{0,200}$/, '必须以字母开头,仅允许出现“字母”或“数字”或“下划线”']
  , englishchar2: [/^[a-zA-Z][a-zA-Z0-9_-]{0,200}$/, '必须以字母开头,仅允许出现“字母”或“数字”或“下划线”或“中划线”']
  , englishchar3: [/^[a-zA-Z0-9_-]{0,200}$/, '只能由“字母”、“数字”、“下划线”、“中划线”组成的字符串']
  , chars: [/^^\w+$/, '只能由数字、英文字母、下划线组成的字符串']
  , charss: [/^[a-zA-Z][a-zA-Z0-9_,]{0,300}$/, '必须以字母开头,仅允许“字母”“数字”“下划线”和“英文逗号”']
  , safepass: [/^.*(?=.{8,64})(?![a-zA-z]+$)(?!\d+$)(?![!@#$%^&*]+$)(?![a-zA-z\d]+$)(?![a-zA-z!@#$%^&*]+$)(?![\d!@#$%^&*]+$)[a-zA-Z\d!@#$%^&*]+$/, '必须由字母、数字、特殊字符所组成长度至少8位']
  , zint: [/^[1-9]\d*$/, '请输入正整数']
  , fint: [/^-[1-9]\d*$/, '请输入负整数']
  , int: [/^-?[0-9]\d*$/, '请输入整数']
  , positive: [/^[1-9]\d*\.\d*|0\.\d*[1-9]\d*$/, '请输入正确的正浮点数']
  , oneTo100: function (value, domObj) {
    if (value != '' && !(/^[1-9]\d*$/.test(value) && value >= 1 && value <= 100)) {
      return '请输入1到100之间正整数';
    }
  }
  , biggerZero: function (value, domObj) {
    if (value != '' && !(Object.toIsNumber(value) && Number(value) > 0)) {
      return '请输入大于0的数字';
    }
    return '';
  }
  , biggerOrEqualZero: function (value, domObj) {
    if (value != '' && !(Object.toIsNumber(value) && Number(value) >= 0)) {
      return '请输入大于0的数字';
    }
  }
  , litterOrEqualZero: function (value, domObj) {
    if (value != '' && !(Object.toIsNumber(value) && Number(value) <= 0)) {
      return '请输入小于等于0的数字';
    }
    return '';
  }
  , floatNumber: function (value, domObj) {
    if (value != '' && !Object.toIsNumber(value)) {
      return '请输入数字';
    }
    return '';
  }
  , idcard: function (value, domObj) {
    var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    if (value && !reg.test(value)) {
      return '请输入正确的身份证号码';
    }
    return '';
  }
  , regular: function (value, domObj) {
    var fieldverifyrule = domObj.fieldVerifyRule || '';
    var regular = '';
    var regularTitle = '';
    if (fieldverifyrule) {
      var json = eval('(' + fieldverifyrule + ')');
      regular = json.regular;
      regularTitle = json.regularTitle;
    }
    if (regular && value != '') {
      if (Object.toIsNumber(value)) {
        value = Number(value);
      }
      var reg = new RegExp(regular);
      if (!(reg.test(value))) {
        return regularTitle + '';
      }
    }
  }
  // 我们既支持上述函数式的方式，也支持 数组的形式
  // 数组的两个值分别代表：[正则匹配、匹配不符时的提示文字]
  , passwrod: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格']
};
//{validator: FUI.GetValidatorRule('ip')}
FUI.GetValidatorRule = function (ruleName) {
  //长度校验特殊处理：FUI.GetValidatorRule('len[1,20]') 
  if (ruleName.indexOf("len") > -1) {
    return getValidateLengthfun(ruleName);
  } else {
    var arr = f2bpm_VlidateRules[ruleName];
    return function (rule, value, callback) {
      var isPass = arr[0].test(value);
      var msg = arr[1];
      var isNotEmpty = value != '';
      if (ruleName == 'required') {
        isNotEmpty = true;
      }
      if (isNotEmpty && !isPass) {
        callback(new Error(msg));
      } else {
        callback();
      }
    };
  }
};
//校验长度的校验器
function getValidateLengthfun(ver) {
  return function (rule, value, callback) {
    if (ver.indexOf("len") > -1) {
      var arrMiMx = eval(ver.replace("len", ""));
      var min = arrMiMx[0];
      var max = arrMiMx[1];
      var isPass = true;
      var msg = "";
      if (min && value.length < parseInt(min)) {
        msg = "输入长度不能小于" + min + "个字符";
        isPass = false;
      } else if (max && value.length > parseInt(max)) {
        msg = "输入长度不能大于" + max + "个字符";
        isPass = false;
      }
      var isNotEmpty = value != '';
      if (isNotEmpty && !isPass) {
        callback(new Error(msg));
      } else {
        callback();
      }
    }
  };
}
//返回空表示校验通过，返回非字表示出错的原因
FUI.ValidValue = function (value, ruleName) {
  if (ruleName == 'required') {
    return value != '' && value != null && value != undefined;
  }
  if (value == "" || value == undefined || value == null) {
    return "";
  }
  var arr = f2bpm_VlidateRules[ruleName];
  var isPass = arr[0].test(value);
  var msg = arr[1];
  if (!isPass) {
    return msg;
  } else {
    return "";
  }
};

FUI.Validator = {
  required: FUI.GetValidatorRule('required'),
  ip: FUI.GetValidatorRule('ip'),
  number: FUI.GetValidatorRule('number'),
  onlyBigEnglisthChar: FUI.GetValidatorRule('onlyBigEnglisthChar'),
  englishchar: FUI.GetValidatorRule('englishchar'),
  onlyenglisth: FUI.GetValidatorRule('onlyenglisth'),

  englisthOrChar: FUI.GetValidatorRule('englisthOrChar'),
  chars: FUI.GetValidatorRule('chars'),
  email: FUI.GetValidatorRule('email'),
  mobile: FUI.GetValidatorRule('mobile'),
  englisthOrNumberChar: FUI.GetValidatorRule('englisthOrNumberChar'),
  identity:FUI.GetValidatorRule('identity')  //身份证号校验
};

//表单整个Data校验
//isNotToCheckTheEmptyValue:是否空值时不校验
FUI.validate = function (fieldsDef, data, ignoredValidateFieldArr, isNotToCheckTheEmptyValue) {
  var isSuccess = false;
  //校验主表
  isSuccess = FUI.validateRow(fieldsDef, data, null, ignoredValidateFieldArr, isNotToCheckTheEmptyValue);
  if (isSuccess == false) {
    return isSuccess;
  }
  //校验子表
  $.each(fieldsDef, function (name, item) {
    if (Object.toStartWith(name, "subtable")) {
      var subfieldsDef = item;
      var rows = data[name];
      $.each(rows, function (index, row) {
        if (isSuccess == true) {
          isSuccess = FUI.validateRow(subfieldsDef, row, index, ignoredValidateFieldArr, isNotToCheckTheEmptyValue);
          if (isSuccess == false) {
            return isSuccess;
          }
        }
      });
    }
  });
  return isSuccess;
};

//单行数据表单校验，fieldsDef需要校验的多个元素
//子列表时才有：rowIndex，索引所在行
FUI.validateRow = function (fieldDefList, data, rowIndex, ignoredValidateFieldArr, isNotToCheckTheEmptyValue) {
  var result = true;
  //循环逐个字段进行校验
  $.each(fieldDefList, function (fieldName, fieldDef) {
    if (result == false) {
      return false;
    }
    //循环逐个字段进行校验
    if (Object.toStartWith(fieldName, "subtable") || fieldName.indexOf(".MyId") > -1) {

      return true;
    }
    var fieldValue = data[fieldName];
    if (fieldName == undefined || fieldName == null || Object.toStartWith(fieldName, "subtable") || fieldName.indexOf(".MyId") > -1) {
      return true;
    }
    if (ignoredValidateFieldArr && ignoredValidateFieldArr.length > 0 && $.inArray(fieldName, ignoredValidateFieldArr) != -1) {
      //不校验的字段
      return true;
    }
    //空值不做校验
    if (isNotToCheckTheEmptyValue === true && (fieldValue == null || fieldValue == "" || fieldValue == undefined || fieldValue.length == 0)) {
      return true;
    }
    var isPass = FUI.validateSingleField(fieldDef, fieldValue, rowIndex, isNotToCheckTheEmptyValue);
    if (isPass == false) {
      result = false;
    }
    return isPass;
  });
  return result;
};
//校验单个字段
//fieldDef:字段字义
//fieldValue:字段值
//rowIndex：子表时才需要传，指定明哪一行，以更定位fouse
//isToCheckTheEmptyValue:空值的时候是否校验
//返回是否通过，通过返回true，不通过返回false
FUI.validateSingleField = function (fieldDef, fieldValue, rowIndex, isNotToCheckTheEmptyValue) {
  var result = true;
  var verify = f2bpm_VlidateRules;
  if (isNotToCheckTheEmptyValue === true && (fieldValue == '[]' || fieldValue == null || fieldValue == "" || fieldValue == undefined || fieldValue.length == 0)) {
    return true;
  }
  var fieldName = fieldDef.vModel;
  //循环逐个字段进行校验
  if (fieldName == undefined || fieldName == null || Object.toStartWith(fieldName, "subtable") || fieldName.indexOf(".MyId") > -1) {
    return true;
  }
  //是否为子列表
  var nameArr = fieldName.split('.');
  var isSubTable = nameArr.length >= 3;
  var tableName = isSubTable ? nameArr[1] : nameArr[0];
  var tips = "";
  //收集校验规则
  var arr = [];
  // 获取提醒的字段中文
  var filedTitle = fieldDef.label;
  //限制输入长度,改由在Vue输入框自身的maxlength决定。
  var fieldLength = fieldDef.fieldLength || "";
  if (filedTitle) {
    filedTitle = "“" + filedTitle + "”";
  }
  if (fieldDef._isRequired == true) {
    arr.push(["required"]);
  }

  if (fieldDef.fieldDataType != "" && fieldDef.fieldDataType != undefined) {
    if (fieldDef.fieldDataType.indexOf("|") > -1) {
      var validTypeArr = fieldDef.fieldDataType.split("|");
      $.each(validTypeArr, function (_, vType) {
        vType = vType.replace("length", "len");
        arr.push(vType);
      });
    } else {
      var validtype = fieldDef.fieldDataType.replace("length", "len");
      arr.push(validtype);
    }
  }
  for (var i in arr) {
    if (result == false) {
      return false;
    }
    var ver = arr[i];
    var isFn = typeof verify[ver] === 'function';
    //====================自定义len[1,20] 长度范围的校验===========================
    if (ver.indexOf("len") > -1) {
      var arrMiMx = eval(ver.replace("len", ""));
      var min = arrMiMx[0];
      var max = arrMiMx[1];
      if (min && fieldValue.length < parseInt(min)) {
        layer.msg(filedTitle + (tips || "输入长度不能小于" + min + "个字符"), { icon: 5, shift: 6 });
        // 非移动设备自动定位焦点
        if (!Object.toIsMobile()) {
          if (isSubTable) {
            var $tr = $("table[tablename='" + tableName + "'] tr").eq(rowIndex + 1);
            $("[name='" + fieldName + "']", $tr).focus();
          } else {
            $("[name='" + fieldName + "']").focus();
          }
        }
        result = false;
        return false;
      }
      if (max && fieldValue.length > parseInt(max)) {
        layer.msg(filedTitle + (tips || "输入长度不能超过" + max + "个字符"), { icon: 5, shift: 6 });
        // 非移动设备自动定位焦点
        if (!Object.toIsMobile()) {
          if (isSubTable && rowIndex != null && rowIndex != undefined) {
            var $tr = $("table[tablename='" + tableName + "'] tr").eq(rowIndex + 1);
            $("[name='" + fieldName + "']", $tr).focus();
          } else {
            $("[name='" + fieldName + "']").focus();
          }
        }
        result = false;
        return false;
      }
      //====================自定义len[1,20] 长度范围的校验 End===========================
    } else if (verify[ver]) {
      var notPass = false;
      if (isFn) {
        tips = verify[ver](fieldValue, fieldDef);
        notPass = tips != "" && tips != undefined && tips != null;
      } else if (ver != "required" && fieldValue) {
        notPass = !verify[ver][0].test(fieldValue);
      } else if (ver == "required") {
        if (fieldValue == undefined || fieldValue == null || fieldValue == '[]') {
          notPass = true;
        } else {
          notPass = !verify[ver][0].test(fieldValue);
        }
      }
      //校验不能过
      if (notPass == true) {
        layer.msg(filedTitle + (tips || verify[ver][1]), { icon: 5, shift: 6 });
        // 非移动设备自动定位焦点
        if (!Object.toIsMobile()) {
          if (isSubTable) {
            var $tr = $("table[tablename='" + tableName + "'] tr").eq(rowIndex + 1);
            $("[name='" + fieldName + "']", $tr).focus();
          } else {
            $("[name='" + fieldName + "']").focus();
          }
        }
        result = false;
        return false;
      }
    }
  }
  return result;
};

/*校验子表的必填行数：子表必须为可见才会校验 
*fieldDef：子表定义
*返回true校验通过，返回false校验不通过
*/
FUI.validateRequiredNumOfRows = function (subTableDef) {
  let isPass = true;
  let label = subTableDef.label;
  let tableName = subTableDef.vModel.replace('subtable.', '');
  // 多tab时会隐藏
  // let visible = $("table[tablename='" + tableName + "']").is(':visible');
  // if (visible == false) {
  //   return true;
  // }
  let requiredNum = subTableDef.requiredNumOfRows || 0;
  if (requiredNum == 0) {
    return true;
  }
  let rows = FUI.F2Grid.getSubData(tableName);
  if (rows.length < requiredNum) {
    FUI.Window.showMsg('【' + label + '】至少需要添加' + requiredNum + '条数据');
    isPass = false;
    return false;
  }
  return isPass;
};