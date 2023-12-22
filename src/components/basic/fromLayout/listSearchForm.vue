<template>
  <div class="list-search-form">
    <el-popover
      placement="top-start"
      trigger="hover"
      content="显示/隐藏更多搜索条件">
      <i slot="reference" class="search-icon-hide el-icon-s-fold popover__reference"  @click="handelIsOpen"></i>
    </el-popover>
    <div class="search-form">
      <slot name="form"></slot>
    </div>
    <div class="search-btns">
      <div class="search-btns_buttons">
         <el-button size="small" class="el-btn fa fa-search" type="primary" @click="searchForm">查询</el-button>
         <el-button size="small" class="el-btn fa fa-undo" @click="resetForm">重置</el-button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'listSearchForm',
  data() {
    return {
      
    }
  },
  methods: {
    handelIsOpen() { 
      this.$emit('handelIsOpen');
    },
    searchForm() {
      this.$emit("search");
    },
    resetForm() { 
      this.$emit("reset");
    }
  }
}
</script>

<style lang="scss" scoped>
.list-search-form{
  width: 100%;
  display: flex;
  // justify-content: space-between;
  justify-content: flex-start;
  border-bottom: 1px solid #f3f3f3;
  margin: 8px 0 10px 0;
  position: relative;

  .search-icon-hide.el-icon-s-fold {
    padding: 3px;
    position: absolute;
    left: 0px;
    top: -2px;
    font-size: 20px;
    color: #006eff;
    border-radius: 20%;
    cursor: pointer;
    z-index: 1000;
    width: 20px;
    height: 21px;
}

  .search-form{
    width: calc(100% - 160px);
  }

  .search-btns{
    width: 156px;
    position: relative;

    &_buttons{
      position: absolute;
      top: 5px;

      .el-btn:before{
        margin-right: 2px;
      }
    }
  }
}
</style>