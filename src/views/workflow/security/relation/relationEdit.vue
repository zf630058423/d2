<template>
  <div class="f2bpm-page-dialog-layout">
    <div>
      <el-form ref="formRef" :rules="formRules" size="small" :model="data" class="f2bpm-editform" label-width="160px">
        <el-form-item label="汇报树分类" prop="categoryCode">
          <treeselect v-model="data.categoryCode" placeholder="请选择分类" :default-expand-level="2" :multiple="false" :options="treeData" />
        </el-form-item>
        <el-form-item label="汇报树名称" prop="relationTitle">
          <el-input v-model="data.relationTitle"></el-input>
        </el-form-item>
        <el-form-item label="“我在哪里”优先级" prop="relationPriority">
          <span class="cube bg-blue mr10" v-for="item in checkList"> <i class="fa fa-caret-left cur p2 pr3 " v-if="item!='all'" @click="setTop(item)" title="置顶"></i>{{rlationPriority(item)}}</span>
          <el-checkbox-group v-model="checkList" @change="priorityCheckChange">
            <el-checkbox label="user" :disabled="isAll">用户</el-checkbox>
            <el-checkbox label="role" :disabled="isAll">角色</el-checkbox>
            <el-checkbox label="org" :disabled="isAll">组织</el-checkbox>
            <el-checkbox label="all">所有</el-checkbox>
          </el-checkbox-group>
          <el-tooltip class="item" effect="dark" content=" " placement="right">
            <div slot="content">
              【我在哪里】的定位策略，默认在所有节点中查找。如果设置了优先级则从权重高的开始查找，
              <br/>找不到时则继续向权重次一级中查找，直到找到时才停止继续查找。 
              <br/>
              “所有”代表在整个树中所有类型中查找找到的节点全部纳入计算。
              <br> 点击“三角形箭头”可调整顺序。
            </div>
            <i class="el-icon-question font10">说明；建议勾选具体类型节省资源开销</i>
          </el-tooltip>
        </el-form-item>
        <el-form-item label="“我在哪里”找不到时" prop="relationPriority">
          <div class="font10">
            <el-checkbox-group v-model="lostedWhatToFindByList" @change="priorityCheckChange">
              <el-checkbox label="nearparentorg"  > 使用“我的最近上级组织”作为查找依据</el-checkbox>
            </el-checkbox-group>
          </div>
          <el-tooltip class="item" effect="dark" placement="right">
            <div slot="content">
              “我在哪里”找不到时，将采用何种方式重新计算，
              <br/>
              例如整棵树中没有我的组织时，可使用我最近的上级组织(递归最近上级直到树中存在此组织)做为查找我在哪里的计算依据。
            </div>
            <i class="el-icon-question font10">说明</i>
          </el-tooltip>
        </el-form-item>
        <el-form-item label="备注" prop="remarks">
          <el-input v-model="data.remarks" type="textarea" :rows="4" placeholder="" />
        </el-form-item>

        <div class="dialogfooter">
          <el-button v-if="formAction!='View'" size="small" :disabled="loading" type="primary" @click="submitForm()"><i class="fa fa-save" />保存
          </el-button>
          <el-button id="btn_cancel" size="small" @click="closeEdit"><i class="fa fa-minus-circle" />取消
          </el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        loading: false,
        formAction: null,
        treeData: [],
        isAll: false,
        checkList: ['user', 'org'],
        //使用我的什么来查找:nearparentorg树中最靠近我的上级组织
        lostedWhatToFindByList: [ ],
        data: {
          id: "",
          categoryCode: null,
          relationPriority: "",
          //如果找不到我在哪里时使用我的什么来查找
          lostedWhatToFind:"",
          relationTitle: "",
          relationKey: "",
          tenantid: "",
          remarks: ""

        },
        formRules: {
          relationTitle: [{ required: true, message: '必填项不能为空' }],
          categoryCode: [
            { required: true, message: '请选择分类' }
          ],
        }
      };
    },
    computed: {
      rlationPriority() {
        return function (v) {
          if (v === "all") {
            return "所有";
          }
          if (v === "role") {
            return "角色";
          }
          if (v === "org") {
            return "组织";
          }
          if (v === "user") {
            return "用户";
          }
        };
      }
    }
    , mounted() {
      var that = this;
      window.myvm = that;
    },
    created: function () {
      var that = this;

      that.formAction = formAction;
      if (formAction == FUI.FormAction.Add) {
        const currUser = that.$store.state.user.author;
        that.data.tenantid = currUser.tenantId;
        that.data.relationKey = Object.toGetCurrentDateTimeMillisecond();
      }
      that.loadData();
      that.loadTreeSelect();
    },
    methods: {
      closeEdit() {
        FUI.Window.closeEdit();
      },
      loadData() {
        var that = this;
        if (formAction != FUI.FormAction.Add) {
          FUI.Form.bindDataToForm(that, "/workflow/security/relation/", "getModel", keyId, null, mainTable);
          if (that.data.relationPriority) {
            that.checkList = that.data.relationPriority.split(",");
            that.isAll = $.inArray('all', that.checkList) > -1;
          }else{
            that.checkList = [];
          }
          if (that.data.lostedWhatToFind) {
            that.lostedWhatToFindByList = that.data.lostedWhatToFind.split(",");
          }else{
            that.lostedWhatToFindByList = [];
          }
        }
      },
      loadTreeSelect() {
        var that = this;
        var treeUrl = FUI.Handlers.CategoryHandler + '?groupKey=RelationTreeGroup&needRoot=false';
        Object.toAjaxJson(treeUrl, null, null, true, null, function (res) {
          if (res.success) {
            that.treeData = res.data;
          } else {
            that.$message.error(
              res.msg
            );
          }
        });
      },
      priorityCheckChange(v) {
        var that = this;
        if ($.inArray('all', v) > -1) {
          that.checkList = ['all'];
          that.isAll = true;
        } else {
          that.isAll = false;
        }
      }
      , setTop(v) {
        var that = this;
        var arr = [];
        arr.push(v);
        $.each(that.checkList, function (i, item) {
          if (item != v) {
            arr.push(item);
          }
        });
        that.checkList = arr;
      }
      , submitForm() {
        var that = this;
        //f2bpmui.base.js中全局方法收集富文编辑器数据
        fui_global_richeditorArrValueToInput(that);
        that.data.relationPriority = that.checkList.toString();
        that.data.lostedWhatToFind = that.lostedWhatToFindByList.toString();
        var success = that.validateForm('formRef');
        if (!success) return;
        that.loading = true;
        FUI.Form.submitForm(that, that.data, "/workflow/security/relation/", "saveModel", formAction, keyId, parentGridId, mainTable);
      },
      // field: 可以是字段名也可以是字段定义的对象
      updateFieldValue(field, newValue, vueDataName, subVueDataName) {
        // 更新控件值
        var that = this;
        var vueDataObj = vueDataName ? that[vueDataName] : that.data;
        if (subVueDataName) {
          vueDataObj = that[vueDataName][subVueDataName];
        }
        if (typeof field === 'string') {
          vueDataObj[field] = newValue;
        } else {
          if (field.fieldName) {
            vueDataObj[field.fieldName] = newValue;
          }
          else if (field.vModel) {
            vueDataObj[field.vModel] = newValue;
          } else if (field['field']) {
            vueDataObj[field['field']] = newValue;
          }
        }
      },
      validateForm(refFormName) {
        var success = false;
        this.$refs[refFormName].validate(valid => {
          success = valid;
        });
        return success;
      }
    }
  }
</script>