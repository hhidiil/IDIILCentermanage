<template>
  <div>
    <head-top></head-top>
    <section class="classManagerList_section">
      <!--<el-row>-->
        <!--<el-col :span="24" style="text-align: center;margin-bottom: 10px">-->
          <!--<div class="block">-->
            <!--<span class="demonstration">选择日期</span>-->
            <!--<el-date-picker-->
              <!--v-model="selectedDate"-->
              <!--type="daterange"-->
              <!--align="right"-->
              <!--unlink-panels-->
              <!--range-separator="至"-->
              <!--start-placeholder="开始日期"-->
              <!--end-placeholder="结束日期"-->
              <!--:picker-options="pickerOptions2"-->
              <!--@change="changeStatus">-->
            <!--</el-date-picker>-->
          <!--</div>-->
        <!--</el-col>-->
      <!--</el-row>-->
      <!--<el-row>-->
        <!--<el-col :span="24" style="text-align: center;margin-bottom: 10px">-->
          <!--<el-checkbox-group v-model="checkedSearchTypes" @change="handleCheckedSearchTypesChange">-->
            <!--<el-checkbox v-for="searchType in searchTypes" :label="searchType" :key="searchType">{{searchType}}</el-checkbox>-->
          <!--</el-checkbox-group>-->
        <!--</el-col>-->
      <!--</el-row>-->
      <!--<el-row>-->
        <!--<el-col :span="24" style="text-align: center;margin-bottom: 10px">-->
          <!--选择状态：-->
          <!--<el-radio-group :disabled="cannotScreeningByStatus" v-model="status" @change="changeStatus">-->
            <!--<el-radio label="未开始">未开始</el-radio>-->
            <!--<el-radio label="进行中">进行中</el-radio>-->
            <!--<el-radio label="已完成">已完成</el-radio>-->
          <!--</el-radio-group>-->
        <!--</el-col>-->
      <!--</el-row>-->
      <el-row>
        <el-col :span="24" style="text-align: right;margin-bottom: 10px">
          <div class="controlInfo">
            <curriculum-search></curriculum-search>
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

  const searchTypeOptions = ['查看全部','按时间', '按状态'];
  export default {
    data() {
      let classList = JSON.parse(getStore("classList"));
      return {
        dialogVisible:false,
        tableSelectedData:'',
        target:"",
        name:"",
        startDate:"",
        endDate:"",
        status:"未开始",
        pickerOptions2: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              this.startDate=start.getTime();
              this.endDate=end.getTime();
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              this.startDate=start.getTime();
              this.endDate=end.getTime();
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              this.startDate=start.getTime();
              this.endDate=end.getTime();
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        selectedDate:[new Date(),new Date()],
        checkAll: false,
        checkedSearchTypes: ['查看全部'],
        searchTypes: searchTypeOptions,
        cannotScreeningByStatus:true,
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
        let inputJson={
          AssignID:'', //AssignID--派课ID
          SchoolID:'', // SchoolID--学校ID
          UserID:'', //UserID--教师ID
          Status:'' // Status--状态
        };
        let result=await getAssignmentList(inputJson);
        this.sendLessonsLists=result.data;
        console.log(this.sendLessonsLists)
      },
      //删除一条派课
      async deleteAssignment(index,row) {
        let delParams={AssignID: row.AssignID};
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
      showStyle({row, rowIndex}){
        if(row.show==="Y"){
          return {display:""};
        }else{
          return {display:"none"};
        }
      },

      handleCheckedSearchTypesChange(value) {
        debugger
        if(value[value.length-1]==="查看全部"){
          this.checkedSearchTypes= ['查看全部'];
          this.showAll();
          this.cannotScreeningByStatus=true;
        }else{
          if(this.checkedSearchTypes.indexOf("查看全部")!=-1){
            this.checkedSearchTypes.splice(this.checkedSearchTypes.indexOf("查看全部"),1)
          }
          if(value.length===1&&this.checkedSearchTypes[0]===("按时间")){
            this.cannotScreeningByStatus=true;
            this.screeningByTime();
          }else if(value.length===1&&this.checkedSearchTypes[0]===("按状态")){
            this.cannotScreeningByStatus=false;
            this.screeningByStatus();
          }else if(value.length===2){
            this.cannotScreeningByStatus=false;
            this.screeningByAll();
          }
        }
        if(value.length===0){
          this.checkedSearchTypes= ['按时间'];
          this.cannotScreeningByStatus=true;
          this.screeningByTime();
        }
      },
      screeningByTime(){
        if(this.checkedSearchTypes[0]==="查看全部"){
          return;
        }
        const start=this.selectedDate[0].getTime();
        const end=this.selectedDate[1].getTime()+86400000;
        this.tableData.forEach(item => {
          if (new Date(item.date).getTime()>end||new Date(item.date).getTime()<start) {
            item.show="N"
          }else{
            item.show="Y"
          }
        })
      },
      screeningByStatus(){
        const status=this.status;
        this.tableData.forEach(item => {
          if (item.status===status) {
            item.show="Y"
          }else{
            item.show="N"
          }
        })
      },
      screeningByAll(){
        const start=this.selectedDate[0].getTime();
        const end=this.selectedDate[1].getTime()+86400000;
        const status=this.status;
        this.tableData.forEach(item => {
          if (new Date(item.date).getTime()<=end&&new Date(item.date).getTime()>=start&&item.status===status) {
            item.show="Y"
          }else{
            item.show="N"
          }
        })
      },
      showAll(){
        this.tableData.forEach(item => {
          item.show="Y"
        })
      },
      changeStatus(){
        this.handleCheckedSearchTypesChange(this.checkedSearchTypes)
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
  }
    .resoucelist {
      text-decoration: underline;
      margin: 5px 0;
    }

    .righttable table {
      border: 1px solid #999;

      tr td {
        border-top: 0;
        border-right: 1px solid #999;
        border-bottom: 1px solid #999;
        border-left: 0;

      }
    }

    .text {
      font-size: 14px;
      text-align: left;
    }

    .classlist {
      padding: 7px 4px;
      cursor: pointer;
      border-radius: 2px;
    }

    .item {
      margin-bottom: 5px;
    }

    .car_header {
      background-color: #67c4ed;
    }

    .listcolor {
      background-color: #ebeece;
    }

    .clearfix:before,
    .clearfix:after {
      display: table;
      content: "";
    }

    .clearfix:after {
      clear: both
    }

    .box-card {
      width: 100%;
    }
    .statusU{
      color:#67C23A !important;
    }
    .statusDoing{
      color:#E6A23C;
    }
    .statusDone{
      color:#F56C6C;
    }
  }
</style>
