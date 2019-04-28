<template>
  <div>
    <head-top></head-top>
    <section class="classManagerList_section">
      <el-row>
        <el-col :span="24" style="text-align: left;margin-bottom: 10px"><el-button type="primary" round @click="goToAddClass" >新增备课</el-button></el-col>
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
            <el-form-item label="课程类型">
              <el-select v-model="formInline.CourseType1" placeholder="课程类型">
                <el-option label="爱迪乐探究课程" value="idiil"></el-option>
                <el-option label="自定义探究课程" value="custom"></el-option>
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
        <el-col :span="24">
          <el-table
            :data="classList"
            border
            style="width: 100%;text-align: center"
            :header-cell-style="tableHeaderColor"
          >
            <el-table-column
              prop="name"
              label="课程"
              align="center"
            >
            </el-table-column>
            <el-table-column
              fixed="right"
              label="操作"
              align="center">
              <template slot-scope="scope">
                <el-button-group>
                  <el-button type="primary" icon="el-icon-view" @click="handleClick(scope.row)" title="查看">查看</el-button>
                  <el-button type="primary" icon="el-icon-edit" @click="goToAddClass(scope.row)" title="编辑">编辑</el-button>
                  <el-button type="primary" icon="el-icon-document" @click="goToPK(scope.row)" title="上课">上课</el-button>
                  <el-button type="primary" icon="el-icon-delete" @click="handleDelete(scope.$index, scope.row)" title="删除">删除</el-button>
                </el-button-group>
              </template>
            </el-table-column>
          </el-table>
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
          <el-pagination
            background
            layout="prev, pager, next"
            :total="totalItem">
          </el-pagination>
        </el-col>
      </el-row>
    </section>
  </div>
</template>

