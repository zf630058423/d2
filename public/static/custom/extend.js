Object.extend(Object, {
  //流程审批根据状态判断是否可删除
  optionBeforeDelete(that, value, row, index) {
    const currUser = that.$store.state.user.author;
    if (currUser.userId == "3c1df0b3-a4d9-4731-b143-02e81bce17ce") return true;
    if (!row.Wiid) return true;
    var state = parseInt(row.ProcInstState);
    if (state == 1)
      return true;
    else {
      var text = "";
      switch (state) {
        case 0:
          text = myvm != null ? myvm.$t('wfstatus.noInstance') : "拟稿";
          break;
        case 1:
          text = myvm != null ? myvm.$t('wfstatus.draft') : "草稿";
          break;
        case 2:
          text = myvm != null ? myvm.$t('wfstatus.running') : "审批中";
          break;
        case 3:
          text = myvm != null ? myvm.$t('wfstatus.completed') : "已完成";
          break;
        case 4:
          text = myvm != null ? myvm.$t('wfstatus.suspend') : "已挂起";
          break;
        case 5:
          text = myvm != null ? myvm.$t('wfstatus.returnDraft') : "驳回发起人";
          break;
        case 6:
          text = myvm != null ? myvm.$t('wfstatus.returnActivity') : "退&nbsp;回";
          break;
        case 99:
          text = myvm != null ? myvm.$t('wfstatus.canceled') : "已作废";
          break;
        case 100:
          text = myvm != null ? myvm.$t('wfstatus.deleted') : "已删除";
          break;
      }
      FUI.Window.showMsg2("流程状态【" + text + "】禁止删除");
      return false;
    }
  },
  //删除后置事件
  optionAfterDelete(that, value, row, index, callback) {
    console.log('删除后置事件,单条')
    callback();
  },
  //流程审批根据状态判断是否可删除---批量
  toolBarBeforeDelete(that, idFieldValues) {
    const currUser = that.$store.state.user.author;
    if (currUser.userId == "3c1df0b3-a4d9-4731-b143-02e81bce17ce") return true;
    var rows = that.dg.getCheckedRows();
    var isOk = true;
    rows.forEach(row => {
      if (row.Wiid && row.Wiid.trim().length > 0) {
        if (row.ProcInstState != 1) {
          FUI.Window.showMsg2("流程进行中数据禁止删除");
          that.dg.Reload();
          isOk = false;
          return;
        }
      }
    });
    return isOk;
  },
  //删除后置事件 批量
  toolBarAfterDelete(that, idFieldValues, callback) {
    console.log('删除后置事件,批量')
    var rows = that.dg.getCheckedRows();
    rows.forEach(row => {
      row._checked = row.ProcInstState == 1;
    });
    var wiids = that.dg.getChecked('Wiid');
    callback()
  },
  // 无流程表单跳转
  siteLink(vm, tableName, id) {
    var data = [{
      "tableName": tableName,
      "myId": id
    }]
    $.extendAjax("/extend/hyperLink/getHyperLink", JSON.stringify(data), "post", function (res) {
      if (res) {
        var formId = res.data[0].formId;
        var myId = res.data[0].myId;
        var businessKey = res.data[0].businessKey;
        var dg = FUI.DataGrid.Create(vm, tableName, tableName, 'grid', true, true, true);
        var url = '/workflow/noWorkflowform/index/?formId=' + formId + '&myId=' + myId + '&businessKey=' + businessKey;
        var preTitle = '查看';
        var wfAction = 3;
        FUI.Window.openEdit(url, preTitle, wfAction, dg.GridId, null, null, null, dg.MainTable, '', true);
      }
    });
  },
  // 流程表单跳转
  siteWiidLink(vm, tableName, id) {
    //tableName:需要跳转到的表单的表名
    // id： 需要跳转到的表单的myID
    var data = [{
      "tableName": tableName,
      "myId": id
    }];
    $.extendAjax("/extend/hyperLink/getHyperLink", JSON.stringify(data), "post", function (res) {
      if (res) {
        var __webpath = '';
        var appId = '';
        var formAction = 3;
        var wiid = res.data[0].wiId;
        var url = __webpath + '/workflow/workflowform/index/?appId=' + appId + '&formAction=' + formAction + '&wiid=' + wiid;
        window.open(url, '_blank');
      }
    });
  },
  //同时保留两位小数和千分符
  numberFixed(num, n) {
    num = Object.tofixed(num, n);
    num = Object.toQianfenWeiStr(num);
    return num;
    // num = num.tofixed(n)
    // num =Object.toQianfenWeiStr(num)
    // return num;

    // if (num == undefined || num == null) {
    //   return "";
    // }
    // if (!Object.toIsNumber(num)) {
    //   return "";
    // }
    // result = Math.round(num * 100) / 100;
    // var s_x = result.toString(); //将数字转换为字符串
    // var pos_decimal = s_x.indexOf('.'); //小数点的索引值
    // // 当整数时，pos_decimal=-1 自动补0
    // if (pos_decimal < 0) {
    //   pos_decimal = s_x.length;
    //   s_x += '.';
    // }
    // // 当数字的长度< 小数点索引+2时，补0
    // while (s_x.length <= pos_decimal + 2) {
    //   s_x += '0';
    // }
    // //保留两位处理完毕
    // var isFuShu = s_x.indexOf("-") != -1;
    // s_x = s_x.replace('-', '');
    // let [int, fraction = ''] = s_x.split('.');
    // let ans = '';
    // const len = int.length;
    // int = int.split('').reverse();
    // for (let i = 0; i < len; i++) {
    //   if (i !== 0 && i % 3 === 0) {
    //     ans = int[i] + ',' + ans;
    //   } else {
    //     ans = int[i] + ans;
    //   }
    // }
    // if (fraction !== '') ans += '.' + fraction;
    // if (isFuShu) {
    //   ans = '-' + ans;
    // }
    // return ans;
  },
  //保留两位小数
  numFixed(num, n) {
    num = Object.tofixed(num, n);
    return num;
    //   if (num == undefined || num == null) {
    //     return "";
    //   }
    //   if (!Object.toIsNumber(num)) {
    //     return "";
    //   }
    //   result = Math.round(num * 100) / 100;
    //   var s_x = result.toString(); //将数字转换为字符串
    //   var pos_decimal = s_x.indexOf('.'); //小数点的索引值
    //   // 当整数时，pos_decimal=-1 自动补0
    //   if (pos_decimal < 0) {
    //     pos_decimal = s_x.length;
    //     s_x += '.';
    //   }
    //   // 当数字的长度< 小数点索引+2时，补0
    //   while (s_x.length <= pos_decimal + 2) {
    //     s_x += '0';
    //   }
    //   return s_x;
    // },
    // // 设置默认值
    // formatDefaultValue(value) {
    //   if (value === '' || value === null || value === undefined || value === 'null' || value === 'undefined') {
    //     return '--'
    //   }
    //   return value
  }
})();


