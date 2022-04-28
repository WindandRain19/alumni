<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/Home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>留言板管理</el-breadcrumb-item>
      <el-breadcrumb-item>留言板</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区 -->
    <el-card class="box-card card">
      <div class="ForumFirst_header">
        <el-button type="" icon="el-icon-edit" circle @click="showEditDialog"></el-button>
        <el-button
          type=""
          icon="el-icon-picture-outline"
          circle
          @click="showEditDialog1"
        ></el-button>
      </div>
      <div class="box" v-for="(item,index) in data" :key="index">
        <div class="box_left">
          <div class="name">{{item.name}}</div>
          <div class="photo">
            <img :src="photoImg + item.photo" alt="" />
          </div>
        </div>
        <div class="box_right">
          <div class="article">
            <span>{{item.article}}</span>
          </div>
          <div class="picture">
            <el-image class="img" v-if="(item.pic1==null)? false:true" :src="img1+item.pic1"></el-image>
            <el-image class="img" v-if="(item.pic2==null)? false:true" :src="img2+item.pic2"></el-image>
            <el-image class="img" v-if="(item.pic3==null)? false:true" :src="img3+item.pic3"></el-image>
            <el-image class="img" v-if="(item.pic4==null)? false:true" :src="img4+item.pic4"></el-image>
          </div>
          <div class="footer">
            <div class="footer_left">{{item.time}}</div>
            <div class="footer_right">
              <div class="footer_right1">
                <i class="el-icon-star-on iStyle" @click="handleGive(item.give,item.time)">{{item.give}}</i>
              </div>
              <div class="footer_right2"></div>
            </div>
          </div>
        </div>
      </div>
    </el-card>

    <!-- 单文本 -->
    <el-dialog
      title="发布文字"
      :visible.sync="editDialogVisible"
      width="70%"
    >
        <el-form ref="editForm" :model="editForm" label-width="80px">
          <el-form-item label="发布信息">
            <el-input v-model="editForm.article"></el-input>
          </el-form-item>
        </el-form>
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="fontSubmit"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <!-- 带图 -->
        <el-dialog
      title="提示"
      :visible.sync="editDialogVisible2"
      width="70%"
    >
        <el-form ref="editForm1" :model="editForm2" label-width="80px">
          <el-form-item label="发布信息">
            <el-input v-model="editForm2.article"></el-input>
          </el-form-item>
          <el-form-item label="图片">
            <el-upload
            class="upload-demo"
            ref="pic1Upload"
            list-type="picture-card"
            :action="actionUrl1"
            :auto-upload="false"
            :on-change="handleChao"
            :headers="herderObject"
            accept=".jpg"
            :limit="1"
              >
            </el-upload>
          </el-form-item>
          <el-form-item label="图片">
            <el-upload
            class="upload-demo"
            ref="pic2Upload"
            list-type="picture-card"
            :action="actionUrl2"
            :auto-upload="false"
            :on-change="handleChao"
            :headers="herderObject"
            accept=".jpg"
            :limit="1"
              >
            </el-upload>
          </el-form-item>
          <el-form-item label="图片">
            <el-upload
            class="upload-demo"
            ref="pic3Upload"
            list-type="picture-card"
            :action="actionUrl3"
            :auto-upload="false"
            :on-change="handleChao"
            :headers="herderObject"
            accept=".jpg"
            :limit="1"
              >
            </el-upload>
          </el-form-item>
          <el-form-item label="图片">
            <el-upload
            class="upload-demo"
            ref="pic4Upload"
            list-type="picture-card"
            :action="actionUrl4"
            :auto-upload="false"
            :on-change="handleChao"
            :headers="herderObject"
            accept=".jpg"
            :limit="1"
              >
            </el-upload>
          </el-form-item>
        </el-form>
        <el-button @click="editDialogVisible2 = false">取 消</el-button>
        <el-button type="primary" @click="submit1"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  created(){
    this.getForum()
  },
  name: "ForumFirst",
  data(){
    return{
      editDialogVisible:false,
      editForm:{},
      editDialogVisible2:false,
      editForm2:{},
      actionUrl1:"http://127.0.0.1:5001/Home/ForumSecond/upload1",
      actionUrl2:"http://127.0.0.1:5001/Home/ForumSecond/upload2",
      actionUrl3:"http://127.0.0.1:5001/Home/ForumSecond/upload3",
      actionUrl4:"http://127.0.0.1:5001/Home/ForumSecond/upload4",
      herderObject: {
        Authorization: window.sessionStorage.getItem("token"),
      },
      data:{},
      photoImg:process.env.VUE_APP_UPLOAD_URL_SHOW_PICTURES,
      img1:process.env.VUE_APP_UPLOAD_URL_FORUM_PICTURE1,
      img2:process.env.VUE_APP_UPLOAD_URL_FORUM_PICTURE2,
      img3:process.env.VUE_APP_UPLOAD_URL_FORUM_PICTURE3,
      img4:process.env.VUE_APP_UPLOAD_URL_FORUM_PICTURE3,
      give:"",

    }
  },
  methods:{
    async handleGive(give,time){
      const {data : res } = await this.$http.post("/Home/ForumSecond/give",{
        give,time
      });
      if (res.meta.status == 200) {
        this.getForum()
      }
    },
    async getForum(){
      const {data : res } = await this.$http.get("/Home/ForumSecond")
      if (res.meta.status!==200) {
        this.$message.error('数据获取失败')
      }else{
        this.data=res.data
      }
    },
    showEditDialog(){
      this.editDialogVisible=true
    },
    showEditDialog1(){
      this.editDialogVisible2=true
    },
    handleChao(file,fileList){
      if (fileList.length>=1) {
        this.$message.warning('每次选图最多为1');
      }
    },
    async fontSubmit(){
      let number = window.sessionStorage.getItem('number')
      console.log(number);
     const { data: res } = await this.$http.post("/Home/ForumSecond", {
        data: this.editForm,
        number
      });
      if (res.meta.status!==200) {
        this.$message.error('文字发布失败')
      }else{
        this.$message.success('文字发布失败成功')
        this.editDialogVisible = false
        this.getForum()
      }
      
    },
    async submit1(){
      let number = window.sessionStorage.getItem('number')
      const { data: res } = await this.$http.post("/Home/ForumSecond/up", {
        data: this.editForm2,
        number
      });
      if (res.meta.status!==200) {
        this.$message.error('图片发布失败')
      }else{
        this.$refs.pic1Upload.submit()
        this.$refs.pic2Upload.submit()
        this.$refs.pic3Upload.submit()
        this.$refs.pic4Upload.submit()
        this.$message.success('图片发布成功')
        this.editDialogVisible2=false
        this.getForum()
      }
    }

  }
};
</script>

