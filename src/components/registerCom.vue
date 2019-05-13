<template>
  <el-container>
    <el-main>
      <section class="form_contianer_register">
        <div class="senctionblock">
        <!--  :rules="rules"-->
          <el-form :model="ruleForm" status-icon  ref="registerForm" label-width="80px" class="demo-ruleForm">

            <el-form-item label="角色类型:" prop="role">
              <el-radio-group v-model="ruleForm.role" @change="changeRole">
                <el-radio label="0">普通会员</el-radio>
                <el-radio label="1">学生</el-radio>
                <el-radio label="2">教师</el-radio>
                <el-radio label="3">管理员</el-radio>
              </el-radio-group>
              <el-radio-group v-model="ruleForm.Status">
                <el-radio label="1">开启</el-radio>
                <el-radio label="0">关闭</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="用户名:" prop="UserName">
              <el-input type="text" v-model="ruleForm.UserName"></el-input>
            </el-form-item>
            <el-form-item class="area" label="区域:" prop="DistinctName">
              <template style="display: flex;margin-left: 0;">
                <el-select v-model="provinceDate" placeholder="请选择省" @change="selectProvince" @visible-change="visibleChangeProvince">
                  <el-option
                    v-for="(item,index) in provinceOptions"
                    :key="index"
                    :label="item.Name"
                    :value="item.ID">
                  </el-option>
                </el-select>
                <el-select v-model="cityDate" placeholder="请选择市" @change="selectCity" @visible-change="visibleChangeCity">
                  <el-option
                    v-for="item in cityOptions"
                    :key="item.MergerName"
                    :label="item.Name"
                    :value="item.ID">
                  </el-option>
                </el-select>
                <el-select v-model="areaDate" value-key="ID" placeholder="请选择市" @change="selectArea" >
                  <el-option v-for="item in areaOptions"
                             :key="item.Name" :label="item.Name"
                             :value="item">
                  </el-option>
                </el-select>
              </template>
            </el-form-item>
            <el-form-item label="地址:" prop="Address">
              <el-input placeholder="请输入具体 地址" type="text" v-model="ruleForm.Address"></el-input>
            </el-form-item>

            <el-form-item label="昵称:" prop="NickName">
              <el-input placeholder="请输入昵称" type="text" v-model="ruleForm.NickName"></el-input>
            </el-form-item>
            <el-form-item label="密码:" prop="Password">
              <el-input type="password" placeholder="请输入密码" v-model="ruleForm.Password" show-password></el-input>
            </el-form-item>
            <el-form-item label="真实名字:" prop="ActualName">
              <el-input placeholder="请输入真实姓名" type="text" v-model="ruleForm.ActualName"></el-input>
            </el-form-item>

            <hr>
            <div class="massage_append">
              <el-form-item class="AddInput AddInput_show" label="Tel:" prop="ContactInfo.Tel">
                <el-input v-model="classInfo.Tel">
                  <el-button slot="append" icon="el-icon-circle-plus-outline" @click="appendClass(1)"></el-button>
                  <el-button slot="append" icon="el-icon-remove-outline" @click="removeClass(1)"></el-button>
                </el-input>
              </el-form-item>
              <el-form-item class="AddInput" label="WeChat:" prop="ContactInfo.WeChat">
                <el-input v-model="classInfo.WeChat">
                  <el-button slot="append" icon="el-icon-circle-plus-outline" @click="appendClass(2)"></el-button>
                  <el-button slot="append" icon="el-icon-remove-outline" @click="removeClass(2)"></el-button>
                </el-input>
              </el-form-item>
              <el-form-item class="AddInput" label="QQ:" prop="ContactInfo.QQ">
                <el-input v-model="classInfo.QQ">
                  <el-button slot="append" icon="el-icon-circle-plus-outline" @click="appendClass(3)"></el-button>
                  <el-button slot="append" icon="el-icon-remove-outline" @click="removeClass(3)"></el-button>
                </el-input>
              </el-form-item>
            </div>
          <hr>
    <!--        <el-form-item
              prop="email"
              label="邮箱"
              :rules="[ { required: true, message: '请输入邮箱地址', trigger: 'blur' },
                     { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }]" >
              <el-input v-model="ruleForm.email"></el-input>
            </el-form-item>
            <el-form-item
              v-for="(domain, index) in ruleForm.domains"
              :label="'域名' + index"
              :key="domain.key"
              :prop="'domains.' + index + '.value'"
              :rules="{required: true, message: '域名不能为空', trigger: 'blur'}">
              <el-input v-model="domain.value"></el-input><el-button @click.prevent="removeDomain(domain)">删除</el-button>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
              <el-button @click="addDomain">添加方式</el-button>
              <el-button @click="resetForm('ruleForm')">重置</el-button>
            </el-form-item>-->

            <el-button @click="Register('registerForm')" class="enterButton">提 交</el-button>
          </el-form>
        </div>
      </section>
    </el-main>
  </el-container>
