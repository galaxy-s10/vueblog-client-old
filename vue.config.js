module.exports = {
  // 打包后本地预览时需要加publicPath，上线服务器要把publicPath注释掉
  // publicPath: './',
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:3003/',
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  }
}