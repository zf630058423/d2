<%@ Page Language="C#" %>

<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head id="Head1" runat="server">
    <title></title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <script type="text/javascript" src="../../dialogs/internal.js"></script>
    <script type="text/javascript" src="../common.js"></script>
    <%=F2.WorkflowEngine.Security.Utils.HtmlHelper.OutPutIncludeJsfiles(true,"common")%>
</head>
<body>

    <table cellpadding="0" cellspacing="0" border="0" width="100%" class="common-FormTable">
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
    </table>
    <script type="text/javascript">
        var oNode = null, thePlugins = 'formhidden';
        var tableInfo = parent.TableInfo;
        var filedsJson = tableInfo.FiledsJson;
        $(function () {
            if (UE.plugins[thePlugins].editdom) {
                oNode = UE.plugins[thePlugins].editdom;
            }
            biddingFileds(filedsJson, oNode ? $(oNode).attr("id") : "", $("#bindfiled"));
            if (oNode) {
                $text = $(oNode);
                $("#bindfiled").val($text.attr("name"));
                $("#defaultvalue").val($text.attr('defaultvalue'));
            }
        });
        dialog.oncancel = function () {
            if (UE.plugins[thePlugins].editdom) {
                delete UE.plugins[thePlugins].editdom;
            }
        };
        dialog.onok = function () {
            var bindfiled = $("#bindfiled").val();
            var id = bindfiled;
            var defaultvalue = $("#defaultvalue").val();

            var html = '<input type="text" style="width:80px;" readonly="readonly" type1="flow_hidden" id="' + id + '" name="' + id + '" value="" ';
            html += 'defaultvalue="' + defaultvalue + '" ';
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
