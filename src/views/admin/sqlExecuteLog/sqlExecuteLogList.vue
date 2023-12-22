<template>
  <div class="f2bpm-page-layout">
    <el-container>
      <el-main class="f2bpm-page-right">
        <div id="gridSearch" class="grid-search-form">
          <div id="grid-search-form-list" class="grid-search-form-list">
            <ul>
              <li><span class="mr4"> 单据编号：</span>
                <el-input v-model="searchParams.no" size="small" class="textBoxShort" />
              </li>
              <li><span class="mr4 ml20"> 标题：</span>
                <el-input v-model="searchParams.title" size="small" class="textBoxShort" />
              </li>
              <li><span class="mr4 ml20"> 执行人：</span>
                <el-input v-model="searchParams.executor" size="small" class="textBoxShort" />
              </li>
              <li class="pl10">
                <el-button size="small" type="primary" role="button" @click="dataGridSearch()"><i class="fa fa-search" />{{ $t('search') }}
                </el-button>
                <el-button size="small" @click="dataGridReSet()"><i class="fa fa-undo" />重置
                </el-button>
              </li>
            </ul>
          </div>
        </div>
        <div class="grid-toolbar">
          <el-button size="small" @click="showDialogEdit('Add',null)"><i class="icon icon-xinzeng" />新建</el-button>
          <el-button size="small" @click="bathDeleteEvent()"><i class="fa fa-remove" />删除</el-button>
          <el-button size="small" type="primary" @click="exportExcel()"><i class="icon icon-daochu" />导出</el-button>
        </div>
        <el-table
          id="grid"
          ref="f2bpmuiVuetable"
          :key="tableKey"
          class="f2bpmui-datagrid-vuetable"
          size="small"
          :height="tableHeight"
          :stripe="true"
          row-key="wiid"
          :data="tableData"
          element-loading-text="加载中"
          fit
          highlight-current-row
          @select="selectionChange"
          @select-all="selectAll"
          @cell-dblclick="celldblclick"
        >
          <!--多选-->
          <el-table-column type="selection" fixed="left" align="center" width="45" />
          <el-table-column type="index" label="序号" width="50" />
          <el-table-column label="操作" width="120">
            <template slot-scope="scope">
              <div class="table-drop">
                <el-dropdown size="mini" split-button>
                  <div @click="showDialogEdit('View', scope.row.myId)"><i class="icon icon-search"></i> 查看</div>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item v-show="scope.row.result!=1" @click.native="showDialogEdit('edit',scope.row.myId)"><i class="icon icon-edit" />编辑</el-dropdown-item>
                    <el-dropdown-item v-show="scope.row.result===null" @click.native="deleteClick(scope.row)"><i class="el-icon-delete" />删除</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="no" label="单据编号" min-width="120"></el-table-column>
          <el-table-column prop="title" label="标题" min-width="120"></el-table-column>
          <el-table-column prop="sqlStatement" label="SQL语句" min-width="120"></el-table-column>
          <el-table-column prop="result" label="执行结果" min-width="120">
            <template slot-scope="scope">
              {{ scope.row.result == 1?'成功': scope.row.result == 0?'失败':'-' }}
            </template>
          </el-table-column>
          <el-table-column prop="executor" label="执行人" min-width="120"></el-table-column>
          <el-table-column prop="executionTime" label="执行时间" min-width="120"></el-table-column>
        </el-table>
        <div class="mt4 mb4 tc">
          <el-pagination small background :current-page="tablePage.currentPage" :page-sizes="tablePage.pageSizes" :page-size="tablePage.pageSize" :layout="tablePage.layout" :total="tablePage.total" @size-change="pageSizeChange" @current-change="pageChange" />
        </div>
      </el-main>
    </el-container>
    <sqlExecuteLogEdit :visible="visible" :key-id="keyId" :form-action="formAction" @onClose="refreshGrid"></sqlExecuteLogEdit>
  </div>
</template>

