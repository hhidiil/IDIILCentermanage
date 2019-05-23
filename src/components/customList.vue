<template>
  <section class="classListCard">
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
          <el-form-item label="得分占比:">
            <el-progress v-if="sourceListsInfo.classList.scoreRatio" :percentage="Number(sourceListsInfo.classList.scoreRatio)"></el-progress>
          </el-form-item>
          <el-form-item label="探究占比:">
            <el-progress v-if="sourceListsInfo.classList.explore" :percentage="Number(sourceListsInfo.classList.explore)"></el-progress>
          </el-form-item>
          <el-form-item label="协作占比:">
            <el-progress v-if="sourceListsInfo.classList.cooperation" :percentage="Number(sourceListsInfo.classList.cooperation)"></el-progress>
          </el-form-item>
          <el-form-item label="总结占比:">
            <el-progress v-if="sourceListsInfo.classList.summary" :percentage="Number(sourceListsInfo.classList.summary)"></el-progress>
          </el-form-item>
          <el-form-item label="讨论占比:">
            <el-progress v-if="sourceListsInfo.classList.discuss" :percentage="Number(sourceListsInfo.classList.discuss)"></el-progress>
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
      width="50%">
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
        <el-form-item label="得分占比:" prop="scoreRatio">
          <el-input v-model="classForm.scoreRatio" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="探究占比:" prop="explore">
          <el-input v-model="classForm.explore" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="协作占比:" prop="cooperation">
          <el-input v-model="classForm.cooperation" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="总结占比:" prop="summary">
          <el-input v-model="classForm.summary" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="讨论占比:" prop="discuss">
          <el-input v-model="classForm.discuss" auto-complete="off"></el-input>
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
      let validClassRatio=(rule, value, callback)=>{
          let reg = /^(?:0|[1-9][0-9]?|100)$/;
          if(!reg.test(Number(value))){
            callback(new Error('占比需是0到100之间的正整数，例如：25'))
          }else {
            if(value.length>1){
              if(value==0){
                this.classForm[rule.field]=0;
              }else{
                var regex=/^[0]+/;
                this.classForm[rule.field]=this.classForm[rule.field].replace(regex,"");
              }
            }
            callback();
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
            { validator: validClassTarget, trigger: 'blur' }
          ],
          duration:[
            { validator: validClassDuration, trigger: 'blur' }
          ],
          scoreRatio:[
            { required:true, message:'请输入得分占比', trigger:'blur'},
            { validator: validClassRatio, trigger: 'blur' }
          ],
          explore:[
            { required:true, message:'请输入探究占比', trigger:'blur'},
            { validator: validClassRatio, trigger: 'blur' }
          ],
          cooperation:[
            { required:true, message:'请输入协作占比', trigger:'blur'},
            { validator: validClassRatio, trigger: 'blur' }
          ],
          summary:[
            { required:true, message:'请输入总结占比', trigger:'blur'},
            { validator: validClassRatio, trigger: 'blur' }
          ],
          discuss:[
            { required:true, message:'请输入讨论占比', trigger:'blur'},
            { validator: validClassRatio, trigger: 'blur' }
          ]
        },
        classForm: {
          name: '',
          target: '',
          duration: '',
          version: [],
          scoreRatio:"", //得分占比得分占比
          explore:"", //探究
          cooperation:"", //协作
          summary:"", //总结
          discuss:"" //讨论
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
    filters:{
      ratioUnit: function (value) {
        if (!value) return '';
        return value + '%';
      }
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
          version: item.version,
          scoreRatio:item.scoreRatio,
          explore:item.explore,
          cooperation:item.cooperation,
          summary:item.summary,
          discuss:item.discuss
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
          let that=this;
          this.$refs[formName].validate((valid) => {
            let scoreRatio=that.classForm.scoreRatio;
            let explore=that.classForm.explore;
            let cooperation=that.classForm.cooperation;
            let summary=that.classForm.summary;
            let discuss=that.classForm.discuss;
            let sum=Number(scoreRatio)+Number(explore)+Number(cooperation)+Number(summary)+Number(discuss);
            if(valid){
              if(sum!=100){
                that.$message({
                  showClose: true,
                  message: '占比总和需是100哦^o^',
                  type: 'warning'
                });
              }else{
                let sourceLists=JSON.parse(JSON.stringify(that.sourceListsInfo));
                sourceLists.classList.name=that.classForm.name;
                sourceLists.classList.target=that.classForm.target;
                sourceLists.classList.duration=that.classForm.duration;
                sourceLists.classList.version=that.classForm.version;
                sourceLists.classList.scoreRatio=that.classForm.scoreRatio;
                sourceLists.classList.explore=that.classForm.explore;
                sourceLists.classList.cooperation=that.classForm.cooperation;
                sourceLists.classList.summary=that.classForm.summary;
                sourceLists.classList.discuss=that.classForm.discuss;
                that.SOURCE_LIST({val:sourceLists, key:this.guid});
                that.editVisible = false;
              }
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
    height: 100%;
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
