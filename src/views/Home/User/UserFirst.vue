<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/Home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>校友用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input
            placeholder="请输入内容"
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
    </el-card>

    <!-- 添加用户的对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addDialogVisible"
      width="30%"
      @close="addDialogClosed"
    >
      <!-- 内容主题区 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
      >
        <el-form-item label="用户名" prop="name">
          <el-input v-model="addForm.name"></el-input>
        </el-form-item>
        <el-form-item label="学院" prop="college">
          <el-input v-model="addForm.college"></el-input>
        </el-form-item>
        <el-form-item label="班级" prop="class">
          <el-input v-model="addForm.class"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="telephone">
          <el-input v-model="addForm.telephone"></el-input>
        </el-form-item>
        <el-form-item label="工作职称" prop="title">
          <el-input v-model="addForm.title"></el-input>
        </el-form-item>
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
        :rules="editFormRules"
        label-width="100px"
      >
        <el-form-item label="账号" prop="number">
          <el-input v-model="editForm.number" disabled></el-input>
        </el-form-item>
        <el-form-item label="用户名" prop="name">
          <el-input v-model="editForm.name"></el-input>
        </el-form-item>
        <el-form-item label="学院" prop="college">
          <el-input v-model="editForm.college"></el-input>
        </el-form-item>
        <el-form-item label="班级" prop="class">
          <el-input v-model="editForm.class"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="telephone">
          <el-input v-model="editForm.telephone"></el-input>
        </el-form-item>
        <el-form-item label="工作职称" prop="title">
          <el-input v-model="editForm.title"></el-input>
        </el-form-item>
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
          <el-select v-model="changeForm.type" placeholder="普通用户">
            <el-option label="普通用户" value="普通用户"></el-option>
            <el-option label="管理员" value="管理员"></el-option>
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
import Cookies from "js-cookie";
export default {
  created() {
    this.getUserList();
  },
  name: "UserFirst",
  data() {
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
        college: "",
        class: "",
        telephone: "",
        title: "",
      },
      // 添加用户表单验证规则
      addFormRules: {
        name: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 2, max: 4, message: "用户名长度在2~4之间", trigger: "blur" },
        ],
        college: [{ required: true, message: "请输入学院", trigger: "blur" }],
        class: [{ required: true, message: "请输入班级", trigger: "blur" }],
        telephone: [{ required: true, message: "请输入电话", trigger: "blur" }],
        title: [{ required: true, message: "请输入工作职称", trigger: "blur" }],
      },
      // 修改用户对话框的显示/隐藏
      editDialogVisible: false,
      // 修改用户查询的表单数据
      editForm: {
        name: "",
        college: "",
        class: "",
        telephone: "",
        title: "",
      },
      editFormRules: {
        name: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 2, max: 4, message: "用户名长度在2~4之间", trigger: "blur" },
        ],
        college: [{ required: true, message: "请输入学院", trigger: "blur" }],
        class: [{ required: true, message: "请输入班级", trigger: "blur" }],
        telephone: [{ required: true, message: "请输入电话", trigger: "blur" }],
        title: [{ required: true, message: "请输入工作职称", trigger: "blur" }],
      },
      // 分配角色
      changeDialogVisible: false,
      changeForm: {},
    };
  },
  methods: {
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
          if (status !== 2001) return this.$message.error("添加用户失败");
          this.$message.success("添加用户成功");
          this.addDialogVisible = false;
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
    async handleChange() {
      updateUserRole(this.changeForm.number, this.changeForm.type).then(
        (data) => {
          const { status } = data.data;
          if (status !== 2001) return this.$message.error("用户权限修改失败");
          this.$message.success("用户权限修改成功");
          Cookies.setItem("type", this.changeForm.type);
          this.changeDialogVisible = false;
        }
      );
      const { data: res } = await this.$http.put("/Home/userFirst/up", {
        number: this.changeForm.number,
        status: this.changeForm.status,
      });
    },
  },
};
</script>

<style scoped></style>
