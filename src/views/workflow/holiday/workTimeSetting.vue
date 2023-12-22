<template>
  <div class="f2bpm-page-layout">
    <div region="center" style="padding: 5px;line-height: 20px;" border="false">
      <div style="font-size: 12px; padding: 5px; font-weight: bold;line-height: 20px;">
        工作制的目的是为工作流提供更为精确的超时计算基础数据。流程引擎默认情况下是使用星期一至星期五的工作日制，默认情况下不启用工作时制。
        </br>工作制: “工作日制”和“工作时制”的组成，即是指正常的工作上班日制度，和工作日一天中的工作时间段；
        </br>工作日制: 系统默认的工作日是星期一至星期五 。
        <br>工作时制: 即工作日中的一天中工作时制。不启动时，则只依据工作日制计算，一般情况下使用天为最小单位计算所以不需要启用工作时制。
        </br>比如某公司的工作制是：每周一到周五为正常工作日，每个工作日的上午8:30点~12点，下午13:30~18:00为工作时段。11
      </div>
      <div>
        <table class="common-FormTable">
          <tr>
            <td style="width:10%">工作日制：</td>
            <td>
              <input type="checkbox" value="1" name="weekday">星期一
              <input type="checkbox" value="2" name="weekday">星期二
              <input type="checkbox" value="3" name="weekday">星期三
              <input type="checkbox" value="4" name="weekday">星期四
              <input type="checkbox" value="5" name="weekday">星期五
              <input type="checkbox" value="6" name="weekday">星期六
              <input type="checkbox" value="7" name="weekday">星期日
            </td>
            <td><input type="radio" value="1" name="isWeekdayTime">启用
              <input type="radio" checked="checked" value="0" name="isWeekdayTime">不启用
            </td>
            <td style="width:40%;text-align: left;">流程引擎计算超时时依据些工作日制，不启用时使用默认星期一至星期五</td>
          </tr>
          <tr>
            <td>工作时制：</td>
            <td>
              <span>上午
                <select id="am-hourstart" class="amhourstart minselect" />：<select id="am-minutestart" class="minute   start minselect" />-
                <select id="am-hourend" class="amhourend minselect" />：<select id="am-minutend" class="minute am end minselect" /></span>

              &nbsp;
              <span>下午<select id="pm-hourstart" class="pmhourstart minselect" />：
                <select id="pm-minutestart" class="minute start minselect" />-

                <select id="pm-hourend" class="pmhourend minselect" />：
                <select id="pm-minutend" class="minute end minselect" /></span>

            </td>
            <td>
              <input type="radio" value="1" name="isHourTime"> 启用
              <input type="radio" value="0" checked="checked" name="isHourTime">不启用
            </td>
            <td style="text-align: left;">当启用工作时制时流程引擎工作日内计算超时时依据工作时制来细化到小时计算；当不启用“工作时制”时只以“工作日制”为计算基础并且超时单位为将转为天。<em>（计算比较复杂耗时，强烈建议不启用）</em></td>
          </tr>
        </table>
      </div>
    </div>
    <div class="dialogfooter2">
      <a href="javascript:void(0)" class="btn btn-primary btn-sm mr2" onclick="saveForm(this);"><i class="fa fa-save" />保存</a>
    </div>
  </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
      }
    },
    created: function() {
      var that = this
    },
     mounted() {
      window.myvm = this
      loadPage()
    },
    methods: {

    }
  }

  window.loadPage = function() {
    for (var i = 6; i <= 13; i++) {
      var showNum = getTimeStr(i)
      $('.amhourstart').append("<option value='" + i + "'>" + showNum + '</option>')
      $('.amhourend').append("<option value='" + i + "'>" + showNum + '</option>')
    }
    for (var i = 11; i <= 23; i++) {
      $('.pmhourstart').append("<option value='" + i + "'>" + i + '</option>')
      $('.pmhourend').append("<option value='" + i + "'>" + i + '</option>')
    }
    for (var i = 0; i <= 59; i++) {
      var showNum = getTimeStr(i)
      $('.minute').append("<option value='" + i + "'>" + showNum + '</option>')
    }
    var WorkTimeSetting = Object.toAjaxJson(FUI.Handlers.WorkflowManageHandler, 'getWorkTimeSettingJson')
    var json = WorkTimeSetting.configValue
    if (json != '') {
      json = eval('(' + json + ')')
      $('#am-hourstart').val(json.am1.split(':')[0])
      $('#am-minutestart').val(json.am1.split(':')[1])

      $('#am-hourend').val(json.am2.split(':')[0])
      $('#am-minutend').val(json.am2.split(':')[1])

      $('#pm-hourstart').val(json.pm1.split(':')[0])
      $('#pm-minutestart').val(json.pm1.split(':')[1])

      $('#pm-hourend').val(json.pm2.split(':')[0])
      $('#pm-minutend').val(json.pm2.split(':')[1])

      $("input[name='isWeekdayTime'][value='" + json.isWeekdayTime + "']").prop('checked', true)
      $("input[name='isHourTime'][value='" + json.isHourTime + "']").prop('checked', true)

      $("input[name='weekday']").each(function(index, item) {
        if (json.weekday.indexOf($(this).val()) > -1) {
          $(this).prop('checked', true)
        }
      })
    }
  }
  function getTimeStr(num) {
    if (num < 10) {
      return '0' + num
    }
    return num
  }
  window.saveForm = function() {
    var am_hs = $('#am-hourstart').val()
    var am_ms = $('#am-minutestart').val()

    var am_he = $('#am-hourend').val()
    var am_me = $('#am-minutend').val()

    var pm_hs = $('#pm-hourstart').val()
    var pm_ms = $('#pm-minutestart').val()

    var pm_he = $('#pm-hourend').val()
    var pm_me = $('#pm-minutend').val()

    var isWeekdayTime = $("input[name='isWeekdayTime']:checked").val()
    var isHourTime = $("input[name='isHourTime']:checked").val()

    if (parseInt(am_hs) >= parseInt(am_he) && isHourTime == '1') {
      FUI.Window.showMsg('上午开始小时不能大于等于上午结束小时')
      return false
    }
    if (parseInt(pm_hs) >= parseInt(pm_he) && isHourTime == '1') {
      FUI.Window.showMsg('下午开始小时不能大于等于下午结束小时')
      return false
    }

    if (parseInt(am_he) >= parseInt(pm_hs) && isHourTime == '1') {
      FUI.Window.showMsg('上午结束小时不能大于等于下午开始小时')
      return false
    }
    var am1 = am_hs + ':' + am_ms
    var am2 = am_he + ':' + am_me

    var pm1 = pm_hs + ':' + pm_ms
    var pm2 = pm_he + ':' + pm_me

    var weekdays = []
    $("input[name='weekday']").each(function(index, item) {
      if ($(this).is(':checked')) {
        weekdays.push($(this).val())
      }
    })
    var worktime = { 'weekday': weekdays.toString(), 'am1': am1, 'am2': am2, 'pm1': pm1, 'pm2': pm2, 'isWeekdayTime': isWeekdayTime, 'isHourTime': isHourTime }
    if (worktime.isWeekdayTime == '1' && worktime.weekday == '') {
      FUI.Window.showMsg('请选择工作日星期')
      return false
    }
    var json = JSON.stringify(worktime)
    var result = Object.toAjaxJson('/workflow/workflowManage/', 'saveWorkTimeSetting', { 'json': json })
    FUI.Window.showMsg(result.msg, null, 1, function() {
      window.location.reload()
    })
  }

</script>
