module.exports = {
  
  devServer: {
    open: true,
    // port:3000,
    proxy:{
      '/api': {
        target: 'http://192.168.101.224:10001',
        changeOrigin: true,
        ws: true,
        pathRewrite: {
            '^/api': ''
        }
      }
    }
  },
  // 生产环境是否生成 sourceMap 文件
  productionSourceMap: false,//代码可读性
} 