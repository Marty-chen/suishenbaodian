module.exports = {
  
  devServer: {
    open: true,
    // port:3000,
    proxy:{
      '/api': {
        target: 'http://192.168.101.221',
        changeOrigin: true,
        ws: true,
        pathRewrite: {
            '^/api': ''
        }
      }
    }
  }
}