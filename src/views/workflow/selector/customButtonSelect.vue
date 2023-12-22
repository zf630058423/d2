<template>
  <div class="f2bpm-page-dialog-layout">
    <div class="line">
      <div class="fence-box" style="width: 180px;height: 350px;">
        <div class="fence-box-title">
          <a id="addItem" href="javascript:void(0);" role="button" @click="addItem();"><i class="fa fa-plus" />添加按钮（双击删除）</a>
        </div>
        <ul id="listResult">
          <li v-for="item in rightData" :class="item.buttonName==currentItem.buttonName?'selected':''" class="fence-li-item" :text="item.buttonTitle" :value="item.buttonName" @dblclick="deleteItem(item)" @click="rightSelected(item)">
            <input type="button" disabled="disabled" :value="item.orderNum" class="fence-li-index">{{ item.buttonTitle }}
          </li>
        </ul>
      </div>
      <div class="fence-box" style="width:340px;height: 350px;">
        <div class="fence-box-title">
          编辑按钮： <a id="delete" href="javascript:void(0);" role="button" class="red" @click="deleteItem()"><i class="fa fa-minus-circle" />移除</a>
        </div>
        <div v-if="currentItem.buttonName!=undefined" class="line" style="overflow: hidden">
          <el-form ref="formRef" size="mini" :rules="formRules" :model="data" style="height: 240px;" label-width="100px">
            <el-form-item label="按钮类型" prop="buttonType" style="text-align: left;">
              <el-select v-model="data.buttonType" size="mini" style="width: 98%;" @change="buttonTypeChange">
                <el-option label="普通按钮" value="" />
                <el-option label="打印【仅无流程表单】" value="print" />
                <el-option label="自定义对话框【仅在线表单】" value="customdialog" />
                <el-option label="导入【仅在线表单、自定义列表】" value="excelImport" />
                <el-option label="导出【仅在线表单、自定义列表】" value="excelExport" />
              </el-select>
              <span class="font10 fa fa-question-circle-o cur" @click="buttonTypeQuestion">点击查看说明</span>
            </el-form-item>
            <el-form-item label="按钮标题" prop="buttonTitle">
              <el-input v-model="data.buttonTitle" placeholder="按钮标题" />
            </el-form-item>
            <el-form-item label="国际化" prop="buttonAlias">
              <el-input v-model="data.buttonAlias" placeholder="国际化" />
            </el-form-item>
            <el-form-item label="按钮编码" prop="buttonName">
              <el-input v-model="data.buttonName" placeholder="按钮名称" />
            </el-form-item>
            <el-form-item label="排序号" prop="orderNum" style="text-align: left">
              <el-input-number v-model="data.orderNum" :min="1" :max="100" label="排序号" @change="changeOrderNum" />
            </el-form-item>
            <el-form-item label="点击事件" prop="excutefun" v-if="data.buttonType==''">
              <el-input v-model="data.excutefun" placeholder="JS的脚本函数名" />
            </el-form-item>
            <el-form-item label="配置按钮" prop="buttonOptions" style="text-align: left;" v-if="data.buttonType=='customdialog'">
              <a id="OptionEdit" role="button" class="btn btn-primary btn-sm mr2" @click="editCustomdialogOption('buttonOptions')"><i class="fa fa-edit" />配置对话框</a>
            </el-form-item>
            <el-form-item label="颜色类型" prop="btnColor" style="text-align: left;">
              <el-select v-model="data.btnColor" style="width: 98%;">
                <el-option label="默认" value="" />
                <el-option label="default" value="default" />
                <el-option label="primary" value="primary" />
                <el-option label="success" value="success" />
                <el-option label="info" value="info" />
                <el-option label="warning" value="warning" />
                <el-option label="danger" value="danger" />
              </el-select>
            </el-form-item>
            <el-form-item label="大小" prop="btnSize">
              <el-input v-model="data.btnSize" placeholder="按钮大小" />
              <div>
                <a role="button" class="btn btn-minier btn-yellow mr4" @click="setTargetValue('btnSize','btn-minier')">Minier</a>
                <a role="button" class="btn btn-minier btn-primary mr4" @click="setTargetValue('btnSize','btn-sm')">Small</a>
                <a role="button" class="btn btn-minier btn-success mr4" @click="setTargetValue('btnSize','btn-lg')">Large Size</a>
              </div>
            </el-form-item>
            <el-form-item label="图标" prop="faClass" style="text-align: left">
              <span :class="data.faClass.indexOf('icon')>-1?'icon '+data.faClass: 'fa '+data.faClass" />
              <el-input v-model="data.faClass" placeholder="按钮图标" style="width:140px;" />
              <span class="cur" @click="selectAweIconStyle('faClass')"><i class="fa fa-search" />选择</span>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

  window.getResult = function () {
    return myvm.getResult();
  };
  export default {
    data() {
      return {
        formDefId: "",
        initailData: null,
        resultGridData: [],
        currentItem: {},
        data: {
          buttonTitle: '',
          buttonAlias: '',
          buttonName: '',
          excutefun: '',
          btnColor: 'primary',
          btnSize: '',
          faClass: '',
          orderNum: 10,
          //按钮类型：普通按钮，自定义对话框按钮（工具栏时为选择添加，行内时为选择回填）
          buttonType: "",
          buttonOptions: ""
        },
        leftData: [],
        rightData: [],
        formRules: {
          buttonTitle: [
            { required: true, message: '必填项不能为空', trigger: 'blur' }
          ],
          buttonName: [
            { required: true, message: '必填项不能为空', trigger: 'blur' },
            { validator: FUI.Validator.englishchar }
          ]
        }
      };
    },
    computed: {},
    mounted() {
      var that = this;
      window.myvm = this;
    },
    created() {
      var that = this;
      var formDefId = Object.toQueryString("formDefId") || "";
      that.formDefId = formDefId;
      that.loadWindowparms();
      that.rightData = that.resultGridData || [];
      that.autoOrderNum();
    },
    methods: {
      closeEdit() {
        // stand:关闭编辑窗口
        FUI.Window.closeEdit();
      },
      loadWindowparms() {
        const that = this;
        var parmsStr = Object.toQueryString('parms');
        var parms = {};
        if (parmsStr) {
          // {"needRoot": false, singleSelect: singleSelect, groupKey: groupKey, data: []}
          parmsStr = decodeURIComponent(parmsStr);
          parms = eval('(' + parmsStr + ')');
          if (parms.data != undefined && parms.data.length > 0) {
            that.resultGridData = parms.data;
            $.each(that.resultGridData, function (i, item) {
              if (item.buttonType == null || item.buttonType == undefined) {
                item.buttonType = "";
              }
              if (item.buttonOptions == null || item.buttonOptions == undefined) {
                item.buttonOptions = "";
              }
            });

          }
          if (parms.singleSelect != undefined) {
            that.windowparms.singleSelect = parms.singleSelect;
          }
          if (parms.resultFieldKey != undefined) {
            that.windowparms.resultFieldKey = parms.resultFieldKey;
          }
          if (that.resultGridData.length > 0) {
            var temp = [];
            $.each(that.resultGridData, function (i, item) {
              if (!item.id) {
                item.id = Object.toGuid();
              }
              temp.push(item);
            });
            that.resultGridData = temp;
          }
        }
      },
      validateForm(refFormName) {
        // stand:表单校验
        var success = false;
        this.$refs[refFormName].validate(valid => {
          success = valid;
        });
        return success;
      },
      addEmpty() {
        var that = this;
        that.currentAction = 'add';
        that.clearLeft();
      },
      clearLeft() {
        var that = this;
        $.each(that.data, function (key, value) {
          that.data[key] = '';
        });
      },
      addItem() {
        var that = this;
        var item = {};
        item.id = Object.toGuid();
        item.buttonTitle = 'btn' + (that.rightData.length + 1);
        item.buttonName = item.buttonTitle;
        item.orderNum = that.rightData.length + 1;
        item.excutefun = '';
        item.btnColor = 'primary';
        item.btnSize = '';
        item.faClass = '';

        that.data = item;
        that.rightData.push(item);
        that.currentItem = item;
      },
      selectChange(item) {
        var that = this;
        that.data = item;
      },
      deleteItem() {
        var that = this;
        var delitem = that.currentItem;
        if (delitem == null) {
          return false;
        }
        var tem = [];
        $.each(that.rightData, function (index, item) {
          if (item.id != delitem.id) {
            tem.push(item);
          }
        });
        that.rightData = tem;

        if (that.rightData.length > 0) {
          that.currentItem = that.rightData[that.rightData.length - 1];
          that.data = that.currentItem;
        }
        that.autoOrderNum();
      },
      autoOrderNum() {
        var that = this;
        $.each(that.rightData, function (i, item) {
          //item.orderNum = i + 1;
        });
        that.rightData = Object.dataSort(that.rightData, 'orderNum');
      },
      rightSelected(item) {
        var that = this;
        that.data = item;
        that.currentItem = item;
      },
      selectAweIconStyle(inputId) {
        WF.SelectorDialog.selectAweIcon(this, inputId, 600, 450);
      },
      changeOrderNum() {
        var that = this;
        //that.rightData = Object.dataSort(that.rightData, 'orderNum');
      },
      editCustomdialogOption(inputId) {
        var that = this;
        var typeSource = "customdialog";
        var inputCtrlType = that.data.buttonType;
        var fieldTitle = that.data.buttonTitle;
        if (fieldTitle == "") {
          FUI.Window.showMsg(that, "请填写按钮标题");
          return false;
        }
        if (that.data.buttonName == "") {
          FUI.Window.showMsg(that, "请填写按钮名称");
          return false;
        }
        // 格式{type:"customdialog",data:}
        var obj = {
          type: inputCtrlType,
          data: []
        };
        var inputIdValue = that.data[inputId];
        if (inputIdValue && typeof inputIdValue == 'string') {
          var json = inputIdValue;
          try {
            obj = eval('(' + inputIdValue + ')');
          } catch (err) {
            obj = {
              type: inputCtrlType,
              data: []
            };
            console.info('JSON解析出错：' + json);
          }
        } else if (inputIdValue && typeof inputIdValue == 'object') {
          obj = inputIdValue;
        }
        var width = 680;
        var height = 500;
        var url = '';
        var title = '编辑【' + fieldTitle + '】选项';
        var parms = { data: obj.data };
        url = '/smartForm/getCustomDialog/?formDefId=' + that.formDefId;
        title = '【' + fieldTitle + '】配置自定义对话框';
        FUI.dialog(__webpath + '/workflow' + url, title, parms, width, height, function (dataObject, index, layer) {
          if (dataObject == false) {
            return false;
          }
          dataObject=JSON.stringify(dataObject);
          var objJson = {
            type: typeSource,
            data: dataObject
          };
          that.data[inputId] =objJson;
          layer.close(index);
        }, true);

      },
      buttonTypeChange(v) {
        var that = this;
        that.data.buttonOptions = "";
        if (v) {
          if (v == "customdialog") {
            that.data.buttonName = "custbtn_" + v;
            that.data.buttonTitle = "选择添加";
          }
          else if (v == "excelImport") {
            that.data.buttonName = "sys_" + v;
            that.data.buttonTitle = "导入";
            that.data.faClass = "icon-daoru1";
          }
          else if (v == "excelExport") {
            that.data.buttonName = "sys_" + v;
            that.data.buttonTitle = "导出";
            that.data.faClass = "icon-daochu";
          }
          else if (v == 'print') {
            that.data.buttonName = "print";
            that.data.buttonTitle = "打印";
          }
        }
        that.data.buttonOptions = "";
      }
      , setTargetValue(inputId, value) {
        this.data[inputId] = value;
      },
      buttonTypeQuestion() {
        var msg = "【普通按钮】常规按钮。<br>【自定义对话框按钮】<br>当使用在在线表单子表工具栏时为选择添加子表数据，当使用在子表操作列时为选择回填 <br>【Excel导入按钮】使用在在线表单的子列表或自定义列表，导入的后端需要开发实现。";
        FUI.Window.showMsg(msg, null, 1);
      }
      , getResult() {
        var that = this;
        return that.rightData;
      }

    }
  }

</script>