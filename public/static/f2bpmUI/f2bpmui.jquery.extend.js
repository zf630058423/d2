$.fn.formSerializeArray = function () {
    var doms = this;
    var arr = this.serializeArray();
    //var $allInput = $("input[name][type='checkbox'],input[name][type='radio']",this) ;
    var $radio = [];
    $.each(doms, function (index, input) {
        var name = this.name;
        var type = this.type;
        if ((type == "checkbox" || type == "radio") && name) {
            $radio.push(name);
        }
    });
    var temp = {};
    $.each($radio, function (i, name) {
        if (!temp.hasOwnProperty(name)) {
            if ($("input[name='" + name + "']:checked").length == 0) {
                temp[name] = "";
                var val = $("input[name='" + name + "']").val();
                var falseValue = "";
                if (val == 1 || val == 0 || val == "0" || val == "1") {
                    falseValue = 0;
                } else if (val == true || val == "true" || val == false || val == "false" || val == "False" || val == "True") {
                    falseValue = false;
                }
                arr.push({ "name": name, value: falseValue });
            }
        }
    });
    return arr;
};


$.fn.serializeObject = function () {
    var o = {};
    var a = this.formSerializeArray();
    $.each(a, function () {
        if (o[this.name] != undefined && o[this.name] != null && o[this.name] != "") {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            var v = this.value;
            if (v == undefined || v == null) {
                v = '';
            }
            o[this.name].push(v);
        } else {
            var v = this.value;
            if (v == undefined || v == null) {
                v = '';
            }
            o[this.name] = v;
        }
    });
    return o;
};


