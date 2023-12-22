const path = require('path')
const webpack = require('webpack')
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const dllPath = '../public/vendor';
module.exports = {
  entry: {
    vender: ['vue/dist/vue.esm.js', 'vue-router', 'axios', 'vue', 'vuex']
  },

  output: {
    //发布到目录，需与vue.config.js中的AddAssetHtmlPlugin一致
    path: path.join(__dirname, dllPath),
    filename: "[name].dll.js",
    library: "[name]_library"// **这一处必需与下一处相同**
  },

  plugins: [
    new CleanWebpackPlugin(),
    new webpack.DllPlugin({
      path: path.join(__dirname, dllPath, "[name]-manifest.json"),
      // 保持与output.library中名称一致
      name: "[name]_library"

    })

  ]

}
