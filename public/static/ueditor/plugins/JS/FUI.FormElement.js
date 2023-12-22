//FUI 表单元素构建
var isMobile = false;
; $(document).ready(function () {
    try {
        isMobile = WFContext.IsMobile;
    }
    catch (err) {
        isMobile = false;
    }
    var fui = new FUI.Initail();
    fui.parse(document);
});

//渲染FUI
FUI.Initail = function () {
    //执行渲染
    this.parse = function (containObject) {
        containObject = containObject || document;
        //===========构建控件元素html==============
        $parseElement(containObject);
        //=======给特殊的控件传值====================
        setTimeout(function () {
            $parseData(containObject);
        }, 1000);
    },
    this.parseElement = function (containObject,isSetDefaultValue) {
        containObject = containObject || document;
        $parseElement(containObject,isSetDefaultValue);
    },
    //渲染值
    this.parseData = function (containObject) {
        containObject = containObject || document;
        $parseData(containObject);
    }
}

//构建元素
function $parseElement(containObject,isSetDefaultValue) {
    containObject = containObject || document;
    //初始化单选按钮组
    $("input[type1='flow_radio']", containObject).each(function () {
        var radio = new FUI.Radio();
        radio.init($(this));
    });

    //初始化多选复选框按钮组
    $("input[type1='flow_checkbox']", containObject).each(function () {
        var checkbox = new FUI.Checkbox();
        checkbox.init($(this));
    });

    //初始化下拉框
    $("input[type1='flow_select']", containObject).each(function () {
        var select = new FUI.Select();
        select.init($(this));
    });

    //初始自定义选择器
    $("input[type1='flow_selector']", containObject).each(function () {
        var selector = new FUI.Selector();
        selector.init($(this));
    });

    //初始自定义选择对话框
    $("input[type1='flow_customdialog']", containObject).each(function () {
        var customdialog = new FUI.CustomDialog();
        customdialog.init($(this));
    });

    $("input[type1='flow_files']", containObject).each(function () {
        var file = new FUI.File();
        file.init($(this));
    });
    //加载构建富文本编辑器，不可编辑时直接显示富文本的内容
    $("textarea[type1='flow_richeditor']", document).each(function () {
        var richeditor = new FUI.RicheditorInitailHtml();
        richeditor.init($(this));
    });
    //日期时间
    //$("input[type1='flow_datetime']", containObject).each(function () {
    //    var datetime = new FUI.Datetime();
    //    datetime.init($(this));
    //})

    $("input[type1='flow_hidden']", containObject).each(function () {
        $(this).hide();
    });

    if (("undefined" != typeof  WFContext &&WFContext.WorkflowformAction == 0)||("undefined" != typeof __busObjectData &&WFContext.FormKey!=""&&__busObjectData[0].data.length==0)) {
        setTargetDefaultValue(containObject);
    }else  if (isSetDefaultValue && "undefined" != typeof  WFContext &&WFContext.WorkflowformAction ==2) 
    {
        setTargetDefaultValue(containObject);   	
    }
    
}

function setTargetDefaultValue(containObject) {
    //隐藏及默认值
    $("input[type1='flow_hidden']", containObject).each(function () {
        if ($(this).attr("defaultvalue") != ""&&$(this).attr("defaultvalue")!=undefined) {
            var myValue = getSysDefaultValue($(this).attr("defaultvalue"));
            $(this).val(myValue);
        }
    });

    //日期的默认值
    $("input[type1='flow_datetime']", containObject).each(function () {
        if ($(this).attr("defaultvalue") != "") {
            var myValue = getSysDefaultValue($(this).attr("defaultvalue"));
            var istime = $(this).attr("istime");
            if (myValue) {
                if (isMobile == true) { $(this).val(myValue); }
                else {
                    if (istime == "1") {
                        $(this).datetimebox('setValue', myValue); 
                       
                    }
                    else {
                        $(this).datebox('setValue', myValue);
                    }
                }
            }
        }
    });

    //文本的默认值
    $("input[type1='flow_text']", containObject).each(function () {
        if ($(this).attr("defaultvalue") != "") {
            var myValue = getSysDefaultValue($(this).attr("defaultvalue"));
            $(this).val(myValue);
        }
    });
}

