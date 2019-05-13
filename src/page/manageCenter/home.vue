<template>
  <div class="fillcontain">
    <el-row class="header-css">
      <el-col :span="12"><div class="header-left">管理员系统</div></el-col>
      <el-col :span="12">
        <div class="header-right">
          <el-dropdown trigger="click" @command="handleCommand">
            <el-button type="info" round size="small" class="el-dropdown-link">
              菜单<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="exit">退出</el-dropdown-item>
              <el-dropdown-item command="res">返回</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-col>
    </el-row>
    <el-row style="height: 100%;">
      <el-col :span="3"  style="min-height: 100%; background-color: #324057;">
        <el-menu default-active="1" background-color="rgb(50, 64, 87)" text-color="#bfcbd9" hover-text-color="red" active-text-color="#20a0ff" router>
          <el-submenu index="1" v-if="isSchoolManage">
            <template slot="title"><i class="el-icon-menu"></i><span>中心管理</span></template>
            <el-menu-item v-if="isSub" index="/home/generalCenterList">总中心管理</el-menu-item>
            <!--<el-menu-item index="/home/subCenterList?name=children"> <router-link :to="{path:'/home/subCenterList',query:{name:'children'}}"  tag="li">分中心管理</router-link> </el-menu-item>-->
            <el-menu-item index="/home/subCenterList">分中心管理</el-menu-item>
            <el-menu-item v-if="isSub" index="/home/centerManage">管理员列表</el-menu-item>
          </el-submenu>
          <el-submenu index="2">
            <template slot="title"><i class="el-icon-service"></i><span>学校管理</span></template>
            <el-menu-item index="/home/schoolList">学校列表</el-menu-item>
            <el-menu-item index="/home/classList">班级管理</el-menu-item>
            <el-menu-item index="/home/schoolUserManage">学校用户管理</el-menu-item>
          </el-submenu>
          <el-menu-item index="/home/reportManage"><i class="el-icon-tickets"></i>报表管理</el-menu-item>
        </el-menu>
      </el-col>
      <el-col :span="21" style="height: 100%;overflow: hidden;">
        <router-view></router-view>
      </el-col>
    </el-row>
  </div>
</template>

<script type="text/ecmascript-6">
  import {setStore,getStore,clearStore,setSession,clearSession} from '../../config/publicMethod'
  export default {
    //data中放入初始默认值
    data() {
      return {
        centerId: JSON.parse(getStore('manageUser')).centerId,
        isSub:false,
        isSchoolManage:true
      }
    },
    computed: {
    },
    beforeMount(){
      let userInfo = JSON.parse(getStore('manageUser'));
      console.log('传过来的参数--1111》》',userInfo)

      if(userInfo.permissionLevel == '1'){
        this.isSub = true;
      }else{
        //this.isSub = false;
      }


    },
    mounted(){
      //进入首页的时候存储一个课程列表
      this.getCourseList();
    },
    methods:{
      async getCourseList(){
        console.log("---getCourseList----->>")
      },
      handleCommand(command) {
        if(command == 'exit'){
          clearSession();
          this.$router.replace({path:'/'})
        }
      },
    }
  }
</script>

<style scoped lang="less" type="text/less">
  @import '../../assets/mixin.less';
  .header-css{
    color: white;
    width: 100%;
    height: 50px;
    line-height: 50px;
    background-color: rgb(50, 64, 87);
    border-bottom: 1px solid hsla(0,0%,100%,.1);
  .header-left{
    float: left;
    font-size: 18px;
    margin-left: 40px;
  }
  .header-right{
    float: right;
    margin-right: 20px;
  }
  }
  .el-menu-item:hover{
    background-color: #232e3fa3 !important;
  }
  .el-submenu__title:hover{
    -webkit-transition: border-color .3s,color .3s !important;
    transition: border-color .3s,color .3s !important;
    background-color: #232e3fa3 !important;
  }
</style>
