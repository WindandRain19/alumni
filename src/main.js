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

import "@/permission.js"

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
