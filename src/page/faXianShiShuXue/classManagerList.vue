<template>
  <div>
    <head-top></head-top>
    <section class="classManagerList_section">
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
            :header-cell-style="tableHeaderColor">
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
                <!--<el-button size="mini" type="primary" icon="el-icon-document" @click="goToPK(scope.row)" title="上课">上课</el-button>-->
                <el-button size="mini" type="danger" @click="curriculumDelete(scope.$index, scope.row)" title="删除">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <!--<el-pagination-->
            <!--background-->
            <!--layout="prev, pager, next"-->
            <!--:total="totalItem">-->
          <!--</el-pagination>-->
        </el-col>
      </el-row>
      <!--查看课程弹框-->
      <el-dialog
        title="课程描述"
        :visible.sync="dialogVisible"
        width="30%"
        :before-close="handleClose">
        <div class="text item">
          <table width="100%" height="500px" border="0" cellpadding="10">
            <tbody>
            <tr>
              <td width="100px">课程名:</td>
              <td>{{tableData.name}}</td>
            </tr>
            <tr>
              <td>教学目标:</td>
              <td>{{tableData.target}}</td>
            </tr>
            <tr>
              <td>对应教材:</td>
              <td>{{tableData.aaa}}</td>
            </tr>
            <tr>
              <td>IDIIL课件:</td>
              <td>
                <div v-if="sourceData.length>0">
                  <li class="resoucelist"
                      v-for="item1 in sourceData">
                    {{item1.name}}
                  </li>
                </div>
              </td>
            </tr>
            <tr>
              <td>课外资料:</td>
              <td>
                <div v-if="otherSource.length>0">
                  <li class="resoucelist"
                      v-for="item2 in otherSource">
                    <span>{{item2.name}}</span>
                    <a :href="'/' + item2.response.file" :download="item2.name">下载</a>
                  </li>
                </div>
              </td>
            </tr>
            <tr>
              <td>备注:</td>
              <td>{{tableData.commits}}</td>
            </tr>
            </tbody>
          </table>
        </div>
        <span slot="footer" class="dialog-footer"></span>
      </el-dialog>
    </section>
  </div>
</template>

<script type="text/ecmascript-6">
  import headTop from '../../components/headTop'
  import addClass from './addClass'
  import {setStore, getStore, removeStore} from '../../config/publicMethod'
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
        classList: classList,
        tableData: classList.length > 0 ? classList[0] : classData.classList,
        currentindex: 0,//当前选择的爱迪乐探究课程列表
        currentindex1: -1,//当前选择的自定义探究课程列表
        isCollapse: false,
        dialogEditVisible: false,
        formLabelWidth: '90px',
        datetimes: '',
        formInline: {
          CourseType: '',
          Name: '',
          CourseType1:''
        },
        dialogVisible:false,
        totalItem:classList.length,
        culumLists:[]
      }
    },
    components: {
      headTop,
      addClass
    },
    activated() {
      //当切换路由的时候 如果需要 vue保存缓存的话，但是部分的值不需要，则可以在这里面重新赋值，如果没有keep-alive,则每次都会重新加载所有数据
      this.getClassListInfo()
    },
    mounted() {
      this.getCurriculumLists();

    },
    computed: {
      sourceData() {
        let source = toJson(this.tableData.source);
        return source;
      },
      otherSource() {
        let othersource = this.tableData.otherSource ? this.tableData.otherSource : this.tableData.othersource
        let othersource2 = toJson(othersource);
        return othersource2;
      },
    },
    methods: {
      // 获取课程列表
      async getCurriculumLists(){
        let result=await getCurriculumList();
        this.culumLists=result.data;
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

      async getClassListInfo() {
        let userInfo = JSON.parse(getStore("userInfo"));
        let classList2 = await getCourseList({teacherId: userInfo.userId});//数据库获取教师的派课列表
        console.log("数据库获取教师的派课列表---classList2----->>", classList2)
        if (classList2.data.length > 0) {
          this.classList = classList2.data;
          this.tableData = classList2.data[this.currentindex];
        }
        console.log("this.tableData--->>", this.tableData)
      },
      tableHeaderColor({ row, column, rowIndex, columnIndex }) {
        if (rowIndex === 0) {
          return 'background-color: #EFF2F7;color: #000000;font-weight: 500;'
        }
      },
      handleClick(row){
        this.dialogVisible=!this.dialogVisible;
        this.target=row.target;
        this.name=row.name;
      },
      toJson: function (str) {
        return toJson(str)
      },
      closeDialogHandle() {
        console.log("closeDialogHandle");
        //关闭修改弹框的之后重新加载一遍数据，刷新视图
        this.getClassListInfo()
      },
      clickItem(item, index) {
        console.log(item, index);
        this.currentindex1 = -1;
        this.currentindex = index;
        this.tableData = this.classList[index]
      },

      async goToClass(tableData) {
        console.log("跳转链接", tableData);
        const result1 = await updateDoingCourseInfo(tableData);//更新数据库数据，保存当前正在做的课件信息
        if (result1.code == 200) {
          if (result1.type == '1') {
            this.$alert("当前（ " + result1.data[0].name + " ）的课程还未讲完!", '提示：');
            return
          }
        }
        //将派课的参数上传。写入JSON中
        const result = await writeFileJson(tableData);
        if (result.code == 200) {
          console.log("本地写入当前准备讲的课程的信息---writeFileJson--->", result.data)
        } else {
          console.error("写入当前准备讲的课程的信息---writeFileJson-- 失败->", result)
          return
        }
        //设置缓存，刚才派课的json数据
        setStore("ClassUserList", result.data);
        let dataParams = {};
        dataParams.teacherId = JSON.parse(getStore('userInfo')).userId;
        dataParams.centerId = result.data.CenterID;
        dataParams.performanceID = result.data.classList.courseId;//课程ID
        let url = baseUrl_dev + '/SYSTEM/MathInteractive/OnlineBuildDataDeal/OnlineBuildDataDeal.jsp?InstructorID=' + dataParams.teacherId + '&sCenterID=' + dataParams.centerId + '&sPerformanceID=' + dataParams.performanceID;
        console.warn("老师上课的地址url-->", url)
        window.open(url)
      },
      handleClose(){

      },
      /*
      * 添加课程
      * */
      curriculumAdd(type){
        let classId=this.createGuid();
        this.$router.push({path:'/addClassManager', query:{classType:type, classId:classId}})
      },
      /*
      * 跳转到上课
      * */
      goToPK(){
        this.$router.push({name:'classTeam',params:{tableData:JSON.stringify(this.tableData)}})
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
       * 创建guid
       * */
      createGuid() {
        var s = [];
        var hexDigits = "0123456789abcdef";
        for (var i = 0; i < 36; i++) {
          s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
        }
        s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
        s[8] = s[13] = s[18] = s[23] = "-";

        var uuid = s.join("");
        return uuid;
      }

    }
  }
</script>

<style scoped lang="less" type="text/less">
  .classManagerList_section {
    padding: 20px;
    margin-bottom: 40px;
    height:800px;
    overflow: scroll;

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

  }
</style>
