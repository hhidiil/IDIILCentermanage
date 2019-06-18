<template>
  <div>
    <head-top></head-top>
    <div class="centerManage_section" :xs="4" :sm="6" :md="8" :lg="15" :xl="15">
      <header>
        <el-row>
          <el-col :span="12" class="grid-content titleSetion"><h2>各中心的学校列表</h2></el-col>
          <el-col :span="12" class="grid-content titleSetion" style="text-align: right">  选择中心 - 选择学校 - 选择班级 - 选择班级角色 </el-col>
        </el-row>
      </header>
      <!--选择中心-->
      <el-row>
        <el-col :span="24">
          <el-select v-model="chooseCenterListData" placeholder="选择中心" @change="chooseCenterList">
            <el-option
              v-for="(item,index) in chooseCenterOption"
              :key="index"
              :label="item.CenterID"
              :value="item">
            </el-option>
          </el-select>
          <el-button type="primary" @click="addSchool">添加学校</el-button>
        </el-col>
      </el-row>
     <!-- <el-tree :props="defaultProps"
       :load="loadNode" lazy @check-change="handleCheckChange"></el-tree>

      </el-tree>-->
      <section class="section_table">
        <el-table
          ref="multipleTable" :data="currentData" border
          height="450" :header-row-style="headerStyle" :highlight-current-row="true" :cell-style="cellStyle" style="width: 100%"
          @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="50"></el-table-column>
          <el-table-column prop="SchoolName" label="SchoolName"></el-table-column>
          <el-table-column prop="SchoolID" label="SchoolID"></el-table-column>
          <el-table-column prop="SchoolCode" label="SchoolCode"></el-table-column>
          <el-table-column prop="SchoolProgram" label="课程"></el-table-column>
          <el-table-column prop="DistinctName" label="区域"></el-table-column>
          <el-table-column prop="Address" label="地址"></el-table-column>
          <el-table-column prop="Name" label="联系人"></el-table-column>
          <el-table-column prop="ContactInfo" label="联系方式"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
            <el-button
                size="mini"
                @click="handleEdit(scope.$index, scope.row)">修改</el-button>
              <!--  <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)">删除</el-button>-->
              <el-button
                size="mini"
                @click="handleAdd(scope.$index, scope.row)" >添加校长</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-row>
          <el-col :span="12">
         <!--   <div style="text-align: left">
              <el-button @click="deleteSelection()">删除选中的项</el-button>
              <el-button @click="cancelSelection()">取消选择</el-button>
            </div>-->
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
          :title="alertFlag ? '添加学校':'修改学校信息'"
          :show-close="modalClickOther"
          :visible.sync="dialogVisible"
          :closeOnClickModal="modalClickOther"
        >
          <el-row>
            <el-col :span="24">
              <el-form :model="ruleForm" status-icon  ref="alterForm" label-width="80px" class="demo-ruleForm">
                <el-col :span="24">
                  <el-col :span="12">
                    <el-form-item label="学校名称:" prop="SchoolName">
                      <el-input type="text" v-model="ruleForm.SchoolName"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="状态:" prop="Status">
                      <!--<el-input type="text" v-model="ruleForm.Status" ></el-input>-->
                      <el-switch v-model="Status" active-text="开启" inactive-text="关闭" @change="switchChange"></el-switch>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="所属中心:" prop="CenterID">
                      <el-select v-model="CenterOfSchoolData" placeholder="请选择学校所属中心" @change="chooseCenterOfSchool">
                        <el-option
                          v-for="(item,index) in chooseCenterOption"
                          :key="index"
                          :label="item.CenterID"
                          :value="item">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12" v-if="chooseA">
                    <el-form-item label="管理员:" prop="CenterID">
                      <el-select v-model="adminData" placeholder="请选择管理员" @change="chooseAdmin">
                        <el-option
                          v-for="(item,index) in adminOption"
                          :key="index"
                          :label="item.UserName"
                          :value="item">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="联系人:" prop="Name"><el-input clearable type="text" v-model="ruleForm.Name"></el-input></el-form-item>
                  </el-col>
                  <el-col :span="24">
                    <el-form-item class="area" label="区域:" prop="DistinctName">
                      <template style="display: flex;margin-left: 0;">
                        <el-select v-model="provinceDate" placeholder="请选择省" @change="selectProvince" @visible-change="visibleChangeProvince">
                          <el-option
                            v-for="(item,index) in provinceOptions"
                            :key="index"
                            :label="item.Name"
                            :value="item.ID">
                          </el-option>
                        </el-select>
                        <el-select v-model="cityDate" placeholder="请选择市" @change="selectCity" @visible-change="visibleChangeCity">
                          <el-option
                            v-for="item in cityOptions"
                            :key="item.MergerName"
                            :label="item.Name"
                            :value="item.ID">
                          </el-option>
                        </el-select>
                        <el-select v-model="areaDate" value-key="ID" placeholder="请选择市" @change="selectArea" >
                          <el-option v-for="item in areaOptions"
                                     :key="item.Name" :label="item.Name"
                                     :value="item">
                          </el-option>
                        </el-select>

                      </template>
                    </el-form-item>
                    <el-form-item label="地址:" prop="Address">
                      <el-input type="text" v-model="ruleForm.Address"></el-input>
                    </el-form-item>
                  </el-col>
                </el-col>
                <el-col class="questionStyle" :span="24">
                  <el-form-item label="联系方式:" prop="contactInfo">
                    <el-form-item label="Tel:" prop="Tel"><el-input clearable size="small" type="text" v-model="contactInfo.Tel"></el-input></el-form-item>
                    <el-form-item label="WeChat:" prop="WeChat"><el-input clearable size="small" type="text" v-model="contactInfo.WeChat"></el-input></el-form-item>
                    <el-form-item label="QQ:" prop="QQ"><el-input clearable size="small" type="text" v-model="contactInfo.QQ"></el-input></el-form-item>
                  </el-form-item>
                </el-col>
                <el-col class="questionStyle" :span="24">
                  <el-form-item class="area" label="选择课程:" >
                    <el-select v-model="classDate" multiple placeholder="请选择课程" @change="chooseClass"  size="100%">
                      <el-option size="100%"
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
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="MakeSureHandle(alertFlag)">确 定</el-button>
          </span>
        </el-dialog>
        <el-dialog title="" :show-close="modalClickOther" height="600"
                   :visible.sync="dialogTwoVisible" :closeOnClickModal="modalClickOther">
          <el-row>
            <el-col :span="24">
              <div style="min-height:400px">
                <registerRole :msg="msg"></registerRole>
              </div>
            </el-col>
          </el-row>
            <span slot="footer" class="dialog-footer">
              <el-button @click="clearDialog(true)">关闭窗口</el-button>
            </span>
        </el-dialog>
      </section>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  import headTop from '../../components/headTop'
  import registerRole from '../../components/registerCom'
  //import { ,,  ,addCenterSchoolUser ,,getCenterProgram } from '../../api/manage'
  import {getDataFromServer} from '../../api/manage'
  import {getAreaList} from '../../api/common'
  import {setStore,getStore,clearStore,setSession,getSession} from '../../config/publicMethod'

  export default{
    data(){
      return{
        msg:'RoleA',
        defaultProps: {
          children: 'zones',
          label: 'CenterID'
        },
        count:1,
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
        chooseA:false,
        provinceDate:[],cityDate:[],areaDate:[],CenterOfSchoolData:[],adminData:[],
        provinceOptions:[],cityOptions:[],areaOptions:[],
        DistinctName:'',
        chooseCenterOption:[],chooseCenterListData:[],adminOption:[],
        classAdd:'',classDate:[],schoolDate:[],classOptions:[],schoolListOption:[],
        contactInfo:{
          Tel:'',WeChat:'',QQ:''
        },
        classInfo:{
          Zhongkao:'',Faxianshishuxue:'',Qingkecheng:''
        },
        Name:'',
        Status:false,bStatus:false,addShow:false,
        ruleForm: {
          SchoolName:'',
          DistinctName:'',
          Name:'',
          Address:'',
          Status:'',
          CenterProgram:''
        },
        addForm:{
          SchoolID:'',CenterID:''
        },
        show_len:1,
        hasChildrenCenter_arr:[],
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
         ContactInfo: [
         {required: true,  message: '请输入ContactInfo', trigger: 'blur'}
         ]
         }*/
      }
    },
    components:{
      headTop,registerRole
    },
    computed: {
      dialogTitle(){
        return this.alertFlag ? '':'';
      }
    },
    mounted(){
      //进入首页的时候查询
      this.getAllUserList();
      this.getAllProvince();

    },
    methods:{
      async getClass(center){
        var inputJson = {
          CenterID:center
        }
        let result = await getDataFromServer(inputJson,'getCenterProgram')
        this.classOptions = result.data
      },
      handleCheckChange( data,checked,indeterminate ){
        console.log(data,checked,indeterminate)
      },
      handleNodeClick(data) {
        console.log(data);
      },
      loadNode(node, resolve) {
        if (node.level === 0) {
          return resolve([{ name: 'region1' }, { name: 'region2' }]);
        }
        if (node.level > 3) return resolve([]);

        var hasChild;
        if (node.data.name === 'region1') {
          hasChild = true;
        } else if (node.data.name === 'region2') {
          hasChild = false;
        } else {
          hasChild = Math.random() > 0.5;
        }
        setTimeout(() => {
          var data;
          if (hasChild) {
            data = [{
              CenterID: 'zone' + this.count++
            }, {
              CenterID: 'zone' + this.count++
            }];
          } else {
            data = [];
          }

          resolve(data);
        }, 500);
      },
      async handleNodeClicks( data ){
        alert(data)
      },
      async getAllUserList(){
        if( getStore('permissionLevel')>1 ){
          var inp = { CenterID:getStore('CenterID') };
         // let result = await getDataFromServer(inp,"getAllCenter");
        }else{
          var inp = { };
        }
        let result = await getDataFromServer(inp,'getAllCenter')
        this.chooseCenterOption = result.data;
     },
      handleEdit(index, row) {
        console.log(index, row);
        this.dialogVisible = true;
        this.alertFlag = false;
        this.ruleForm ={
          SchoolName: row.SchoolName,
          DistinctName: row.DistinctName,
          Name: row.Name,
          Address: row.Address,
          Status: row.Status ,
        };
        this.ruleForm.SchoolID = row.SchoolID;
        this.adminList(  row.SchoolID )
        this.chooseA = true;

      },
      async handleDelete(index, row) {
        console.log(index, row);
       alert('删除还没做')
      },
      async handleAdd(index,row){
//        if( row.UserID != null && row.UserName!=null ){
//          this.$message({message: '你已经注册了校长，请勿重复注册！', type: 'warning'});
//          return false;
//        }
        this.dialogTwoVisible = true;
        this.addForm.SchoolID = row.SchoolID;
        this.addForm.CenterID = row.CenterID;
        setStore('addForm',this.addForm)
      },
      async chooseCenterList(row){
        console.log(row)
        this.chooseCenterListData = row.CenterID;
        this.addShow=true;
        //this.addForm.SchoolID = '002';
        this.addForm.CenterID = row.CenterID;
        this.getSchoolInChoosedCenter( this.chooseCenterListData );
      },
      async getSchoolInChoosedCenter(center){
        let inputs={
          CenterID:center
        }
        let result = await getDataFromServer(inputs,'getAllSchoolList');
        if( result.code == 200 ){
          //this.$message({message:'查询成功',type:'success'})
        }
        setStore('CenterID',center)
        console.log( result.data );
        this.allData = result.data;
        this.currentData = this.allData.slice(0,this.pageSize);
        this.schoolListOption = result.data;
      },
      async chooseCenterOfSchool(row){//选择学校所属中心
        this.CenterOfSchoolData=row.CenterID;
        this.ruleForm.CenterID = row.CenterID;
        this.getClass(row.CenterID)

      },
      async adminList(schoolid){
        var inputJson = {SchoolID:schoolid}
        let result = await getDataFromServer(inputJson,'getCenterSchoolFreeManager');
        if(result.code==200){
          console.log(result.data)
          this.adminOption = result.data;
        }
      },
      async chooseAdmin(row){//选择管理员
        this.adminData = row.UserName;

        this.ruleForm.SchoolManager = row.UserId;
      },
      async chooseClass(row){//选择课程
        console.log(row)
        this.ruleForm.SchoolProgram = row
      },
      async chooseSchool(row){
        this.schoolDate = row.Name;
        this.addForm.SchoolID = row.SchoolID;
      },
      async switchChange(){//切换状态
        this.ruleForm.Status = Number(this.Status);
        console.log( this.Status )
      },
      async switchChangeStatus(){//切换状态
        //this.addForm.Status = Number( this.bStatus );
      },
      async selectProvince(val){//选择了省份
        this.cityOptions=[];
        let result = await getAreaList();
        result.data.map( (item,index)=>{
          if( item.ParentId == val ){//省
            this.cityOptions.push( item )
          }
        })
      },
      visibleChangeProvince(){
        this.cityDate=null;
        this.areaDate=null;
      },
      visibleChangeCity(){
        this.areaDate=null;
      },
      async selectCity(val){
        this.areaOptions=[];
        let result = await getAreaList();
        result.data.map( (item,index)=>{
          if( item.ParentId == val ){//市
            this.areaOptions.push( item )
          }
        })
      },
      async selectArea(row){
        this.ruleForm.DistinctName = null;
        this.ruleForm.DistinctID =null;

        this.DistinctName=row.Name;
        this.ruleForm.DistinctName = row.MergerName;
        this.ruleForm.DistinctID = row.ID
      },
      async getAllProvince(){
        let result = await getAreaList();
        result.data.map( (item,index)=>{
          if( item.LevelType==1 ){//省
            this.provinceOptions.push( item )
          }
        })
      },
      PageChange(page){
        console.log("PageChange",page)
        let num = this.pageSize;
        this.currentData = this.allData.slice( (page-1)*num,(page-1)*num+num)
      },
      MakeSureHandle(flag){
        this.$refs.alterForm.validate( async(valid) => {
          if (valid) {
            let aa = JSON.stringify(this.contactInfo);
            aa = aa.replace(/":"/g,':');
            aa = aa.replace(/","/g,',');
            aa=aa.replace(/{"/g,'');
            this.ruleForm.ContactInfo =aa.replace(/"}/g,'');

            if(flag){//添加用户
              let params = this.ruleForm;
              let result = await getDataFromServer(params,'addCenterSchool');
              if(result.code == 200){
               this.$message({message: '添加school成功！',type:'success'});
              }
            }else {//修改用户
              if(this.ruleForm.SchoolProgram){
                this.ruleForm.SchoolProgram = this.ruleForm.SchoolProgram.toString()
              }
              let params = this.ruleForm;
              let result = await getDataFromServer(this.ruleForm,'updateCenterSchoolInfo');
              if(result.code == 200){
                this.$message({message: '修改成功！',type:'success'});
                console.log( result.data )
              }
            }
            this.dialogVisible = false
            this.clearDialog(false)
            this.getAllUserList();
          } else {
            console.error('error register submit!!');
            return false;
          }
        });
      },
      getMsg(msg){
        this.UserID = msg;
        window.setTimeout(function(){
          this.addForm.UserID=msg;
          let params = this.addForm;
          console.log( params )
        },100)
      },
      MakeSureHandleTwo(flag){
        this.$refs.alterFormTwo.validate( async(valid) => {
          if (valid) {
            let params = this.addForm;
            /*let result = await addCenterSchoolUser(params);
            if(result.code == 200){
              this.$message({message: '添加成功！',type:'success'});
            }
            this.clearDialog()
            this.getAllUserList();*/
          } else {
            console.error('error register submit!!');
            return false;
          }
        });
      },
      async addSchool(){
        this.chooseA = false;
        this.dialogVisible = true;
        this.alertFlag = true;
        this.ruleForm ={
          SchoolName: '',
          DistinctName: '',
          Name: '',
          Address: '',
          Status:'',DistinctID:'',ContactInfo:''
        }
        this.provinceDate=null;
      },
      clearDialog(flag){
        this.ruleForm ={
          SchoolName: '',
          DistinctName: '', Name: '',
          Address: '', Status: '',
          DistinctID:'',ContactInfo:''
        }
        this.dialogTwoVisible = false
        this.getSchoolInChoosedCenter( getStore('CenterID') );
        if( flag ){
          this.currentData=null;
        }
      },
      deleteSelection() {
        console.log("选择的行：：---》》》",this.$refs.multipleTable.selection);
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
