<template>
  <div>
    <head-top></head-top>
    <section class="classManagerList_section">
      <div class="block">
        <span class="demonstration">选择日期</span>
        <el-date-picker
          v-model="selectedDate"
          type="daterange"
          align="right"
          unlink-panels
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions2"
          @change="screeningByTime">
        </el-date-picker>
      </div>
      <el-checkbox-group v-model="checkedSearchTypes" @change="handleCheckedSearchTypesChange">
        <el-checkbox v-for="searchType in searchTypes" :label="searchType" :key="searchType">{{searchType}}</el-checkbox>
      </el-checkbox-group>
      选择状态：
      <el-radio-group :disabled="cannotScreeningByStatus" v-model="status" @change="changeStatus">

        <el-radio label="未开始">未开始</el-radio>
        <el-radio label="进行中">进行中</el-radio>
        <el-radio label="已完成">已完成</el-radio>
      </el-radio-group>
      <el-card class="box-card" style="height: 600px">
        <div slot="header" class="clearfix">
          <span>派课列表</span>
        </div>
        <div>
          <el-table
            :data="tableData"
            border
            style="width: 100%;text-align: center"
            :cell-style = 'statusStyle'
            :row-style='showStyle'
            >
            <el-table-column
              prop="date"
              label="日期">
            </el-table-column>
            <el-table-column
              prop="name"
              label="课程">
            </el-table-column>
            <el-table-column
              prop="status"
              label="状态">
            </el-table-column>
            <el-table-column
              fixed="right"
              label="操作">
              <template slot-scope="scope">
                <el-button-group>
                  <el-button type="primary" icon="el-icon-edit" @click="handleClick(scope.row)"></el-button>
                  <el-button type="primary" icon="el-icon-delete" @click="handleDelete(scope.$index, scope.row)"></el-button>
                </el-button-group>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-card>
    </section>
    <el-dialog
      title="派课信息"
      :visible.sync="dialogVisible"
      width="50%"
      :before-close="handleClose">
      <div class="text item">
        <table width="100%" height="" border="0" cellpadding="10">
          <tbody>
          <tr>
            <td width="100px">课程名:</td>
            <td>{{name}}</td>
          </tr>
          <tr>
            <td>教学目标:</td>
            <td>{{target}}</td>
          </tr>
          </tbody>
        </table>
        <class-team></class-team>
      </div>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
  import headTop from '../../components/headTop'
  import classTeam from '../../components/classTeam'
  import {setStore, getStore} from '../../config/publicMethod'
  import {toJson} from '../../config/methods'
  import {writeFileJson, doTestLogin} from '../../api/user'
  import {getCourseList, updateDoingCourseInfo, deleteCourseListInfo} from '../../api/classes'
  import classData from '../../data/classlist'
  import {baseUrl_dev} from '../../config/env'
  const searchTypeOptions = ['查看全部','按时间', '按状态'];
  export default {
    data() {
      let classList = JSON.parse(getStore("classList"))
      return {
        tableData: [{
          date: '2019-04-02',
          name: '分数的认识-班级1',
          target:"提高学生的自主学习能力",
          status: '未开始',
          show:'Y'
        }, {
          date: '2019-04-03',
          name: '分数的认识-班级2',
          target:"提高学生的自主学习能力",
          status: '进行中',
          show:'Y'
        }, {
          date: '2019-04-03',
          name: '因数与倍数',
          target:"提高学生的自主学习能力",
          status: '未开始',
          show:'Y'
        }, {
          date: '2019-04-06',
          name: '乘法的意义',
          target:"提高学生的自主学习能力",
          status: '已完成',
          show:'Y'
        }],
        dialogVisible:false,
        tableSelectedData:'',
        target:"",
        name:"",
        startDate:"",
        endDate:"",
        status:"",
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
         //classList: classList
        cannotScreeningByStatus:true
      }
    },
    components: {
      headTop,
      classTeam
    },
    activated() {
      //当切换路由的时候 如果需要 vue保存缓存的话，但是部分的值不需要，则可以在这里面重新赋值，如果没有keep-alive,则每次都会重新加载所有数据
      this.getClassListInfo()
    },
    mounted() {
      $('.el-card__header').css('backgroundColor', '#67c4ed');
      this.getClassListInfo()
    },
    computed: {
      // sourceData() {
      //   let source = toJson(this.tableData.source);
      //   return source;
      // },
      // otherSource() {
      //   let othersource = this.tableData.otherSource ? this.tableData.otherSource : this.tableData.othersource
      //   let othersource2 = toJson(othersource);
      //   return othersource2;
      // },
    },
    methods: {
      async getClassListInfo() {
        let userInfo = JSON.parse(getStore("userInfo"));
        let classList2 = await getCourseList({teacherId: userInfo.userId});//数据库获取教师的派课列表
        console.log("数据库获取教师的派课列表---classList2----->>", classList2)
        if (classList2.data.length > 0) {
          this.classList = classList2.data
        }
        console.log("this.tableData--->>", this.tableData)
      },
      toJson: function (str) {
        return toJson(str)
      },
      handleClick(row){
        this.dialogVisible=true;
        this.target=row.target;
        this.name=row.name;
      },
      handleClose(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
      },
      statusStyle({row, column, rowIndex, columnIndex}) {
        if(columnIndex==2){
          if(row.status==="未开始"){
            return {"text-align":"center",color:"#67C23A"};
          }else if(row.status==="进行中"){
            return {"text-align":"center",color:"#E6A23C"};
          }else if(row.status==="已完成"){
            return {"text-align":"center",color:"#F56C6C"};
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
      handleDelete(index, row) {
        this.tableData.splice(index,1)
      },
      handleCheckedSearchTypesChange(value) {
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
