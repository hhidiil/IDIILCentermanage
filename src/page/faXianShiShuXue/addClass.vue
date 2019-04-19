<template>
  <div class="addClass">

    <section class="data_section">
        <el-row>
          <el-col :span="24">
            <el-form :model="sourceLists.classList" status-icon :rules="classRules" ref="classForm" :label-width="formLabelWidth" class="demo-ruleForm">
              <el-card class="box-card">
                <div class="rowBox cardTop">
                    <el-form-item label="课程名称:" prop="name">
                      <span v-if="editClassFlag"><el-input v-model="sourceLists.classList.name" auto-complete="off"></el-input></span>
                      <span v-else>{{sourceLists.classList.name}}</span>
                    </el-form-item>
                    <el-form-item label="课程目标:" prop="target">
                        <span v-if="editClassFlag"><el-input type="textarea" v-model="sourceLists.classList.target" auto-complete="off"></el-input></span>
                        <span v-else>{{sourceLists.classList.target}}</span>
                    </el-form-item>
                    <el-form-item label="课程时长:" prop="duration">
                        <span v-if="editClassFlag"><el-input v-model="sourceLists.classList.duration" auto-complete="off"></el-input></span>
                        <span v-else>{{sourceLists.classList.duration}}</span>
                    </el-form-item>
                    <el-form-item label="对应版本:" prop="version">
                        <span v-if="editClassFlag"><el-input v-model="sourceLists.classList.version" auto-complete="off"></el-input></span>
                        <span v-else>{{sourceLists.classList.version}}</span>
                    </el-form-item>
                    <el-form-item>
                      <div class="button-group">
                        <span>
                            <el-button size="mini" @click="addCustomBlock">添加自定义区块</el-button>
                            <el-button size="mini" @click="DialogIdiilVisible = true;">添加IDIIL区块</el-button>
                        </span>
                        <span>
                            <el-button v-if="editClassFlag" size="mini" @click="saveClass('classForm')">保存</el-button>
                            <el-button v-else size="mini" @click="editClass">编辑</el-button>
                        </span>
                        </div>
                    </el-form-item>
                </div>
              </el-card>
            </el-form>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <div class="foldBtn">
              <el-button size="mini" v-if="sourceLists.blockLists.length>0"  @click="controlFold">{{controlFoldFlag==true ? '折叠' : '展开'}}</el-button>
            </div>
          </el-col>
        </el-row>

        <el-row>
          <el-col>

            <el-form :model="sourceLists" status-icon  ref="blockForm" :label-width="formLabelWidth" class="demo-ruleForm" :rules="blockRules">
                <draggable
                  tag="el-collapse"
                  :list="sourceLists.blockLists"
                  :component-data="collapseComponentData"
                >
                <!--<el-collapse v-model="activeNames" @change="handleChange1">-->
                  <div v-for="(blockList,index) in sourceLists.blockLists" :key="index" class="collapseItem" >

                      <el-collapse-item v-if="blockList.type == 'custom'" :name="index.toString()">
                        <template slot="title">
                          自定义区块课程{{blockList.name}}
                          <span v-if="blockList.validate" class="validateTag"><i class="icon iconfont el-icon-warn"></i></span>
                        </template>

                        <custom-list :blockLists="sourceLists.blockLists" :blockList="blockList" :index="index"></custom-list>
                      </el-collapse-item>

                      <el-collapse-item v-else :name="index.toString()">
                        <template slot="title">
                          {{blockList.name}}
                          <span v-if="blockList.validate" class="validateTag"><i class="icon iconfont el-icon-warn"></i></span>
                        </template>
                        <default-list :blockLists="sourceLists.blockLists" :blockList="blockList" :index="index"></default-list>
                      </el-collapse-item>

                  </div>
                <!--</el-collapse>-->
                </draggable>
            </el-form>

          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <div style="margin-top: 50px;">
              <el-button type="primary" @click="submitAllData('blockForm')">提 交</el-button>
            </div>
          </el-col>
        </el-row>

    </section>
    <el-dialog
      width="60%"
      title="添加课程"
      :visible.sync="DialogIdiilVisible"
      :close-on-click-modal="false"
      append-to-body
      v-if='DialogIdiilVisible'>
      <select-class v-on:selectClassHandle="selectClassHandle"></select-class>
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
  import { mapState,mapMutations } from 'vuex'
  import headTop from '../../components/headTop.vue'
  import selectClass from '../../components/selectClassDom.vue'
  import classData from '../../data/classlist'
  import {getNowFormatDate,filterWebUrl,toJson} from '../../config/methods'
  import {setStore,getStore} from '../../config/publicMethod'
  import {uploadFile} from '../../api/upload'
  import {addClassListInfo,updateClassListInfo} from '../../api/classes'
  import {getAllClassesOfCenter} from '../../api/manage'
  import {getOnLineData} from '../../api/exploration'
  import customList from '../../components/customList.vue'
  import defaultList from '../../components/defaultList.vue'
  import draggable from 'vuedraggable'
  let Base64 = require('js-base64').Base64;

  export default {
    props:['data','type','addFlag'],
    data(){
      let validClassName=(rule, value, callback)=>{
        if(!value){
          return callback(new Error('课程名称不能为空'))
        }
        callback();
      };
      let validClassTarget=(rule, value, callback)=>{
        if(!value){
          return callback(new Error('课程目标不能为空'))
        }
        callback();
      };
      let validClassDuration=(rule, value, callback)=>{
        if(value=='' || value==undefined){
          callback();
        }else{
          let reg=/^[1-9]\d*$/;
          if(!reg.test(Number(value))){
            callback(new Error('时间必须是正整数'))
          }else {
            callback();
          }
        }
      };
      let validClassVersion=(rule, value, callback)=>{
        callback()
      };

      return {
        studentData: [],
        studentAllData: [],//学生的总列表，一直不变 在重置的时候需要
        direction:'',//学生分组方向
        activeNames: ['0'], //控制面板折叠展开
        controlFoldFlag:false, //展开折叠按钮显示
        innerDialogVisible:false,
        DialogIdiilVisible:false,
        formLabelWidth: '90px',
        addNewGroupName:'',
        classOptions:[],
        editClassFlag:false,
        sourceLists:{},
        SelectedIndex: 0, //检测的form的索引

        classRules:{
          name:[
            {required:true,message:'请输入课程名称',trigger:'blur'},
            { validator: validClassName, trigger: 'blur' }
          ],
          target:[
            {required:true,message:'请输入课程目标',trigger:'blur'},
            { validator: validClassTarget, trigger: 'blur' }
          ],
          duration:[
            { validator: validClassDuration, trigger: 'blur' }
          ],
          version:[
            { validator: validClassVersion, trigger: 'blur' }
          ]
        },
        blockRules:{
          name:[
            {required:true,message:'请输入课程名称',trigger:'blur'},
            { validator: validClassName, trigger: 'blur' }
          ],
          target:[
            {required:true,message:'请输入课程目标',trigger:'blur'},
            { validator: validClassTarget, trigger: 'blur' }
          ]
        },
        collapseComponentData:{
          on: {
            input: this.handleChange1
          },
          props: {
            value: this.activeNames
          }
        }

      }
    },
    created(){
      //在页面加载时读取localStorage里的状态信息
      const object2 = Object.assign({}, this.sourceListsInfo);
      console.log(object2);
      const object=JSON.parse(JSON.stringify(this.sourceListsInfo));
      this.sourceLists=JSON.parse(getStore("sourceLists")) || object;

      if(this.sourceLists.classList.name==""){
        this.editClassFlag=true;
      }
      console.log('1111111111111111'+this.sourceLists)
    },
    computed: {
      ...mapState(['sourceListsInfo','count']),
      sourceData() {
        let changeValue = this.form.studentGroup.nowList;
        return this.studentData.filter(item => changeValue.indexOf(item.key) === -1);
      }
    },
    watch:{
      //当监听的属性值变化的时候 会执行对应的处理逻辑
      addFlag:function(newValue,oldValue){
        console.error("watch 监听数据-----》",newValue,oldValue);

      },
      $route:function(to,from){
        console.error("watch 监听数据--$route--11-》",to,from)
      },
      '$route' (to, from) {
        console.error("watch 监听数据--$route--22-》",to,from)
      },
      beforeRouteUpdate (to, from, next) {
        console.error("watch 监听数据--beforeRouteUpdate--33-》",to,from)
      }
    },

    components:{
      headTop,
      draggable,
      selectClass,
      customList,
      defaultList
    },
    mounted(){

      const Wh = $(window).height();
      console.log('222222222222--->',this.data,this.type);
      this.getclassesList();

      fetch('static/ClassUserList.json').then((response)=>{
        return response.json();
      }).then((res)=>{
        if(this.type == 'update'){
          this.form.studentGroup = toJson(this.data.group_student_Info);
          this.sourceLists.blockLists = toJson(this.data.source);//之前的idiil课件list
          this.fileList = toJson(this.data.otherSource);//之前的上传文件
          this.form.otherSource = toJson(this.data.otherSource);//之前的上传文件
          this.form.source = toJson(this.data.source);//之前的上传文件
          this.form.name = this.data.name;//之前的上传文件
          this.form.target = this.data.target;//之前的上传文件
          this.form.commits = this.data.commits;//之前的上传文件
          this.form.courseId = this.data.courseId;//之前的上传文件
          this.form.classId = this.data.classId;//之前的上传文件
        }else {
          this.studentData = res.StudentList;
          this.studentAllData = res.StudentList;
          console.warn("获取学生数据:::::",this.studentData)
        }
      }).catch(()=>{
        console.error("获取学生数据出错")
      })
    },
    methods: {
      ...mapMutations([
        'ADD_COUNT',
        'SOURCE_LIST'// 将 `this.classList()` 映射为 `this.$store.commit('increment')`//将 `this.blockList(amount)` 映射为 `this.$store.commit('incrementBy', amount)`
      ]),
      async getclassesList(){
        let result1 = await getAllClassesOfCenter({centerId:'002'});
        console.log("班级列表--------------------->",result1);


        if(result1.code == 200){
          this.classOptions = result1.data;
        }
      },

      //获取课程区块列表
      async getBlockNum(param){
        const onlinePra={FileName:'Math--'+param.GlobalID,Action:'get',Content:'',Function:'OnlineMathBaseData'};
        let result2=await getOnLineData(onlinePra);
        result2=JSON.parse(Base64.decode(result2));

        if(result2.length>0){
          result2.forEach(item => {
            console.log(item);
            let urlJson= {
              name:param.selectUnitName+item.id,
              target:"2222",
              duration:'100分钟',
//              params:objParam,
              type:"class",
              validate:false,
              uid: new Date().getTime(),
              key:  new Date().getTime()
            };
            this.sourceLists.blockLists.push(urlJson);

          })

        }

        console.log(result2);
      },
      handleChange(value, direction, movedKeys) {
        console.log("studentData", this.studentData);
        console.log("value", value);
        console.log("direction", direction);
        console.log("movedKeys", movedKeys);
        this.direction = direction;
        this.form.studentGroup.nowList = value;
      },

      //全部提交按钮事件
      async submitAllData(formName){

          this.$refs[formName].validate((valid) => {
            if (valid) {
              this.sourceLists.blockLists.forEach((item,index) => {
                item.validate=false;
              });
              alert('submit!');
            } else {
              this.activeNames=[];
              this.sourceLists.blockLists.forEach((item,index) => {
                item.validate=false;
                if(item.name=="" || item.target==""){
                  item.validate=true;

                  this.activeNames.push(index.toString())
                }
              });

              this.collapseComponentData.props.value=this.activeNames;
              alert('error submit!! 请完善表单信息');
              return false;
            }
          });



      },

      //选择完线上课程之后的处理逻辑
      selectClassHandle(param){
        let ClassUserInfo = JSON.parse(getStore("ClassUserList"));
        let UserInfo = JSON.parse(getStore("userInfo"));
        console.log("选择的链接---》",ClassUserInfo,ClassUserInfo.CenterID);
        let objParam={
          sChapterID:param.CID,
          sUnitID:param.UID,
          sChapterName:param.ChapterName,
          sUnitName:param.UnitName,
          sDirName:param.DirName,
          sCenterID : ClassUserInfo.CenterID,
          sCenterWeb : ClassUserInfo.CenterWeb,
          sMainWeb : ClassUserInfo.MainWeb,
          sAssignID : ClassUserInfo.ClassID,
          sPerformanceID : ClassUserInfo.ClassID,
          InstructorID : UserInfo.InstructorID,
          OutputType:param.selectType,
          GlobalID:param.GlobalID
        };


        this.getBlockNum(param);
        this.$message({'type':'success',message:"添加成功！"})
      },
      //获取选中的学生的信息
      filterNowList(data){
        let result = [];
        for(let ii in data){
          for(let jj in this.studentData){
            if(this.studentData[jj].key == data[ii]){
              result.push(this.studentData[jj])
            }
          }
        }
        return result
      },
      //添加区块
      addCustomBlock(param){
        let urlJson= {
          name:"",
          target:"",
          duration:'50分钟',
          type:"custom",
          validate:false,
//          params:"custom",
          uid: new Date().getTime(),
          key: Date.now()
        };
        this.sourceLists.blockLists.push(urlJson);
      },
      alertFn(num){
        alert(num)

      },
      editClass(formName){
        this.editClassFlag=true;
      },
      saveClass(formName){
        this.$refs[formName].validate((valid)=>{
          if(valid){
            alert('submit!');
            this.editClassFlag=false;
            console.log(this.sourceLists);
            this.SOURCE_LIST(this.sourceLists);
            this.ADD_COUNT();
          }else{
            console.log('error submit!!');
            return false
          }
        });
      },
      //全部区块展开 或 折叠
      controlFold(){
        this.activeNames=[];
        if(!this.controlFoldFlag){
          for(var i = 0; i < this.sourceLists.blockLists.length; i++) {
            this.activeNames.push(i.toString())
          }
        }
        this.collapseComponentData.props.value=this.activeNames;
        this.controlFoldFlag=!this.controlFoldFlag;

      },
      handleChange1(val){
        this.activeNames=val;
        console.log(val);
      }

    }
  }
</script>

<style scoped  lang="less" type="text/less">

  i{
    font-size: 16px;
    padding-left: 15px;
  }
  .foldBtn{
    text-align: right;
  }
  .validateTag{
    color: #e84444;
  }
  .el-collapse {
    border: 0;
  }
  .addClass{
    .data_section {
      padding: 20px;
      margin-bottom: 40px;
      text-align: left;
    .el-row{
      margin-bottom: 25px;
    }
    .collapseItem{
      border-bottom: 1px solid #ebeef5;
    }
    .cardTop,.cardBody {

      color: #000000;
    .button-group{
      text-align: right;
      margin: 0;
      display: flex;
      justify-content: space-between;
    }
    }

    .righttable table{
      border: 1px solid #999;
    tr td{
      border-top: 0;
      border-right: 1px solid #999;
      border-bottom: 1px solid #999;
      border-left: 0;

    }
    }
    .transfer-footer {
      margin-left:10px;
      padding: 6px 5px;
    }
    .el-tag{
      margin: 0 3px;
    }
    .tianjiazu{
      float: right;
      margin: 6px 0 0 5px;
    }
  }
  }
</style>
