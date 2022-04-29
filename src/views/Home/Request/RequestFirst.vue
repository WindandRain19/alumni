<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/Home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>校友申请管理</el-breadcrumb-item>
      <el-breadcrumb-item>校友申请</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡品视图 -->
    <el-card class="box-card">
      <!--申请表格 -->
      <el-form
        ref="formRef"
        :model="requestForm"
        :rules="requestFormRules"
        label-width="80px"
      >
        <el-form-item label="活动名称" prop="name" required>
          <el-input v-model="requestForm.name" style="width: 40%"></el-input>
        </el-form-item>
        <el-form-item label="负责人" prop="user" required>
          <el-input v-model="requestForm.user" style="width: 40%"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="telephone" required>
          <el-input
            v-model="requestForm.telephone"
            style="width: 40%"
          ></el-input>
        </el-form-item>
        <el-form-item label="活动区域" prop="region" required>
          <el-select v-model="requestForm.region" placeholder="请选择活动区域">
            <el-option label="旧校区" value="旧校区"></el-option>
            <el-option label="新校区" value="新校区"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="活动时间" required>
          <el-col :span="11">
            <el-form-item prop="date1">
              <el-date-picker
                type="date"
                placeholder="选择日期"
                v-model="requestForm.date1"
                value-format="yyyy-MM-dd"
                style="width: 90%"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col class="line date_w" :span="2">-</el-col>
          <el-col :span="11">
            <el-form-item prop="date2">
              <el-time-picker
                placeholder="选择时间"
                v-model="requestForm.date2"
                value-format="HH:mm:ss"
                style="width: 90%"
              ></el-time-picker>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label="活动性质" prop="type" required>
          <el-radio-group v-model="requestForm.type">
            <el-radio label="申请入校"></el-radio>
            <el-radio label="线上活动"></el-radio>
            <el-radio label="线下活动"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="活动简介" prop="introduction" required>
          <el-input
            type="textarea"
            v-model="requestForm.introduction"
            style="width: 40%"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">确认</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import Cookies from "js-cookie";
import { postRequest } from "../../../api/Request";
export default {
  name: "RequestFirst",
  data() {
    return {
      requestForm: {
        name: "",
        user: "",
        telephone: "",
        region: "",
        date1: "",
        date2: "",
        type: "",
        introduction: "",
      },
      requestFormRules: {
        name: [{ required: true, message: "请输入活动名称", trigger: "blur" }],
        user: [{ required: true, message: "请输入负责人", trigger: "blur" }],
        telephone: [
          { required: true, message: "请输入负责人电话", trigger: "blur" },
        ],
        region: [
          { required: true, message: "请输入活动区域", trigger: "blur" },
        ],
        date1: [{ required: true, message: "请输入活动日期", trigger: "blur" }],
        date2: [{ required: true, message: "请输入活动时间", trigger: "blur" }],
        type: [{ required: true, message: "请输入活动性质", trigger: "blur" }],
        introduction: [
          { required: true, message: "请输入活动简介", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    async onSubmit() {
      // 提示框
      const confirmResult = await this.$confirm("是否确认提交?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).catch((err) => err);
      const number = Cookies.get("number");
      const requestForm = this.requestForm;
      if (confirmResult == "confirm") {
        postRequest(requestForm, number).then((data) => {
          if (data.data.status !== 2001) {
            return this.$message.error(data.data.msg);
          }
          this.$message.success(data.data.msg);
          this.$refs.formRef.resetFields();
        });
      }
    },
  },
};
</script>

<style scoped>
.el-col {
  width: 130px;
}
.date_w {
  width: 20px;
}
</style>