<script type="text/ecmascript-6">
  import headTop from '../../components/headTop'
  import addClass from './addClass'
  import {setStore, getStore} from '../../config/publicMethod'
  import {toJson} from '../../config/methods'
  import {writeFileJson, doTestLogin} from '../../api/user'
  import {getCourseList, updateDoingCourseInfo, deleteCourseListInfo} from '../../api/classes'
  import classData from '../../data/classlist'
  import {baseUrl_dev} from '../../config/env'

  export default {
    data() {
      let classList = JSON.parse(getStore("classList"))
      let classList1 = JSON.parse(
        '[{"aaa":"人教版：三年级上册；第八章；分数的初步认识。北师大版：三年级下册；第六章；认识分数。","id":70,"courseId":"00201MM201903002","classId":"XiRk1551778540757","teacherId":"01","teacherName":"teacher1","name":"自定义发现式数学111","subjectId":0,"subjectName":"数学","group_student_Info":"{\\"groupArray\\":[\\"IDIIL--A组\\",\\"IDIIL--B组\\",\\"IDIIL--C组\\"],\\"nowGroup\\":[\\"学生列表\\",\\"IDIIL--C组\\"],\\"nowList\\":[\\"7\\",\\"8\\",\\"9\\"],\\"nowStudentData\\":[],\\"groups\\":[{\\"name\\":\\"IDIIL--A组\\",\\"studentItem\\":[{\\"userId\\":\\"001\\",\\"userName\\":\\"学生一\\",\\"Password\\":\\"1111\\",\\"key\\":\\"1\\"},{\\"userId\\":\\"003\\",\\"userName\\":\\"学生三\\",\\"Password\\":\\"1111\\",\\"key\\":\\"3\\"},{\\"userId\\":\\"005\\",\\"userName\\":\\"学生五\\",\\"Password\\":\\"1111\\",\\"key\\":\\"5\\"}]},{\\"name\\":\\"IDIIL--B组\\",\\"studentItem\\":[{\\"userId\\":\\"002\\",\\"userName\\":\\"学生二\\",\\"Password\\":\\"1111\\",\\"key\\":\\"2\\"},{\\"userId\\":\\"004\\",\\"userName\\":\\"学生四\\",\\"Password\\":\\"1111\\",\\"key\\":\\"4\\"},{\\"userId\\":\\"006\\",\\"userName\\":\\"学六生\\",\\"Password\\":\\"1111\\",\\"key\\":\\"6\\"}]},{\\"name\\":\\"IDIIL--C组\\",\\"studentItem\\":[{\\"userId\\":\\"007\\",\\"userName\\":\\"学生七\\",\\"Password\\":\\"1111\\",\\"key\\":\\"7\\"},{\\"userId\\":\\"008\\",\\"userName\\":\\"学生八\\",\\"Password\\":\\"1111\\",\\"key\\":\\"8\\"},{\\"userId\\":\\"009\\",\\"userName\\":\\"学生九\\",\\"Password\\":\\"1111\\",\\"key\\":\\"9\\"}]}]}","createDate":"2019-04-10T09:41:46.000Z","target":"提高学生的自主学习能力","source":"[{\\"name\\":\\"绝对值的概念和简单的性质\\",\\"params\\":{\\"sChapterID\\":\\"C025\\",\\"sUnitID\\":\\"01\\",\\"sChapterName\\":\\"ABSE_C\\",\\"sUnitName\\":\\"1\\",\\"sDirName\\":\\"ABS_1\\",\\"sCenterID\\":\\"002\\",\\"sCenterWeb\\":\\"https://nwprodsub.idiil.com.cn\\",\\"sMainWeb\\":\\"https://nwdev.idiil.com.cn\\",\\"sAssignID\\":\\"0001\\",\\"sPerformanceID\\":\\"0001\\",\\"OutputType\\":\\"C\\",\\"GlobalID\\":\\"C02501\\"},\\"type\\":\\"class\\",\\"uid\\":1553933805239},{\\"name\\":\\"寻找最近的整十（百、千）数(有图)数轴填表\\",\\"params\\":{\\"sChapterID\\":\\"C004\\",\\"sUnitID\\":\\"01\\",\\"sChapterName\\":\\"ESTI_C\\",\\"sUnitName\\":\\"1\\",\\"sDirName\\":\\"ESTIMATE_1\\",\\"sCenterID\\":\\"002\\",\\"sCenterWeb\\":\\"https://nwprodsub.idiil.com.cn\\",\\"sMainWeb\\":\\"https://nwdev.idiil.com.cn\\",\\"sAssignID\\":\\"0001\\",\\"sPerformanceID\\":\\"0001\\",\\"OutputType\\":\\"C\\",\\"GlobalID\\":\\"C00401\\"},\\"type\\":\\"class\\",\\"uid\\":1553933809710},{\\"name\\":\\"数的大小与数轴关系\\",\\"params\\":{\\"sChapterID\\":\\"C008\\",\\"sUnitID\\":\\"01\\",\\"sChapterName\\":\\"IEQ1_C\\",\\"sUnitName\\":\\"1\\",\\"sDirName\\":\\"IEQUI_1\\",\\"sCenterID\\":\\"002\\",\\"sCenterWeb\\":\\"https://nwprodsub.idiil.com.cn\\",\\"sMainWeb\\":\\"https://nwdev.idiil.com.cn\\",\\"sAssignID\\":\\"0001\\",\\"sPerformanceID\\":\\"0001\\",\\"OutputType\\":\\"C\\",\\"GlobalID\\":\\"C00801\\"},\\"type\\":\\"class\\",\\"uid\\":1553933818254},{\\"name\\":\\"平面直角坐标系引入\\",\\"params\\":{\\"sChapterID\\":\\"C028\\",\\"sUnitID\\":\\"01\\",\\"sChapterName\\":\\"XYI_C\\",\\"sUnitName\\":\\"1\\",\\"sDirName\\":\\"CXY1_1\\",\\"sCenterID\\":\\"002\\",\\"sCenterWeb\\":\\"https://nwprodsub.idiil.com.cn\\",\\"sMainWeb\\":\\"https://nwdev.idiil.com.cn\\",\\"sAssignID\\":\\"0001\\",\\"sPerformanceID\\":\\"0001\\",\\"OutputType\\":\\"C\\",\\"GlobalID\\":\\"C02801\\"},\\"type\\":\\"class\\",\\"uid\\":1553933822918},{\\"name\\":\\"写出下一个数（1~9），例4→□\\",\\"params\\":{\\"sChapterID\\":\\"R001\\",\\"sUnitID\\":\\"01\\",\\"sChapterName\\":\\"A1\\",\\"sUnitName\\":\\"1\\",\\"sDirName\\":\\"R001_001\\",\\"sCenterID\\":\\"002\\",\\"sCenterWeb\\":\\"https://nwprodsub.idiil.com.cn\\",\\"sMainWeb\\":\\"https://nwdev.idiil.com.cn\\",\\"sAssignID\\":\\"0001\\",\\"sPerformanceID\\":\\"0001\\",\\"OutputType\\":\\"P\\",\\"GlobalID\\":\\"R00101\\"},\\"type\\":\\"class\\",\\"uid\\":1553933829788},{\\"name\\":\\"写出下一个数（11~19）\\",\\"params\\":{\\"sChapterID\\":\\"R001\\",\\"sUnitID\\":\\"02\\",\\"sChapterName\\":\\"A1\\",\\"sUnitName\\":\\"2\\",\\"sDirName\\":\\"R001_002\\",\\"sCenterID\\":\\"002\\",\\"sCenterWeb\\":\\"https://nwprodsub.idiil.com.cn\\",\\"sMainWeb\\":\\"https://nwdev.idiil.com.cn\\",\\"sAssignID\\":\\"0001\\",\\"sPerformanceID\\":\\"0001\\",\\"OutputType\\":\\"P\\",\\"GlobalID\\":\\"R00102\\"},\\"type\\":\\"class\\",\\"uid\\":1553933831974},{\\"name\\":\\"分数乘法的意义（通过图形说明，结果约分而且假分数写成带分数）\\",\\"params\\":{\\"sChapterID\\":\\"C006\\",\\"sUnitID\\":\\"01\\",\\"sChapterName\\":\\"F3_C\\",\\"sUnitName\\":\\"1\\",\\"sDirName\\":\\"F1MULTIPLY\\",\\"sCenterID\\":\\"002\\",\\"sCenterWeb\\":\\"https://nwprodsub.idiil.com.cn\\",\\"sMainWeb\\":\\"https://nwdev.idiil.com.cn\\",\\"sAssignID\\":\\"0001\\",\\"sPerformanceID\\":\\"0001\\",\\"OutputType\\":\\"C\\",\\"GlobalID\\":\\"C00601\\"},\\"type\\":\\"class\\",\\"uid\\":1553997671688}]","otherSource":"[]","commits":"add a picture","saveFlag":"1","doingclassinfo":null,"doflag":"done","courseType":"MM","centerId":"002"},' +
        '{"id":71,"courseId":"00201MM201904003","classId":"XiRk1551778540757","teacherId":"01","teacherName":"teacher1","name":"自定义课程2","subjectId":0,"subjectName":"数学","group_student_Info":"{\\"groupArray\\":[\\"默认组\\"],\\"nowGroup\\":[\\"学生列表\\",\\"默认组\\"],\\"nowList\\":[\\"1\\",\\"2\\",\\"3\\",\\"4\\",\\"9\\",\\"10\\"],\\"nowStudentData\\":[],\\"groups\\":[{\\"name\\":\\"默认组\\",\\"studentItem\\":[{\\"userId\\":\\"001\\",\\"userName\\":\\"学生一\\",\\"Password\\":\\"1111\\",\\"key\\":\\"1\\"},{\\"userId\\":\\"002\\",\\"userName\\":\\"学生二\\",\\"Password\\":\\"1111\\",\\"key\\":\\"2\\"},{\\"userId\\":\\"003\\",\\"userName\\":\\"学生三\\",\\"Password\\":\\"1111\\",\\"key\\":\\"3\\"},{\\"userId\\":\\"004\\",\\"userName\\":\\"学生四\\",\\"Password\\":\\"1111\\",\\"key\\":\\"4\\"},{\\"userId\\":\\"009\\",\\"userName\\":\\"学生九\\",\\"Password\\":\\"1111\\",\\"key\\":\\"9\\"},{\\"userId\\":\\"0010\\",\\"userName\\":\\"学生十\\",\\"Password\\":\\"1111\\",\\"key\\":\\"10\\"}]}]}","createDate":"2019-04-01T06:00:34.000Z","target":"qweqweqweqwe","source":"[{\\"name\\":\\"横式三位数加法，不需进位(看图)\\",\\"params\\":{\\"sChapterID\\":\\"C022\\",\\"sUnitID\\":\\"01\\",\\"sChapterName\\":\\"AS1_C\\",\\"sUnitName\\":\\"1\\",\\"sDirName\\":\\"IPLUS100\\",\\"sCenterID\\":\\"002\\",\\"sCenterWeb\\":\\"https://nwprodsub.idiil.com.cn\\",\\"sMainWeb\\":\\"https://nwdev.idiil.com.cn\\",\\"sAssignID\\":\\"0001\\",\\"sPerformanceID\\":\\"0001\\",\\"OutputType\\":\\"C\\",\\"GlobalID\\":\\"C02201\\"},\\"type\\":\\"class\\",\\"uid\\":1554098345228}]","otherSource":"[]","commits":"swdasdasdasdasdasd","saveFlag":"1","doingclassinfo":null,"doflag":"do","courseType":"MM","centerId":"002"},' +
        '{"id":75,"courseId":"00201MM201904006","classId":"XiRk1551778540757","teacherId":"01","teacherName":"teacher1","name":"自定义课程3","subjectId":0,"subjectName":"数学","group_student_Info":"{\\"groupArray\\":[\\"默认组\\"],\\"nowGroup\\":[\\"学生列表\\",\\"默认组\\"],\\"nowList\\":[\\"0\\",\\"1\\",\\"2\\"],\\"nowStudentData\\":[],\\"groups\\":[{\\"name\\":\\"默认组\\",\\"studentItem\\":[{\\"userId\\":\\"007\\",\\"userName\\":\\"student1\\",\\"key\\":\\"0\\"},{\\"userId\\":\\"008\\",\\"userName\\":\\"student2\\",\\"key\\":\\"1\\"},{\\"userId\\":\\"009\\",\\"userName\\":\\"student3\\",\\"key\\":\\"2\\"}]}]}","createDate":"2019-04-08T12:20:06.000Z","target":"绝对值运算绝对值运算","source":"[{\\"name\\":\\"绝对值的概念和简单的性质\\",\\"params\\":{\\"sChapterID\\":\\"C025\\",\\"sUnitID\\":\\"01\\",\\"sChapterName\\":\\"ABSE_C\\",\\"sUnitName\\":\\"1\\",\\"sDirName\\":\\"ABS_1\\",\\"sCenterID\\":\\"002\\",\\"sCenterWeb\\":\\"https://nwprodsub.idiil.com.cn\\",\\"sMainWeb\\":\\"https://nwdev.idiil.com.cn\\",\\"sAssignID\\":\\"0001\\",\\"sPerformanceID\\":\\"0001\\",\\"OutputType\\":\\"C\\",\\"GlobalID\\":\\"C02501\\"},\\"type\\":\\"class\\",\\"uid\\":1554725913670}]","otherSource":"[]","commits":"绝对值运算绝对值运算","saveFlag":"1","doingclassinfo":null,"doflag":"do","courseType":"MM","centerId":"002"}]'
      )
      return {
        classList: classList,
        classList1: classList1,

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
        totalItem:classList.length
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
      $('.el-card__header').css('backgroundColor', '#67c4ed');
      this.getClassListInfo()
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
      async getClassListInfo() {
        let userInfo = JSON.parse(getStore("userInfo"));
        let classList2 = await getCourseList({teacherId: userInfo.userId});//数据库获取教师的派课列表
        console.log("数据库获取教师的派课列表---classList2----->>", classList2)
        if (classList2.data.length > 0) {
          this.classList = classList2.data
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
      clickItem1(item, index) {
        console.log(item, index);
        this.currentindex = -1;
        this.currentindex1 = index;
        this.tableData = this.classList1[index]
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
      //删除课件处理函数
      deleteCourseConfirm(tableData, index) {
        this.$confirm('此操作将永久删除该课件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteCourse(tableData, index);
          //关闭修改弹框的之后重新加载一遍数据，刷新视图
          this.currentindex = 0;
          this.getClassListInfo()
        }).catch(() => {
          this.$message({type: 'info', message: '已取消删除'});
        });
      },
      async deleteCourse(tableData, index) {
        console.log("删除的课程", tableData, index)
        const result = await deleteCourseListInfo(tableData);//删除课件
        if (result.code == 200) {
          this.classList.splice(index, 1);
          this.$message({type: 'success', message: '删除成功!'});
        }
      },
      goToAddClass(){
        this.$router.push({name:'addClassManager',params:{tableData:JSON.stringify(this.tableData)}})
      },
      goToPK(){
        this.$router.push({name:'classTeam',params:{tableData:JSON.stringify(this.tableData)}})
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