<script>
import sqlExecuteLogEdit from './sqlExecuteLogEdit.vue'
export default {
    components: {
      sqlExecuteLogEdit
    },
    data() {
        return {
          visible: false,
          formAction: '',
          keyId: '',
          dg: {
            GridId: '',
            MainTable: '',
            EditUrl: '/admin/sqlExecuteLog/sqlExecuteLogEdit',
            EditTitle: 'SQL执行'
          },
          tableForm: Object.toClone(FUI.DataGridProperty.tableForm),
          tablePage: Object.toClone(FUI.DataGridProperty.tablePage),
          searchParams: {
            currentPage: 1,
            pageSize: 20
          },
          tableData: [],
          tableHeight: 'calc(100vh - 200px)',
          // 为了可以让表格重新渲染复选框控件
          tableKey: 'table',
          selectionRow: [],
          selectionIds: []
        };
    },
    created() {
    },
    mounted() {
      this.getGridData()
    },
    methods: {
      exportExcel() {
        Object.toAjaxDownloadFile('/extend/sqlexecutelog/', 'sqlExecuteLogExport', {
          pageIndex: 0,
          pageSize: 1000,
          ...this.searchParams,
          ids: this.selectionIds.toString()
        });
      },
      refreshGrid(isPull) {
        if (isPull) {
          this.dataGridSearch()
        }
        this.visible = false
      },
      // 双击单元格时触发
      celldblclick(row, column, cell, event) {
        this.$emit('cell-dblclick', { row: row, column: column, cell: cell, event: event });
      },
      selectAll(selection) {
        var that = this;
        that.checkedAll = selection.length > 0;
        that.tableData.forEach(function(item, index) {
          item._checked = that.checkedAll;
        });
        var obj = { selection: JSON.parse(JSON.stringify(that.tableData)), checked: that.checkedAll };
        this.setCheckedTable(obj)
      },
      selectionChange(selection, row) {
        var isChecked = false;
        selection.forEach(function(item, index) {
          if (row.myId === item.myId) {
            isChecked = true;
          }
        });
        row._checked = isChecked;
        const obj = { row: row, checked: isChecked };
        this.setCheckedTable(obj)
      },
      setCheckedTable(obj) {
        // 选中
        if (obj.checked) {
          // 全选
          if (obj.selection) this.selectionRow = obj.selection;
          // 单选
          if (obj.row) {
            const index = this.selectionRow.findIndex(e => {
              return e.myId === obj.row.myId
            })
            if (index === -1) {
              this.selectionRow.push(obj.row)
            }
          }
        } else {
          // 全不选
          if (obj.selection) this.selectionRow = [];
          // 取消单选
          if (obj.row) {
            const index = this.selectionRow.findIndex(e => {
              return e.myId === obj.row.myId
            })
            if (index !== -1) {
              this.selectionRow.splice(index, 1)
            }
          }
        }
        this.selectionIds = this.selectionRow.map(res => {
          return res.myId;
        })
      },
      // 设置选中或取消选中的行
      toggleSelection(rows) {
        if (rows) {
          rows.forEach(row => {
            this.$refs.f2bpmuiVuetable.toggleRowSelection(row);
          });
        } else {
          this.$refs.f2bpmuiVuetable.clearSelection();
        }
        this.selectionIds = []
        this.selectionRow = []
      },
      pageSizeChange(val) {
        var that = this;
        that.searchParams.currentPage = 1
        that.searchParams.pageSize = val
        this.getGridData()
      },
      pageChange(val) {
        var that = this;
        that.searchParams.currentPage = val
        this.selectionIds = []
        this.selectionRow = []
        // 重置查询
        this.getGridData();
      },
      showDialogEdit(formAction, keyId) {
        this.keyId = keyId;
        this.formAction = formAction;
        this.visible = true
      },
      dataGridReSet() {
        const that = this;
        $.each(this.searchParams, function(key, item) {
          that.searchParams[key] = '';
        })
        this.searchParams.currentPage = 1
        this.searchParams.pageSize = 20
        // 重置查询
        this.dataGridSearch();
      },
      dataGridSearch() {
        this.searchParams.currentPage = 1;
        this.getGridData();
      },
       getGridData() {
        const that = this;
        let parm = Object.toClone(that.tableForm.data);
        parm.pageIndex = that.searchParams.currentPage;
        parm.pageSize = that.searchParams.pageSize;
        parm = Object.extend(parm, that.searchParams);
        $.extendAjax('/extend/sqlexecutelog/querySqlExecuteLog', JSON.stringify(parm), 'post', function(res) {
          if (res.code === 200) {
            that.tableData = res.rows;
            that.tablePage.total = res.total;
            that.tablePage.pageCount = Math.ceil(res.total / that.tablePage.pageSize);
          } else {
            FUI.Window.showMsg(res.msg);
          }
        });
      },
      deleteClick(row) {
        this.bathDeleteEvent(row.myId);
      },
      getChecked(filed) {
        var data = this.$refs.f2bpmuiVuetable.getCheckboxRecords();
        var ids = [];
        if (data.length == 0) {
          return '';
        }
        for (var i = 0; i < data.length; i++) {
          var id = data[i][filed];
          ids.push(id);
        }
        var result = ids.toString();
        return result;
      },
      bathDeleteEvent(ids) {
        var that = this;
        if (!ids && this.selectionIds.length <= 0) {
          FUI.Window.showMsg('请选中你要删除的记录');
          return
        }
        const obj = this.selectionRow.find(res => {
          return res.result !== null
        })
        if (obj) {
          FUI.Window.showMsg('执行结果≠空的数据，不允许删除');
          return
        }
        if (!ids) ids = this.selectionIds.toString();
        FUI.Window.confirm(that, '您确定删除记录吗？', null, function() {
          $.extendAjax('/extend/sqlexecutelog/delSqlExecuteLog?ids=' + ids, '', 'delete', function(res) {
            if (res.code === 200) {
              that.dataGridSearch();
              that.toggleSelection()
            } else {
              FUI.Window.showMsg(res.msg);
            }
          });
        })
      }
    }
};
</script>

<style scoped lang="scss">
.table-drop {
  ::v-deep .el-dropdown {
    display: flex !important;
    .el-button-group{
      display: flex !important;
    }
  }
}
</style>