/** * 对Date的扩展，将 Date 转化为指定格式的String * 月(M)、日(d)、12小时(h)、24小时(H)、分(m)、秒(s)、周(E)、季度(q)
    可以用 1-2 个占位符 * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字) * eg: * (new
    Date()).pattern("yyyy-MM-dd hh:mm:ss.S")==> 2006-07-02 08:09:04.423
 * (new Date()).pattern("yyyy-MM-dd E HH:mm:ss") ==> 2009-03-10 二 20:09:04
 * (new Date()).pattern("yyyy-MM-dd EE hh:mm:ss") ==> 2009-03-10 周二 08:09:04
 * (new Date()).pattern("yyyy-MM-dd EEE hh:mm:ss") ==> 2009-03-10 星期二 08:09:04
 * (new Date()).pattern("yyyy-M-d h:m:s.S") ==> 2006-7-2 8:9:4.18
 */
Date.prototype.Format = function (fmt) {
  var o = {
    "M+": this.getMonth() + 1, //月份
    "d+": this.getDate(), //日
    "h+": this.getHours() % 12 == 0 ? 12 : this.getHours() % 12, //小时
    "H+": this.getHours(), //小时
    "m+": this.getMinutes(), //分
    "s+": this.getSeconds(), //秒
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度
    "S": this.getMilliseconds() //毫秒
  };
  var week = {
    "0": "日",
    "1": "一",
    "2": "二",
    "3": "三",
    "4": "四",
    "5": "五",
    "6": "六"
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  }
  if (/(E+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "星期" : "周") : "") + week[this.getDay() + ""]);
  }
  for (var k in o) {
    if (new RegExp("(" + k + ")").test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    }
  }
  return fmt;
}
Date.prototype.addYear = function (value) {
  if (!value || isNaN(value)) value = 0;
  this.setFullYear(this.getFullYear() + value);
  return this;
};
Date.prototype.addMonth = function (value) {
  if (!value || isNaN(value)) value = 0;
  this.setMonth(this.getMonth() + value);
  return this;
};
Date.prototype.addDay = function (value) {
  if (!value || isNaN(value)) value = 0;
  this.setDate(this.getDate() + value);
  return this;
};
