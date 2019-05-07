<template>
  <div class="addClass">
    <section class="data_section">
        <el-row :gutter="20" class="mainContainer">
          <el-col :span="8">
              <custom-list v-if="sourceListsInfo.classList" :guid="guid"></custom-list>
              <el-card class="blockListCard">
                <div slot="header" class="clearfix">
                  <span>区块列表</span>
                  <el-button v-if="prepareLessonsStatus != 'check'" style="float: right; padding: 3px 0" type="text" @click="DialogIdiilVisible = true;">添加IDIIL区块</el-button>
                </div>
                <div v-if="prepareLessonsStatus != 'check'" class="list-group-box">
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
                          <span>{{blockList.name}}</span>
                          <span v-if="blockList.validate" style="color: #f56c6c;"><i class="icon iconfont el-icon-warn"></i></span>
                        </div>
                      </li>
                    </transition-group>
                  </draggable>
                </div>
                <div v-else class="list-group-box">
                    <ul>
                      <li
                        class="list-group-item blockListItem"
                        v-for="(blockList,index) in sourceListsInfo.blockLists"
                        :key="blockList.key"
                        :class="{activeBlockStyle: blockList.key==currentBlockKey}"
                        @click="showBlock(blockList.key)"
                      >
                        <div class="blockListInfo">
                          <span>{{blockList.name}}</span>
                          <span v-if="blockList.validate" style="color: #f56c6c;"><i class="icon iconfont el-icon-warn"></i></span>
                        </div>
                      </li>
                    </ul>
                </div>
              </el-card>
          </el-col>
          <el-col :span="16">
              <default-list v-if="currentBlockList[0]" :guid="guid"></default-list>
              <el-card v-else class="blockContainerCard">
                <div slot="header" class="clearfix">
                  <span>区块内容</span>
                </div>
                <div></div>
              </el-card>
          </el-col>
        </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <div v-if="prepareLessonsStatus != 'check'" class="btnBox">
            <el-button type="primary" size="small" @click="saveAllInfo('save')">保存</el-button>
            <el-button type="success" size="small" @click="saveAllInfo('upload')">上传</el-button>
          </div>
          <div v-else class="btnBox">
            <el-button type="primary" size="small" @click="saveAllInfo('check')">返回</el-button>
          </div>
        </el-col>
      </el-row>
    </section>

    <!--IDIIL教材弹出框-->
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
  import {getOnLineData, getTempCurriculum, saveTempCurriculum} from '../../api/exploration'
  import customList from '../../components/customList.vue'
  import defaultList from '../../components/defaultList.vue'
  import draggable from 'vuedraggable'
  let Base64 = require('js-base64').Base64;

  export default {
    props:[],
    data(){
      return {
        showDelete: -1,
        DialogIdiilVisible:false,
        formLabelWidth: '90px',
        userInfo:JSON.parse(getStore('userInfo')),
        guid:'',
        sourceLists:{}
      }
    },
    created(){
      this.getClassLists();
    },
    computed: {
      ...mapState([
        'sourceListsInfo',
        'currentBlockKey',
        'currentBlockList',
        'prepareLessonsStatus'
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
        console.log('------------change');
        this.sourceLists=val;
      }
    },
    components:{
      headTop,
      draggable,
      selectClass,
      customList,
      defaultList
    },
    mounted(){

    },
    methods: {
      ...mapMutations([
        'SOURCE_LIST',// 将 `this.classList()` 映射为 `this.$store.commit('increment')`//将 `this.blockList(amount)` 映射为 `this.$store.commit('incrementBy', amount)`
        'CURRENT_BLOCK_KEY',
        'CURRENT_BLOCK_LIST',
        'UPDATE_LESSIONS_STATUS'
    ]),
      //获取教材数据
      async getClassLists(){
        let routeParams=this.$route.query;
        console.log(routeParams);
        this.guid=routeParams.classId;
        this.UPDATE_LESSIONS_STATUS(routeParams.classType);
        if(routeParams.classType == "add"){
          let object=JSON.parse(getStore(`sourceLists-${this.guid}`));
          if(object){
            this.sourceLists=object;
          }else{
            this.sourceLists={
              classList:{
                classId: this.guid,
                name: "",
                datetime: "",
                target: "",
                duration: "",
                version: [],
                fileLists: [],
                commits: "",
                status: "doing"
              },
              blockLists:[]
            };
          }

        }else{
            let object=JSON.parse(getStore(`sourceLists-${this.guid}`));
            if(object){
              this.sourceLists=object;
            }else{
              let result = await getTempCurriculum({CurriculumID: this.guid}); //获取临时教材数据
              if (result.code == 200) {
                this.sourceLists=JSON.parse(Base64.decode(result.data[0].CurriculumnContent));
              }
            }
        }
        this.initBlcokShow();
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
              target: "",
              duration: '',
              validate: false,
              editFlag:false,
              fileLists: [],
              uid: new Date().getTime(),
              key: new Date().getTime() + item.index.toString()
            };
            this.sourceLists.blockLists.push(urlJson);
          })
        }
        this.initBlcokShow();
      },
      //初始化区块显示信息
      initBlcokShow(){
        console.log("所有的列表",this.sourceLists);
        if(this.sourceLists.blockLists.length>0){
          let cBlockKey=this.sourceLists.blockLists[0].key;
          let cBlockList=this.sourceLists.blockLists.filter((currentValue,index,arr) => {
            return currentValue.key ==  cBlockKey;
          });
          this.CURRENT_BLOCK_KEY(cBlockKey);
          this.CURRENT_BLOCK_LIST(cBlockList);
        }else{
          let cBlockKey = '';
          let cBlockList = [];
          this.CURRENT_BLOCK_KEY(cBlockKey);
          this.CURRENT_BLOCK_LIST(cBlockList);
        }
        this.SOURCE_LIST({val:this.sourceLists, key:this.guid});
      },
      //选择完线上课程之后的处理逻辑
      selectClassHandle(param){
        this.DialogIdiilVisible=false;
        this.getBlockNum(param);
        this.promptMessage('添加成功^_^', 'success');
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
      * 拖拽结束 重新排序并保存
      * */
      isDraggingHandle(){
        this.SOURCE_LIST({val:this.sourceLists, key:this.guid});
      },
      /*
      * 保存临时课程信息和上传课程判断
      * */
      saveAllInfo(type){
        if(type == "check"){
          this.$router.push({name:'classManagerList'})
        } else if(type == "save"){
          this.SOURCE_LIST({val:this.sourceLists, key:this.guid});
          this.saveClassLists('doing','');
        }else{
          if(this.sourceLists.classList.name == '' || this.sourceLists.classList.target == ''){
            this.promptMessage('上传课程名称和课程目标不能为空哦^o^', 'warning');
          }else{
            if(this.sourceLists.blockLists.length>0){
              this.sourceLists.blockLists.forEach((item, index) => {
                item.validate = false;
                if(item.name == '' || item.target==''){
                  item.validate = true;
                }
              });
              this.SOURCE_LIST({val:this.sourceLists, key:this.guid});
              let validatorsFail=this.sourceLists.blockLists.filter((currentValue,index,arr) => {
                return currentValue.validate == true
              });
              if(validatorsFail.length>0){
                this.promptMessage('上传区块名称和区块目标不能为空哦^o^', 'warning');
              }else{
                this.SOURCE_LIST({val:this.sourceLists, key:this.guid});
                this.saveClassLists('done');
              }
            }else{
              this.SOURCE_LIST({val:this.sourceLists, key:this.guid});
              this.saveClassLists('done');
            }
          }
        }
      },
      //保存临时教材数据
      async saveClassLists(status){
        let CurriculumName=this.sourceLists.classList.name;
        if(!CurriculumName){
          CurriculumName='';
        }
        let CurriculumnContent = Base64.encode(JSON.stringify(this.sourceLists));
        let inputJson = {
          CenterID: this.userInfo.centerId,
          CurriculumID: this.guid,
          CurriculumName: CurriculumName,
          CurriculumnContent: CurriculumnContent,
          UserID: this.userInfo.userId,
          Status: status
        };
        let result = await saveTempCurriculum(inputJson);
        if(result.code == 200){
          this.promptMessage('课程保存成功^_^', 'success');
          this.$router.push({name:'classManagerList'})
        }else{
          this.promptMessage('课程保存失败^o^', 'error');
        }
      },
      /*
      * 保存时的提示信息
      * */
      promptMessage(text, type){
        this.$message({
          showClose: true,
          message: text,
          type: type
        });
      }

    }
  }
</script>

<style scoped  lang="less" type="text/less">

  i{
    font-size: 16px;
  }
  .mainContainer{
    display: flex;
    align-items: stretch;
    .textForm{
      .el-form-item{
        margin: 0;
      }
    }
    .blockContainerCard{
      height: 100%;
    }
  }
  .btnBox{
    text-align: right;
  }

  .addClass{
    .data_section {
      margin-bottom: 40px;
      text-align: left;
      .el-row{
        margin-bottom: 25px;
        .blockListItem{
          border: 1px solid #cceff5;
          background: #fafcfd;
          padding: 10px;
          margin-bottom: 5px;
          color: #606266;
          cursor: pointer;
          position: relative;
          .blockListDelete{
            width: 35px;
            height: 100%;
            position: absolute;
            right: 0;
            top: 0;
            background: #b3d9ff;
            color: #06c;
            display: flex;
            align-items: center;
            justify-content: center;
            .el-icon-dustbin_icon{
              font-size: 22px;
            }
          }
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
