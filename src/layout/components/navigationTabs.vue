<template>
  <div class="tagsView" style="overflow: scroll; overflow-x: hidden">
    <el-tabs v-model="editableTabsValue" type="card" closable @tab-click="tabClick" @tab-remove="removeTab">
      <el-tab-pane v-for="(item, index) in $store.state.app.tagsView" :key="item.currMenuId?item.currMenuId:index" :label="item.currMenuTitle" :name="item.functionUrl" />
    </el-tabs>
    <el-button v-if="$store.state.app.tagsView.length !== 0" type="text" @click="delbtn" >清空</el-button>
  </div>
</template>
<script>
export default {
  data() {
    return {
      editableTabsValue: "",
      tabIndex: 2,
    };
  },
  created() {
  },
  watch:{
    '$store.state.app.currState.currMenUrl'(val,old){
      console.log( this.editableTabsValue,val,old);
      this.editableTabsValue=val;
      // if(this.editableTabsValue.indexOf('customDataGridViewSingle')!=-1){

      // }else{

      // }
    }
  },
  methods: {
    delbtn() {
      this.$store.state.app.tagsView = [];
    },
    addTab(targetName) {
      const newTabName = ++this.tabIndex + "";
      this.editableTabs.push({
        title: "New Tab",
        name: newTabName,
        content: "New Tab content",
      });
      this.editableTabsValue = newTabName;
    },
    tabClick(obj) {
      // 点击不同 标签会跳转到对应的路由
      const demandObj = this.$store.state.app.tagsView.filter((x) => x.currMenuTitle === obj.label);      
      if(demandObj && demandObj[0].functionUrl.indexOf('customDataGridViewSingle')!=-1){//新增 不带框架的纯内容列表页 通过点击tabs iframe打开
        console.log("demandObj:",demandObj);
        if(window.document.getElementById("page_iframe")){    
          this.$router.push({ path: '/workflow/security/application/applicationHome?applicationId='+demandObj[0].currMenuParentId, query:{refresh:true}});
          window.document.getElementById("page_iframe").src=demandObj[0].functionUrl;
        }else{
          let _url=window.location.href;
          if(_url && _url.indexOf("/applicationHome") ===-1){//url不为空 并且当前父页面不是工作台页面
            this.$router.push({ path: '/workflow/security/application/applicationHome?applicationId='+demandObj[0].currMenuParentId, query:{refresh:true}});
              setTimeout(() => {
                window.document.getElementById("page_iframe").src=demandObj[0].functionUrl;
            }, 600);
          }
          // else{
          //   console.log("当前：",demandObj[0]);
          //   this.$router.push({ path: '/workflow/security/application/applicationHome?applicationId='+demandObj[0].currMenuParentId});
          //     setTimeout(() => {
          //       window.document.getElementById("page_iframe").src=demandObj[0].functionUrl;
          //   }, 600);
          // }                  
          console.log("没有iframe：", window.location.href)         
        }       
      } else {
        this.$router.push({ path: demandObj[0].functionUrl, query:{refresh:false} });
      }
      this.$store.state.app.currState.currMenUrl=demandObj[0].functionUrl;
      this.$store.state.app.currState.currMenuId=demandObj[0].currMenuId;
      this.$store.state.app.currState.currMenuTitle=demandObj[0].currMenuTitle;      
      // 点击不同的标签左侧菜单栏联动显示
    },
    // 点击tabs中右边的×会删除独赢的tabs页面
    removeTab(url) {
      console.log("url:",url);     
      //关闭当前tabs 下标
      let lastI= 0;
      for(let i=0;i<this.$store.state.app.tagsView.length;i++){
        if(this.$store.state.app.tagsView[i].functionUrl===url){
          lastI=i;
        }
      }        

      this.$store.state.app.tagsView = this.$store.state.app.tagsView.filter( (x) => x.functionUrl !== url);
      if(this.$store.state.app.currState.currMenUrl===url){//关闭标tab 为当前tab
        let _tabs=this.$store.state.app.tagsView;
        if(_tabs && _tabs.length > 0){
          if(lastI > 0){//关闭 不带框架的纯内容列表页 通过点击tabs 关闭 iframe打开上一个页面
            lastI=lastI-1;
          }else{
            lastI=0;
          }
          if(_tabs[_tabs.length-1].functionUrl.indexOf('customDataGridViewSingle')!=-1){// 不带框架 iframe
            window.document.getElementById("page_iframe").src=_tabs[lastI].functionUrl;
          }else{
            this.$router.push({ path:_tabs[lastI].functionUrl });   
          }

          //更新当前tabs数据
          this.$store.state.app.currState.currMenUrl=_tabs[lastI].functionUrl;
          this.$store.state.app.currState.currMenuId=_tabs[lastI].currMenuId;
          this.$store.state.app.currState.currMenuTitle=_tabs[lastI].currMenuTitle;     
        }
      }
    },
    handleLeftClick() {
      console.log("点击了左侧箭头");
    },
    handleRightClick() {
      console.log("点击了左侧箭头");
    },

    // removeTab (targetName) {
    //   const tabs = this.editableTabs
    //   let activeName = this.editableTabsValue
    //   if (activeName === targetName) {
    //     tabs.forEach((tab, index) => {
    //       if (tab.name === targetName) {
    //         const nextTab = tabs[index + 1] || tabs[index - 1]
    //         if (nextTab) {
    //           activeName = nextTab.name
    //         }
    //       }
    //     })
    //   }

    //   this.editableTabsValue = activeName
    //   this.editableTabs = tabs.filter(tab => tab.name !== targetName)
    // }
  },
};
</script>

<style scoped lang="scss">
* {
  margin: 0;
  padding: 0;
}
.tagsView {
  display: flex;
  font-size: 14px;
  color: #2389ff;
  overflow: hidden;
  background-color: #fff;
  width: 100%;
  .el-tabs {
    // width: 85.5vw;    
    width: 96%;
    flex-shrink: 1;

  }
  ::v-deep .el-tabs__item {
    padding: 0 10px;
    text-indent: 0;
    height: 40px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    line-height:40px;
    display: inline-block;
    list-style: none;
    font-size: 14px;
    font-weight: 500;
    color: #303133;
    position: relative;
  }

  ::v-deep .el-tabs--card>.el-tabs__header .el-tabs__item.is-closable{
    color: #303133;
    padding:0 12px;
    text-indent: 0;
  }
  ::v-deep .el-tabs--card>.el-tabs__header .el-tabs__item.is-closable:hover{
   color: #2389ff;
   padding:0 12px;
   text-indent: 0;
  }

  span {
    line-height: 33px;
  }
  .el-button {
    // flex: 1;
    // width: 14.5vw;
    flex-shrink: 0;
    width: 60px;
  }
}

::v-deep .el-tabs--card > .el-tabs__header .el-tabs__nav {
  border: 1px solid #e4e7ed;
  border-bottom: none;
  border-radius: 4px 4px 0 0;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  border-top: none; //去掉导航栏上面边框
}
::v-deep .el-tabs--card>.el-tabs__header .el-tabs__item .el-icon-close{ width: 14px;}
</style>
