<template>
  <section class="home_section">
    <div class="home_section_in">
      <div class="centerDiv">
        <div class="centerDivIn">
          <el-row>
            <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="btnsection">
              <el-card class="box-card" @click.native="goPaiKe()">
                <div class="headerbgcolor">
                </div>
                <div class="content">
                  <div class="centertext">派 课</div>
                </div>
              </el-card>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="btnsection">
              <el-card class="box-card" @click.native="goShangKe()">
                <div class="headerbgcolor">
                </div>
                <div class="content">
                  <div class="centertext">上 课</div>
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
    height: 100%;
    width: 100%;
    overflow: auto;
    background-color: #324057;
    .home_section_in{
      /*display: flex;*/
      /*flex-direction: column;*/
      /*height: 100%;*/
      .centerDiv{
        height: 100%;
        display:flex;
        justify-content: center;
        align-items: center;
        margin-top: 100px;
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
