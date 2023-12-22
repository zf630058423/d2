<template>
  <div class="f2bpm-page-layout">
    <div region="center" style="padding: 5px;" border="false">
      <div id="calendar" />
    </div>
  </div>
</template>

<script>
export default { data() {
      return {

      }
    },
    created() {
      var that = this
    },
     mounted() {
      window.myvm = this
      loadPage()
    },
    methods: {
    }
  }

  window.currentUpdateEvent = null
  window.dataJson = ''
  window.loadPage = function() {
    var winheight = $(window).height()
    loadData()
    var st_d = new Date() // 获取系统时间
    var y = st_d.getFullYear()
    var m = st_d.getMonth()
    var d = st_d.getDay()
    $('#calendar').fullCalendar({
      defaultView: 'month', // year, month, date: 整数, 初始化加载时的日期，默认是month
      height: winheight, // 日历高度,包括表头   contentHeight: 600 内容高度，不包括表头
      editable: true, // 默认值false, 用来设置日历中的日程是否可以编辑
      draggable: true, // 是否可拖动
      weekends: true, // 默认为true, 标识是否显示周六和周日的列
      slotMinutes: 30, // 整型, 默认值30, 表示在agenda的views中, 两个时间之间的间隔
      disableDragging: false, // Boolean类型, 默认false, 所有的event可以拖动, 必须editable = true
      diableResizing: false, // Boolean, 默认false, 所有的event可以改变大小, 必须editable = true
      dragRevertDuration: 450, // 拖动恢复的时间, 默认500毫秒, 表示一个不成功的拖动之后, 控件回复到原始位置的时间.
      dragOpacity: 0.5, // Float类型, 表示拖动时候的不透明度.
      timeFormat: 'H(:mm)tt', // 事务左边那一列时间的格式:
      monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'], // 默认为英文月分，这里可以改成中文
      dayNames: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'], // 换成中文星期
      header: {
        left: 'month,agendaWeek,agendaDay', // 左边显示的按钮 (month,basicWeek无时间格式,basicDay无时间格式,agendaWeek,agendaDay)
        center: 'title', // 中间显示标题
        right: 'prevYear,prev,today,next,nextYear' // 右边显示的按钮
      },
      buttonText: { // 按钮对应的文本
        prevYear: '去年', // 不建议改这个值，因为它本身是含[去年、上一周、前天]三个意思，你就让它默认
        nextYear: '明年', // 同上
        today: '今天',
        month: '月',
        week: '周',
        day: '日'
      },
      // dayNamesShort: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],  //短格式的星期
      dayNamesShort: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'], // 短格式的星期
      monthNamesShort: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
      titleFormat: { // 格式化标题
        month: 'yyyy年MM月 ', // 如：September 2009
        week: "yyyy年MM月 d[yyyy]{'&#8212;'[ MMM] d }", // 如：Sep 7 - 13 2009
        day: 'yyyy年MM月d日 dddd ' // 如：Tuesday, Sep 8, 2009    'dddd, MMM d, yyyy'
      },
      weekMode: 'variable', // fixed 固定显示6周高，高度永远保持不变 liquid 不固定周数，周高度可变化 variable 不固定周数，但高度固定
      dayClick: function(dayDate, allDay, jsEvent, view) { // 点击单元格事件
        var holidayTime = dayDate.getFullYear() + '-' + (dayDate.getMonth() + 1) + '-' + dayDate.getDate()
        FUI.Window.openEdit(__webpath + '/workflow/pageRoute/holidayEdit/?holidayTime=' + holidayTime, '新增', 'Add', '', 600, 450, null, null, null, null, null, null, false)
      },
      eventClick: function(event, jsEvent, view) { // 当点击某一个事件时触发此操作
        var formAction = 'Edit'
        FUI.Window.openEdit(__webpath + '/workflow/pageRoute/holidayEdit/?keyId=' + event.id, event.title, formAction, '', 600, 450, null, null, null, null, null, null, false)
        currentUpdateEvent = event
      },
      eventMouseover: function(event, jsEvent, view) { // 当鼠标悬停在一个事件上触发此操作
      },
      eventMouseout: function(event, jsEvent, view) { // 当鼠标从一个事件上移开触发此操作
      },
      eventDragStart: function(calEvent, jsEvent, ui, view) { // 日程事件被拖动之前触发
      },
      eventDragStop: function(calEvent, jsEvent, ui, view) { // 日程事件被拖动之后触发
      },
      eventDrop: function(event, delta, minuteDelta, allDay, revertFunc, jsEvent, ui, view) { // 停止拖动事件后 view.name=[month,agendaWeek,agendaDay]
        var s
        if (delta != 0) { s = delta > 0 ? '推迟了【' + Math.abs(delta) + '】天' : '提前了【' + Math.abs(delta) + '】天' }

        var parm = {
          keyId: event.id,
          days: delta
        }
        Object.toAjaxJson(FUI.Handlers.WorkflowManageHandler, 'holidayCalendarDragEvent', parm, null, null, function(data) {
          data = eval(data)
          if (data.success) {
            FUI.Window.showMsg2(null, data.msg + ',' + s, null, 1)
          } else {
            FUI.Window.showMsg2(null, data.msg)
          }
        })
      },
      eventResize: function(event, dayDelta, minuteDelta, revertFunc, jsEvent, ui, view) { // 改变大小后触发的事件
        alert(event.title + '事件调整了分钟：' + minuteDelta)
      },
      eventRender: function(calEvent, element, view) { // 日程事件渲染之前触发,每个事件触发一次
        // return false; //可以阻止日程事件渲染
      },
      // events: [{"id":1,"title":"已经过去的事件","start":"2011-9-30 12:30:00","end":"2011-10-1 12:23:00","editable":false,"allDay":true,"color":"#e7e6e5","borderColor":"#d7d7d7","textColor":"#ffffff","className":"fc_clock"},
      //    {"id":2,"title":"事件标题","start":"2011-10-12","end":"2011-10-13","editable":true,"allDay":true,"color":"#e6ccc1","borderColor":"#bf9888","textColor":"#ffffff","className":"fc_cycls"},
      //    {"id":4100,"title":"活动","start":"2011-10-12","end":"2011-10-13","editable":true,"allDay":false,"color":"#ccaaaa","borderColor":"#ad7878","textColor":"#ffffff","className":"fc_cyc"},
      //    {"id":10,"title":"已经过去的事件","start":"2011-10-10 12:30","end":"2011-10-11 23:23:00","editable":false,"allDay":true,"color":"#e7e6e5","borderColor":"#d7d7d7","textColor":"#ffffff","className":"fc_cyc"},
      //    {"id":400,"title":"新活动","start":"2011-10-12 12:30:00","end":"2011-10-12 22:30:00","editable":true,"allDay":false,"color":"#ccaaaa","borderColor":"#ad7878","textColor":"#ffffff","className":"fc_cyc"}]
      events: eval(dataJson)
      // 可以使用json格式源

    })
  }
  function loadData() {
    var data = Object.toAjaxJson(FUI.Handlers.WorkflowManageHandler, 'holidayCalendarJson')
    dataJson = data
  }
  window.UpdateEvent = function(id, title, start, end, dayType) {
    currentUpdateEvent.title = dayType == 'Holiday' ? '【休】' + title : '【班】' + title
    currentUpdateEvent.start = start
    currentUpdateEvent.end = end
    currentUpdateEvent.allDay = true
    currentUpdateEvent.borderColor = dayType == 'Holiday' ? '#059CD2' : '#E39800'
    $('#calendar').fullCalendar('updateEvent', currentUpdateEvent)
  }
  window.DeleteEvent = function(id) {
    $('#calendar').fullCalendar('removeEvents', id)
  }

  window.AddEvent = function(id, title, start, end, dayType) {
    var calEvent = new Object()
    calEvent.id = id
    calEvent.title = dayType == 'Holiday' ? '【休】' + title : '【班】' + title
    calEvent.start = start
    calEvent.end = end
    calEvent.allDay = true
    calEvent.borderColor = dayType == 'Holiday' ? '#059CD2' : '#E39800'
    $('#calendar').fullCalendar('renderEvent', calEvent, true)
  }

  window.refetchEvents = function() {
    // window.location.reload();
    // loadData();
    // alert(dataJson);
    // $('#calendar').fullCalendar('refetchEvents'); //重新获取所有事件数据 不起作用

  }

</script>
<style lang="scss" scoped>
  @import "~@/resources/fullcalendar/fullcalendar.css";
  @import "~@/resources/fullcalendar/fullcalendar.print.css";

  #calendar {
    width: 98%;
    margin: 0 auto;
    min-height: 800px;
  }
</style>
