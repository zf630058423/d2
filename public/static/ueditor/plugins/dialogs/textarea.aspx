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
            <div id="text_attr" class="panel focus">
                <form>
                <table cellpadding="0" cellspacing="0" border="0" class="common-FormTable">
                    <tr>
                        <td>绑定字段:</td>
                        <td>
                             
                              <input id="bindfiled" name="bindfiled" type="text" class="easyui-validatebox textBoxLong" />
                        </td>
                    </tr>
                    <tr>
                        <td>默认值:</td>
                        <td style="padding-top: 3px; padding-bottom: 3px;">
                            <input id="defaultvalue" name="defaultvalue" type="text" class="easyui-validatebox textBoxLong" />
                            <br />
                            上下文变量：<select class="textBoxShort" onchange="setDefaultValue(document.getElementById('defaultvalue'), this.value);" style="width: 150px">
                            </select>

                        </td>
                    </tr>
                    <tr>
                        <td>输入长度：</td>
                        <td>
                            <input type="text" id="maxlength" name="maxlength" class="easyui-numberbox textBoxShort" /></td>
                    </tr>
                    <tr>
                        <td>宽度：</td>
                        <td>
                            <input type="text" id="width" name="width" min="60" max="1000" class="easyui-numberbox textBoxShort" />(不填写默认为标准)</td>
                    </tr>
                    <tr>
                        <td>高度:</td>
                        <td>
                            <input type="text" id="height" name="height" min="20" max="1000" class="easyui-numberbox textBoxShort" />(不填写默认为标准)</td>

                    </tr>
                    <tr>
                        <td>是否必填：</td>
                        <td>
                            <%=F2.WorkflowEngine.Security.Utils.HtmlHelper.GetRadioString("[{Text:\"是\",Value:\"required\"},{Text:\"否\",Value:\"0\"}]","required","0")%>

                        </td>
                    </tr>
                    <tr>
                        <td>值类型:</td>
                        <td>
                            <select class="textBoxShort" id="validtype">
                                <option value="">字符串</option>
                            </select></td>
                    </tr>
                </table>
                    </form>
            </div>

            <div id="text_event" class="panel">
                <%Server.Execute("events.aspx"); %>
            </div>
        </div>
    </div>
    <script type="text/javascript">
        var oNode = null, thePlugins = 'formtextarea';
        var tableInfo = parent.TableInfo;
        var filedsJson = tableInfo.FiledsJson;

        var parentEvents = parent.formEvents;
        var events = [];
        var eventsid = Object.toGuid(false);

        $(function () {
            if (UE.plugins[thePlugins].editdom) {
                oNode = UE.plugins[thePlugins].editdom;
            }
            //biddingFileds(filedsJson, oNode ? $(oNode).attr("id") : "", $("#bindfiled"));
            if (oNode) {
                $text = $(oNode);
                var bindfiled = $text.attr("name");
                var defaultvalue = $text.attr('defaultvalue');
                var width = $text.attr('width1') || "";
                var height = $text.attr('height1') || "";
                var maxlength = $text.attr('maxlength') || "";
                var required = $text.attr('required') || "0";
                var validtype = $text.attr('validtype') || "";

                var data = { bindfiled: bindfiled, defaultvalue: defaultvalue, height: height, width: width, maxlength: maxlength, required: required, validtype: validtype };
                FUI.Form.loadFormData(data);

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

            var bindfiled = $("#bindfiled").val();
            var id = bindfiled;
            var defaultvalue = $("#defaultvalue").val();
            var maxlength = $("#maxlength").val();
            //var model = $(":checked[name='model']").val();
            var width = $("#width").val();
            var height = $("#height").val();
            var validtype = $("#validtype").val();
            var required = $(":checked[name='required']").val();
            var html = '<textarea type="text" id="' + id + '" name="' + id + '" type1="flow_textarea"  value=""  class="easyui-validatebox textBoxMultiLineLong"  ';
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
            else {
                html += 'style="width:80%; height:40px;" ';
            }
            if (validtype) {
                html += 'validtype="' + validtype + '" ';
            }
            if (required == "required") {
                html += 'required="required" ';
            }
            html += 'defaultvalue="' + defaultvalue + '" ';
            if (parseInt(maxlength) > 0) {
                html += 'maxlength="' + maxlength + '" ';
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
