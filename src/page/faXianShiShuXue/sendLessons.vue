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
                <el-select v-model="value"  placeholder="请选择班级" @change="classChange">
                  <el-option
                    v-for="item in classOptions"
                    :key="item.ClassName"
                    :label="item.ClassName"
                    :value="item.ClassName">
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
                  :button-texts="['到左边', '到右边']"
                  :format="{
                        noChecked: '${total}',
                        hasChecked: '${checked}/${total}'
                      }"
                  @change="subgroupChange"
                  :data="subgroupData">
                  <el-button class="transfer-footer" slot="left-footer" size="small">操作</el-button>
                  <el-button class="transfer-footer" slot="right-footer" size="small">操作</el-button>
                </el-transfer>
              </div>
              {{subgroupValue}}
            </div>
            <div class="classItem">
              <span>分组列表:</span>
              <div class="subgroupLists">
                <ul>
                  <li>11111</li>
                </ul>
              </div>
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
      const generateData = _ => {
        const data = [];
        for (let i = 1; i <= 15; i++) {
          data.push({
            key: i,
            label: `备选项 ${ i }`
          });
        }
        return data;
      };
      return {
        lessionsVisible:false,
        culumLists: [],
        currentList: null,
        currentRow: null,
        classOptions: [],
        value: '',
        subgroupData: [],
        subgroupValue: [],
        renderFunc(h, option) {
          console.log(option);
          if(option){
            console.log(option)
          }else{
            console.log(false)
          }
//          return <span>{ option.key } - { option.key }</span>;
//          return <span>{ option.ClassID } - { option.UserName }</span>;
//          return <span>111</span>;
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
      async getClassCenterUser(){
        let result2 = await getClassCenterUser({ClassID:'001001001'});

        this.$nextTick(function(){
          this.subgroupData = JSON.parse(JSON.stringify(result2.data));
          console.log( this.subgroupData);
        })

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
      classChange(){
        this.getClassCenterUser()
      },
      /*
      * 右侧列表元素变化时触发
      * */
      subgroupChange(value, direction, movedKeys) {
        console.log(value, direction, movedKeys);
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

    }
  }

 .subgroupLists{
   background: #cee4fd;
 }

</style>
