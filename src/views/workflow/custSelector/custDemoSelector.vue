<template>
  <div class="f2bpm-page-layout">
    <div style="font-size: 20px;margin: 20px;">
      内容由开发者自己决定，具体更丰富的救命可参考 selectOnlyUsers.vue
      <br> URL中a的参数值是:{{a}}
    </div>

  </div>
</template>

<script>
  export default {
    data() {
      return {
        a: '',
        dg: {},
        //varParams自定义变量参数
        windowparms: { resultFieldKey: '', isMulti: true, data: [], varParams: "", isSetHead: 0 },
        //选择结果
        resultGridData: [{ name: '结果项A', account: '值A' }, { name: '结果项B', account: '值B' }],
      };
    },
    computed: {
    },
    created() {
      var that = this;
      var a = Object.toQueryString("a");
      that.a = a;
      that.loadWindowparms();
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
      //加载传递过来的对象参数
      loadWindowparms() {
        const that = this;
        var parmsStr = Object.toQueryString('parms');
        var isSetHead = Object.toQueryString('isSetHead') || 0;
        that.windowparms.isSetHead = isSetHead;
        var parms = {};
        if (parmsStr) {
          parmsStr = decodeURIComponent(parmsStr);
          parms = eval('(' + parmsStr + ')');
          if (parms.singleSelect == true || parms.singleSelect == 'true') {
            that.windowparms.isMulti = false;
          }
          if (parms.varParams) {
            that.windowparms.varParams = parms.varParams;
          }
          if (parms.data != undefined && parms.data.length > 0) {
            that.windowparms.data = parms.data;
            that.resultGridData = parms.data;
          }
        }
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