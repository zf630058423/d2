<template>
  <div class="fileTable">
    <div >
      <el-table :data="tableData_1" style="width: 100%;margin-bottom: 20px;" row-key="configValue" border default-expand-all :tree-props="{children: 'nodes', hasChildren: 'hasChildren'}" v-bind:header-cell-style="{background:'#f7f7f7',color:'#000000',fontWeight:'normal'}">
        <el-table-column type="index" width="50" label="序号">
        </el-table-column>
        <el-table-column label="菜单名称" >
        <template slot-scope="scope">
        <span >{{ scope.row.configName }}</span>
        </template>
        </el-table-column>
        <el-table-column label="文件信息">
          <template slot-scope="scope">
            <div v-if="scope.row.files.length > 0">
              <div v-for="(item,index) in scope.row.files" :key="index" class="fileBox">
                <div v-if="item.filePath !== '[]'">
                <span>{{JSON.parse(item.filePath)[0].fileName}} -- {{item.createTime | formatDates}}</span>
                <el-button size="small" type="text" @click="handelDownloadFile(item)">下载 <span class="el-icon-download"></span></el-button>
                </div>
                <div v-else>--</div>
              </div>
            </div>
            <div v-else>--</div>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
  export default {
    name: "fileTable",
    data() {
      return {
        loading: false,
        form: {
          projectId: null,
          projectNo: null,
          billType: '其他支出合同',
          contType: null,
          sort: 'CreateTime',
          pageIndex: 1,
          pageSize: 100
        },
        tableData_1:[],
      }
    },
    methods: {
      getData(obj){
        var that = this;
        var time;
        that.form.projectId = obj.projectId;
        // that.form.projectNo = obj.projectNo;
        clearTimeout(time);
        time = setTimeout(function(){
          that.getTableList()
        }, 500)
      },
      // 获取表单信息
      getTableList(){
        var that = this;
        that.loading = true;
        $.extendAjax(`/extend/projectAttachment/queryProjectAttachments?projectId=${that.form.projectId}`, '', "get", function (d) {
          if(d.code === 200){
            that.loading = false;
            that.tableData_1 = d.data;
          }
        });
      },
      // 文件下载
      handelDownloadFile(obj){
        var that = this;
        var arr = JSON.parse(obj.filePath)[0];
        // const data = {
        //   filePath: arr.filePathName,
        //   fileName: arr.fileName,
        //   groupName: arr.groupName
        // };
        var filePath = arr.filePathName;
        var groupName = arr.groupName;
        var fileName = arr.fileName;
        var actionUrl = FUI.Handlers.Common;
        var data = Object.toAjaxDownloadFile(actionUrl, 'downloadFile', { 'filePath': filePath, 'fileName': fileName, 'groupName': groupName })

        // $.extendAjax(`/api/workflow/security/baseCommon/downloadFile`, data, "get", function (d) {
        //   if(d.data){
        //     that.loading = false;
        //   }
        // });

      }

    }
  }
</script>

<style scoped>
</style>
