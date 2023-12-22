<%@ Page Language="C#" %>

<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head id="Head1" runat="server">
    <title></title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <script type="text/javascript" src="../../dialogs/internal.js"></script>
    <script type="text/javascript" src="../common.js"></script>
    <%=F2.WorkflowEngine.Security.Utils.HtmlHelper.OutPutIncludeJsfiles(true,"all")%>
</head>
<body>
    <div class="wrapper">
        <div id="tabhead" class="tabhead">
            <span class="tab focus" data-content-id="text_attr">&nbsp;&nbsp;属性&nbsp;&nbsp;</span>
            <span class="tab" data-content-id="text_event">&nbsp;&nbsp;事件&nbsp;&nbsp;</span>
        </div>
        <div id="tabbody" class="tabbody">
            <form>
                <div id="text_attr" class="panel focus">

                    <table cellpadding="0" cellspacing="0" border="0" class="common-FormTable">
                        <tr>
                            <td>绑定字段：</td>
                            <td>
                                 <input id="bindfiled" name="bindfiled" type="text" class="easyui-validatebox textBoxLong" />

                            </td>
                        </tr>
                        <tr>
                            <td>默认值：</td>
                            <td style="padding-top: 3px; padding-bottom: 3px;">
                                <input id="defaultvalue" name="defaultvalue" type="text" class="easyui-validatebox textBoxShort" />
                            
                                上下文变量：<select class="textBoxShort" onchange="setDefaultValue(document.getElementById('defaultvalue'), this.value);" style="width: 150px">
                                </select>

                            </td>
                        </tr>
                        <tr>
                            <td>宽度：</td>
                            <td>
                                <input type="text" id="width" name="width" max="1000" class="easyui-numberbox textBoxShort" />(不填写默认为标准)</td>
                        </tr>
                        <tr>
                            <td>选择范围：</td>
                            <td>
                                <span>
                                    <input type="text" id="min" name="min" class="easyui-datebox" style="width: 100px;" />
                                    &nbsp;至&nbsp;<input type="text" id="max" class="easyui-datebox" style="width: 100px;" />
                                </span>
                                <br />
                                <span>
                                    <input type="checkbox" id="daybefor" name="daybefor" value="1" style="vertical-align: middle;" /><label for="daybefor" style="vertical-align: middle;">今天以前</label>
                                </span>
                                <span>
                                    <input type="checkbox" id="dayafter" name="dayafter" value="1" style="vertical-align: middle;" /><label for="dayafter" style="vertical-align: middle;">今天以后</label>
                                </span>
                                <span>
                                    <input type="checkbox" id="currentmonth" name="currentmonth" value="1" style="vertical-align: middle;" /><label for="currentmonth" style="vertical-align: middle;">当前月</label>
                                </span>
                            </td>
                        </tr>
                        <tr>
                            <td>时间：</td>
                            <td>
                                <input type="checkbox" id="istime" name="istime" value="1" style="vertical-align: middle;" /><label for="istime" style="vertical-align: middle;">允许选择时间</label>
                            </td>
                        </tr>
                        <tr>
                            <td>是否必填：</td>
                            <td>
                                <%=F2.WorkflowEngine.Security.Utils.HtmlHelper.GetRadioString("[{Text:\"是\",Value:\"required\"},{Text:\"否\",Value:\"0\"}]","required","0")%>

                            </td>
                        </tr>
                    </table>
                </div>

                <div id="text_event" class="panel">
                    <%Server.Execute("events.aspx"); %>
                </div>
            </form>
        </div>
    </div>
    <script type="text/javascript">
        var oNode = null, thePlugins = 'formdatetime';
        var tableInfo = parent.TableInfo;
        var filedsJson = tableInfo.FiledsJson;
        //{ 'name': eventName, 'script': $("#event_script").val() }
        var events = [];
        var eventsid = Object.toGuid(false);
        $(function () {
            if (UE.plugins[thePlugins].editdom) {
                oNode = UE.plugins[thePlugins].editdom;
            }
            //biddingFileds(filedsJson, oNode ? $(oNode).attr("id") : "", $("#bindfiled"));
            if (oNode) {
                $text = $(oNode);
        
                $("#bindfiled").val($text.attr("name"));
                $("#defaultvalue").val($text.attr('defaultvalue'));
                $("input[name='required'][value='"+$text.attr('required')+"']").prop('checked', true);
                if ($text.attr('width1')) $("#width").val($text.attr('width1'));
                $("#min").datebox("setValue", $text.attr('mindate'));
                $("#max").datebox("setValue", $text.attr('maxdate'));
                $("#istime").prop('checked', "1" == $text.attr('istime'));
                $("#daybefor").prop('checked', "1" == $text.attr('daybefor'));
                $("#dayafter").prop('checked', "1" == $text.attr('dayafter'));
                $("#currentmonth").prop('checked', "1" == $text.attr('currentmonth'));

                if ($text.attr('eventsid')) {
                    eventsid = $text.attr('eventsid');
                    events = getEvents(eventsid);
                    if (events.length > 0) {
                        $("#event_name").val(events[0].name);
                        $("#event_script").val(events[0].script);
                    }
                }
            }
            initTabs();
        });
        dialog.oncancel = function () {
            if (UE.plugins[thePlugins].editdom) {
                delete UE.plugins[thePlugins].editdom;
            }
        };
        dialog.onok = function () {
            var bindfiled = $("#bindfiled").val();
            var defaultvalue = $("#defaultvalue").val();
            var id = bindfiled;
            var width = $("#width").val();
            var istime = $("#istime").prop('checked') ? "1" : "0";
            var min = $("#min").datebox("getValue");
            var max = $("#max").datebox("getValue");
            var daybefor = $("#daybefor").prop('checked') ? "1" : "0";
            var dayafter = $("#dayafter").prop('checked') ? "1" : "0";
            var currentmonth = $("#currentmonth").prop('checked') ? "1" : "0";
            var required = $(":checked[name='required']").val();
            var dateType = istime == "1" ? "easyui-datetimebox textBoxShort" : "easyui-datebox textBoxShort";
            var html = '<input type="text" class="' + dateType + '"  type1="flow_datetime" id="' + id + '" name="' + id + '" value="' + defaultvalue + '" ';
            if (width) {
                html += 'style="width:' + width + '" ';
                html += 'width1="' + width + '" ';
            }
            html += 'defaultvalue="' + defaultvalue + '" ';
            if (parseInt(max) > 0) {
                html += 'maxdate="' + max + '" ';
            }
            if (parseInt(min) > 0) {
                html += 'mindate="' + min + '" ';
            }
            html += 'istime="' + istime + '" ';
            html += 'daybefor="' + daybefor + '" ';
            html += 'dayafter="' + dayafter + '" ';
            html += 'currentmonth="' + currentmonth + '" ';
            if (required == "required") {
                html += 'required="required" ';
            }
            if (events.length > 0) {
                html += 'eventsid="' + eventsid + '" ';
                if (($("#event_name").val() != "" && $("#event_script").val() != ""))
                    saveEvent();
                setEvents(eventsid);
            }
            html += '/>';
            if (oNode) {
                $(oNode).after(html);
                domUtils.remove(oNode, false);
            }
            else {
                editor.execCommand('insertHtml', html);
            }
            delete UE.plugins[thePlugins].editdom;
        }
    </script>
</body>
</html>
