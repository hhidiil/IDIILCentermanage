<template>
  <div>
    <head-top></head-top>
    <section class="data_section">
      <el-row>
        <el-col :span="24" style="text-align: left;margin-bottom: 10px"><el-button type="primary" round @click="curriculumAdd('add')" >新增备课</el-button></el-col>
      </el-row>
      <el-row>
        <el-col :span="24" style="text-align: left;margin-bottom: 10px">
          <el-form :inline="true" :model="formInline" class="demo-form-inline">
            <el-form-item label="科目">
              <el-select v-model="formInline.CourseType" placeholder="科目">
                <el-option label="数学" value="MM"></el-option>
                <el-option label="英语" value="EE"></el-option>
                <el-option label="逻辑" value="PS"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="课程名称">
              <el-input v-model="formInline.Name" placeholder="课程名称"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="">查询</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-table
            :data="culumLists"
            style="width: 100%"
            empty-text="还没有课程哦^_^"
            :header-cell-style="tableHeaderColor"
            :cell-style="statusStyle">
            <el-table-column
              label="更改日期"
              align="center">
              <template slot-scope="scope">
                <i class="el-icon-time"></i>
                <span style="margin-left: 10px">{{ scope.row.LastUpdateTime }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="课程名称"
              width="180"
              align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.CurriculumName }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="课程标识"
              align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.CurriculumID }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="课程状态"
              width="180"
              align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.Status }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              align="center">
              <template slot-scope="scope">
                <el-button v-if="scope.row.Status == 'doing'" size="mini" @click="curriculumEdit(scope.$index, scope.row, 'edit')" title="编辑">编辑</el-button>
                <el-button v-else size="mini" @click="curriculumEdit(scope.$index, scope.row, 'check')" title="查看">查看</el-button>
                <el-button size="mini" type="danger" @click="curriculumDelete(scope.$index, scope.row)" title="删除">删除</el-button>
              </template>
            </el-table-column>
          </el-table>

          <el-pagination
            v-if="culumLists.length>0"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[5,10, 20, 30]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalNum">
          </el-pagination>
        </el-col>
      </el-row>
    </section>
  </div>
</template>

<script type="text/ecmascript-6">
  import headTop from '../../components/headTop'
  import addClass from './addClass'
  import {setStore, getStore, removeStore, createGuid} from '../../config/publicMethod'
  import {toJson} from '../../config/methods'
  import {writeFileJson, doTestLogin} from '../../api/user'
  import {getCourseList, updateDoingCourseInfo, deleteCourseListInfo} from '../../api/classes'
  import {getCurriculumList, deleteCurriculum} from '../../api/exploration'
  import classData from '../../data/classlist'
  import {baseUrl_dev} from '../../config/env'

  export default {
    data() {
      let classList = JSON.parse(getStore("classList"));
      return {
        formLabelWidth: '90px',
        datetimes: '',
        formInline: {
          CourseType: '',
          Name: '',
          CourseType1:''
        },
        culumLists:[], //总课程列表
        currentPage:1, //默认显示第一页
        pageSize:5, //默认每页显示1条
        totalNum:10 //总页数
      }
    },
    components: {
      headTop,
      addClass
    },
    activated() {
      //当切换路由的时候 如果需要 vue保存缓存的话，但是部分的值不需要，则可以在这里面重新赋值，如果没有keep-alive,则每次都会重新加载所有数据
    },
    mounted() {
      const Wh = $(window).height();
      $(".data_section").css("height",(Wh-150)+'px');
      this.getCurriculumLists();
    },

    methods: {
      // 获取课程列表
      async getCurriculumLists(){
        let result=await getCurriculumList();
        this.culumLists=result.data;
        this.totalNum=this.culumLists.length;
        console.log(this.culumLists)
      },
      //删除课程列表
      async delCurriculumLists(index,row){
        let delParams={CurriculumID: row.CurriculumID};
        let result=await deleteCurriculum(delParams);
        if (result.code == 200) {
          this.getCurriculumLists();
          removeStore(`sourceLists-${row.CurriculumID}`);
          this.$message({type: 'success', message: '删除成功!'});
        }
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
        if(columnIndex==3){
          if(row.Status==="doing"){
            return {"text-align":"center",color:"#E6A23C"};
          }else if(row.Status==="done"){
            return {"text-align":"center",color:"#67c23a"};
          }
        }else{
          return {"text-align":"center"}
        }
      },
      /*
      * 添加课程
      * */
      curriculumAdd(type){
        let classId=createGuid();
        this.$router.push({path:'/addClassManager', query:{classType:type, classId:classId}})
      },

      /*
      * 编辑课程
      * */
      curriculumEdit(index, row, type) {
        console.log(index, row);
        this.$router.push({path:'/addClassManager', query:{classType:type, classId:row.CurriculumID}})
      },
      /*
       * 删除课程
       * */
      curriculumDelete(index, row) {
        this.$confirm('此操作将永久删除该课件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.delCurriculumLists(index,row);
        }).catch(() => {
          this.$message({type: 'info', message: '已取消删除'});
        });
      },
      /*
      * pageSize 改变时会触发
      * */
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
        this.pageSize = val;
      },
      /*
       * currentPage 改变时会触发
       * */
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
        this.currentPage = val;
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
    .el-pagination {
      padding: 15px 5px;
    }

  }

</style>
