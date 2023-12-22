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

                    <table cellpadding="0" cellspacing="0" border="0" width="100%" class="common-FormTable">

                        <tr>
                            <td>按钮文本:</td>
                            <td>
                                <input type="text" id="value" name="value" required="required" class="easyui-validatebox  textBoxShort" style="width: 150px" /></td>
                        </tr>
                        <tr>
                            <td>按钮宽度:</td>
                            <td>
                                <input type="text" id="width" max="400" name="width" class="easyui-numberbox textBoxShort" style="width: 150px" /></td>
                        </tr>
                        <tr>
                            <td>按钮高度:</td>
                            <td>
                                <input type="text" id="height" max="100"  name="height" class="easyui-numberbox textBoxShort" style="width: 150px" /></td>
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
        var oNode = null, thePlugins = 'formbutton';
        var tableInfo = parent.TableInfo;
        var filedsJson = tableInfo.FiledsJson;


        var events = [];
        var eventsid = Object.toGuid(false);

        $(function () {
            if (UE.plugins[thePlugins].editdom) {
                oNode = UE.plugins[thePlugins].editdom;
            }
            //biddingFileds(attJSON, oNode ? $(oNode).attr("id") : "", $("#bindfiled"));
            if (oNode) {
                $text = $(oNode);
 
                FUI.Form.loadFormData({ width: $text.attr('width1'), height: $text.attr('height1'), value: $text.attr('value') });
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
            if (!FUI.Form.validateForm()) return false;

            var width = $("#width").val();
            var height = $("#height").val();
            var value = $("#value").val();
            if (value == "") {
                FUI.Window.showMsg("按钮文本不能为空！");
                return false;
            }
            var html = '<input type="button" class="commonbutton" type1="flow_button" isflow="1" value="' + value + '" ';

            if (width && height) {
                html += 'style="width:' + width + 'px;height:' + height + 'px" ';
                html += 'width1="' + width + '" ';
                html += 'height1="' + height + '" ';
            }
            else if (width || height) {
                if (width) {
                    html += 'style="width:' + width + 'px" ';
                    html += 'width1="' + width + '" ';
                }
                if (height) {
                    html += 'style="height:' + height + 'px" ';
                    html += 'height1="' + height + '" ';
                }
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
