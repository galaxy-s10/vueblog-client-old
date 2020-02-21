module.exports = {
  // 打包后本地预览时需要加publicPath，上线服务器要把publicPath注释掉
  // publicPath: './',
  devServer: {
    proxy: {
      '/api': {
        target: 'http://47.100.90.12:3000/',
        // target: 'http://localhost:3000',
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  }
}