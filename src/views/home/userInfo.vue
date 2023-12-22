<template>
  <div class="app-container">
    用户信息
    <el-divider />
    <div class="clearfix margin-top" data-spm-anchor-id="5176.2020520207.0.i0.22804c12rUvDVP">
      <div class="avatar pull-left" style="height: 200px;">
        <p>
          <img width="80" height="80" :src="userImg">
        </p>
        <p class="avatar-txt-margin">
          <!-- <a >修改头像</a> -->
        </p>
      </div>
      <div class="summary" style="border-radius: 10px; margin-left: 70px;">
        <p>
          <span class="userinfo-account-common-left">登录账号：</span>
          <span class="userinfo-account-common-right" v-html="userInfo.account" />
        </p>
        <p class="">
          <span class="userinfo-account-common-left">登录组织：</span>
          <span class="userinfo-account-common-right" v-html="userInfo.orgName" />
        </p>
        <p class="">
          <span class="userinfo-account-common-left">组织：</span>
          <span class="userinfo-account-common-right" v-html="userInfo.orgNames" />
        </p>
        <p class="">
          <span class="userinfo-account-common-left">状态：</span>
          {{ userInfo.status == 1 ? "正常" : "禁用" }}
        </p>
        <p class="">
          <span class="userinfo-account-common-left">姓名：</span>
          <span class="userinfo-account-common-right" v-html="userInfo.realName" />
        </p>
        <p class="">
          <span class="userinfo-account-common-left">性别：</span>
          <span class="userinfo-account-common-right" v-html="userInfo.sex" />
        </p>
        <p class="">
          <span class="userinfo-account-common-left">手机：</span>
          <span class="userinfo-account-common-right" v-html="userInfo.mobile" />
        </p>
        <p class="">
          <span class="userinfo-account-common-left">邮箱：</span>
          <span class="userinfo-account-common-right" v-html="userInfo.email" />
        </p>
      </div>
    </div>

    <el-divider />

    <el-divider />

  </div>
</template>

<script>

  export default {
    filters: {
      statusFilter(status) {
        const statusMap = {
          published: 'success',
          draft: 'gray',
          deleted: 'danger'
        };
        return statusMap[status];
      }
    },
    data() {
      return {
        userInfo: {
          orgName: '',
          orgNames: '',
          realName: '',
          userName: '',
          email: '',
          endTime: '',
          beginTime: '',
          mobile: '',
          status: '',
          sex: ''
        }
      };
    },
    created() {
      var that = this;
      this.loadUserInfo();
      that.userImg = require('@/resources/images/' + that.$store.state.user.avatar);
    },
    methods: {

      loadUserInfo() {
        const that = this;
        var userId = that.$store.state.user.userId;
        var orgName = decodeURI(that.$store.state.user.author.orgName);
        Object.toAjaxJson(FUI.Handlers.OrgImplController, 'getUserInfo', { 'userId': userId },
          true,
          null,
          function(res) {
            var data = {};
            if (res.success) {
              data = res.data;
            }
            that.userInfo = data;
            that.userInfo.orgName = orgName;
            that.userInfo.orgNames = that.userInfo.orgNameList.toString();
            if (that.userInfo.sex == '2') {
              that.userInfo.sex = '女';
            } else if (that.userInfo.sex == '1') {
              that.userInfo.sex = '男';
            } else if (that.userInfo.sex == -'0') {
              that.userInfo.sex = '未填写';
            }
            that.$store.dispatch('user/setUserInfo', that.userInfo)
          }
        );
      },
      fetchData() {
        this.listLoading = true;
        getList().then((response) => {
          this.list = response.data.items;
          this.listLoading = false;
        });
      }
    }
  }
</script>
<style>
  .summary {
    line-height: 30px;
    padding-left: 20px;
  }

  .avatar-txt-margin {
    text-align: center;
  }

  .userinfo-account-common-left {
    display: inline-block;
    font-size: 14px;
    font-family: PingFang SC;
    font-weight: 500;
    color: #666666;
  }

  .userinfo-account-common-right {
    display: inline-block;
    color: #000000;
    font-size: 14px;
    letter-spacing: .31px;
  }
</style>
