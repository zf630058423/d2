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
    <form>

        <table cellpadding="0" cellspacing="0" border="0" class="common-FormTable">
            <tr>
                <td>绑定字段:</td>
                <td>
                    <select id="bindfiled" name="bindfiled" required="required" class="easyui-validatebox textBoxLong"></select>

                </td>
            </tr>
            <tr>
                <td>宽度：</td>
                <td>
                    <input type="text" id="width" name="width" min="60" max="1000" class="easyui-numberbox textBoxShort" />(不填写默认为标准)</td>
            </tr>
            <tr>
                <td>选择范围：</td>
                <td>
                    <div style="padding-top: 5px;">
                        <input type="text" id="rang" class="mydict" style="width: 200px;" />
                    </div>
                </td>
            </tr>
            <tr>
                <td>是否多选：</td>
                <td>
                    <input type="checkbox" id="ismore" value="1" style="vertical-align: middle;" /><label for="ismore" style="vertical-align: middle;">是否允许多选</label></td>
            </tr>
        </table>
    </form>
    <script type="text/javascript">
        var oNode = null, thePlugins = 'formdictionary';
        var tableInfo = parent.TableInfo;
        var filedsJson = tableInfo.FiledsJson;
        $(function () {
            if (UE.plugins[thePlugins].editdom) {
                oNode = UE.plugins[thePlugins].editdom;
            }
            biddingFileds(filedsJson, oNode ? $(oNode).attr("id") : "", $("#bindfiled"));
            if (oNode) {
                $text = $(oNode);
                $("#defaultvalue").val($text.attr('defaultvalue'));
                if ($text.attr('width1')) $("#width").val($text.attr('width1'));
                $("#rang").val($text.attr('rootid'));
                new RoadUI.Dict().setValue($("#rang"));
                $("#ismore").prop('checked', "1" == $text.attr('more'));
            }
        });
        dialog.oncancel = function () {
            if (UE.plugins[thePlugins].editdom) {
                delete UE.plugins[thePlugins].editdom;
            }
        };
        dialog.onok = function () {
            var bindfiled = $("#bindfiled").val();
            var id = attJSON.dbconn && attJSON.dbtable && bindfiled ? attJSON.dbtable + '.' + bindfiled : "";
            var width = $("#width").val();
            var ismore = $("#ismore").prop('checked') ? "1" : "0";
            var rang = $("#rang").val();


            var html = '<input type="text" type1="flow_dict" id="' + id + '" name="' + id + '" value="数据字典选择框" ';
            if (width) {
                html += 'style="width:' + width + '" ';
                html += 'width1="' + width + '" ';
            }
            if (rang) {
                html += 'rootid="' + rang + '" ';
            }
            html += 'more="' + ismore + '" ';
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
