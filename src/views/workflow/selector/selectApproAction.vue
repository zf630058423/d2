<template>
  <div class="f2bpm-page-layout">
    <div>
      <div class="fence-box" style="width: 220px;">
        <div class="fence-box-title">
          <i class="fa fa-table" aria-hidden="true" />审核菜单（单击选择）：
        </div>
        <ul id="list">
          <li v-for="item in leftData" class="fence-li-item textClass" :approAction="item.approAction" :approName="item.approName" @click="leftSelected(item.approAction)">
            {{ item.approName }}
          </li>
        </ul>
      </div>
      <div class="fence-box right-result-boxlist" style="width: 180px;">
        <div class="fence-box-title">
          <i class="fa fa-folder" aria-hidden="true" />已选菜单（单击删除）：
        </div>
        <ul id="listResult">
          <li v-for="item in rightData" class="fence-li-item textClass" :approAction="item.approAction" :approName="item.approName" @click="rightSelected(item.approAction)">
            {{ item.approName }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        singleSelect: true,
        loading: false,
        // text,value的数据格式
        initailData: null,
        leftData: [],
        rightData: []
      };
    },
    computed: {

    },
    created() {
      var that = this;
      var wid = Object.toQueryString('wid') || '';
      var appId = Object.toQueryString('appId') || '';
      //为空时获取所有节点的审核菜单
      var activityId=Object.toQueryString('activityId') || '';
      var res = Object.toAjaxJson('/workflow/selector/', 'getApproActionJson', { appId: appId, wid: wid, activityId: activityId });
      if (res.success) {
        that.leftData = res.data;
      } else {
        FUI.Window.showMsg(that, res.msg);
      }
      var parmsStr = Object.toQueryString('parms');
      var parms = {};
      if (parmsStr) {
        parmsStr = decodeURIComponent(parmsStr);
        parms = eval('(' + parmsStr + ')');
      }
      var singleSelect = parms.singleSelect == undefined ? true : parms.singleSelect;
      that.singleSelect = singleSelect;
      var initailData = parms.data || [];
      if (initailData) {
        that.initailData = initailData;
        that.initail();
      }
    },
    mounted() {
      window.myvm = this;
    },
    methods: {
      initail() {
        var that = this;
        var left = [];
        var right = [];
        if (that.initailData == null || that.initailData.length == 0) {
          return false;
        }
        $.each(that.leftData, function (i, item) {
          var theItem = null;
          $.each(that.initailData, function (i, it) {
            var code = it.value;
            if (code == item.approAction) {
              right.push(item);
              theItem = item;
            }
          });
          if (theItem == null) {
            left.push(item);
          }
        });
        that.leftData = left;
        that.rightData = right;
      },
      leftSelected(approAction) {
        var that = this;
        var left = [];
        var theItem = null;
        $.each(that.leftData, function (i, item) {
          if (item.approAction != approAction) {
            left.push(item);
          } else {
            theItem = item;
          }
        });
        that.leftData = left;
        if (theItem) {
          that.rightData.push(theItem);
        }
      },
      rightSelected(approAction) {
        var that = this;
        var right = [];
        var theItem = null;
        $.each(that.rightData, function (i, item) {
          if (item.approAction != approAction) {
            right.push(item);
          } else {
            theItem = item;
          }
        });
        that.rightData = right;

        if (theItem) {
          if (that.singleSelect) {
            that.leftData = [];
          }
          that.leftData.push(theItem);
        }
      },
      getResult() {
        var that = this;
        var data = [];
        $.each(that.rightData, function (index, item) {
          var approAction = item.approAction;
          var approName = item.approName;
          data.push({
            value: approAction,
            text: approName
          });
        });
        if (that.singleSelect && data.length > 1) {
          FUI.Window.showMsg('只能选择一个审核菜单');
          return false;
        }
        return data;
      }
    }
  };

  window.getResult = function () {
    return myvm.getResult();
  }
</script>
<style scoped>
  .textClass{
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
</style>
