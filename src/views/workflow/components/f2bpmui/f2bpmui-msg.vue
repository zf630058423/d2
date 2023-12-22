<template>
  <div class="f2bpm-404-container" v-if="isShow">
    <div class="pic-box">
      <div :class="imgClass">
      </div>
    </div>
    <div class="message-box">
      <div class="message-title" v-html="title"> </div>
      <div class="message-content" v-html="content"></div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'f2bpmuiMsg',
    components: {},
    props: {
      title: { type: String },
      imgClass: { type: String, default: () => { return "f2bpm-pic-msg-msg"; } },
      content: { type: String },
      isShow: {
        type: Boolean, default: () => { return false; }
      }
    }
    , data: function () {
      return {
        value: ''
      };
    },
    created: function () {
      var that = this;
    },
    methods: {
    }
  }
</script>