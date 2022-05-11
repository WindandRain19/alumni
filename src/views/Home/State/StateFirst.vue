<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/Home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>学校动态管理</el-breadcrumb-item>
      <el-breadcrumb-item>学校动态展示</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区 -->
    <div class="box-card-statef">
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
    </div>
  </div>
</template>

<script>
import { getStateInfo } from "../../../api/State";
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
      url: process.env.VUE_APP_UPLOAD_URL_STATE,
    };
  },
  methods: {
    // 表格
    // 监听的pageSize
    getStateList() {
      getStateInfo(this.queryInfo).then((data) => {
        if (data.data.status !== 2001)
          return this.$message.error("动态列表获取失败");
        this.statesList = data.data.result;
        this.total = data.data.total;
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
  },
};
</script>

<style>
.box-card-statef {
  width: 1200px;
  background-color: rgba(255, 255, 255, 0.6);
  box-shadow: 0px 0px 27px 0px rgba(148, 192, 253, 0.28);
  padding: 20px;
  margin: 0 auto;
  border-radius: 10px;
}
</style>
