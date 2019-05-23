<template>
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
        <span>{{ scope.row.LastUpdateTime | lineFeed(0) }}</span><br/>
        <span>{{ scope.row.LastUpdateTime | lineFeed(1) }}</span>
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
      align="center"
      v-if="false">
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
        <div v-if="prepareLessonsWay=='IDIIL'">
          <el-button v-if="scope.row.Status == 'doing'" size="mini" @click="curriculumEdit(scope.$index, scope.row, 'edit')" title="编辑">编辑</el-button>
          <el-button v-else size="mini" @click="curriculumEdit(scope.$index, scope.row, 'check')" title="查看">查看</el-button>
          <el-button size="mini" type="danger" @click="curriculumDelete(scope.$index, scope.row)" title="删除">删除</el-button>
        </div>
        <div v-else>
          <el-button v-if="tabIndex == 'IDIIL'" size="mini" @click="curriculumEdit(scope.$index, scope.row, 'apply')" title="选用">选用</el-button>
          <div v-else>
            <el-button v-if="scope.row.Status == 'doing'" size="mini" @click="curriculumEdit(scope.$index, scope.row, 'edit')" title="编辑">编辑</el-button>
            <el-button v-else size="mini" @click="curriculumEdit(scope.$index, scope.row, 'check')" title="查看">查看</el-button>
            <el-button size="mini" type="danger" @click="curriculumDelete(scope.$index, scope.row)" title="删除">删除</el-button>
          </div>
        </div>
      </template>
    </el-table-column>
  </el-table>
</template>
<script>
  import {getTempCurriculum, deleteCurriculum} from '../api/exploration'
  import {setStore, getStore, removeStore, createGuid} from '../config/publicMethod'
    export default {
        props: ['culumLists','tabIndex'],
        data(){
          let userInfo = JSON.parse(getStore('userInfo'));
          return{
            prepareLessonsWay:userInfo.TeacherType,
          }
        },
        filters: {
          lineFeed(value,num){
            if (!value) return '';
            return value.split(/\s+/)[num];
          }
        },
        methods: {
          //删除课程列表
          async delCurriculumLists(index,row){
              let delParams={CurriculumID: row.CurriculumID};
              let result=await deleteCurriculum(delParams);
              if (result.code == 200) {
                this.sendDelMsgToParent();
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
            /*
             * 编辑课程
             * */
            curriculumEdit(index, row, type) {
                let classId = row.CurriculumID;
                if(type == 'apply'){
                  this.getIdiilList(classId);

                }else{
                  this.$router.push({path:'/addClassManager', query:{classType:type, classId:classId}})
                }
            },
            /*
            * 保存并使用当前选用idiil课件数据
            * */
            async getIdiilList(uid){
              let result = await getTempCurriculum({CurriculumID: uid}); //获取临时教材数据
              if (result.code == 200) {
                result=JSON.parse(Base64.decode(result.data[0].CurriculumnContent));

                let classId=createGuid();
                setStore(`sourceLists-${classId}`,result);
                let type = 'edit';
                this.$router.push({path:'/addClassManager', query:{classType:type, classId:classId}})
              }
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
            * 向父组件传值，告诉父组件删除该条课程
            * */
            sendDelMsgToParent(){
                if(this.prepareLessonsWay=='IDIIL'){
                  this.$emit('delMsgForChild')
                }else{
                  this.$emit('delCustomMsgForChild')
                }
              }

        }
    }
</script>
<style scoped lang="less">

</style>
