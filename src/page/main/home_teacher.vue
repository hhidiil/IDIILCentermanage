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
    <el-row style="display:flex;align-items: center;justify-content: center;height: 90%;" :gutter="20">
      <el-col class="centerDiv" :xs="24" :sm="18" :md="18" :lg="16" :xl="16">
        <el-col :xs="12" :sm="8" :md="8" :lg="8" :xl="8" class="leftsection" >
          <el-card class="box-card el-col-12 el-col-xs-22 el-col-sm-20 el-col-md-20 el-col-lg-20 el-col-xl-12">
            <div class="headerbgcolor">
            </div>
            <div class="content">
              <div class="centertext " @click="goSys('1')">中考批改系统</div>
            </div>
          </el-card>
        </el-col>
        <el-col  :xs="12" :sm="8" :md="8" :lg="8" :xl="8" class="centersection" >
          <el-card class="box-card el-col-12 el-col-xs-22 el-col-sm-20 el-col-md-20 el-col-lg-20 el-col-xl-12">
            <div class="headerbgcolor">
            </div>
            <div class="content">
              <div class="centertext" @click="goSys('2')">发现式教学</div>
            </div>
          </el-card>
        </el-col>
        <el-col  :xs="12" :sm="8" :md="8" :lg="8" :xl="8" class="rightsection">
          <el-card class="box-card el-col-12 el-col-xs-22 el-col-sm-20 el-col-md-20 el-col-lg-20 el-col-xl-12">
            <div class="headerbgcolor">
            </div>
            <div class="content">
              <!--<div class="centertext" @click="goSys('3')">新增入口1</div>-->
              <!--router.push()-->
              <router-link :to="{path:'/test/test/abc',query:{name:'children'}}" tag="p"> child </router-link>

              <!--router.replace()-->
              <router-link :to="{path:'/test/test/abc',query:{name:'children'}}" replace> child </router-link>
            </div>
          </el-card>
        </el-col>
        <el-col  :xs="12" :sm="8" :md="8" :lg="8" :xl="8" class="rightsection">
          <el-card class="box-card el-col-12 el-col-xs-22 el-col-sm-20 el-col-md-20 el-col-lg-20 el-col-xl-12">
            <div class="headerbgcolor">
            </div>
            <div class="content">
              <div class="centertext" @click="goSys('3')">新增路由</div>
            </div>
          </el-card>
        </el-col>

      </el-col>
    </el-row>
  </section>
</template>

<script type="text/ecmascript-6">
  import headHop from '../../components/headTop'
  import {doTestLogin} from '../../api/user'
  import {getCurrentCourseInfo,getClassList} from '../../api/classes'
  import {getStore,setStore,clearStore} from '../../config/publicMethod'
  import fullpath from '../../data/routes.json'

  setStore('rou',fullpath)
  export default {
    data(){
      return {
        message:"首页页面",
        userInfo:null,
        fullpath:null
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
            window.open("http://" + location.hostname + ":10008/teacher");//跳转到中考教师批改系统
            break;
          case '2':
            let userInfo = this.userInfo;
            console.log("用户信息参数---222222222222--》",userInfo)
            const dataUserList = await doTestLogin('/static/ClassUserList.json');
            setStore("ClassUserList",dataUserList);
            //console.log( this.$store.state )
            window.location.href = origin + "/faXianShiShuXue.html#/home";//跳转到数学派课系统
            break;
          case '3':
            //this.$router.push('/')
            function getViews(path) {
              return resolve => {
                require.ensure([], (require) => {
                  resolve(require('@/page/' + path + '.vue'))
                })
              }
            }

            let routers = JSON.parse( getStore('rou') );
            let permissionsData = routers[0].rootList;
            let dataRouter = [];
            //循环遍历动态路由表的每一个路由
            for (let i=0;i<permissionsData.length;i++){
              let data = {};
              data['path'] = permissionsData[i].path;
              data['name'] = permissionsData[i].name;
              data['component'] = getViews(permissionsData[i].component);
              dataRouter.push(data);
            }

            // 将路由信息，菜单信息，用户信息存到sessionStorage里
            sessionStorage.setItem("routes", JSON.stringify(permissionsData));
            //动态添加路由信息
            this.$router.addRoutes(dataRouter);
            global.antRouter =  dataRouter;
            //this.$router.push({path:'/'})
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
  .home_teacher_section{
    position: relative;
    height: 100%;
    background-color: rgba(244, 67, 54, 0.2);
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
    margin:0 auto;
  /*position: absolute;*/
  /*width: 65%;*/
  /*height: 500px;*/
  /*left: 50%;*/
  /*top: 50%;*/
  /*transform: translate(-50%,-50%);*/
  .leftsection{
    display:flex;
    margin-bottom:10px;
  .headerbgcolor{
    height: 74px;
    width: 74px;
    background: url(../../../static/images/foreigner1.png) no-repeat;
    background-size:contain;
    margin:0 auto;
  }
  }
  .centersection{
    display:flex;margin-bottom:10px;
  .headerbgcolor{
    height: 74px;
    width: 74px;
    background: url(../../../static/images/foreigner2.png) no-repeat;
    background-size:contain;
    margin:0 auto;
  }
  }
  .rightsection{
    display:flex;margin-bottom:10px;
  .headerbgcolor{
    height: 74px;
    width: 74px;
    background: url(../../../static/images/foreigner3.png) no-repeat;
    background-size:contain;
    margin:0 auto;
  }
  }
  .box-card{
    margin:0 auto;
  }
  .content {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 48px;
    height: 10.5rem;
  .centertext{

    cursor: pointer;
    font-size:1.3rem;
  }
  }
  }
  }
</style>
