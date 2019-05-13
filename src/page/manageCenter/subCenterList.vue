<template>
  <div>
    <head-top></head-top>
    <div class="centerManage_section" :xs="4" :sm="6" :md="8" :lg="15" :xl="15">
      <header>
        <el-row>
          <el-col :span="12" class="grid-content titleSetion"><h2>各中心列表</h2></el-col>
          <el-col :span="12" class="grid-content editSetion"><el-button type="primary" @click="addUser(null,null)">新增中心</el-button></el-col>
        </el-row>
      </header>
      <section class="section_table">
     <!--   <el-table :data="tableData" style="width: 100%;margin-bottom: 20px;" border row-key="id">
          <el-table-colum prop="date" label="日期" sortable width="180"></el-table-colum>
          <el-table-column prop="name" label="姓名" sortable width="180"></el-table-column>
          <el-table-column prop="address" label="地址"></el-table-column>
        </el-table>-->



        <el-table
          ref="multipleTable"
          :data="currentData" style="width: 100%" row-key="id"
          border
          height="450"
          :header-row-style="headerStyle"
          :highlight-current-row="true"
          :cell-style="cellStyle"
          @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="50"></el-table-column>
          <el-table-column type="index"></el-table-column>
          <el-table-column prop="CenterName" sortable label="中心名称"></el-table-column>
          <el-table-column prop="CenterID" label="中心ID"></el-table-column>
          <el-table-column prop="DistinctName" label="区域"></el-table-column>
          <el-table-column prop="Address" label="地址"></el-table-column>
          <el-table-column prop="UserName" label="管理员"></el-table-column>
          <el-table-column prop="ParentID" label="父级ID"></el-table-column>
          <el-table-column prop="UserID" label="UserID"></el-table-column>
          <el-table-column prop="ContactInfo" label="备注信息"></el-table-column>
          <el-table-column label="操作" width="150">
            <template slot-scope="scope">
              <el-button
                size="mini"
                @click="handleEdit(scope.$index, scope.row)">Edit</el-button>
            <!--  <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)">Del</el-button>-->
              <el-button
                size="mini"
                type="primary"
                @click="addUser(scope.$index, scope.row)">Add</el-button>
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
          :title="alertFlag ? '中心管理信息':'修改中心管理信息'"
          :show-close="modalClickOther"
          :visible.sync="dialogVisible"
          :closeOnClickModal="modalClickOther"
        >
          <el-row>
            <el-col :span="24">
              <el-form :model="ruleForm" status-icon  ref="alterForm" label-width="80px" class="demo-ruleForm">
                <!--<el-form :model="ruleForm" status-icon :rules="rules" ref="alterForm" label-width="80px" class="demo-ruleForm">-->
                <el-col :span="24">
                  <el-col :span="12">
                    <el-form-item label="名称:" prop="CenterName">
                      <el-input type="text" v-model="ruleForm.CenterName"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="状态:" prop="Status">
                      <el-switch v-model="Status" active-text="开启" inactive-text="关闭" @change="switchChange"></el-switch>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="管理员:"prop="Admin">
                      <!--<el-input type="text" v-model="ruleForm.Name"></el-input>-->
                      <el-select v-model="adminDate" placeholder="请选择管理员" clearable @change="chooseAdmin">
                        <el-option
                          v-for="(item,index) in adminOptions"
                          :key="index"
                          :label="item.UserName"
                          :value="item">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
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
                        <el-select v-model="areaDate" value-key="ID" placeholder="请选择区" @change="selectArea" >
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
                <el-col style="font-size:1.1rem" :span="12">{{alertFlag ? '添加用户':'修改用户信息' }}</el-col>
                <el-col style="font-size:1.1rem" :span="12">{{alertFlag ? '添加课程':'修改课程信息'}}</el-col>
                <el-col class="questionStyle" :span="12">
                  <el-form-item label="联系人:" prop="Name"><el-input clearable type="text" v-model="ruleForm.Name"></el-input></el-form-item>
                  <el-form-item label="联系方式:" prop="contactInfo">
                    <el-form-item label="Tel:" prop="Tel"><el-input clearable size="small" type="text" v-model="contactInfo.Tel"></el-input></el-form-item>
                    <el-form-item label="WeChat:" prop="WeChat"><el-input clearable size="small" type="text" v-model="contactInfo.WeChat"></el-input></el-form-item>
                    <el-form-item label="QQ:" prop="QQ"><el-input clearable size="small" type="text" v-model="contactInfo.QQ"></el-input></el-form-item>
                  </el-form-item>
                </el-col>
                <el-col class="questionStyle" :span="12">
                  <div class="massage_append">
                    <el-input placeholder="中考" class="AddInput AddInput_show" v-model="classInfo.Zhongkao" value="item.name">
                      <el-button slot="append" icon="el-icon-circle-plus-outline" @click="appendClass(1)"></el-button>
                      <el-button slot="append" icon="el-icon-remove-outline" @click="removeClass(1)"></el-button>
                    </el-input>
                    <el-input placeholder="发现式数学" class="AddInput" v-model="classInfo.Faxianshishuxue">
                      <el-button slot="append" icon="el-icon-circle-plus-outline" @click="appendClass(2)"></el-button>
                      <el-button slot="append" icon="el-icon-remove-outline" @click="removeClass(2)"></el-button>
                    </el-input>
                    <el-input placeholder="轻课程" class="AddInput" v-model="classInfo.Qingkecheng">
                      <el-button slot="append" icon="el-icon-circle-plus-outline" @click="appendClass(3)"></el-button>
                      <el-button slot="append" icon="el-icon-remove-outline" @click="removeClass(3)"></el-button>
                    </el-input>
                  </div>

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
            </el-col>
          </el-row>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="MakeSureHandle(alertFlag)">确 定</el-button>
          </span>
        </el-dialog>
      </section>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  import headTop from '../../components/headTop'
  import {getStore,setStore} from '../../config/publicMethod'
  import {getAllCenter,updateCenter,addCenter,deleteCenter,getCenterProgram,getClassCenterUser} from '../../api/manage'
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
        pageSize:10,
        allData:[],//所有的数据
        currentData:[],//当前页面展示的条数
        multipleSelection: [],
        dialogVisible:false,
        modalClickOther:false,
        alertFlag:false,
        provinceDate:[],cityDate:[],areaDate:[],adminDate:[],centerDate:[],
        provinceOptions:[],cityOptions:[],areaOptions:[],adminOptions:[],centerOptions:[],
        DistinctName:'',  currentIdFlag:false,
        classAdd:'',classDate:[],classOptions:[],
        contactInfo:{
          Tel:'',WeChat:'',QQ:''
        },
        classInfo:{
          Zhongkao:'',Faxianshishuxue:'',Qingkecheng:''
        },
        appendChildren:[],
        Name:'',
        Status:false,
        ruleForm: {
          CenterName:'',
          DistinctName:'',
          Name:'',
          Address:'',
          Status:'',
          ParentID:'',
        },
        show_len:1,
        ParentID:'',
        //验证form表单：
        /*rules: {
         CenterName: [
         { required: true, message: '请输入CenterName', trigger: 'blur' },
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
     /*   tableData: [{
          id: 1,
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          id: 2,
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄'
        }, {
          id: 3,
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄',
          children: [{
            id: 31,
            date: '2016-05-01',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1519 弄'
          }, {
            id: 32,
            date: '2016-05-01',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1519 弄'
          }]
        }, {
          id: 4,
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        }],*/
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
      this.getAllProvince();
      this.getclass();
    },
    methods:{
      async getclass (){
        var inputJson = {
          CenterID:'000'
        }
        let result = await getCenterProgram(inputJson);
        setStore('programList',result.data)
        this.classOptions = result.data//JSON.parse( JSON.stringify(result.data) );
        /*** getMemberList---获取未分配为管理员的会员列表信息* */
        var inputJson = {}
        let result2 = await getMemberList(inputJson);
        this.adminOptions = result2.data;
        console.log("getMemberList---",result2.data);
      },
      async getAllUserList(){
        let result = await getAllCenter();
        this.allData = result.data;

        for(var i=0;i<this.allData.length;i++){
          this.allData[i].id=i;
        }
/*        let tt= result.data[1];
        tt.id=12;
        this.appendChildren.push(  tt  )
        this.allData[0].hasChildrens=true
        /!*this.allData[0].childrens= this.appendChildren;*!/
        setStore('allData',this.allData)
let aa=getStore('allData')
        console.log( this.allData.length )*/
        this.currentData =this.allData.slice(0,this.pageSize); //JSON.parse( aa )//
        console.log("所有的中心列表",result,this.allData)
      },
      handleEdit(index, row) {
        console.log(index, row);
        alert('编辑还没做')
        return false;

        this.dialogVisible = true;
        this.alterFlag = false;
        this.ruleForm ={
          ParentID: row.ParentID,
          CenterName: row.CenterName,
          DistinctName: row.DistinctName,
          Name: row.Name,
          Address: row.Address,
          Status: row.Status ,
        };
      },
      async handleDelete(index, row) {
        console.log(index, row);
        alert('删除还没做')
       /* let result = await deleteCenter({CenterID:row.CenterID});
        if(result.code == 200){
          this.$message({message: '删除成功！',type:'success'});
        }*/
      },
      /*add by cui*/
      async chooseAdmin(row){
        this.adminDate=row.UserName;
        this.ruleForm.CenterManager = row.UserID;
      },
      async chooseCenter(row){
        this.centerDate = row.CenterID;
        this.ruleForm.ParentID =  row.CenterID;
        console.log( this.ruleForm.ParentID)
      },
      async chooseClass(row){//选择课程
        console.log(row)
        this.ruleForm.CenterProgram = JSON.stringify( row )
      },
      async switchChange(){
        console.log( this.Status )
        this.ruleForm.Status =Number( this.Status );
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
      PageChange(page){
        console.log("PageChange",page)
        let num = this.pageSize;
        this.currentData = this.allData.slice( (page-1)*num,(page-1)*num+num)
      },
      MakeSureHandle(flag){
        console.log("弹框确定--》》》",flag);

        this.$refs.alterForm.validate( async(valid) => {
          if (valid) {
            let aa = JSON.stringify(this.contactInfo);
            aa = aa.replace(/":"/g,':');
            aa = aa.replace(/","/g,',');
              aa=aa.replace(/{"/g,'');
              this.ruleForm.ContactInfo =aa.replace(/"}/g,'');
            let params = this.ruleForm;
            console.log("ruleForm结果------->",params)
            console.log( JSON.stringify(this.contactInfo) )
            if(flag){//添加用户

            /*  let inputs={
               ClassID:'1001001',
               UserType:'A'
               }
               let result = await getClassCenterUser(inputs);
               if(result.code == 200){
               this.$message({message: '添加成功！',type:'success'});
               }*/

              if( getStore('currentID') ){
                this.ruleForm.ParentID=getStore('currentID')
              }
              setStore( 'allDatas' , this.ruleForm )
              let result = await addCenter(params);
              if(result.code == 200){
                this.$message({message: '添加成功！',type:'success'});
              }
            }else {//修改用户
              alert('无法修改')
             /* let result = await updateCenter(params);
              if(result.code == 200){
                this.$message({message: '修改成功！',type:'success'});
              }*/
            }
            this.dialogVisible = false;
            //setStore("currentID",'')
            this.clearDialog()
            this.getAllUserList();
          } else {
            console.error('error register submit!!');
            return false;
          }
        });
      },
      addUser(index,row){
        if(row!=undefined){
          this.ParentID = row.CenterID;
          setStore('currentID',row.CenterID);//存储当前CenterID，当添加他的子级时，变为他子级的ParentID
          this.currentIdFlag=true;
        }else{
          this.currentIdFlag =false;
          localStorage.removeItem('currentID')
        }
        this.dialogVisible = true;
        this.alertFlag = true;
        this.ruleForm ={
          ParentID: '',
          CenterName: '',
          DistinctName: '',
          Name: '',
          Address: '',
          Status:'',DistinctID:'',ContactInfo:''
        }
        this.provinceDate=null;
      },
      clearDialog(){
        this.ruleForm ={
          ParentID: '', CenterName: '',
          DistinctName: '', Name: '',
          Address: '', Status: '',
          DistinctID:'',ContactInfo:''
        }
      },
      appendClass(i){
        var add_len=$('.AddInput').length;
        if( this.show_len >=add_len ){
          alert('QQ、微信、电话中填写信息即可，无需其他联系方式')
          return false;
        }
        $('.AddInput').eq(i-1).addClass('AddInput_show')
        this.show_len = Number(this.show_len)+1;
        console.log( this.show_len )
        $('.AddInput').eq(add_len-this.show_len+1).css('display','inline-table')
      },
      removeClass(i){
        this.show_len = Number(this.show_len)-1;
        if( this.show_len <= 0 ){
          alert('QQ、微信、电话中至少保留一种联系方式')
          return false;
        }
        console.log(this)
        $('.AddInput').eq(i-1).css('display','none');
        $('.AddInput').eq(i-1).removeClass('AddInput_show');
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
