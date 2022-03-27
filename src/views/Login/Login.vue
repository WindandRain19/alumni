<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像 -->
      <div class="avatar_box">
        <img src="../../assets/logo.png" alt="" />
      </div>
      <!-- 登录表单 -->
      <el-form
        ref="loginFormRef"
        label-width="60px"
        class="login_form"
        :model="loginForm"
        :rules="loginFormRules"
      >
        <!-- 用户名 -->
        <el-form-item label="账号" prop="number">
          <el-input
            prefix-icon="el-icon-user-solid"
            v-model="loginForm.number"
          ></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item label="密码" prop="password">
          <el-input
            prefix-icon="el-icon-lock"
            show-password
            v-model="loginForm.password"
          ></el-input>
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="Register">注册</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
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
      loginForm: {
        number: "",
        password: "",
      },
      //   表单验证
      loginFormRules: {
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
      },
    };
  },
  methods: {
    login() {
      this.$refs.loginFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.post("login", this.loginForm);
        console.log(res.meta.status);
        if (res.meta.status == 202) {
          this.$message.error("用户不存在");
        } else if (res.meta.status == 203) {
          this.$message.error("密码错误");
        } else if (res.meta.status == 200) {
          this.$message.success("登录成功！");
          window.sessionStorage.setItem("token", res.token);
          window.sessionStorage.setItem("number", res.data[0].number);
          window.sessionStorage.setItem("status", res.data[0].status);
          this.$router.push("/Home");
        }else{}
      });
    },
    Register() {
      this.$router.push("/Register");
    },
  },
};
</script>

<style scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
}

.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.avatar_box {
  height: 130px;
  width: 130px;
  border: 1px solid #eee;
  border-radius: 50%;
  padding: 10px;
  box-shadow: 0 0 10px #ddd;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
}

img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: #eee;
}

.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}

.btns {
  display: flex;
  justify-content: flex-end;
}
</style>
