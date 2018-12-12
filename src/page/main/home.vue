<template>
  <section class="home_section">
    <div class="centerDiv">
      <el-row style="position: relative">
        <el-col :span="12" class="leftsection">
          <el-card class="box-card">
            <div class="headerbgcolor">
            </div>
            <div class="content">
              <div class="centertext" @click="goSys('1')">管理员系统</div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="12" class="rightsection">
          <el-card class="box-card">
            <div class="headerbgcolor">
            </div>
            <div class="content">
              <div class="centertext" @click="goSys('2')">发现式数学课堂</div>
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
  import {getStore,setStore} from '../../config/publicMethod'
  export default {
    data(){
      return {
        message:"首页页面"
      }
    },
    //引入的组件
    components: {
      headHop
    },
    methods:{
      async goSys(param){
//        this.$router.push('manage');
        switch (param){
          case '1':
            break;
          case '2':
            window.location.href = "http://localhost:9999/faXianShiShuXue.html#/home";
            break;
          case '3':
            break;
        }
      },
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
        padding: 50px 100px;
        .headerbgcolor{
          height: 40px;
          background-color: #71b7ee;
        }
      }
      .rightsection{
        height: 500px;
        padding: 50px 100px;
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
          text-align: center;
          width: 240px;
          margin-left: -120px;
          margin-top: -60px;
          cursor: pointer;
        }
      }
    }
  }
</style>
