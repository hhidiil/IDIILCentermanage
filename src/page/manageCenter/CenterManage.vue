<template>
  <div>
    <head-top></head-top>
    <div class="centerManage_section">
      <header>
        <el-row>
          <el-col :span="12" class="grid-content titleSetion"><h2>各中心的管理员列表</h2></el-col>
          <el-col :span="12" class="grid-content editSetion"><el-button type="primary" @click="addCenter('新增','centerForms')">新增中心</el-button></el-col>
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
          <el-table-column
            prop="centerId"
            sortable
            label="中心号">
          </el-table-column>
          <el-table-column
            prop="centerName"
            sortable
            label="中心名称">
          </el-table-column>
          <el-table-column
            prop="address"
            sortable
            label="中心地址">
          </el-table-column>
          <el-table-column
            prop="userName"
            label="中心管理员">
          </el-table-column>
          <el-table-column
            prop="permissionLevel"
            sortable
            label="权限">
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
          :title="dialogTitle + '中心信息'"
          :show-close="modalClickOther"
          :visible.sync="dialogVisible"
          :closeOnClickModal="modalClickOther"
          width="50%">
            <el-form :model="centerForm" :rules="rules" ref="centerForms" label-width="100px" class="demo-ruleForm">
              <el-form-item label="中心号" prop="centerId">
                <el-input v-model="centerForm.centerId"></el-input>
              </el-form-item>
              <el-form-item label="中心名" prop="centerName">
                <el-input v-model="centerForm.centerName"></el-input>
              </el-form-item>
              <el-form-item label="中心地址" prop="address">
                <el-input v-model="centerForm.address"></el-input>
              </el-form-item>
              <el-form-item label="管理员名" prop="userName">
                <el-input v-model="centerForm.userName"></el-input>
              </el-form-item>
              <el-form-item label="手机号" prop="phone">
                <el-input v-model.number="centerForm.phone"></el-input>
              </el-form-item>
            </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="MakeSureHandle()">确 定</el-button>
          </span>
        </el-dialog>
      </section>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  import headTop from '../../components/headTop'
  import {getAllManagerList,addCenterInfo,updateCenterInfo,deleteCenter} from '../../api/manage'
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
        centerForm:{
          centerId:'',
          centerName:'',
          address:'',
          userId:'',
          userName:'',
          phone:''
        },
        rules:{
          centerId:[{ required: true, message: '请输入中心号', trigger: 'blur' }],
          centerName:[{ required: true, message: '请输入中心名称', trigger: 'blur' }],
          address:[{ required: true, message: '请输入中心地址', trigger: 'blur' }],
          userName:[{ required: true, message: '请输入管理员名字', trigger: 'blur' }],
          phone:[{ required: true, message: '请输入管理员联系方式', trigger: 'blur' },
            { type:'number',message: '请输入11位手机号码', trigger: 'blur' }],
        },
        pageSize:10,
        allData:[],//所有的数据
        currentData:[],//当前页面展示的条数
        multipleSelection: [],
        dialogTitle:'',
        dialogVisible:false,
        modalClickOther:false,
      }
    },
    components:{
      headTop
    },
    mounted(){
      //进入首页的时候查询
      this.getAllUserList();
    },
    methods:{
      async getAllUserList(){
        let result = await getAllManagerList();
        this.allData = result.data;
        this.currentData = this.allData.slice(0,this.pageSize);
        console.log("所有的中心列表",result,this.allData)
      },
      PageChange(page){
        console.log("PageChange",page)
        let num = this.pageSize;
        this.currentData = this.allData.slice( (page-1)*num,(page-1)*num+num)
      },
      async MakeSureHandle(){
        this.dialogVisible = false;
        console.log("添加中心数据==>",this.dialogTitle,this.centerForm);
        if(this.dialogTitle == '新增'){
          const addresult = await addCenterInfo(this.centerForm);
          this.$message({message: '添加成功！',type:'success'});
          this.getAllUserList();
          console.log("添加 ---- 中心数据返回结果==>",addresult);
        }else if(this.dialogTitle == '修改'){
          const addresult = await updateCenterInfo(this.centerForm);
          this.$message({message: '修改成功！',type:'success'});
          this.getAllUserList();
          console.log("修改 ---- 中心数据返回结果==>",addresult);
        }
      },
      addCenter(param,param2){
        this.dialogTitle = param;
        this.dialogVisible = true;
        console.log("添加中心数据==>",this.$refs[param2]);
        if(this.$refs[param2]){
//          this.$refs[param2].resetFields();
        }
      },
      handleEdit(index, row) {
        console.log(index, row);
        this.dialogTitle = '修改';
        this.dialogVisible = true;
        this.centerForm.centerId = row.centerId;
        this.centerForm.centerName = row.centerName;
        this.centerForm.userId = row.userId;
        this.centerForm.userName = row.userName;
        this.centerForm.phone = row.phone;
        this.centerForm.address = row.address;
      },
      async handleDelete(index, row) {
        console.log(index, row);
        const reslut = await deleteCenter({centerId:row.centerId})
        this.$message({message: '删除成功！',type:'success'});
        console.log("删除中心的结果==>",reslut);
        this.getAllUserList();
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
<style scoped lang="less" type="text/less">
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
</style>
