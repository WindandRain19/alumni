<template>
  <div class="Register_container">
    <!-- 组成表单 -->
    <el-card class="box-card card">
      <div class="Register_header">注册</div>
      <el-form
        ref="registerRef"
        :model="registerForm"
        :rules="registerRules"
        label-width="100px"
        class="divForm"
      >
        <el-form-item label="头像">
          <el-upload
            class="avatar-uploader"
            ref="upload"
            :action="actionUrl"
            :show-file-list="false"
            :limit="1"
            :on-change="handlePreview"
            accept=".jpg,.png"
            :multiple="false"
            :auto-upload="false"
          >
            <img v-if="imageUrl" :src="imageUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="registerForm.name" style="width: 30%"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-radio-group v-model="registerForm.sex">
            <el-radio label="男"></el-radio>
            <el-radio label="女"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="学号" prop="number">
          <el-input v-model="registerForm.number" style="width: 30%"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="registerForm.password"
            style="width: 30%"
          ></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="telephone">
          <el-input
            v-model="registerForm.telephone"
            style="width: 30%"
          ></el-input>
        </el-form-item>
        <el-form-item label="现住址" prop="address">
          <el-input
            v-model="registerForm.address"
            style="width: 50%"
          ></el-input>
        </el-form-item>
        <el-form-item label="职称" prop="title">
          <el-input v-model="registerForm.title" style="width: 40%"></el-input>
        </el-form-item>
        <el-form-item label="公司名称" prop="company">
          <el-input
            v-model="registerForm.company"
            style="width: 50%"
          ></el-input>
        </el-form-item>
        <el-form-item label="公司地址" prop="work_address">
          <el-input
            v-model="registerForm.work_address"
            style="width: 50%"
          ></el-input>
        </el-form-item>
        <el-form-item label="学院和班级" prop="collegeClass">
          <div class="block">
            <el-cascader
              :options="options"
              :props="{ checkStrictly: true }"
              clearable
              v-model="registerForm.collegeClass"
            ></el-cascader>
          </div>
        </el-form-item>
        <el-form-item label="毕业时间" prop="time">
          <el-col :span="11">
            <el-date-picker
              type="date"
              placeholder="选择日期"
              v-model="registerForm.time"
              style="width: 100%"
            ></el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">立即创建</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  created() {
    this.getOptions();
  },
  name: "Register",
  data() {
    var checkName = (rule, value, cb) => {
      const regName = /^[\u4e00-\u9fa5]{2,6}$/;
      if (regName.test(value)) {
        return cb();
      }
      cb(new Error("请输入2~6位中文"));
    };
    var checkNumber = (rule, value, cb) => {
      const regNumber = /^\d{13}$/;
      if (regNumber.test(value)) {
        return cb();
      }
      cb(new Error("请输入正确的13位学号"));
    };
    var checkTelephone = (rule, value, cb) => {
      const regTelephone =
        /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
      if (regTelephone.test(value)) {
        return cb();
      }
      cb(new Error("请输入正确的电话号码"));
    };
    return {
      registerForm: {
        name: "",
        sex: "男",
        number: "",
        password: "",
        telephone: "",
        address: "",
        title: "",
        company: "",
        work_address: "",
        collegeClass: [],
        time: "",
      },
      // 验证
      registerRules: {
        name: [
          { required: true, message: "请输入姓名", trigger: "blur" },
          { validator: checkName, trigger: "blur" },
        ],
        sex: [{ required: true, message: "请输入账号", trigger: "blur" }],
        number: [
          { required: true, message: "请输入账号", trigger: "blur" },
          { validator: checkNumber, trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 16, message: "长度在6 到 16 个字符", trigger: "blur" },
        ],
        telephone: [
          { required: true, message: "请输入电话", trigger: "blur" },
          { validator: checkTelephone, trigger: "blur" },
        ],
        address: [{ required: true, message: "请输入地址", trigger: "blur" }],
        title: [
          { required: true, message: "请输入职称", trigger: "blur" },
          { min: 2, max: 16, message: "长度在 2 到16 个字符", trigger: "blur" },
        ],
        company: [
          { required: true, message: "请输入公司名称", trigger: "blur" },
        ],
        work_address: [
          { required: true, message: "请输入工作地址", trigger: "blur" },
        ],
        collegeClass: [
          { required: true, message: "请选择学院和班级", trigger: "blur" },
        ],
        time: [{ required: true, message: "请选择毕业时间", trigger: "blur" }],
      },
      //   头像
      imageUrl: "",
      actionUrl: "http://127.0.0.1:5001/Register/upload",
      options: [],
    };
  },
  methods: {
    async getOptions() {
      const { data: res } = await this.$http.get("/Options");
      this.options = res.data;
    },
    //   头像
    handlePreview(res, file) {
      var blob = new Blob([file.row]);
      this.imageUrl = URL.createObjectURL(blob);
      this.dialogImageUrl = this.imageUrl;
    },
    onSubmit() {
      this.$refs.registerRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.post(
          "/Register",
          this.registerForm
        );
        if (res.meta.status == 202) {
          this.$message.error("用户已存在");
        } else if (res.meta.status == 201) {
          this.$message.error("注册失败");
        } else {
          this.$message.success("注册成功");
          this.$refs.upload.submit();
          this.registerForm = {};
        }
      });
    },
  },
};
</script>

<style scoped>
.Register_container {
  background-color: #2b4b6b;
  height: 100%;
}
.Register_header {
  height: 100px;
  width: 800px;
  margin: 0 auto;
  line-height: 150px;
  text-align: center;
  font-size: 60px;
  color: #000;
}
.card {
  width: 800px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
/* 头像 */
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
