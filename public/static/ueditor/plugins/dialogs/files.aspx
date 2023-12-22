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


    <table cellpadding="0" cellspacing="0" border="0" class="common-FormTable">
        <tr>
            <td>绑定字段:</td>
            <td>
               <input id="bindfiled" name="bindfiled" type="text" class="easyui-validatebox textBoxLong" />

            </td>
        </tr>
        <tr>
            <td>是否必填：</td>
            <td>
                <%=F2.WorkflowEngine.Security.Utils.HtmlHelper.GetRadioString("[{Text:\"是\",Value:\"required\"},{Text:\"否\",Value:\"0\"}]","required","0")%>

            </td>
        </tr>
        <tr>
            <td>宽度：</td>
            <td>
                <input type="text" id="width" name="width" min="60" max="1000" class="easyui-numberbox textBoxShort" />(不填写默认为标准)</td>
        </tr>
        <tr>
            <td>文件类型：</td>
            <td>
                <div style="margin-top: 3px;">格式：*.jpg;*.png;*.gif;*.doc;*.docx</div>
                <div style="margin-top: 3px;">
                    <input type="text" id="filetype" class="mytext" style="width: 227px" />
                </div>
            </td>
        </tr>
    </table>
    <script type="text/javascript">
        var oNode = null, thePlugins = 'formfiles';
        var tableInfo = parent.TableInfo;
        var filedsJson = tableInfo.FiledsJson;
        $(function () {
            if (UE.plugins[thePlugins].editdom) {
                oNode = UE.plugins[thePlugins].editdom;
            }
            //biddingFileds(filedsJson, oNode ? $(oNode).attr("id") : "", $("#bindfiled"));
            if (oNode) {
                $text = $(oNode);
                $("#bindfiled").val($text.attr("name"));
                if ($text.attr('width1')) $("#width").numberbox("setValue", $text.attr('width1'));
                $("#filetype").val($text.attr('filetype'));
                $("input[name='required'][value='" + $text.attr('required') + "']").prop('checked', true);
            }
        });
        dialog.oncancel = function () {
            if (UE.plugins[thePlugins].editdom) {
                delete UE.plugins[thePlugins].editdom;
            }
        };
        dialog.onok = function () {
            var bindfiled = $("#bindfiled").val();
            if (bindfiled == "") {
                FUI.Window.showMsg('请选择字段');
                return false;

            }
            var id = bindfiled;
            var width = $("#width").numberbox("getValue");
            var filetype = $("#filetype").val();
            var required = $(":checked[name='required']").val();
            var html = '<input type="text" type1="flow_files" id="' + id + '" name="' + id + '" value="附件上传" ';
            if (width) {
                html += 'style="width:' + width + '" ';
                html += 'width1="' + width + '" ';
            }
            if (required == "required") {
                html += 'required="required" ';
            }
            html += 'filetype="' + filetype + '" ';
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