function getSysDefaultValue(express) {
	if(Object.toIsEmpty(express))return "";
    if (express.indexOf("#") > -1) {
        var name = express.toString().replace("#", "").replace("#", "");
        switch (name) {
            case "GuId": return Object.toGuid();
            case "CurrentDateTime": return Object.toGetCurrentDateTimeString();
            case "CurrentDate": return Object.toGetCurrentDateString();
            default: if (WFContext[name]) return WFContext[name];
        }
        return "";
    }
    return express;
}
function $parseData(containObject) {
    containObject = containObject || document;
    //复选框
    $("input[formHideCheckbox]", containObject).each(function () {
        var contain = $(this).parent();
        var name = $(this).attr("name");
        var values = $(this).val().toString().split(',');
        //先清除
        $("input[checkboxItem='" + name + "']", contain).each(function () {
            $(this).prop("checked", false);
        });
        if (values.length > 0) {
            $("input[checkboxItem='" + name + "']", contain).each(function () {
                var itemValue = $(this).val();
                for (var i = 0; i < values.length; i++) {
                    if (values[i] == itemValue) {
                        $(this).prop("checked", true);
                    }

                }
            });
        }
    });

    //单选框 
    $("input[formRadiobox]", containObject).each(function () {
        var contain = $(this).parent();
        var name = $(this).attr("name");
        var value = $(this).val();
        if (value != "") {
            $("input[radioItem='" + name + "']", contain).each(function () {
                var itemValue = $(this).val();
                if (value == itemValue) {
                    $(this).prop("checked", true);
                }
                else {
                    $(this).prop("checked", false);
                }

            });
        }
    });




    //附件
    $("input[formHideFile]", containObject).each(function () {
        var container = $(this).parent();
        var name = $(this).attr("name");
        var values = $(this).val();
        if (values == "") return true;
        //先清除
        $("div[fileNameContainer='" + name + "']", container).html("");
        if(values!=""&&values!=null&&values.indexOf("#")>-1){
        	values=values.substr(1,values.length-2);
        }
        var objectData = eval("(" + values + ")");
        loadFileItem(name, objectData, container);
    });
}
//==============富文本编辑器===============
var richeditorArr = [];
; FUI.RicheditorInitailHtml = function () {
    //宣染出编辑器的容器textarea
    var instance = this;
    this.init = function ($text) {
        var name = $text.attr("name");
        var defaultvalue = $text.attr('defaultvalue') || "";
        var width = $text.attr('width1') == "" ? "900px" : $text.attr('width1');
        var height = $text.attr('height1') == "" ? "900px" : $text.attr('height1');
        var required = $text.attr("required") || "";
        if (required != "") required = "required=\"required\"";
        var require = $text.attr("require") || "";
        if (required == "" && require != "") {
            required = "require=\"required\"";
        }
        var richeditorType = $text.attr("richeditorType");
        var richeditorId = $text.attr("richeditorId");
        var textareaRic = "<textarea richeditorContainer='" + name + "'  richeditorContainerType=\"" + richeditorType + "\"  id=\"" + richeditorId + "\"   field='" + name + "'  style=\"" + width + height + "margin-left:auto;margin-right:auto;position:relative\" ></textarea>";
        $text.after(textareaRic);
        $text.hide();
    }
}
//创建真正的富文本编辑器
; FUI.Richeditor = function () {
    var instance = this;
    this.init = function ($text) {
        var name = $text.attr("name");
        var defaultvalue = $text.attr('defaultvalue') || "";
        var required = $text.attr("required") || "";
        var width = $text.attr('width1') == "" ? "900px" : $text.attr('width1');
        var height = $text.attr('height1') == "" ? "900px" : $text.attr('height1');
        if (required != "") required = "required=\"required\"";

        var require = $text.attr("require") || "";
        if (required == "" && require != "") {
            required = "require=\"required\"";
        }
        var richeditorType = $text.attr("richeditorType");
        var richeditorId = $text.attr("richeditorId");

        var readonlyValue=$("textarea[idd='" + name + "']").attr("readonly");
        if (undefined != readonlyValue && readonlyValue == "readonly") {
            //不可编辑时直接显示富文本内容(将富文本容器替换成内容)
            var initailHtml = $("textarea[idd='" + name + "']").val();
            if (richeditorType == "richeditorofficial") {
                $("#" + richeditorId).replaceWith("<div id=\"" + richeditorId + "\" style=\"" + width + "margin-left:auto;margin-right:auto; position: relative\">" + initailHtml + "</div>").remove();
 
            } else {
                $("#" + richeditorId).replaceWith("<div id=\"" + richeditorId + "\" style=\"" + width + "margin-left:auto;margin-right:auto;\">" + initailHtml + "</div>").remove();
            }
        } else {
            //将富文本容器转为UEditor编辑器
            var editorItem = { name: name, editor: null }
            setTimeout(function () {
                editorItem.editor = UE.getEditor(richeditorId, { toolbars: window.UEDITOR_CONFIG.sampleToolbars });
                editorItem.editor.autoHeightEnabled = false;
                richeditorArr.push(editorItem);
                var initailHtml = $("textarea[idd='" + name + "']").val();
                if (initailHtml) {
                    setTimeout(function () {
                        editorItem.editor.setContent(initailHtml);
                      
                    }, 1000);
                }
               
            }, 200);

        }

       
       // $("textarea[idd='zwgw.gwzw']").after(initailHtml);
    }
}
//构造单选按钮组控件元素
; FUI.Radio = function () {
    var instance = this;
    this.init = function ($text) {
        var name = $text.attr("name");
        var defaultvalue = $text.attr('defaultvalue') || "";
        var sql = $text.attr('sql') || "";
        var eventsid = $text.attr('eventsid') || "";

        var required = $text.attr("required") || "";
        if (required != "") required = "required=\"required\"";

        var require = $text.attr("require") || "";
        if (required == "" && require != "") {
            required = "require=\"required\"";
        }

        var datasource = $text.attr("datasource");
        var custionJSONString = $text.attr("customopts");
        var configType = $text.attr('dictid') || "";
        var hideInput = ' <input idd="' + name + '" id="' + name + '" name="' + name + '" formRadiobox="' + name + '"  value="' + defaultvalue + '" ' + required + ' type="hidden" />';
        var temPlate = "&nbsp;<input type=\"radio\" onclick=\"onRadioItembox(this)\" idd=\"{0}\" radioItem=\"{0}\" value=\"{1}\" title=\"{2}\"  {4}    /><span idd=\"{0}\">{3}</span>"
        var html = "";
        if (datasource == "custom") {
            if ($.trim(custionJSONString).length > 0) {
                var customJSON = JSON.parse(custionJSONString);
                for (var i = 0; i < customJSON.length; i++) {
                    var title = customJSON[i].title;
                    var value = customJSON[i].value;
                    var checkedStr = value == defaultvalue ? 'checked="checked"' : "";
                    var itemEventsId = eventsid != "" ? "eventsid = '" + eventsid + "'" : "";

                    html += Object.toStringFormat(temPlate, name, value, title, title, checkedStr);
                }

            }
        }
        else if (datasource == "dic" && configType != "") {
            if ($ConfigTypeData == null || $ConfigTypeData.length <= 0) return false;
            var comboBoxData = [];
            for (configTypeIndex in $ConfigTypeData) {
                if ($ConfigTypeData[configTypeIndex].configType == configType) {
                    comboBoxData = $ConfigTypeData[configTypeIndex].data;
                    break;
                }
            }
            for (var i = 0; i < comboBoxData.length; i++) {
                var title = comboBoxData[i].text;
                var value = comboBoxData[i].value;
                var checkedStr = value == defaultvalue ? 'checked="checked"' : "";
                html += Object.toStringFormat(temPlate, name, value, title, title, checkedStr);
            }
        }
        else if (datasource == "sql" && sql != "") {
            //先请求数据回来
            var comboBoxData = Object.toAjaxJson("/workflow/fuiFramework/", "getTextValueDataJsonBySql", { sql: sql });

            for (var i = 0; i < comboBoxData.length; i++) {
                var title = comboBoxData[i].Text;
                var value = comboBoxData[i].Value;
                var checkedStr = value == defaultvalue ? 'checked="checked"' : "";
                html += Object.toStringFormat(temPlate, name, value, title, title, checkedStr);
            }
        }


        $text.replaceWith(hideInput + html).remove();
    };
}

