<template>
  <div class="addClass">

    <section class="data_section">
        <el-row :gutter="20">
          <el-col :span="8">
              <el-card class="classListCard">
                <el-form :model="sourceListsInfo.classList" status-icon :rules="classRules" ref="classForm" :label-width="formLabelWidth" class="demo-ruleForm">
                  <div class="rowBox cardTop">
                      <el-form-item label="课程名称:" prop="name">
                        <span v-if="editClassFlag"><el-input v-model="sourceListsInfo.classList.name" auto-complete="off"></el-input></span>
                        <span v-else>{{sourceListsInfo.classList.name}}</span>
                      </el-form-item>
                      <el-form-item label="课程目标:" prop="target">
                          <span v-if="editClassFlag"><el-input type="textarea" v-model="sourceListsInfo.classList.target" auto-complete="off"></el-input></span>
                          <span v-else>{{sourceListsInfo.classList.target}}</span>
                      </el-form-item>
                      <el-form-item label="课程时长:" prop="duration">
                          <span v-if="editClassFlag"><el-input v-model="sourceListsInfo.classList.duration" auto-complete="off"></el-input></span>
                          <span v-else>{{sourceListsInfo.classList.duration}}</span>
                      </el-form-item>
                      <el-form-item label="对应版本:" prop="version">
                          <span v-if="editClassFlag"><el-input v-model="sourceListsInfo.classList.version" auto-complete="off"></el-input></span>
                          <span v-else>{{sourceListsInfo.classList.version}}</span>
                      </el-form-item>
                      <div class="button-group">
                        <span>
                            <el-button v-if="editClassFlag" size="mini" @click="saveClass('classForm')">保存</el-button>
                            <el-button v-else size="mini" @click="editClass">编辑</el-button>
                        </span>
                      </div>

                  </div>
                </el-form>
              </el-card>
              <el-card class="blockListCard">
                <div slot="header" class="clearfix">
                  <span>区块列表</span>
                  <el-button style="float: right; padding: 3px 0" type="text" @click="DialogIdiilVisible = true;">添加IDIIL区块</el-button>
                </div>
                <div class="list-group-box">
                  <draggable
                    class="list-group"
                    tag="ul"
                    v-model="sourceListsInfo.blockLists"
                    v-bind="dragOptions"
                    @start="isDragging = true"
                    @end="isDraggingHandle"
                  >
                    <transition-group type="transition" name="flip-list">
                      <li
                        class="list-group-item blockListItem"
                        v-for="(blockList,index) in sourceListsInfo.blockLists"
                        :key="blockList.key"
                        :class="{activeBlockStyle: blockList.key==currentBlockKey}"
                        @click="showBlock(blockList.key)"

                      >
                        <div class="blockListInfo">
                          {{blockList.name}}
                          <!--<span v-if="blockList.validate" class="validateTag"><i class="icon iconfont el-icon-warn"></i></span>-->
                        </div>
                      </li>
                    </transition-group>
                  </draggable>
                </div>
              </el-card>
          </el-col>
          <el-col :span="16">
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span>区块内容</span>
              </div>
              <div v-if="currentBlockList[0]">
                <default-list></default-list>

              </div>

            </el-card>
          </el-col>
        </el-row>
    </section>
    <el-dialog
      width="60%"
      v-dialogDrag
      title="IDIIL教材"
      :visible.sync="DialogIdiilVisible"
      :close-on-click-modal="false"
      append-to-body
      v-if='DialogIdiilVisible'>
      <select-class v-on:selectClassHandle="selectClassHandle"></select-class>
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
  import { mapState,mapMutations } from 'vuex'
  import headTop from '../../components/headTop.vue'
  import selectClass from '../../components/selectClassDom.vue'
  import classData from '../../data/classlist'
  import {getNowFormatDate,filterWebUrl,toJson} from '../../config/methods'
  import {setStore,getStore} from '../../config/publicMethod'
  import {uploadFile} from '../../api/upload'
  import {addClassListInfo,updateClassListInfo} from '../../api/classes'
  import {getAllClassesOfCenter} from '../../api/manage'
  import {getOnLineData} from '../../api/exploration'
  import customList from '../../components/customList.vue'
  import defaultList from '../../components/defaultList.vue'
  import draggable from 'vuedraggable'
  let Base64 = require('js-base64').Base64;

  export default {
    props:['data','type','addFlag'],
    data(){
      let validClassName=(rule, value, callback)=>{
        if(!value){
          return callback(new Error('课程名称不能为空'))
        }
        callback();
      };
      let validClassTarget=(rule, value, callback)=>{
        if(!value){
          return callback(new Error('课程目标不能为空'))
        }
        callback();
      };
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
      };
      let validClassVersion=(rule, value, callback)=>{
        callback()
      };

      return {
        studentData: [],
        studentAllData: [],//学生的总列表，一直不变 在重置的时候需要
        direction:'',//学生分组方向
        activeNames: ['0'], //控制面板折叠展开
        controlFoldFlag:false, //展开折叠按钮显示
        innerDialogVisible:false,
        DialogIdiilVisible:false,
        formLabelWidth: '90px',
        addNewGroupName:'',
        classOptions:[],
        editClassFlag:false,
        sourceLists:{},
        SelectedIndex: 0, //检测的form的索引
        classRules:{
          name:[
            {required:true,message:'请输入课程名称',trigger:'blur'},
            { validator: validClassName, trigger: 'blur' }
          ],
          target:[
            {required:true,message:'请输入课程目标',trigger:'blur'},
            { validator: validClassTarget, trigger: 'blur' }
          ],
          duration:[
            { validator: validClassDuration, trigger: 'blur' }
          ],
          version:[
            { validator: validClassVersion, trigger: 'blur' }
          ]
        }

      }
    },
    created(){
      //在页面加载时读取localStorage里的状态信息
      const object2 = Object.assign({}, this.sourceListsInfo);
      console.log(object2);
      const object=JSON.parse(JSON.stringify(this.sourceListsInfo));
      this.sourceLists=JSON.parse(getStore("sourceLists")) || object;
      this.SOURCE_LIST( this.sourceLists );


      if(this.sourceLists.classList.name==""){
        this.editClassFlag=true;
      }

    },
    computed: {
      ...mapState([
        'sourceListsInfo',
        'currentBlockKey',
        'currentBlockList'
      ]),
      dragOptions() {
        return {
          animation: 0,
          group: "description",
          disabled: false,
          ghostClass: "ghost"
        };
      }

    },
    watch:{
      //当监听的属性值变化的时候 会执行对应的处理逻辑
      '$route' (to, from) {
        console.error("watch 监听数据--$route--22-》",to,from)
      },
      sourceListsInfo(val, oldVal){
        console.log('------------change')
        this.sourceLists=val;
      }

    },

    components:{
      headTop,
      draggable,
      selectClass,
      defaultList
    },
    mounted(){

    },
    methods: {
      ...mapMutations([
        'SOURCE_LIST',// 将 `this.classList()` 映射为 `this.$store.commit('increment')`//将 `this.blockList(amount)` 映射为 `this.$store.commit('incrementBy', amount)`
        'CURRENT_BLOCK_KEY',
        'CURRENT_BLOCK_LIST'
    ]),
      async getclassesList(){
        let result1 = await getAllClassesOfCenter({centerId:'002'});
        console.log("班级列表--------------------->",result1);
        if(result1.code == 200){
          this.classOptions = result1.data;
        }
      },

      //获取课程区块列表
      async getBlockNum(param){
        const onlinePra={FileName:'Math--'+param.GlobalID,Action:'get',Content:'',Function:'OnlineMathBaseData'};
        let result2=await getOnLineData(onlinePra);
        result2=JSON.parse(Base64.decode(result2));

        if(result2.length>0){
          result2.forEach(item => {
            let urlJson= {
              name: param.selectUnitName + item.id,
              target: "2222",
              duration: '100分钟',
              type: "class",
              validate: false,
              editFlag:false,
              uid: new Date().getTime(),
              key: new Date().getTime() + item.index.toString()
            };
            this.sourceLists.blockLists.push(urlJson);
          })
        }


        if(this.sourceLists.blockLists.length>0){
          let cBlockKey=this.sourceLists.blockLists[0].key;
          let cBlockList=this.sourceLists.blockLists.filter((currentValue,index,arr) => {
            return currentValue.key ==  cBlockKey;
          });
          this.SOURCE_LIST(this.sourceLists);
          this.CURRENT_BLOCK_KEY(cBlockKey);
          this.CURRENT_BLOCK_LIST(cBlockList);
        }

      },

      //选择完线上课程之后的处理逻辑
      selectClassHandle(param){
        this.DialogIdiilVisible=false;
        this.getBlockNum(param);
        this.$message({'type':'success',message:"添加成功！"});

      },

      editClass(formName){
        this.editClassFlag=true;
      },
      /*
      * 保存课程区块
      * */
      saveClass(formName){
        this.$refs[formName].validate((valid)=>{
          if(valid){
            alert('submit!');
            this.editClassFlag=false;
            console.log(this.sourceLists);
            this.SOURCE_LIST(this.sourceLists);
          }else{
            console.log('error submit!!');
            return false
          }
        });
      },

    /*
    * 显示选中的区块
    * */
      showBlock(key){
        let cBlockKey=key;
        let cBlockList=this.sourceLists.blockLists.filter((currentValue,index,arr) => {
          return currentValue.key == cBlockKey
        });
        this.CURRENT_BLOCK_KEY(cBlockKey);
        this.CURRENT_BLOCK_LIST(cBlockList);

      },
      /*
      * 拖拽结束 重新排序
      * */
      isDraggingHandle(){
        this.SOURCE_LIST(this.sourceLists);
      }
    }
  }
</script>

<style scoped  lang="less" type="text/less">

  i{
    font-size: 16px;
    padding-left: 15px;
  }

  .addClass{
    .data_section {
      margin-bottom: 40px;
      text-align: left;
      .el-row{
        margin-bottom: 25px;
        .classListCard{
          margin-bottom: 20px;
          .button-group{
            text-align: right;
          }
        }

        .blockListItem{
          border: 1px solid #cceff5;
          background: #fafcfd;
          padding: 10px;
          margin-bottom: 5px;
          color: #606266;
          cursor: pointer;

        }

        .flip-list-move {
          transition: transform 0.5s;
        }
        .no-move {
          transition: transform 0s;
        }
        .ghost {
          opacity: 0.5;
          background: #c8ebfb;
        }
        .list-group-box{
          max-height:450px;
          overflow: auto;
          .list-group {
            min-height: 20px;

          }
        }


        .activeBlockStyle{
          border:1px solid #96C2F1;
          background-color:#EFF7FF;
        }

      }

    }
  }




</style>
