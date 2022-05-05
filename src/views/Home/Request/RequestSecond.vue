<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/Home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>校友申请管理</el-breadcrumb-item>
      <el-breadcrumb-item>申请列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input
            placeholder="请输入姓名"
            v-model="queryInfo.query"
            clearable
            @clear="getRequestList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getRequestList"
            ></el-button> </el-input
        ></el-col>
      </el-row>
      <!-- 用户列表去 -->
      <el-table :data="requestList" border stripe>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="活动名称" prop="name"></el-table-column>
        <el-table-column label="负责人" width="120px" prop="user"></el-table-column>
        <el-table-column label="电话" prop="telephone"></el-table-column>
        <el-table-column label="活动区域" width="100px" prop="region"></el-table-column>
        <el-table-column label="活动日期" width="120px" prop="date1"></el-table-column>
        <el-table-column label="活动具体时间" width="120px" prop="date2"></el-table-column>
        <el-table-column label="活动性质" prop="type"></el-table-column>
        <el-table-column label="活动简介" prop="introduction"></el-table-column>
        <el-table-column label="状态" width="80px" prop="status">
             <template slot-scope="scope">
        <el-tag
          :type="scope.row.status === '未通过' ? 'danger' : 'success'"
          effect="dark"
          disable-transitions>{{scope.row.status}}</el-tag>
      </template>
        </el-table-column>
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
                @click="removeRequestByUser(scope.row.idRequest)"
              ></el-button>
            </el-tooltip>
            <el-tooltip
              effect="dark"
              content="审批"
              placement="top-start"
              :enterable="false"
            >
              <el-button
                type="info"
                icon="el-icon-s-claim"
                size="mini"
                @click="changeRequestByUser(scope.row.idRequest)"
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
        :rules="formRules"
        label-width="80px"
      >
        <el-form-item label="活动名称" prop="name" required>
          <el-input v-model="editForm.name" style="width: 40%"></el-input>
        </el-form-item>
        <el-form-item label="负责人" prop="user">
          <el-input
            v-model="editForm.user"
            style="width: 40%"
            disabled
          ></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="telephone" required>
          <el-input v-model="editForm.telephone" style="width: 40%"></el-input>
        </el-form-item>
        <el-form-item label="活动区域" prop="region" required>
          <el-select v-model="editForm.region" placeholder="请选择活动区域">
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
                v-model="editForm.date1"
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
                v-model="editForm.date2"
                value-format="HH:mm:ss"
                style="width: 90%"
              ></el-time-picker>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label="活动性质" prop="type" required>
          <el-radio-group v-model="editForm.type">
            <el-radio label="申请入校"></el-radio>
            <el-radio label="线上活动"></el-radio>
            <el-radio label="线下活动"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="活动简介" prop="introduction" required>
          <el-input
            type="textarea"
            v-model="editForm.introduction"
            style="width: 40%"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRequestInfo()">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 审批 -->
    <el-dialog
      title="提示"
      :visible.sync="changeDialogVisible"
      width="30%"
    >
      <el-form         
        ref="changeFormRef"
        :model="changeForm"
        :rules="changeFormRules"
        label-width="80px">
        <el-form-item label="id">
          <el-input v-model="changeForm.idRequest" style="width: 40%" disabled></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="changeForm.status" placeholder="请选择活动区域">
            <el-option label="未通过" value="未通过"></el-option>
            <el-option label="通过" value="通过"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
        <el-button @click="changeDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="changeHandle()"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {getRequestInfo,getPersonRequestInfo,updateRequest,deleteRequestInfo,getIdRequestInfo,updateRequestById} from "../../../api/Request"
export default {
  created() {
    this.getRequestList();
  },
  name: "RequestSecond",
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
      requestList: [],
      total: 0,
      // 修改用户对话框的显示/隐藏
      editDialogVisible: false,
      // 修改用户查询的表单数据
      editForm: {
        name: "",
        user: "",
        telephone: "",
        region: "",
        date1: "",
        date2: "",
        type: "",
        introduction: "",
        status: "",
      },
      formRules: {
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
      // 审批
      changeDialogVisible:false,
      changeForm:{
        idRequest:"",
        status:""
      },
      changeFormRules:{},
    };
  },
  methods: {
    // 获取申请列表
    getRequestList() {
      getRequestInfo(this.queryInfo).then((data)=>{
        const {status,result,total} =data.data
        if (status !== 2001)
          return this.$message.error("用户列表获取失败");
        this.requestList = result;
        this.total = total;
      })
    },
    // 监听的pageSize
    handleSizeChange(newSize) {
      this.queryInfo.pageSize = newSize;
      this.getRequestList();
    },
    // 监听pageNum
    handleCurrentChange(newPage) {
      this.queryInfo.pageNum = newPage;
      this.getRequestList();
    },
    // 监听修改对话框的关闭事件
    editDialogClosed() {
      this.$refs.editFormRef.resetFields();
    },
    // 展示修改用户信息
    showEditDialog(number) {
      this.editDialogVisible = true;
      getPersonRequestInfo(number).then((data)=>{
        
        const{status,result} =data.data
      if (status !== 2001)
        return this.$message.error("查询用户信息失败");
      this.editForm = result[0];
      console.log(this.editForm);
      })
    },
    // 修改用户信息并提交
    editRequestInfo() {
      this.$refs.editFormRef.validate((valid) => {
        if (!valid) return;
        // 发起添加用户的网络请求
        console.log(this.editForm,this.editForm.number);
        updateRequest(this.editForm,this.editForm.number).then((data)=>{
          const {status} =data.data
          if (status !== 2001)
          return this.$message.error("修改用户信息失败");
          this.$message.success("修改用户信息成功");
        });
        this.editDialogVisible = false;
        this.getRequestList();
      })

    },
    // 删除用户
    async removeRequestByUser(idRequest) {
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
      deleteRequestInfo(idRequest).then((data)=>{
        const {status} =data.data
        if (status !== 2001) return this.$message.error("删除用户失败");
        this.$message.success("删除用户成功");
        this.getRequestList();
      })
    },
    // 审批
    changeRequestByUser(idRequest) {
      this.changeDialogVisible=true
      getIdRequestInfo(idRequest).then((data)=>{
        const {status,result} = data.data
        if (status !==2001) return this.$message.error("获取用户失败")
        this.changeForm=result[0]
      })
    },
    changeHandle(){
      updateRequestById(this.changeForm.idRequest,this.changeForm.status).then((data)=>{
        const {status} = data.data
        if (status !==2001) return this.$message.error("提交失败")
        this.$message.success("审批成功")
        this.changeDialogVisible=false
        this.getRequestList();
      })
    }
  },
};
</script>

<style scoped></style>
