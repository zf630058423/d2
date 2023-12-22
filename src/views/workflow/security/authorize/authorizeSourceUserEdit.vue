<template>
  <div class="f2bpm-page-dialog-layout">
    <div>
      <table class="common-grid" cellpadding="0" cellspacing="0">
        <tr>
          <td class="bg-gray" style="width: 50px;">授权类型</td>
          <td class="bg-gray bj">授权对象</td>
        </tr>
        <tr>
          <td class="bg-gray">所有人</td>
          <td class="bj">
            <el-switch v-model="data.writePowerAll" active-color="#87DC48" inactive-color="#DEDEDE" @change="writePowerAllChange" />所有人
          </td>
        </tr>
        <tr>
          <td class="bg-gray">用户授权</td>
          <td class="bj">
            <span v-if="false" placeholder="" v-html="data.user_write_value" />
            <span class="power_des_span_content" v-html="data.user_write_des" />
            <button class="btn btn-minier btn-primary mr2 write fr" :disabled="data.writeDisabled" title="设置用户“编辑”授权" @click="selectorUserTextValue('user_write_value','user_write_des',null,false,'account')">
              <i class="fa fa-gears bigger-120" />
            </button>
          </td>
        </tr>
        <tr>
          <td class="bg-gray">角色授权</td>
          <td class="bj">
            <span v-if="false" placeholder="" v-html="data.role_write_value" />
            <span class="power_des_span_content" v-html="data.role_write_des" />
            <button class="btn btn-minier btn-primary mr2 write fr" :disabled="data.writeDisabled" title="设置角色“编辑”授权" @click="selectorTextValue('role_write_value','role_write_des','Role')">
              <i class="fa fa-gears bigger-120" />
            </button>
          </td>
        </tr>
        <tr>
          <td class="bg-gray">组织授权</td>
          <td class="bj">
            <span v-if="false" placeholder="" v-html="data.org_write_value" />
            <span class="power_des_span_content" v-html="data.org_write_des" />
            <button class="btn btn-minier btn-primary mr2 write fr" :disabled="data.writeDisabled" title="设置组织“编辑”授权" @click="selectorTextValue('org_write_value','org_write_des','Org')">
              <i class="fa fa-gears bigger-120" />
            </button>
          </td>
        </tr>
      </table>
      <div style="margin: 5px;line-height: 20px;">
        <em class="cur" @click="onIsExplanation">授权设置说明</em>
        <div>
          【所有人】：如勾选了所有人，则表示忽略任何授权类型的限制，所有人都有资源的权限。<br>
          【授权对象】： 只有被授权的对象才能有权限，多种授权类型进行“或”运算。<br>
          【空白不设置】：空白不设置表示此授权类型不做限制也不参与运算。<br> 【举例说明】：授权对象有 用户授权：李四，角色授权：超级管理员，那么权限计算结果求解是：
          当前登录用户是李四或拥有角色为超级管理的人才有权限。
        </div>
      </div>
      <div class="dialogfooter2">
        <el-button size="small" type="primary" @click="submitForm()"><i class="fa fa-save" />保存
        </el-button>
        <el-button id="btn_cancel" size="small" @click="closeEdit"><i class="fa fa-minus-circle" />关闭
        </el-button>
      </div>
      <div style="margin-top: 5px; padding-left: 0px;margin-bottom: 10px;">
        <span class="label label-success" style="padding: 5px;" v-html="sourceType" />
      </div>
      <div style="height:450px;">
        <f2bpm-gridsearchform :tableform="tableForm" @searchformbtnclick="searchFormbtnClick" @updatevalue="updateFieldValue" />
        <f2bpm-datagrid
          ref="grid"
          grid="grid"
          height="450"
          :toolbar="tableToolbar"
          :context-menu="{header: {options: headerMenus},className: 'my-menus'}"
          :pager-config="tablePage"
          :data="tableData"
          :columns="tableColumn"
          @cell-dblclick="celldbClick"
          @toolbar-button-click="toolbarButtonClickEvent"
          @header-contextmenu="contextMenuClickEvent"
          @page-change="pageChange"
          @sort-change="sortChange"
        />
      </div>
      </el-form>

    </div>

  </div>
</template>

