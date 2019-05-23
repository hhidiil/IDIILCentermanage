<template>
  <div class="sendLessionsManager">
    <head-top></head-top>
    <section class="data_section">
      <el-card class="box-card">
        <el-row>
          <el-col :span="24" style="text-align: left;margin-bottom: 10px">
            <div class="classItem">
              <el-button  v-if="sendLessonsType != 'check'" type="primary" @click="showCurriculumList">选取课程</el-button>
            </div>
            <div class="classItem">
              <span>课程名称:</span>
              <span v-if="this.sendLessonsLists.currentList">{{sendLessonsLists.currentList.classList.name}}</span>
            </div>
            <div class="classItem">
              <span>课程目标:</span>
              <span v-if="this.sendLessonsLists.currentList">{{sendLessonsLists.currentList.classList.target}}</span>
            </div>
            <div class="classItem">
              <span>班级名称:</span>
              <span v-if="sendLessonsType != 'check'">
                <el-select v-model="sendLessonsLists.selectValue"  placeholder="请选择班级" @change="classChange">
                  <el-option
                    v-for="item in sendLessonsLists.classOptions"
                    :key="item.ClassID"
                    :label="item.ClassName"
                    :value="item.ClassID">
                  </el-option>
                </el-select>
              </span>
              <span v-else>
                {{sendLessonsLists.currentClassName}}
              </span>
            </div>

            <div class="classItem" v-if="sendLessonsType != 'check'">
              <span>开始分组:</span>
              <div class="goToSubgroup">
                <el-transfer
                  v-model="sendLessonsLists.subgroupValue"
                  :render-content="renderFunc"
                  :titles="['学生列表', '学生分组']"
                  :button-texts="['取消', '分组']"
                  :format="{
                        noChecked: '${total}',
                        hasChecked: '${checked}/${total}'
                      }"
                  @change="subgroupChange"
                  :data="sendLessonsLists.subgroupData">
                  <span class="transfer-footer" slot="left-footer">
                  </span>
                  <span  class="transfer-footer" slot="right-footer">
                    <el-button v-if="sendLessonsLists.subgroupValue.length>0" size="small"  @click="confirmGrouping">确定分组</el-button>
                  </span>
                </el-transfer>
              </div>
            </div>
            <div class="classItem">
              <span>分组列表:</span>
              <div class="subgroupLists">
                <ul>
                  <li v-for="(item,index) in sendLessonsLists.sendSubgroupLists" :key="index+'group'">
                    <span> {{item.subgroupName}}:</span>
                    <span  v-for="(val,i) in item.subgroupMembers" :key="i+'member'" class="textItem">
                      {{val.key}}--{{val.UserName}}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
            <div v-if="sendLessonsType != 'check'" class="classItem">
             <el-button size="small" type="primary" @click="sendLessensSave('back')">取消并返回</el-button>
             <el-button size="small" type="primary" @click="sendLessensSave('save')">保存</el-button>
             <el-button size="small" type="success" @click="sendLessensSave('upload')">上传</el-button>
            </div>
            <div v-else class="classItem">
              <el-button size="small" type="primary" @click="sendLessensSave('check')">返回</el-button>
            </div>
          </el-col>
        </el-row>
      </el-card>
    </section>
    <!--IDIIL教材弹出框-->
    <el-dialog
      width="60%"
      v-dialogDrag
      title="已完成课程"
      :visible.sync="lessionsVisible"
      :close-on-click-modal="false"
      append-to-body
      v-if='lessionsVisible'>
      <section>
        <el-table
          ref="CurriculumTable"
          :data="sendLessonsLists.culumLists"
          highlight-current-row
          :header-cell-style="tableHeaderStyle"
          @current-change="handleCurrentChange"
          style="width: 100%">
          <el-table-column
            type="index"
            width="50"
            align="center">
          </el-table-column>
          <el-table-column
            property="LastUpdateTime"
            label="更改日期"
            width="120"
            align="center">
          </el-table-column>
          <el-table-column
            property="CurriculumName"
            label="课程名称"
            width="120"
            align="center">
          </el-table-column>
          <el-table-column
            property="CurriculumID"
            label="课程标识"
            align="center">
          </el-table-column>
        </el-table>
        <div style="margin-top: 20px">
          <el-button @click="setCurrent()">取消</el-button>
          <el-button type="primary" @click="selectCurriculum()">确定</el-button>
        </div>
      </section>
    </el-dialog>

  </div>
</template>

