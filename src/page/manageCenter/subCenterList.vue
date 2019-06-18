<template>
  <div>
    <head-top></head-top>
    <div class="centerManage_section" :xs="4" :sm="6" :md="8" :lg="15" :xl="15">
      <header>
        <el-row>
          <el-col :span="24" class="grid-content titleSetion"><h2>各中心列表</h2></el-col>
          <el-col :span="12" class="grid-content titleSetion">
            <el-select v-model="chooseCenterListData" placeholder="选择中心" @change="chooseCenterList">
              <el-option
                v-for="(item,index) in chooseCenterOption"
                :key="index"
                :label="item.CenterID"
                :value="item">
              </el-option>
            </el-select>
            <el-button type="text"  @click="getAllUserList"> 当前中心下的所有中心</el-button>
          </el-col>
          <el-col :span="12" class="grid-content editSetion">
            <el-button type="primary" @click="addUser(null,null)">添加中心</el-button>
            <el-button type="primary" @click="registerMember">注册管理员</el-button></el-col>
        </el-row>
      </header>
      <section class="section_table">
        <el-table ref="multipleTable"
          :data="currentData" style="width: 100%" row-key="id" border height="450" :header-row-style="headerStyle" :highlight-current-row="true" :cell-style="cellStyle"
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
          <el-table-column prop="CenterID" label="中心ID"></el-table-column>
          <el-table-column prop="CenterName" label="中心名称"></el-table-column>
          <el-table-column prop="Name" label="联系人"></el-table-column>
          <el-table-column prop="ParentID" label="父级ID"></el-table-column>
          <el-table-column prop="UserID" label="UserID"></el-table-column>
          <el-table-column label="操作" >
            <template slot-scope="scope">
              <el-button size="mini" type="primary" plain @click="handleChooseAdmin(scope.$index, scope.row)">指派</el-button>
              <el-button size="mini" type="warning" plain @click="handleEdit(scope.$index, scope.row)">修改</el-button>
            <!--  <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)">Del</el-button>-->
              <el-button size="mini" type="success" plain @click="addUser(scope.$index, scope.row)">添加</el-button>
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
          :title="alertFlag ? '中心管理信息':'修改中心管理信息'" :show-close="modalClickOther"
          :visible.sync="dialogVisible" :closeOnClickModal="modalClickOther">
          <el-row>
            <el-col :span="24">
              <el-form :model="ruleForm" status-icon  ref="alterForm" label-width="80px" class="demo-ruleForm">
                <!--<el-form :model="ruleForm" status-icon :rules="rules" ref="alterForm" label-width="80px" class="demo-ruleForm">-->
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
                  <el-col :span="12" v-if="this.isAdd">
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
                <el-col :span="24">
                  <el-form-item label="联系人:" prop="Name"><el-input clearable type="text" v-model="ruleForm.Name"></el-input></el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="联系方式:" prop="contactInfo">
                    <el-form-item label="Tel:" prop="Tel"><el-input clearable size="small" type="text" v-model="contactInfo.Tel"></el-input></el-form-item>
                    <el-form-item label="WeChat:" prop="WeChat"><el-input clearable size="small" type="text" v-model="contactInfo.WeChat"></el-input></el-form-item>
                    <el-form-item label="QQ:" prop="QQ"><el-input clearable size="small" type="text" v-model="contactInfo.QQ"></el-input></el-form-item>
                  </el-form-item>
                  </el-col>
                <el-col :span="24">
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
        <el-dialog title="注册管理员" :show-close="modalClickOther" height="600" :visible.sync="dialogThreeVisible" :closeOnClickModal="modalClickOther">
          <el-row>
            <el-col :span="24">
              <div style="min-height:400px">
                <registerRole :msg="msg"></registerRole>
              </div>
            </el-col>
          </el-row>
            <span slot="footer" class="dialog-footer">
              <el-button @click="clearDialog">关闭窗口</el-button>
            </span>
        </el-dialog>
        <el-dialog title="选择管理员" :show-close="modalClickOther" height="600" :visible.sync="dialogFourVisible" :closeOnClickModal="modalClickOther">
          <el-row>
            <el-col :span="24">
              <div style="min-height:400px">
                <el-form :model="chooseAdminForm" status-icon  ref="alterForm" label-width="80px" class="demo-ruleForm">
                  <el-form-item label="CenterID:" prop="CenterID">
                    <el-input type="text" v-model="chooseAdminForm.CenterID" disabled></el-input>
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
                  <el-form-item label="状态:" prop="Status">
                    <el-switch v-model="Status" active-text="开启" inactive-text="关闭" @change="switchChange"></el-switch>
                  </el-form-item>
                </el-form>
              </div>
            </el-col>
          </el-row>
            <span slot="footer" class="dialog-footer">
              <el-button @click="clearDialog">取消</el-button>
              <el-button @click="makesure(chooseAdminFlag)">确定</el-button>
            </span>
        </el-dialog>
      </section>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  import headTop from '../../components/headTop'
  import registerRole from '../../components/registerCom'
  import {getStore,setStore} from '../../config/publicMethod'
  import {getDataFromServer } from '../../api/manage'
  import {getMemberList} from '../../api/user'
  import {getAreaList} from '../../api/common'

  export default{
    data(){
      return{
        msg:'registerMember',
        cellStyle:{textAlign:'center'},
        headerStyle:{backgroundColor:'rgb(117, 203, 214)', color: '#4f504b'},
        isAdd:true,
        pageSize:10,
        allData:[],//所有的数据
        currentData:[],//当前页面展示的条数
        multipleSelection: [],
        dialogVisible:false,dialogThreeVisible:false,dialogFourVisible:false,
        modalClickOther:false,
        alertFlag:false,chooseAdminFlag:false,
        provinceDate:[],cityDate:[],areaDate:[],adminDate:[],centerDate:[],
        provinceOptions:[],cityOptions:[],areaOptions:[],adminOptions:[],centerOptions:[],
        DistinctName:'',  currentIdFlag:false,
        classAdd:'',classDate:[],classOptions:[],
        contactInfo:{Tel:'',WeChat:'',QQ:''},
        classInfo:{Zhongkao:'',Faxianshishuxue:'',Qingkecheng:''},
        appendChildren:[],
        Name:'',
        Status:false,
        ruleForm: {CenterName:'', DistinctName:'', Name:'', Address:'', Status:'', ParentID:'',},
        chooseAdminForm:{ CenterID:'',UserID:"",Status:'' },
        show_len:1,
        ParentID:'',
        chooseCenterOption:[], chooseCenterListData:[],
        //验证form表单：

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
     // this.getclass();
    },
    methods:{
      async chooseCenterList(row){
        console.log(row)
        this.chooseCenterListData = row.CenterID;
        var inp={ CenterID: row.CenterID }
        let result = await getDataFromServer(inp,"getAllCenter");
        this.allData = result.data;
        this.currentData =this.allData.slice(0,this.pageSize);
      },
      async getclass (row){//获取中心的课程列表
        if( row!=null ){
          var inputJson = { CenterID:row.CenterID }
        }else{
          var inputJson = { CenterID:'000' }
        }
        let result = await getDataFromServer(inputJson,"getCenterProgram");
        setStore('programList',result.data)
        this.classOptions = result.data//JSON.parse( JSON.stringify(result.data) );
        /*** getMemberList---获取未分配为管理员的会员列表信息* */
        var inputJson = {}
        let result2 = await getDataFromServer(inputJson,'getCenterFreeManager');
        this.adminOptions = result2.data;
        console.log("getMemberList---",result2.data);
      },
      async getAllUserList(){
        if( getStore('permissionLevel')>1 ){
          var inp = { CenterID:getStore('CenterID') };
          let result = await getDataFromServer(inp,"getAllCenter");
        }else{
          var inp = { };
        }
        let result = await getDataFromServer(inp,"getAllCenter");
        this.chooseCenterOption = result.data;

        this.allData = result.data;
        let arr_parentID=[],arr_currentID=[];

        for(var i=0;i<this.allData.length;i++){
          this.allData[i].id = i;
          arr_parentID.push(  this.allData[i].ParentID  )
          arr_currentID.push(  this.allData[i].CenterID  )
        };
        this.translateDataToTree(this.allData)
        console.log(  this.allData  )
   /*     for(var i=0;i<arr_currentID.length;i++){
          console.log(arr_parentID[i])
          for(var k=0;k<arr_parentID.length;k++){
            if(arr_currentID[i]==arr_parentID[k]){
              console.log( arr_parentID[k]+'->'+arr_currentID[i] )
              this.allData[i].children = this.allData[k]
              //arr_parentID[i]=arr_parentID[i]+'->'+arr_currentID[k]
            }
          }
        }*/
/*        let tt= result.data[1];
        tt.id=12;
        this.appendChildren.push(  tt  )
        this.allData[0].hasChildrens=true
        /!*this.allData[0].childrens= this.appendChildren;*!/
        setStore('allData',this.allData)
let aa=getStore('allData')
        console.log( this.allData.length )*/
        let  currentCenter = getStore('programList');
        console.log( currentCenter )
        this.currentData =this.allData.slice(0,this.pageSize);
      },
      translateDataToTree(data) {
        //没有父节点的数据
        let parents = data.filter(value => value.ParentID == 'undefined' || value.ParentID == null)
        //有父节点的数据
        let childrens = data.filter(value => value.ParentID !== 'undefined' && value.ParentID != null)
        //定义转换方法的具体实现
        let translator = (parents, childrens) => {
            //遍历父节点数据
            parents.forEach((parent) => {
                //遍历子节点数据
                childrens.forEach((current, index) => {
                  //此时找到父节点对应的一个子节点
                  if (current.ParentID === parent.CenterID) {
                    //对子节点数据进行深复制，这里只支持部分类型的数据深复制，对深复制不了解的童靴可以先去了解下深复制
                    let temp = JSON.parse(JSON.stringify(childrens))
                    //让当前子节点从temp中移除，temp作为新的子节点数据，这里是为了让递归时，子节点的遍历次数更少，如果父子关系的层级越多，越有利
                    temp.splice(index, 1)
                    //让当前子节点作为唯一的父节点，去递归查找其对应的子节点
                    translator([current], temp)
                    //把找到子节点放入父节点的childrens属性中
                    typeof parent.childrens !== 'undefined' ? parent.childrens.push(current) : parent.childrens = [current]
                  }
                }
              )
            }
          )
        }
      },
      registerMember(){
        this.dialogThreeVisible = true;
      },
      handleEdit(index, row) {
        console.log(index, row);
        this.currentIdFlag =false;
        this.isAdd=true;
        this.dialogVisible = true;
        this.getclass(row);
        this.alertFlag = false;
        this.alterFlag = false;
        this.ruleForm ={
          ParentID: row.ParentID,
          CenterName: row.CenterName,
          DistinctName: row.DistinctName,
          Name: row.Name,
          Address: row.Address,
          Status: row.Status ,
          CenterID:row.CenterID
        };
      },
      handleChooseAdmin(index,row){
        this.chooseAdminFlag=true;
        this.dialogFourVisible =true;
        this.chooseAdminForm.CenterID = row.CenterID;
      },
      async makesure(flag){
        if( flag ){
          let aa= this.chooseAdminForm;
          console.log(aa)
          let result = await getDataFromServer(aa,'changeCenterManager')
          if(result.code == 200){
             this.$message({message: '指派成功！',type:'success'});
          }
        }
      },
      async handleDelete(index, row) {
        console.log(index, row);
        alert('删除还没做')
       /* let result = await deleteCenter({CenterID:row.CenterID});
        if(result.code == 200){
          this.$message({message: '删除成功！',type:'success'});
        }*/
      },
      async chooseAdmin(row){
        this.adminDate=row.UserName;
        this.ruleForm.CenterManager = row.UserId;
        this.chooseAdminForm.UserID = row.UserId;
      },
      async chooseCenter(row){
        this.getclass(row);
        this.centerDate = row.CenterID;
        this.ruleForm.ParentID =  row.CenterID;
        console.log( this.ruleForm.ParentID)
      },
      async chooseClass(row){//选择课程
        console.log(row)
        this.ruleForm.CenterProgram = row
      },
      async switchChange(){
        this.ruleForm.Status =Number( this.Status );
        this.chooseAdminForm.Status = Number( this.Status )
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
            if( this.contactInfo.QQ == ''){
              delete eval(this.contactInfo).QQ;
            }
            if( this.contactInfo.WeChat == ''){
              delete eval(this.contactInfo).WeChat;
            }
            if( this.contactInfo.Tel == ''){
              delete eval(this.contactInfo).Tel;
            }
            let aa = JSON.stringify(this.contactInfo);
            aa = aa.replace(/":"/g,':');
            aa = aa.replace(/","/g,',');
              aa=aa.replace(/{"/g,'');
             this.ruleForm.ContactInfo =aa.replace(/"}/g,'');

            let params = this.ruleForm;
            console.log("ruleForm结果------->",params)

            if(flag){//添加用户
              if( getStore('currentID') ){
                this.ruleForm.ParentID=getStore('currentID')
              }
              setStore( 'allDatas' , this.ruleForm )
              let result = await getDataFromServer(params,"addCenter");
              if(result.code == 200){
                this.$message({message: '添加成功！',type:'success'});
              }
            }else {//修改用户
              //var nJson=eval(this.ruleForm);
              //var nvJson = delete eval(nJson).ParentID;
              //var mvJson = delete eval(nvJson).CenterProgram;
             console.log( this.ruleForm )
             // let result = await updateCenterInfo(params);
              let params = this.ruleForm;
              let result = await getDataFromServer(params,"updateCenterInfo");
               if(result.code == 200){
               this.$message({message: '修改成功！',type:'success'});
               }
            }
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
        this.getclass(row);
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
        };
        this.dialogVisible = false;
        this.dialogThreeVisible = false;
        this.dialogFourVisible = false;
        this.getAllUserList()
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
