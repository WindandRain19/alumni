<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/Home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>留言板管理</el-breadcrumb-item>
      <el-breadcrumb-item>留言板</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区 -->
    <div class="box-card-ff">
      <div class="ForumFirst_header">
        <el-button class="font-button" icon="el-icon-edit" circle @click="showEditDialog"></el-button>
        <el-button
          class="pic-button"
          icon="el-icon-picture-outline"
          circle
          @click="showEditDialog1"
        ></el-button>
      </div>
      <div class="box" v-for="(item,index) in data" :key="index">
        <div class="box_left">
          <div class="name"><span>{{item.name}}</span></div>
          <div class="photo">
            <el-image class="photo-img" :src="photoImg + item.photo" :preview-src-list="[photoImg + item.photo]"></el-image>
          </div>
        </div>
        <div class="box_right">
          <div class="article">
            <span>{{item.article}}</span>
          </div>
          <div class="picture">
            <el-image class="img" v-if="(item.pic1==null)? false:true" :src="img1+item.pic1" :preview-src-list="[img1+item.pic1]"></el-image>
            <el-image class="img" v-if="(item.pic2==null)? false:true" :src="img2+item.pic2" :preview-src-list="[img2+item.pic2]"></el-image>
            <el-image class="img" v-if="(item.pic3==null)? false:true" :src="img3+item.pic3" :preview-src-list="[img3+item.pic3]"></el-image>
            <el-image class="img" v-if="(item.pic4==null)? false:true" :src="img4+item.pic4" :preview-src-list="[img4+item.pic4]"></el-image>
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
    </div>

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
        <el-form ref="editForm1" :model="picForm" label-width="80px">
          <el-form-item label="发布信息">
            <el-input v-model="picForm.article"></el-input>
          </el-form-item>
          <el-form-item label="图片">
            <el-upload
            class="upload-demo"
            ref="pic1Upload"
            list-type="picture"
            :action="actionUrl1"
            :auto-upload="false"
            :on-change="handlePreview1"
            :on-remove="handleRemove1"
            accept=".jpg"
            :limit="1"
              >
              <i v-show="!show1" class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
          <el-form-item label="图片">
            <el-upload
            class="upload-demo"
            ref="pic2Upload"
            list-type="picture"
            :action="actionUrl2"
            :auto-upload="false"
            :on-change="handlePreview2"
            :on-remove="handleRemove2"
            accept=".jpg"
            :limit="1"
              >
              <i v-show="!show2" class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
          <el-form-item label="图片">
            <el-upload
            class="upload-demo"
            ref="pic3Upload"
            list-type="picture"
            :action="actionUrl3"
            :auto-upload="false"
            :on-change="handlePreview3"
            :on-remove="handleRemove3"
            accept=".jpg"
            :limit="1"
              >
              <i v-show="!show3" class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
          <el-form-item label="图片">
            <el-upload
            class="upload-demo"
            ref="pic4Upload"
            list-type="picture"
            :action="actionUrl4"
            :auto-upload="false"
            :on-change="handlePreview4"
            :on-remove="handleRemove4"
            accept=".jpg"
            :limit="1"
              >
              <i v-show="!show4" class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
        </el-form>
        <el-button @click="editDialogVisible2 = false">取 消</el-button>
        <el-button type="primary" @click="picSubmit"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getForumFive,getForumInfo,postFontForum,postPicForum,getPersonForumInfo } from "../../../api/Forum"
