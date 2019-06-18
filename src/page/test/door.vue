<template>
  <el-container>
    <el-header class="door">
      <el-row>
        <el-col :span="4"><img src="../../../static/images/logo.png"></el-col>
        <el-col :span="20"><div class="loginButton"></div></el-col>
      </el-row>
    </el-header>
    <el-main>
      <img src="../../../static/images/homeBanner_manage.jpg" class="HomeBanner" />
      <section class="form_contianer">
        <div class="senctionblock">
          <el-row>
            <el-col :span="24"><div class="loginButton">从{{ ids }}传过来{{ name }}参数</div></el-col>
          </el-row>

        </div>
      </section>
    </el-main>
  </el-container>
</template>

<script type="text/ecmascript-6">
  import {doLogin,registerUser} from '../../api/user'
  import {getClassInfo} from '../../api/classes'
  import {setStore,getStore,clearStore,setSession,getSession} from '../../config/publicMethod'
  import Vue from 'vue'
  import Router from 'vue-router'

  Vue.use(Router);
let {routes} = JSON.parse( getSession('routes') );
  export default {
    name: 'door',
    data () {
      return{
        ids:'',
        name:''
      }

    },
    methods:{

    },
    created(){
      let ids = this.$route.params.id;
      console.log(ids,'router params');
      this.ids = ids;
      let name = this.$route.query.name;
      console.log(name,'query params')
      this.name = name;
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less" type="text/less">
  @import '../../assets/mixin.less';
  .door{
    background-color: #337cac;
  }
  .form_contianer .el-row{
    margin: 15px 0;
  }
  .el-main{
    padding: 0;
  }
  .senctionblock{
    position: relative;
    width: 100%;
    background-color: white;
  }
  .HomeBanner{
    width: 100%;
    height: -webkit-fill-available;
    background-size: cover;
  }
  .form_contianer{
    width: 320px;
    min-height: 210px;
    position: absolute;
    top: 25%;
    left: 50%;
    margin-top: -105px;
    margin-left: -185px;
    padding: 25px;
    border-radius: 5px;
    text-align: center;
    background-color: #fff;
    .loginButton{
      font-size: 18px;
      font-weight: 400;
    }
    .enterButton{
      background-color: #00c1de;
      font-size: 20px;
      width: 100%;
      cursor: pointer;
      color: white;
    }
    .registerButton{
      background-color: #7bbf10;
      font-size: 20px;
      width: 100%;
      cursor: pointer;
      color: white;
      margin: 0 !important;
    }
  }
</style>
