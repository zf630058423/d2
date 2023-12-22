/** 
*FUI 在线表单
*Data:2016-3-21
*author  QQ:1827528476
*
*/
var SmartForm = function () { }
SmartForm.data = {
    //控件类型 { text: "公文文本编辑器", value: "richeditorofficial" },
    controlType: [{ text: "文本框", value: "text" },
        { text: "文本域", value: "textarea" },
        { text: "富文本编辑器", value: "richeditor" },
       
//{ text: "Label标签", value: "label" },
        { text: "下拉选择框", value: "select" },
        { text: "级联选择", value: "cascselect" },
        { text: "自动完成", value: "autocompleter" },
        { text: "自定义选择器", value: "selector" },
        { text: "自定义选择对话框", value: "customdialog" },
        { text: "单选按钮", value: "radio" },
        { text: "复选框组", value: "checkbox" },
        { text: "附件上传", value: "file" },
        { text: "日期时间", value: "datetime" },
        { text: "上传图片", value: "picture" },
        { text: "图章（与选择按钮联用）", value: "stamp" },
        { text: "电子签名", value: "handsign" },
        { text: "超链接", value: "hyperlink" },
        { text: "隐藏域", value: "hidden" },
        { text: "流水号", value: "serialnum" },
        { text: '开关控件', value: 'switch' },
        { text: '里程碑', value: 'steps' }
        
        ]
}
SmartForm.editor = {
    controlTypeEditor: { type: "combobox", options: { valueField: 'value', textField: 'text', data: SmartForm.data.controlType } }
}