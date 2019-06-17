<template>
  <section class="home_section">
    <div class="centerDiv">
      <el-row style="position: relative">
        <el-col :span="12" class="leftsection">
          <el-card class="box-card">
            <div class="headerbgcolor">
            </div>
            <div class="content">
              <div class="centertext" @click="goPaiKe()">派 课</div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="12" class="rightsection">
          <el-card class="box-card">
            <div class="headerbgcolor">
            </div>
            <div class="content">
              <div class="centertext" @click="goShangKe()">上 课</div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </section>
</template>

<script type="text/ecmascript-6">
  import headHop from '../../components/headTop'
  import {doLogin,registerUser} from '../../api/user'
  import {getCurrentCourseInfo,getClassList} from '../../api/classes'
  import {getStore,setStore,removeStore} from '../../config/publicMethod'
  export default {
    data(){
      return {
        message:"首页页面",
        userInfo:JSON.parse(getStore('userInfo')),
      }
    },
    //引入的组件
    components: {
      headHop
    },
    mounted(){

    },
    methods:{
      async goPaiKe(){
        this.userInfo.classType = 'sendClass';
        setStore("userInfo",this.userInfo);
        this.removeCurriculumStorage();
        this.$router.push('manage');
      },
      async goShangKe(){
        this.userInfo.classType = 'attendClass';
        setStore("userInfo",this.userInfo);
        this.removeCurriculumStorage();
        this.$router.push('manage/attendClass');
      },
      removeCurriculumStorage(){
        let str1='sendLessonsLists-';
        let str2='sourceLists-';
        for(let i=0;i<window.localStorage.length;i++){
          let okey=window.localStorage.key(i);
          if(okey.indexOf(str1)>-1 || okey.indexOf(str2)>-1){
            removeStore(okey);
            i--;
          }
        }
      }
    }
  }
</script>

<style scoped lang="less" type="text/less">
  @import '../../assets/mixin.less';
  .home_section{
    position: relative;
    height: 100%;
    background-color: rgb(50, 64, 87);
    .centerDiv{
      position: absolute;
      width: 65%;
      height: 500px;
      left: 50%;
      top: 50%;
      transform: translate(-50%,-50%);
      .leftsection{
        height: 500px;
        padding: 50px 50px;
        .headerbgcolor{
          height: 40px;
          background-color: #71b7ee;
        }
      }
      .rightsection{
        height: 500px;
        padding: 50px 50px;
        .headerbgcolor{
          height: 40px;
          background-color: #cd85e2;
        }
      }
      .content {
        position: relative;
        font-size: 48px;
        height: 350px;
        background-color: rgba(248, 241, 225, 1);
        .centertext{
          position: absolute;
          left: 50%;
          top: 50%;
          width: 120px;
          height: 120px;
          margin-left: -60px;
          margin-top: -60px;
          cursor: pointer;
        }
      }
    }
  }
</style>
