<template>
  <div class="f2bpm-page-dialog-layout">
    <el-form ref="formRef" :model="data" label-width="120px">
      <div style="text-align: center;font-size: 18px;font-weight: bold;margin-bottom: 20px;margin-top: 10px;">
        <span v-html="data.articleTitle" />
      </div>
      <div style="text-align: center;font-size: 8px;margin-bottom: 5px;">
        <span v-html="data.articleAuthor" /> <span v-html="data.articleUpdateTime" />
      </div>
      <div style="border:0;border-bottom: 1px dotted rgb(196, 192, 192);" />
      <div style="margin-top: 10px;">
        <span v-html="data.articleContent" />
      </div>
      <div class="dialogfooter2">
        <el-button id="btn_cancel" size="small" @click="closeEdit"><i class="fa fa-minus-circle" />关闭
        </el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        formAction: null,
        code: '',
        treeData: [],
         data: {
          articleTitle: '',
          linkUrl: '',
          articleAuthor: '',
          orderNo: 1000,
          isAudited: '0',
          articleUpdateTime: '',
          description: '',
          linkTarget: '_blank',
          articlePhotoPath: [],
          linkType: '1',
          articleContent: '',
          infoType: '',
          functionID: '',
          isClearPic: ''
        }
      }
    },
    created: function() {
      var that = this
      that.formAction = formAction
      var code = Object.toQueryString('code') || ''
      that.code = code
      that.loadData()
    },
    methods: {
      closeEdit() {
        FUI.Window.closeEdit()
      },
       loadData() {
        var that = this
        if (formAction != FUI.FormAction.Add) {
          FUI.Form.bindDataToForm(that, '/workflow/security/article/', 'getArticleDataByCode', null, { code: that.code }, mainTable)
          that.data.articleUpdateTime = that.data.articleUpdateTime.substr(0, 10)
        }
      }
    }
  }
</script>
<style>
  html,
  body,
  div,
  span,
  applet,
  object,
  iframe,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  p,
  blockquote,
  pre,
  a,
  abbr,
  acronym,
  address,
  big,
  cite,
  code,
  del,
  dfn,
  em,
  font,
  img,
  ins,
  kbd,
  q,
  s,
  samp,
  small,
  strike,
  strong,
  sub,
  sup,
  tt,
  var,
  b,
  u,
  i,
  center,
  dl,
  dt,
  dd,
  ol,
  ul,
  li,
  fieldset,
  form,
  label,
  legend,
  table,
  caption,
  tbody,
  tfoot,
  thead,
  tr,
  th,
  td {
    margin: 0;
    padding: 0;
    outline: 0;
    font-size: 100%;
  }

  em {
    font-style: italic;
    color: black !important;
  }

  p {
    display: block;
    margin-block-start: 1em;
    margin-block-end: 1em;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
  }

  body {
    color: #646464;
  }
</style>
