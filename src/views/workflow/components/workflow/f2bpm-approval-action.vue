<template>
  <div v-if="isShow" id="workflowFormApprovalActionDiv" class="wf-box" >
    <div class="wf-pop-tit"  >
      <span class="sectionPrefixBlueBar"></span><span class="fb ml15">审核菜单 <em>*</em></span>
    </div>
    <div class="wf-pop-in " style="height:50px;line-height: 30px; padding-left: 20px;">
      <el-radio-group v-model="value" @change="radioClick">
        <el-radio v-for="(item, index) in approData" :key="item.approAction" :label="item.approName">{{ item.approName }}</el-radio>
      </el-radio-group>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'F2bpmApprovalAction',
    props: {
      // [{approAction:"同意",approName:"同意",orderNo:100 },{ approAction:"反对",   approName: "反对",orderNo:101 }]
      approData: {
        required: true
      }
    },
    data() {
      return {
        isShow: true,
        value: '',
        formAction: null
      }
    },
    computed: {

    },
     created: function() {
      var that = this
      if (that.approData && that.approData.length > 0) {
        that.isShow = true
      } else {
        that.isShow = false
      }
    },
    mounted() {
      var that = this
    },
    methods: {
      radioClick(value) {
            var that = this
            this.$emit('updateapproalaction', value)
        }
    }
  }
</script>