function onRadioItembox(ob) {
    //找出在同级标范围内的标签
    var contain = $(ob).parent();
    var value = $(ob).val();
    var name = $(ob).attr("radioItem");
    $("input[radioItem='" + name + "']", contain).each(function () {
        if ($(this).is(":checked") && $(this).val() != value) {
            $(this).prop("checked", false);
        }
    });

    $("input[type='hidden'][name='" + name + "']", contain).val(value);
}
//构造复选按钮组控件元素
; FUI.Checkbox = function () {
    var instance = this;
    this.init = function ($text) {
        var name = $text.attr("name");
        var eventsid = $text.attr('eventsid') || "";
        var configType = $text.attr('dictid') || "";
        var sql = $text.attr('sql') || "";
        var required = $text.attr("required") || "";
        if (required != "") required = "required=\"required\"";

        var require = $text.attr("require") || "";
        if (required == "" && require != "") {
            required = "require=\"required\"";
        }
        var defaultvalue = $text.attr('defaultvalue') || "";
        var datasource = $text.attr("datasource");
        var custionJSONString = $text.attr("customopts");
        var hideInput = ' <input  idd="' + name + '"  id="' + name + '" name="' + name + '" formHideCheckbox="' + name + '"  value="' + defaultvalue + '" ' + required + '  type="hidden" />';
        var temPlate = "&nbsp;<input type=\"checkbox\"  idd=\"{0}\" onclick=\"onCheckItembox(this)\" checkboxItem=\"{0}\"  value=\"{1}\"  title=\"{2}\" {4} />{3}"
        var html = "";
        if (datasource == "custom") {
            if ($.trim(custionJSONString).length > 0) {
                var customJSON = JSON.parse(custionJSONString);
                for (var i = 0; i < customJSON.length; i++) {
                    var title = customJSON[i].title;
                    var value = customJSON[i].value;
                    var checkedStr = defaultvalue.toString().indexOf(value) != -1 ? 'checked="checked"' : "";
                    html += Object.toStringFormat(temPlate, name, value, title, title, checkedStr);
                }

            }
        }
        else if (datasource == "dic" && configType != "") {
            if ($ConfigTypeData == null || $ConfigTypeData.length <= 0) return false;
            var comboBoxData = [];
            for (configTypeIndex in $ConfigTypeData) {
                if ($ConfigTypeData[configTypeIndex].configType == configType) {
                    comboBoxData = $ConfigTypeData[configTypeIndex].data;
                    break;
                }
            }
            for (var i = 0; i < comboBoxData.length; i++) {
                var title = comboBoxData[i].Text;
                var value = comboBoxData[i].Value;
                var checkedStr = value == defaultvalue ? 'checked="checked"' : "";
                html += Object.toStringFormat(temPlate, name, value, title, title, checkedStr);
            }
        }
        else if (datasource == "sql" && sql != "") {
            //先请求数据回来
            var comboBoxData = Object.toAjaxJson("/workflow/fuiFramework/", "GetTextValueDataJsonBySql", { sql: sql });

            for (var i = 0; i < comboBoxData.length; i++) {
                var title = comboBoxData[i].Text;
                var value = comboBoxData[i].Value;
                var checkedStr = value == defaultvalue ? 'checked="checked"' : "";
                html += Object.toStringFormat(temPlate, name, value, title, title, checkedStr);
            }
        }

        $text.replaceWith(hideInput + html).remove();
    };
}
function onCheckItembox(ob) {
    //找出在同级标范围内的标签
    var contain = $(ob).parent();
    var name = $(ob).attr("checkboxItem");

    var hidValue = "";
    $("input[checkboxItem='" + name + "']", contain).each(function () {
        if ($(this).is(":checked")) {
            var value = $(this).val();
            hidValue += ",";
            hidValue += value;
        }
    });
    if (hidValue != "") {
        hidValue = hidValue.substring(1);
    }
    $("input[type='hidden'][name='" + name + "']", contain).val(hidValue);
}
//===========附件上传======================//
; FUI.File = function () {
    var instance = this;
    this.init = function ($text) {
        var name = $text.attr("name");
        var required = $text.attr("required") || "";
        if (required != "") required = "required=\"required\"";

        var require = $text.attr("require") || "";
        if (required == "" && require != "") {
            required = "require=\"required\"";
        }


        var hideInput = ' <input idd="' + name + '" id="' + name + '" name="' + name + '" formHideFile="' + name + '"  value="" ' + required + '  type="hidden" />';
        //var temPlate = "<span type=\"checkbox\" onclick=\"onFileItem(this)\" fileItem=\"{0}\"  value=\"{1}\"  title=\"{2}\" {4} />{3}</span>"
        var html = "<div fileNameContainer=\"" + name + "\"></div>";
        var btnUplpad = "<a  role='button'  class=\"btn btn-primary btn-xs\" idd='" + name + "' onclick=\"formUploadFiles('" + name + "',this)\"><i class=\"fa fa-file\">上传附件</i></a>";
        if (WFContext && WFContext.WorkflowformAction && WFContext.WorkflowformAction > 2) {
            btnUplpad = "";
        }
        if (Object.toQueryString("formAction") && isNaN(Object.toQueryString("formAction")) && Object.toQueryString("formAction") != "Add" && Object.toQueryString("formAction") != "Edit") {
            btnUplpad = "";
        }
        //html += Object.toStringFormat(temPlate, name, value, title, title, checkedStr);
        $text.replaceWith(hideInput + html + btnUplpad).remove();
    };
}
function onFormDelFileItem(ob) {
    //找出在同级标范围内的标签
    var contain = $(ob).parent();
    var name = $(ob).attr("fileItem");
    var hidValue = "";
    $("span[fileItem='" + name + "']", contain).each(function () {
        var value = $(this).val();
        hidValue += ",";
        hidValue += value;
    });
    if (hidValue != "") {
        hidValue = hidValue.substring(1);
    }
    $("input[type='hidden'][name='" + name + "']", contain).val(hidValue);
}



