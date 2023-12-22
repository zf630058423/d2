<template>
  <div class="f2bpm-page-layout">
    <div style="font-size: 20px;margin: 20px;">
      自定义选择器参与者开发示例：<br><br>
      内容由开发者自己决定，具体更丰富的救命可参考 selectUsers.vue<br>
      <br> URL中a的参数值是:{{a}}，节点名称是：{{activityName}}<br><br>可通过Url参数把表单字段参数值传进来
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        isSingle: 0,
        activityCode: "",
        activityName: "",
        a: '',
        dg: {},
        //点击确定返回的结果人员数据
        resultGridData: [
          {
            realName: "系统管理员",
            account: "admin",
            userId: "3c1df0b3-a4d9-4731-b143-02e81bce17ce",
            orgId: "bpmRoot",
            orgName: "F2BPM",
            mobile: "",
            email: "",
            tenantId: "BPM"
          }]
      };
    },
    computed: {
    },
    created() {
      var that = this;
      //如有需要通过此方法可以将表单字段值传进来
      var a = Object.toQueryString("a");
      var isSingle = Object.toQueryString("isSingle");
      var activityCode = Object.toQueryString("activityCode");
      var activityName = Object.toQueryString("activityName");
      that.a = a;
      that.isSingle = isSingle;
      that.activityCode = activityCode;
      that.activityName = activityName;
    },
    mounted() {
      window.myvm = this;
    },
    methods: {
      collapsedSider() {
        this.isCollapsed = !this.isCollapsed;
      },
      clearAll() {
        this.resultGridData = [];
      },
      getResult() {
        return this.resultGridData;
      }
    }

  };
  window.getResult = function () {
    //不想返回时，可直接 返回return false, 则窗口不会关闭
    return myvm.getResult();
  }
</script>