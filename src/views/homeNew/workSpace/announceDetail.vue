<template>
  <div class="announceDetailClass" style="background: #fff;">
    <div ref="mainDiv" :style="{height:clientHeight+'px'}"  v-if="detailObj">
      <el-col :style="{minHeight:clientHeight+'px'}" class="announcement-info-content" v-loading.fullscreen.lock="fullscreenLoading">
        <div class="announce-title" ref="announceTitle">{{detailObj.title}}</div>
        <div class="announce-info" ref="announceInfo" v-if="detailObj.createTime">
          <span>{{detailObj.createTime | formatDates}}</span>
          <span>信息编号：--</span>
          <span style="color: #ed4014">阅读 {{getTotal}} 次</span>
          <span>信息类型：</span>
          <span>部门：{{detailObj.createDept}}</span>
        </div>
        <div class="announce-content" :style="{height:contentHeight+'px'}" v-if="detailObj.informationContent">
          <div v-html="detailObj.informationContent"></div>
        </div>

      </el-col>
    </div>


  </div>
</template>

<script>

  export default {
    name: "workSpaceAnnounceDetail",
    data() {
      return {
        detailObj: {
          createTime: null
        },
        getTotal: 0,
        clientHeight: 0,
        heightStyle: {},
        fullscreenLoading: false,
        contentHeight: 600
      }
    },
    filters: {
      formatDate: function (value) {
        var date = new Date(value);
        var Y = date.getFullYear() + '-';
        var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
        var D = date.getDate() + ' ';
        var h = date.getHours() + ':';
        var m = date.getMinutes() + ':';
        var s = date.getSeconds();
        return Y + M + D + h + m + s;
        // return Y + M + D + h + m;
      },
      formatDates(datetime) {
        let date = new Date(datetime) //datetime时间戳为13位毫秒级别,如为10位需乘1000
        let month = ('0' + (date.getMonth() + 1)).slice(-2);	// getMonth是从1-11,所以需要加1
        let sdate = ('0' + date.getDate()).slice(-2);	// -2表示从倒数第二个元素开始截取
        let h = ('0' + date.getHours()).slice(-2) ;
        let m = ('0' + date.getMinutes()).slice(-2);
        let s = ('0' + date.getSeconds()).slice(-2) ;
        let thatDate = date.getFullYear() + '-' + month + '-' + sdate + ' '+h+':'+m+':'+s
        return thatDate
      }
  },
    mounted() {
      this.getDivHeight();
      window.addEventListener('resize', this.getDivHeight)
    },
    destroyed() {
      window.removeEventListener('resize', this.getDivHeight, false)
    },
    methods: {
      // 获取公告详情
      getAnnounceInfo(obj) {
        let id = obj.myId;
        let isOk = false;
        let that = this;
        that.openFullScreen1();
        $.extendAjax(`/noticeapply/queryNoticeapplysId?myId=${id}`, '', "get", function (res) {
          if (res.code === 200) {
            that.getAnnounceHeight();
            that.detailObj = res.data;
            return !isOk
          } else {
            that.$message.error(res.msg);
            return isOk
          }
        });
        that.$nextTick(function () {
          that.getAddApplyinformation(id)
        })
      },
      // 增加访问量
      getAddApplyinformation(id) {
        let isOk = false;
        let that = this;
        $.extendAjax(`/noticeapply/addNoticeapplyinformation?myParentId=${id}`, '', "post", function (res) {
          if (res.code === 200) {
            that.getApplyinformation(id);
            return !isOk
          } else {
            return isOk
          }
        });
      },
      // 获取访问量
      getApplyinformation(id) {
        let isOk = false;
        let that = this;
        const data = {
          "myParentId": id,
          "sort": "",
          "pageSize": "10000",
          "pageIndex": "10000"
        };
        $.extendAjax(`/noticeapply/queryPageNoticeapplyinformation`, JSON.stringify(data), "post", function (res) {
          if (res.code === 200) {
            that.getTotal = res.total;
            return !isOk
          } else {
            return isOk
          }
        });
      },
      // 获取页面高度
      getDivHeight() {
        this.clientHeight = document.documentElement.clientHeight;
        this.getAnnounceHeight();
      },
      getAnnounceHeight() { 
        this.$nextTick(() => { 
          if (this.$refs.announceTitle && this.$refs.announceInfo) { 
            let titleHeight = this.$refs.announceTitle.offsetHeight;
            let infoHeight = this.$refs.announceInfo.offsetHeight;
            this.contentHeight = this.clientHeight - titleHeight - infoHeight - 100;
          }
        })
      },
      getNowTime(){
        var date = new Date();
        var Y = date.getFullYear() + '-';
        var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
        var D = date.getDate() + ' ';
        var h = date.getHours() + ':';
        var m = date.getMinutes() + ':';
        var s = date.getSeconds();
        return Y + M + D + h + m + s;
      },
      // 加载状态
      openFullScreen1() {
        this.fullscreenLoading = true;
        setTimeout(() => {
          this.fullscreenLoading = false;
        }, 1000);
      },
      //清空
      clearInfo(){
        this.detailObj = {};
      }
    }
  }
</script>

<style scoped>
  .announcement-info-content {
    min-height: 370px;
    background: #FFFFFF;
    border: 1px solid #F3F8FF;
    border-top: 0;
    overflow: hidden;
  }
  .announce-title{
    font-weight: bold;
    font-size: 30px;
    text-align: center;
    padding: 15px 0;
    border-bottom: 1px solid #EEEEEE;
    color: #0D1126;
    font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
  }
  .announce-info{
    text-align: center;
    padding: 10px;
  }
  .announce-info span{
    margin: 0 5px;
  }
  .announce-content{
    padding: 10px;
    margin-top: 40px;
    overflow: auto;
  }
  .announce-content img{
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
</style>
