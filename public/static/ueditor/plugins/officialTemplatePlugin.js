//直接引用本JS文件即可生效
//公文套红模板
UE.registerUI('officialTemplate',function(editor,uiName){
    //创建dialog
    var dialog = new UE.ui.Dialog({
        //指定弹出层中页面的路径，这里只能支持页面,因为跟addCustomizeDialog.js相同目录，所以无需加路径
        iframeUrl: this.options.UEDITOR_HOME_URL + 'plugins/dialog/officialTemplate.html',
        //需要指定当前的编辑器实例
        editor:editor,
        //指定dialog的名字
        name:uiName,
        //dialog的标题
        title: "选择公文套红模板",
        //指定dialog的外围样式
        cssRules:"width:600px;height:300px;",

        //如果给出了buttons就代表dialog有确定和取消
        buttons:[
            {
                className:'edui-okbutton',
                label:'确定',
                onclick:function () {
                    dialog.close(true);
                }
            },
            {
                className:'edui-cancelbutton',
                label:'取消',
                onclick:function () {
                    dialog.close(false);
                }
            }
        ]});

    //参考addCustomizeButton.js
    var btn = new UE.ui.Button({
        name:'dialogbutton' + uiName,
        title: '公文套红模板',
        //需要添加的额外样式，指定icon图标，这里默认使用一个重复的icon
        cssRules: 'background-image: url('+this.options.UEDITOR_HOME_URL +'/themes/default/images/officialTemplate.png") !important;',
        onclick:function () {
            //渲染dialog
            dialog.render();
            dialog.open();
        }
    });
    //当点到编辑内容上时，按钮要做的状态反射
    //editor.addListener('selectionchange', function () {
    //    var state = editor.queryCommandState(uiName);
    //    if (state == -1) {
    //        btn.setDisabled(true);
    //        btn.setChecked(false);
    //    } else {
    //        btn.setDisabled(false);
    //        btn.setChecked(state);
    //    }
    //});
    var popup = new baidu.editor.ui.Popup({
        editor: this,
        content: '',
        className: 'edui-bubble',
         _delete: function () {
            if (window.confirm('确认删除该控件吗？')) {
                baidu.editor.dom.domUtils.remove(this.anchorEl, false);
            }
            this.hide();
        }
    });
    popup.render();
    editor.addListener('mouseover', function (t, evt) {
        evt = evt || window.event;
        var el = evt.target || evt.srcElement;
        var type1 = el.getAttribute('type1');
        var richeditorType = el.getAttribute('richeditortype');
        var title = richeditorType == "richeditorofficial" ? "公文文本编辑器" : "富文本编辑器";
        if (/textarea/ig.test(el.tagName) && type1 == "flow_richeditor") {
            var html = popup.formatHtml('<nobr>'+title+': <span onclick=$$._edittext() class="edui-clickable"> </span>&nbsp;&nbsp;<span onclick=$$._delete() class="edui-clickable">删除</span></nobr>');
            if (html) {
                popup.getDom('content').innerHTML = html;
                popup.anchorEl = el;
                popup.showAnchor(popup.anchorEl);
            } else {
                popup.hide();
            }
        }
    });
    return btn;
}
//,
//[index:指定添加到工具栏上的那个位置]默认时追加到最后
// [editorId:指定这个UI是那个编辑器实例上的,默认所有]
//]
); 
 
 