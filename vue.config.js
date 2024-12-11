
let dirName = 'sh-design'

module.exports = {
  publicPath: './',
  outputDir: dirName,
  lintOnSave: 'warning',
  productionSourceMap: true, //打包取消map文件
  devServer: {
    headers: {
      // "Cross-Origin-Opener-Policy": "same-origin",
      // "Cross-Origin-Embedder-Policy": "require-corp",
      "Cross-Origin-Resource-Policy": "cross-origin",
    },
    disableHostCheck:true,
    // port:8000
    // host:'127.0.0.1'
  },
  configureWebpack:{
    devtool:"source map"
  }
}