<script type="text/ecmascript-6">
  import { mapState,mapMutations } from 'vuex'
  import headTop from '../../components/headTop.vue'
  import {getCurriculumList, saveTempAssignment, getTempAssignment} from '../../api/exploration'
  import {getSchoolClasses, getClassCenterUser} from '../../api/manage'
  import {setStore,getStore,removeStore} from '../../config/publicMethod'
  let Base64 = require('js-base64').Base64;

  export default {
    props:[],
    data(){
      return {
        lessionsVisible:false,
        sendLessonsType:'',
        guid:'',
        userInfo:JSON.parse(getStore('userInfo')),
        sendLessonsLists:{
          culumLists: [],
          currentList: null,
          currentRow: null,
          classOptions: [],
          selectValue: '',
          subgroupData: [],
          subgroupValue: [],
          sendSubgroupLists: [],
          currentClassID:'',
          currentClassName:'',
        },
        renderFunc(h, option) {
          return <span>{ option.key } - { option.label }</span>;
        }
      }
    },
    computed: {

    },
    watch:{
      //当监听的属性值变化的时候 会执行对应的处理逻辑
      '$route' (to, from) {
        console.error("watch 监听数据--$route--22-》",to,from)
      }
    },
    components:{
      headTop

    },
    mounted(){
        const Wh = $(window).height();
        $(".data_section").css("height",(Wh-150)+'px');
        this.getTempAssignment();
    },
    methods: {
      async getTempAssignment(){
        let routeParams=this.$route.query;
        this.guid=routeParams.sendLessonsId;
        this.sendLessonsType=routeParams.sendLessonsType;
        if(this.sendLessonsType == "add"){
          let object=JSON.parse(getStore(`sendLessonsLists-${this.guid}`));
          if(object){
            this.sendLessonsLists=object;
          }else {
            this.sendLessonsLists={
              culumLists: [],
              currentList: null,
              currentRow: null,
              classOptions: [],
              selectValue: '',
              subgroupData: [],
              subgroupValue: [],
              sendSubgroupLists: [],
              currentClassID:'',
              currentClassName:'',
            };
          }
        }else{
          let object=JSON.parse(getStore(`sendLessonsLists-${this.guid}`));
          if(object){
            this.sendLessonsLists=object;
          }else{
            let result = await getTempAssignment({AssignID:this.guid}); //获取一条临时派课数据
            if (result.code == 200) {
              this.sendLessonsLists=JSON.parse(Base64.decode(result.data[0].GroupContent));
            }
          }
        }
        this.getCurriculumLists();

      },
      // 获取课程列表
      async getCurriculumLists(){
        let result = await getCurriculumList();
        let originalResult = result.data;
        this.sendLessonsLists.culumLists = originalResult.filter((currentValue, index, arr)=>{
          return currentValue.Status == 'done';
        });
        let result1 = await getSchoolClasses({SchoolID:'001'});
        this.sendLessonsLists.classOptions = result1.data;
        this.setLessonsStore();

      },
      //根据班级获取学生列表
      async getClassCenterUser(ClassID){
          let parameters={
            ClassID:ClassID
          };
          let result2 = await getClassCenterUser(parameters);
          let originalResult2 = result2.data;
          originalResult2.forEach((item, index)=>{
            item.label = item.UserName;
            item.key = index+1;
          });
        this.sendLessonsLists.subgroupData = originalResult2;
        this.setLessonsStore();
      },
      //取消课程选择
      setCurrent(row) {
        this.$refs.CurriculumTable.setCurrentRow(null);
        this.sendLessonsLists.currentRow = null;
        this.lessionsVisible = false;
      },
      handleCurrentChange(currentRow, oldCurrentRow) {
        console.log(currentRow);
        this.sendLessonsLists.currentRow = currentRow;
      },
      /*
      * 表头单元格的 style 的回调方法
      * */
      tableHeaderStyle({row, column, rowIndex, columnIndex}){
        return {'background-color': '#EFF2F7','color': '#000000','font-weight': '500'}
      },
      /*
      * 点击选择课程按钮弹出课程列表
      * */
      showCurriculumList(){
        this.lessionsVisible = true;
        this.sendLessonsLists.currentRow = null;
        console.log( this.sendLessonsLists.currentRow )
      },
      /*
      * 确定选中的课程
      * */
      selectCurriculum(){
        if(!this.sendLessonsLists.currentRow){
          this.promptMessage('还没有选择课程哦^o^', 'warning');
        }else{
          let currentList=this.sendLessonsLists.currentRow.CurriculumnContent;
          this.sendLessonsLists.currentList=JSON.parse(Base64.decode(currentList));
          this.lessionsVisible = false;
          this.setLessonsStore();
        }

      },
      /*
      * 选中的班级发生变化时显示对应学生
      * */
      showStudentLists(vId){
        this.sendLessonsLists.currentClassID="";
        this.sendLessonsLists.sendSubgroupLists=[];
        this.sendLessonsLists.subgroupValue=[];
        let obj = {};
        obj = this.sendLessonsLists.classOptions.find((item)=>{//这里的userList就是上面遍历的数据源
          return item.ClassID === vId;//筛选出匹配数据
        });
        this.getClassCenterUser(obj.ClassID);

      },
      /*
      * 是否切换班级判断
      * */
      classChange(vId){
        if(vId == this.sendLessonsLists.currentClassID){
          return;
        }
        if(this.sendLessonsLists.sendSubgroupLists.length>0){
            this.$confirm('切换班级则之前分组记录将丢失, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.showStudentLists(vId);
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消切换班级'
              });
              this.sendLessonsLists.selectValue=this.sendLessonsLists.currentClassID;
              this.setLessonsStore();

            });
        }else{
          this.showStudentLists(vId);
        }
      },
      /*
      * 右侧列表元素变化时触发
      * */
      subgroupChange(value, direction, movedKeys) {
        console.log(value, direction, movedKeys);
        if(direction === "right") {}
        if(direction === "left") {}
        this.setLessonsStore();
      },
      /*
      * 确定分组
      * */
      confirmGrouping(){
        this.sendLessonsLists.currentClassID=this.sendLessonsLists.selectValue;
        var subgroupItem={
          subgroupName: '',
          subgroupMembers:[]
        };
        subgroupItem.subgroupName='组'+(this.sendLessonsLists.sendSubgroupLists.length+1);
        for(let i= this.sendLessonsLists.subgroupData.length-1;i>=0;i--){
          let value=this.sendLessonsLists.subgroupData[i];
          if(this.sendLessonsLists.subgroupValue.indexOf(value.key)>-1){
            subgroupItem.subgroupMembers.unshift(value);
            this.sendLessonsLists.subgroupData.splice(i, 1);
          }
        }
        this.sendLessonsLists.sendSubgroupLists.push(subgroupItem);
        this.sendLessonsLists.subgroupValue=[];
        this.setLessonsStore();
      },
      computedCurrentClassName(){
        if(this.sendLessonsLists.classOptions.length>0 && this.sendLessonsLists.currentClassID!=""){
          var obj={};
          obj=this.sendLessonsLists.classOptions.find((item)=>{//这里的userList就是上面遍历的数据源
            if(item.ClassID === this.sendLessonsLists.currentClassID){
              return item;
            }//筛选出匹配数据
          });
          return obj.ClassName;
        }
      },
      /*
      * 保存
      * */
      sendLessensSave(type){
        if(type == "check"){
          this.$router.push({name:'classTeam'})
        } else if(type == "save"){
          this.saveLessensLists('doing','');
        } else if(type == "back"){
          removeStore(`sendLessonsLists-${this.guid}`);
          this.$router.push({name:'classTeam'});
        } else {
          if(!this.sendLessonsLists.currentList){
            this.promptMessage('课程名称和课程目标不能为空哦^o^', 'warning')
          } else if(this.sendLessonsLists.sendSubgroupLists.length == 0 ){
            this.promptMessage('需要选择班级并对该班学生进行分组哦^o^', 'warning')
          } else {
            if(this.sendLessonsLists.sendSubgroupLists.length > 0 && this.sendLessonsLists.subgroupData.length == 0 && this.sendLessonsLists.subgroupValue.length == 0){
              this.sendLessonsLists.currentClassName=this.computedCurrentClassName();
              this.saveLessensLists('done');
            } else{
              this.promptMessage('需要将该班级所有学生进行分组哦^o^', 'warning')
            }
          }
        }
        this.setLessonsStore();
      },
      /*
      * 保存数据接口
      * */
      async saveLessensLists(status){
        let CurriculumID='', AssignName = '', AssignMemo = '';
        if(this.sendLessonsLists.currentList){
          CurriculumID = this.sendLessonsLists.currentList.classList.classId;
          AssignName = this.sendLessonsLists.currentList.classList.name;
          AssignMemo = this.sendLessonsLists.currentList.classList.target;
        }
        let GroupContent = Base64.encode(JSON.stringify(this.sendLessonsLists));
        let ClassID=this.sendLessonsLists.selectValue;
        let inputJson = {
          AssignID: this.guid,  //--派课ID
          SchoolID: '001', //SchoolID--学校ID
          CurriculumID: CurriculumID, //CurriculumID--所选课程ID,
          AssignName: AssignName, //AssignName--派课名称
          AssignMemo: AssignMemo, //AssignMemo--派课备注
          GroupContent: GroupContent, //GroupContent--分组信息
          ClassID:ClassID, //ClassID--班级ID
          UserID: this.userInfo.userId, //UserID--派课教师ID,
          Status: status //Status--状态
        };
        let result = await saveTempAssignment(inputJson);
        if(result.code == 200){
          this.promptMessage('派课保存成功^_^', 'success');
          this.$router.push({name:'classTeam'})
        }else{
          this.promptMessage('派课保存失败^o^', 'error');
        }
      },
      /*
      * 将派课列表存入本地
      * */
      setLessonsStore(){
        setStore(`sendLessonsLists-${this.guid}`,this.sendLessonsLists);
      },
      /*
       * 保存时的提示信息
       * */
      promptMessage(text, type){
        this.$message({
          showClose: true,
          message: text,
          type: type
        });
      }


    }
  }
</script>

<style scoped  lang="less">

  .sendLessionsManager{
    .data_section {
      padding: 20px;
      overflow: auto;
      margin-bottom: 40px;
    }
  }
  .el-col{
    text-align: left;
    margin-bottom: 15px;
    .classItem{
      line-height: 40px;
      margin-bottom: 10px;
      span:nth-child(1){
        color: #006699;
      }
      .el-collapse-item__header{
        background: #ecf5ff;
        padding: 0 0 0 10px;
      }

    }
  }

 .subgroupLists{
   li{
     border-bottom: 1px solid #d6e7f9;
    .textItem{
      padding: 0 5px;
      /*color: #00a8e6;*/
    }
   }

  }

</style>