//附件上传选择，键值关键字为：text,value inputName存放的是完整的Json数据
//inputKey:存放结果Jon数组的输入框ID
//inputName：存放标题文字的输入框ID
//singleSelect:是否单选，true：单选,false:多选,默认多选,obj为this对象
function formUploadFiles(name, obj, singleSelect, passParm) {
    singleSelect = singleSelect || false;
    passParm = passParm || {};
    var container = $(obj).parent();
    var parm;
    var listHemlObj = $("div[fileNameContainer='" + name + "']", container);
    var items = listHemlObj.html();
    if (items == "") {
        parm = { singleSelect: singleSelect, data: [] }
    }
    else {
        var data=[];
        try {
        	var dataJson=$("input[formHideFile='" + name + "']", container).val();
        	if(dataJson!=null&&dataJson!=""&&dataJson.indexOf("#")>-1){
        		dataJson=dataJson.substr(1,dataJson.length-2);
        	}
        	data = eval("(" +dataJson  + ")");
        }
        catch (err) {
            data = [];
        }
        parm = { singleSelect: singleSelect, data: data }
    }
    var widht = 450;
    var height = 420;
    var type = passParm.type || "OnlineForm";


    if (isMobile == true) {
    	  //手机端附件上传
         //url, title, mainTable, formAction, keyId,  options
          FUI.Mobile.Window.openEdit( __webpath+"/mobile/selectUploadFile/?name="+name,"附件上传",null,"Edit",name,null,null,{isNeedFirst:false});

    } else {

        var url = __webpath+"/workflow/selector/selectUploadFile/?type=" + type;
        var title = "上传附件";
        FUI.dialog(url, title, parm, widht, height, function (objectData, dialog) {
            loadFileItem(name, objectData, container);
            dialog.dialog('destroy');
            return false;
        }, false);
    }
};
function mobileFileUploadResultCallBack(name,dataStr){
	var container=$("[idd='" + name + "']").parent()
	var objectData=eval("("+dataStr+")");
	loadFileItem(name,objectData,container);
	
}
function loadFileItem(name, objectData, container) {
    if (objectData.length > 0) {
        var data = [];
        var options = "";
        var template = "<span class=\"owner-span cur\" style=' cursor:pointer;' title='点击下载附件' value='{0}' onclick=\"formDownloadFile(this)\" >{1}</span>";
        $.each(objectData, function (i, item) {
            data.push({ value: item.value, text: item.text });
            options += Object.toStringFormat(template, item.value, item.text);
        });
        var jsonStr=JSON.stringify(data);
        if(jsonStr!=""&&jsonStr!=null){
        	jsonStr="#"+jsonStr+"#";
        }
        $("input[formHideFile=\"" + name + "\"]", container).val(jsonStr);
        $("div[fileNameContainer='" + name + "']", container).html(options);
    }
    else {
        $("input[formHideFile='" + name + "']", container).val("");
        $("div[fileNameContainer='" + name + "']", container).html("");

    }
}
//附件下载
function formDownloadFile(obj) {
    var filePath = $(obj).attr("value");
    var fileName = $(obj).html();
    var actionUrl = __webpath+"/workflow/workflowManage/";
    var data = Object.toAjaxDownloadFile(actionUrl, "downloadFile", { filePath: filePath, fileName: fileName });
}



