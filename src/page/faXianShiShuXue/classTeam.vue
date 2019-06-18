<template>
  <div>
    <head-top></head-top>
    <section class="classManagerList_section">
      <el-row>
        <el-col :span="24" style="text-align: right;margin-bottom: 10px">
          <div class="controlInfo">
            <div class="curriculumCtrl">
              <curriculum-search></curriculum-search>
              <div>
                <el-button type="primary" @click="gotoAttendClass" >上课</el-button>
              </div>
            </div>
            <div class="curriculumAdd">
              <el-button type="primary" round @click="sendLessionsAdd('add')" >新增派课</el-button>
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" style="text-align: center;margin-bottom: 10px">
          <el-table
            :data="sendLessonsLists"
            style="width: 100%"
            empty-text="还没有派课记录哦^_^"
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
                <el-button v-if="scope.row.Status == 'doing'" size="mini" @click="sendLessonsEdit(scope.$index, scope.row, 'edit')" title="编辑">编辑</el-button>
                <el-button v-else size="mini" @click="sendLessonsEdit(scope.$index, scope.row, 'check')" title="查看">查看</el-button>
                <el-button size="mini" type="danger" @click="sendLessonsDelete(scope.$index, scope.row)" title="删除">删除</el-button>
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
  import {getAssignmentList, deleteAssignment} from '../../api/exploration'
  import curriculumSearch from '../../components/curriculumSearch.vue'

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
          CourseType:CourseType, // CourseType--EE活着MM类型
          ClassProgram:ClassProgram, // ClassProgram--科目类型
        };
        let result=await getAssignmentList(inputJson);
        this.sendLessonsLists=result.data;
        console.log(this.sendLessonsLists)
      },
      //删除一条派课
      async deleteAssignment(index,row) {
        let CourseType=this.userInfo.CourseType;
        let ClassProgram=this.userInfo.ClassProgram;
        let delParams={
          AssignID: row.AssignID,
          CourseType:CourseType,
          ClassProgram:ClassProgram,
        };
        let result=await deleteAssignment(delParams);
        if (result.code == 200) {
          this.getAssignmentList();
          removeStore(`sendLessonsLists-${row.AssignID}`);
          this.$message({type: 'success', message: '删除成功!'});
        }
      },
      /*
       * 点击进行派课
       * */
      sendLessionsAdd(type){
        let sendLessonsId=createGuid();
        this.$router.push({path:'/sendLessons', query:{sendLessonsType:type, sendLessonsId:sendLessonsId}})
      },
      /*
      *编辑派课
      * */
      sendLessonsEdit(index, row, type){
        this.$router.push({path:'/sendLessons', query:{sendLessonsType:type, sendLessonsId:row.AssignID}})
      },
      /*
       * 删除课程
       * */
      sendLessonsDelete(index, row) {
        this.$confirm('此操作将永久删除该课件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteAssignment(index,row);
        }).catch(() => {
          this.$message({type: 'info', message: '已取消删除'});
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
      //返回准备上课页面
      gotoAttendClass(){
        this.$router.push({path:'/home'})
      }


    }
  }
</script>

<style scoped lang="less" type="text/less">
  .classManagerList_section {
    padding: 20px;
    margin-bottom: 40px;
    .controlInfo{
      display:flex;
      justify-content: space-between;
      .curriculumCtrl{
        display:flex;
      }
    }
  }
</style>
