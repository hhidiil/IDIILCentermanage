<template>
  <section>
    <div>
      <el-form  class="textForm" label-width="formLabelWidth">
        <el-form-item label="区块名称:">
          <span>{{currentBlockList[0].name}}</span>
        </el-form-item>
        <el-form-item label="教学目标:">
          <span>{{currentBlockList[0].target}}</span>
        </el-form-item>
        <el-form-item label="课程时长:">
          <span>{{currentBlockList[0].duration}}</span>
        </el-form-item>
        <el-form-item label="课程内容:">
          <span>{{currentBlockList[0].name}}</span>
        </el-form-item>
        <el-form-item label="教学参考:">
          <div>
            <el-upload
              class="upload-demo"
              ref="upload"
              action="/api/file/upload"
              :file-list="fileList"
              multiple
              show-file-list
              :auto-upload="false"
              :on-preview="handlePreview"
              :on-change="handleChange"
              :before-remove="beforeRemove"
              :on-remove="handleRemove"
              :before-upload="beforeUpload"
              :on-success="UploadSuccess"
              :on-error="UploadError">
              <el-button slot="trigger" size="mini" type="primary">选取文件</el-button>
              <el-button style="margin-left: 10px;" size="mini" type="success" @click="submitUpload">上传到服务器</el-button>
            </el-upload>
          </div>
        </el-form-item>
        <el-form-item>
          <div class="btnBox">
            <el-button size="mini" @click.prevent="editBlock(currentBlockList[0])">编辑</el-button>
            <el-button size="mini" @click.prevent="removeResource(currentBlockList[0])">删除</el-button>
          </div>
        </el-form-item>
      </el-form>
    </div>

    <!-- 区块编辑弹出框 -->
    <el-dialog
      title="编辑区块内容"
      v-dialogDrag
      :visible.sync="editVisible"
      width="40%">
      <el-form :model="blockForm" status-icon :rules="moreRules"  ref="moreRules" :label-width="formLabelWidth">
          <el-form-item label="区块名称:"
                        prop="name">
            <el-input v-model="blockForm.name" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="教学目标:"
                        prop="target">
            <el-input type="textarea" v-model="blockForm.target" auto-complete="off"></el-input>
          </el-form-item>
            <el-form-item label="区块时长:">
            <el-input v-model="blockForm.duration" auto-complete="off"></el-input>
          </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button @click="editVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveBlockEdit('moreRules')">确 定</el-button>
      </span>
    </el-dialog>

  </section>
</template>
<script>
  import { mapState,mapMutations } from 'vuex'
  export default{
    props:[],
    data(){
      let validBlockName=(rule, value, callback) => {
        if (!value) {
          callback(new Error('请输入教学名称'));
        } else {
          callback();
        }
      }
      let validBlockTarget=(rule, value, callback) => {
        if (!value) {
          callback(new Error('请输入教学目标'));
        } else {
          callback();
        }
      }
      return{
          editVisible:false, //编辑弹出框
          //新增表单的验证规则
          moreRules: {
            name: [
              {required: true, message: '请输入区块名称', trigger: 'blur'},
              {validator: validBlockName, trigger: 'blur'}
            ],
            target: [
              {required: true, message: '请输入教学目标', trigger: 'blur'},
              {validator: validBlockTarget, trigger: 'blur'}
            ]
          },
          blockForm: {
            name: '',
            target: '',
            duration: ''
          },
          formLabelWidth: '90px',
          fileList: []
          }

      },
      created(){

      },
      mounted(){

      },
      computed:{
        ...mapState([
          'sourceListsInfo',
          'currentBlockKey',
          'currentBlockList'
        ])
      },
      methods:{
      ...mapMutations([
          'SOURCE_LIST',
          'CURRENT_BLOCK_KEY',
          'CURRENT_BLOCK_LIST'
        ]),
        //删除区块列表中的选中项
        removeResource(item) {
              let sourceLists=JSON.parse(JSON.stringify(this.sourceListsInfo));
              if(sourceLists.blockLists.length>1){
                sourceLists.blockLists.forEach((item,index) => {
                  if(item.key == this.currentBlockKey){
                  sourceLists.blockLists.splice(index, 1);
                }
              })

              let cBlockKey=sourceLists.blockLists[0].key;
              let cBlockList=sourceLists.blockLists.filter((currentValue,index,arr) => {
                  return currentValue.key ==  sourceLists.blockLists[0].key;
                });
              this.SOURCE_LIST(sourceLists);
              this.CURRENT_BLOCK_KEY(cBlockKey);
              this.CURRENT_BLOCK_LIST(cBlockList);
            }else{
              sourceLists.blockLists.splice(0, 1);
              this.SOURCE_LIST(sourceLists);
              this.CURRENT_BLOCK_KEY("");
              this.CURRENT_BLOCK_LIST([]);
            }

        },

        /*
        * 初始化弹框数据
        * */
        editBlock(item){
          this.blockForm = {
            name: item.name,
            target: item.target,
            duration: item.duration
          };
          this.editVisible = true;
          this.clearValidate('moreRules');
        },
        /*
         * 移除整个表单的校验结果
         * */
        clearValidate(formName){
          this.$nextTick(function(){
            this.$refs[formName].clearValidate();
          });

        },
        /*
        * 弹框区块内容编辑保存
        * */
        saveBlockEdit(formName){
          this.$refs[formName].validate((valid) => {
            if(valid){
              let currList=JSON.parse(JSON.stringify(this.currentBlockList));
                currList[0].name=this.blockForm.name
                currList[0].target=this.blockForm.target
                currList[0].duration=this.blockForm.duration

              let sourceLists=JSON.parse(JSON.stringify(this.sourceListsInfo));
              sourceLists.blockLists.forEach((item) => {
                if(item.key == this.currentBlockKey){
                  item.name=this.blockForm.name
                  item.target=this.blockForm.target
                  item.duration=this.blockForm.duration
                }
              })
              this.CURRENT_BLOCK_LIST(currList);
              this.SOURCE_LIST(sourceLists);
              this.editVisible = false;

            }else{
                console.log('error submit!!');
            }
          })
        },

        /*
        *文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用
        * */
        handleChange(file, fileList) {
//          this.fileList = fileList.slice(-3);
        },

       //点击已上传的文件链接时的钩子, 可以通过 file.response 拿到服务端返回数据
        handlePreview(file) {
          console.log(file);
        },
        //删除文件之前的钩子，参数为上传的文件和文件列表
        beforeRemove(file, fileList) {
          return this.$confirm(`确定移除 ${ file.name }？`);
        },
        //文件列表移除文件时的钩子
        handleRemove(file, fileList) {
          console.log(file, fileList);
        },
        //上传文件之前的钩子，参数为上传的文件
        beforeUpload(file){
          console.log(file)
        },
        //文件上传成功时的钩子
        UploadSuccess(response, file, fileList){
          console.log(file)
        },
        //文件上传失败时的钩子
        UploadError(err, file, fileList){
          console.log(file)
        },
        submitUpload(){
          this.$refs.upload.submit();
        }
      }
  }
</script>
<style scoped lang="less">
  .btnBox{
    text-align: right;
  }

</style>
