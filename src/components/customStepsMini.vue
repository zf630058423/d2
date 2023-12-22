<template>
  <div>
    <div class="steps">
      <span :class="{'active':stepIndex=== Steps1}">营销立项</span>
      <span :class="{'active':stepIndex=== Steps2}">标前立项</span>
      <span :class="{'active':stepIndex=== Steps3}">标书制作</span>
      <span :class="{'active':stepIndex=== Steps4}">投标评审</span>
      <span :class="{'active':stepIndex=== Steps5}">开标结果</span>
      <span :class="{'active':stepIndex=== Steps6}">施工立项</span>
      <span :class="{'active':stepIndex=== Steps7}">收入合同</span>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'stepsMini',
    props: {
      stepDatas: {
        type: Object / Array,
        default: () => {
        }
      },
      watch: {
        yearData(v1, v2) {
          var that = this;
          console.log(v1, v2);
          setTimeout(() => {
            //这个是绘制图形的函数
            if (v1) {
              that.setDatas(v1)
            }
          }, 500)
        }
      },
    },
    data() {
      return {
        stepIndex: 1,
        Steps1: 1,
        Steps2: 0,
        Steps3: 0,
        Steps4: 0,
        Steps5: 0,
        Steps6: 0,
        Steps7: 0,
        setData: ['营销立项', '标前立项', '标书制作', '投标评审', '开标结果', '施工立项', '收入合同']
      }
    },
    methods: {
      setDatas(obj) {
        this.Steps1 = 1;
        this.Steps2 = obj.preBidReviewCount > 0 ? 1 : 0;
        this.Steps3 = obj.bidProductionApplyCount > 0 ? 1 : 0;
        this.Steps4 = obj.tenderDocumentReviewCount > 0 ? 1 : 0;
        this.Steps5 = obj.bidOpeningResultCount > 0 ? 1 : 0;
        this.Steps6 = obj.projectConstructionApprovalCount > 0 ? 1 : 0;
        this.Steps7 = obj.takeAndOtherContraCount > 0 ? 1 : 0;

      }
    }

  }
</script>

<style scoped>
  .steps {
    width: 100%;
    position: relative;
    height: 40px;
    /* margin-bottom: 30px;*/
    counter-reset: step; /*创建步骤数字计数器*/
  }

  /*步骤描述*/
  .steps span {
    list-style-type: none;
    font-size: 12px;
    text-align: center;
    width: 14%;
    position: relative;
    float: left;
    padding: 0 5px;
    /*border: 1px solid;*/
    z-index: 1;
  }

  /*步骤数字*/
  .steps span:before {
    display: block;
    font-family: element-icons;
    content: "\e6da";
    width: 20px;
    height: 20px;
    background-color: #909399;
    line-height: 20px;
    border-radius: 25px;
    font-size: 14px;
    color: #fff;
    text-align: center;
    font-weight: 500;
    margin: 0 auto 4px auto;
    z-index: 1;
  }

  /*连接线*/
  .steps span:after {
    content: "";
    width: 100%;
    height: 2px;
    background-color: #909399;
    position: absolute;
    left: 50%;
    top: 10px;
    z-index: -1; /*放置在数字后面*/
  }

  .steps span:last-child:after {
    background-color: #FFFFFF;
    height: 0;
  }

  /*将当前/完成步骤之前的数字及连接线变绿*/
  .steps span.active {
    color: #538EFF;
    /*background-color: #019875;*/
  }

  .steps span.active:before {
    font-family: element-icons;
    content: "\e6da";
    color: #FFFFFF;
    background-color: #538EFF;
    font-size: 16px;
  }

  .steps span.active:after {
    background-color: #538EFF;
  }

  /*将当前/完成步骤之后的数字及连接线变灰*/
  .steps span.active ~ span:before,
  .steps span.active ~ span:after {
    /*background-color: #333333;*/
  }
</style>
