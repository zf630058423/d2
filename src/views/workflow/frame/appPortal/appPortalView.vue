<template>
  <div class="">
    <div id=" ">
      <!--详细信息-->
      <div id="WorkflowContentDiv" class="auto-window-height-content" style="overflow-y: auto;overflow-x:hidden ;clear: both;">
        <div id="formDetail" class="wf-box  ">
          <div class="FormViewContainer online-workflowform">
            <el-form ref="formRef" :rules="formRules" :model="data" class="f2bpm-workform" label-width="120px">
              <div v-for="(row, row_index) in fields" :id="row.id" :ordernum="row.orderNum" class="drag-row drag-box">
                <div class="view">
                  <div v-show="row.showLabel" class="form-section-title">{{ row.label }} </div>
                  <el-row class="row-fluid clearfix" :style="row.style" :gutter="row.gutter">
                    <el-col v-for="(col, col_index) in row.children" :id="col.id" :key="col_index" :rowid="row.id" :style="col.style" class="column" :span="col.span">
                      <div v-for="(field, field_index) in col.children" :id="field.id" :key="field_index" :fieldId="field.fieldId" :orderNum="field.orderNum" :ctrType="field.ctrType" class="online-form-item component">
                        <el-form-item :label-width="field.labelWidth">
                          <span v-show="field.showLabel&&field.ctrType!='hidden'" slot="label" :style="field.style">
                            <span v-html="field.label" />
                            <span v-if="field.helperArticle!=''&&field.helperArticle!=undefined" class="fa fa-question-circle-o" title="点击查看说明" @click="openHelperArticle(field.helperArticle)" />
                            <em v-if="field.isRequired" class="red">*</em>{{ field.labelSuffix }}
                          </span>
                          <f2bpm-portal-formitem v-if="field.ctrType!='extend_tabs'&&field.ctrType!='extend_container'" :parentdata="data" :field="field" :fieldvalue="data[field.vModel]" @updatevalue="updateFieldValue" @appendfieldvalue="appendFieldValue" />
                          <el-tabs v-else-if="field.ctrType=='extend_tabs'" :value="field.tabSelected" :tab-position="field.tabPosition" :type="field.tabType" @tab-click="tabsClick">
                            <el-tab-pane
                              v-for="tab in field.children"
                              :label="tab.label"
                              class="container"
                              :rowid="row.id"
                              :colid="col.id"
                              :ordernum="tab.orderNum"
                              :container_id="field.id"
                              :subcontainer_id="tab.id"
                              :tabsid="field.id"
:tabid="tab.id"
                              :name="tab.label"
                            >
                              <div v-for="_row in tab.children" :id="_row.id" :key="_row.orderNum" :parent_rowid="row.id" :parent_colid="col.id" :container_id="field.id" :subcontainer_id="tab.id" :ordernum="_row.orderNum" class="drag-row drag-box">
                                <div class="view">
                                  <div v-show="_row.showLabel" class="form-section-title">{{ _row.label }}</div>
                                  <el-row class="row-fluid clearfix" :style="_row.style" :gutter="_row.gutter">
                                    <el-col
                                      :id="_col.id"
                                      v-for="(_col, _col_index) in _row.children"
                                      :parent_rowid="row.id"
                                      :parent_colid="col.id"
:key="_col_index" :container_id="field.id" :subcontainer_id="tab.id" :rowid="_row.id" :style="_col.style" class="column container_column"
                                      :span="_col.span"
                                    >
                                      <div
                                        :id="_field.id"
                                        class="online-form-item component"
                                        :fieldId="_field.fieldId"
                                        :parent_rowid="row.id"
                                        :parent_colid="col.id"
                                        v-for="(_field, _field_index) in _col.children"
                                        :container_id="field.id"
                                        :subcontainer_id="tab.id"
