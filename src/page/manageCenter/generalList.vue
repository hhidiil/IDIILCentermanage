<template>
  <div>
    <head-top></head-top>

    <div class="teacherManage_section">
      <header>
        <el-row>
          <el-col :span="12" class="grid-content titleSetion"><h2>中心列表</h2></el-col>

          <el-col :span="12" class="grid-content editSetion"><el-button type="primary" @click="addGeneralCenter">添加中心</el-button></el-col>
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
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="真实姓名"><span>{{ props.row.ActualName }}</span></el-form-item>
              <el-form-item label="地址"><span>{{props.row.DistinctName}},{{props.row.Address}}</span></el-form-item>
              <el-form-item label="中心全称"><span>{{ props.row.FullName }}</span></el-form-item>
              <el-form-item label="用户名称"><span>{{ props.row.UserName }}</span></el-form-item>
              <el-form-item label="联系方式"><span>{{ props.row.ContactInfo }}</span></el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column prop="CenterID" sortable label="CenterID"></el-table-column>
        <el-table-column prop="CenterName" label="中心名称" ></el-table-column>
        <el-table-column prop="UserID" label="UserID"></el-table-column>
        <el-table-column prop="Name" label="管理员"></el-table-column>
        <el-table-column prop="ParentID" label="父级ID"></el-table-column>
        <el-table-column prop="Status" label="状态"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">指派管理</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
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
      <el-dialog title="指派/修改中心管理" :show-close="modalClickOther"
      :visible.sync="addDialogVisible" :closeOnClickModal="modalClickOther">
        <el-form label-position="right" label-width="80px"
        :inline="true" class="demo-form-inline"
        status-icon :rules="rules" :model="ruleForm"
        ref="classForm">
          <el-form-item label="中心ID:"><el-input v-model="ruleForm.CenterID"></el-input></el-form-item>
          <el-form-item label="中心名:"><el-input v-model="ruleForm.CenterName" :disabled="VisibleFlag"></el-input></el-form-item>
          <el-form-item label="管理员:"><el-input v-model="ruleForm.Name" :disabled="VisibleFlag"></el-input></el-form-item>
          <el-form-item label="UserID:"><el-input v-model="ruleForm.UserID"></el-input></el-form-item>
          <el-form-item label="ParentID:"><el-input v-model="ruleForm.ParentID" :disabled="VisibleFlag"></el-input></el-form-item>
          <el-form-item label="状态:"><el-input v-model="ruleForm.Status"></el-input></el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="MakeSureHandle(alertFlag)">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog title="添加中心" :show-close="modalClickOther"
                 :visible.sync="dialogTwoVisible" :closeOnClickModal="modalClickOther">
        <el-form :model="addForm" status-icon ref="addCenterForm" label-width="80px"
                  :rules="rules">
            <el-col :span="24">
                <el-form-item label="名称:" prop="CenterName">
                  <el-input type="text" v-model="addForm.CenterName"></el-input>
                </el-form-item>
                <el-form-item label="状态:" prop="Status">
                  <el-switch v-model="Status" active-text="开启" inactive-text="关闭" @change="switchChange"></el-switch>
                </el-form-item>
                <el-form-item label="管理员:"prop="Admin">
                  <el-select v-model="adminDate" placeholder="请选择管理员" clearable @change="chooseAdmin">
                    <el-option
                      v-for="(item,index) in adminOptions"
                      :key="index"
                      :label="item.UserName"
                      :value="item">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="父中心:" prop="ParentID">
                  <el-input type="number" min="1" max="10" v-if="this.currentIdFlag" v-model="this.ParentID" :disabled="this.currentIdFlag"></el-input>
                  <el-select v-model="centerDate" placeholder="请选择父中心" @change="chooseCenter" v-if="!this.currentIdFlag">
                    <el-option
                      v-for="(item,index) in currentData"
                      :key="index"
                      :label="item.CenterID"
                      :value="item">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="区域:" prop="DistinctName">
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
                    <el-select v-model="areaDate" value-key="ID" placeholder="请选择区" @change="selectArea" >
                      <el-option v-for="item in areaOptions"
                                 :key="item.Name" :label="item.Name"
                                 :value="item">
                      </el-option>
                    </el-select>
                  </template>
                </el-form-item>
                <el-form-item label="地址:" prop="Address">
                  <el-input type="text" v-model="addForm.Address"></el-input>
                </el-form-item>
            </el-col>
            <el-col class="questionStyle" :span="24">
              <el-form-item label="联系人:" prop="Name"><el-input clearable type="text" v-model="addForm.Name"></el-input></el-form-item>
              <el-form-item label="联系方式:" prop="contactInfo">
                <el-form-item label="Tel:" prop="Tel"><el-input clearable size="small" type="text" v-model="contactInfo.Tel"></el-input></el-form-item>
                <el-form-item label="WeChat:" prop="WeChat"><el-input clearable size="small" type="text" v-model="contactInfo.WeChat"></el-input></el-form-item>
                <el-form-item label="QQ:" prop="QQ"><el-input clearable size="small" type="text" v-model="contactInfo.QQ"></el-input></el-form-item>
              </el-form-item>
            </el-col>
            <el-col class="questionStyle" :span="24">
              <el-select v-model="classDate" multiple placeholder="选择课程" @change="chooseClass">
                <el-option
                  v-for="(item,index) in classOptions"
                  :key="index"
                  :label="item.ProgramName"
                  :value="item.ProgramCode">
                </el-option>
              </el-select>
            </el-col>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogTwoVisible = false">取 消</el-button>
          <el-button type="primary" @click="MakeSureHandle2">确 定</el-button>
        </span>
      </el-dialog>
      </section>

      </div>


  </div>
