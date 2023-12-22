import PDFJS from 'pdfjs-dist'
/*
    el:'装载PDF的容器'，
    fileSrc:'文件地址'，
    scale:'缩放倍数'
*/
export async function loadPdf({ el, fileSrc, scale = 1.2 }) {
    const pdfCol = document.querySelector(el)
    const pdf = await PDFJS.getDocument(fileSrc)
    const pages = pdf.numPages
     for (let i = 1; i <= pages; i++) {
      const canvas = document.createElement('canvas')
      const page = await pdf.getPage(i)
      const viewport = page.getViewport(scale)
      const context = canvas.getContext('2d')
      canvas.height = viewport.height
      canvas.width = viewport.width
      const renderContext = {
          canvasContext: context,
          viewport: viewport
      }
      await page.render(renderContext)
      canvas.className = 'canvas'
      pdfCol.appendChild(canvas)
     }
}
