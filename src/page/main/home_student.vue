<template>
  <section class="home_student_section">
    <header>
      <el-row>
        <el-col :span="24">
          <div class="headertext">学生首页</div>
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
            <div class="centertext" @click="goSys('1')">智能中考系统</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12" class="section right">
        <el-card class="box-card">
          <div class="headerbgcolor rightS">
          </div>
          <div class="content">
            <div class="centertext" @click="goSys('2')">发现式数学课堂</div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </section>
</template>

<script type="text/ecmascript-6">
  import headHop from '../../components/headTop'
  import {doTestLogin} from '../../api/user'
  import {filterWebUrl2} from '../../config/methods'
  import {getCurrentCourseInfo,getClassInfo,getDoingCourseInfoOfStudent} from '../../api/classes'
  import {getStore,setStore} from '../../config/publicMethod'
  import { baseUrl_Main,baseUrl_dev,baseUrl } from '../../config/env'
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
        let location = window.location;
        let origin = window.location.origin;
        console.log("window.location--,--origin",window.location,origin)
        switch (param){
          case '1':
            window.open(baseUrl+":10008");//跳转到智能中考系统
            break;
          case '2':
            const userInfo = this.$route.params;
            let dataParams={};
            let dataFlag = this.mainfromFlag;
//            let dataFlag = false;//此处先用假数据
            if(dataFlag){
              const dataList1 = await getDoingCourseInfoOfStudent({studentId:userInfo.userId});
              console.log("dataList1------>>>>",dataList1)
              if(dataList1.code != 200){
                return console.error("数据获取出错",dataList1)
              }
              console.log("dataList1------>>>>",dataList1.data[0])
              const dataList = dataList1.data[0];
              dataParams.teacherId = dataList.teacherId;
              dataParams.CenterID = dataList.centerId;
              dataParams.CenterWeb = baseUrl_dev;
              dataParams.MainWeb = baseUrl_Main;
              dataParams.ClassID = dataList.classId;
              dataParams.CourseType = dataList.courseType;
              dataParams.StudentID = userInfo.userId;
            }else {
              const dataList = await doTestLogin('/static/ClassUserList.json');//本地数据
              dataParams.teacherId = dataList.classList.teacherId;
              dataParams.CenterID = dataList.CenterID;
              dataParams.CenterWeb = dataList.CenterWeb;
              dataParams.ClassID = dataList.ClassID;
              dataParams.CourseType = dataList.CourseType;
              dataParams.MainWeb = dataList.MainWeb;
              dataParams.StudentID = userInfo.userId;
            }
            console.warn("获取课堂数据:::::",userInfo,dataParams)
            let urlEnd = filterWebUrl2(dataParams,"1");
            console.warn("获取课堂地址:::::",urlEnd)
            window.open(urlEnd);//跳转到发现式数学课堂
            break;
          default:
                break;
        }
      },
      returnBack(){
        console.log("返回上一层")
        this.$router.push({name:'door'});
      }
    }
  }
</script>

<style scoped lang="less" type="text/less">
  @import '../../assets/mixin.less';
  .home_student_section{
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
  .rightsection{
    width: 450px;
    padding: 50px;
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
