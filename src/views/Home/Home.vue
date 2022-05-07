<template>
  <div class="home-container">
    <!-- 头部 -->
    <el-header>
      <div>
        <div class="logo">
          <div><img src="../../assets/logo.png" alt="" /></div>
        </div>
        <span>校友服务管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button></el-header
    >
    <el-container>
      <!-- 侧边栏 -->
      <el-aside width="isCollapse ? '64px':'200px'">
        <!-- 按钮条 -->
        <div class="toggle_button" @click="toggleCollapse">|||</div>
        <!-- 侧边栏菜单区域 -->
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#4091ff"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          router
          :default-active="activePath"
        >
          <!-- 一级菜单 -->
          <el-submenu
            :index="item.id + ''"
            v-for="item in menuList"
            :key="item.id"
            @click="saveNavState('/' + subItem.path)"
          >
            <template slot="title">
              <i :class="iconsObject[item.id]"></i>
              <span>{{ item.authName }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              :index="'/' + subItem.path"
              v-for="subItem in item.children"
              :key="subItem.id"
              @click="saveNavState('/' + subItem.path)"
            >
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{ subItem.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧内容 -->
      <div class="main">
        <div class="main-layer">
          <div class="main-header"></div>
          <div class="main-body">
            <router-view></router-view>
          </div>
        </div>
      </div>
    </el-container>
  </div>
</template>

<script>
import Cookies from "js-cookie";
import { getMenuList } from "@/api/Menu";
export default {
  created() {
    this.getMenuList();
    this.activePath = window.sessionStorage.getItem("activePath");
    this.keepStyle();
  },
  name: "Home",
  data() {
    return {
      // 左侧菜单数据
      menuList: [],
      iconsObject: {
        101: "el-icon-chat-round",
        102: "el-icon-s-custom",
        103: "el-icon-edit-outline",
        104: "el-icon-loading",
        105: "el-icon-magic-stick",
      },
      isCollapse: "",
      // 被激活的链接地址
      activePath: "",
    };
  },
  methods: {
    // 退出登录
    logout() {
      window.sessionStorage.clear();
      this.$router.push("/Login");
    },
    // 获取所有菜单
    getMenuList() {
      let type = Cookies.get("type");
      getMenuList(type).then((data) => {
        const res = data.data;
        if (res.status !== 2001) return this.$message.error("获取菜单失败");
        this.menuList = res.data;
      });
    },
    // 侧边栏按钮条折叠
    toggleCollapse() {
      this.isCollapse = !this.isCollapse;
      window.sessionStorage.setItem("isCollapse", this.isCollapse);
    },
    // 保存链接的激活状态
    saveNavState(activePath) {
      window.sessionStorage.setItem("activePath", activePath);
      this.activePath = activePath;
    },
    keepStyle() {
      this.$store.commit("GET_ISCOLLAPSE");
      this.isCollapse = this.$store.state.layout.isCollapse;
    },
  },
};
</script>

<style scoped>
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #fff;
  font-size: 20px;
}
.el-header > div {
  display: flex;
  align-items: center;
}
.logo {
  width: 200px;
  height: 60px;
  display: flex;
  justify-content: center;
}
.logo > div {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #871f27;
}
.logo > div > img {
  width: 60px;
  height: 60px;
}
.el-header > div > span {
  margin-left: 15px;
}

.home-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.el-aside {
  background-color: #333744;
}

.el-aside > .el-menu {
  border-right: none;
}

.el-main {
  background-color: #eaedf1;
}

.toggle_button {
  background-color: #4a5064;
  font-size: 10px;
  line-height: 25px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
.main {
  flex: 1;
  position: relative;
  background-image: url("../../assets/main-background.jpg");
  background-repeat: no-repeat;
  background-size: 100% 100%;
}
.main-layer {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  flex-direction: column;
}
.main-body {
  flex: 1;
  overflow: auto;
}
</style>
