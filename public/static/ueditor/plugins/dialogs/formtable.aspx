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
        <div id="tabbody" class="tabbody">
            <form>
                <div id="text_attr" class="panel focus">

                    <table cellpadding="0" cellspacing="0" border="0" class="common-FormTable">
                        <tr id="rowsTr">
                            <td>行数：</td>
                            <td>
                                <input type="text"  id="rows" value="4"  required="required"  name="rows" min="1" max="100" class="easyui-validatebox textBoxShort" validtype="zint"  /></td>
                        </tr>
                        <tr id="columnsTr">
                            <td>列数：</td>
                            <td>
                                <input type="text" id="columns" value="6" required="required"  name="columns" min="1" max="12" class="easyui-validatebox textBoxShort"  validtype="zint"  /></td>
                        </tr>
                        <tr>
                            <td>表格样式：</td>
                            <td>
                                <%=F2.WorkflowEngine.Security.Utils.HtmlHelper.GetSelectOptionsString("[{Text:\"通用样式\",Value:\"common-FormTable\"}]","tableClass","common-FormTable"," required=\"required\"  class=\"textBoxShort\"")%>
                                
                            </td>
                        </tr>
                        <tr>
                            <td>是否增加表标题头：</td>
                            <td>
                                <%=F2.WorkflowEngine.Security.Utils.HtmlHelper.GetRadioString("[{Text:\"是\",Value:\"1\"},{Text:\"否\",Value:\"0\"}]","addTableTitle","0")%>

                            </td>
                        </tr>
                        <tr>
                            <td>宽度：</td>
                            <td>
                                <input type="text" id="width" name="width" max="1000" class="easyui-numberbox textBoxShort" />(建议为空)</td>
                        </tr>
                        <tr>
                            <td>高度：</td>
                            <td>
                                <input type="text" id="height" name="height" max="1000" class="easyui-numberbox textBoxShort" />(建议为空)</td>
                        </tr>
                    </table>
                    <div id="msg" style="color:red"></div>
                </div>

                <div id="text_event" class="panel">
                    <%Server.Execute("events.aspx"); %>
                </div>
            </form>
        </div>
    </div>
    <script type="text/javascript">
        var oNode = null, thePlugins = 'formtable';

        $(function () {
            if (UE.plugins[thePlugins].editdom) {
                oNode = UE.plugins[thePlugins].editdom;
            }
            if (oNode) {
                $text = $(oNode);
                //$("#rowsTr").hide();
                //$("#columnsTr").hide();
 
              

                var rows = $text.find("tr").length;// $text.attr('rows') || "";
                var columns = $text.find("tr:eq(0) td").length;//$text.attr('columns') || "";
                var tableClass = $text.attr('tableClass') || "";
                var width = $text.attr('width1') || "";
                var height = $text.attr('height1') || "";
                var addTableTitle = $text.attr('addTableTitle');
                var data = { rows: rows, columns: columns, height: height, width: width, tableClass: tableClass, addTableTitle: addTableTitle };
                FUI.Form.loadFormData(data);
               
                $("#rows").attr("disabled", "disabled");
                $("#columns").attr("disabled", "disabled");

                $("#msg").html("【当前为编辑状态】若要更改“行数”“列数”请通过设计器的“前插入行”“前插入列”“删除行”“删除列”来更改");
            }

        });
        dialog.oncancel = function () {
            if (UE.plugins[thePlugins].editdom) {
                delete UE.plugins[thePlugins].editdom;
            }
        };
        dialog.onok = function () {
            if (!FUI.Form.validateForm()) return false;
 
            var rows = $("#rows").val();
            var columns = $("#columns").val();
            var tableClass = $("#tableClass").val();
            var addTableTitle = $(":checked[name='addTableTitle']").val();
            var width = $("#width").val();
            var height = $("#height").val();
            var html = '';
            if (oNode == null) {
                html = '<table type1="flow_table" tableClass="' + tableClass + '" addTableTitle="' + addTableTitle + '" class="' + tableClass + '" cellpadding="0" cellspacing="0" ';
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
                if (addTableTitle == "1") {
                    html += 'addTableTitle="1" ';
                }
                html += '>';
                var trHtml = "";
                for(var i=0;i<rows;i++)
                {
                    trHtml += "<tr>"
                    for (var j = 0; j < columns; j++) {
                        trHtml += "<td></td>"
                    }
                    trHtml += "</tr>"
                }
                html += trHtml;
                html += '</table>';
            }

            if (oNode) {
                $(oNode).attr('tableClass', tableClass)
                if (width && height) {
                    $(oNode).attr('style', 'width:' + width + 'px;height:' + height + 'px;');
                    $(oNode).attr('width1', width);
                    $(oNode).attr('height1', height);
                }
                else if (width || height) {
                    $(oNode).removeAttr("style");
                    $(oNode).removeAttr("width1");
                    $(oNode).removeAttr("height1");
                    if (width) {
                        $(oNode).attr('style', 'width:' + width + 'px;');
                        $(oNode).attr('width1', width);

                    }
                    if (height) {
                        $(oNode).attr('style', 'height:' + height + 'px;');
                        $(oNode).attr('height1', height);
                    }
                }
                $(oNode).attr('addTableTitle', addTableTitle);

                //$(oNode).after(html);
                //domUtils.remove(oNode, false);
            }
            else {
                editor.execCommand('insertHtml', html);
            }
            delete UE.plugins[thePlugins].editdom;
        }

    </script>
</body>
</html>
