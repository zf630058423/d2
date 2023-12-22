<template>
  <el-dialog :visible.sync="visible" width="1000px" :show-close="false" :title="formAction =='Add'?'新建SQL执行': formAction == 'edit'?'编辑SQL执行':'SQL执行'">
    <el-form ref="formRef" :rules="formRules" size="small" :model="data" class="f2bpm-editform" label-width="100px">
      <el-row>
        <el-col :span="8">
          <el-form-item label="编号">
            <el-input v-model="data.no" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="16">
          <el-form-item label="标题" prop="title">
            <el-input v-model="data.title" :disabled="isReadOnly"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :span="8">
        <el-col :span="24">
          <el-form-item label="SQL语句" prop="sqlStatement">
            <el-input v-model="data.sqlStatement" :disabled="isReadOnly" type="textarea" :autosize="{ minRows: 6, maxRows: 6 }"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="SQL语句用途">
            <el-input v-model="data.sqlStatementPurpose" :disabled="isReadOnly" type="textarea" :autosize="{ minRows: 6, maxRows: 6 }"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="执行结果">
            <el-input :value="data.result===0?'失败': data.result === 1 ?'成功':''" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="执行人">
            <el-input v-model="data.executor" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="执行时间">
            <el-date-picker v-model="data.executionTime" :disabled="true" size="mini" type="datetime" class="textBoxShort" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="编制人">
            <el-input v-model="data.createName" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="编制人部门">
            <el-input v-model="data.createDept" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="编制时间">
            <el-date-picker v-model="data.createTime" :disabled="true" size="mini" type="datetime" class="textBoxShort" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item v-show="false" label="编制人部门ID">
        <el-input v-model="data.createDeptId" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item v-show="false" label="创建人Id">
        <el-input v-model="data.creatorId" :disabled="true"></el-input>
      </el-form-item>
      <div class="dialogfooter">
        <el-button v-if="formAction!='View'" size="small" type="primary" @click="submitForm()"><i class="fa fa-save" />保存
        </el-button>
        <el-button v-if="formAction!='View'" size="small" type="primary" @click="modifySqlExecuteLog()"><i class="fa fa-save" />保存执行
        </el-button>
        <el-button id="btn_cancel" size="small" @click="closeEdit(false)"><i class="fa fa-minus-circle" />取消
        </el-button>
      </div>
    </el-form>
  </el-dialog>
</template>
<script>
  export default {
    name: 'SqlExecuteLogEdit',
    props: {
      visible: {
        type: Boolean,
        default: false
      },
      keyId: {
        type: String,
        default: ''
      },
      formAction: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        loading: false,
        isReadOnly: false,
        treeData: [],
        data: {
          myId: '',
          'createDept': '',
          'createDeptId': '',
          'createName': '',
          'createTime': '',
          'creatorId': '',
          'executionTime': '',
          'executor': '',
          'executorId': '',
          'formId': '',
          'myParentId': '',
          'no': '',
          'procInstState': '',
          'result': '',
          'sqlStatement': '',
          'sqlStatementPurpose': '',
          'title': '',
          'wiid': ''
        },
        formRules: {
          title: [{ required: true, message: '必填项不能为空' }],
          sqlStatement: [{ required: true, message: '必填项不能为空' }]
        }
      }
    },
    watch: {
      visible(val) {
        if (val) {
          this.initData()
        }
      }
    },
    methods: {
      initData() {
        var that = this;
        that.isReadOnly = this.formAction == FUI.FormAction.View;
        if (this.formAction == FUI.FormAction.Add) {
          const currUser = FUI.Sys.getAuthor();
          that.data.createDeptId = currUser.orgId;
          that.data.createDept = decodeURI(currUser.orgName);
          that.data.createName = decodeURI(currUser.realName);
          that.data.creatorId = currUser.userId;
          that.data.createTime = new Date().toDateString() + ' ' + new Date().toLocaleTimeString()
          that.getSerialNumber()
        }
        that.loadData();
      },
      getSerialNumber() {
        var that = this;
        const res = Object.toAjaxJson(FUI.Handlers.FuiFrameworkHandler, 'getSerialNumber', { 'counterCode': 'BPM_SQL' });
        if (res.success) {
          that.data.no = res.msg
        }
      },
      closeEdit(isPull) {
        this.data = this.$options.data().data
        this.$refs['formRef'].resetFields()
        this.$emit('onClose', isPull)
      },
      loadData() {
        var that = this;
        if (this.formAction != FUI.FormAction.Add) {
          $.extendAjax('/extend/sqlexecutelog/querySqlExecuteLog', { id: this.keyId }, 'get', function(res) {
            console.log('详情', res)
            that.data = res.data
          });
        }
      },
      submitForm() {
        const that = this;
        this.$refs['formRef'].validate((valid) => {
          if (valid) {
            const formData = JSON.parse(JSON.stringify(this.data))
            formData.createTime = '';
            formData.executionTime = '';
            formData.result = '';
            Object.toExtendAjax('/extend/sqlexecutelog/', 'addSqlExecuteLog', JSON.stringify(formData), true, null, function(res) {
              if (res.code === 200) {
                FUI.Window.showMsg2(that, '保存成功', null, 1, function() {
                  if (res.success) {
                    that.closeEdit(true)
                  }
                });
              } else {
                that.$message.error(res.msg)
              }
            });
          }
        });
      },
      modifySqlExecuteLog() {
        const that = this;
        this.$refs['formRef'].validate((valid) => {
          if (valid) {
            const formData = JSON.parse(JSON.stringify(this.data))
            formData.createTime = '';
            formData.executionTime = '';
            Object.toExtendAjax('/extend/sqlexecutelog/', 'modifySqlExecuteLog', JSON.stringify(formData), true, null, function(res) {
              if (res.code === 200) {
                FUI.Window.showMsg2(that, '保存执行成功', null, 1, function() {
                  if (res.success) {
                    that.closeEdit(true)
                  }
                });
              } else {
                that.$message.error(res.msg)
                that.closeEdit(true)
              }
            });
          }
        });
      }
    }
  }
</script>
