<template>
  <el-dialog title="收货地址" :modal="false" @close="close" :close-on-click-modal="false" :visible.sync="FormVisible">
    <el-form :model="data" ref="form" :rules="formRules">
      <el-form-item label="任务名称" prop="nodeName" label-width="100px">
        <el-input v-model="data.nodeName" placeholder="请输入任务名称"></el-input>
      </el-form-item>
      <el-form-item label="任务分配到人" label-width="100px">
        <el-switch v-model="data.isAllocate" :disabled="data.children.length>0" :active-value="1" :inactive-value="0" active-color="#13ce66" inactive-color="#ff4949"> </el-switch>
      </el-form-item>
      <el-form-item label="责任人"  label-width="100px"  prop="dutyPeople">
        <el-input disabled placeholder="请选择责任人" v-model="data.dutyPeople">
          <el-button slot="append"  :disabled="data.isAllocate!==1"  icon="el-icon-search"  @click="selectStrUsers('dutyPeople', 'dutyPeopleID', true)"></el-button>
        </el-input>
      </el-form-item>
      <el-form-item label="计划开始日期" label-width="100px" prop="planBeginTime">
        <el-date-picker v-model="data.planBeginTime" :disabled="data.isAllocate!==1" type="date" value-format="yyyy-MM-dd" format="yyyy-MM-dd" placeholder="选择日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="计划结束日期" label-width="100px" prop="planEndTime">
        <el-date-picker v-model="data.planEndTime" :disabled="data.isAllocate!==1" value-format="yyyy-MM-dd" format="yyyy-MM-dd" type="date" placeholder="选择日期">
        </el-date-picker>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="FormVisible = false">取 消</el-button>
      <el-button type="primary" @click="saveClick">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
const UUID = require('uuid')
export default {
  props: ['myId', 'parentId', 'type'],
  data () {
    return {
      FormVisible: false,

      data: {
        myId: '',
        parentId: '',
        nodeName: '',
        dutyPeople: '',
        dutyPeopleID: '',
        planBeginTime: null,
        planEndTime: null,
        keyNodes: 0,
        children: [],
        isAllocate: 0,
      },
      formRules: {
        nodeName: [{ required: true, message: '请输入任务名称', trigger: 'blur' },],
      }
    }
  },
  methods: {
    selectStrUsers (inputId, hidInputId, isSingle) {
      WF.SelectorDialog.selectStrUsers(this, inputId, hidInputId, isSingle);
    },
    saveClick () {
      this.$refs.form.validate(e => {
        if (e) {
          // if(this.type=='edit'){

          // }
          if (this.data.isAllocate == 1) {
            if (this.data.dutyPeople == '') return this.$message.error('请选择责任人!')
            if (this.data.planBeginTime == null) return this.$message.error('请选择开始时间!')
            if (this.data.planEndTime == null) return this.$message.error('请选择结束时间!')
          }

          if (this.type == 'edit') {
            this.$emit('editConfim', JSON.parse(JSON.stringify(this.data)))
            this.$message.success('编辑成功')
          } else {
            if (this.myId == '' && this.parentId == '') {
              this.data.myId = UUID.v1()
            } else {
              this.data.myId = UUID.v1()
              this.data.parentId = this.parentId
            }
            this.$emit('addNodeData', JSON.parse(JSON.stringify(this.data)))
            this.$message.success('新增成功')
          }

          this.FormVisible = false
        } else {
          this.$message.error('请完善必填项！')
        }
      })
    },
    close () {
      this.$refs.form.resetFields()
      this.data = {
        myId: '',
        parentId: '',
        nodeName: '',
        dutyPeople: '',
        dutyPeopleID: '',
        planBeginTime: null,
        planEndTime: null,
        keyNodes: 0,
        children: [],
        isAllocate: 0
      }

    }
  }
}
</script>

<style>
</style>