<script>

  export default {
    data() {
      return {
        isAppIdAuthor: false,
        powerType: [],
        permissionType: [],
        authorizeId: '',
        sourceType: '',
        type: '',
        isExplanation: false,
        ismultilevelAuthorize: false,
        rightData: { 'write': [] },
         data: {
          writeDisabled: false,

          writePowerAll: false,
          user_write_value: '',
          user_write_des: '',

          role_write_value: '',
          role_write_des: '',

          org_write_value: '',
          org_write_des: ''
        },
        // ==data grid====
        dg: {},
        tablePage: Object.toClone(FUI.DataGridProperty.tablePage),
        loading: false,
        treeData: [],
        tableData: [],
        tableForm: Object.toClone(FUI.DataGridProperty.tableForm),
        tableToolbar: Object.toClone(FUI.DataGridProperty.tableToolbar),
        headerMenus: FUI.DataGridProperty.headerMenus,
        tableColumn: []
      }
    },
    created: function() {
      var that = this
      var ismultilevelAuthorize = Object.toQueryString('ismultilevelAuthorize') || false
      var type = Object.toQueryString('type') || ''
      var authorizeId = Object.toQueryString('keyId')
      // 是否为流程应用直接进入的授权
      var isAppIdAuthor = Object.toQueryString('isAppIdAuthor') || false
      that.isAppIdAuthor = isAppIdAuthor
      var url = FUI.Handlers.WorkflowManageHandler
      var data = { 'write': [] }
      var myvm = null
      that.permissionType = ['user', 'org', 'role']
      that.powerType = ['write']

      var title = '流程'
      switch (type) {
        case '1':
          title = '授权分管的流程'
          break
        case '4':
          title = '授权发起流程'
          break
        case '2':
          title = '授权分管的流程应用'
          break
        case '3':
          title = '授权分管的表单应用'
          break
        case '5':
          title = '流程实例查询授权'
          break
      }
      that.sourceType = title
      that.authorizeId = authorizeId
      that.type = type
      that.ismultilevelAuthorize = ismultilevelAuthorize
      var url = '/workflow/security/authorize/'
      var mydata = Object.toAjaxJson(url, 'getAuthorizeUserJson', {
        authorizeId: authorizeId
      })
      that.rightData = mydata
      that.loadData()

      var dg = FUI.DataGrid.Create(that, 'f2bpm_sys_AuthorizeSource', 'f2bpm_sys_AuthorizeSource', 'grid', true, true, true)
      dg.SortName = 'EntityKey'
      dg.SortOrder = 'asc'
      dg.ShowNumbers = true
      dg.ExpansMore = false
      dg.DefaultWhere = " AuthorizeId='" + that.authorizeId + "' "
      dg.OperationAction.ShowView = false
      dg.OperationAction.ShowEdit = false
      dg.OperationAction.ShowDelete = !that.isAppIdAuthor
      dg.ToolBarDefaultButtons.ShowDelete = !that.isAppIdAuthor
      dg.ToolBarDefaultButtons.ShowAdd = !that.isAppIdAuthor
      dg.Bind()
    },
    mounted() {
      window.myvm = this
    },
    methods: {
      closeEdit() {
        FUI.Window.closeEdit()
      },
       pageChange({ currentPage, pageSize }) {
        this.tablePage.currentPage = currentPage
        this.tablePage.pageSize = pageSize
        this.tablePage.startIndex = (currentPage - 1) * pageSize
        this.getGridData()
      },
      // 刷新列表
       refreshGrid(parentGridId, parm) {
        var that = this
        that.dataGridSearch()
      },
       dataGridReSet() {
        var that = this
        $.each(this.searchParams, function(key, item) {
          that.searchParams[key] = ''
        })
        that.searchParams.historyVersion = 'false'
        // 重置查询
        this.dataGridSearch()
      },
       dataGridSearch() {
        this.tablePage.currentPage = 1
        this.tablePage.startIndex = 0
        this.getGridData()
      },
       getGridData() {
        const that = this
        let parm = Object.toClone(that.tableForm.data)
        parm.page = that.tablePage.currentPage
        parm.rows = that.tablePage.pageSize
        parm.sort = that.tablePage.sort
        parm.order = that.tablePage.order
        parm = Object.extend(parm, that.searchParams)
        Object.toAjaxJson(that.dg.GetUrl(), null, parm, true, null, function(res) {
          if (res.success) {
            that.tableData = res.rows
            that.tablePage.total = res.total
            that.tablePage.pageCount = res.pageCount
          } else {
            that.$message.error(res.msg, { duration: 0 })
          }
        })
      },
      // ====stand:标准方法控制结束==============
      // 工具栏按钮事件
       toolbarButtonClickEvent({ code }, event) {
        const that = this
        if (code == 'closeEdit') {
          FUI.Window.closeEdit()
        } else if (code == 'default.add') {
          that.selectSource()
        } else if (code == 'default.delete') {
          // 批量删除，默认执行FUI内部的删除，如有需要可用成自己的删除方法
          that.dg.ToolBarBathDelete(that)
        } else {
          var fn = that[code]
          fn()
        }
      },
       loadData() {
        var that = this
        $.each(that.powerType, function(index, power) {
          var powerData = that.rightData[power]
          $.each(powerData, function(index, theItem) {
            var type = theItem.type
            var valueData = theItem.value
            var targetValue = type + '_' + power + '_value'
            var targetDes = type + '_' + power + '_des'

            that.data[targetValue] = valueData ? JSON.stringify(valueData) : ''
            that.data[targetDes] = valueData ? that.getValueDes(valueData) : ''

            if (type == 'everyone') {
              that.data[power + 'PowerAll'] = true
              that.everyOneControl(true, power)
            }
          })
        })
      },
       getValueDes(data) {
        var des = ''
        var n = data.length
        $.each(data, function(index, item) {
          des += item.text
          if (index != n - 1) {
            des += ','
          }
        })
        return des
      },
       everyOneControl(isEveryOne, powerType) {
        var that = this
        if (isEveryOne == true) {
          that.data[powerType + 'Disabled'] = true
          that.cleanAll(powerType)
        } else {
          that.data[powerType + 'Disabled'] = false
        }
      },
       readPowerAllChange(value) {
        this.everyOneControl(value, 'read')
      },
       writePowerAllChange(value) {
        this.everyOneControl(value, 'write')
      },
       cleanAll(powerType) {
        var that = this
        $.each(that.permissionType, function(index, type) {
          var target = type + '_' + powerType + '_value'
          var targetDes = type + '_' + powerType + '_des'
          that.data[target] = ''
          that.data[targetDes] = ''
        })
      },
       collectData() {
        var that = this
        var result = {
          read: [],
          write: []
        }
        // 写权限
        var writeData = []
        $.each(that.permissionType, function(index, type) {
          var target = type + '_write_value'
          var value = that.data[target]
          if (value == '') { return true }
          var valueObj = eval(value)
          writeData.push({
            'type': type,
            'value': valueObj
          })
        })
        // 所有人
        if (that.data.writePowerAll) {
          writeData.push({
            'type': 'everyone',
            'value': [{
              value: 'everyone',
              text: '所有人'
            }]
          })
        }
        result.write = writeData
        var str = JSON.stringify(result)
        return str
      },
       onIsExplanation() {
        this.isExplanation = !this.isExplanation
      },
       submitForm() {
        var that = this
        var data = {
          authorizeUserJson: that.collectData,
          authorizeId: that.authorizeId
        }
        var url = '/workflow/security/authorize/'
        var result = Object.toAjaxJson(url, 'saveAuthorizeUser', data)
        FUI.Window.showMsg(that, result.msg, null, 1, function() {
          if (result.success == true) {
            FUI.Window.closeEdit()
          }
        })
      },
       thisSelectActivity(inputId, inputText) {
        WF.SelectorDialog.selectorTextValue(inputId, inputText, 'HistoryActivity', {
          appId: appId
        })
      },
       selectorTextValue(inputKey, inputName, type) {
        var that = this
        WF.SelectorDialog.selectorTextValue(that, inputKey, inputName, type)
      },
       selectorUserTextValue(inputKey, inputName, passParm, singleSelect, keyName) {
        var that = this
        WF.SelectorDialog.selectorUserTextValue(that, inputKey, inputName, passParm, singleSelect, keyName)
      },
       selectSource() {
        var that = this
        var selectorUrl = ''
        var title = ''
        var key = ''
        var name = ''
        switch (that.type.toString()) {
          case '1':
            title = '选择流程定义'
            selectorUrl = __webpath + '/workflow/selector/workflowSelect'
            key = 'WorkflowKey'
            name = 'WorkflowName'
            break
          case '5':
            title = '流程实例查询授权'
          case '4':
            title = '选择授权可发起的流程应用'
          case '2':
            title = '选择流程应用'
            selectorUrl = __webpath + '/workflow/selector/workflowAppSelect'
            key = 'AppId'
            name = 'AppName'
            break
          case '3':
            title = '选择表单定义'
            selectorUrl = __webpath + '/workflow/selector/workflowFormSelect?noWorkflowForm=1'
            key = 'FormKey'
            name = 'FormName'
            break
        }

        FUI.dialog(selectorUrl, title, { singleSelect: false, authorizeType: that.type, 'ismultilevelAuthorize': that.ismultilevelAuthorize }, 870, 500, function(objectData, index, layer) {
          if (objectData.length > 0) {
            var json = []
            $.each(objectData, function(i, item) {
              json.push({
                'entityKey': item[key],
                'entityName': item[name]
              })
            })
            var url = '/workflow/security/authorize/'
            var result = Object.toAjaxJson(url, 'saveAuthorizeSource', {
              sourceJson: JSON.stringify(json),
              authorizeId: that.authorizeId
            })
            if (result.success) {
              that.dg.Reload()
            } else {
              FUI.Window.showMsg(that, result.msg)
              return false
            }
          }
          layer.close(index)
        }, true)
        return false
      }
    }
  }
</script>
