<template>
  <section>
    <el-card class="classListCard">
      <div slot="header" class="clearfix">
        <span>课程细节</span>
        <el-button v-if="prepareLessonsStatus != 'check'" style="float: right; padding: 3px 0" type="text" @click="editClass(sourceListsInfo.classList)">编辑</el-button>
      </div>
      <div>
        <el-form  class="textForm" label-width="formLabelWidth">
          <el-form-item label="课程名称:">
            <span>{{sourceListsInfo.classList.name}}</span>
          </el-form-item>
          <el-form-item label="课程目标:">
            <span>{{sourceListsInfo.classList.target}}</span>
          </el-form-item>
          <el-form-item label="课程时长:">
            <span>{{sourceListsInfo.classList.duration}}</span>
          </el-form-item>
          <el-form-item label="对应版本:">
            <el-tag
              v-for="tag in sourceListsInfo.classList.version"
              :key="tag">
              {{tag}}
            </el-tag>
          </el-form-item>
          <el-form-item label="教学参考:">
            <upload-files :group="{ name: 'people', pull: 'clone', put: false }" :fileLists="sourceListsInfo.classList.fileLists" @sendFilesInfo="sendFilesInfo"></upload-files>
          </el-form-item>
        </el-form>
      </div>
    </el-card>

    <!-- 课程编辑弹出框 -->
    <el-dialog
      title="编辑课程细节"
      v-dialogDrag
      :visible.sync="editVisible"
      width="40%">
      <el-form :model="classForm" status-icon :rules="classRules" ref="classForm" :label-width="formLabelWidth">
        <el-form-item label="课程名称:" prop="name">
          <el-input v-model="classForm.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="课程目标:" prop="target">
          <el-input type="textarea" v-model="classForm.target" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="课程时长:">
          <el-input v-model="classForm.duration" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="对应版本:">
          <add-tags :tagType="'添加版本'" :dynamicTags="classForm.version"></add-tags>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button @click="editVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveBlockEdit('classForm')">确 定</el-button>
      </span>
    </el-dialog>

  </section>
</template>
<script>
  import { mapState, mapMutations } from 'vuex'
  import uploadFiles from './uploadFiles.vue'
  import addTags from './addTags.vue'
  export default{
    props:['guid'],
    data(){
      let validClassName=(rule, value, callback)=>{
        if(!value){
          return callback(new Error('课程名称不能为空'))
        }
        callback();
      }
      let validClassTarget=(rule, value, callback)=>{
        if(!value){
          return callback(new Error('课程目标不能为空'))
        }
        callback();
      }
      let validClassDuration=(rule, value, callback)=>{
        if(value=='' || value==undefined){
          callback();
        }else{
          let reg=/^[1-9]\d*$/;
          if(!reg.test(Number(value))){
            callback(new Error('时间必须是正整数'))
          }else {
            callback();
          }
        }
      }
      return{
        editVisible:false, //编辑弹出框
        //新增表单的验证规则
        classRules:{
          name:[
            { required:true, message:'请输入课程名称', trigger:'blur' },
            { validator: validClassName, trigger: 'blur' }
          ],
          target:[
            { required:true, message:'请输入课程目标', trigger:'blur'},
            {validator: validClassTarget, trigger: 'blur' }
          ],
          duration:[
            { validator: validClassDuration, trigger: 'blur' }
          ]
        },
        classForm: {
          name: '',
          target: '',
          duration: '',
          version: []
        },
        formLabelWidth: '90px'
      }
    },
    components:{
      uploadFiles,
      addTags
    },
    computed:{
      ...mapState([
        'sourceListsInfo',
        'prepareLessonsStatus'
      ])
    },
    methods:{
    ...mapMutations([
        'SOURCE_LIST'
      ]),
      /*
       * 初始化弹框数据
       * */
      editClass(items){
        var item=JSON.parse(JSON.stringify(items));
        this.classForm = {
          name: item.name,
          target: item.target,
          duration: item.duration,
          version: item.version
        };
        this.editVisible = true;
        this.clearValidate('classForm');
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
         * 弹框课程内容编辑保存
         * */
        saveBlockEdit(formName){
          this.$refs[formName].validate((valid) => {
            if(valid){
              let sourceLists=JSON.parse(JSON.stringify(this.sourceListsInfo));
                sourceLists.classList.name=this.classForm.name;
                sourceLists.classList.target=this.classForm.target;
                sourceLists.classList.duration=this.classForm.duration;
                sourceLists.classList.version=this.classForm.version;
              this.SOURCE_LIST({val:sourceLists, key:this.guid});
              this.editVisible = false;
            }else{
              console.log('error submit!!');
            }
        })
      },
      /*
       * 从子组件接收参数并触发该事件
       * */
      sendFilesInfo(data){
        let sourceLists=JSON.parse(JSON.stringify(this.sourceListsInfo));
        sourceLists.classList.fileLists=data;
        this.SOURCE_LIST({val:sourceLists, key:this.guid});
      }

    }
  }
</script>
<style scoped lang="less">
  .classListCard{
    margin-bottom: 20px;
    .button-group{
      text-align: right;
    }
    .el-tag {
      margin-right: 10px;
    }
  }
  .btnBox{
    text-align: right;
  }
  .el-tag {
    margin-right: 10px;
  }
</style>
