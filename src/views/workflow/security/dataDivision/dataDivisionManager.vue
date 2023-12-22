<template>
  <div class="f2bpm-page-dialog-layout">
    <el-button size="small" type="primary" @click="divisionTableCreate()"><i class="fa fa-table" />创建切割表
    </el-button>
    <el-button size="small" type="primary" @click="dataDivisionList()"><i class="fa fa-cogs" />切割方案管理
    </el-button>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        loading: false,
        formAction: null,
        isReadOnly: false,
        treeData: [],
        data: {
        },
        formRules: {

        }
      };
    },
    mounted() {
      var that = this;
      window.myvm = that;
    },
    created: function () {
      var that = this;
      that.formAction = formAction;
      that.isReadOnly = formAction == FUI.FormAction.View;
      if (formAction == FUI.FormAction.Add) {
        const currUser = FUI.Sys.getAuthor();
      }
    },
    methods: {
      closeEdit() {
        FUI.Window.closeEdit();
      }
      , dataDivisionList() {
        window.location.href = __webpath + "/workflow/dataDivision/dataDivisionList";
      }
      
    }
  }
</script>