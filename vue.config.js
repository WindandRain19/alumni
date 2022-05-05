module.exports = {
  lintOnSave: false,
  devServer: {
    port: 8088,
    proxy: {
      "/api": {
        target: "http://localhost:5001/", // 实际跨域请求的API地址
        secure: false, // https请求则使用true
        ws: true,
        changeOrigin: true, // 跨域
        // 请求地址重写  http://front-end/api/login ⇒ http://api-url/login
        pathRewrite: {
          "^/api": "",
        },
      },
    },
  },
};
