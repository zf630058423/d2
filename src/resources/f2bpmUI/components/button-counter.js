import Vue from 'vue'
// 注册组件
var buttonCounter = Vue.component('button-counter', {
    props: ['postTitle'],
    data: function() {
        return {
            number: 0
        }
    },
    methods: {
         countClick() {
            this.number += 1
        }
    },
    template: '<el-col :xs="12" :sm="12"><el-button  @click="countClick" type="primary">{{postTitle}}{{number}}<slot></slot></el-button></el-col>'

})
