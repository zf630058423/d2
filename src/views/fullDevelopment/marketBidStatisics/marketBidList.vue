<template>
  <div class="f2bpm-page-layout">
    <el-container>
      <el-main class="f2bpm-page-right">
        <div class="search-box">
          <MarketForm @search="searchFn" @exportExcel="exportExcel"></MarketForm>
        </div>
        <f2bpm-datagrid 
          :loading="loading"
          ref="grid"
          grid="grid"
          :pager-config="tablePage"
          :data="tableData"
          :columns="tableColumn"
          @page-change="pageChange" />
      </el-main>
    </el-container>
  </div>
</template>
<script>
import { marketBidCoumn } from './marketBidColumn.js';
import MarketForm from './components/MarketForm.vue';
import { getData } from '@/Api/marketBid.js';

export default {
  components: {MarketForm},
  data() { 
    return {
      tablePage: {
        align: "center",
        currentPage: 1,
        layout: "total, sizes, prev, pager, next, jumper",
        order: "",
        pageCount: 10,
        total:50,
        pageSize: 20,
        pageSizes:[10,15,20,25,50,100,200,500]
      },
      // 列表数据源
      tableData: [],
      tableColumn: [], // 表头字段配置
      pageData: {
        currentPage: 1,
        pageSize: 20,
        isPaging: 1,
      },
      formData: {},
      loading:false
    }
  },
  mounted() { 
    // window.myvm指向当前页面vue实例
    window.myvm = this;
    // 自适应计算高度
    window.autoPageHeight();
  },
  created() { 
    this.tableColumn = marketBidCoumn;
    this.getDataList();
  },
  methods: {
    async searchFn(obj) {
      this.pageData.currentPage = 1;
      this.pageData.pageSize = 20;
      this.formData = obj;
      this.getDataList();
    },
    async getDataList() { 
      let dataParams = {
        ...this.pageData,
        ...this.formData
      }
        try {
          this.loading = true;
          let { data } = await getData(dataParams);
          this.loading = false;
          this.tableData = data.marketingBidStatisticVOList;
          this.tablePage.currentPage = data.currentPage;
          this.tablePage.total = data.total;
          this.tablePage.pageCount = data.pageTotal;
          this.dataShowJson = data.dataShowJson ? JSON.parse(data.dataShowJson) : "";
          this.filterColumns(this.dataShowJson);
        } catch (error) {
          this.loading = false;
        }
    },
    filterColumns(dataShowJson) { 
      let dataShowArray = [];
          if (dataShowJson) { 
            for (let i in dataShowJson) { 
              if (dataShowJson[i]) { 
                dataShowArray.push(i);
              }
              this.tableColumn = marketBidCoumn.filter(item => dataShowArray.includes(item.field));
            }
          }
    },
    exportExcel(param) { 
      let titles = marketBidCoumn.map(item => ({
        title: item.title,
        field: item.field
      }))
      let paramData = {
          // selectParam:JSON.stringify(param),
          selectParam:param,
          showTitle:titles,
     }
     this.loading = true;
     Object.toAjaxDownloadFile('/public/export/marketingStatistic', "", JSON.stringify(paramData), true,null,null,true);
     this.loading = false;
    },
    pageChange(e) {
      this.pageData.currentPage = e.currentPage;
      this.pageData.pageSize = e.pageSize;
      this.getDataList();
     },
  }
}
</script>
<style scoped lang="scss">
.f2bpm-page-layout{
  .search-box{
    padding:10px 10px 0;margin: 0 20px
  }
}

::v-deep .el-form-item{
  margin-bottom:2px;
}

::v-deep .fold-label .el-form-item__label {
        white-space: pre-line;
        text-align: right;
        margin-top: 4px;
        line-height: 16px !important;/*设置行高为label高度的一半（有n行就是label高度的1/n）*/
        text-justify: distribute-all-lines;

    }

::v-deep .default-label .el-form-item__label{
  text-align: right;
  text-justify: distribute-all-lines;
}
</style>