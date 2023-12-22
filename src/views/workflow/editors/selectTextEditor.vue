<template>
  <div class="f2bpm-page-layout overauto">
    <el-form ref="formRef" :label-position="position" class="f2bpm-editform">
      <el-form-item v-if="isShowSysVars" label="系统变量" size="mini">
        <el-select v-model="data.selectValue" @change="onChange">
          <el-option label="请选择" value="" />
          <el-option v-for="item in sysVarsArr" :label="item.text" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item v-if="isShowWfVars" label="流程变量" size="mini">
        <el-select v-model="data.selectValue" @change="onChange">
          <el-option label="流程实例Id" value="#Wiid#" />
          <el-option label="流程单号" value="#SheetId#" />
          <el-option label="当前节点ID" value="#CurrentActivityId#" />
          <el-option label="当前节点编码" value="#CurrentActivityCode#" />
          <el-option label="当前节点名称" value="#CurrentActivityName#" />
          <el-option label="流程发起人UserId" value="#ProcInstCreatorId#" />
          <el-option label="流程发起人姓名" value="#ProcInstCreatorRealName#" />

          <el-option label="表单应用Id" value="#FormId#" />
          <el-option label="GuId唯一值" value="#GuId#" />
          <el-option label="从Sql取单个值" value="Sql:" />
        </el-select>
      </el-form-item>
      <el-form-item :label="label">
        <el-input v-model="data.content" type="textarea" :rows="6" :placeholder="tip" />
      </el-form-item>
      <span style="line-height: 14px;" v-html="description" />
    </el-form>
  </div>
</template>

<script>
  export default { data() {
      return {
        sysVarsArr: [
          { text: '当前登录者Id', value: '#CurrentUserId#' },
          { text: '当前登录者账号', value: '#CurrentAccount#' },
          { text: '当前登录者姓名', value: '#CurrentRealName#' },
          { text: '当前登录者组织ID', value: '#CurrentOrgId#' },
          { text: '当前登录者组织名称', value: '#CurrentOrgName#' },
          { text: '当前租户ID', value: '#CurrentTenantId#' },
          { text: '当前日期', value: '#CurrentDate#' },
          { text: '当前日期时间', value: '#CurrentDateTime#' },
          { text: '当前日期时间毫秒字符串', value: '#yyyyMMddhhmmssSSS#' },
          { text: 'GuId唯一值', value: '#GuId#' }
        ],
        // ======stand:标准区=============
        treeFilterText: '',
        tip: '',
        description: '',
        isShowSysVars: false,
        isShowWfVars: false,
        position: 'top',
        data: {
          selectValue: '',
          content: ''
        }
      }
    },
    created() {
      var that = this

      var parmsStr = Object.toQueryString('parms')
      var parms = {}
      if (parmsStr) {
        parmsStr = decodeURIComponent(parmsStr)
        parms = eval('(' + parmsStr + ')')
      }
      var initailText = parms.data || ''

      that.data.content = initailText
      that.label = parms.label || ''
      that.tip = parms.tip || '请填写内容'
      that.description = parms.description || ''
      if (parms.isShowSysVars == undefined) {
        that.isShowSysVars = false
      } else {
        that.isShowSysVars = parms.isShowSysVars
      }

      if (parms.isShowWfVars == undefined) {
        that.isShowWfVars = false
      } else {
        that.isShowWfVars = parms.isShowWfVars
      }
      if (that.isShowSysVars === true) {
        that.position = 'right'
      }
    },
     mounted() {
      window.myvm = this
    },
    methods: {
      onChange(value) {
        this.data.content = this.data.content + value
      },
       getResult() {
        return this.data.content
      }
    }
  }
  window.getResult = function() {
    return myvm.getResult()
  }
</script>