</template>

<script type="text/ecmascript-6">
  import {registerMember} from '../api/user'
  import {getClassInfo} from '../api/classes'
  import {setStore,getStore,clearStore} from '../config/publicMethod'
  import {addCenterSchoolUser } from '../api/manage'
  import {getAreaList} from '../api/common'

  export default {
    name: 'door',
    data () {
      var validatePass = (rule, value, callback) => {
        if (value === '' || value.length>12 || value<8) {
          callback(new Error('请输入正确手机号'));
        } else {
          callback();
        }
      };
      return {
        DistinctName:'',
        provinceDate:[],cityDate:[],areaDate:[],
        provinceOptions:[],cityOptions:[],areaOptions:[],
        ContactInfo:[],
        ruleForm: {
          UserName:'',
          NickName:'',
          ActualName:'',
          Password:'',
          DistinctID:'',
          DistinctName:'',
          Address:'',
          ContactInfo:'',
          UserType:''
         /* domains: [{
            value: ''
          }],
          email: ''*/
        },
        rules: {
          UserName: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
          ],
          role: [
            {required: true,  message: '请选择角色', trigger: 'blur' }
          ],
          NickName: [
            { required: true, message: '请输入昵称', trigger: 'blur' },
          ],
          ActualName: [
            { required: true, message: '请输入真实姓名', trigger: 'blur' },
          ],
          Password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
          ],
          DistinctID: [
            {required: true,  message: '请输入班级', trigger: 'blur' }
          ],
          DistinctName: [
            { required: true, message: '请选择年级', trigger: 'blur' },
          ],
          Address: [
            {required: true,  message: '请选择用户学科', trigger: 'blur' }
          ],
          ContactInfo: [
            {required: true,  validator: validatePass, trigger: 'blur' }
          ],
        },
        show_len:1,
        classInfo:{
          Tel:'',WeChat:'',Email:''
        },
      }
    },
    props:['msg'],
    mounted(){
      this.getAllProvince();
    },
    methods:{
      async Register(formName){
        this.ruleForm.ContactInfo ='QQ:5648696568'
        this.$refs[formName].validate(async(valid) => {
          if (valid) {
            if( this.msg == 'RoleA'){
              this.ruleForm.UserType='A';

              let params = this.ruleForm;
              let getAddForm = JSON.parse( getStore('addForm') )
              params.CenterID=getAddForm.CenterID;
              params.SchoolID = getAddForm.SchoolID;
              let result = await registerMember(params);
              if(result.code == 200){
                this.$message({message: '注册成功，请关闭！',type:'success'});
                console.log( result.data )
                setStore('SchoolUserID',result.data.UserID)
              }
            }
            /*  let params =JSON.parse( JSON.stringify( this.ruleForm ) ) ;
           let result = await registerMember(params);
            console.log("所有的列表",result.data.UserID);
            setStore('UserID',result.data.UserID)
            if(result.code == 200){
              this.$router.push('/');
            }else {
              alert('注册信息出错')
            }*/
          } else {
            console.error('error register submit!!');
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
      async getAllProvince(){
        let result = await getAreaList();
        //this.provinceOptions = result.data;
        result.data.map( (item,index)=>{
          if( item.LevelType==1 ){//省
            this.provinceOptions.push( item )
          }
        })
      },

      changeRole(row){
        switch(row) {
          case '0':
            this.ruleForm.UserType = 'M';
            break;
          case '1':
            this.ruleForm.UserType = 'S';
            break;
          case '2':
            this.ruleForm.UserType = 'T';
            break;
          case '3':
            this.ruleForm.UserType = 'A';
            break;
          default:
            return false;
        }
        console.log( this.ruleForm.UserType)
      },
      appendClass(i){
        var add_len=$('.AddInput').length;
        if( this.show_len >=add_len ){
          alert('QQ、微信、电话中填写信息即可，无需其他联系方式')
          return false;
        }
        $('.AddInput').eq(i-1).addClass('AddInput_show')
        this.show_len = Number(this.show_len)+1;
        console.log( this.show_len )
        $('.AddInput').eq(add_len-this.show_len+1).css('display','inline-table')
      },
      removeClass(i){
        this.show_len = Number(this.show_len)-1;
        if( this.show_len <= 0 ){
          alert('QQ、微信、电话中至少保留一种联系方式')
          return false;
        }
        console.log(this)
        $('.AddInput').eq(i-1).css('display','none');
        $('.AddInput').eq(i-1).removeClass('AddInput_show');
      },

    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less" type="text/less">
  @import '../assets/mixin.less';
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
  .AddInput{
    display: none;
  }
  .AddInput:first-child{
    display:inline-table;
  }
</style>
