<template>
  <div v-if="showPdf" class="pdf-container">
    <canvas v-for="page in pages" :id="'canvas' + page" :key="page" />
  </div>
</template>
<script>
// import PDFJS from 'pdfjs-dist';
// import workerSrc from 'pdfjs-dist/build/pdf.worker.entry'
// PDFJS.workerSrc = workerSrc;
  export default {
    name: '',
    data() {
      return {
        width: 100,
        pdfDoc: null,
        pages: 0
      }
    },
    mounted() {
      this.loadFile('public/static/PDF.pdf')
    },
     methods: {
      /*
      * 加载PDF文件
      * url：后台提供的pdf地址或者项目中public/pdf文件（test.pdf）
      * 在需要的位置调用 this.loadFile(url)
      * */
      loadFile(url) {
        PDFJS.getDocument(url)
          .then((pdf) => {
            this.pdfDoc = pdf
            this.pages = this.pdfDoc.numPages
            this.$nextTick(() => {
              this.renderPage(1)
            })
          })
      },
      /*
      * 渲染PDF文件
      * */
      renderPage(num) {
        this.pdfDoc.getPage(num)
          .then((page) => {
            const canvas = document.getElementById('canvas' + num)
            const ctx = canvas.getContext('2d')
            const dpr = window.devicePixelRatio || 1 // 设备像素比
            const bsr = ctx.webkitBackingStorePixelRatio || ctx.mozBackingStorePixelRatio || ctx.msBackingStorePixelRatio || ctx.oBackingStorePixelRatio || ctx.backingStorePixelRatio || 1 // 浏览器在渲染canvas之前会用几个像素来来存储画布信息,类似img
            const ratio = dpr / bsr
            const viewport = page.getViewport(1.5)
            canvas.width = viewport.width * ratio // 画布大小,默认值是width:300px,height:150px
            canvas.height = viewport.height * ratio
            canvas.style.width = viewport.width + 'px' // 画布的框架大小
            canvas.style.height = viewport.height + 'px'
            const renderContext = {
              canvasContext: ctx,
              viewport: viewport
            }
            page.render(renderContext)
            if (this.pages > num) {
              this.renderPage(num + 1)
            } else {
              this.closeServerLoadingHandle()
            }
          })
      }
    }
  }
</script>
<style lang="scss">
  .pdf-container {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
  }
</style>
