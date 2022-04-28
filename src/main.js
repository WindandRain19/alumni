import Vue from "vue";
import App from "./App.vue";
import router from "./router";
// 引入element-ui
import ElementUI from "element-ui";
// 引入element-ui样式
import "element-ui/lib/theme-chalk/index.css";
// 导入全局样式
import "./assets/css/global.css";
import store from "./store";
// 引入axios
import axios from "axios";

// 配置请求根路径
// axios.defaults.baseURL = "http://127.0.0.1:5001";
// 配置拦截器
// axios.interceptors.request.use(config => {
//   config.headers.Authorization = window.sessionStorage.getItem('token')
//   return config
// })
// Vue.prototype.$http = axios;

// ui挂载
Vue.prototype.$message = ElementUI.Message;
Vue.prototype.$confirm = ElementUI.MessageBox.confirm;

Vue.config.productionTip = false;
Vue.use(ElementUI);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