:key="_field_index" :colId="_col.id"
                                        :rowId="_row.id"
                                        :vmodel="_field.vModel"
                                        :orderNum="_field.orderNum"
                                        :ctrType="_field.ctrType"
                                      >
                                        <el-form-item :label-width="_field.labelWidth?_field.labelWidth:'90px'">
                                          <span v-show="_field.showLabel" slot="label" :style="_field.style">

                                            <span v-html="_field.label" />
                                            <span v-if="_field.helperArticle!=''&&_field.helperArticle!=undefined" class="fa fa-question-circle-o" title="点击查看说明" @click="openHelperArticle(_field.helperArticle)" />
                                            <em v-if="_field.isRequired" class="red">*</em>{{ _field.labelSuffix }}
                                          </span>
                                          <f2bpm-portal-formitem v-if="_field.ctrType!='extend_tabs'&&_field.ctrType!='extend_container'" :parentdata="data" :field="_field" :fieldvalue="data[_field.vModel]" @updatevalue="updateFieldValue" @appendfieldvalue="appendFieldValue" />
                                        </el-form-item>
                                      </div>
                                    </el-col>
                                  </el-row>
                                </div>
                              </div>
                            </el-tab-pane>
                          </el-tabs>
                          <el-container v-else-if="field.ctrType=='extend_container'">
                            <div v-for="tab in field.children" :class="'f2bpm-'+tab.tag+' container'" :rowid="row.id" :colid="col.id" :ordernum="tab.orderNum" :container_id="field.id" :subcontainer_id="tab.id" :style="tab.style">
                              <div v-for="_row in tab.children" :id="_row.id" :key="_row.orderNum" :parent_rowid="row.id" :parent_colid="col.id" :container_id="field.id" :subcontainer_id="tab.id" :ordernum="_row.orderNum" class="drag-row drag-box">
                                <div class="view">
                                  <div v-show="_row.showLabel" class="form-section-title">{{ _row.label }}</div>
                                  <el-row class="row-fluid clearfix" :style="_row.style" :gutter="_row.gutter">
                                    <el-col
                                      :id="_col.id"
                                      v-for="(_col, _col_index) in _row.children"
                                      :parent_rowid="row.id"
                                      :parent_colid="col.id"
:key="_col_index" :container_id="field.id" :subcontainer_id="tab.id" :rowid="_row.id" :style="_col.style" class="column container_column"
                                      :span="_col.span"
                                    >
                                      <div
                                        :id="_field.id"
                                        class="online-form-item component"
                                        :fieldId="_field.fieldId"
                                        :parent_rowid="row.id"
                                        :parent_colid="col.id"
                                        v-for="(_field, _field_index) in _col.children"
                                        :container_id="field.id"
                                        :subcontainer_id="tab.id"
:key="_field_index" :colId="_col.id"
                                        :rowId="_row.id"
                                        :vmodel="_field.vModel"
                                        :orderNum="_field.orderNum"
                                        :ctrType="_field.ctrType"
                                      >
                                        <el-form-item :label-width="_field.labelWidth?_field.labelWidth:'90px'">
                                          <span v-show="_field.showLabel" slot="label" :style="_field.style">
                                            <span v-html="_field.label" /> <em v-if="_field.isRequired" class="red">*</em>
                                          </span>
                                          <f2bpm-portal-formitem v-if="_field.ctrType!='extend_tabs'&&_field.ctrType!='extend_container'" :parentdata="data" :field="_field" :fieldvalue="data[_field.vModel]" @updatevalue="updateFieldValue" @appendfieldvalue="appendFieldValue" />
                                        </el-form-item>
                                      </div>
                                    </el-col>
                                  </el-row>
                                </div>
                              </div>
                            </div>
                          </el-container>
                          <!-- <f2bpm-subtable :key="subtableKey" v-if="field.ctrType=='subtable'" :field="field" :fieldvalue="data[field.vModel]" @updatevalue="updateFieldValue" @appendfieldvalue="appendFieldValue">
                    </f2bpm-subtable>
                    <f2bpm-mobilesubtable :key="subtableKey" v-else-if="deviceType=='mobile'&&field.ctrType=='subtable'" :field="field">
                    </f2bpm-mobilesubtable> -->
                        </el-form-item>
                      </div>
                    </el-col>
                  </el-row>
                </div>
              </div>
            </el-form>
          </div>
        </div>
      </div>
      <el-drawer size="50%" :title="drawerTitle" :visible.sync="drawer" :direction="direction" :before-close="drawerClose">
        <div style="overflow: auto;height:700px">
          <pre>{{ drawerContent }}</pre>
        </div>
      </el-drawer>
    </div>
  </div>
</template>

