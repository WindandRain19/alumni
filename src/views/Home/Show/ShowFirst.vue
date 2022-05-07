<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/Home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>校友风采管理</el-breadcrumb-item>
      <el-breadcrumb-item>校友风采</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片 -->
    <div class="box-card-sf">
      <!-- 校友风采列表去 -->
      <el-table :data="showUsersList" border stripe>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="图片" width="200px">
          <template slot-scope="scope">
            <el-image
              :src="imgUrl + scope.row.picName"
              style="width: 150px"
              :preview-src-list="[imgUrl + scope.row.picName]"
            ></el-image>
          </template>
        </el-table-column>
        <el-table-column
          label="姓名"
          width="120px"
          prop="name"
        ></el-table-column>
        <el-table-column label="简介" prop="info"> </el-table-column>
        <el-table-column label="操作" width="120px">
          <template slot-scope="scope">
            <el-tooltip
              effect="dark"
              content="查看"
              placement="top-start"
              :enterable="false"
            >
              <a :href="pdfUrl + scope.row.pdfName" target="_blank">
                <el-button
                  type="primary"
                  icon="el-icon-reading"
                  size="mini"
                ></el-button
              ></a>
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
  </div>
</template>

<script>
import { getShowInfo, getPersonShowInfo } from "../../../api/Show";
export default {
  created() {
    this.getShowList();
  },
  name: "ShowFirst",
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
      showUsersList: [],
      total: 0,
      imgUrl: process.env.VUE_APP_UPLOAD_URL_SHOW_PICTURES,
      pdfUrl: process.env.VUE_APP_UPLOAD_URL_SHOW_DOCUMENT,
      // 图片列表
      srcList: [],
    };
  },
  methods: {
    getShowList() {
      getShowInfo(this.queryInfo).then((data) => {
        const { status, total, result } = data.data;
        if (status !== 2001) return this.$message.error("用户列表获取失败");
        this.showUsersList = result;
        this.total = total;
      });
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
  },
};
</script>

<style>
.box-card-sf {
  width: 1200px;
  background-color: rgba(255, 255, 255, 0.6);
  box-shadow: 0px 0px 27px 0px rgba(148, 192, 253, 0.28);
  padding: 20px;
  margin: 0 auto;
  border-radius: 10px;
}
</style>
