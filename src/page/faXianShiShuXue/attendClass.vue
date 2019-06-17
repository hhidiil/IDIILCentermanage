<template>
  <div>
    <head-top></head-top>
    <section class="classManagerList_section">
      <el-row>
        <el-col :span="24" style="text-align: center;margin-bottom: 10px">
          <div class="block">
            <curriculum-search></curriculum-search>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" style="text-align: center;margin-bottom: 10px">
          <el-table
            :data="sendLessonsLists"
            style="width: 100%"
            empty-text="还没有上课记录哦^_^"
            :header-cell-style="tableHeaderColor"
            :cell-style="statusStyle">
            <el-table-column
              label="更改日期">
              <template slot-scope="scope">
                <i class="el-icon-time"></i>
                <span>{{ scope.row.LastUpdateTime | lineFeed(0) }}</span><br/>
                <span>{{ scope.row.LastUpdateTime | lineFeed(1) }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="派课名称"
              width="180">
              <template slot-scope="scope">
                <span>{{ scope.row.AssignName }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="派课标识"
              v-if="false">
              <template slot-scope="scope">
                <span>{{ scope.row.AssignID }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="派课状态"
              width="180">
              <template slot-scope="scope">
                <span>{{ scope.row.Status }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              align="center">
              <template slot-scope="scope">
                <el-button v-if="" size="mini" title="上课" @click="goToClass(scope.$index, scope.row)">上课</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </section>
  </div>
</template>

<script type="text/ecmascript-6">
  import headTop from '../../components/headTop'
  import {setStore, getStore, removeStore, createGuid} from '../../config/publicMethod'
  import {getAssignmentList} from '../../api/exploration'
  import curriculumSearch from '../../components/curriculumSearch.vue'
  let Base64 = require('js-base64').Base64;
  export default {
    data() {
      return {
        userInfo:JSON.parse(getStore('userInfo')),
        sendLessonsLists:[]
      }
    },
    components: {
      headTop,
      curriculumSearch
    },
    activated() {
      //当切换路由的时候 如果需要 vue保存缓存的话，但是部分的值不需要，则可以在这里面重新赋值，如果没有keep-alive,则每次都会重新加载所有数据
      this.getAssignmentList()
    },
    mounted() {
      this.getAssignmentList();
    },
    filters: {
      lineFeed(value,num){
        if (!value) return '';
        return value.split(/\s+/)[num];
      }
    },
    methods: {
      //获取派课列表
      async getAssignmentList() {
        let CourseType=this.userInfo.CourseType;
        let ClassProgram=this.userInfo.ClassProgram;
        let inputJson={
          AssignID:'', //AssignID--派课ID
          SchoolID:'', // SchoolID--学校ID
          UserID:'', //UserID--教师ID
          Status:'', // Status--状态
          CourseType:CourseType, // CourseType--科目类型
          ClassProgram:ClassProgram // CourseType--科目类型
        };
        let result=await getAssignmentList(inputJson);
         result=result.data;
        this.sendLessonsLists = result.filter((currentValue, index, arr)=>{
          return currentValue.Status == 'done';
        });
      },

      /*
       * 表头单元格的 style 的回调方法
       * */
      tableHeaderColor({ row, column, rowIndex, columnIndex }) {
        if (rowIndex === 0) {
          return 'background-color: #EFF2F7;color: #000000;font-weight: 500;'
        }
      },
      /*
       * 单元格的 style 的回调方法
       * */
      statusStyle({row, column, rowIndex, columnIndex}) {
        if(columnIndex==2){
          if(row.Status==="doing"){
            return {"text-align":"center",color:"#E6A23C"};
          }else if(row.Status==="done"){
            return {"text-align":"center",color:"#67c23a"};
          }
        }else{
          return {"text-align":"center"}
        }
      },
      /*去上课*/
      goToClass(index,row){
         console.log(row);
         let aa=JSON.parse(Base64.decode(row.GroupContent));
        window.open(`https://nwprodsub.idiil.com.cn/SYSTEM/MathInteractive/math1_1/index${row.CourseType}.html?InstructorID=01&sCenterID=002&sPerformanceID=00201${row.CourseType}201904005&AssignID=${row.AssignID}&ClassProgram=${row.ClassProgram}`);
      }

    }
  }
</script>

<style scoped lang="less" type="text/less">
  .classManagerList_section {
    padding: 20px;
    margin-bottom: 40px;

  }
</style>
