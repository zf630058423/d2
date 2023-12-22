<template>
  <div class="f2bpm-404-container" v-if="isShow">
    <div class="pic-box">
      <div class="f2bpm-pic-404-01">
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
    name: 'f2bpmui404',
    components: {},
    props: {
      title: { type: String },
      img: { type: String , default: () => { return "f2bpm-pic-404-01"; }},
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