//=========================构造下拉框控件元素======================//
; FUI.Select = function () {
    var instance = this;
    this.init = function ($text) {
        var name = $text.attr("name");
        var configType = $text.attr('dictid') || "";
        var defaultvalue = $text.attr('defaultvalue') || "";
        var sql = $text.attr('sql') || "";
        var datasource = $text.attr("datasource");
        var custionJSONString = $text.attr("customopts");
        var hasempty = $text.attr("hasempty");
        var requiredStr = "";
        var required = $text.attr('required') || "";
        if (required == "required") {
            required = true;
            requiredStr = "required=\"required\"";
        }

        if (datasource == "custom") {
            if ($.trim(custionJSONString).length > 0) {
                var customJSON = JSON.parse(custionJSONString);
                if (hasempty == "1") {
                    customJSON.push({ title: "", value: "" });
                }

                //PC端使用EasyUI
                if (isMobile == false) {
                    $text.combobox({
                        data: customJSON,
                        valueField: 'value',
                        textField: 'title',
                        require: required
                    });
                }
                else {
                    var optionHtml = _getSelectOptions(customJSON, 'value', 'title', defaultvalue);
                    var select = "<select name=" + name + " " + requiredStr + ">" + optionHtml + "</select>";
                    $text.replaceWith(select).remove();
                    //手机端
                }
            }
        }
        else if (datasource == "dic" && configType != "") {
            if ($ConfigTypeData == null || $ConfigTypeData.length <= 0) return false;
            var comboBoxData = [];
            for (configTypeIndex in $ConfigTypeData) {
                if ($ConfigTypeData[configTypeIndex].configType == configType) {
                    comboBoxData = $ConfigTypeData[configTypeIndex].data;
                    break;
                }
            }
            if (hasempty == "1") {
                comboBoxData.push({text: "", value: "" });
            }

            //PC端使用EasyUI
            if (isMobile == false) {
                $text.combobox({
                    data: comboBoxData,
                    valueField: 'value',
                    textField: 'text',
                    require: required
                });
            }
            else {
                var optionHtml = _getSelectOptions(comboBoxData, 'value', 'text');
                var select = "<select name=" + name + " " + requiredStr + ">" + optionHtml + "</select>";
                $text.replaceWith(select).remove();
            }
        }
        else if (datasource == "sql" && sql != "") {
            //先请求数据回来
            var comboBoxData = Object.toAjaxJson("/workflow/fuiFramework/", "getTextValueDataJsonBySql", { sql: sql });

            if (hasempty == "1") {
                comboBoxData.push({ text: "", value: "" });
            }
            //PC端使用EasyUI
            if (isMobile == false) {
                $text.combobox({
                    data: comboBoxData,
                    valueField: 'value',
                    textField: 'text',
                    require: required
                });
            } else {
                var optionHtml = _getSelectOptions(comboBoxData, 'value', 'text');
                var select = "<select name=" + name + " " + requiredStr + ">" + optionHtml + "</select>";
                $text.replaceWith(select).remove();
            }

        }


    };
}


