<template>
  <div>
    <head-top></head-top>
    <section class="data_section">
        <div v-if="prepareLessonsWay=='IDIIL'">
          <el-row>
            <el-col :span="24" style="text-align: left;margin-bottom: 10px">
              <div class="controlInfo">
                <curriculum-search></curriculum-search>
                <div class="curriculumAdd">
                  <el-button type="primary" round @click="curriculumAdd('add')" >新增备课</el-button>
                </div>
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <curriculum-table :culumLists="culumLists" @delMsgForChild="getCurriculumLists"></curriculum-table>
            </el-col>
          </el-row>
        </div>
        <el-tabs v-else v-model="activeName" type="card" @tab-click="handleClick">
          <curriculum-search></curriculum-search>
          <el-tab-pane label="IDIIL课程" name="first">
            <el-row>
              <el-col>
                <curriculum-table :culumLists="culumLists" :tabIndex="'IDIIL'"></curriculum-table>
              </el-col>
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="自定义课程" name="second">
            <el-row>
              <el-col>
                <curriculum-table :culumLists="customLists" :tabIndex="'CUSTOM'" @delCustomMsgForChild="getCustomLists"></curriculum-table>
              </el-col>
            </el-row>
          </el-tab-pane>
        </el-tabs>
    </section>
  </div>
</template>

<script type="text/ecmascript-6">
  import headTop from '../../components/headTop'
  import curriculumSearch from '../../components/curriculumSearch.vue'
  import curriculumTable from '../../components/curriculumTable.vue'
  import {setStore, getStore, removeStore, createGuid} from '../../config/publicMethod'
  import {getCourseList, updateDoingCourseInfo, deleteCourseListInfo} from '../../api/classes'
  import {getCurriculumList} from '../../api/exploration'

  export default {
    data() {
      let userInfo = JSON.parse(getStore('userInfo'));
      return {
        formLabelWidth: '90px',
        datetimes: '',
        activeName: 'second',
        userInfo:userInfo,
        prepareLessonsWay:userInfo.TeacherType,
        culumLists:[], //IDIIL课程列表
        customLists:[], //自定义课程列表
        currentPage:1, //默认显示第一页
        pageSize:5, //默认每页显示1条
        totalNum:10 //总页数
      }
    },
    components: {
      headTop,
      curriculumSearch,
      curriculumTable
    },

    mounted() {
      const Wh = $(window).height();
      $(".data_section").css("height",(Wh-150)+'px');
      this.getCurriculumLists();
      if(this.prepareLessonsWay != 'IDIIL'){
        this.getCustomLists()
      }
    },
    methods: {
      // 获取IDIIL课程列表
      async getCurriculumLists(){
        let userId=this.userInfo.userId;
        let SourceType='IDIIL';
        if(this.prepareLessonsWay != 'IDIIL'){
          userId=''
        }
        let jsonInfo={
          UserId:userId,
          SourceType:SourceType
        };
        let result=await getCurriculumList(jsonInfo);
        this.culumLists=result.data;
        if(this.prepareLessonsWay != 'IDIIL'){
          this.culumLists=result.data.filter((currentValue, index, arr)=>{
            return currentValue.Status == 'done';
          });
        }

      },
      // 获取自定义课程列表
      async getCustomLists(){
        let userId=this.userInfo.userId;
        let SourceType='CUSTOM';
        let jsonInfo={
          UserId:userId,
          SourceType:SourceType
        };
        let result=await getCurriculumList(jsonInfo);
        this.customLists=result.data;

      },
      /*
       * 添加课程
       * */
      curriculumAdd(type){
        let classId=createGuid();
        this.$router.push({path:'/addClassManager', query:{classType:type, classId:classId}})
      },
      /*
      * pageSize 改变时会触发
      * */
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
        this.pageSize = val;
//        this.culumLists=this.culumLists.slice((this.currentPage-1)*this.pageSize,this.currentPage*this.pageSize)
      },
      /*
       * currentPage 改变时会触发
       * */
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
        this.currentPage = val;
//        this.culumLists=this.culumLists.slice((this.currentPage-1)*this.pageSize,this.currentPage*this.pageSize)
      },
      /*tab页点击事件*/
      handleClick(tab, event) {
        console.log(tab, event);
      }

    }
  }
</script>

<style scoped lang="less" type="text/less">
  .data_section {
    padding: 20px;
    margin-bottom: 40px;
    height:800px;
    overflow: scroll;
    .controlInfo{
      display:flex;
      justify-content: space-between;
    }
    .el-pagination {
      padding: 15px 5px;
    }

  }

</style>
