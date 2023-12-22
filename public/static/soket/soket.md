# 单纯的websocket其实很简单，但是我们在项目中有可能需要显示很多种类的实时数据，这时我们需要一个可以管理websocket的工具。

# websocket.js管理类

# vue组件中使用
  import websocketFeature from "@/utils/websocket";
  data() {
    return {
      myWebsocketKey: '',
      myWebsocketKey2: ''
    }
  }

  mounted() {
    this.myWebsocketKey = websocketFeature.create(
      undefined,
      this.websocketMessageHandler.bind(this)
    );
    this.myWebsocketKey2 = websocketFeature.create(
      "ws://localhost:8083/",
      this.websocketMessageHandler2.bind(this)
    );
  },
  destroyed() {
    websocketFeature.remove(this.myWebsocketKey);
    websocketFeature.remove(this.myWebsocketKey2);
  },
  methods: {
    websocketMessageHandler(e) {
      console.log(e.data);
    },
    websocketMessageHandler2(e) {
      console.log(e.data);
    },
  },