function _getSelectOptions(data, valueField, textField, defaultvalue) {
    var html = "";
    html += "<option value=\"\">-请选择-</option>";
    $.each(data, function (index, item) {
        if (defaultvalue && item[valueField] == defaultvalue) {
            html += "<option value=" + item[valueField] + " selected=\"selected\">" + item[textField] + "</option>";
        }
        else {
            html += "<option value=" + item[valueField] + ">" + item[textField] + "</option>";
        }
    });
    return html;
}

//=========================构造自定义选择器元素======================//
; FUI.Selector = function () {
    var instance = this;
    this.init = function ($text) {
        var name = $text.attr("name");
        var idd = $text.attr("idd");
        var configType = $text.attr('dictid') || "";
        var defaultvalue = $text.attr('defaultvalue') || "";
        var sql = $text.attr('sql') || "";
        var datasource = $text.attr("datasource");
        var custionJSONString = $text.attr("customopts");
        var hasempty = $text.attr("hasempty");
        var requiredStr = "";
        var required = $text.attr('required') || "";
        if (required == "required") {
            required = true;
            requiredStr = "required=\"required\"";
        }
        if (datasource == "selector") {
            if ($.trim(custionJSONString).length > 0) {
                var customJSON = JSON.parse(custionJSONString);
                var selectId=Object.toGuid();
                var select = "  <a id='"+selectId+"' role='button' href='javascript:void(0)'  idd='" + name + "' class=\"btn btn-mini btn-primary  mr2\" title=\"选择\" onclick=\"onSelectorClick(this,'" + name + "');return false;\"><i class=\"fa fa-search bigger-120\">选择</i></a>";
                if (WFContext && WFContext.WorkflowformAction && WFContext.WorkflowformAction > 2) {
                    select = "";
                }
                if (Object.toQueryString("formAction") && isNaN(Object.toQueryString("formAction")) && Object.toQueryString("formAction") != "Add" && Object.toQueryString("formAction") != "Edit") {
                    select = "";
                }
                select = isMobile ? "" : select;
                if (WFContext.WorkflowformAction == 0 && $text.attr("defaultvalue") != "") {
                    var myValue = getSysDefaultValue($text.attr("defaultvalue"));
                    $text.val(myValue);
                }
                if (customJSON.isMulti == true || customJSON.isMulti == "true") {
                    $text.addClass("textBoxLong");
                }
                if(!($text.next("a")&&$text.next("a").attr("idd")==idd)){
            	   $text.after(select);
                }else{
            	   $text.next("a").attr("id",selectId);
                }
                
                
            }
        }
    };
}
function onSelectorClick(obj, name) {
    //alert(name);
    //return false;
    var $text = $(obj).prev("input");
    var custionJSONString = $text.attr("customopts");
    if ($.trim(custionJSONString).length > 0) {
        var customJSON = JSON.parse(custionJSONString);
        customJSON.selectId=$(obj).attr("id");
        customJSON.backBindIsdetail=$(obj).attr("idd").split('.').length>=3;
        var selectorName = customJSON.selectorName;
        var selector = eval(selectorName);
        return selector(customJSON);
    }
    return false;
}


