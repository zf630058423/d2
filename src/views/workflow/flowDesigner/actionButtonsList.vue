<template>
  <div class="f2bpm-page-layout">
    <div class="line">
      <div class="fence-box" style="width: 320px;height: 350px;">
        <div class="fence-box-title pt3">
          按钮选择：
          <el-select id="systemBotton" size="mini" :value="currentItem" @change="selectChange">
            <el-option v-for="item in btnsData" :label="item.text" :value="item" />
          </el-select>
          <div class="p5 mt2 blue">
            <span class="cur fa fa-plus " title="添加全部按钮，已添加的按钮将被忽略" @click="addAllButton"> 全部按钮</span>
            <span class="cur ml10" title="已添加的按钮将被忽略" @click="copyTargetActivityButton"><i class="icon icon-fuzhi1 font14"></i> 复制节点按钮</span>
            <span class="ml10 cur" title="点击选择指定节点" @click="selectActivity">{{currentSelectedActivity.activityName}}</span>
            <div v-if="isShowActivityList">
              <div style="text-align:right;" class="m10">
                <span class="  fa fa-minus-circle red " @click="closeSelectActivity"> 收起节点</span>
              </div>
              <div class="fence-li-item black activity-item" style="overflow: hidden;" v-for="item in activityList" @click="onSelectedActivity(item)">{{item.activityName}}</div>

            </div>
          </div>
        </div>
        <div class="line" v-if="!isShowActivityList">
          <el-form ref="formRef" :rules="formRules" size="mini" :model="data" class="f2bpm-editform" label-width="90px">
            <el-form-item label="按钮名称" prop="ButtonName">
              <el-input v-model="data.ButtonName" placeholder="按钮名称" />
            </el-form-item>
            <el-form-item label="国际化英文" prop="ButtonAlias">
              <el-input v-model="data.ButtonAlias" placeholder="按钮国际化" />
            </el-form-item>
            <el-form-item label="按钮编码" prop="ActionName">
              <el-input v-model="data.ActionName" placeholder="按钮编码" :disabled="isDisabled" />
            </el-form-item>
            <el-form-item label="排序号" prop="OrderNum">
              <el-input-number v-model="data.OrderNum" :min="1" :max="100" label="排序" />
            </el-form-item>
            <el-form-item label="前置JS函数" prop="BeforeFn">
              <el-input v-model="data.BeforeFn" placeholder="返回true提交,false不提交" />
            </el-form-item>
            <el-form-item v-if="data.Type!='sys'" label="调用JS函数" prop="ExcuteFn">
              <el-input v-model="data.ExcuteFn" placeholder="点击按钮时执行此函数。" />
            </el-form-item>
          </el-form>
        </div>

      </div>
      <div class="fence-box" style="width:80px;margin: 0px;border: 0px;padding-top: 140px; ">
        <a href="javascript:void(0);" role="button" class="btn btn-primary btn-sm mr2" @click="submitForm">暂存<i class="fa  fa-arrow-right" /></a><br>
        <br>
        <a href="javascript:void(0);" title="清空左侧编辑输入，重置后可保存新增按钮" role="button" class="btn btn-primary btn-sm mr2" @click="addEmpty"><i class="fa  fa-undo" />重置</a>
      </div>
      <div class="fence-box right-result-boxlist" style="width: 230px;height: 350px;">
        <div class="fence-box-title">
          <i class="fa fa-folder" aria-hidden="true" />已选按钮（双击删除）：
        </div>
        <div style="height:300px;overflow-y: auto;">
          <ul id="listResult">
            <li v-for="item in rightData" class="fence-li-item" :ButtonAlias="item.ButtonAlias" :ButtonName="item.ButtonName" :ActionName="item.ActionName" @dblclick="deleteItem(item)" @click="rightSelected(item)">
              {{ item.OrderNum }}-{{ item.ButtonName }}
            </li>
          </ul>
        </div>
        <div class="tr p5"><span class="fa fa-minus-circle red cur" @click="cleanAllButton">清空</span></div>
      </div>

    </div>
    <div class="dialogfooter">
      <a href="javascript:void(0);" role="button" class="btn btn-primary btn-sm mr2" @click="saveAndClose()"><i class="fa fa-save" />确定</a>
      <a href="javascript:void(0);" role="button" class="btn btn-primary btn-sm" @click="closeEdit"><i class="fa fa-minus-circle" />取消</a>
    </div>
  </div>
