<template>
  <div class="f2bpm-page-dialog-layout">
    <div>
      <el-form ref="formRef" :rules="formRules" size="mini" :model="data" class="f2bpm-editform" label-width="120px">
        <el-form-item label="应用名称" prop="applicationName">
          <el-input v-model="data.applicationName" placeholder="应用名称" />
        </el-form-item>
        <el-form-item label="应用分组">
          <el-select v-model="data.applicationGroupKey">
            <el-option label="请选择" value="" />
            <el-option v-for="g in groupData" :label="g.groupTitle" :value="g.groupKey" />
          </el-select>
        </el-form-item>
        <el-form-item label="图标" prop="icon">
          <el-input v-model="data.icon" style="height: 30px; " class="textBoxShort" placeholder="图标" /> <i :class="data.icon" />
          <span class="cur font12" @click="selectAweIcon('icon')"><i class="fa fa-search" />选择 </span>
        </el-form-item>
        <el-row>
          <el-col :span="7">
            <el-form-item label="图标大小" prop="fontSize">
              <el-input-number v-model="data.fontSize" size="mini" :min="0" :max="200" label="文字大小" />
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="宽度">
              <el-input-number v-model="data.width" size="mini" :min="0" :max="200" label="宽度" />
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="高度">
              <el-input-number v-model="data.height" size="mini" :min="0" :max="200" label="高度" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="背景色" prop="color">
          <span class="font10 mr3"> 上边：</span>
          <el-color-picker v-model="data.color" />
          <span class="font10 ml3"> 下边：</span>
          <el-color-picker v-model="data.color2" />
          <span class="font10 mr3 ml3"> 预览效果：</span>
          <div class="application-item" :style="appBoxStyle">
            <span :style="'font-size:'+data.fontSize+'px;'" :class="data.icon" />
          </div>
          <div class="font10 mt4">
            快速选择：<span v-for="c in demoColorArr" :title="c.title" class="color-demo" :style="'background-image: linear-gradient('+c.c1+',' +c.c2+' 95%)'" @click="setColor(c)"> <span :class="data.icon" /></span>
            <div>图标背景色将从上(浅色)到下(深色)的渐变过程，建议选择两个相近的颜色。</div>
          </div>
        </el-form-item>
        <el-row>
          <el-col :span="8">
            <el-form-item label="排序" prop="orderNo">
              <el-input-number v-model="data.orderNo" size="small" :min="1" :max="100000" label="排序" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="是否启用">
              <el-switch v-model="data.isEnabled"   active-color="#13ce66" inactive-color="#DEDEDE" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="属性配置" />
          </el-col>
        </el-row>
        <el-form-item label="备注">
          <el-input v-model="data.remarks" type="textarea" :rows="2" placeholder="" />
        </el-form-item>
        <div class="dialogfooter">
          <el-button v-if="formAction!='View'" size="small" type="primary" @click="submitForm()"><i class="fa fa-save" />保存
          </el-button>
          <el-button id="btn_cancel" size="small" @click="closeEdit"><i class="fa fa-minus-circle" />取消
          </el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>

  export default {
    data() {
      return {
        formAction: null,
        demoColorArr: [
          { c1: '#76E299', c2: '#28BF7B', title: '青色' },
          { c1: '#D299F4', c2: '#9150BF', title: '紫色' },
          { c1: '#F3C94F', c2: '#E99927', title: '黄色' },
          { c1: '#78CEF7', c2: '#479DDB', title: '浅蓝' },
          { c1: '#FB8871', c2: '#F56440', title: '红色' },
          { c1: '#81D4CF', c2: '#0DB3A6', title: '青色2' }

        ],
        groupData: [],
         data: {
          fontSize: 26,
          width: 0,
          height: 0,
          applicationGroupKey: '',
          applicationName: '',
          icon: '',
          isEnabled: true,
          orderNo: '',
          color2: '',
          color: '',
          applicationOpts: '',
          remarks: '',
          creatorId: '',
          createdTime: '',
          tenantId: ''
        },
         formRules: {
          applicationName: [
            { required: true, message: '必填项不能为空' }
          ],
          fontSize: [
            { required: true, message: '必填项不能为空' }
          ],
          color: [
            { required: true, message: '必填项不能为空' }
          ],
          icon: [
            { required: true, message: '必填项不能为空' }
          ],
          orderNo: [
            { required: true, message: '必填项不能为空' }
          ]
        }
      }
    },
    computed: {
      appBoxStyle() {
        var that = this
        var style = 'background-image: linear-gradient(' + that.data.color + ',' + that.data.color2 + ' 95%);'
        if (that.data.width > 0) {
          style += 'width:' + that.data.width + 'px;'
        }
        if (that.data.height > 0) {
          style += 'height:' + that.data.height + 'px;'
        }
        return style
      }
    },
     created: function() {
      var that = this
      that.formAction = formAction
      if (formAction == FUI.FormAction.Add) {
        const currUser = that.$store.state.user.author
        that.data.creatorId = currUser.userId
        that.data.tenantId = currUser.tenantId
        that.data.createdTime = Object.toGetCurrentDateTimeString()
        that.data.orderNo = 1000
      }
      that.loadGroup()
      that.loadData()
    },
    methods: {
      closeEdit() {
        FUI.Window.closeEdit()
      },
       setColor(c) {
        var that = this
        that.data.color = c.c1
        that.data.color2 = c.c2
      },
       loadGroup() {
        var that = this
        var res = Object.toAjaxJson('/workflow/security/application/', 'getListAppLicationGroup')
        if (res.success) {
          that.groupData = res.data
        } else {
          FUI.Window.showMsg(res.msg)
        }
      },
       loadData() {
        var that = this
        if (formAction != FUI.FormAction.Add) {
          FUI.Form.bindDataToForm(that, '/workflow/security/application/', 'getApplicationModel', keyId, null, mainTable)
        }
      },
       submitForm() {
        var that = this
        var success = that.validateForm('formRef')
        if (!success) return
        FUI.Form.submitForm(that, that.data, '/workflow/security/application/', 'saveAppLication', formAction, keyId, parentGridId, mainTable)
      },
       validateForm(refFormName) {
        var success = false
        this.$refs[refFormName].validate(valid => {
          success = valid
        })
        return success
      },
       selectAweIcon(inputKey) {
        var that = this
        WF.SelectorDialog.selectAweIcon(that, inputKey, null, null, null, true)
      },
       colorSelect(vueObj) {
        var that = this
        WF.SelectorDialog.selectColor(that, 'color')
      },
       toPinYin(sourceField, targetField) {
        if (!this.data[targetField]) {
          const source = this.data[sourceField]
          this.data[targetField] = Object.toPinYin(source)
        }
      }
    }
  }
</script>
<style>
  .color-demo {
    cursor: pointer;
    display: inline-block;
    text-align: center;
    color: #FFFFFF;
    width: 36px;
    height: 36px;
    line-height: 36px;
    font-size: 18px;
    border-radius: 5px;
    margin-right: 5px;
    border: 0px solid #ffdadf;
  }
</style>
