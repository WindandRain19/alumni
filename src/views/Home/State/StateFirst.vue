<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/Home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>学校动态管理</el-breadcrumb-item>
      <el-breadcrumb-item>学校动态展示</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区 -->
    <el-card class="box-card">
      <!-- 表格 -->
      <el-table :data="statesList" border stripe>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="文件名" prop="pdfName"></el-table-column>
        <el-table-column label="时间" prop="time"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-tooltip
              effect="dark"
              content="查看"
              placement="top-start"
              :enterable="false"
            >
              <a :href="url + scope.row.filename" target="_blank">
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
  </div>
</template>

<script>
export default {
  created() {
    this.getStateList();
  },
  name: "StateFirst",
  data() {
    return {
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
      url: process.env.VUE_APP_UPLOAD_URL,
    };
  },
  methods: {
    // 表格
    // 监听的pageSize
    async getStateList() {
      const { data: res } = await this.$http.get("/Home/stateSecond", {
        params: this.queryInfo,
      });
      if (res.meta.status !== 200)
        return this.$message.error("动态列表获取失败");
      this.statesList = res.data;
      this.total = res.total;
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
  },
};
</script>

<style></style>
