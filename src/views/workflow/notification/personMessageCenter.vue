<template>
  <div class="f2bpm-page-layout">
    <el-container>
      <el-aside ref="sideLeft" class="f2bpm-page-left" hide-trigger collapsible :width="isCollapsed?'20px':'200px'">
        <div class="f2bpm-panel-head f2bpm-panel-head-bg">
          <div>
            <i class="fa fa-server" />消息中心
          </div>
        </div>
        <ul class="ul-nav">
          <li @click="changeType('noreal')" :class="type=='noreal'?'selected':''"><a  href="javascript:void(0)" name="noreal">未读消息</a></li>
          <li @click="changeType('hadreal')" :class="type=='hadreal'?'selected':''"><a  href="javascript:void(0)" name="hadreal">已读消息</a></li>
          <li @click="changeType('all')" :class="type=='all'?'selected':''"><a   href="javascript:void(0)" name="all">全部消息</a></li>
        </ul>
      </el-aside>
      <el-main class="f2bpm-page-right">
        <f2bpm-gridsearchform :tableform="tableForm" @searchformbtnclick="searchFormbtnClick" @updatevalue="updateFieldValue" />
        <f2bpm-datagrid ref="grid" grid="grid" :toolbar="tableToolbar" :context-menu="{header: {options: headerMenus},className: 'my-menus'}" :pager-config="tablePage" :data="tableData" :columns="tableColumn" @cell-dblclick="celldbClick" @toolbar-button-click="toolbarButtonClickEvent" @header-contextmenu="contextMenuClickEvent" @page-change="pageChange" @sort-change="sortChange" />
      </el-main>
    </el-container>
  </div>
</template>

