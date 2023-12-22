<template>
  <div class="f2bpm-page-layout">
    <div style="width: 100%; margin: 0;clear: both">
      <div style="padding: 5px;" border="false">
        <div id="box" class="fence-box" style="width: 98%">
          <div style="padding-left: 10px; text-align: left;">
            <i class="fa fa-cube" aria-hidden="true" />本节点传递过程：
          </div>
          <div class="fence-inner-line column-height" style="width: 99%; height: 490px;">
            <div style="padding: 3px;">
              <el-table size="small" :data="treeTableData" style="width: 100%;margin-bottom: 20px;" row-key="id" border default-expand-all :tree-props="{children: 'children', expandAll: true }">
                <el-table-column prop="id" type="index" label="序号" tree-node />
                <el-table-column prop="text" label="姓名" width="180" />
                <el-table-column prop="extend1" label="账号" width="100" />
                <el-table-column prop="extend2" label="部门" width="100" />
                <el-table-column prop="extend6" label="处理意见" width="180">
                  <template slot-scope="scope">
                    <div if="scope.cellValue!=undefined&&scope.cellValue!=null" v-html="scope.cellValue" />
                  </template>
                </el-table-column>
                <el-table-column prop="extend4" label="创建时间" width="140" />
                <el-table-column prop="extend5" label="完成时间" width="140" />
              </el-table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        // url参数
        wiid: '',
        aiid: '',
        type: '',
        // ======数据============
        treeTableData: [],
        data: {
          actors: '',
          actorsDes: ''
        }
      };
    }, computed: {
      countGridHeight() {
        return $(document).height() - global_datagridHeightDiff;
      },
      rotateIcon() {
        return this.isCollapsed ? 'fa fa-angle-double-right' : 'fa fa-angle-double-left';
      }
    },
    watch: {
      treeFilterText(val) {
        this.$refs.mytree.filter(val);
      }
    },
    created() {
      var that = this;
      var aiid = Object.toQueryString('aiid') || '';
      var wiid = Object.toQueryString('wiid') || '';
      var type = Object.toQueryString('type') || '';
      var parms = {};
      var parmsStr = Object.toQueryString('parms');
      var parms = {};
      if (parmsStr) {
        parmsStr = decodeURIComponent(parmsStr);
        parms = eval('(' + parmsStr + ')');
      }
      window.parms = parms;

      that.aiid = aiid;
      that.wiid = wiid;
      that.type = type;
      const currUser = FUI.Sys.getAuthor();

      // 加载页面Model数据
      var jsonData = Object.toAjaxJson('/workflow/workflowBusiness/', 'getTaskdisterJson', { aiid: that.aiid, type: that.type, wiid: that.wiid });
      that.treeTableData = jsonData;
    },
    mounted() {
    },

    methods: {
      selectorUserTextValue(inputKey, inputName, passParm, singleSelect, keyName, width, height) {
        var that = this;
        WF.SelectorDialog.selectorUserTextValue(that, inputKey, inputName, passParm, singleSelect, keyName, width, height);
      },
      sureSave() {
        var that = this;
        var method = 'taskdisterSender';
        switch (that.type) {
          case 'taskdister':
            method = 'taskdisterSender';
            break;
          case 'taskCommunication':
            method = 'sendToNextTaskCommunication';
            break;
          default:
            break;
        }
        if (type == 'taskCommunication' && that.treeTableData.length > 1) {
          FUI.Window.showMsg('已存在沟通用户');
          return;
        }
        var actors = that.data.actors;
        if (actors != '' && actors != '[]') {
          var result = Object.toAjaxJson(__webpath + '/workflow/workflowformSender/', method, {
            'taskId': taskId,
            'type': type,
            'actorJson': actors
          });
          if (result.success) {
            that.data.actors = '';
            that.data.actorsDes = '';
            FUI.Window.showMsg(result.msg, null, 1, function () {
              // 关闭后刷新父页面
              if (type == 'taskCommunication') {
                FUI.Window.closeEdit();
                parent.window.location.reload();
              }
            });
          } else {
            FUI.Window.showMsg(result.msg);
          }
        } else {
          FUI.Window.showMsg('请选择分发目标人员');
        }
      },
      getResult() {
        var that = this;
        return that.data;
      }
    }

  };

  window.getResult = function () {
    return myvm.getResult();
  }
</script>
<style lang="scss" scoped>
  @import "~@/resources/css/workflowform.css";
</style>