<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/Home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>校友风采管理</el-breadcrumb-item>
      <el-breadcrumb-item>校友风采管理</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 提交校友风采 -->
    <div class="box-card-fs">
      <el-form
        ref="showRef"
        :model="showForm"
        label-width="80px;"
        style="border: 1px solid rgb(225, 225, 225, 1); padding-left: 10px"
      >
        <el-form-item label="图片">
          <el-upload
            class="avatar-uploader"
            ref="picUpload"
            :action="picUrl"
            :auto-upload="false"
            :limit="1"
            :multiple="false"
            accept=".jpg,.png"
            :on-remove="handleRemove"
            :on-change="handlePreview"
            list-type="picture"
          >
            <i v-show="!show" class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="showForm.name" style="width: 30%"></el-input>
        </el-form-item>
        <el-form-item label="简介">
          <el-input v-model="showForm.info" style="width: 40%"></el-input>
        </el-form-item>
        <el-form-item label="文件">
          <el-upload
            class="upload-demo"
            ref="pdfUpload"
            :action="actionUrl"
            :file-list="fileList"
            :auto-upload="false"
            accept=".pdf"
            :limit="1"
          >
            <el-button slot="trigger" size="small" type="primary"
              >选取文件</el-button
            >
            <div slot="tip" class="el-upload__tip">
              只能上传pdf文件，且只能单个上传
            </div>
          </el-upload>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="formSubmit">立即创建</el-button>
        </el-form-item>
      </el-form>

      <!-- 搜索 -->
      <div class="search">
        <el-row :gutter="20">
          <el-col :span="7">
            <el-input
              placeholder="请输入姓名"
              v-model="queryInfo.query"
              clearable
              @clear="getShowList"
            >
              <el-button
                slot="append"
                icon="el-icon-search"
                @click="getShowList"
              ></el-button> </el-input
          ></el-col>
        </el-row>
      </div>

      <!-- 校友风采列表区 -->
      <el-table :data="showUsersList" border stripe>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="图片">
          <template slot-scope="scope">
            <el-image
              :src="imgUrl + scope.row.picName"
              :preview-src-list="[imgUrl + scope.row.picName]"
              style="width: 150px; height: 150px"
            ></el-image>
          </template>
        </el-table-column>
        <el-table-column label="姓名" prop="name"></el-table-column>
        <el-table-column label="简介" prop="info"> </el-table-column>
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

    <!-- 修改风采对话框 -->
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
        <el-form-item label="姓名" prop="name">
          <el-input v-model="editForm.name"></el-input>
        </el-form-item>
        <el-form-item label="简介" prop="info">
          <el-input v-model="editForm.info"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editShowInfo()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getShowInfo,
  postShowInfo,
  getPersonShowInfo,
  UpdateShowInfo,
  deleteShowInfo,
} from "../../../api/Show";
export default {
  created() {
    this.getShowList();
  },
  name: "ShowSecond",
  data() {
    return {
      showForm: {},
      // 图片
      picUrl: process.env.VUE_APP_BASE_API + "/sh/uploadShowP",
      actionUrl: process.env.VUE_APP_BASE_API + "/sh/uploadShowD",
      imageUrl: "",
      dialogImageUrl: "",
      dialogVisible: false,
      fileList: [],
      // 获取用户列表
      queryInfo: {
        query: "",
        // 当前的页数
        pageNum: 1,
        // 当前每页显示多少条
        pageSize: 2,
      },
      showUsersList: [],
      total: 0,
      imgUrl: process.env.VUE_APP_UPLOAD_URL_SHOW_PICTURES,
      pdfUrl: process.env.VUE_APP_UPLOAD_URL_SHOW_DOCUMENT,
      // 修改用户对话框的显示/隐藏
      editDialogVisible: false,
      // 修改用户查询的表单数据
      editForm: {
        id: "",
        name: "",
        info: "",
      },
      editFormRules: {
        id: [{ required: true, message: "请输入用户名", trigger: "blur" }],
        name: [{ required: true, message: "请输入学院", trigger: "blur" }],
        info: [{ required: true, message: "请输入学院", trigger: "blur" }],
      },
      show: false,
    };
  },
  methods: {
    formSubmit() {
      postShowInfo(this.showForm).then((data) => {
        const { status } = data.data;
        if (status == 2001) {
          this.$refs.picUpload.submit();
          this.$refs.pdfUpload.submit();
          setTimeout(() => {
            this.$message.success("上传成功");
            this.getShowList();
          }, 1000);
        } else {
          this.$message.error("上传失败");
        }
      });
    },
    getShowList() {
      getShowInfo(this.queryInfo).then((data) => {
        const { status, result, total } = data.data;
        if (status !== 2001) return this.$message.error("用户列表获取失败");
        this.showUsersList = result.reverse();
        this.total = total;
      });
    },
    //   头像
    handlePreview(file, fileList) {
      if (fileList.length > 0) {
        this.show = true;
      }
      this.$message.success("选择图片成功");
    },
    handleRemove(file, fileList) {
      if (fileList.length < 1) {
        this.show = false;
      }
    },
    handleSizeChange(newSize) {
      this.queryInfo.pageSize = newSize;
      this.getShowList();
    },
    // 监听pageNum
    handleCurrentChange(newPage) {
      this.queryInfo.pageNum = newPage;
      this.getShowList();
    },
    // 监听修改对话框的关闭事件
    editDialogClosed() {
      this.$refs.editFormRef.resetFields();
    },
    // 展示修改用户信息
    showEditDialog(id) {
      this.editDialogVisible = true;
      getPersonShowInfo(id).then((data) => {
        const { status, result } = data.data;
        if (status !== 2001) return this.$message.error("查询用户信息失败");
        this.editForm = result[0];
      });
    },
    // 修改用户信息并提交
    editShowInfo() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return;
        // 发起添加用户的网络请求
        UpdateShowInfo(this.editForm.id, this.editForm).then((data) => {
          const { status } = data.data;
          if (status !== 2001) return this.$message.error("修改用户信息失败");
          this.$message.success("修改用户信息成功");
        });
      });
      this.editDialogVisible = false;
      this.getShowList();
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
      deleteShowInfo(id).then((data) => {
        const { status } = data.data;
        if (status !== 2001) return this.$message.error("删除用户失败");
        this.$message.success("删除用户成功");
        this.getShowList();
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
.box-card-fs {
  width: 1200px;
  background-color: rgba(255, 255, 255, 0.6);
  box-shadow: 0px 0px 27px 0px rgba(148, 192, 253, 0.28);
  padding: 20px;
  margin: 0 auto;
  border-radius: 10px;
}
</style>
