<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/Home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>校友用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>个人中心</el-breadcrumb-item>
    </el-breadcrumb>

    <div class="cardBox">
      <el-card class="card-left">
        <el-form ref="infoFormRef" :model="infoForm" label-width="100px">
          <el-form-item label="头像">
            <el-upload
              class="avatar-uploader"
              ref="upload"
              :action="actionUrl"
              :show-file-list="false"
              :limit="1"
              accept=".jpg,.png"
              :multiple="false"
              :auto-upload="false"
            >
              <img v-if="imageUrl" :src="imageUrl" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
          <el-form-item label="姓名">
            <el-input
              v-model="infoForm.name"
              :disabled="disabled1"
              style="width: 30%"
            ></el-input>
          </el-form-item>
          <el-form-item label="学号">
            <el-input
              v-model="infoForm.number"
              disabled
              style="width: 30%"
            ></el-input>
          </el-form-item>
          <el-form-item label="密码">
            <el-input
              v-model="infoForm.password"
              :disabled="disabled1"
              style="width: 30%"
            ></el-input>
          </el-form-item>
          <el-form-item label="电话">
            <el-input
              v-model="infoForm.telephone"
              style="width: 30%"
              :disabled="disabled1"
            ></el-input>
          </el-form-item>
          <el-form-item label="现住址">
            <el-input
              v-model="infoForm.address"
              style="width: 30%"
              :disabled="disabled1"
            ></el-input>
          </el-form-item>
          <el-form-item label="职称">
            <el-input
              v-model="infoForm.title"
              style="width: 30%"
              :disabled="disabled1"
            ></el-input>
          </el-form-item>
          <el-form-item label="公司名称">
            <el-input
              v-model="infoForm.company"
              style="width: 50%"
              :disabled="disabled1"
            ></el-input>
          </el-form-item>
          <el-form-item label="公司地址">
            <el-input
              v-model="infoForm.work_address"
              style="width: 50%"
              :disabled="disabled1"
            ></el-input>
          </el-form-item>
          <el-form-item label="学院和班级">
            <div class="block">
              <el-cascader
                :options="options"
                :props="{ checkStrictly: true }"
                clearable
                v-model="infoForm.collegeClass"
                :disabled="disabled1"
              ></el-cascader>
            </div>
          </el-form-item>
          <el-form-item label="毕业时间">
            <el-col :span="11">
              <el-date-picker
                type="date"
                placeholder="选择日期"
                v-model="infoForm.time"
                style="width: 100%"
                :disabled="disabled1"
              ></el-date-picker>
            </el-col>
          </el-form-item>
          <el-form-item>
            <el-button type="warning" @click="change">修改</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">立即创建</el-button>
          </el-form-item>
        </el-form>
      </el-card>
      <el-card class="card-right">
        <el-table :data="tableData" style="width: 100%">
          <el-table-column type="index" label="#" width="180">
          </el-table-column>
          <el-table-column prop="date1" label="日期" width="180">
          </el-table-column>
          <el-table-column prop="name" label="活动名称" width="180">
          </el-table-column>
          <el-table-column prop="status" label="状态">
            <template slot-scope="scope">
              <el-tag
                :type="scope.row.status === '未通过' ? 'danger' : 'success'"
                effect="dark"
                disable-transitions
                >{{ scope.row.status }}</el-tag
              >
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
  </div>
</template>

<script>
import { getOptions } from "../../../api/Options";
import { getUserInfo, UpdateUserInfo } from "../../../api/Users";
import { getPersonRequestInfo } from "../../../api/Request";
import Cookies from "js-cookie";
export default {
  created() {
    this.getUserInfo();
    this.getOptions();
    this.getRequestInfo();
  },
  name: "UserSecond",
  data() {
    return {
      infoForm: {
        name: "",
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
      disabled1: true,
      //   头像
      imageUrl: "",
      actionUrl: "http://127.0.0.1:5001/Home/stateSecond/upload",
      options: [],
      tableData: [],
    };
  },
  methods: {
    // 获得所有学院班级
    async getOptions() {
      getOptions().then((data) => {
        this.options = data.data.data;
      });
    },
    async getUserInfo() {
      let number = Cookies.get("number");
      getUserInfo(number).then((data) => {
        const { result } = data.data;
        if (data.data.status != 2001) {
          this.$message.error(data.data.msg);
        } else {
          this.infoForm = result[0];
          this.infoForm.collegeClass = [];
          this.infoForm.collegeClass.push(result[0].college);
          this.infoForm.collegeClass.push(result[0].class);
          this.imageUrl =
            process.env.VUE_APP_UPLOAD_URL_HEAD_PORTRAIT + result[0].photo;
          this.$message.success(data.data.msg);
        }
      });
    },
    change() {
      this.disabled1 = false;
    },
    //   头像
    onSubmit() {
      UpdateUserInfo(this.infoForm.number, this.infoForm).then((data) => {
        if (data.data.status !== 2001) {
          this.$message.error(data.data.msg);
        } else {
          this.$message.success(data.data.msg);
          this.disabled1 = true;
          this.$refs.upload.submit();
        }
      });
    },
    getRequestInfo() {
      let number = Cookies.get("number");
      getPersonRequestInfo(number).then((data) => {
        if (data.data.status !== 2001) {
          return this.$message.error(data.data.msg);
        }
        this.tableData = data.data.result;
      });
    },
  },
};
</script>

<style scoped>
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
.cardBox {
  display: flex;
  justify-content: space-between;
}
.card-left {
  width: 50%;
}
.card-right {
  width: 50%;
}
</style>