; FUI.CustomDialog = function () {
    var instance = this;
    this.init = function ($text) {
        var name = $text.attr("name");
        var idd = $text.attr("idd");
        var configType = $text.attr('dictid') || "";
        var defaultvalue = $text.attr('defaultvalue') || "";
        var sql = $text.attr('sql') || "";
        var datasource = $text.attr("datasource");
        var custionJSONString = $text.attr("customopts");
        var hasempty = $text.attr("hasempty");
        var requiredStr = "";
        var required = $text.attr('required') || "";
        if (required == "required") {
            required = true;
            requiredStr = "required=\"required\"";
        }
        if (datasource == "customdialog") {
            if ($.trim(custionJSONString).length > 0) {
                var customJSON = JSON.parse(custionJSONString);
                var selectId=Object.toGuid();
                var select = " <a id='"+selectId+"' role='button' href='javascript:void(0)'  idd='" + name + "' class=\"btn btn-mini btn-primary  mr2\" title=\"选择\" onclick=\"onCustomDialogClick(this,'" + name + "');return false;\"><i class=\"fa fa-search bigger-120\">选择</i></a>";
                if (WFContext && WFContext.WorkflowformAction && WFContext.WorkflowformAction > 2) {
                    select = "";
                }
                if (Object.toQueryString("formAction") && isNaN(Object.toQueryString("formAction")) && Object.toQueryString("formAction") != "Add" && Object.toQueryString("formAction") != "Edit") {
                    select = "";
                }
                select = isMobile ? "" : select;
                if (WFContext.WorkflowformAction == 0 && $text.attr("defaultvalue") != "") {
                    var myValue = getSysDefaultValue($text.attr("defaultvalue"));
                    $text.val(myValue);
                }
                if(!($text.next("a")&&$text.next("a").attr("idd")==idd)){
                   $text.after(select);
                }else{
             	   $text.next("a").attr("id",selectId);
                }
               

            }
        }
    };
}
function onCustomDialogClick(obj, name) {
    //alert(name);
    //return false;
    var $text = $(obj).prev("input");
    var custionJSONString = $text.attr("customopts");
    if ($.trim(custionJSONString).length > 0) {
        var customJSON = JSON.parse(custionJSONString);
        customJSON.selectId=$(obj).attr("id");
        customJSON.backBindIsdetail=$(obj).attr("idd").split('.').length>=3;
        var customDialogName = customJSON.customDialog;
        var customDialog = eval(CustomDialog);
        return customDialog(customJSON);
    }
    return false;
}
//=========================构造自定义选择器元素结束======================//