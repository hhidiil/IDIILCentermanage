<template>

  <div>
    <!--总中心管理员登录的时候，显示；分中心管理员，不显示-->
    <div v-if="MaCenter" style="margin-top: 20px;">
      选择分中心：
      <el-select v-model="centerValue" placeholder="请选择" @change="selectChange">
        <el-option
          v-for="(item,index) in centerOptions"
          :key="index"
          :label="item.centerId"
          :value="item.centerId">
        </el-option>
      </el-select>
    </div>

    <div class="teacherManage_section">
      <header>
        <el-row>
          <el-col :span="12" class="grid-content titleSetion"><h2>班级列表</h2></el-col>
          <el-col :span="12" class="grid-content editSetion"><el-button type="primary" @click="addClass">新增班级</el-button></el-col>
        </el-row>
      </header>
      <section class="section_table">
        <el-table
          ref="multipleTable"
          :data="currentData"
          border
          height="450"
          :header-row-style="headerStyle"
          :highlight-current-row="true"
          :cell-style="cellStyle"
          style="width: 100%"
          @selection-change="handleSelectionChange">
          <el-table-column type="expand" label="详情" width="60">
            <template slot-scope="props">
              <el-row>
                <span>中心：{{ msg}}</span>
              </el-row>
              <el-form label-position="left" inline class="demo-table-expand" v-for=" (item,index) in props.row.otherInfo" :key="index">
                <el-form-item>
                  <span>{{"科目" + (index+1) + "："}}</span><span>{{item.subjectId=='0' ? '数学':'英语'}}</span>
                </el-form-item>
                <el-form-item label="老师:">
                  <span>{{item.teacherName}}</span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column
            type="selection"
            width="50">
          </el-table-column>
          <el-table-column
            type="index"
            width="50">
          </el-table-column>
          <el-table-column
            prop="classId"
            sortable
            label="班级编号">
          </el-table-column>
          <el-table-column
            prop="className"
            sortable
            label="班级名">
          </el-table-column>
          <el-table-column
            prop="grade"
            label="年级">
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                size="mini"
                @click="handleEdit(scope.$index, scope.row)">修改</el-button>
              <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-row>
          <el-col :span="12">
            <div style="text-align: left">
              <el-button @click="deleteSelection()">删除选中的项</el-button>
              <el-button @click="cancelSelection()">取消选择</el-button>
            </div>
          </el-col>
          <el-col :span="12">
            <el-pagination
              background
              layout="prev, pager, next"
              :page-size="pageSize"
              @current-change=this.PageChange
              :total="allData.length">
            </el-pagination>
          </el-col>
        </el-row>
        <el-dialog
          :title="aFlag ? '添加班级':'修改班级'"
          :show-close="modalClickOther"
          :visible.sync="dialogVisible"
          :closeOnClickModal="modalClickOther"
          width="30%">
          <el-form label-position="right" label-width="80px"
                   :inline="true"
                   class="demo-form-inline"
                   status-icon :rules="rules"
                   :model="ruleForm"
                   ref="classForm">
            <el-form-item label="班级名:">
              <el-input v-model="ruleForm.className"></el-input>
            </el-form-item>
            <el-form-item label="年级:">
              <el-input v-model="ruleForm.grade"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="MakeSureHandle(aFlag)">确 定</el-button>
          </span>
        </el-dialog>
      </section>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  import {getStore} from '../config/publicMethod'
  import {getAllManagerList,getAllClassesOfCenter,addClassInfo,deleteClassInfo} from './../api/manage'
  import {updateClassInfo} from './../api/classes'
  export default{
    data(){
      return{
        cellStyle:{
          textAlign:'center'
        },
        headerStyle:{
          backgroundColor:'rgb(117, 203, 214)',
          color: '#4f504b'
        },
        pageSize:10,
        allData:[],//所有的数据
        currentData:[],//当前页面展示的条数
        multipleSelection: [],
        dialogVisible:false,
        modalClickOther:false,
        ruleForm: {
          centerId:'',
          classId:'',
          className:'',
          grade:'',
        },
        rules: {
          className: [
            { required: true, message: '请输入班级名称', trigger: 'blur' },
          ],
          grade: [
            {required: true,  message: '请输入班级对应年级', trigger: 'blur' }
          ]
        },

        aFlag:true,//true:增加；false：修改
        centerOptions:[],
        centerValue:'',
        MaCenter:'',
      }
    },
    mounted(){
      //判断是否是总中心管理员
      if ( JSON.parse(getStore('manageUser')).centerId=='000' ){//总管理员
        //多加一个下拉框，选择分中心
        this.MaCenter = true;
        //先选择中心再查询：
        this.getAllUserList();
      }else{//分中心管理员，没有下拉框
        this.centerId = JSON.parse(getStore('manageUser')).centerId;
        this.MaCenter = false;
        //直接查询
        this.getAllClasses();
      }
    },
    computed: {
      dialogTitle(){
        return this.aFlag ? '':'';
      }
    },
    methods:{
      async getAllUserList(){
        let result1 = await getAllManagerList();
        console.log("All—center",result1)
        if(result1.code == 200){
          this.centerOptions = result1.data;
        }
      },
      async selectChange(val){
        console.log("choosed-centerId",val);
        this.centerValue = val;
        this.centerId = val;
        this.getAllClasses();
      },
      async getAllClasses(){
        let userInfo = JSON.parse(getStore('manageUser'));
        let centerId= getStore('centerToShow');//中心号

        let result = await getAllClassesOfCenter({centerId:this.centerId});

        this.allData = result.data;
        this.currentData = this.allData.slice(0,this.pageSize);
        console.log("所有的中心列表",result,this.allData)
      },
      handleEdit(index, row) {
        console.log(index, row);
        this.dialogVisible = true;
        this.aFlag = false;
        this.ruleForm = {
          className: row.className,
          grade: row.grade,
        }
      },
      async handleDelete(index, row) {
        console.log(index, row);
        let result = await deleteClassInfo(row);
        if(result.code == 200){
          this.$message({message: '删除成功！',type:'success'});
          let _this = this;
          setTimeout(()=>{
            _this.getAllClasses();
          },1500)
        }
      },
      PageChange(page){
        console.log("PageChange",page)
        let num = this.pageSize;
        this.currentData = this.allData.slice( (page-1)*num,(page-1)*num+num)
      },
      MakeSureHandle(flag){
        this.$refs.classForm.validate(async(valid) => {
          if(valid){
            let params = this.ruleForm;
            if(flag){//添加
              let result = await addClassInfo(params);
              if(result.code == 200){
                this.$message({message: '添加成功！',type:'success'});
              }
            }else{
//              let result = await updateClassInfo(params);
//              if(result.code == 200){
//                this.$message({message: '修改成功！',type:'success'});
//              }
            }

          }else {
            console.error('error register submit!!');
            return false;
          }
        })
      },
      addClass(){
        this.dialogVisible = true;
        this.aFlag = true;
        this.ruleForm.className = '';
        this.ruleForm.grade = '';
      },
      deleteSelection() {
        console.log("选择的行：：---》》》",this.$refs.multipleTable.selection);
      },
      cancelSelection(rows) {
        this.$refs.multipleTable.clearSelection();
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
    }
  }
</script>
<style scoped lang="less" type="text/less">
  .teacherManage_section {
    position: relative;
    padding: 20px;
    overflow: auto;
  .section_table{
    border: 1px solid gainsboro;
    padding: 10px;
  }
  .titleSetion{
    padding: 20px;
    text-align: left;
  }
  .editSetion{
    padding: 20px;
    text-align: right;
  }
  .questionStyle{
    padding: 10px;
  }
  }
  .el-row {
    font-size: 14px;
  &:last-child {
     margin-bottom: 0;
   }
  }
  .el-col {
    border-radius: 4px;
    padding: 5px 0;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 32px;
    line-height: 32px;
  }
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    min-width: 200px;
  }
  .demo-table-expand .el-form-item label {
    width: 90px;
    color: #99a9bf;
  }
</style>
