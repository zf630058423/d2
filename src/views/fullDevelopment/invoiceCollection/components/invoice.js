
export default {

  
  //设置默认时间
  defaultDate() { 
    const date = new Date();
    const year = date.getFullYear();
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let hour = date.getHours();
    let minute = date.getMinutes();
    let second = date.getSeconds();
    
    if (month < 10) { 
      month = `0${month}`;
    }
    if (day < 10) { 
      day = `0${day}`;
    }
    if (hour < 10) { 
      hour = `0${hour}`;
    }
    if (minute < 10) { 
      minute = `0${minute}`;
    }
    if (second < 10) { 
      second = `0${second}`;
    }

    const startDate = `${year - 1}-${month}-${day} ${hour}:${minute}:${second}`;
    const endDate = `${(year)}-${month}-${day} ${hour}:${minute}:${second}`;
    const dateTime = [startDate, endDate];
    return dateTime || [];
  },

  dateStr(arr,i) { 
    return (arr && arr.length > 0) ? arr[i] : '';
  },

  //近一年的时间
  dateFormater(_this) { 
    const dateTime = this.defaultDate();
    const { invoiceCreateTimeArray, ticketTimeArray, claimTimeArray, checkTimeTimeArray, periodOutputTimeArray, createTimeArray } = _this;
    const dataForm = {
        ..._this.formDataPop,
        makeInvoiceDateStart: this.dateStr(invoiceCreateTimeArray,0),  //开票开始时间
        makeInvoiceDateEnd: this.dateStr(invoiceCreateTimeArray,1),  //开票结束时间
        periodDuringInputTransferredStart: this.dateStr(periodOutputTimeArray,0), //进项转出期间开始
        periodDuringInputTransferredEnd: this.dateStr(periodOutputTimeArray,1), //进项转出期间结束
        ticketTimeStart: this.dateStr(ticketTimeArray,0), //收票开始时间
        ticketTimeEnd: this.dateStr(ticketTimeArray,1), //收票结束时间
        createTimeStart: this.dateStr(createTimeArray,0),//编制开始时间
        createTimeEnd: this.dateStr(createTimeArray,1),//编制结束时间
        claimTimeStart: this.dateStr(claimTimeArray,0), //认领开始时间
        claimTimeEnd: this.dateStr(claimTimeArray,1),  //认领结束时间
        checkTimeStart:this.dateStr(checkTimeTimeArray,0),  //复核时间 开始
        checkTimeEnd: this.dateStr(checkTimeTimeArray,1) //复核时间  结束
      }
      return dataForm;
  }
}