<template>
  <div v-show="isShow">
    <el-button-group v-if="field.ctrType=='extend_tabtoolbar'" :field="field">
      <el-button v-for="child in field.children" size="small" :style="child.style" :type="child.btnType" @click="extendTabtoolbarClick(child)" :icon="child.icon">{{child.label}}</el-button>
    </el-button-group>
    <el-button :disabled="isReadOnly" v-else-if="field.ctrType=='extend_button'" :plain="field.btnStyle=='plain'" :round="field.btnStyle=='round'" :size="field.size" :type="field.btnType" :icon="field.icon.indexOf('fa')>-1?'fa '+field.icon:'icon '+field.icon" @click="extendButtonClidk(field)">
      {{field.label}}
    </el-button>
    <el-button :disabled="isReadOnly" :type="field.btntype" v-else-if="field.ctrType=='button'" :icon="field.icon.indexOf('fa')>-1?'fa '+field.icon:'icon '+field.icon" :size="field.size">
      {{field.label}} 
    </el-button>
  </div>
</template>

<script>
  export default {
    name: "f2bpm-button",
    props: ['field', 'fieldvalue','rowindex','colindex'],
    data: function () {
      return {
        isView: false,
        isShow: true,
        isReadOnly: false,
        value: ''
      };
    },
    created: function () {
      var that = this;
      that.value = that.fieldvalue;
      var formAction = WFContext.WorkflowformAction;
      that.isView = formAction > 2;
      if (that.isView) {
       
      }
      else if (that.field._isReadOnly == true) {
        that.isReadOnly = true;
      }
    }, mounted() {
      var that = this;
    },
    methods: {
      // 扩展事件
      extendTabtoolbarClick(childfield) {
        var that = this;
        var funcName = that.field.clickEventName;
        if (Object.toIsExitsFunction(funcName)) {
          window[funcName](childfield);
        }
      },
      extendButtonClidk(field) {
        var that = this;
        var funcName = field.clickEventName;
        if (Object.toIsExitsFunction(funcName)) {
          window[funcName](field);
        }
      }
    }
  }
</script>