<template>
  <el-card>
    <div class="rowBox cardBody">
      <el-form-item label="区块名称:"
                    :prop="'blockLists.' + index + '.name'"
                    :rules="moreRules.fieldSortName">
        <span v-if="editBlockFlag"><el-input v-model="blockList.name"></el-input></span>
        <span v-else>{{blockList.name}}</span>
      </el-form-item>
      <el-form-item label="教学目标:"
                    :prop="'blockLists.' + index + '.target'"
                    :rules="moreRules.fieldSortTarget">
        <span v-if="editBlockFlag"><el-input type="textarea" v-model="blockList.target"></el-input></span>
        <span v-else>{{blockList.target}}</span>
      </el-form-item>
      <el-form-item label="课程时长:">
        <span v-if="editBlockFlag"><el-input v-model="blockList.duration"></el-input></span>
        <span v-else>{{blockList.duration}}</span>
      </el-form-item>
      <el-form-item label="课程内容:">
        <div class="fileContainer">
            <span class="fileItem">
              <span>{{blockList.name}}</span>
            </span>
        </div>
      </el-form-item>
      <el-form-item class="btnBox">
        <el-button size="mini" @click.prevent="editBlock">编辑</el-button>
        <el-button size="mini" @click.prevent="removeResource(blockList)">删除</el-button>
      </el-form-item>
    </div>
  </el-card>
</template>
<script>
  import {setStore,getStore} from '../config/publicMethod'
  export default{
    props:['blockLists', 'blockList', 'index'],
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
            fieldSortName: [
              {required: true, message: '请输入教学名称', trigger: 'blur'},
              {validator: validBlockName, trigger: 'blur'}
            ],
            fieldSortTarget: [
              {required: true, message: '请输入教学目标', trigger: 'blur'},
              {validator: validBlockTarget, trigger: 'blur'}
            ]
          }
        }

      },
      mounted(){

      },
      methods:{
        //删除区块列表中的选中项
        removeResource(item) {
          var index = this.blockLists.indexOf(item);
          if (index !== -1) {
            this.blockLists.splice(index, 1)
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
