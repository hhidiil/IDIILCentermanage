<template>
  <section class="home_teacher_section">
    <header>
      <el-row>
        <el-col :span="24">
          <div class="headertext">教师首页</div>
        </el-col>
      </el-row>
      <el-button class="returnBack" @click="returnBack()">返回</el-button>
    </header>
    <el-row class="centerDiv">
      <el-col :span="12" class="section">
        <el-card class="box-card">
          <div class="headerbgcolor leftS">
          </div>
          <div class="content">
            <div class="centertext" @click="goSys('1')">中考批改系统</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12" class="section">
        <el-card class="box-card">
          <div class="headerbgcolor rightS">
          </div>
          <div class="content">
            <div class="centertext" @click="goSys('2')">教师派课系统</div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </section>
</template>

<script type="text/ecmascript-6">
  import headHop from '../../components/headTop'
  import {doTestLogin} from '../../api/user'
  import {getCurrentCourseInfo} from '../../api/classes'
  import {getStore,setStore,clearStore} from '../../config/publicMethod'
  import { baseUrl } from '../../config/env'
  export default {
    data(){
      return {
        message:"首页页面",
        userInfo:null
      }
    },
    //引入的组件
    components: {
      headHop
    },
    mounted(){
      this.userInfo = this.$route.params;
      console.log("用户信息参数-----》",this.userInfo,this.$route.params)
    },
    methods:{
      async goSys(param){
        let location = window.location;
        let origin = window.location.origin;
        console.log("window.location--,--origin",window.location,origin)
        switch (param){
          case '1':
            let url =  baseUrl + ":10008/teacher"
            window.open(url);//跳转到中考教师批改系统
            break;
          case '2':
            let userInfo = this.userInfo;
            console.log("用户信息参数---222222222222--》",userInfo)
            const dataUserList = await doTestLogin('/static/ClassUserList.json');
            setStore("ClassUserList",dataUserList);
            window.location.href = origin + "/faXianShiShuXue.html#/home";//跳转到数学派课系统
            break;
          default:
            break;
        }
      },
    returnBack(){
      console.log("返回上一层")
      this.$router.push({name:'door'});
//      this.$router.back();
    }
    }
  }
</script>

<style scoped lang="less" type="text/less">
  @import '../../assets/mixin.less';
  .home_teacher_section{
    position: relative;
    height: 100%;
    background-color: rgb(50, 64, 87);
    overflow: auto;
    header .headertext{
      font-size: 30px;
      color: white;
      padding: 15px;
    }
    .returnBack{
      position: absolute;
      right: 35px;
      top: 20px;
    }
  .centerDiv{
    position: absolute;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    width: 100%;
    height: 500px;
    top: 50%;
    -webkit-transform: translateY(-50%);
    transform: translateY(-50%);
    .section{
      width: 450px;
      padding: 50px;
      .headerbgcolor{
        height: 40px;
        width: 100%;
      }
      .leftS{
        background-color: #71b7ee;
      }
      .rightS{
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
