import Vue from "vue";
import VueRouter from "vue-router";

import Cookies from "js-cookie";

Vue.use(VueRouter);

export const routes = [
  // 登录路由
  {
    path: "/",
    redirect: "/Login",
  },
  {
    path: "/Login",
    name: "Login",
    component: (resolve) => require(["@/views/Login/Login"], resolve),
  },
  // 注册
  {
    path: "/Register",
    name: "Register",
    component: (resolve) => require(["@/views/Register/Register"], resolve),
  },
];

const router = new VueRouter({
  routes,
});


// 路由导航守卫
router.beforeEach((to, from, next) => {
  if (to.path === "/Login" || to.path === "/Register") return next();
  const tokenStr = Cookies.get("Token");
  if (!tokenStr) return next("/Login");
  next();
});

export default router;
