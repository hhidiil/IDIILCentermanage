<template>
  <el-container>
    <el-header class="register">
      <el-row>
        <el-col :span="12"><div class="logoSection"><img src="../../../static/images/logo.png"></div></el-col>
        <el-col :span="12"><div class="backSection"><el-button round icon="el-icon-back" @click="BackHandle">圆角按钮</el-button></div></el-col>
      </el-row>
    </el-header>
    <el-main>
      <section class="form_contianer_register">
        <div class="senctionblock">
          <!--  :rules="rules"-->
          <el-form :model="ruleForm" status-icon  ref="submitEditForm" label-width="80px" class="demo-ruleForm">
            <el-form-item label="用户ID" prop="UserID">
              <el-input placeholder="请输入昵称" type="text" v-model="ruleForm.UserID"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="Password">
              <el-input type="password" placeholder="请输入密码" v-model="ruleForm.Password" show-password></el-input>
            </el-form-item>
            <el-button @click="submitEdit('submitEditForm')" class="enterButton">提 交</el-button>
          </el-form>
        </div>
      </section>
    </el-main>
  </el-container>
</template>

<script type="text/ecmascript-6">
  import {updateMemberInfo} from '../../api/user'
  import {getClassInfo} from '../../api/classes'
  import {setStore,getStore,clearStore,setSession,getSession} from '../../config/publicMethod'
  import {getAreaList} from '../../api/common'
  export default {
    name: 'door',
    data () {
      return {
        DistinctName:'',
        provinceDate:[],cityDate:[],areaDate:[],
        provinceOptions:[],cityOptions:[],areaOptions:[],
        ruleForm: {
          UserID:'',
          Password:'',
        },
        rules: {
          UserID: [
            { required: true, message: '请输入用户ID', trigger: 'blur' },
          ],
          Password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
          ],
        }
      }
    },
    mounted(){
    },
    methods:{
      async submitEdit(formName){
        this.$refs[formName].validate(async(valid) => {
          if (valid) {
            let params = this.ruleForm;
            console.log( params )
             let result = await updateMemberInfo(params);
            if(result.code == 200){
              this.$router.push('/');
            }else {
              alert('注册信息出错')
            }
          } else {
            console.error('error edit submit!!');
            return false;
          }
        });
      },
      BackHandle(){
        this.$router.back();
      },
      async selectProvince(val){//选择了省份
        this.cityOptions=[];
        let result = await getAreaList();
        result.data.map( (item,index)=>{
          if( item.ParentId == val ){//省
            this.cityOptions.push( item )
          }
        })
      },
      visibleChangeProvince(){
        this.cityDate=null;
        this.areaDate=null;
      },
      visibleChangeCity(){
        this.areaDate=null;
      },
      async selectCity(val){
        this.areaOptions=[];
        let result = await getAreaList();
        result.data.map( (item,index)=>{
          if( item.ParentId == val ){//市
            this.areaOptions.push( item )
          }
        })
      },
      async selectArea(row){
        this.ruleForm.DistinctName = null;
        this.ruleForm.DistinctID =null;

        this.DistinctName=row.Name;
        this.ruleForm.DistinctName = row.MergerName;
        this.ruleForm.DistinctID = row.ID
        console.log(row)
      },
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less" type="text/less">
  @import '../../assets/mixin.less';
  .register{
    background-color: #337cac;
  .logoSection{
    float: left;
  }
  .backSection{
    float: right;
    margin-top: 10px;
  }
  }
  .senctionblock{
    position: relative;
    width: 100%;
    background-color: white;
  }
  .form_contianer_register{
    width: 520px;
    min-height: 210px;
    position: absolute;
    top: 25%;
    left: 50%;
    margin-top: -105px;
    margin-left: -260px;
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
  }
</style>
