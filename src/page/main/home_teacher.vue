<template>
  <section class="home_section">
    <div class="home_section_in">
      <header>
        <el-row>
          <el-col :span="24">
            <div class="headertext">教师首页</div>
          </el-col>
        </el-row>
        <el-button class="returnBack" @click="returnBack()">返回</el-button>
      </header>
      <div class="centerDiv">
        <div class="centerDivIn">
          <el-row>
            <el-col :xs="24" :sm="8" :md="8" :lg="8" :xl="8" class="btnsection">
              <el-card class="box-card" @click.native="goSys('1')">
                <div class="headerbgcolor">
                </div>
                <div class="content">
                  <div class="centertext">中考批改系统</div>
                </div>
              </el-card>
            </el-col>
            <el-col :xs="24" :sm="8" :md="8" :lg="8" :xl="8" class="btnsection">
              <el-card class="box-card" @click.native="goSys('2')">
                <div class="headerbgcolor">
                </div>
                <div class="content">
                  <div class="centertext">探究发现式数学</div>
                </div>
              </el-card>
            </el-col>
            <el-col :xs="24" :sm="8" :md="8" :lg="8" :xl="8" class="btnsection">
              <el-card class="box-card" @click.native="goSys('3')">
                <div class="headerbgcolor">
                </div>
                <div class="content">
                  <div class="centertext">英语活动课程</div>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
  </section>
</template>

<script type="text/ecmascript-6">
  import headHop from '../../components/headTop'
  import {doTestLogin} from '../../api/user'
  import {getCurrentCourseInfo,getClassList} from '../../api/classes'
  import {getStore,setStore,clearStore} from '../../config/publicMethod'

  export default {
    data(){
      return {
        message:"首页页面",
        userInfo:JSON.parse(getStore('userInfo'))
      }
    },
    //引入的组件
    components: {
      headHop,

    },
    mounted(){
      console.log("用户信息参数-----》",this.userInfo,this.$route.params)
    },
    methods:{
      async goSys(param){
        let location = window.location;
        let origin = window.location.origin;
        console.log("window.location--,--origin",window.location,origin)
        switch (param){
          case '1':
            window.open("http://" + location.hostname + ":10008/teacher");//跳转到中考教师批改系统
            break;
          case '2':
            this.userInfo.CourseType="MM";
            this.userInfo.ClassProgram="DSX";
            setStore("userInfo",JSON.stringify(this.userInfo));
            if(this.userInfo.TeacherType == 'IDIIL'){
              window.location.href = origin + "/faXianShiShuXue.html#/manage/classManagerList";//跳转到数学派课系统
            }else{
              window.location.href = origin + "/faXianShiShuXue.html#/home";//跳转到数学派课系统
            }
            break;
          case '3':
            this.userInfo.CourseType="EE";
            this.userInfo.ClassProgram="HDMY";
            setStore("userInfo",JSON.stringify(this.userInfo));
            if(this.userInfo.TeacherType == 'IDIIL'){
              window.location.href = origin + "/faXianShiShuXue.html#/manage/classManagerList";//跳转到数学派课系统
            }else{
              window.location.href = origin + "/faXianShiShuXue.html#/home";//跳转到数学派课系统
            }
            break;
          default:
            break;
        }
      },
    returnBack(){
      console.log("返回上一层");
      this.$router.push({name:'door'});
    }
    }
  }
</script>

<style scoped lang="less" type="text/less">
  @import '../../assets/mixin.less';

  .home_section{
    height: 100%;
    width: 100%;
    overflow: auto;
    background-color: #324057;
    .home_section_in{
      display: flex;
      flex-direction: column;
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
        display:flex;
        justify-content: center;
        .centerDivIn{
          flex: 1;
          max-width: 1200px;
          .btnsection{
            padding: 50px;
            display:flex;
            justify-content: center;
            .box-card{
              width: 100%;
              max-width:320px;
              cursor: pointer;
              .headerbgcolor{
                height: 40px;
                background-color: #71b7ee;
              }
              .content{
                height: 320px;
                background-color: #f8f1e1;
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: 32px;
              }
            }
          }
        }
      }
    }
  }
</style>
