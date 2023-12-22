<template>
  <div style="text-align: center;">
    <div class="pdfCol" />
  </div>
</template>

<script>
// import { loadPdf } from '@/utils/pdf.js'
export default {
data() {
  return {
      dataHtml: '',
      url: '/static/PDF.pdf',
      col: '.pdfCol'
  }
},
mounted() {
  console.info(loadPdf)
  loadPdf({
       fileSrc: this.url,
       el: this.col
  })
}
}
</script>

<style lang="scss">
  .pdfCol{
    background: #000;
      width: 100%;
      height: 100%;
      overflow: auto;
      overflow-x: hidden;
  }
</style>
