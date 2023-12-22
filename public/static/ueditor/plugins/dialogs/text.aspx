<%@ Page Title="" Language="C#" MasterPageFile="~/Workflow/Layout/DialogLayout.Master" AutoEventWireup="true" CodeBehind="text.aspx.cs" Inherits="Web.Workflow.Resources.UEditor.plugins.dialogs.text" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <script type="text/javascript" src="../../dialogs/internal.js"></script>
    <script type="text/javascript" src="../common.js"></script>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="body" runat="server">
    <div class="wrapper">
        <div id="tabhead" class="tabhead">
            <span class="tab focus" data-content-id="text_attr">&nbsp;&nbsp;属性&nbsp;&nbsp;</span>
            <%--   <span class="tab" data-content-id="text_event">&nbsp;&nbsp;事件&nbsp;&nbsp;</span>--%>
        </div>
        <div id="tabbody" class="tabbody">
            <div id="text_attr" class="panel focus">
                <table cellpadding="0" cellspacing="0" border="0" width="100%" class="common-FormTable">
                    <tr>
                        <td>绑定字段:</td>
                        <td colspan="3">
                            <input id="bindfiled" name="bindfiled" type="text" class="easyui-validatebox textBoxLong" />

                        </td>
                    </tr>
                    <tr>
                        <td>默认值:</td>
                        <td colspan="3" style="padding-top: 3px; padding-bottom: 3px;">
                            <input id="defaultvalue" name="defaultvalue" type="text" class="easyui-validatebox textBoxShort" />

                            <%-- 上下文变量：<select class="textBoxShort" onchange="setDefaultValue(document.getElementById('defaultvalue'), this.value);" style="width: 150px">
                            </select>--%>

                        </td>
                    </tr>
                    <tr>
                        <td>宽度：</td>
                        <td>
                            <input type="text" id="width" title="不填写则为默认值" name="width" max="1000" class="easyui-numberbox textBoxShort" /></td>

                        <td>输入长度：</td>
                        <td>
                            <input type="text" id="maxlength" name="maxlength" min="50" max="4000" class="easyui-numberbox textBoxShort" /></td>
                    </tr>
                    <tr>
                        <td>输入类型：</td>
                        <td>
                            <%=F2.WorkflowEngine.Security.Utils.HtmlHelper.GetRadioString("[{Text:\"明文\",Value:\"text\"},{Text:\"密文\",Value:\"password\"}]","inputtype","text")%>

                        </td>

                        <td>是否必填：</td>
                        <td>
                            <%=F2.WorkflowEngine.Security.Utils.HtmlHelper.GetRadioString("[{Text:\"是\",Value:\"required\"},{Text:\"否\",Value:\"0\"}]","required","0")%>

                        </td>
                    </tr>
                    <tr>
                        <td>校验值类型：</td>
                        <td>
                            <%=F2.WorkflowEngine.Security.Utils.HtmlHelper.GetValueTypeOptions("validtype","","class=\"textBoxShort\" ")%>
                        </td>

                        <td>是否列合计</td>
                        <td><%=F2.WorkflowEngine.Security.Utils.HtmlHelper.GetRadioString("[{Text:\"是\",Value:\"true\"},{Text:\"否\",Value:\"false\"}]","iscolumncount","false")%></td>

                    </tr>
                    <tr>
                        <td>公式函数：</td>
                        <td colspan="3">
                            <input id="countrule" name="countrule" type="text" class="easyui-validatebox textBoxLong" />

                        </td>
                    </tr>
                </table>
            </div>

            <div id="text_event" class="panel">
                <%Server.Execute("events.aspx"); %>
            </div>
        </div>
    </div>

    <script type="text/javascript">

        var oNode = null, thePlugins = 'formtext';
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
                var bindfiled = $text.attr("name");
                var defaultvalue = $text.attr('defaultvalue');
                var width = $text.attr('width1') || "";
                var maxlength = $text.attr('maxlength') || "";
                var inputtype = $text.attr('type') || "text";
                var required = $text.attr('required') || "0";
                var validtype = $text.attr('validtype') || "";
                var countrule = $text.attr('countrule') || "";
                var iscolumncount = $text.attr('iscolumncount') || "";
                var data = { bindfiled: bindfiled, countrule: countrule, iscolumncount: iscolumncount, defaultvalue: defaultvalue, width: width, maxlength: maxlength, inputtype: inputtype, required: required, validtype: validtype };
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
            var width = $("#width").val();
            var defaultvalue = $("#defaultvalue").val();
            var maxlength = $("#maxlength").val();
            var inputtype = $(":checked[name='inputtype']").val();
            var validtype = $("#validtype").val();
            var iscolumncount = $(":checked[name='iscolumncount']").val();
            var countrule = $("#countrule").val();
            var required = $(":checked[name='required']").val();
            var html = '<input   type="' + (inputtype || 'text') + '" id="' + id + '"  name="' + id + '"    iscolumncount="' + iscolumncount + '"  type1="flow_text" class="easyui-validatebox textBoxShort"  value="' + defaultvalue + '"';
            if (width) {
                html += 'style="width:' + width + 'px" ';
                html += 'width1="' + width + '" ';
            }
            html += 'defaultvalue="' + defaultvalue + '" ';
            if (parseInt(maxlength) > 0) {
                html += 'maxlength="' + maxlength + '" ';
            }

            if (validtype) {
                html += 'validtype="' + validtype + '" ';
            }
            if (required == "required") {
                html += 'required="required" ';
            }

            if (countrule) {
                html += 'countrule="' + countrule + '" ';
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
 
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="NoneFormBody" runat="server">
</asp:Content>
