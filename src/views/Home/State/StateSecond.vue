<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/Home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>学校动态管理</el-breadcrumb-item>
      <el-breadcrumb-item>学校动态管理</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区 -->
    <el-card class="box-card">
      <el-upload
        class="upload-demo"
        ref="upload"
        :action="actionUrl"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :on-success="handleSuccess"
        :on-error="handleError"
        :file-list="fileList"
        :auto-upload="false"
        :headers="herderObject"
        accept=".pdf"
        :limit="1"
      >
        <el-button slot="trigger" size="small" type="primary"
          >选取文件</el-button
        >
        <el-button
          style="margin-left: 10px"
          size="small"
          type="success"
          @click="submitUpload"
          >上传到服务器</el-button
        >
        <div slot="tip" class="el-upload__tip">
          只能上传pdf文件，且只能单个上传
        </div>
      </el-upload>
      <!-- 表格 -->
      <el-table :data="statesList" border stripe>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="文件名" prop="pdfName"></el-table-column>
        <el-table-column label="时间" prop="time"></el-table-column>
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
                @click="showEditDialog(scope.row.id)"
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
                @click="removeRequestById(scope.row.id)"
              >
              </el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
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
        <el-form-item label="编号" prop="id">
          <el-input v-model="editForm.id" disabled></el-input>
        </el-form-item>
        <el-form-item label="动态名称" prop="pdfName">
          <el-input v-model="editForm.pdfName"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getStateInfo,
  getPersonStateInfo,
  updateStateInfo,
  deleteStateInfo,
} from "../../../api/State";
export default {
  created() {
    this.getStateList();
  },
  name: "StateSecond",
  data() {
    return {
      actionUrl: "http://127.0.0.1:5001/upload",
      fileList: [],
      herderObject: {
        Authorization: window.sessionStorage.getItem("token"),
      },
      // 表格
      queryInfo: {
        query: "",
        // 当前的页数
        pageNum: 1,
        // 当前每页显示多少条
        pageSize: 10,
      },
      statesList: [],
      total: 0,
      // 修改用户对话框的显示/隐藏
      editDialogVisible: false,
      // 修改用户查询的表单数据
      editForm: {
        id: "",
        pdfName: "",
      },
      editFormRules: {
        id: [{ required: true, message: "请输入用户名", trigger: "blur" }],
        pdfName: [{ required: true, message: "请输入学院", trigger: "blur" }],
      },
    };
  },
  methods: {
    handleRemove(file, fileList) {
      console.log(file, "@@", fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    handleExceed(files, fileList) {
      this.$message.error(
        `当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${
          files.length + fileList.length
        } 个文件`
      );
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    handleSuccess(response, file, fileList) {
      this.$message.success("上传成功");
      console.log(response, file, fileList);
    },
    handleError(err, file, fileList) {
      console.log("上传失败");
    },
    submitUpload() {
      this.$refs.upload.submit();
    },
    // 表格
    // 监听的pageSize
    async getStateList() {
      getStateInfo(this.queryInfo).then((data) => {
        const { status, result, total } = data.data;
        if (status !== 2001) return this.$message.error("动态列表获取失败");
        this.statesList = result;
        this.total = total;
      });
    },
    handleSizeChange(newSize) {
      this.queryInfo.pageSize = newSize;
      this.getStateList();
    },
    // 监听pageNum
    handleCurrentChange(newPage) {
      this.queryInfo.pageNum = newPage;
      this.getStateList();
    },
    // 监听修改对话框的关闭事件
    editDialogClosed() {
      this.$refs.editFormRef.resetFields();
    },
    // 展示修改用户信息
    async showEditDialog(id) {
      this.editDialogVisible = true;
      getPersonStateInfo(id).then((data) => {
        const { status, result } = data.data;
        if (status !== 2001) return this.$message.error("查询用户信息失败");
        this.editForm = result[0];
      });
    },
    // 修改用户信息并提交
    editUserInfo() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return;
        // 发起添加用户的网络请求
        updateStateInfo(this.editForm.id, this.editForm.pdfName).then(
          (data) => {
            const { status } = data.data;
            if (status !== 2001) return this.$message.error("修改用户信息失败");
            this.$message.success("修改用户信息成功");
          }
        );
      });
      this.editDialogVisible = false;
      this.getStateList();
    },
    // 删除用户
    async removeRequestById(id) {
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
      deleteStateInfo(id).then((data) => {
        const { status } = data.data;
        if (status !== 2001) return this.$message.error("删除用户失败");
        this.$message.success("删除用户成功");
        this.getStateList();
      });
    },
  },
};
</script>

<style></style>