<script>
  import f2bpmPortalFormitem from '@/views/workflow/components/onlineForm/f2bpm-portal-formitem'
  export default {
    components: {
      f2bpmPortalFormitem
    }, data() {
      return {
        portalId: '',
        deviceType: 'pc',
        // 子表组件的Key
        subtableKey: '101',
        formAction: null,
        isPropertyCollapsed: false,
        isCollapsed: false,
        // 抽屉
        drawerTitle: '查看',
        drawerContent: '',
        drawer: false,
        direction: 'rtl',
        treeData: [],
        data: {},
        formRules: {},
        previewJson: '',
        // 扁平化的字段定义
        // 被公式引用到的字段,key为字段名，value为多个数组公式
        mathFieldList: {},
        // 数组扁平化的字段定义
        fieldList: [],
        // 扁平化的字段定义
        fieldsDef: {},
        // 字段渲染描述
        fields: [],
        jscript: '',
        fieldValue: ''

      }
    }, computed: {
      rotatePropertyIcon() {
        return this.isPropertyCollapsed ? 'fa fa-angle-double-left' : 'fa fa-angle-double-right'
      },
      rotateIcon() {
        return this.isCollapsed ? 'fa fa-angle-double-right' : 'fa fa-angle-double-left'
      }
    },
    watch: {
      $route() {
        window.location.reload()
      }
    },
    mounted: function() {
      var that = this
      that.$nextTick(function() {
        // 确保子组件也挂载完毕
        f2grid_global_mainVueLoadComplated = true
        // 加载表单的动态脚本
        if (that.jscript) {
          const script = document.createElement('script')
          script.type = 'text/javascript'
          script.text = `
          console.info('========加载表单动态脚本==========');
            //========加载表单动态脚本==========
            ${that.jscript}
          `
          document.getElementsByTagName('head')[0].appendChild(script)
          if (Object.toIsExitsFunction('extend_fuiOnPageLoad')) {
            window.extend_fuiOnPageLoad()
          }
        }
      })
      $('body').addClass('overnone')
      window.autoPageHeight()
    },
    created: function() {
      this.load()
    },
    methods: {
      load() {
        var portalId = Object.toQueryString('portalId') || ''
        var isPreview = Object.toQueryString('isPreview') || false
        var that = this
        that.portalId = portalId
        if (isPreview) {
          var $parentVue = window.opener.window.myvm
          that.jscript = $parentVue.jscript
          that.fields = Object.toDeepClone($parentVue.fields)
          that.fieldsDef = Object.toDeepClone($parentVue.fieldsDef)
          that.fieldList = Object.toDeepClone($parentVue.fieldList)
        } else {
          var res = Object.toAjaxJson('/workflow/frame/appPortal/', 'getTemplateDesignerJson', { portalId: portalId })
          if (res.success) {
            that.designerJson = res.data
            that.formProperty = that.designerJson.formProperty
            $('title').html(that.formProperty.formTitle)
            if (that.designerJson.templateContent) {
              // Html模板内容设计
              that.fields = that.designerJson.templateContent
              that.jscript = that.designerJson.jscript
            } else {
              that.fields = []
            }
          }
        }
      },
       closeEdit() {
        FUI.Window.closeEdit()
      },
      // ===stand:标准化方法结束============
       loadData() {
        var that = this
        const currUser = FUI.Sys.getAuthor()
      },
       submitForm(isGoNext) {
        var that = this
        var success = that.validateForm('formRef')
        if (!success) return
      },
       validateForm(refFormName) {
        // stand:表单校验
        var success = false
        this.$refs[refFormName].validate(valid => {
          success = valid
        })
        return success
      },

       drawerClose(done) {
        done()
      },
       openHelperArticle(articleCode) {
        var url = __webpath + '/workflow/security/article/articleView?code=' + articleCode
        FUI.Window.openEdit(url, '查看帮助', 'View', null, null, null, null, null, null, true)
      },
       tabsClick(tab, event) {
        console.log(tab, event)
      },
       toPinYin(sourceField, targetField) {
        if (!this.data[targetField]) {
          const source = this.data[sourceField]
          this.data[targetField] = Object.toPinYin(source)
        }
      },
      // 重新渲染指定的组件
       renderComponent(keyName) {
        var that = this
        that.subtableKey = Object.toGetRandomNum(100, 2000)
      },
      // field: 可以是字段名也可以是字段定义的对象
       updateFieldValue(field, newValue, vueDataName, subVueDataName) {
        console.info('updateFieldValue')
        // 更新自己控件值
        var that = this
        var vueDataObj = vueDataName ? that[vueDataName] : that.data
        if (subVueDataName) {
          vueDataObj = that[vueDataName][subVueDataName]
        }
        if (typeof field === 'string') {
          vueDataObj[field] = newValue
        } else {
          if (field.vModel) {
            vueDataObj[field.vModel] = newValue
          } else if (field['field']) {
            vueDataObj[field['field']] = newValue
          }
        }
      },
       appendFieldValue(fieldName, newValue, vueDataName, subVueDataName) {
        console.info('appendFieldValue')
        // 追加值到指定字段
        var that = this
        var vueDataObj = vueDataName ? that[vueDataName] : that.data
        if (subVueDataName) {
          vueDataObj = that[vueDataName][subVueDataName]
        }
        var oleValue = vueDataObj[fieldName] || ''
        if (oleValue) {
          vueDataObj[fieldName] = oleValue + ',' + newValue
        }
        vueDataObj[fieldName] = newValue
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import "~@/resources/css/workflowform.css";
  @import "/static/f2bpmUI/onlineForm/onlinedisginer.css";
</style>