</template>

<script>
  import fastChannelEditVue from '../security/article/fastChannelEdit.vue';

  export default {
    data() {
      return {
        currentSelectedActivity: { activityId: "", activityName: "选择：上一节点" },
        isShowActivityList: false,
        activityList: [],
        activityId: "",
        attrName: '',
        selectbtn: '',
        isDisabled: true,
        currentAction: 'add',
        // text,value的数据格式
        initailData: null,
        currentItem: null,
        data: {
          ButtonAlias: "",
          ButtonName: '',
          ActionName: '',
          BeforeFn: '',
          ExcuteFn: '',
          Showpower: '',
          OrderNum: 10,
          Type: 'sys'
        },
        btnsData: [
          { text: '提交', value: 'send', type: 'sys' },
          { text: '暂存', value: 'save', type: 'sys' },
          { text: '传递沟通', value: 'taskCommunication', type: 'sys' },
          { text: '转办', value: 'sendReferred', type: 'sys' },
          { text: '锁定任务', value: 'taskclaim', type: 'sys' },
          { text: '传阅', value: 'sendCirculated', type: 'sys' },
          { text: '设为已阅', value: 'setDoneCirculated', type: 'sys' },
          { text: '驳回', value: 'reject', type: 'sys' },
          { text: '加签', value: 'appendTask', type: 'sys' },
          { text: '作废流程', value: 'invalid', type: 'sys' },
          { text: '撤回', value: 'withdraw', type: 'sys' },
          { text: '办理过程', value: 'approvalHistory', type: 'sys' },
          { text: '传阅过程', value: 'circulatedHistory', type: 'sys' },
          { text: '流程评论', value: 'comment', type: 'sys' },
          { text: '流程信息', value: 'procInstBaseInfo', type: 'sys' },
          // {text: 'seal', value: 'seal'},
          { text: '查看快照数据', value: 'snapshot', type: 'sys' },
          { text: '打印', value: 'print', type: 'sys' },
          { text: '查看流程图', value: 'flowmap', type: 'sys' },
          { text: '自定义按钮（仅待办）', value: 'cust', type: 'cust' },
          { text: '自定义按钮（任何时候）', value: 'custAlways', type: 'cust_always' },
        ],
        leftData: [],
        rightData: [],
        formRules: {
          ButtonName: [
            { required: true, message: '必填项不能为空', trigger: 'blur' }
          ],
          ActionName: [
            { required: true, message: '必填项不能为空', trigger: 'blur' },
            { validator: FUI.Validator.englishchar }
          ]
        }
      };
    },
    computed: {},
    created() {
      var that = this;
      that.loadWindowparms();
      that.autoOrderNum();
    },
    mounted() {
      window.myvm = this;
    },
    methods: {
      closeEdit() {
        // stand:关闭编辑窗口
        FUI.Window.closeEdit();
      },
      loadWindowparms() {
        const that = this;
        var currentAction = 'add';
        // 右而标签显示的字段
        var textFileName = 'ButtonName';
        var valueFileName = 'ActionName';
        var orderNoKey = 'OrderNum';
        // 当前编辑的Key
        var currentEditKeyValue = '';
        var attrName = null;
        var obj;
        var wid;
        var activityId;
        var resultGridData = [];
        obj = parent.window.currentWindowTargetObjectValue;
        var value = obj.value || [];
        var title = obj.title;
        attrName = obj.name;
        that.attrName = attrName;
        var param = Object.toStringToJson(obj.otherParm);
        activityId = param.activityId;
        that.activityId = activityId;
        wid = param.wid;
        if (value != null && value != '' && Object.toStartWith(value, '#')) {
          value = value.toString().substr(1, value.toString().length - 2);
          value = Object.toStringToJson(value);
        }
        resultGridData = value;
        that.rightData = resultGridData;
      },
      initail() {
        var that = this;
        var left = [];
        var right = [];
        if (that.initailData == null || that.initailData.length == 0) {
          return false;
        }
        $.each(that.leftData, function (i, item) {
          var theItem = null;
          $.each(that.initailData, function (i, it) {
            var code = it.value;
            if (code == item.activityCode) {
              right.push(item);
              theItem = item;
            }
          });
          if (theItem == null) {
            left.push(item);
          }
        });
        that.leftData = left;
        that.rightData = right;
      },
      cleanAllButton() {
        var that = this;
        that.rightData = [];
      }
      , submitForm() {
        var that = this;
        var success = that.validateForm('formRef');
        if (!success) return;
        var value = that.data.ActionName;
        var valueFileName = 'ActionName';
        var jsonItem = that.data;
        if (that.currentAction == 'add') {
          // 检查是否存在
          if (that.isExist(jsonItem[valueFileName])) {
            FUI.Window.showMsg(that, jsonItem[valueFileName] + ',已存在！');
            return false;
          }
          that.rightData.push(Object.toClone(jsonItem));
          that.rightData = Object.dataSort(that.rightData, 'OrderNum');
          that.addEmpty();
        } else {
          var tem = [];
          tem.push(Object.toClone(jsonItem));
          for (var i = 0; i < that.rightData.length; i++) {
            if (that.rightData[i][valueFileName] != value) {
              tem.push(that.rightData[i]);
            }
          }
          that.rightData = Object.dataSort(tem, 'OrderNum');
          var msg = '更新成功！';
          FUI.Window.showMsg2(that, msg, null, 1);
          that.addEmpty();
        }
        that.data.OrderNum = that.rightData.length + 1;
        this.autoOrderNum();
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
          if (key != 'Type') {
            that.data[key] = '';
          }
        });
      },
      autoOrderNum() {
        var that = this;
        $.each(that.rightData, function (i, item) {
          item.OrderNum = i + 1;
        });
      },
      isExist(addValue) {
        var that = this;
        var exist = false;
        $.each(that.rightData, function (i, item) {
          if (item.ActionName == addValue) {
            exist = true;
            return true;
          }
        });
        return exist;
      },
      addAllButton() {
        var that = this;
        $.each(that.btnsData, function (i, btn) {
          var text = btn.text;
          var value = btn.value;
          var type = btn.type;
          if (!that.isExist(value)) {
            var orderNum = that.rightData.length + 1;
            if (type == 'cust'||type=='cust_always') {
              value = value + '_' + orderNum;
            }
            var jsonItem = { ButtonName: text, ButtonAlias: "", ActionName: value, BeforeFn: '', ExcuteFn: '', Showpower: '', OrderNum: orderNum, Type: type };
            that.rightData.push(jsonItem);
          }
        });
        that.rightData = Object.dataSort(that.rightData, 'OrderNum');
      },
      closeSelectActivity() {
        var that = this;
        that.isShowActivityList = false;
      }
      , onSelectedActivity(act) {
        var that = this;
        that.currentSelectedActivity = act;
        that.isShowActivityList = false;
      }
      , selectActivity() {
        var that = this;
        var meActivityId = that.activityId;
        var data = [];
        var item = { activityId: "", activityName: "上一节点" };
        data.push(item);
        if (window.parent.wf && window.parent.wf.ProcessDef.ActivityList.Activity) {
          var activityList = window.parent.wf.ProcessDef.ActivityList.Activity;
          $.each(activityList, function (i, act) {
            if (act.ActivityId == meActivityId) {
              return true;
            }
            var item = { activityId: act.ActivityId, activityName: act.ActivityName };
            data.push(item);
          });
        }
        that.activityList = data;
        that.isShowActivityList = true;
      }
      //复制指定节点的按钮，默认上一节点
      , copyTargetActivityButton() {
        var that = this;
        var meActivityId = that.activityId;
        if (window.parent.wf && window.parent.wf.ProcessDef.ActivityList.Activity) {
          var activityList = window.parent.wf.ProcessDef.ActivityList.Activity;
          var preActionButtons = "";
          var fromActivityId = that.currentSelectedActivity.activityId;
          $.each(activityList, function (i, act) {
            var buttons = act.ActionButtons;
            if (fromActivityId != "") {
              if (act.ActivityId == fromActivityId) {
                if (window.parent.wfData && window.parent.wfData[fromActivityId]) {
                  var btns = window.parent.wfData[fromActivityId].find(b => b.value == 'buttons');
                  preActionButtons = btns.children[0].value;
                } else {
                  preActionButtons = buttons;
                }
                return false;
              }
            } else {
              //上一步
              var transitionList = act.TransitionList.Transition;
              if (transitionList && transitionList.length > 0) {
                $.each(transitionList, function (j, tran) {
                  if (tran.ToActivityId == meActivityId) {
                    fromActivityId = tran.FromActivityId;
                    if (window.parent.wfData && window.parent.wfData[fromActivityId]) {
                      var btns = window.parent.wfData[fromActivityId].find(b => b.value == 'buttons');
                      preActionButtons = btns.children[0].value;
                    } else {
                      preActionButtons = buttons;
                    }
                    return false;
                  }
                });
              }
            }

            if (preActionButtons != "") {
              return false;
            }
          });
          if (preActionButtons) {
            var that = this;
            preActionButtons = preActionButtons.replaceAll("#", "");
            var btnsData = eval("(" + preActionButtons + ")");
            $.each(btnsData, function (i, btn) {
              var value = btn.ActionName;
              if (!that.isExist(value)) {
                that.rightData.push(btn);
              }
            });
            that.rightData = Object.dataSort(that.rightData, 'OrderNum');

          }
        }
      }
      , selectChange(item) {
        var that = this;
        that.addEmpty();
        var type=item.type;
        if (type!= 'cust'&&type!='cust_always') {
          that.isDisabled = true;
        } else {
          that.isDisabled = false;
        }
        that.currentItem = item;
        that.data.ActionName = item.value;
        that.data.ButtonName = item.text;
        that.data.OrderNum = that.rightData.length + 1;
        that.data.Type =type;// item.value != 'cust' ? 'sys' : 'cust';
      },
      deleteItem(item) {
        var that = this;
        var actionName = item.ActionName;
        var tem = [];
        $.each(that.rightData, function (index, item) {
          if (item.ActionName != actionName) {
            tem.push(item);
          }
        });
        that.rightData = tem;
        this.autoOrderNum();
        that.addEmpty();
      },
      rightSelected(item) {
        var that = this;
        that.currentAction = 'eidt';
        that.data = Object.toClone(item);
        if (that.data.Type == 'cust') {
          that.isDisabled = false;
        } else {
          that.isDisabled = true;
        }
      },
      saveAndClose() {
        var that = this;
        FUI.Window.confirm(null, '您确定要提交保存？', '温馨提示', function () {
          var resultStr = '#' + that.getResult() + '#';
          parent.setTargetValue(that.attrName, resultStr);
          FUI.Window.closeEditAll();
        });
      },
      getResult() {
        var that = this;
        return JSON.stringify(that.rightData);
      }
    }
  };

  window.getResult = function () {
    return myvm.getResult();
  }
</script>
<style>
  .activity-item:hover {
    background-color: #e4eff9;
    border: 1px dotted #ccc;
  }
</style>