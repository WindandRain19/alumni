<template>
  <div class="login">
    <div class="box-card1">
      <h3 class="title">校友服务管理系统</h3>
      <el-form ref="loginForm" :model="loginForm" :rules="loginRules">
        <el-form-item label="用户类型">
          <el-select v-model="loginForm.type" placeholder="用户类型">
            <el-option label="普通用户" value="普通用户"></el-option>
            <el-option label="超级管理员" value="超级管理员"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="账号:" style="width: 500px" prop="number">
          <el-input
            v-model="loginForm.number"
            placeholder="请输入账号"
            style="width: 80%"
          ></el-input>
        </el-form-item>
        <el-form-item label="密码:" style="width: 500px" prop="password">
          <el-input
            v-model="loginForm.password"
            placeholder="请输入账号"
            style="width: 80%"
          ></el-input>
        </el-form-item>
        <el-form-item prop="img_code" label="验证码:">
          <el-input
            v-model="loginForm.img_code"
            auto-complete="off"
            placeholder="验证码"
            style="width: 40%"
            @keyup.enter.native="handleLogin"
          >
          </el-input>
          <div class="login-code">
            <img ref="img_codeRef" :src="codeUrl" @click="getCode" />
          </div>
        </el-form-item>
        <el-checkbox v-model="loginForm.RememberMe">记住密码</el-checkbox>
        <el-form-item>
          <el-button
            size="medium"
            type="primary"
            round
            style="width: 40%"
            @click.native.prevent="handleLogin"
          >
            <span v-if="!loginLoading">登 录</span>
            <span v-else>登 录 中...</span>
          </el-button>
          <el-button
            size="medium"
            type="primary"
            round
            style="width: 40%; margin-left: 70px"
            @click="Register"
          >
            <span>注册</span>
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import Cookies from "js-cookie";
export default {
  created() {
    sessionStorage.removeItem("activePath");
    sessionStorage.removeItem("type");
    this.getCookie();
  },
  name: "Login",
  data() {
    // 验证账号规则
    var checkNumber = (rule, value, cb) => {
      const regNumber = /^\d{13}$/;
      if (regNumber.test(value)) {
        return cb();
      }
      cb(new Error("请输入正确的13位学号"));
    };
    return {
      codeUrl: process.env.VUE_APP_BASE_API + "/Login/CodeImg",
      loginForm: {
        type: "",
        number: "",
        password: "",
        RememberMe: false,
        img_code: "",
      },
      loginLoading: false,
      //   表单验证
      loginRules: {
        //   账号验证
        number: [
          { required: true, message: "请输入账号", trigger: "blur" },
          { validator: checkNumber, trigger: "blur" },
        ],
        //   密码验证
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 16, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
        img_code: [
          { required: true, message: "验证码不能为空", trigger: "change" },
        ],
      },
    };
  },
  methods: {
    // 获取原有Cookies
    getCookie() {
      const number = Cookies.get("number");
      const password = Cookies.get("password");
      const RememberMe = Cookies.get("RememberMe");
      const type = Cookies.get("type");
      this.loginForm = {
        number: number === undefined ? this.loginForm.number : number,
        password: password === undefined ? this.loginForm.password : password,
        RememberMe: RememberMe === undefined ? false : Boolean(RememberMe),
        type: type === undefined ? this.loginForm.type : type,
      };
    },
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          if (this.loginForm.RememberMe) {
            Cookies.set("number", this.loginForm.number, { expires: 30 });
            Cookies.set("password", this.loginForm.password, {
              expires: 30,
            });
            Cookies.set("RememberMe", this.loginForm.RememberMe, {
              expires: 30,
            });
            Cookies.set("type", this.loginForm.type, {
              expires: 30,
            });
          } else {
            Cookies.remove("number");
            Cookies.remove("password");
            Cookies.remove("RememberMe");
            Cookies.remove("type");
          }
          this.$store
            .dispatch("Login", this.loginForm)
            .then((code) => {
              switch (code) {
                case 2000:
                  this.$message.error("用户不存在");
                  break;
                case 2001:
                  this.$message.success("登录成功");
                  this.$store.commit("SET_PERMISSION_ROUTER",this.loginForm.type)
                  window.sessionStorage.setItem("type",this.loginForm.type)
                  console.log(this.loginForm.number);
                  console.log(this.$store);
                  this.$router.push("/Home");
                  break;
                case 2002:
                  this.$message.error("密码错误");
                  break;
                case 2003:
                  this.$message.error("验证码不正确");
                  break;
                case 2004:
                  this.$message.error("所选类型不匹配");
                  break;
                default:
                  break;
              }
            })
            .catch(() => {});
        }
      });
    },
    // 注册
    Register() {
      this.$router.push("/Register");
    },
    // 获取验证码
    getCode() {
      this.codeUrl =
        process.env.VUE_APP_BASE_API +
        "/Login/CodeImg?t=" +
        new Date().getTime();
    },
  },
};
</script>

<style scoped>
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-image: url("../../assets/main-background.jpg");
  background-repeat: no-repeat;
  background-size: 100% 100%;
}
.box-card1 {
  background: #ffffff;
  box-shadow: 0px 0px 27px 0px rgba(148, 192, 253, 0.28);
  padding: 40px;
  border-radius: 10px;
}
.title {
  margin: 0px auto 30px auto;
  text-align: center;
  color: #707070;
}
button {
  margin: 20px auto;
}
.login-code {
  width: 33%;
  height: 40px;
  float: right;
}
img {
  cursor: pointer;
  vertical-align: middle;
}
</style>
