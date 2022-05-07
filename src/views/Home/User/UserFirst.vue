<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/Home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>校友用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <div class="box-card-uf">
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input
            placeholder="请输入姓名"
            v-model="queryInfo.query"
            clearable
            @clear="getUserList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUserList"
            ></el-button> </el-input
        ></el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true"
            >添加用户</el-button
          >
        </el-col>
      </el-row>
      <!-- 用户列表去 -->
      <el-table :data="usersList" border stripe>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="姓名" prop="name"></el-table-column>
        <el-table-column label="学院" prop="college"></el-table-column>
        <el-table-column label="班级" prop="class"></el-table-column>
        <el-table-column label="电话" prop="telephone"></el-table-column>
        <el-table-column label="工作职称" prop="title"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-tooltip
              effect="dark"
              content="修改"
              placement="top-start"
              :enterable="false"
            >
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="showEditDialog(scope.row.number)"
              ></el-button>
            </el-tooltip>
            <el-tooltip
              effect="dark"
              content="删除"
              placement="top-start"
              :enterable="false"
            >
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="removeUserByNumber(scope.row.number)"
              ></el-button>
            </el-tooltip>
            <el-tooltip
              effect="dark"
              content="分配角色"
              placement="top-start"
              :enterable="false"
            >
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                @click="changeUserByNumber(scope.row.number)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pageNum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </div>

    <!-- 添加用户的对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addDialogVisible"
      width="60%"
      @close="addDialogClosed"
    >
      <!-- 内容主题区 -->
      <el-form
        ref="addFormRef"
        :model="addForm"
        :rules="addFormRules"
        label-width="100px"
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
        <table Width="100%">
          <tr>
            <th>
              <el-form-item label="姓名" prop="name">
                <el-input v-model="addForm.name" style="width: 90%"></el-input>
              </el-form-item>
            </th>
            <th>
              <el-form-item label="性别" prop="sex">
                <el-radio-group v-model="addForm.sex">
                  <el-radio label="男"></el-radio>
                  <el-radio label="女"></el-radio>
                </el-radio-group>
              </el-form-item>
            </th>
          </tr>
          <tr>
            <th>
              <el-form-item label="学号" prop="number">
                <el-input
                  v-model="addForm.number"
                  style="width: 90%"
                ></el-input>
              </el-form-item>
            </th>
            <th>
              <el-form-item label="密码" prop="password">
                <el-input
                  v-model="addForm.password"
                  style="width: 90%"
                ></el-input>
              </el-form-item>
            </th>
          </tr>
          <tr>
            <th>
              <el-form-item label="电话" prop="telephone">
                <el-input
                  v-model="addForm.telephone"
                  style="width: 90%"
                ></el-input>
              </el-form-item>
            </th>
            <th>
              <el-form-item label="现住址" prop="address">
                <el-input
                  v-model="addForm.address"
                  style="width: 90%"
                ></el-input>
              </el-form-item>
            </th>
          </tr>
          <tr>
            <th>
              <el-form-item label="职称" prop="title">
                <el-input v-model="addForm.title" style="width: 90%"></el-input>
              </el-form-item>
            </th>
            <th>
              <el-form-item label="公司名称" prop="company">
                <el-input
                  v-model="addForm.company"
                  style="width: 90%"
                ></el-input>
              </el-form-item>
            </th>
          </tr>
          <tr>
            <th>
              <el-form-item label="公司地址" prop="work_address">
                <el-input
                  v-model="addForm.work_address"
                  style="width: 90%"
                ></el-input>
              </el-form-item>
            </th>
            <th>
              <el-form-item label="学院和班级" prop="collegeClass">
                <div class="block">
                  <el-cascader
                    :options="options"
                    :props="{ checkStrictly: true }"
                    clearable
                    v-model="addForm.collegeClass"
                  ></el-cascader>
                </div>
              </el-form-item>
            </th>
          </tr>
          <tr>
            <th>
              <el-form-item label="毕业时间" prop="time">
                <el-col :span="11">
                  <el-date-picker
                    type="date"
                    placeholder="选择日期"
                    v-model="addForm.time"
                    style="width: 100%"
                  ></el-date-picker>
                </el-col>
              </el-form-item>
            </th>
          </tr>
        </table>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改用户对话框 -->
    <el-dialog
      title="修改用户"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <!-- 内容主题区 -->
      <el-form
        ref="editFormRef"
        :model="editForm"
        :rules="addFormRules"
        label-width="100px"
      >
        <el-form-item label="头像">
          <el-upload
            class="avatar-uploader"
            ref="upload1"
            :action="actionUrl"
            :show-file-list="false"
            :limit="1"
            :on-change="handlePreview"
            accept=".jpg,.png"
            :multiple="false"
            :auto-upload="false"
          >
            <img v-if="imageUrl1" :src="imageUrl1" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <table Width="100%">
          <tr>
            <th>
              <el-form-item label="姓名" prop="name">
                <el-input v-model="editForm.name" style="width: 90%"></el-input>
              </el-form-item>
            </th>
            <th>
              <el-form-item label="性别" prop="sex">
                <el-radio-group v-model="editForm.sex">
                  <el-radio label="男"></el-radio>
                  <el-radio label="女"></el-radio>
                </el-radio-group>
              </el-form-item>
            </th>
          </tr>
          <tr>
            <th>
              <el-form-item label="学号" prop="number">
                <el-input
                  v-model="editForm.number"
                  style="width: 90%"
                  disabled
                ></el-input>
              </el-form-item>
            </th>
            <th>
              <el-form-item label="密码" prop="password">
                <el-input
                  v-model="editForm.password"
                  style="width: 90%"
                ></el-input>
              </el-form-item>
            </th>
          </tr>
          <tr>
            <th>
              <el-form-item label="电话" prop="telephone">
                <el-input
                  v-model="editForm.telephone"
                  style="width: 90%"
                ></el-input>
              </el-form-item>
            </th>
            <th>
              <el-form-item label="现住址" prop="address">
                <el-input
                  v-model="editForm.address"
                  style="width: 90%"
                ></el-input>
              </el-form-item>
            </th>
          </tr>
          <tr>
            <th>
              <el-form-item label="职称" prop="title">
                <el-input
                  v-model="editForm.title"
                  style="width: 90%"
                ></el-input>
              </el-form-item>
            </th>
            <th>
              <el-form-item label="公司名称" prop="company">
                <el-input
                  v-model="editForm.company"
                  style="width: 90%"
                ></el-input>
              </el-form-item>
            </th>
          </tr>
          <tr>
            <th>
              <el-form-item label="公司地址" prop="work_address">
                <el-input
                  v-model="editForm.work_address"
                  style="width: 90%"
                ></el-input>
              </el-form-item>
            </th>
            <th>
              <el-form-item label="学院和班级" prop="collegeClass">
                <div class="block">
                  <el-cascader
                    :options="options"
                    :props="{ checkStrictly: true }"
                    clearable
                    v-model="editForm.collegeClass"
                  ></el-cascader>
                </div>
              </el-form-item>
            </th>
          </tr>
          <tr>
            <th>
              <el-form-item label="毕业时间" prop="time">
                <el-col :span="11">
                  <el-date-picker
                    type="date"
                    placeholder="选择日期"
                    v-model="editForm.time"
                    style="width: 100%"
                  ></el-date-picker>
                </el-col>
              </el-form-item>
            </th>
          </tr>
        </table>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo()">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配角色对话框 -->
    <el-dialog title="分配角色" :visible.sync="changeDialogVisible" width="30%">
      <el-form ref="changeFormRef" :model="changeForm" label-width="80px">
        <el-form-item label="姓名" style="width: 50%">
          <el-input v-model="changeForm.name" disabled></el-input>
        </el-form-item>
        <el-form-item label="角色分配">
          <el-select v-model="changeForm.type">
            <el-option label="普通用户" value="普通用户"></el-option>
            <el-option label="超级管理员" value="超级管理员"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="changeDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleChange">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getUserInfo,
  getUserInfos,
  postUserInfo,
  UpdateUserInfo,
  deleteUserInfo,
  updateUserRole,
} from "../../../api/Users";
import { getOptions } from "../../../api/Options";
import Cookies from "js-cookie";
export default {
  created() {
    this.getUserList();
    this.getOptions();
  },
  name: "UserFirst",
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
      // 获取用户列表
      queryInfo: {
        query: "",
        // 当前的页数
        pageNum: 1,
        // 当前每页显示多少条
        pageSize: 2,
      },
      usersList: [],
      total: 0,
      // 对话框显示/隐藏
      addDialogVisible: false,
      // 添加用户的表单数据
      addForm: {
        name: "",
        sex: "",
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
      // 添加用户表单验证规则
      addFormRules: {
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
      imageUrl: "",
      actionUrl: process.env.VUE_APP_BASE_API + "/users/uploadHeadPortrait",
      imageUrl1: "",
      options: [],
      // 修改用户对话框的显示/隐藏
      editDialogVisible: false,
      // 修改用户查询的表单数据
      editForm: {
        name: "",
        sex: "",
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
      // 分配角色
      changeDialogVisible: false,
      changeForm: {},
    };
  },
  methods: {
    handlePreview(file) {
      this.$message.success("选择头像成功");
      console.log(file);
    },
    getOptions() {
      getOptions().then((data) => {
        this.options = data.data.data;
      });
    },
    async getUserList() {
      getUserInfos(this.queryInfo).then((data) => {
        let { status, result, total } = data.data;
        if (status !== 2001) return this.$message.error("用户列表获取失败");
        this.usersList = result;
        this.total = total;
      });
    },
    // 监听的pageSize
    handleSizeChange(newSize) {
      this.queryInfo.pageSize = newSize;
      this.getUserList();
    },
    // 监听pageNum
    handleCurrentChange(newPage) {
      this.queryInfo.pageNum = newPage;
      this.getUserList();
    },
    addDialogClosed() {
      this.$refs.addFormRef.resetFields();
    },
    // 点击按钮添加用户
    addUser() {
      this.$refs.addFormRef.validate((valid) => {
        if (!valid) return;
        // 发起添加用户的网络请求
        postUserInfo(this.addForm).then((data) => {
          const { status } = data.data;
          if (status == 2004) {
            this.$message.error("用户已存在");
          } else if (status == 2002) {
            this.$message.error("注册失败");
          } else {
            this.$message.success("注册成功");
            this.$refs.upload.submit();
            this.addForm = {};
            this.addDialogVisible = false;
          }
          this.getUserList();
        });
      });
    },
    // 监听修改对话框的关闭事件
    editDialogClosed() {
      this.$refs.editFormRef.resetFields();
    },
    // 展示修改用户信息
    async showEditDialog(number) {
      this.editDialogVisible = true;
      getUserInfo(number).then((data) => {
        const { status, result } = data.data;
        if (!status == 2001) return this.$message.error("查询用户信息失败");
        this.editForm = result[0];
        this.editForm.collegeClass = [];
        this.editForm.collegeClass.push(result[0].college);
        this.editForm.collegeClass.push(result[0].class);
        this.imageUrl1 =
          process.env.VUE_APP_UPLOAD_URL_HEAD_PORTRAIT + result[0].photo;
        console.log(
          process.env.VUE_APP_UPLOAD_URL_HEAD_PORTRAIT + result[0].photo
        );
      });
    },
    // 修改用户信息并提交
    editUserInfo() {
      this.$refs.editFormRef.validate((valid) => {
        if (!valid) return;
        // 发起更新用户的网络请求
        UpdateUserInfo(this.editForm.number, this.editForm).then((data) => {
          const { status } = data.data;
          if (status !== 2001) return this.$message.error("修改用户信息失败");
          this.$message.success("修改用户信息成功");
          this.$refs.upload1.submit();
          this.editDialogVisible = false;
          this.getUserList();
        });
      });
    },
    // 删除用户
    async removeUserByNumber(number) {
      // 弹框
      const confirmResult = await this.$confirm(
        "此操作将永久删除该用户, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      if (confirmResult !== "confirm") {
        return this.$message.info("已经取消删除");
      }
      deleteUserInfo(number).then((data) => {
        const { status } = data.data;
        if (status !== 2001) return this.$message.error("删除用户失败");
        this.$message.success("删除用户成功");
        this.getUserList();
      });
    },
    changeUserByNumber(number) {
      this.changeDialogVisible = true;
      getUserInfo(number).then((data) => {
        const { status, result } = data.data;
        if (status !== 2001) return this.$message.error("用户查询失败");
        this.$message.success("用户查询成功");
        this.changeForm = result[0];
      });
    },
    handleChange() {
      updateUserRole(this.changeForm.number, this.changeForm.type).then(
        (data) => {
          const { status } = data.data;
          if (status !== 2001) return this.$message.error("用户权限修改失败");
          this.$message.success("用户权限修改成功");
          this.changeDialogVisible = false;
        }
      );
    },
  },
};
</script>

<style scoped>
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

.box-card-uf {
  width: 1200px;
  background-color: rgba(255, 255, 255, 0.6);
  box-shadow: 0px 0px 27px 0px rgba(148, 192, 253, 0.28);
  padding: 20px;
  margin: 0 auto;
  border-radius: 10px;
}
</style>