import Cookies from "js-cookie";
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
      picForm:{},
      actionUrl1:process.env.VUE_APP_BASE_API+"/fo/uploadPicture1",
      actionUrl2:process.env.VUE_APP_BASE_API+"/fo/uploadPicture2",
      actionUrl3:process.env.VUE_APP_BASE_API+"/fo/uploadPicture3",
      actionUrl4:process.env.VUE_APP_BASE_API+"/fo/uploadPicture4",
      data:{},
      photoImg:process.env.VUE_APP_UPLOAD_URL_HEAD_PORTRAIT,
      img1:process.env.VUE_APP_UPLOAD_URL_FORUM_PICTURE1,
      img2:process.env.VUE_APP_UPLOAD_URL_FORUM_PICTURE2,
      img3:process.env.VUE_APP_UPLOAD_URL_FORUM_PICTURE3,
      img4:process.env.VUE_APP_UPLOAD_URL_FORUM_PICTURE4,
      give:"",
      show1:false,
      show2:false,
      show3:false,
      show4:false,
    }
  },
  methods:{
    handleGive(give,time){
      getForumFive(give,time).then((data)=>{  
        const{status} = data.data
        if (status == 2001) {
          this.getForum()
        }
      })
    },
        //   头像
    handleRemove1(file, fileList) {
      if (fileList.length < 1) {
        this.show1 = false;
      }
    },
    handlePreview1(file,fileList){
      if (fileList.length>0) {
        this.$message.warning('每次选图最多为1');
        this.show1 = true;
      }
    },
    handleRemove2(file, fileList) {
      if (fileList.length < 1) {
        this.show2 = false;
      }
    },
    handlePreview2(file,fileList){
      if (fileList.length>0) {
        this.$message.warning('每次选图最多为1');
        this.show2 = true;
      }
    },
    handleRemove3(file, fileList) {
      if (fileList.length < 1) {
        this.show3 = false;
      }
    },
    handlePreview3(file,fileList){
      if (fileList.length>0) {
        this.$message.warning('每次选图最多为1');
        this.show3 = true;
      }
    },
    handleRemove4(file, fileList) {
      if (fileList.length < 1) {
        this.show4 = false;
      }
    },
    handlePreview4(file,fileList){
      if (fileList.length>0) {
        this.$message.warning('每次选图最多为1');
        this.show4 = true;
      }
    },
    getForum(){
      getForumInfo().then((data)=>{
        let{status,result} = data.data
        if (status!==2001) {
          this.$message.error('数据获取失败')
        }else{
          result = result.reverse()
          this.data=result
        }
      })
    },
    showEditDialog(){
      this.editDialogVisible=true
    },
    showEditDialog1(){
      this.editDialogVisible2=true
    },
    // 文字发布
    fontSubmit(){
      let number = Cookies.get('number')
      postFontForum(this.editForm,number).then((data)=>{
        if (data.data.status!==2001) {
          this.$message.error('文字发布失败')
        }else{
          this.$message.success('文字发布失败成功')
          this.editDialogVisible = false
          this.getForum()
        }
      })
    },
    // 图片发布
    picSubmit(){
      let number = Cookies.get('number')
      postPicForum(this.picForm,number).then((data)=>{
        if (data.data.status!==2001) {
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
      })
    }
  }
};
</script>

<style scoped>
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.box-card-ff{
  width: 1400px;
  background-color: rgba(255, 255, 255, 0.4);
  box-shadow: 0px 0px 27px 0px rgba(148, 192, 253, 0.28);
  padding: 20px;
  margin: 0 auto;
  border-radius: 10px;
}
.ForumFirst_header {
  display: flex;
  justify-content: flex-end;
}
.font-button{
  box-shadow: 0px 0px 27px 0px rgba(148, 192, 253, 0.28);

}
.pic-button{
  box-shadow: 0px 0px 27px 0px rgba(148, 192, 253, 0.28);
  margin-right: 20px;
}
.box {
  display: flex;
  width: 80%;
  margin: 10px auto;
  border-radius: 20px;
  background-color: #fff;
  box-shadow: 0px 0px 27px 0px rgba(148, 192, 253, 0.28);
}
.box_left {
  width: 30%;
  /* display: flex;
  justify-content: flex-start; */
  
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
  line-height: 50px;
  text-align: left;
  font-size: 28px;
  font-weight: 400;
}
.photo {
  width: 120px;
  height: 120px;
  margin: 0 auto;
  border-radius: 50%;
  padding-bottom: 10px;
}
.photo-img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}
.article {
  width: 90%;
  height: 50px;
  margin-left: 10px;
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

</style>
