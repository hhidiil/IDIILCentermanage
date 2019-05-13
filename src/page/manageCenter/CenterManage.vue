<template>
  <div>
    <head-top></head-top>
    <div class="centerManage_section" :xs="4" :sm="6" :md="8" :lg="15" :xl="15">
      <header>
        <el-row>
          <el-col :span="12" class="grid-content titleSetion"><h2>各中心的管理员列表</h2></el-col>
         <!-- <el-col :span="12" class="grid-content editSetion"><el-button type="primary" @click="addUser">新增中心</el-button></el-col>-->
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
          <el-table-column
            type="selection"
            width="50">
          </el-table-column>
          <el-table-column
            type="index"
            width="50">
          </el-table-column>
          <el-table-column prop="CenterID" sortable label="中心ID"></el-table-column>
          <el-table-column prop="ProgramName" label="课程"></el-table-column>
          <el-table-column prop="CourseType" label="课程类型" width="150"></el-table-column>

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
                      <!--<el-input type="text" v-model="ruleForm.Status" ></el-input>-->
                      <el-switch v-model="Status" active-text="开启" inactive-text="关闭" @change="switchChange"></el-switch>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="管理员:" prop="Admin">
                      <!--<el-input type="text" v-model="ruleForm.Name"></el-input>-->
                      <el-select v-model="adminDate" placeholder="请选择管理员" @change="chooseAdmin">
                        <el-option
                          v-for="(item,index) in adminOptions"
                          :key="index"
                          :label="item.centerId"
                          :value="item">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="总中心:" prop="ParentID">
                      <!--<el-input type="number" min="1" max="10" v-model="ruleForm.ParentID"></el-input>-->
                      <el-select v-model="centerDate" placeholder="请选择父中心" @change="chooseCenter">
                        <el-option
                          v-for="(item,index) in centerOptions"
                          :key="index"
                          :label="item.centerId"
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
                        :label="item.name"
                        :value="item.path">
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
  import {getAllCenter,updateCenter,addCenter,deleteCenter,getCenterProgram} from '../../api/manage'
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
        multipleSelection: [],
        dialogVisible:false,
        modalClickOther:false,
        alertFlag:false,
        provinceDate:[],cityDate:[],areaDate:[],adminDate:[],centerDate:[],
        provinceOptions:[],cityOptions:[],areaOptions:[],adminOptions:adminDate_Test,centerOptions:adminDate_Test,
        DistinctName:'',
        classAdd:'',classDate:[],classOptions:adminDate_Test[0].msg,
        contactInfo:{
          Tel:'',WeChat:'',QQ:''
        },
        classInfo:{
          Zhongkao:'',Faxianshishuxue:'',Qingkecheng:''
        },
        Name:'',
        Status:false,
        ruleForm: {
          CenterName:'',
          DistinctName:'',
          Name:'',
          Address:'',
          Status:'',
          ParentID:'',
          CenterProgram:''
        },
        show_len:1,
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
    },
    methods:{
      async getAllUserList(){
        var inputJson = {
          CenterID:'000'
        }
        let result = await getCenterProgram(inputJson);

        //let result = await getAllCenter();
        this.allData = result.data;
        this.currentData = this.allData.slice(0,this.pageSize);
        console.log("所有的管理员",result,this.allData)
      },
      handleEdit(index, row) {
        console.log(index, row);
        alert('还没做')
     /*   this.dialogVisible = true;
        this.alterFlag = false;
        this.ruleForm ={
          ParentID: row.ParentID,
          CenterName: row.CenterName,
          DistinctName: row.DistinctName,
          Name: row.Name,
          Address: row.Address,
          Status: row.Status ,
          ParentID: row.ParentID,
        };*/
      },
      async handleDelete(index, row) {
        console.log(index, row);
        alert('删除还没做')
   /*     let result = await deleteCenter({CenterID:row.CenterID});
        if(result.code == 200){
          this.$message({message: '删除成功！',type:'success'});
        }*/
      },
      /*add by cui*/
      async chooseAdmin(row){//选择管理员
        this.adminDate=row.resultMsg;
        this.ruleForm.Admin = this.adminDate;
      },
      async chooseCenter(row){//选择中心
        this.centerDate = row.centerId;
        this.ruleForm.ParentID = this.centerDate;
      },
      async chooseClass(row){//选择课程
        console.log(row)
        this.ruleForm.CenterProgram =  row
      },
      async switchChange(){//切换状态
        this.ruleForm.Status = this.Status;
        console.log( this.Status )
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
        console.log("弹框确定--》》》",flag);
        this.$refs.alterForm.validate( async(valid) => {
          if (valid) {
            this.ruleForm.ContactInfo = JSON.stringify(this.contactInfo);
            let params = this.ruleForm;
            console.log("ruleForm结果------->",params)
            if(flag){//添加用户
            /*  let result = await addCenter(params);
              if(result.code == 200){
                this.$message({message: '添加成功！',type:'success'});
              }*/
            }else {//修改用户
              let result = await updateCenter(params);
              if(result.code == 200){
                this.$message({message: '修改成功！',type:'success'});
              }
            }
            this.dialogVisible = false
            this.clearDialog()
            this.getAllUserList();
          } else {
            console.error('error register submit!!');
            return false;
          }
        });
      },
      async addUser(){
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
