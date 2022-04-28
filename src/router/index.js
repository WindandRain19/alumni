import Vue from "vue";
import VueRouter from "vue-router";
import Login from "../views/Login/Login.vue";
import Register from "../views/Register/Register.vue";
import Home from "../views/Home/Home.vue"
import UserFirst from "../views/Home/User/UserFirst.vue";
import UserSecond from "../views/Home/User/UserSecond.vue";
import RequestFirst from "../views/Home/Request/RequestFirst.vue";
import RequestSecond from "../views/Home/Request/RequestSecond.vue";
import StateFirst from "../views/Home/State/StateFirst.vue";
import StateSecond from "../views/Home/State/StateSecond.vue";
import ShowFirst from "../views/Home/Show/ShowFirst.vue";
import ShowSecond from "../views/Home/Show/ShowSecond.vue";
import ForumFirst from "../views/Home/Forum/ForumFirst.vue";
import ForumSecond from "../views/Home/Forum/ForumSecond.vue";

import Cookies from "js-cookie";

Vue.use(VueRouter);

const routes = [
  // 登录路由
  {
    path: "/",
    redirect: "/Login",
  },
  {
    path: "/Login",
    name: "Login",
    component: Login,
  },
  // 注册
  {
    path: "/Register",
    name: "Register",
    component: Register,
  },
  // 主页路由
  {
    path: "/Home",
    name: "Home",
    component: Home,
    redirect: "/Home/ForumFirst",
    children: [
      // 用户管理1
      {
        path: "UserFirst",
        name: UserFirst,
        component: UserFirst,
        meta: { isAuth: true },
      },
      // 用户管理2
      {
        path: "UserSecond",
        name: UserSecond,
        component: UserSecond,
      },
      // 校友申请1
      {
        path: "RequestFirst",
        name: RequestFirst,
        component: RequestFirst,
      },
      // 申请列表
      {
        path: "RequestSecond",
        name: RequestSecond,
        component: RequestSecond,
        meta: { isAuth: true },
      },
      // 学校动态1
      {
        path: "StateFirst",
        name: StateFirst,
        component: StateFirst,
      },
      // 学校动态上传
      {
        path: "StateSecond",
        name: StateSecond,
        component: StateSecond,
        meta: { isAuth: true },
      },
      // 校友风采1
      {
        path: "ShowFirst",
        name: ShowFirst,
        component: ShowFirst,
      },
      // 校友风采1
      {
        path: "ShowSecond",
        name: ShowSecond,
        component: ShowSecond,
        meta: { isAuth: true },
      },
      // 论坛
      {
        path: "ForumFirst",
        name: ForumFirst,
        component: ForumFirst,
      },
      // 论坛管理
      {
        path: "ForumSecond",
        name: ForumSecond,
        component: ForumSecond,
        meta: { isAuth: true },
      },
    ],
  },
];

const router = new VueRouter({
  routes,
});

// 路由导航守卫
router.beforeEach((to, from, next) => {
  if (to.path === "/Login") return next();
  const tokenStr = Cookies.get("Token")
  if (!tokenStr) return next("/Login");
  next();
});

export default router;