<style scoped>
.ForumFirst_header {
  display: flex;
  justify-content: flex-end;
}
.card{
  background-color: rgba(90,90,54,0.05) 
}
.box {
  display: flex;
  width: 80%;
  margin: 10px auto;
  border-radius: 20px;
  background-color: #fff;
}
.box_left {
  width: 30%;
  display: flex;
  justify-content: flex-start;
}
.box_right {
  width: 70%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.name {
  height: 50px;
  margin-left: 10px;
  margin-top: 20px;
  margin-right: 20px;
  line-height: 50px;
  text-align: right;
}
.photo {
  width: 120px;
  height: 120px;
  margin-right: 20px;
  margin-top: 20px;
  margin-bottom: 20px;
  border-radius: 50%;
}
.photo > img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}
.article {
  width: 90%;
  height: 50px;
}
.article > span {
  font-size: 20px;
}
.picture {
  width: 90%;

}
.picture > .img {
  height: 180px;
  width: 20%;
  margin: 10px;
}
.footer {
  width: 90%;
  height: 50px;
  display: flex;
  justify-content: space-between;
}
.footer_left {
  width: 30%;
  height: 100%;
  line-height: 50px;
  margin-left: 10px;
}
.footer_right {
  width: 60%;
  height: 100%;
  text-align: center;
  line-height: 50px;
  margin-right: 10px;
  display: flex;
  justify-content: flex-end;
}

.footer_right1 {
  width: 20%;
  height: 50px;
}

.footer_right1 > i{
  font-size: 32px;
}

.iStyle{
  color: rgb(233, 144, 144)
}

/* .footer_right2 {
  width: 30%;
  background-color: blue;
} */
</style>
