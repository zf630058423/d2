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
                <td style="width: 80px;">样式：</td>
                <td>宽度：<input type="text" id="width1" name="width1"  class="easyui-numberbox textBoxShort" style="width: 100px" />px
                    &nbsp;&nbsp;&nbsp;&nbsp;高度：<input type="text" id="height1" name="height1"  class="easyui-numberbox textBoxShort" style="width: 100px" />px
                </td>
            </tr>
            <tr>
                <td>数据类型：</td>
                <td>
                    <input type="radio" value="0" id="dataformat_0" name="dataformat" style="vertical-align: middle;" /><label for="dataformat_0" style="vertical-align: middle;">DataTable</label>
                    <input type="radio" value="1" id="dataformat_1" name="dataformat" style="vertical-align: middle;" /><label for="dataformat_1" style="vertical-align: middle;">HTML</label>
                    <input type="radio" value="2" id="dataformat_2" name="dataformat" style="vertical-align: middle;" /><label for="dataformat_2" style="vertical-align: middle;">JSON</label>
                </td>
            </tr>
            <tr>
                <td>数据来源：</td>
                <td>
                    <input type="radio" value="0" onclick="datasourceChange('datasource_0_div');" id="datasource_0" name="datasource" style="vertical-align: middle;" /><label for="datasource_0" style="vertical-align: middle;">SQL</label>
                    <input type="radio" value="1" onclick="datasourceChange('datasource_1_div');" id="datasource_1" name="datasource" style="vertical-align: middle;" /><label for="datasource_1" style="vertical-align: middle;">URL</label>
                    <input type="radio" value="2" onclick="datasourceChange('datasource_2_div');" id="datasource_2" name="datasource" style="vertical-align: middle;" /><label for="datasource_2" style="vertical-align: middle;">方法</label>
                </td>
            </tr>
            <tr>
                <td colspan="2">
                    <div id="datasource_0_div" style="display: none;">
                        <div style="margin: 3px 0;">SQL：(执行SQL语句返回的结果生成表格)</div>
                        <div>
                            <textarea style="width: 99%; height: 80px; font-family: Verdana;" class="mytextarea" id="datasource_0_textarea"></textarea>
                        </div>
                    </div>
                    <div id="datasource_1_div" style="display: none;">
                        <div style="margin: 3px 0;">URL：(执行URL输出的结果显示)</div>
                        <div>
                            <textarea style="width: 99%; height: 80px; font-family: Verdana;" class="mytextarea" id="datasource_1_textarea"></textarea>
                        </div>
                    </div>
                    <div id="datasource_2_div" style="display: none;">
                        <div style="margin: 3px 0;">方法：(调用自定义方法返回的值显示)</div>
                        <div>
                            <textarea style="width: 99%; height: 80px; font-family: Verdana;" class="mytextarea" id="datasource_2_textarea"></textarea>
                        </div>
                    </div>
                </td>
            </tr>
        </table>

    </form>
    <script type="text/javascript">
        var oNode = null, thePlugins = 'formgrid';
        var tableInfo = parent.TableInfo;
        var filedsJson = tableInfo.FiledsJson;
        $(function () {
            if (UE.plugins[thePlugins].editdom) {
                oNode = UE.plugins[thePlugins].editdom;
            }
            //biddingFileds(attJSON, oNode ? $(oNode).attr("id") : "", $("#bindfiled"));
            if (oNode) {
                $text = $(oNode);
                var width1 = $text.attr('width1')||700;
                var height1 = $text.attr('height1')||400;
                var dataformat = $text.attr('dataformat');
                var datasource = $text.attr('datasource');
                

                var data = { width1: width1, height1: height1, dataformat: dataformat, datasource: datasource};
                FUI.Form.loadFormData(data);

                switch (datasource) {
                    case "0":
                        $("#datasource_0_textarea").val($text.attr('datasource1'));
                        $("#datasource_0_div").show();
                        break;
                    case "1":
                        $("#datasource_1_textarea").val($text.attr('datasource1'));
                        $("#datasource_1_div").show();
                        break;
                    case "2":
                        $("#datasource_2_textarea").val($text.attr('datasource1'));
                        $("#datasource_2_div").show();
                        break;
                }
            }
        });
        function datasourceChange(id) {
            var $divs = $("#datasource_0_div,#datasource_1_div,#datasource_2_div");
            $divs.each(function () {
                if ($(this).attr("id") == id) {
                    $(this).show();
                }
                else {
                    $(this).hide();
                }
            });
        }
        dialog.oncancel = function () {
            if (UE.plugins[thePlugins].editdom) {
                delete UE.plugins[thePlugins].editdom;
            }
        };
        dialog.onok = function () {
            //var bindfiled = $("#bindfiled").val();
            //var id = attJSON.dbconn && attJSON.dbtable && bindfiled ? attJSON.dbtable + '.' + bindfiled : "";
            var width1 = $("#width1").numberbox("getValue");
            var height1 = $("#height1").numberbox("getValue");
            var dataformat = $(":radio:checked[name='dataformat']").val();
            var datasource = $(":radio:checked[name='datasource']").val();
            var datasource1 = "";
            switch (datasource) {
                case "0":
                    datasource1 = $("#datasource_0_textarea").val();
                    break;
                case "1":
                    datasource1 = $("#datasource_1_textarea").val();
                    break;
                case "2":
                    datasource1 = $("#datasource_2_textarea").val();
                    break;
            }

            var html = '<input type="text" type1="flow_grid" value="数据列表" ';
            if (width1) {
                html += 'width1="' + width1 + '" ';
            }
            if (height1) {
                html += 'height1="' + height1 + '" ';
            }
            if (dataformat) {
                html += 'dataformat="' + dataformat + '" ';
            }
            if (datasource) {
                html += 'datasource="' + datasource + '" ';
            }
            if (datasource1) {
                html += 'datasource1="' + datasource1.replaceAll('"', '&quot;') + '" ';
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
