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

    <br />
    <table cellpadding="0" cellspacing="0" border="0" class="common-FormTable">
        <tr>
            <td>默认值：</td>
            <td style="padding-top: 3px; padding-bottom: 3px;">
                <input id="defaultvalue" name="defaultvalue" type="text" class="easyui-validatebox textBoxShort" style="width: 98%;" />
                <br />
                选择上下文变量：<select class="textBoxShort" onchange="setDefaultValue(document.getElementById('defaultvalue'), this.value);" style="width: 150px">
                </select>

            </td>
        </tr>
        <tr>
            <td>字号：</td>
            <td>
                <input type="text" id="fontsize" name="fontsize" class="textBoxShort" style="width: 150px" />
                (例:18px, 18pt)</td>
        </tr>
        <tr>
            <td>颜色：</td>
            <td>
                <input type="text" id="fontcolor" name="fontcolor" class="textBoxShort" style="width: 150px" />
                (例:#cccccc, red)</td>
        </tr>
        <tr>
            <td>样式：</td>
            <td>
                <input type="checkbox" id="fontbold" name="fontbold" value="1" style="vertical-align: middle;" /><label for="fontbold" style="vertical-align: middle;">粗体</label>
                <input type="checkbox" id="fontstyle" name="fontstyle" value="1" style="vertical-align: middle;" /><label for="fontstyle" style="vertical-align: middle;">斜体</label>
            </td>
        </tr>
    </table>
    <script type="text/javascript">
        var oNode = null, thePlugins = 'formlabel';
        var attJSON = parent.formattributeJSON;
        $(function () {
            if (UE.plugins[thePlugins].editdom) {
                oNode = UE.plugins[thePlugins].editdom;
            }
            //biddingFileds(attJSON, oNode ? $(oNode).attr("id") : "", $("#bindfiled"));
            if (oNode) {
                $text = $(oNode);
                $("#defaultvalue").val($text.attr('defaultvalue'));
                $("#fontsize").val($text.attr('fontsize'));
                $("#fontcolor").val($text.attr('fontcolor'));
                $("#fontbold").prop("checked", "1" == $text.attr('fontbold'));
                $("#fontstyle").prop("checked", "1" == $text.attr('fontstyle'));
            }
        });
        dialog.oncancel = function () {
            if (UE.plugins[thePlugins].editdom) {
                delete UE.plugins[thePlugins].editdom;
            }
        };
        dialog.onok = function () {
            //var bindfiled = $("#bindfiled").val();
            //var id = attJSON.dbconn && attJSON.dbtable && bindfiled ? attJSON.dbtable + '.' + bindfiled : "";
            var defaultvalue = $("#defaultvalue").val();
            var fontsize = $("#fontsize").val();
            var fontcolor = $("#fontcolor").val();

            var html = '<input type="text" type1="flow_label" value="Label标签" ';
            if (defaultvalue) {
                html += 'defaultvalue="' + defaultvalue + '" ';
            }
            if (fontsize) {
                html += 'fontsize="' + fontsize + '" ';
            }
            if (fontcolor) {
                html += 'fontcolor="' + fontcolor + '" ';
            }
            if ($("#fontbold").prop("checked")) {
                html += 'fontbold="1" ';
            }
            if ($("#fontstyle").prop("checked")) {
                html += 'fontstyle="1" ';
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
