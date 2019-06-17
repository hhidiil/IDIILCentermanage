<template>
  <section class="blockContainerCard">
    <el-card class="blockContainerCard">
      <div slot="header" class="clearfix">
        <span>{{itemName}}内容</span>
        <span v-if="prepareLessonsStatus != 'check'">
            <el-button style="float: right; padding: 3px 0" type="text" @click.prevent="removeResource(currentBlockList[0])">删除</el-button>
            <el-button style="float: right; padding: 3px 0; margin-right: 15px" type="text" @click.prevent="editBlock(currentBlockList[0])">编辑</el-button>
        </span>
      </div>
      <div>
        <el-form  class="textForm" label-width="formLabelWidth">
          <el-form-item :label="itemName+'名称:'">
            <span>{{currentBlockList[0].name}}</span>
          </el-form-item>
          <el-form-item label="教学目标:">
            <span>{{currentBlockList[0].target}}</span>
          </el-form-item>
          <el-form-item label="探究任务:">
            <span v-for="(tag,index) in currentBlockList[0].task" :key="index" style="margin-right: 15px;">
              {{index+1}}、{{tag}}
            </span>
          </el-form-item>
          <el-form-item :label="itemName+'时长:'">
            <span>{{currentBlockList[0].duration}}</span>
          </el-form-item>
          <!--<el-form-item :label="itemName+'内容:'">-->
            <!--<span>{{currentBlockList[0].name}}</span>-->
          <!--</el-form-item>-->
          <el-form-item label="得分占比:">
              <el-progress v-if="currentBlockList[0].scoreRatio" :percentage="Number(currentBlockList[0].scoreRatio)"></el-progress>
          </el-form-item>
          <el-form-item label="探究占比:">
            <el-progress v-if="currentBlockList[0].explore" :percentage="Number(currentBlockList[0].explore)"></el-progress>
          </el-form-item>
          <el-form-item label="协作占比:">
            <el-progress v-if="currentBlockList[0].cooperation" :percentage="Number(currentBlockList[0].cooperation)"></el-progress>
          </el-form-item>
          <el-form-item label="总结占比:">
            <el-progress v-if="currentBlockList[0].summary" :percentage="Number(currentBlockList[0].summary)"></el-progress>
          </el-form-item>
          <el-form-item label="讨论占比:">
            <el-progress v-if="currentBlockList[0].discuss" :percentage="Number(currentBlockList[0].discuss)"></el-progress>
          </el-form-item>
          <el-form-item label="教学参考:">
            <upload-files :group="'people'" :fileLists="currentBlockList[0].fileLists" :type="'item'" @sendFilesInfo="sendFilesInfo"></upload-files>
          </el-form-item>
        </el-form>
      </div>
    </el-card>

    <!-- 区块编辑弹出框 -->
    <el-dialog
      :title="'编辑'+itemName+'内容'"
      v-dialogDrag
      :visible.sync="editVisible"
      width="50%">
      <el-form :model="blockForm" status-icon :rules="moreRules"  ref="moreRules" :label-width="formLabelWidth">
          <el-form-item :label="itemName+'名称:'" prop="name">
            <el-input v-model="blockForm.name" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="教学目标:" prop="target">
            <el-input type="textarea" v-model="blockForm.target" rows="3" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="探究任务:">
            <add-tags :tagType="'添加任务'" :dynamicTags="blockForm.task"></add-tags>
          </el-form-item>
          <el-form-item :label="itemName+'时长:'">
            <el-input v-model="blockForm.duration" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="得分占比:" prop="scoreRatio">
            <el-input v-model="blockForm.scoreRatio" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="探究占比:" prop="explore">
            <el-input v-model="blockForm.explore" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="协作占比:" prop="cooperation">
            <el-input v-model="blockForm.cooperation" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="总结占比:" prop="summary">
            <el-input v-model="blockForm.summary" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="讨论占比:" prop="discuss">
            <el-input v-model="blockForm.discuss" auto-complete="off"></el-input>
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
  import {getStore} from '../config/publicMethod'
  import uploadFiles from './uploadFiles.vue'
  import addTags from './addTags.vue'
  export default{
      props:['guid'],
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
        let validClassRatio=(rule, value, callback)=>{
          let reg = /^(?:0|[1-9][0-9]?|100)$/;
          if(!reg.test(Number(value))){
            callback(new Error('占比需是0到100之间的正整数，例如：25'))
          }else {
            if(value.length>1){
              if(value==0){
                this.blockForm[rule.field]=0;
              }else{
                var regex=/^[0]+/;
                this.blockForm[rule.field]=this.blockForm[rule.field].replace(regex,"");
              }
            }
            callback();
          }

        }
        return{
            userInfo:JSON.parse(getStore('userInfo')),
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
            blockForm: {
              name: '',
              target: '',
              task: [],
              duration: '',
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
          'currentBlockKey',
          'currentBlockList',
          'prepareLessonsStatus'
        ]),
        itemName(){
          if(this.userInfo.CourseType == 'EE'){
            return '活动'
          }else{
            return '区块'
          }
        }
      },
      filters:{
        ratioUnit: function (value) {
          if (!value) return '';
          return value + '%';
        }
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
              this.SOURCE_LIST({val:sourceLists, key:this.guid});
              this.CURRENT_BLOCK_KEY(cBlockKey);
              this.CURRENT_BLOCK_LIST(cBlockList);
            }else{
              sourceLists.blockLists.splice(0, 1);
              this.SOURCE_LIST({val:sourceLists, key:this.guid});
              this.CURRENT_BLOCK_KEY("");
              this.CURRENT_BLOCK_LIST([]);
            }
        },
        /*
        * 初始化弹框数据
        * */
        editBlock(items){
          var item=JSON.parse(JSON.stringify(items));
          this.blockForm = {
            name: item.name,
            target: item.target,
            task: item.task,
            duration: item.duration,
            scoreRatio:item.scoreRatio,
            explore:item.explore,
            cooperation:item.cooperation,
            summary:item.summary,
            discuss:item.discuss
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
          let that=this;
          this.$refs[formName].validate((valid) => {
            let scoreRatio=that.blockForm.scoreRatio;
            let explore=that.blockForm.explore;
            let cooperation=that.blockForm.cooperation;
            let summary=that.blockForm.summary;
            let discuss=that.blockForm.discuss;
            let sum=Number(scoreRatio)+Number(explore)+Number(cooperation)+Number(summary)+Number(discuss);
            if(valid){
              if(sum!=100){
                that.$message({
                  showClose: true,
                  message: '占比总和需是100哦^o^',
                  type: 'warning'
                });
              }else{
                let currList=JSON.parse(JSON.stringify(that.currentBlockList));
                currList[0].name=that.blockForm.name;
                currList[0].target=that.blockForm.target;
                currList[0].task=that.blockForm.task;
                currList[0].duration=that.blockForm.duration;
                currList[0].scoreRatio=that.blockForm.scoreRatio;
                currList[0].explore=that.blockForm.explore;
                currList[0].cooperation=that.blockForm.cooperation;
                currList[0].summary=that.blockForm.summary;
                currList[0].discuss=that.blockForm.discuss;

                let sourceLists=JSON.parse(JSON.stringify(that.sourceListsInfo));
                sourceLists.blockLists.forEach((item) => {
                    if(item.key == that.currentBlockKey){
                    item.name=that.blockForm.name;
                    item.target=that.blockForm.target;
                    item.task=that.blockForm.task;
                    item.duration=that.blockForm.duration;
                    item.scoreRatio=that.blockForm.scoreRatio;
                    item.explore=that.blockForm.explore;
                    item.cooperation=that.blockForm.cooperation;
                    item.summary=that.blockForm.summary;
                    item.discuss=that.blockForm.discuss;
                  }
                })
                that.CURRENT_BLOCK_LIST(currList);
                that.SOURCE_LIST({val:sourceLists, key:this.guid});
                that.editVisible = false;
              }

            }else{
                console.log('error submit!!');
            }
          })
        },
        /*
         * 提示信息
         * */
        promptMessage(text, type){
          this.$message({
            showClose: true,
            message: text,
            type: type
          });
        },
        /*
        * 从子组件接收参数并触发该事件
        * */
        sendFilesInfo(data){
          let currList=JSON.parse(JSON.stringify(this.currentBlockList));
          currList[0].fileLists=data;
          let sourceLists=JSON.parse(JSON.stringify(this.sourceListsInfo));
          sourceLists.blockLists.forEach((item) => {
              if(item.key == this.currentBlockKey){
              item.fileLists=data;
            }
          })
          this.CURRENT_BLOCK_LIST(currList);
          this.SOURCE_LIST({val:sourceLists, key:this.guid});
        }

      }
  }
</script>
<style scoped lang="less">
  .blockContainerCard{
    height: 100%;
  }
  .btnBox{
    text-align: right;
  }
  .file-li-box{
    display: flex;
    .file-li-delete{
      width: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }
  }
</style>
