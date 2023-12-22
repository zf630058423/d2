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
                   <input id="bindfiled" name="bindfiled" type="text" class="easyui-validatebox textBoxLong" />

                </td>
            </tr>
            <tr>
                <td>宽度:</td>
                <td>
                    <input type="text" id="width" max="2000" name="width" class="easyui-numberbox textBoxShort" style="width: 150px" /></td>
            </tr>
            <tr>
                <td>高度:</td>
                <td>
                    <input type="text" id="height" max="1000" name="height" class="easyui-numberbox textBoxShort" style="width: 150px" /></td>
            </tr>

        </table>
        <script type="text/javascript">
            var oNode = null, thePlugins = 'formhtml';
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
                    //$("#defaultvalue").val($text.attr('defaultvalue'));
                    //$("input[name='model'][value='" + $text.attr('model') + "']").prop('checked', true);
                  
                    //$("#maxlength").val($text.attr('maxlength'));
                    //$("#valuetype").val($text.attr('valuetype'));
                    FUI.Form.loadFormData({ width: $text.attr('width1'), height: $text.attr('height1'), value: $text.attr('value') });
                }
            });
            dialog.onok = function () {
                var bindfiled = $("#bindfiled").val();
                var id = bindfiled;
                //var defaultvalue = $("#defaultvalue").val();
                //var maxlength = $("#maxlength").val();
                //var model = $(":checked[name='model']").val();
                var width = $("#width").val();
                var height = $("#height").val();
                //var valuetype = $("#valuetype").val();

                var html = '<input type="text" isflow="1" type1="flow_html" id="' + id + '" name="' + id + '" value="HTML编辑器" ';
                if (width && height) {
                    html += 'style="width:' + width + 'px;height:' + height + 'px" ';
                    html += 'width1="' + width + '" ';
                    html += 'height1="' + height + '" ';
                }
                else if (width || height) {
                    if (width) {
                        html += 'style="width:' + width + '" ';
                        html += 'width1="' + width + '" ';
                    }
                    if (height) {
                        html += 'style="height:' + height + '" ';
                        html += 'height1="' + height + '" ';
                    }
                }
                else {
                    html += 'style="width:95%; height:150px;" ';
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
