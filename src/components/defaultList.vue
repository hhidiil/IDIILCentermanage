<template>
  <el-card>
    <el-form :model="currentBlockList[0]" status-icon :rules="moreRules"  ref="moreRules" class="demo-ruleForm" :label-width="formLabelWidth">
      <div class="rowBox cardBody">
        <el-form-item label="区块名称:"
                      prop="name">
          <span v-if="editBlockFlag"><el-input v-model="currentBlockList[0].name"></el-input></span>
          <span v-else>{{currentBlockList[0].name}}</span>
        </el-form-item>
        <el-form-item label="教学目标:"
                      prop="target">
          <span v-if="editBlockFlag"><el-input type="textarea" v-model="currentBlockList[0].target"></el-input></span>
          <span v-else>{{currentBlockList[0].target}}</span>
        </el-form-item>
        <el-form-item label="课程时长:">
          <span v-if="editBlockFlag"><el-input v-model="currentBlockList[0].duration"></el-input></span>
          <span v-else>{{currentBlockList[0].duration}}</span>
        </el-form-item>
        <el-form-item label="课程内容:">
          <div class="fileContainer">
              <span class="fileItem">
                <span>{{currentBlockList[0].name}}</span>
              </span>
          </div>
        </el-form-item>
        <el-form-item class="btnBox">
          <el-button size="mini" @click.prevent="editBlock">编辑</el-button>
          <el-button size="mini" @click.prevent="removeResource(currentBlockList[0])">删除</el-button>
        </el-form-item>
      </div>
    </el-form>
  </el-card>
</template>
<script>
  import { mapState,mapMutations } from 'vuex'
  import {setStore,getStore} from '../config/publicMethod'
  export default{
    props:['blockLists'],
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
          editBlockFlag:false,
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
        formLabelWidth: '90px'
        }

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

          var index = this.blockLists.indexOf(item);
          if (index !== -1) {
            this.blockLists.splice(index, 1);

            if(this.blockLists.length>0){
              let cBlockKey=this.blockLists[0].key;
              let cBlockList=this.blockLists.filter((currentValue,index,arr) => {
                  return currentValue.key ==  this.blockLists[0].key;
                });
              this.CURRENT_BLOCK_KEY(cBlockKey);
              this.CURRENT_BLOCK_LIST(cBlockList);
            }else{
              this.CURRENT_BLOCK_KEY("");
              this.CURRENT_BLOCK_LIST([]);
            }

          }
        },
        editBlock(){
          this.editBlockFlag=true
        }
      }
  }
</script>
<style scoped lang="less">
  .btnBox{
    text-align: right;
  }
</style>
