import router from "@/router";
import Cookies from "js-cookie";

const permission = {
  state: {
    routers: [],
  },
  mutations: {
    SET_PERMISSION_ROUTER(state, value) {
      const permission_touter_P = [
        {
          path: "/Home",
          name: "Home",
          redirect: "/Home/ForumFirst",
          component: (resolve) => require(["@/views/Home/Home"], resolve),
          children: [
            // 用户管理2
            {
              path: "UserSecond",
              name: "UserSecond",
              component: (resolve) =>
                require(["@/views/Home/User/UserSecond"], resolve),
            },
            // 校友申请1
            {
              path: "RequestFirst",
              name: "RequestFirst",
              component: (resolve) =>
                require(["@/views/Home/Request/RequestFirst"], resolve),
            },
            // 学校动态1
            {
              path: "StateFirst",
              name: "StateFirst",
              component: (resolve) =>
                require(["@/views/Home/State/StateFirst"], resolve),
            },
            // 校友风采1
            {
              path: "ShowFirst",
              name: "ShowFirst",
              component: (resolve) =>
                require(["@/views/Home/Show/ShowFirst"], resolve),
            },
            // 论坛
            {
              path: "ForumFirst",
              name: "ForumFirst",
              component: (resolve) =>
                require(["@/views/Home/Forum/ForumFirst"], resolve),
            },
          ],
        },
      ];
      const permission_touter_D = [
        {
          path: "/Home",
          name: "Home",
          redirect: "/Home/ForumSecond",
          component: (resolve) => require(["@/views/Home/Home"], resolve),
          children: [
            // 用户管理1
            {
              path: "UserFirst",
              name: "UserFirst",
              component: (resolve) =>
                require(["@/views/Home/User/UserFirst"], resolve),
              meta: { isAuth: true },
            },
            // 申请列表
            {
              path: "RequestSecond",
              name: "RequestSecond",
              component: (resolve) =>
                require(["@/views/Home/Request/RequestSecond"], resolve),
              meta: { isAuth: true },
            },
            // 学校动态上传
            {
              path: "StateSecond",
              name: "StateSecond",
              component: (resolve) =>
                require(["@/views/Home/State/StateSecond"], resolve),
              meta: { isAuth: true },
            },
            // 校友风采1
            {
              path: "ShowSecond",
              name: "ShowSecond",
              component: (resolve) =>
                require(["@/views/Home/Show/ShowSecond"], resolve),
              meta: { isAuth: true },
            },
            // 论坛管理
            {
              path: "ForumSecond",
              name: "ForumSecond",
              component: (resolve) =>
                require(["@/views/Home/Forum/ForumSecond"], resolve),
              meta: { isAuth: true },
            },
          ],
        },
      ];
      if (value == "普通用户") {
        state.routers = router.addRoutes(permission_touter_P);
      }
      if (value == "超级管理员") {
        state.routers = router.addRoutes(permission_touter_D);
      }
    },
  },
  actions: {},
};
export default permission;
