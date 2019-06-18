<template>
  <div>
    <head-top></head-top>
    <div class="centerManage_section" :xs="4" :sm="6" :md="8" :lg="15" :xl="15">
      <header>
        <el-row>
          <el-col :span="12" class="grid-content titleSetion"><h2>学校用户管理</h2></el-col>
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
                :value="item" :disabled="item.disabled">
              </el-option>
            </el-select>
            <el-tooltip class="item" v-if="choosedSchool" effect="light" content="只能添加老师/学生" placement="right">
              <el-button type="primary" @click="AddSchoolUser">添加学校散户</el-button>
            </el-tooltip>
        </el-col>
        <el-col :span="6" v-if="choosedSchool">
          <uploadFile :msg="msg"></uploadFile></el-col>
        <el-col :span="6">
          选择要查询的散户类型：
          <el-radio-group v-model="Role" @change="choosedRole">
            <!--<el-radio label="A" border>班主任</el-radio>-->
            <el-radio label="T" border>教师</el-radio>
            <el-radio label="S" border>学生</el-radio>
          </el-radio-group>
        </el-col>
      </el-row>
      <section class="section_table">
        <el-table
          ref="multipleTable" :data="currentData" border height="450" :header-row-style="headerStyle" :highlight-current-row="true" :cell-style="cellStyle" style="width: 100%"
          @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="50"></el-table-column>
          <el-table-column type="index" width="50"></el-table-column>
          <el-table-column prop="SchoolID" label="SchoolID"></el-table-column>
          <el-table-column prop="UserID" label="UserID"></el-table-column>
          <el-table-column prop="UserType" label="UserType"></el-table-column>
          <el-table-column prop="UserCode" label="UserCode"></el-table-column>
          <el-table-column prop="UserName" label="UserName"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                size="mini"
                @click="handleEdit(scope.$index, scope.row)">指派</el-button>
      <!--        <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)">删除</el-button>-->
             <!-- <el-button
                size="mini"
                type="primary"
                @click="handleAdd(scope.$index, scope.row)">添加</el-button>-->
            </template>
          </el-table-column>
        </el-table>
        <el-row>
          <el-col :span="12">
            <div style="text-align: left">
              <el-button @click="deleteSelection()">批量指派</el-button>
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
          :title="alertFlag ? '中心管理信息':'修改中心管理信息'"
          :show-close="modalClickOther"
          :visible.sync="dialogVisible"
          :closeOnClickModal="modalClickOther"
        >
          <el-row>
            <el-col :span="24">
              <el-form :model="ruleForm" status-icon  ref="alterForm" label-width="80px" class="demo-ruleForm">
                  <el-form-item label="选班级">
                    <el-select v-model="chooseClassListData" placeholder="选择班级" @change="chooseClass">
                      <el-option
                        v-for="(item,index) in this.classesList"
                        :key="index"
                        :label="item.ClassName"
                        :value="item">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="状态:" prop="Status">
                    <el-switch v-model="Status" active-text="开启" inactive-text="关闭" @change="switchChange"></el-switch>
                  </el-form-item>
              </el-form>
            </el-col>
          </el-row>
          <span slot="footer" class="dialog-footer">
            <el-button @click="clearDialog">取 消</el-button>
            <el-button type="primary" @click="MakeSureHandle(alertFlag)">确 定</el-button>
          </span>
        </el-dialog>
     <!--   <el-dialog title="添加学校散户" :show-close="modalClickOther"
          :visible.sync="dialogTwoVisible" :closeOnClickModal="modalClickOther">
            <el-row>
              <el-col :span="20">
                <el-form :model="addForm" status-icon  ref="alterFormTwo" label-width="80px" class="demo-ruleForm">
                  <el-form-item>
                    <el-radio-group v-model="addForm.UserType">
                      <el-radio label="T">教师</el-radio>
                      <el-radio label="S">学生</el-radio>
                    </el-radio-group>
                  </el-form-item>
                 &lt;!&ndash; <el-form-item label="ClassID:" prop="ClassID">
                    <el-input type="text" v-model="addForm.ClassID" placeholder="请输入ClassID"></el-input>
                  </el-form-item>&ndash;&gt;
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
        </el-dialog>-->
        <el-dialog title="添加学校管理员" :show-close="modalClickOther" height="600"
                   :visible.sync="dialogTwoVisible" :closeOnClickModal="modalClickOther">
          <el-row>
            <el-col :span="24">
              <div style="min-height:400px">
                <registerRole :msg1="msg1"></registerRole>
              </div>
              <!--<el-form :model="addForm" status-icon  ref="alterFormTwo" label-width="80px" class="demo-ruleForm">
                <el-form-item>
                  <el-radio-group v-model="addForm.UserType">
                    <el-radio label="A">班主任</el-radio>
                    <el-radio label="T">教师</el-radio>
                    <el-radio label="S">学生</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="状态:" prop="bStatus">
                  <el-switch v-model="bStatus" active-text="开启" inactive-text="关闭" @change="switchChangeStatus"></el-switch>
                </el-form-item>
              </el-form>-->
            </el-col>
          </el-row>
            <span slot="footer" class="dialog-footer">
              <el-button @click="clearDialog">关闭窗口</el-button>
            </span>
        </el-dialog>
      </section>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  import headTop from '../../components/headTop'
  import registerRole from '../../components/registerCom'
  import uploadFile from '../../components/centermanage'
  import { getStore,setStore } from '../../config/publicMethod'
  import { getDataFromServer } from '../../api/manage'
  import {getAreaList} from '../../api/common'

  export default{
    data(){
      return{
        msg:null,msg1:'SandT',
        value: [],
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
        dialogVisible:false,dialogTwoVisible:false,
        modalClickOther:false,
        alertFlag:false,
        provinceDate:[],cityDate:[],areaDate:[],CenterOfSchoolData:[],
        provinceOptions:[],cityOptions:[],areaOptions:[],
        DistinctName:'',
        chooseCenterOption:[],chooseSchoolOption:[],
        gradeData:[],
        classAdd:'',classDate:[],classOptions:[],
        classInfo:{
          Zhongkao:'',Faxianshishuxue:'',Qingkecheng:''
        },
        className:'',
        Name:'',
        Status:false,bStatus:false,
        ruleForm: {
          ClassID:'', UserType:'', Status:''
        },
        addForm:{
         UserType:'',Status:''
        },
        mulForm:{
          ClassID:'',UserIDList:'',UserType:'',Status:''
        },
        show_len:1,Role:'',
        chooseCenterListData:[],chooseSchoolListData:[],chooseClassListData:[],
        classesList:[],classesListData:[],schoolID:'',thisRole:'',
        userId_arr:[],choosedSchool:false,
        //验证form表单：
      }
    },
    components:{
      headTop,
      uploadFile,
      registerRole
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
      async getClass(){
        var inputJson = { CenterID:getStore('CenterID') }
        let result = await getDataFromServer(inputJson,'getCenterProgram')
        this.classOptions = result.data
      },
      async getAllUserList(){
        if( getStore('permissionLevel')>1 ){
          var inp = { CenterID:getStore('CenterID') };
        }else{
          var inp = { };
        }
        let result = await getDataFromServer(inp,'getAllCenter')
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
        setStore('UserID',row.UserID)
      },
      async handleDelete(index, row) {},
      async handleAdd(index, row){
        this.dialogTwoVisible = true;
        this.addForm.ClassID = row.ClassID;
        console.log(index, row)
        setStore('UserID',row.UserID)
      },
      async AddSchoolUser(){
        this.dialogTwoVisible = true;
      },
      /*add by cui*/
      async chooseCenterList(row){//选择了中心，选学校
        this.choosedSchool = false;
        this.chooseCenterListData = row.CenterID;
        setStore('CenterID',row.CenterID);

        let inputs={ CenterID:row.CenterID };
        let result = await getDataFromServer(inputs,'getAllSchoolList')
        if( result.code == 200 ){
          console.log('success')// this.$message({message:'查询成功',type:'success'})
        }
        result.data.map( (item,index)=>{
          if( result.data[index].UserID==null ){
            result.data[index].disabled=true;
          }
        })
        this.chooseSchoolOption=result.data;
      },
      async chooseSchoolList(row){//学校选完了，选班级
        this.choosedSchool = true;
        this.msg={
          "username":'School'+row.CenterID+ row.SchoolName,
          "SchoolID": row.SchoolID,
        }
        this.addForm.SchoolID = row.SchoolID;
        this.addForm.UserID = row.UserID;
        if( row.UserID==null ){
          this.$message({message: '该学校还没有注册管理员！',type:'warning'});
        }
        this.chooseSchoolListData = row.SchoolName;
        this.schoolID = row.SchoolID;
        setStore('SchoolID',row.SchoolID)
        let inputs={SchoolID:row.SchoolID}
        let result = await getDataFromServer(inputs,'getSchoolClasses');
        if(result.code ==200){
          if( result.data.length<1 ){
            this.$message({message: '当前学校没有班级，不要忘记在学校中添加班级哦~',type:'warning'});
          }
          console.log(result.data);
          this.classesList=result.data;
        }
      },
      async chooseClass(row){
        this.chooseClassListData = row.ClassName;
        this.ruleForm.ClassID = row.ClassID;
        this.mulForm.ClassID = row.ClassID;
      },
      choosedRole(){
        this.ruleForm.UserType = this.Role;
        this.thisRole = this.Role;
        this.getList();
      },
      async getList(){
        let params={
          SchoolID:this.schoolID,//getStore('schoolID'),
          UserType:this.Role,
          From:"ClassSelectUser"
        }
        let result = await getDataFromServer(params,'getCenterSchoolUser')
        if(result.code == 200){
          console.log('+++', result.data )
        }
        this.allData = result.data;
        this.currentData = this.allData.slice(0,this.pageSize)
      },
      async chooseGrade(row){//选择年级
        this.gradeData=row.name;
      },
      async switchChange(){//切换状态
        this.ruleForm.Status = Number(this.Status);
        this.mulForm.Status = Number(this.Status);
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
        this.$refs.alterForm.validate( async(valid) => {
          if (valid) {
            if( flag ){//批量指派
              let params = this.mulForm;
              let result = await getDataFromServer(params,'addCenterClassUserList')
              if(result.code == 200){
                console.log( result.data )
                this.$message({message: '批量指派成功！',type:'success'});
              }
            }else{
              this.ruleForm.UserID = getStore('UserID');
               let params = this.ruleForm;
              let result = await getDataFromServer(params,'addCenterClassUser')
               if(result.code == 200){
                this.$message({message: '指派成功！',type:'success'});
               }
            }
           this.clearDialog()
       /* this.getAllUserList();*/
          } else {
            console.error('error register submit!!');
            return false;
          }
        });
      },
      MakeSureHandleTwo(flag){
        this.$refs.alterFormTwo.validate( async(valid) => {
          if (valid) {
            let params = this.addForm;
            let result = await getDataFromServer(params,'addCenterSchoolUser')
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
      async addSchool(){
        this.dialogVisible = true;
        this.alertFlag = true;
        this.ruleForm ={
          SchoolID: '', ClassName: '', ClassGrade: '',
          ClassProgram: '',ClassMaster:'', Status:''
        }
        this.provinceDate=null;
      },
      clearDialog(){
        this.classDate=null, this.gradeData=null,this.dialogVisible = false,
        this.ruleForm={
            SchoolID:'', ClassName:'', ClassGrade:'',
            ClassProgram:'', ClassMaster:'', Status:''
        },
        this.dialogTwoVisible = false
      },
      deleteSelection() {
        console.log("选择的行：：---》》》",this.$refs.multipleTable.selection);
        let selectData = this.$refs.multipleTable.selection;
        if( selectData.length<1 ){
          alert('请先选择要指派的行')
          return false;
        }
        this.dialogVisible = true;
        selectData.map( (item,index)=>{
          this.userId_arr.push( item.UserID )
        })
        this.alertFlag = true;
        this.mulForm={
          UserType:this.thisRole,
          UserIDList:this.userId_arr,
        }
        console.log( this.userId_arr )
       /* this.allData = this.allData.sclice();
        this.chooseCenterOption = result.data;

        console.log( result.data )*/
        // this.currentData = this.allData.slice(0,this.pageSize);
      },
      cancelSelection(rows) {
        this.$refs.multipleTable.clearSelection();
      },
      handleSelectionChange(val) {
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
