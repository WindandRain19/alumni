<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/Home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>留言板管理</el-breadcrumb-item>
      <el-breadcrumb-item>留言板管理</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区 -->
    <div class="box-card-fs">
      <el-table :data="ForumList" style="width: 100%" max-height="800">
        <el-table-column fixed label="#" type="index" width="100">
        </el-table-column>
        <el-table-column prop="time" label="时间" width="200">
        </el-table-column>
        <el-table-column prop="name" label="姓名" width="120">
        </el-table-column>
        <el-table-column prop="article" label="文字" width="300">
        </el-table-column>
        <el-table-column prop="pic1" label="图片1" width="200">
          <template slot-scope="scope">
            <el-image v-if="(scope.row.pic1==null)? false:true" :src="img1 + scope.row.pic1" :preview-src-list="[img1+scope.row.pic1]" style="width: 150px;height:150px;"></el-image>
          </template>
        </el-table-column>
        <el-table-column prop="pic2" label="图片2" width="200">
          <template slot-scope="scope">
            <el-image v-if="(scope.row.pic2==null)? false:true" :src="img2 + scope.row.pic2" :preview-src-list="[img2+scope.row.pic2]" style="width: 150px;height:150px;"></el-image>
          </template>
        </el-table-column>
        <el-table-column prop="pic3" label="图片3" width="200">
          <template slot-scope="scope">
            <el-image v-if="(scope.row.pic3==null)? false:true" :src="img3 + scope.row.pic3" :preview-src-list="[img3+scope.row.pic3]" style="width: 150px;height:150px;"></el-image>
          </template>
        </el-table-column>
        <el-table-column prop="pic4" label="图片4" width="200">
          <template slot-scope="scope">
            <el-image v-if="(scope.row.pic4==null)? false:true" :src="img4 + scope.row.pic4" :preview-src-list="[img4+scope.row.pic4]" style="width: 150px;height:150px;"></el-image>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="100">
          <template slot-scope="scope">
            <el-button
              @click="handleRemove(scope.row.idForum)"
              type="danger"
              size="small"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { getForumInfo, deleteForum } from "../../../api/Forum";
export default {
  created() {
    this.getForum();
  },
  name: "ForumSecond",
  data() {
    return {
      ForumList: [],
      img1: process.env.VUE_APP_UPLOAD_URL_FORUM_PICTURE1,
      img2: process.env.VUE_APP_UPLOAD_URL_FORUM_PICTURE2,
      img3: process.env.VUE_APP_UPLOAD_URL_FORUM_PICTURE3,
      img4: process.env.VUE_APP_UPLOAD_URL_FORUM_PICTURE4,
    };
  },
  methods: {
    getForum() {
      getForumInfo().then((data) => {
        if (data.data.status !== 2001) {
          this.$message.error("数据获取失败");
        } else {
          this.ForumList = data.data.result;
          this.$message.success("数据获取成功");
        }
      });
    },
    // 删除留言
    async handleRemove(idForum) {
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
      deleteForum(idForum).then((data) => {
        if (data.data.status !== 2001)
          return this.$message.error("删除用户失败");
        this.$message.success("删除用户成功");
        this.getForum();
      });
    },
  },
};
</script>

<style scoped>
.box-card-fs {
  width: 1400px;
  background-color: rgba(255, 255, 255, 0.4);
  box-shadow: 0px 0px 27px 0px rgba(148, 192, 253, 0.28);
  padding: 20px;
  margin: 0 auto;
  border-radius: 10px;
}
</style>
