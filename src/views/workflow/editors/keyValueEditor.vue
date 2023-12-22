<template>
  <div class="f2bpm-page-layout">
    <div class="line">

      <div class="fence-box" style="width: 180px;height: 350px;">
        <div class="fence-box-title">
          <a id="addItem" href="javascript:void(0);" role="button" @click="addItem"><i class="fa fa-plus" />添加属性项</a>
        </div>
        <ul id="listResult">
          <li v-for="item in rightData" :class="item.text==currentItem.text?'selected':''" class="fence-li-item" :text="item.text" :value="item.value" @dblclick="deleteItem(item)" @click="rightSelected(item)">
            <input type="button" disabled="disabled" :value="item.orderNum" class="fence-li-index"><span :title="item.text" v-html="item.text" class="ellipsiscontent"></span>
          </li>
        </ul>

      </div>
      <div class="fence-box" style="width: 260px;height: 350px;">
        <div class="fence-box-title">
          编辑属性：
        </div>
        <div class="line" style="overflow: hidden">
          <el-form ref="formRef" v-show="rightData.length>0" :rules="formRules" size="mini" :model="data" style="height: 250px;" label-width="70px">
            <el-form-item label="属性名" prop="text">
              <el-input v-model="data.text" placeholder="属性名" />
              <a class="font10 fl" v-if="showSelectFormField" href="javascript:void(0)" tip="选择表单字段名" @click="selectorFormField('text', '',true )"><i class="fa fa-search" />选择表单字段</a>
            </el-form-item>
            <el-form-item label="属性值" prop="value">
              <el-input v-model="data.value" placeholder="属性值">
              </el-input>
              <a class="font10 fl" v-if="showSelectFormField" href="javascript:void(0)" tip="选择表单字段名" @click="selectorFormField('value', '',true )"><i class="fa fa-search" />选择表单字段</a>
            </el-form-item>
            <el-form-item label="排序号" prop="orderNum">
              <el-input-number v-model="data.orderNum" size="small" :min="1" :max="100" label="排序号" @change="changeOrderNum" />
            </el-form-item>
            <el-form-item>
              <a id="delete" href="javascript:void(0);" role="button" class="btn btn-primary btn-sm mr2" @click="deleteItem()"><i class="fa fa-minus-circle" />移除</a>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        //表单定义ID，如果有值则可选择表单字段名
        formDefId: "",
        wid: "",
        // 结果集类型是：kv或tv类型
        type: '',
        // text,value的数据格式
        initailData: null,
        currentItem: {},
        showSelectFormField:false,
        data: {
          text: '',
          value: '',
          orderNum: 1
        },
        leftData: [],
        rightData: [],
        formRules: {
          text: [
            { required: true, message: '必填项不能为空', trigger: 'blur' }
          ],
          value: [
            { required: true, message: '必填项不能为空', trigger: 'blur' }
          ]
        }
      };
    },
    mounted() {
      var that = this;
      window.myvm = that;
    },
    created() {
      var that = this;
      // 结果集的类型：type:kv为[{key:value}]，tv为[{text:value}]
      var type = Object.toQueryString('type') || 'kv';
      var wid = Object.toQueryString('wid') || '';
      var formDefId = Object.toQueryString('formDefId') || '';
      var isSelectField = Object.toQueryString('isSelectField')||"";
      that.wid = wid;
      that.formDefId = formDefId;
      if(that.wid!=''||that.formDefId!=''){
        that.showSelectFormField=true;
      }
      if(isSelectField=='false'){
        that.showSelectFormField=false;
      }
      if(isSelectField=='true'){
        that.showSelectFormField=true;
      }
      var currentAction = 'add';
      // 右而标签显示的字段
      var textFileName = 'key';
      var valueFileName = 'value';
      var orderNoKey = 'orderNum';
      // 当前编辑的Key
      var currentEditId = '';
      var resultGridData = [];
      var parmsStr = Object.toQueryString('parms');
      var parms = {};
      if (parmsStr) {
        parmsStr = decodeURIComponent(parmsStr);
        parms = eval('(' + parmsStr + ')');
      }
      resultGridData = [];
      if (parms.data && Array.isArray(parms.data) && parms.data.length > 0) {
        var temp = [];
        $.each(parms.data, function (i, item) {
          if (!item.id) {
            item.id = Object.toGuid();
          }
          if (type == 'kv') {
            var theItem = {};
            theItem.text = item.key;
            theItem.value = item.value;
            theItem.id = item.id;
            theItem.orderNum = item.orderNum;
            temp.push(theItem);
          } else {
            temp.push(item);
          }
        });
        resultGridData = temp;
      }
      that.type = type;
      that.rightData = resultGridData || [];
      that.autoOrderNum();
    },
    methods: {
      closeEdit() {
        // stand:关闭编辑窗口
        FUI.Window.closeEdit();
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
        item.text = 'Items' + (that.rightData.length + 1);
        item.value = item.text;
        item.orderNum = that.rightData.length + 1;
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
        if (delitem == null && that.rightData.length > 0) {
          delitem = that.rightData[that.rightData.length - 1];
        } else if (delitem == null) {
          return false;
        }
        var tem = [];
        $.each(that.rightData, function (index, item) {
          if (item.text != delitem.text) {
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
          item.orderNum = i + 1;
        });
      },
      rightSelected(item) {
        var that = this;
        that.data = item;
        that.currentItem = item;
      },
      changeOrderNum() {
        var that = this;
        that.rightData = Object.dataSort(that.rightData, 'orderNum');
      }
      , selectorFormField(inputId, inputName, singleSelect, subDataName) {
        var that = this;
        var subObj = null;
        if (subDataName) {
          subObj = that.data[subDataName];
        }
        WF.SelectorDialog.selectorFormField(that, that.formDefId, that.wid, inputId, inputName, singleSelect, subObj);
      }
      , getResult() {
        var that = this;
        var temArr = [];
        if (that.type == 'kv') {
          $.each(that.rightData, function (i, item) {
            var theItem = { key: item.text, value: item.value, orderNum: item.orderNum };
            temArr.push(theItem);
          });
          return temArr;
        }
        return that.rightData;
      }
    }
  };
  window.getResult = function () {
    return myvm.getResult();
  }
</script>
<style>
  .ellipsiscontent {
    width: 130px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: block;
  }
</style>