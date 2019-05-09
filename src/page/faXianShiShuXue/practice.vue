<template>
  <div class="sendLessionsManager">
    <head-top></head-top>
    <section class="data_section">
      <el-card class="box-card">
        <el-row>
          <el-col :span="24" style="text-align: left;margin-bottom: 10px">
            <div class="classItem">
              <el-button type="primary" @click="lessionsVisible = true">选取课程</el-button>
            </div>
            <div class="classItem">
              <span>课程名称:</span>
              <span v-if="this.currentList">{{this.currentList.classList.name}}</span>
            </div>
            <div class="classItem">
              <span>课程目标:</span>
              <span v-if="this.currentList">{{this.currentList.classList.target}}</span>
            </div>
            <div class="classItem">
              <span>班级名称:</span>
              <span>
                <el-select v-model="selectValue"  placeholder="请选择班级" @change="classChange">
                  <el-option
                    v-for="item in classOptions"
                    :key="item.ClassID"
                    :label="item.ClassName"
                    :value="item.ClassID">
                  </el-option>
                </el-select>
              </span>
            </div>
            <div class="classItem">
              <span>开始分组:</span>
              <div class="goToSubgroup">
                <el-transfer
                  v-model="subgroupValue"
                  :render-content="renderFunc"
                  :titles="['学生列表', '学生分组']"
                  :button-texts="['返回', '分组']"
                  :format="{
                        noChecked: '${total}',
                        hasChecked: '${checked}/${total}'
                      }"
                  @change="subgroupChange"
                  :data="subgroupData">
                  <span class="transfer-footer" slot="left-footer">
                    <!--<el-button size="small">操作</el-button>-->
                  </span>
                  <span  class="transfer-footer" slot="right-footer">
                    <el-button v-if="subgroupValue.length>0" size="small"  @click="confirmGrouping">确定分组</el-button>
                  </span>
                </el-transfer>
              </div>
              {{subgroupValue}}
              {{subgroupValue.length}}
            </div>
            <div class="classItem">
              <span>分组列表:</span>
              <div class="subgroupLists">
                <el-collapse>
                  <el-collapse-item v-for="(item,index) in sendSubgroupLists" :key="index+'group'">
                    <template slot="title">
                      {{item.subgroupName}}
                    </template>
                    <div v-for="(val,i) in item.subgroupMembers" :key="i+'member'" class="textItem">
                      {{val.key}}--{{val.UserName}}
                    </div>
                  </el-collapse-item>
                </el-collapse>
              </div>
            </div>
            <div class="classItem">
              <el-button size="small" type="primary" @click="sendLessensSave('send')">保存</el-button>
              <el-button size="small" type="success" @click="sendLessensSave('upload')">上传</el-button>
            </div>
          </el-col>
        </el-row>
      </el-card>
    </section>
    <!--IDIIL教材弹出框-->
    <el-dialog
      width="60%"
      v-dialogDrag
      title="IDIIL教材"
      :visible.sync="lessionsVisible"
      :close-on-click-modal="false"
      append-to-body
      v-if='lessionsVisible'>
      <section>
        <el-table
          ref="CurriculumTable"
          :data="culumLists"
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
            label="日期"
            width="120"
            align="center">
          </el-table-column>
          <el-table-column
            property="CurriculumName"
            label="姓名"
            width="120"
            align="center">
          </el-table-column>
          <el-table-column
            property="CurriculumID"
            label="地址"
            align="center">
          </el-table-column>
        </el-table>
        <div style="margin-top: 20px">
          <el-button @click="setCurrent()">取消选择</el-button>
          <el-button @click="selectCurriculum()">确定</el-button>
        </div>
      </section>
    </el-dialog>

  </div>
</template>

<script type="text/ecmascript-6">
  import { mapState,mapMutations } from 'vuex'
  import headTop from '../../components/headTop.vue'
  import {getCurriculumList} from '../../api/exploration'
  import {getSchoolClasses, getClassCenterUser} from '../../api/manage'
  let Base64 = require('js-base64').Base64;

  export default {
    props:[],
    data(){
      return {
        lessionsVisible:false,
        culumLists: [],
        currentList: null,
        currentRow: null,
        classOptions: [],
        selectValue: '',
        subgroupData: [],
        subgroupValue: [],
        sendSubgroupLists: [],
        currentClassID:'',
        sendLessonsLists:{},
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
      this.getCurriculumLists();
    },
    methods: {
      // 获取课程列表
      async getCurriculumLists(){
        let result = await getCurriculumList();
        let originalResult = result.data;
        this.culumLists = originalResult.filter((currentValue, index, arr)=>{
          return currentValue.Status == 'done';
        });
        let result1 = await getSchoolClasses({SchoolID:'001'});
        this.classOptions = result1.data;
        console.log(  `this.classOptions---${this.classOptions}`);

      },
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
        this.subgroupData = originalResult2;

      },
      setCurrent(row) {
        this.$refs.CurriculumTable.setCurrentRow(row);
      },
      handleCurrentChange(currentRow, oldCurrentRow) {
        console.log(currentRow);
        this.currentRow = currentRow;
      },
      /*
       * 表头单元格的 style 的回调方法
       * */
      tableHeaderStyle({row, column, rowIndex, columnIndex}){
        return {'background-color': '#EFF2F7','color': '#000000','font-weight': '500'}
      },
      /*
       * 确定选中的课程
       * */
      selectCurriculum(){
        if(this.currentRow){
          console.log('true')
          let currentList=this.currentRow.CurriculumnContent;
          this.currentList=JSON.parse(Base64.decode(currentList));
          console.log(this.currentList)

        }else{
          console.log('false');
          this.currentList=null;
        }
        this.lessionsVisible = false;
      },
      /*
       * 选中的班级发生变化时显示对应学生
       * */
      showStudentLists(vId){
        this.currentClassID="";
        this.sendSubgroupLists=[];
        this.subgroupValue=[];
        let obj = {};
        obj = this.classOptions.find((item)=>{//这里的userList就是上面遍历的数据源
          return item.ClassID === vId;//筛选出匹配数据
        });
        console.log(obj.ClassName);//我这边的name就是对应label的
        this.getClassCenterUser(obj.ClassID)
      },
      /*
       * 是否切换班级判断
       * */
      classChange(vId){

        console.log(this.sendSubgroupLists);
        if(vId == this.currentClassID){
          return;
        }
        if(this.sendSubgroupLists.length>0){
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

      },
      /*
       * 确定分组
       * */
      confirmGrouping(){
        this.currentClassID=this.selectValue;
        console.log(this.currentClassID);
        var subgroupItem={
          subgroupName: '新增组',
          subgroupMembers:[]
        };
        for(let i= this.subgroupData.length-1;i>=0;i--){
          let value=this.subgroupData[i];
          if(this.subgroupValue.indexOf(value.key)>-1){
            subgroupItem.subgroupMembers.unshift(value);
            this.subgroupData.splice(i, 1);
          }
        }
        this.sendSubgroupLists.push(subgroupItem);
        this.subgroupValue=[];
        console.log(this.sendSubgroupLists)

      },

      /*
       * 保存
       * */
      sendLessensSave(){
        let sendLessonsLists={
          curriculumName:this.currentList.classList.name,
          curriculumTarget:this.currentList.classList.target,
          className:'',
          sendSubgroupLists:this.sendSubgroupLists
        }

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
    background: #cee4fd;
  .textItem{
    /*padding: 2px 4px;*/
    /*background: #ecf5ff;*/
    /*border-bottom: 1px solid #c2dcf9;*/
  }
  }

</style>
