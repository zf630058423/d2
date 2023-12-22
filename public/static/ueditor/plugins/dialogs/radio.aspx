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
            <span class="tab" data-content-id="text_default" onclick="loadOptions();">&nbsp;&nbsp;默认值&nbsp;&nbsp;</span>
            <span class="tab" data-content-id="text_event">&nbsp;&nbsp;事件&nbsp;&nbsp;</span>
        </div>
        <div id="tabbody" class="tabbody" style="height: 300px;">
            <div id="text_attr" class="panel focus">
                <form>
                <table cellpadding="0" cellspacing="0" border="0" width="100%" class="common-FormTable">
                    <tr>
                        <td>绑定字段:</td>
                        <td>
                            <input id="bindfiled" name="bindfiled" type="text" class="easyui-validatebox textBoxLong" />

                        </td>
                    </tr>
                 <%--   <tr>
                        <td>默认值:</td>
                        <td style="padding-top: 3px; padding-bottom: 3px;">
                            <input id="defaultvalue" name="defaultvalue" type="text" class="easyui-validatebox textBoxLong" />
                        </td>
                    </tr>--%>
                    <tr>
                        <td>数据源：</td>
                        <td>
                            <%=F2.WorkflowEngine.Security.Utils.HtmlHelper.GetRadioString("[{Text:\"数据字典\",Value:\"dic\"},{Text:\"自定义\",Value:\"custom\"},{Text:\"SQL语句\",Value:\"sql\"}]","datasource","dic"," onclick='dsChange(this.value);' ")%>
                            

                        </td>
                    </tr>
                    <tr id="ds_dict">
                        <td>字典配置类别：</td>
                        <td>
                            <input type="text" class="mydict" id="ds_dict_value"  sqlkey="CB_ConfigType" more="0" value="" /></td>
                    </tr>
                </table>
                
                <table cellpadding="0" cellspacing="1" border="0" width="100%" id="ds_custom" style="display: none; margin-top: 5px; margin: 0 auto;" align="center">
                    <tr>
                        <td colspan="2">
                            <fieldset style="padding: 5px;">
                                <legend style="">自定义选项 </legend>
                                <div style="margin: 0 auto; padding: 0 5px;">
                                    <div style="height: 25px; padding: 5px 0;">格式：选项文本1,选项值1;选项文本2,选项值2</div>
                                     <div style="height: 25px; padding: 5px 0;">格式2：选项文本1;选项文本2</div>
                                    <textarea class="mytextarea" id="custom_string" style="height: 142px; width: 100%;"></textarea>
                                </div>
                            </fieldset>
                        </td>
                    </tr>
                </table>
                <table cellpadding="0" cellspacing="1" border="0" width="100%" id="ds_sql" style="display: none; margin-top: 5px;" align="center">
                    <tr>
                        <td colspan="2">
                            <fieldset style="padding: 3px;">
                                <legend style="">SQL语句 </legend>
                                <table border="0" style="width: 100%;">
                                    <tr>
                                        <td style="width: 80%">
                                            <div>1.SQL应返回两个字段的数据源</div>
                                            <div>2.字段为值的列重命名为：Value ，字段为文本的列重命名为：Text</div>
                                            <div>示例：SELECT RealName Value,RealName Text FROM sys_Users</div>
                                        </td>
                                        <td>
                                            <input type="button" value="测试SQL" onclick="testSql($('#ds_sql_value').val());" class="mybutton" />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colspan="2" style="padding-top: 4px;">
                                            <textarea cols="1" rows="1" id="ds_sql_value" style="width: 99%; height: 120px; font-family: Verdana;" class="mytextarea"></textarea>
                                        </td>
                                    </tr>
                                </table>
                            </fieldset>
                        </td>
                    </tr>
                </table>
                  </form>
            </div>
            <div id="text_default" class="panel">
                <div id="text_default_list" style="height: 288px; overflow: auto;">
                </div>
            </div>
            <div id="text_event" class="panel">
                <%Server.Execute("events.aspx"); %>
            </div>
        </div>
    </div>
      
    <script type="text/javascript">
        var oNode = null, thePlugins = 'formradio';

        var tableInfo = parent.TableInfo;
        var filedsJson = tableInfo.FiledsJson;
        var events = [];
        var eventsid = Object.toGuid(false);

        $(function () {
            if (UE.plugins[thePlugins].editdom) {
                oNode = UE.plugins[thePlugins].editdom;
            }
           // biddingFileds(filedsJson, oNode ? $(oNode).attr("id") : "", $("#bindfiled"));
            if (oNode) {
                var $text = $(oNode);
                var bindfiled = $text.attr("name");
                $("#bindfiled").val($text.attr("name"));
                var datasource = $text.attr('datasource');
                var defaultvalue = $text.attr('defaultvalue');
              
                var data = { bindfiled: bindfiled, datasource: datasource, defaultvalue: defaultvalue };
                FUI.Form.loadFormData(data);

                if ("custom" == datasource) {
                    $("#ds_dict").hide();
                    $("#ds_sql").hide();
                    $("#ds_custom").show();
                    var custionJSONString = $text.attr("customopts");
                    if ($.trim(custionJSONString).length > 0) {
                        var customJSON = JSON.parse(custionJSONString);
                        var customString = [];
                        for (var i = 0; i < customJSON.length; i++) {
                            customString.push(customJSON[i].title + "," + customJSON[i].value);
                        }
                        $("#custom_string").val(customString.join(';'));
                    }

                }
                else if ("dic" == datasource) {
                    $("#ds_dict").show();
                    $("#ds_sql").hide();
                    $("#ds_custom").hide();
                    $("#ds_dict_value").combobox("setValue", $text.attr('dictid'));

                }
                else if ("sql" == datasource) {
                    $("#ds_dict").hide();
                    $("#ds_sql").show();
                    $("#ds_custom").hide();
                    $("#ds_sql_value").val($text.attr('sql'));
                }

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

        function loadOptions() {
            var $listDiv = $("#text_default_list");
            var datasource = $(":checked[name='datasource']").val();
            var dvalue = $(":checked", $listDiv).val() || ($(oNode).attr("defaultvalue") || "");
            $listDiv.html('');
            if ("custom" == datasource) {
                var custom_string = ($("#custom_string").val() || "").split(';');
                for (var i = 0; i < custom_string.length; i++) {
                    var titlevalue = custom_string[i].split(',');
                    var title;
                    var value;
                    if (titlevalue.length == 1) {
                        title = titlevalue[0];
                        value = title;
                    }
                    else if (titlevalue.length == 2) {
                         title = titlevalue[0];
                         value = titlevalue[1];
                    }
                    else {
                        continue;
                    }
                    var option = '<div><input type="radio" ' + (value == dvalue ? 'checked="checked"' : '') + ' value="' + value + '" id="defaultvalue_' + value + '" style="vertical-align:middle;" name="defaultvalue"/><label style="vertical-align:middle;" for="defaultvalue_' + value + '">' + title + '(' + value + ')</label></div>';
                    $listDiv.append(option);
                }
            }
            else if ("dic" == datasource) {
                var dictid = $("#ds_dict_value").combobox("getValue");
                $.ajax({
                    url: "getdictchilds.aspx?dictid=" + dictid, cache: false, async: false, dataType: "json", success: function (json) {
                        for (var i = 0; i < json.length; i++) {
                            var title = json[i].title;
                            var value = json[i].id;
                            var option = '<div><input type="radio" ' + (value == dvalue ? 'checked="checked"' : '') + ' value="' + value + '" id="defaultvalue_' + value + '" style="vertical-align:middle;" name="defaultvalue"/><label style="vertical-align:middle;" for="defaultvalue_' + value + '">' + title + '(' + value + ')</label></div>';
                            $listDiv.append(option);
                        }
                    }
                });
            }
            else if ("sql" == datasource) {
                var sql = $("#ds_sql_value").val();
                $.ajax({
                    url: "getsqljson.aspx", type: "post", data: { sql: sql, conn: attJSON.dbconn }, cache: false, async: false, dataType: "json", success: function (json) {
                        for (var i = 0; i < json.length; i++) {
                            var title = json[i].title;
                            var value = json[i].id;
                            var option = '<div><input type="radio" ' + (value == dvalue ? 'checked="checked"' : '') + ' value="' + value + '" id="defaultvalue_' + value + '" style="vertical-align:middle;" name="defaultvalue"/><label style="vertical-align:middle;" for="defaultvalue_' + value + '">' + title + '(' + value + ')</label></div>';
                            $listDiv.append(option);
                        }
                    }
                });
            }
        }

        function dsChange(value) {
            if (value == "dic") {
                $("#ds_dict").show();
                $("#ds_custom").hide();
                $("#ds_sql").hide();
            }
            else if (value == "custom") {
                $("#ds_dict").hide();
                $("#ds_sql").hide();
                $("#ds_custom").show();
            }
            else if (value == "sql") {
                $("#ds_dict").hide();
                $("#ds_custom").hide();
                $("#ds_sql").show();
            }
        }

        dialog.oncancel = function () {
            if (UE.plugins[thePlugins].editdom) {
                delete UE.plugins[thePlugins].editdom;
            }
        };
        dialog.onok = function () {
            if (!FUI.Form.validateForm()) return false;
            var bindfiled = $("#bindfiled").val();
            var id = bindfiled;
            var datasource = $(":checked[name='datasource']").val();
            var radios = [];
            var dictid = "";
            var sql = "";
            var dvalue = $(":checked[name='defaultvalue']", $("#text_default_list")).val() || "";
            if ("custom" == datasource) {
                var custom_string = ($("#custom_string").val() || "").split(';');
                for (var i = 0; i < custom_string.length; i++) {
                    var titlevalue = custom_string[i].split(',');
                    var title;
                    var value;
                    if (titlevalue.length == 1) {
                        title = titlevalue[0];
                        value = title;
                    }
                    else if (titlevalue.length == 2) {
                         title = titlevalue[0];
                         value = titlevalue[1];
                    }
                    else {
                        continue;
                    }
                    radios.push({ title: title, value: value });
                }
            }
            else if ("dic" == datasource) {
                dictid = $("#ds_dict_value").combobox("getValue");
            }
            else if ("sql" == datasource) {
                sql = $("#ds_sql_value").val();
            }

            var html = '<input type="text" value="单选按钮组" type1="flow_radio" id="' + id + '" name="' + id + '" datasource="' + datasource + '" dictid="' + dictid + '" defaultvalue="' + dvalue + '" ';
            if ("custom" == datasource) {
                html += "customopts='" + JSON.stringify(radios) + "' ";
            }
            if ("sql" == datasource) {
                html += 'sql="' + sql.replaceAll('"', '&quot;') + '" ';
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