</template>
<script type="text/ecmascript-6">
  import headTop from '../../components/headTop'
  import {getStore,setStore} from '../../config/publicMethod'
  import {getAllManagerList,getAllCenter,addClassInfo,deleteClassInfo,changeCenterManager,getCenterProgram,addCenter} from '../../api/manage'
  import {getMemberList} from '../../api/user'
  import {getAreaList} from '../../api/common'
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
        name:'', adminName:'',Area:'',Status:"",
        pageSize:10,
        allData:[],//所有的数据
        currentData:[],//当前页面展示的条数

        multipleSelection: [],
        addDialogVisible:false,dialogTwoVisible:false,
        modalClickOther:false,
        alertFlag:false,VisibleFlag:false,
        provinceDate:[],cityDate:[],areaDate:[],adminDate:[],centerDate:[],
        provinceOptions:[],cityOptions:[],areaOptions:[],adminOptions:[],centerOptions:[],
        DistinctName:'',  currentIdFlag:false,
        classAdd:'',classDate:[],classOptions:[],
        contactInfo:{
          Tel:'',WeChat:'',QQ:''
        },
        Status:false,
        ruleForm: {
          CenterID:'',
          CenterName:'',
          Name:'',
          ParentID:'',
          Status:'',
          UserID:''
        },
        addForm:{
          CenterName:'',
          DistinctName:'',
          Name:'',
          Address:'',
          Status:'',
          ParentID:'',
          ContactInfo:'',
          CenterProgram:'',
          CenterManager:''
        },
        ParentID:'',
        rules: {
          CenterName: [
            { required: true, message: '请输入中心名称', trigger: 'blur' },
          ],
          Name: [
            { required: true, message: '请输入管理员', trigger: 'blur' },
          ],
          ParentID: [
            {required: true,  message: '请输入父级ID', trigger: 'blur' }
          ]
        }
      }
    },
    components:{
      headTop
    },
    watch:{

    },
    computed: {
      dialogTitle(){
        return this.alertFlag ? '':''
      }
    },
    mounted(){
      this.getUserInfo();
      this.getAllProvince();
      this.getclass();
    },
    methods:{
      async chooseAdmin(row){
        this.adminDate=row.UserName;
        this.addForm.CenterManager = row.UserID;
      },
      async chooseCenter(row){
        this.centerDate = row.CenterID;
        this.addForm.ParentID =  row.CenterID;
        console.log( this.addForm.ParentID)
      },
      async chooseClass(row){//选择课程
        console.log(row)
        this.addForm.CenterProgram = row
      },
      async switchChange(){
        console.log( this.Status )
        this.addForm.Status = Number(this.Status);
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
        this.addForm.DistinctName = null;
        this.addForm.DistinctID =null;

        this.DistinctName=row.Name;
        this.addForm.DistinctName = row.MergerName;
        this.addForm.DistinctID = row.ID
        console.log(row)
      },
      async getAllProvince(){
        let result = await getAreaList();
        //this.provinceOptions = result.data;
        result.data.map( (item,index)=>{
          if( item.LevelType==1 ){//省
            this.provinceOptions.push( item )
          }
        })
      },
      async getUserInfo(){
        let userInfo = JSON.parse( getStore('manageUser') );
       // name:'', adminName:'',Area:'',Status:"",
        this.adminName = userInfo.userName
        let result = await getAllCenter();
        this.allData = result.data;
        this.currentData = this.allData.slice(0,this.pageSize);
        console.log("所有的中心列表",result,this.allData)
      },
      async getclass (){
          var inputJson = {
            CenterID:'000'
          }
          let result = await getCenterProgram(inputJson);
          console.log("-----",result.data);
          setStore('programList',result.data)
        this.classOptions = result.data;
        /*** getMemberList---获取未分配为管理员的会员列表信息* */
        var inputJson = {}
        let result2 = await getMemberList(inputJson);
        this.adminOptions = result2.data;
        console.log("getMemberList---",result2.data);
      },

      async getAllClasses(){
        let userInfo = JSON.parse(getStore('manageUser'));
        let centerId= JSON.parse(getStore('manageUser')).centerId;//中心号
        console.log( centerId )
        let result = await getAllCenter();

        this.allData = result.data;
        this.currentData = this.allData.slice(0,this.pageSize);
        console.log("-----******------",result,this.allData)
      },
      async handleEdit(index, row) {
        this.alertFlag = false;
        console.log(index, row);
        this.addDialogVisible = true;
        this.VisibleFlag = true;
        this.ruleForm = {
          CenterID:row.CenterID,
          CenterName:row.CenterName,
          Name:row.Name,
          ParentID:row.ParentID,
          Status:row.Status,
          UserID:row.UserID,
        };
      },
      async handleDelete(index, row) {
        console.log(index, row);
        alert('删除还没做')
    /*    let result = await deleteClassInfo(row);
        if(result.code == 200){
          this.$message({message: '删除成功！',type:'success'});
          let _this = this;
          setTimeout(()=>{
            _this.getAllClasses();
          },1500)
        }*/
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
            console.log("确定按钮---》",params)
            if( flag ){
              alert( 'add' )
            }else{
              let params = this.ruleForm;
              let inputJson = {
                CenterID: params.CenterID,
                UserID: params.UserID,
                Status: params.Status
              }
              let result = await changeCenterManager(inputJson);
              console.log("指派管理员----",result.data);
              if(result.code==200){
                this.$message({message: '指派成功！',type:'success'});
                this.addDialogVisible = false;
                this.getUserInfo();
              }
            }
           /* let result = await addClassInfo(params);
            if(result.code == 200){
              this.$message({message: '添加成功！',type:'success'});
              this.getAllClasses();
            }*/
          }else {
            console.error('error register submit!!');
            return false;
          }
        })
      },
      MakeSureHandle2(){
        let aa = JSON.stringify(this.contactInfo);
            aa = aa.replace(/":"/g,':');
            aa = aa.replace(/","/g,',');
            aa=aa.replace(/{"/g,'');
        this.addForm.ContactInfo =aa.replace(/"}/g,'');
        this.$refs.addCenterForm.validate(async(valid)=>{
          if(valid){
            let params = this.addForm;
            let result = await addCenter(params);
            if(result.code == 200){
              this.$message({message: '添加成功！',type:'success'});
            }
          }else{
            alert('error')
            return false;
          }
        })
      },
      addGeneralCenter(){
        this.alertFlag = true;
        this.VisibleFlag = false;
        this.dialogTwoVisible = true;
        this.addForm={  CenterName:'',
          DistinctName:'',
          Name:'',
          Address:'',
          Status:'',
          ParentID:''};
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
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
</style>
