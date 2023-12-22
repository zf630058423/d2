<template>
  <div id="searchNavbar0">
    <el-autocomplete
      size="small"
      class="inline-input"
      id="searchNavbar1"
      prefix-icon="el-icon-search"
      v-model="searchParams.appName"
      :fetch-suggestions="querySearch"
      placeholder="搜索菜单"
      :trigger-on-focus="false"
      @select="handleSelect"
      @input="searchClick"
      clearable
    ></el-autocomplete>
  </div>
</template>
<script>
import api from '@/Api/home/workSpace';

export default {
  name: 'searchNavbar',
  data () {
    return {
      // 设置搜索框的v-model
      searchParams: {
        categoryCode: '', //类别代码(无用)
        appId: '', //id(无用)
        appName: '' //表单名字
      },
      tableList: [], //表单的列表
      datas: []
    }
  },
  methods: {
    // 输入框输入事件
    searchClick () {
      //   console.log("进入输入框事件");
      //   写一个递归的方法提取进去  然后把递归后的数据传给数组  然后把alias改成value  列表  然后在handleSelect在路由上拼接添加
      this.getData()
    },
    // 获取输入框的初始数据
    getData () {
      var that = this;
      that.datas = localStorage.f2bpmMemus ? JSON.parse(localStorage.f2bpmMemus)[0].children : [];
      //   console.log(this.data, "本地菜单0000");
      if (
        that.searchParams.appName.trim() !== '' &&
        that.tableList.length == 0
      ) {
        that.treeData(this.datas)
        // console.log(this.tableList, 'tableList9999999999999999')
      }
    },
    // 递归方法-------------------------
    // arr为传入的数组
    treeData (arr) {
      return arr.filter(item => {
        // console.log(item, "item");
        // console.log(item.children, "item.children");
        // console.log(!item.children, "!item.children");
        if (!item.children) {
          let obj = {
            value: item.attributes.name,
            functionUrl: item.attributes.functionUrl
          }
          //   console.log(obj, "obj");
          this.tableList.push(obj)
          return false
        } else {
          this.treeData(item.children)
          return true
        }
      })
    },
    // --------------------输入框对应逻辑

    querySearch(queryString, cb) {
      const tableList = this.tableList
      console.log("tableList===:",tableList);
      // var results = queryString
      //   ? tableList.filter(that.createFilter(queryString))
      //   : tableList;
      let result = queryString ? tableList.filter(item => {
        return item.value.toLowerCase().indexOf(queryString.toLowerCase()) !== -1
      }) : tableList;
      // 调用 callback 返回建议列表的数据
      cb(result)
    },
    createFilter (queryString) {
      //   console.log(queryString, "queryString");
      return tableList1 => {
        return (
          tableList1.value.toLowerCase().indexOf(queryString.toLowerCase()) ===
          0
        )
      }
    },
    
   async handleSelect (item) {
      this.$store.dispatch('app/setCurrMenuId', {
        currMenuId: '',
        currMenuTitle: item.value,
        functionUrl: item.functionUrl
      })
      let codeIndex = item.functionUrl.indexOf('code');
      let len = 'code'.length + 1;
      let menuId = item.functionUrl.substr(codeIndex + len, item.functionUrl.length - 1);
      let params = { userId:'',menuName:item.value, menuId:menuId, menuUrl:item.functionUrl };
      await api.saveQuickMenuRecord(params);  //菜单点击计数
      this.$store.state.app.currState.currMenuId
      this.$router.push(item.functionUrl)
    }
    //------------ 替换新的键值方法-----------------
    // replaceObjectKey (arr, key, replaceKey) {
    //   let newArr = []
    //   arr.forEach((item, index) => {
    //     for (let i = 0; i < key.length; i++) {
    //       item[key] = item[replaceKey]
    //     }
    //     delete item[replaceKey]
    //     newArr.push(item)
    //   })
    //   return newArr
    // }

    //--------------------------------------------
  },
  created () {
    this.getData()
  },
  mounted () {}
}
</script>
<style lang="scss">
#searchNavbar0 {
  width: 100% !important ;
  // background-color: red;
  // #searchNavbar1 {
  //   // width: 100% !important ;
  // }
}
</style>