<script>
import websocketFeature from "@/utils/websocket";

  export default {
    data() {
      return {
        type: '',
        treeFilterText: '',
        isCollapsed: false,
        dg: {},
        tablePage: Object.toClone(FUI.DataGridProperty.tablePage),
        loading: false,
        treeData: [],
        tableData: [],
        tableForm: Object.toClone(FUI.DataGridProperty.tableForm),
        tableToolbar: Object.toClone(FUI.DataGridProperty.tableToolbar),
        headerMenus: FUI.DataGridProperty.headerMenus,
        tableColumn: [],
        myWebsocketKey: '',
        websock:''
      }
    },
    computed: {
      countGridHeight() {
        return $(document).height() - global_datagridHeightDiff
      },
      rotateIcon() {
        return this.isCollapsed
          ? 'fa fa-angle-double-right'
          : 'fa fa-angle-double-left'
      },
      positionIcon() {
        return this.isCollapsed
          ? 'cursor:pointer; position: relative;left: -5px;'
          : 'cursor:pointer; position: relative;left: 100px;'
      }
    },
    watch: {
      $route() {
        this.load()
      }
    },
    created() {
      this.load()
    },
    mounted() {
      window.myvm = this
      var type = this.type
      if (type == '') {
        that.type = 'noreal'
      }
      // let userId = FUI.Sys.userId || '';
      // let url = `${window.serverConfig.env_dev_websoket}/websocket/${userId}`;
      // this.myWebsocketKey = websocketFeature.create(
      // url,
      // this.websocketMessageHandler.bind(this)
      // );
    },
  destroyed() {
    websocketFeature.remove(this.myWebsocketKey);
  },
  methods: {
      websocketMessageHandler(e) {
        console.log("soket===:",e);
      },
      collapsedSider() {
        this.isCollapsed = !this.isCollapsed
      },
      load() {
        var that = this
        var type = Object.toQueryString('type') || 'noreal'
        var viewName = (type == 'noreal' || type == '') ? 'sqlkey_PersonMessageCenterList' : type == 'hadreal' ? 'sqlkey_PersonMessageCenterCompletedMsgList' : 'sqlkey_MessageAllList'
        var tableName = (type == 'noreal' || type == '') ? 'f2bpm_ns_Message' : type == 'hadreal' ? 'f2bpm_ns_MessageCompleted' : 'f2bpm_ns_Message'
        that.type = type
        const currUserId = that.$store.state.user.author.userId
        var dg = FUI.DataGrid.Create(that, viewName, tableName, 'grid', true, true, true)
        dg.SortName = 'CreatedTime'
        dg.SortOrder = 'desc'
        dg.ShowNumbers = true
        dg.DefaultWhere = "TargetUserId='" + currUserId + "'"
        dg.ToolBarDefaultButtons.ShowDelete = true
        dg.ToolBarDefaultButtons.ShowAdd = false
        dg.OperationAction.ShowView = false
        dg.EnableDblClickEdite = true
        dg.OperationViewEvent = this.myOperationViewEvent
        dg.ToolBarCustomButton = this.myToolBarCustomButton
        dg.Bind()
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
        $.each(this.searchParams, function (key, item) {
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
        Object.toAjaxJson(that.dg.GetUrl(), null, parm, true, null, function (res) {
          if (res.success) {
            that.tableData = res.rows
            that.tablePage.total = res.total
            that.tablePage.pageCount = res.pageCount
          } else {
            FUI.Window.showMsg(res.msg)
          }
        })
      },
      // ====stand:标准方法控制结束==============
      myOperationViewEvent(value, row, index) {
        this.showDialogEdit(FUI.FormAction.View, row[this.dg.IdField])
      },
      myOperationEditEvent(value, row, index) {
        this.showDialogEdit(FUI.FormAction.Edit, row[this.dg.IdField])
      },
      showDialogEdit(formAction, keyId) {
        var that = this
        var title = formAction == FUI.FormAction.Add ? '新增' + that.dg.EditTitle : '编辑' + that.dg.EditTitle
        FUI.Window.openEdit(that.dg.EditUrl, title, formAction, that.dg.GridId, 700, 550, null, that.dg.MainTable, keyId)
      },
      // 工具栏按钮
      myToolBarCustomButton() {
        const that = this
        var btns = []
        if (that.type == 'noreal') {
          btns.push({ code: 'setSelectedListToReal', status: 'default', name: '标记已读', icon: 'fa fa-check-square-o' })
        }
        return btns
      },
      // 工具栏按钮事件
      toolbarButtonClickEvent({ code }, event) {
        const that = this
        if (code == 'closeEdit') {
          FUI.Window.closeEdit()
        } else if (code == 'default.add') {
          that.showDialogEdit(FUI.FormAction.Add, '')
        } else if (code == 'default.delete') {
          // 批量删除，默认执行FUI内部的删除，如有需要可用成自己的删除方法
          that.dg.ToolBarBathDelete(that)
        } else {
          var fn = that[code]
          fn()
        }
      },
      titleContentFormatter(row, col, value, index) {
        return "<a href='javascript:void(0)' onclick=\"openMessageView('" + row.MessageId + "','" + row.RealState + "');\">" + value + '</a>'
      },
      changeType(type) {
        var url = '/workflow/notification/personMessageCenter/?type=' + type;
        this.$router.push(url);
        //window.location.href = __webpath + 
      },
      setSelectedListToReal() {
        var that = this
        var ids = that.dg.getChecked()
        if (ids == '') {
          FUI.Window.showMsg('请选择要标记的记录')
          return false
        }
        var param = { messageId: ids }
        FUI.Window.confirm('确定将所选记录标记已读吗？', '', function (r) {
          var result = Object.toAjaxJson('/workflow/notification/', 'setAlreadyRead', param)
          if (result.success) {
            that.refreshTopMsgCount()
          }
          FUI.Window.showMsg(result.msg, null, result.success == true ? 1 : 7, function () {
            // 刷新右上角的消息数量
            that.refreshGrid()
          })
        })
        return false
      },
      refreshTopMsgCount() {
        try {
          var resData = Object.toAjaxJson('/home/', 'getHomeOtherData')
          var msgCount = resData.megCount
          $('#top_todo_message_number sup').html(msgCount)
        } catch (err) {
          console.info(err)
        }
      }

    }

  }
  window.openMessageView = function (messageId, state) {
    if (state != '未读') return false
    var url = '/workflow/notification/notificationView/?messageId=' + messageId
    FUI.Window.openEdit(url, '查看消息', 'View', 'grid', 600, 400, null, null, messageId, false)
  }
</script>
<style>
  .ul-nav>li>.selected {
    color: #000000;
    background-color: #f1f1f1;
    border: 0px;
  }
</style>