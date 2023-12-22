



export default {

  requiredList: [],

  /** 加入提示信息
   * 输入框、下拉框、弹框提示信息
   */
  tipMsg: {
    AUTO_PLACEHOLDER: '自动带出',
    SYSTEM_PLACEHOLDER: '系统计算',
    ENTER_PLACEHOLDER: '请输入',
    SELECT_PLACEHOLDER: '请选择',
    REQUIRED_MSG: '必填项不能为空',
    FOUR_CHARACTER: '至少输入4个汉字',
    DATE_PLACEHOLDER:'请选择日期'
  },

  /**
   * 参数 item校验规则对象{rule:'required|phone',msg:'自定义提示信息'}
   * rule   校验规划字典key,多个以|分隔
   * maxLength  字符串的最大长度
   * min 和 max 必须同时给 min < max
   * regexp 自定义正则
   * msg:不传取设置message,若传显示自定义的提示信息
   * */
  requiredRules(item) {
    const dic = {
      required: { required: true, message: item.msg ?? '必填项不能为空', trigger: ['blur', 'change'] },
      email: { type: 'email', message: item.msg ?? '请输入正确的邮箱地址', trigger: 'blur' },
      phone: { pattern: /^1[\d]{10}$/, message: item.msg ?? '请输入正确的手机号码', trigger: 'blur' },
      idCard: { pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/, message: item.msg ?? '请输入15或者18位身份证号码', trigger: 'blur' },
      int: { pattern: /^-?[1-9]\d*$/, message: item.msg ?? '请输入非0的整数', trigger: 'blur' },
      num: { pattern: /^[0-9]*$/, message: item.msg ?? '请输入数字', trigger: 'blur' },
      ip: { pattern: /^((([01]?[0-9]{1,2})|(2[0-4][0-9])|(25[0-5]))[.]){3}(([0-1]?[0-9]{1,2})|(2[0-4][0-9])|(25[0-5]))$/, message: item.msg ?? '请输入正确的ip地址', trigger: 'blur' },
      mac: { pattern: /^[A-F0-9]{2}(-[A-F0-9]{2}){5}$|^[A-F0-9]{2}(:[A-F0-9]{2}){5}$/, message: item.msg ?? '请输入正确的mac地址', trigger: 'blur' },
      pwd: { pattern: /^(?![A-Z]+$)(?![a-z]+$)(?!\d+$)(?![\W_]+$)\S{8,18}$/, message: item.msg ?? '请输入8-18位，大写字母、小写字母、数字、特殊字符中的2种', trigger: 'blur' },
      tel: { pattern: /^[0-9]{7,8}$/, message: item.msg ?? '请输入正确的电话号码', trigger: 'blur' },
      call: { pattern: /(^1[\d]{10}$)|(^[0][1-9]{2,3}-[0-9]{5,10}$)|(^[0-9]{5,10}$)/, message: item.msg ?? '请输入正确的手机或者电话号码' }
    }

    let rules = [];
    if (item.rule) {
      const arr = item.rule.split('|')
      arr.map(x => {
        rules.push(dic[x])
      })
    }

    if (item.maxLength) {
      rules.push({ min: 1, max: item.maxLength, message: '最多输入' + item.maxLength + '个字符!', trigger: 'blur' })
    }
    if (item.min && item.max) {
      rules.push({ min: item.min, max: item.max, message: '字符长度在' + item.min + '至' + item.max + '之间!', trigger: 'blur' })
    }
    if (item.regexp) {
      rules.push({ pattern: item.regexp, message: item.msg, trigger: 'blur' });
    }
    return rules;
  },

  /**
   * 添加默认必填项字段
   * @param {requiredArray: 数组}  必填项数组字段
   * @returns
   */
  dataRule(requiredArray) {
    this.requiredList = requiredArray;
    let { REQUIRED_MSG } = this.tipMsg;
    let ruleData = {};
    if (requiredArray.length > 0) {
      for (let item of requiredArray) {
        ruleData[`${item}`] = [
          { required: true, message: REQUIRED_MSG, trigger: ['blur', 'change'] }
        ]
      }
    }
    return ruleData;
  },
  /**
   * 单个设置必填状态
   * @param {*} status 是否必填
   * @param {*} event 事件
   * @param {*} msg 提示信息
   * @returns
   */
  curFiledRule(status, event = 'blur', msg) {
    let { REQUIRED_MSG } = this.tipMsg;
    return [
      { required: status, message: msg || REQUIRED_MSG, trigger: event }
    ]
  },

  /**
   * 单个设置必填状态
   * @param {*} status 是否必填
   * @param {*} event 事件
   * @param {*} msg 提示信息
   * @returns
   */
  requiredFiledRule(dataRule, filed, status, event = 'blur', msg) {
    let { REQUIRED_MSG } = this.tipMsg;
    if (this.requiredList.includes(filed)) {
      return [
        { required: status, message: msg || REQUIRED_MSG, trigger: event }
      ]
    }
    return {
      ...dataRule,
      [filed]: [
        { required: status, message: msg || REQUIRED_MSG, trigger: event }
      ]
    }
  },


  /**
   * 自定义当前校验规则
   * @param {*} status
   * @param {*} callback
   * @param {*} event
   * @param {*} msg
   * @returns
   */
  curCustomRule(status, callback, event = 'blur') {
    let { REQUIRED_MSG } = this.tipMsg;
    return [
      { required: status, message: REQUIRED_MSG, trigger: event },
      { validator: callback, trigger: event }
    ]
  },


  /**
   * 跟据状态判断多个控件是否为必填
   * @param {*} status 当前控件选的状态
   * @param {*} event 事件
   * @param {*} msg 提示信息
   * @param {*} fileArray 要设置是否为必填的字段
   */
  rowsFiledRule(status, event = 'blur', msg, fileArray) {
    let { REQUIRED_MSG } = this.tipMsg;
    let ruleData = {};
    if (fileArray.length) {
      for (let item of fileArray) {
        ruleData[`${item}`] = [
          { required: status, message: msg || REQUIRED_MSG, trigger: event }
        ]
      }
    }
    return ruleData;
  }

}
