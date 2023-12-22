/*******************************************************************************
 *
 * 扩展easyui的顶部窗口
 *
 * 作者：luoxw
 * 邮箱: 1827528476
 * 日期: 2016-3-24
 * 版权：F2
 *
 ******************************************************************************/

(function ($) {
    var iconClsDic = { "确定": "fa fa-save", "选择": "icon_ok", "保存": "fa fa-save", "确定并退出": "fa fa-save", "取消": "fa fa-minus-circle", "关闭": "fa fa-close" };
    var index = -1;
    var topN = 1;
    /**
     * 获取最顶部窗口,topN 向上找几层，默认1层,当前层为0
     */
    function getTopParent(w, topN) {
        topN = topN || 1;
        index++;
        var win = w ? w : window;
        if (win.parent != win && index < topN) // 找到最顶层窗口
            return getTopParent(win.parent, topN);
        return win;
    };


    /**
     * 输出指定位数的随机数的随机整数
     */
    function randomNum() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    };

    /** 私有方法
     * url：对话框页面URL
     * winId:指定窗口ID
     * parms:传递参数：{a:a,b:b}
     * isTopdialog：是否为顶层N窗口，默认否,当为是的时候默认是上第2层,当前层为0层
     * opt:属性配置，isShowSure：是否显示确定按钮
     * topN:在第几层上打开，配合isTopdialog使用，从0开始默认为1(即上一层窗口，使用最顶层时注意防止嵌入的业务系统中没有使用EasyUI导致打不开窗口)，当前层为0
     */
    function dialogCall(url, parms, isTopdialog, opt) {
        if (!Object.toStartWith(url, "http://")&&!Object.toStartWith(url, __webpath)) {
            url =__webpath + url;
        }
        index = -1;
        opt = opt || {};
        opt.parms = parms;
        if (isTopdialog == null || isTopdialog == undefined) {
            isTopdialog = true;
        }
        var curWin = window;
        var width = opt.width || 980;
        var height = opt.height || 500;
        var callback = opt.callback || null;
        var isShowSure = true;
        if (opt.isShowSure == false) {
            isShowSure = false;
        }
        var rnd = randomNum();//随机数
        var isNeedNewWin = true;
        var cnamaxmin = true;
        if (opt.fit == true) {
            cnamaxmin = false;
        }
        var buttons = [opt.suretext, opt.closeText]
        if (isShowSure == false) {
            buttons = [opt.closeText]
        }
        var maxMin = opt.fit != true;
        var isShowCloseBtn = (opt.title == "" || opt.title == null || opt.title == undefined) ? 0 : 1;
        if (isShowCloseBtn == 0) {
            maxMin = false;
        }
        var isTopOpen = false;
        var layerObject = layer;
        var windowMe = window;
        //暂时不在顶层打开
        //isTopdialog=false;
        try{
          //页面集成时并且跨域时 不能访问window.parent.layer
          if (window.parent && window.parent.layer && isTopdialog) {
              //优先使用上层的layer来打开
              isTopOpen = true;
              layerObject = window.parent.layer;
          }
        }catch(err){

        }
        var zIndex = opt.zIndex || layer.zIndex;
        //拼接Url参数
        if (opt.parms&&url.indexOf("?")>-1) {
            url =  url+"&parms="+encodeURIComponent(JSON.stringify(opt.parms));
        }else if (opt.parms&&url.indexOf("?")==-1) {
            url =  url+"?parms="+encodeURIComponent(JSON.stringify(opt.parms));
        }
        var index = layerObject.open($.extend(opt, {
            type: 2,
            area: [width + "px", height + "px"],
            title: opt.title,
            maxmin: maxMin,
            closeBtn: isShowCloseBtn,
            zIndex: zIndex, //重点1
            content: url,
            moveOut: true,
            moveOut: true,
            btn: buttons,
            yes: function (index, layero) {
                if (isShowSure == false) {
                    //不显示确定按钮时，此时是代替了关闭函数
                    layerObject.close(index);
                    return false;
                }
                if (callback) {
                    var iframeWin = null;
                    if (isTopOpen) {
                        iframeWin = windowMe.parent.window[layero.find('iframe')[0]['name']];
                    } else {
                        iframeWin = windowMe[layero.find('iframe')[0]['name']];
                    }
                    var data = iframeWin.getResult();
                    callback(data, index, layerObject);
                } else {
                    layerObject.close(index);
                }

            },
            btn2: function (index) {
                layer.close(index);
            },
            success: function (layero, index) {
                try {
                    //得到iframe页的窗口对象，执行iframe页的方法：iframeWin.method();
                    var iframeWin = null;
                    if (isTopOpen) {
                        iframeWin = windowMe.parent.window[layero.find('iframe')[0]['name']];
                    } else {
                        iframeWin = window[layero.find('iframe')[0]['name']];
                    }
                    iframeWin.openerWin = windowMe;
                    iframeWin.parms = opt.parms; //传递参数{a:aa,b:bbb} 通常用于配置开关或类别
                    if (iframeWin.pageLoad) {
                        iframeWin.pageLoad();
                    }

                } catch (e) {
                    console.info(e.stack);
                }
            }
        }));
        if (opt.fit == true) {
            layerObject.full(index);
        }
        return index;
    };

    /** 公有方法，打开对话框
    * url：对话框页面URL 必填
    * title:对话框标题 必填
    * parms:向iframeWin传递参数：{a:a,b:b}
    * callback:callback(data, dialog)回调函数  dialog.dialog('close');
     * width:默认700, height：默认：500,
    * isTopdialog：是否为顶层窗口，默认否,
    * opt: layui原来的Option如按钮居中：{btnAlign:'c'},打开时窗口最大化{fit:true},isShowSure：是否显示确定按钮,默认显示,zIndex:指定层级，isShowSure：是否显示确定按钮
    * buttons：重写按钮样式及文字{sure:{iconClass:"",text:""},close:{iconClass:"",text:""}}
    */
    $.dialog = function (url, title, parms, width, height, callback, isTopdialog, opt, buttons, topN) {
        width = width || 980;
        height = height || 500;
        opt = opt || {};
        var sureText = buttons != null && buttons.sure != undefined && buttons.sure.text != undefined ? buttons.sure.text : '确定';
        var sureClass = buttons != null && buttons.sure != undefined && buttons.sure.iconClass != undefined ? buttons.sure.iconClass : iconClsDic[sureText];
        var closeText = buttons != null && buttons.close != undefined && buttons.close.text != undefined ? buttons.close.text : '关闭';
        var closeClass = buttons != null && buttons.close != undefined && buttons.close.iconClass != undefined ? buttons.close.iconClass : iconClsDic[closeText];

        var dialog;
        var def = {
            title: title,
            width: width,
            height: height,
            modal: true,
            resizable: true,
            callback: callback,
            suretext: sureText,
            sureClass: sureClass,
            closeText: closeText,
            closeClass: closeClass

        };
        $.extend(opt, def);
        dialog = dialogCall(url, parms, isTopdialog, opt, topN);
        return false;
    };
    FUI.dialog = $.dialog;
})(jQuery);
