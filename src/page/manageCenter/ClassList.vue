<template>
  <div>
    <head-top></head-top>
    <div class="centerManage_section" :xs="4" :sm="6" :md="8" :lg="15" :xl="15">
      <header>
        <el-row>
          <el-col :span="12" class="grid-content titleSetion"><h2>班级管理</h2></el-col>
        </el-row>
      </header>
      <!--选择中心-->
      <el-row>
        <el-col :span="12">
            <el-select v-model="chooseCenterListData" placeholder="选择中心" @change="chooseCenterList" @visible-change="visibleChangeCenter">
              <el-option
                v-for="(item,index) in chooseCenterOption"
                :key="index"
                :label="item.CenterID"
                :value="item">
              </el-option>
            </el-select>
            <el-select v-model="chooseSchoolListData" placeholder="选择学校" @change="chooseSchoolList">
              <el-option
                v-for="(item,index) in chooseSchoolOption"
                :key="index"
                :label="item.SchoolName"
                :value="item">
              </el-option>
            </el-select>

        </el-col>
        <el-col :span="12">
          <el-button type="primary" @click="addClass">添加班级</el-button>
        </el-col>
        <el-col :span="24" class="TwoTable">
          <section>
         <!--   <el-table
              ref="multipleTable" :data="currentData" border height="450" :header-row-style="headerStyle" :highlight-current-row="true" :cell-style="cellStyle"
              @selection-change="handleSelectionChange">
              <el-table-column type="selection" width="50"></el-table-column>
              <el-table-column type="index" width="50"></el-table-column>
              <el-table-column prop="SchoolID" label="SchoolID"></el-table-column>
              <el-table-column prop="ClassID" label="ClassID"></el-table-column>
              <el-table-column prop="ClassCode" label="ClassCode"></el-table-column>
              <el-table-column prop="ClassName" label="ClassName"></el-table-column>
              <el-table-column prop="ClassGrade" label="ClassGrade"></el-table-column>
              <el-table-column prop="ClassMaster" label="ClassMaster"></el-table-column>
              <el-table-column prop="ClassProgram" label="ClassProgram"></el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    @click="handleEdit(scope.$index, scope.row)">修改</el-button>
                  <el-button
                    size="mini"
                    type="danger"
                    @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                  <el-button
                    size="mini"
                    @click="handleAdd(scope.$index, scope.row)">添加</el-button>
                  <el-button
                    size="mini"
                    @click="handleGetRoleList(scope.$index, scope.row)">查看班级人员</el-button>
                </template>
              </el-table-column>
            </el-table>-->
           <!-- <el-row>
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
            </el-row>-->
            <el-dialog
              :title="alertFlag ? '中心管理信息':'修改中心管理信息'"
              :show-close="modalClickOther" :visible.sync="dialogVisible" :closeOnClickModal="modalClickOther"
            >
              <el-row>
                <el-col :span="24">
                  <el-form :model="ruleForm" status-icon  ref="alterForm" label-width="80px" class="demo-ruleForm">
                    <el-col :span="12">
                      <el-form-item label="年级:" prop="CenterID">
                        <el-select v-model="gradeData" placeholder="请选择年级" @change="chooseGrade">
                          <el-option
                            v-for="(item,index) in chooseGradeOption"
                            :key="index"
                            :label="item.name"
                            :value="item">
                          </el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="班级名称:" prop="ClassName">
                        <el-input type="text" v-model="ruleForm.ClassName" placeholder="请输入班级名"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="班主任:" prop="ClassMaster">
                        <el-input clearable type="text" v-model="ruleForm.ClassMaster" placeholder="请输入班主任名"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="状态:" prop="Status">
                        <el-switch v-model="Status" active-text="开启" inactive-text="关闭" @change="switchChange"></el-switch>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item class="class" label="选择课程:" >
                        <el-select v-model="classDate" multiple placeholder="选择课程" @change="chooseClass">
                          <el-option
                            v-for="(item,index) in classOptions"
                            :key="index"
                            :label="item.ProgramName"
                            :value="item.ProgramCode">
                          </el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                  </el-form>
                </el-col>
              </el-row>
              <span slot="footer" class="dialog-footer">
                <el-button @click="clearDialog">取 消</el-button>
                <el-button type="primary" @click="MakeSureHandle(alertFlag)">确 定</el-button>
              </span>
            </el-dialog>
            <el-dialog title="添加班级用户" :show-close="modalClickOther"
                       :visible.sync="dialogTwoVisible" :closeOnClickModal="modalClickOther">
              <el-row>
                <el-col :span="20">
                  <el-form :model="addForm" status-icon  ref="alterFormTwo" label-width="80px" class="demo-ruleForm">
                    <el-form-item>
                      <el-radio-group v-model="addForm.UserType">
                        <el-radio label="A">班主任</el-radio>
                        <el-radio label="T">教师</el-radio>
                        <el-radio label="S">学生</el-radio>
                      </el-radio-group>
                    </el-form-item>
                    <el-form-item label="ClassID:" prop="ClassID">
                      <el-input type="text" v-model="addForm.ClassID" placeholder="请输入ClassID"></el-input>
                    </el-form-item>
                    <el-form-item label="状态:" prop="bStatus">
                      <el-switch v-model="bStatus" active-text="开启" inactive-text="关闭" @change="switchChangeStatus"></el-switch>
                    </el-form-item>
                  </el-form>
                </el-col>
              </el-row>
              <span slot="footer" class="dialog-footer">
                <el-button @click="clearDialog">取 消</el-button>
                <el-button type="primary" @click="MakeSureHandleTwo(alertFlag)">确 定</el-button>
              </span>
            </el-dialog>
            <el-dialog title="班级列表" :show-close="modalClickOther" height="450" :header-row-style="headerStyle" :highlight-current-row="true" :cell-style="cellStyle"
                       :visible.sync="dialogThreeVisible" :closeOnClickModal="modalClickOther" center>
              <el-row>
                <el-col :span="24">
                  <el-form :model="ListForm" status-icon  ref="alterFormThree" label-width="80px" class="demo-ruleForm">
                    <el-table  ref="multipleTable" :data="gridData"
                               @selection-change="handleSelectionChange3"
                    @row-click="ClassRowClick">
                      <el-table-column property="SchoolID" label="学校ID"></el-table-column>
                      <el-table-column property="ClassName" label="名称"></el-table-column>
                      <el-table-column property="ClassGrade" label="年级"></el-table-column>
                      <el-table-column property="ClassMaster" label="班主任"></el-table-column>
                      <el-table-column property="ClassProgram" label="课程"></el-table-column>
                      <el-table-column property="Status" label="状态"></el-table-column>
                    </el-table>
                  </el-form>
                </el-col>
              </el-row>
              <span slot="footer" class="dialog-footer">
                <el-button @click="clearDialog">关闭</el-button>
              </span>
            </el-dialog>
          </section>
          <section class="section_table" v-if="sectionTable2Vis">
            <el-radio-group v-model="getListForm.UserType" @change="choosedRole">
              <el-radio label="A" border>班主任</el-radio>
              <el-radio label="T" border>教师</el-radio>
              <el-radio label="S" border>学生</el-radio>
            </el-radio-group>
            <el-table ref="multipleTable" :data="roleListData" border height="450" :header-row-style="headerStyle" :highlight-current-row="true" :cell-style="cellStyle"
                      @selection-change="handleSelectionChange2">
              <el-table-column type="selection" width="50"></el-table-column>
              <el-table-column type="index" width="50"></el-table-column>
              <el-table-column prop="ActualName" label="ActualName"></el-table-column>
              <el-table-column prop="ClassID" label="ClassID"></el-table-column>
              <el-table-column prop="NickName" label="NickName"></el-table-column>
              <el-table-column prop="UserCode" label="UserCode"></el-table-column>
              <el-table-column prop="UserID" label="UserID"></el-table-column>
              <el-table-column prop="UserName" label="UserName"></el-table-column>
            </el-table>
          </section>
        </el-col>
      </el-row>


    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  import headTop from '../../components/headTop'
  import {getStore,setStore} from '../../config/publicMethod'
  import {getAllCenter ,getCenterSchool,getSchoolClasses,addCenterSchoolClass,getCenterProgram,addCenterClassUser,getCenterClassUser} from '../../api/manage'
  import {getAreaList} from '../../api/common'

  import adminDate_Test from '../../data/admin.json'
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
        roleListData:[],
        gridData:[],
        multipleSelection: [],
        dialogVisible:false,dialogTwoVisible:false,dialogThreeVisible:false,
        sectionTable2Vis:false,
        modalClickOther:false,
        alertFlag:false,
        provinceDate:[],cityDate:[],areaDate:[],CenterOfSchoolData:[],
        provinceOptions:[],cityOptions:[],areaOptions:[],centerOfSchoolOptions:adminDate_Test,
        DistinctName:'',
        chooseCenterOption:[],chooseSchoolOption:[],
        chooseCenterListData:[],chooseSchoolListData:[],
        gradeData:[],chooseGradeOption:adminDate_Test[0].msg,
        classAdd:'',classDate:[],classOptions:[],
        classInfo:{
          Zhongkao:'',Faxianshishuxue:'',Qingkecheng:''
        },
        className:'',
        Name:'',
        Status:false,bStatus:false,
        ruleForm: {
          SchoolID:'', ClassName:'', ClassGrade:'',
          ClassProgram:'', ClassMaster:'', Status:''
        },
        addForm:{
          ClassID:'',UserType:'',Status:''
        },
        ListForm:{

        },
        show_len:1,
        getListForm:{
          UserType:'',ClassID:''
        },
        chooseCenterListData:[],chooseSchoolListData:[],
        //验证form表单：
        /*rules: {
         SchoolName: [
         { required: true, message: '请输入SchoolName', trigger: 'blur' },
         ],
         DistinctName: [
         { required: true, message: '请输入DistinctName', trigger: 'blur' },
         ],
         Address: [
         {required: true,  message: '请输入address', trigger: 'blur' }
         ],/!*
         Name: [
         {required: true,  message: '请输入管理员Name', trigger: 'blur' }
         ],*!/
         }*/
      }
    },
    components:{
      headTop
    },
    computed: {
      dialogTitle(){
        return this.alertFlag ? '':'';
      }
    },
    mounted(){
      //进入首页的时候查询
      this.getAllUserList();
      this.getClass();
    },
    methods:{
      ClassRowClick(index,row){
        console.log(index)
        this.dialogThreeVisible = false;
        this.getListForm.ClassID=index.ClassID;
        this.sectionTable2Vis=true;
      },
      async getClass(){
        var inputJson = {
          CenterID:getStore('CenterID')
        }
        let result = await getCenterProgram(inputJson);
        this.classOptions = result.data
      },
      async getAllUserList(){
        let result = await getAllCenter();
        this.allData = result.data;
        this.chooseCenterOption = result.data;

        console.log( result.data )
       // this.currentData = this.allData.slice(0,this.pageSize);
        //console.log("所有的中心列表",result,this.allData)
      },
      handleEdit(index, row) {
        console.log(index, row);
        this.dialogVisible = true;
        this.alertFlag = false;
        this.ruleForm ={
          SchoolID: row.SchoolID,
          ClassName: row.ClassName,
          ClassGrade: row.ClassGrade,
          ClassProgram: row.ClassProgram,
          ClassMaster: row.ClassMaster,
          Status: row.Status ,
        };
      },
      async handleDelete(index, row) {
       /* let result = await deleteCenter({CenterID:row.CenterID});
        if(result.code == 200){
          this.$message({message: '删除成功！',type:'success'});
        }*/
      },
      async handleAdd(index, row){
        this.dialogTwoVisible = true;
        this.addForm.ClassID = row.ClassID;
        console.log(index, row)
      },
      handleGetRoleList(index,row){
        console.log( index )
        this.getListForm.ClassID=index.ClassID;
        this.sectionTable2Vis=true;
      },
      choosedRole(){
        this.getRoleList()
      },
      async getRoleList(){
        let parme = this.getListForm;
        let result = await getCenterClassUser( parme );
        if( result.code == 200 ){
          console.log('success')
        }
        this.roleListData = result.data;
        this.currentData = this.roleListData.slice(0,this.pageSize);
      },
      /*add by cui*/
      addClass(){
        this.dialogVisible = true;
        this.alertFlag = true;
      },
      async chooseCenterList(row){//选择了中心，选学校
        this.chooseCenterListData = row.CenterID;
        setStore('CenterID',row.CenterID);

        let inputs={ CenterID:row.CenterID }
        let result = await getCenterSchool( inputs );
        if( result.code == 200 ){
          console.log('success')// this.$message({message:'查询成功',type:'success'})
        }
        this.chooseSchoolOption=result.data;
      },
      async chooseSchoolList(row){//学校选完了，选班级
        this.chooseSchoolListData = row.SchoolName;
        this.ruleForm.SchoolID = row.SchoolID;
        let params={ SchoolID:row.SchoolID }
        setStore('schoolID',row.SchoolID)
        let result = await getSchoolClasses(params);
        if(result.code == 200){
          console.log( result.data )//this.$message({message: '查询成功！',type:'success'});
        }
        this.gridData = result.data;
        this.dialogThreeVisible = true;
        //this.currentData = this.allData.slice(0,this.pageSize);
      },
      async chooseGrade(row){//选择学校所属中心
        this.gradeData=row.name;
        this.ruleForm.ClassGrade = row.name;
      },
      async chooseClass(row){//选择课程
        this.ruleForm.ClassProgram = row
      },
      async switchChange(){//切换状态
        this.ruleForm.Status = Number(this.Status);
      },
      async switchChangeStatus(){//切换状态
        this.addForm.Status = Number( this.bStatus );
      },
      visibleChangeCenter(){
        this.chooseSchoolListData=null;
      },
      PageChange(page){
        console.log("PageChange",page)
        let num = this.pageSize;
        this.currentData = this.allData.slice( (page-1)*num,(page-1)*num+num)
      },
      MakeSureHandle(flag){
        if( getStore('schoolID') ){
          this.ruleForm.SchoolID = getStore('schoolID')
        }else{
          alert('请先选择对应学校');
          return false;
        }
        this.$refs.alterForm.validate( async(valid) => {
          if (valid) {
            let params = this.ruleForm;
            if(flag){//添加用户
              let result = await addCenterSchoolClass(params);
              if(result.code == 200){
                this.$message({message: '添加成功！',type:'success'});
              }
            }else {//修改用户
              /* let result = await updateCenter(params);
               if(result.code == 200){
               this.$message({message: '修改成功！',type:'success'});
               }*/
            }

            this.clearDialog()
            this.getAllUserList();
          } else {
            console.error('error register submit!!');
            return false;
          }
        });
      },
      MakeSureHandleTwo(flag){
        this.$refs.alterFormTwo.validate( async(valid) => {
          if (valid) {
            this.addForm.UserID = getStore('UserID');
            let params = this.addForm;
            let result = await addCenterClassUser(params);
            if(result.code == 200){
              this.$message({message: '添加成功！',type:'success'});
            }
            this.clearDialog()
            this.getAllUserList();
          } else {
            console.error('error register submit!!');
            return false;
          }
        });
      },
      MakeSureHandleThree(){
        this.$refs.alterFormThree.validate( async(valid) => {
          if (valid) {

          } else {

          }
        });
      },
      clearDialog(){
        this.classDate=null, this.gradeData=null,this.dialogVisible = false,
        this.ruleForm={
            SchoolID:'', ClassName:'', ClassGrade:'',
            ClassProgram:'', ClassMaster:'', Status:''
        },
        this.dialogTwoVisible = false;
        this.dialogThreeVisible = false;
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
      handleSelectionChange2(val){
        this.multipleSelection = val;
      },
      handleSelectionChange3(val){
        this.multipleSelection = val;
      }
    }
  }
</script>
<style lang="less" type="text/less">
  .centerManage_section {
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
    border: 1px solid gainsboro;
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
  .AddInput{
    display: none;
    padding:8px 0;
  }
  .AddInput:first-child{
    display:inline-table;
  }
</style>
