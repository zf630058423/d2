var ajaxUrl = FUI.Handlers.WorkflowMonitorHandler;
var desktop = {};
desktop.loadTaskExpireTimeReport = function () {
  var jsonData = Object.toAjaxJson(ajaxUrl, 'taskExpireTimeReport', null, true, null, function (jsonData) {
    var data = jsonData;
    FUI.Form.loadFormSpantext(data, 'expireTimeReport');
  });
};

desktop.loadCharReport = function () {
  var s1 = ['草稿', 0]; var s2 = ['运行中', 0]; var s3 = ['已完成', 0]; var s4 = ['挂起中', 0]; var s5 = ['退回提单', 0]; var s99 = ['已作废', 0];
  var charData = [];
  Object.toAjaxJson(ajaxUrl, 'stateReportByUserId', null, true, null, function (jsonData) {
    // console.info(JSON.stringify(jsonData));
    var newData = [];
    var isNeedChange = 0;
    var total = 0;
    $.each(jsonData, function (i, item) {
      total += item.total;
    });

    $.each(jsonData, function (i, item) {
      var itemSum = item.total;
      var bl = Object.toDecimal((itemSum / total) * 100, 2);
      // var g = { itemTotal: itemSum, y: bl, color: colors[i] }
      var g = { value: itemSum, name: formatterState(item.workflowinstancestate), y: bl };
      switch (item.workflowinstancestate) {
        case 1: s1 = g; break;
        case 2: s2 = g; break;
        case 3: s3 = g; break;
        case 4: s4 = g; break;
        case 5: s5 = g; break;
        case 99: s99 = g; break;
      }
    });
    charData.push(s1);
    charData.push(s2);
    charData.push(s3);
    charData.push(s4);
    charData.push(s5);
    charData.push(s99);
    var myChart = echarts.init(document.getElementById('container'));
    var option = {
      color: ['#999999', '#68BC31', '#6FB3E0', '#E8B110', '#D53F40', '#434348'],
      title: {
        text: '流程实例状态饼图',
        subtext: '(总实例数:' + total + ')',
        x: 'center'
      },
      toolbox: {
        feature: {
          saveAsImage: {}
        }
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)'
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        data: ['草稿', '运行中', '已完成', '挂起中', '退回提单', '已作废']
      },
      series: [
        {
          name: '实例数量',
          type: 'pie',
          radius: '55%',
          center: ['50%', '60%'],
          data: charData,
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };
    myChart.setOption(option, true);
  });
  return false;
};
desktop.formatterState = function (state) {
  switch (state) {
    case 1: return '草稿';
    case 2: return '运行中';
    case 3: return '已完成';
    case 4: return '挂起中';
    case 5: return '退回提单';
    case 99: return '已作废';
  }
};

desktop.showTodoList = function (type, title) {
  FUI.Window.openEdit(__webpath + '/workflow/workflowBusiness/showTodoList/?type=' + type, title, null, null, 800, 400);
};
desktop.refreshTodoList = function () {
  desktop.loadToDoList();
  desktop.loadCirculatedList();
};
desktop.loadToDoList = function () {
  desktop.loadList('todo', 'todoList', 'getTodoListJson', ' CreatedTime', 'desc');
};
desktop.loadCirculatedList = function () {
  desktop.loadList('circulated', 'todoCirculatedList', 'getTodoCirculatedListJson', 'CreatedTime', 'desc');
};
desktop.loadList = function (type, appendToDivId, method, sort, order) {
  var total = 0;
  var pageCount = 0;
  var pageIndex = 1;
  var pageSize = 6;
  var data = Object.toAjaxJson('/workflow/workflowBusiness/', method, { page: pageIndex, rows: pageSize, sort: sort, order: order }, true, null, function (data) {
    desktop.loadListByData(type, appendToDivId, method, sort, order, data);
  });
};
desktop.loadListByData = function (type, appendToDivId, method, sort, order, data) {
  $('#' + appendToDivId).html('');
  var total = 0;
  var pageCount = 0;
  var pageIndex = 1;
  var pageSize = 15;
  total = data.total;
  pageCount = data.pageCount;
  var rows = data.rows;
  if (pageCount <= 1) $('.infinite-scroll-preloader').remove();
  var docWidth = $(document).width();
  var titleWidth = docWidth / 2 - 150 - 80 - 60;
  var head_sheet = __f2bpmLanguage == 'en-US' ? 'ProcInst No' : '流程单号';
  var head_title = __f2bpmLanguage == 'en-US' ? 'Title' : '标题';
  var head_startdate = __f2bpmLanguage == 'en-US' ? 'Start Time' : '发起日期';
  var templateTitle = '<div class="title-row">' +
    "<div style='width:150px;'>" + head_sheet + "</div>" +
    "<div  style='width:" + titleWidth + "px'>" + head_title + "</div>" +
    "<div style='width:80px;float:right'>" + head_startdate + "</div>" +
    '</div>';
  $('#' + appendToDivId).append(templateTitle);
  var template = '<div class="row rowlink" taskId="{taskId}" appId="{appId}" wiid="{workflowInstanceId}">' +
    "<div  style='width:157px;text-align:left;'>{sheetId}</div>" +
    "<div  style='width:" + titleWidth + "px;text-align:left;text-overflow:ellipsis' title='{workflowTitle}'>{myWorkflowTitle}</div>" +
    "<div style='width:80px;float:right'>{createdTime}</div>" +
    '</div>';

  var moreUrl = '/workflow/workflowBusiness/todoList/';
  var moreTitle = '待办事项';
  var moreIcon = 'fa fa-pencil';
  if (type == 'circulated') {
    moreUrl = '/workflow/workflowBusiness/todoCirculatedList/';
    moreTitle = '待阅事项';
    moreIcon = 'fa fa-pencil-square';
  }
  var templateFoot = '<div class="foot-row">' +
    "<div style='width:80px;'> </div>" +
    "<div  style='width:260px;'> </div>" +
    "<div style='width:70px;'> </div>";
  if (__f2bpmLanguage == 'en-US') {
    templateFoot += "<div  style='width:120px;text-align: right'>total（" + total + "）<span class='cur' onclick=\"operMoreUrl('" + moreUrl + "','" + moreTitle + "','','" + moreIcon + "')\"> <i class='fa fa-angle-double-right'></i>more<span></div></div>";
  } else {
    templateFoot += "<div  style='width:120px;text-align: right'>共（" + total + "）条<span class='cur' onclick=\"operMoreUrl('" + moreUrl + "','" + moreTitle + "','','" + moreIcon + "')\"> <i class='fa fa-angle-double-right'></i>更多<span></div></div>";
  }


  $.each(rows, function (i, row) {
    var create = row.createdTime;
    var startTime = row.startedTime;
    row.myWorkflowTitle = row.workflowTitle;
    row.createdTime = Object.toJsonDateFormatter(create);
    row.startedTime = Object.toJsonDateFormatter(startTime);
    row.taskState = row.taskState == 0 ? '<em>送达</em>' : row.taskState == 1 ? '处理中' : '已完成';
    row.workflowInstanceState = getWorkflowStatus(row.workflowInstanceState);
    var itemHtml = Object.toStringFormat(template, row);
    $('#' + appendToDivId).append(itemHtml);
  });
  $('#' + appendToDivId).append(templateFoot);
  $('#' + appendToDivId + '>.rowlink').each(function () {
    $(this).click(function () {
      var taskId = $(this).attr('taskId');
      var wiid = $(this).attr('wiid');
      var appId = $(this).attr('appId');
      var url = '';
      if (type == 'todo') {
        url = __webpath + '/workflow/workflowform/index/?appId=' + appId + '&formAction=2&wiid=' + wiid + '&taskId=' + taskId;
      }
      if (type == 'circulated') {
        url = __webpath + '/workflow/workflowform/index/?appId=' + appId + '&formAction=4&wiid=' + wiid + '&taskId=' + taskId;
      }
      FUI.Window.open(url);
    });
  });
};

desktop.openUrlOnParentTab = function (url, title, icon) {
  window.location.href=url;
};
window.operMoreUrl = function (url, title, icon) {
  window.location.href=url;
};
// =========新闻公告==================
var newsTmplate = '<div class="row rowlink" articleId="{articleId}" functionID="{functionID}" >' +
  "<div  style='width:330px;text-align:left;' title='{articleTitle}'>{myArticleTitle}</div>" +
  "<div style='width:70px;float:right'>{articleUpdateTime}</div>" +
  '</div>';

var announcementTmplate = '<div class="row rowlink" articleId="{articleId}"  functionID="{functionID}" >' +
  "<div  style='width:180px;text-align:left;' tip='{articleTitle}'>{myArticleTitle}</div>" +
  "<div style='width:80px;float:right'>{articleUpdateTime}</div>" +
  '</div>';

// 上传图片类型的链接
var fastChannelTmplate = "<div style='width:75px;height:80px;'  class=\"link-box rowlink\" tip='{description}'  myLinkTitle='{myArticleTitle}' linkUrl=\"{linkUrl}\" linkTarget=\"{linkTarget}\"  articleId=\"{articleId}\" functionID=\"{functionID}\" >" +
  "<div class='link-inner-img-box'><img style='width:45px;height:45px;' class='link-image' src='{articlePhotoFullPath}'/></div>" +
  "<div class='link-inner-title'>{myArticleTitle}</div>" +
  '</div>';

// 纯文本的链接
var fastChannelTextTmplate = "<div  class=\"link-box  link-text-box   rowlink\" tip='{description}'  myLinkTitle='{myArticleTitle}' linkUrl=\"{linkUrl}\" linkTarget=\"{linkTarget}\"  articleId=\"{articleId}\" functionID=\"{functionID}\" >" +
  "<span style='color:{color}' class='link-inner-text-icon {icon}'> </span>" +
  "<span class='link-inner-title'>{myArticleTitle}</span>" +
  '</div>';

var commonLinkTmplate = "<div class=\"row rowlink\" tip='{description}'  myLinkTitle='{myArticleTitle}' linkUrl=\"{linkUrl}\" linkTarget=\"{linkTarget}\"  articleId=\"{articleId}\" functionID=\"{functionID}\" >" +
  "<div  style='width:230px;text-align:left;'><i   style='color:{color}' class='{icon}'></i>{myArticleTitle}</div>" +
  '</div>';

desktop.loadNewsList = function () {
  desktop.loadArticles('news', 'News', 'newsList', newsTmplate, 6);
};
desktop.loadAnnouncementList = function () {
  desktop.loadArticles('notice', 'Announcement', 'announcementList', announcementTmplate, 8);
};
desktop.loadRegulationsList = function () {
  desktop.loadArticles('regulation', 'Regulation', 'regulationsList', announcementTmplate, 8);
};
desktop.loadFastChannelListXXX = function () {
  desktop.loadArticles('link', 'FastChannel', 'fastChannelList', fastChannelTextTmplate, 999);
};
// 常用链接
desktop.loadCommonlinkList = function () {
  desktop.loadArticles('link', 'Commonlink', 'commonLinkList', commonLinkTmplate, 8);
};
desktop.loadArticles = function (infoType, functionID, appendDivId, template, thePageSize, sort, order) {
  var total = 0;
  var pageCount = 0;
  var pageIndex = 1;
  var pageSize = thePageSize || 5;
  sort = sort || 'OrderNo asc,CreatedTime';
  order = order || 'desc';
  Object.toAjaxJson('/workflow/security/article/', 'loadPersonalArticleListJsonByPage/?infoType=' + infoType + '&publicAuthorizeType=' + functionID + '&defaultWhere=' + "FunctionID='" + functionID + "' and IsAudited=2 ",
    { page: pageIndex, rows: pageSize, sort: sort, order: order }, true, null, function (data) {
      desktop.loadArticlesByData(infoType, functionID, appendDivId, template, thePageSize, sort, order, data);
    });
};
desktop.loadArticlesByData = function (infoType, functionID, appendDivId, template, thePageSize, sort, order, data) {
  $('#' + appendDivId).html('');
  var total = 0;
  var pageCount = 0;
  var pageIndex = 1;
  var pageSize = thePageSize || 5;
  sort = sort || 'OrderNo asc,CreatedTime';
  order = order || 'desc';
  var rows = data.rows;
  total = data.total;
  pageCount = data.pageCount;
  $.each(rows, function (i, row) {
    var articleTitle = row.articleTitle || '';
    if (functionID == 'News') {
      row.myArticleTitle = articleTitle.length > 24 ? articleTitle.substr(0, 22) + '...' : articleTitle;
    } else if (functionID == 'Announcement' || functionID == 'Regulation') {
      row.myArticleTitle = articleTitle.length >= 15 ? articleTitle.substr(0, 13) + '...' : articleTitle;
    } else if (functionID == 'FastChannel') {
      row.myArticleTitle = articleTitle.length > 5 ? articleTitle.substr(0, 5) : articleTitle;
      if (row.linkUrl.indexOf('http:') > -1) {
        row.linkUrl = row.linkUrl;
      } else {
        row.linkUrl = __webpath + row.linkUrl;
      }
      if (row.articlePhotoFullPath && row.articlePhotoFullPath.indexOf('http:') == -1) {
        row.articlePhotoFullPath = __serverpath + row.articlePhotoFullPath;
      }
    } else if (functionID == 'Commonlink') {
      row.myArticleTitle = articleTitle.length > 18 ? articleTitle.substr(0, 16) : articleTitle;
    } else {
      row.myArticleTitle = articleTitle;
    }
    var articleUpdateTime = row.articleUpdateTime;
    row.description = row.description || articleTitle;
    row.articleUpdateTime = Object.toJsonDateFormatter(articleUpdateTime);
    var itemHtml = Object.toStringFormat(template, row);
    $('#' + appendDivId).append(itemHtml);
  });
  var title = '新闻';
  switch (functionID) {
    case 'News': title = '新闻'; break;
    case 'Announcement': title = '公告通知'; break;
    case 'Regulation': title = '规章制度'; break;
    case 'FastChannel': title = '快捷菜单'; break;
  }
  $('#' + appendDivId + '>.rowlink').each(function () {
    $(this).click(function () {
      var id = $(this).attr('articleId');
      if (functionID == 'FastChannel' || functionID == 'Commonlink') {
        var linkUrl = $(this).attr('linkUrl');
        var linkTarget = $(this).attr('linkTarget');
        var myLinkTitle = $(this).attr('myLinkTitle');

        if (linkTarget != '_toptab') {
          window.open(linkUrl, linkTarget);
        } else {
          FUI.Window.openTopTab(linkUrl, myLinkTitle, '', 'fa fa-pencil');
        }
      } else {
        var url = __webpath + '/workflow/security/article/articleView/?infoType=' + infoType + '&functionID=' + functionID;
        FUI.Window.openEdit(url, title, 'View', 'grid', null, null, null, null, id, true);
      }
    });
  });
};

// =================系统消息==========================
var messageTmplate = '<div class="row rowlink" messageId="{messageId}"  >' +
  "<div  style='width:180px;text-align:left;' title='{title}【{createdTime}】'>{MyTitle}</div>" +
  "<div style='width:80px;float:right'>{MyCreatedTime}</div>" +
  '</div>';
// 系统消息
desktop.loadMessageList = function () {
  desktop.loadMessageLists('syswindow', 'messageList', messageTmplate, 7);
};
desktop.loadMessageLists = function (channelType, appendDivId, template, thePageSize, sort, order) {
  var total = 0;
  var pageCount = 0;
  var pageIndex = 1;
  var pageSize = thePageSize ||7;
  sort = sort || 'CreatedTime';
  order = order || 'desc';
  Object.toAjaxJson('/workflow/notification/', 'loadPersonalMessage/?channelType=' + channelType + '&defaultWhere=', { page: pageIndex, rows: pageSize, sort: sort, order: order }, true, null, function (data) {
    desktop.loadMessageListsByData(channelType, appendDivId, template, thePageSize, sort, order, data);
  });
};
desktop.loadMessageListsByData = function (channelType, appendDivId, template, thePageSize, sort, order, data) {
  $('#' + appendDivId).html('');
  var total = 0;
  var pageCount = 0;
  var pageIndex = 1;
  var pageSize = thePageSize || 5;
  sort = sort || 'CreatedTime';
  order = order || 'desc';

  var rows = data.rows;
  total = data.total;
  pageCount = data.pageCount;

  $('#' + appendDivId).html('');
  $.each(rows, function (i, row) {
    var title = row.title;
    var createdTime = row.createdTime;
    row.MyTitle = title.length > 14 ? title.substr(0, 11) + '...' : title;
    row.MyCreatedTime = Object.toJsonDateFormatter(createdTime);
    if (row.MyCreatedTime == Object.toGetCurrentDateString()) {
      row.MyCreatedTime = "<span class='icon_new4'>&nbsp;</span>";
    }
    row.createdTime = Object.toJsonDateTimeFormatter(createdTime);
    var itemHtml = Object.toStringFormat(template, row);
    $('#' + appendDivId).append(itemHtml);
  });
  var title = '系统消息';
  $('#' + appendDivId + '>.rowlink').each(function () {
    $(this).click(function () {
      var messageId = $(this).attr('messageId');
      var url = __webpath + '/workflow/notification/notificationView/?messageId=' + messageId;
      FUI.Window.openEdit(url, title, 'View', 'grid', 600, 400, null, null, messageId, false);
    });
  });
};
export default desktop;
