<template>
  <div class="">
    localStorage
  </div>
</template>

<script>
  export default {
    data() {
    },
    created() {
      var that = this
      // 在这个iframe所加载的HTML中绑定一个事件监听器，当事件被触发时，把接收到的token数据写入localStorage
      window.addEventListener('message', function(event) {
        console.info('触发写入')
        localStorage.setItem('f2bpmSSOAuthor', event.data)
      }, false)
    },
    methods: {
    }
  }
</script>
