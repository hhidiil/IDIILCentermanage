<template>
  <div class="addClass">
    <section class="data_section">
        <el-row :gutter="20" class="mainContainer">
          <el-col :span="6">
              <custom-list v-if="sourceListsInfo.classList" :guid="guid"></custom-list>
          </el-col>
          <el-col :span="6">
            <el-card class="blockListCard">
              <div v-if="userInfo.CourseType=='MM'" slot="header" class="clearfix">
                <span>区块列表</span>
                <el-button v-if="userInfo.TeacherType == 'IDIIL' && prepareLessonsStatus != 'check'" style="float: right; padding: 3px 0" type="text" @click="DialogIdiilVisible = true;">添加IDIIL区块</el-button>
              </div>
              <div v-else slot="header" class="clearfix">
                <span>活动列表</span>
                <el-button v-if="userInfo.TeacherType == 'IDIIL' && prepareLessonsStatus != 'check'" style="float: right; padding: 3px 0" type="text" @click="DialogActivityVisible = true;">添加活动列表</el-button>
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
          <el-col :span="12">
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
            <el-button type="primary" size="small" @click="saveAllInfo('back')">取消并返回</el-button>
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

    <!--活动弹出框-->
    <el-dialog
      width="60%"
      v-dialogDrag
      title="IDIIL教材"
      :visible.sync="DialogActivityVisible"
      :close-on-click-modal="false"
      append-to-body
      v-if='DialogActivityVisible'>
      <el-form :model="activityForm" status-icon ref="moreRules" :label-width="formLabelWidth" @submit.native.prevent>
        <el-form-item label="活动名称:" prop="name">
          <el-input v-model="activityForm.name" auto-complete="off" @keyup.enter.native="saveActivityEdit"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button @click="DialogActivityVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveActivityEdit">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script type="text/ecmascript-6">
  import { mapState,mapMutations } from 'vuex'
  import headTop from '../../components/headTop.vue'
  import selectClass from '../../components/selectClassDom.vue'
  import {setStore,getStore,removeStore} from '../../config/publicMethod'
  import {getOnLineData, getTempCurriculum, saveTempCurriculum} from '../../api/exploration'
  import customList from '../../components/customList.vue'
  import defaultList from '../../components/defaultList.vue'
  import draggable from 'vuedraggable'
  let Base64 = require('js-base64').Base64;

  export default {
    props:[],
    data(){
      return {
        DialogIdiilVisible:false,
        DialogActivityVisible:false,
        formLabelWidth: '90px',
        userInfo:JSON.parse(getStore('userInfo')),
        guid:'',
        sourceLists:{},
        activityForm:{
          name:''
        }
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
      },
      itemName(){
        if(this.userInfo.CourseType == 'EE'){
          return '活动'
        }else{
          return '区块'
        }
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
      const Wh = $(window).height();
      $(".list-group-box").css("max-height",(Wh-150-100)+'px');
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
        this.guid=routeParams.classId;
        this.UPDATE_LESSIONS_STATUS(routeParams.classType);
        if(routeParams.classType == "add"){
          let object=JSON.parse(getStore(`sourceLists-${this.guid}`));
          if(object){
            this.sourceLists=object;
          }else{
            this.sourceLists={
              classList:{
                name: "",
                target: "",
                duration: "",
                version: [],
                fileLists: [],
                scoreRatio:60, //得分占比
                explore:10, //探究
                cooperation:10, //协作
                summary:10, //总结
                discuss:10 //讨论

              },
              blockLists:[]
            };
          }

        }else{
            let object=JSON.parse(getStore(`sourceLists-${this.guid}`));
            if(object){
              this.sourceLists=object;
            }else{
              let CourseType=this.userInfo.CourseType;
              let ClassProgram=this.userInfo.ClassProgram;
              let jsonInfo={
                CurriculumID: this.guid,
                CourseType:CourseType,
                ClassProgram:ClassProgram
              };
              let result = await getTempCurriculum(jsonInfo); //获取临时教材数据
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
        if(!result2){
          this.promptMessage('该章节暂无区块，换个章节试试^o^','warning');
          return;
        }
        result2=JSON.parse(Base64.decode(result2));
        if(result2.length>0){
          result2.forEach(item => {
            let urlJson= {
              name: param.selectUnitName + item.id,
              blockID: item.id,
              target: "",
              task: [],
              duration: '',
              validate: false,
              editFlag:false,
              fileLists: [],
              scoreRatio:60, //得分占比
              explore:10, //探究
              cooperation:10, //协作
              summary:10, //总结
              discuss:10, //讨论
              param:param,
              uid: new Date().getTime(),
              key: new Date().getTime() + item.index.toString()
            };
            this.sourceLists.blockLists.push(urlJson);
          });
          this.promptMessage('添加成功^_^', 'success');
          this.initBlcokShow();
        }

      },
      getActivity(param){
        let urlJson= {
          name: param,
          target: "",
          task: [],
          duration: '',
          validate: false,
          editFlag:false,
          fileLists: [],
          scoreRatio:60, //得分占比
          explore:10, //探究
          cooperation:10, //协作
          summary:10, //总结
          discuss:10, //讨论
          param:param,
          uid: new Date().getTime(),
          key: new Date().getTime() + this.sourceLists.blockLists.length.toString()
        };
        this.sourceLists.blockLists.push(urlJson);
        this.promptMessage('添加成功^_^', 'success');
        this.initBlcokShow();
      },
      //初始化区块显示信息
      initBlcokShow(){
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
      },
      //创建好区块之后的处理逻辑
      saveActivityEdit(){
        let param=this.activityForm.name;
        if(param.length == 0){
          this.promptMessage('活动名称不能为空哦^o^', 'warning');
          return
        }
        this.activityForm.name="";
        this.DialogActivityVisible = false;
        this.getActivity(param);
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
        } else if(type == "back"){
          removeStore(`sourceLists-${this.guid}`);
          this.$router.push({name:'classManagerList'});
        } else {

          if(this.sourceLists.classList.name == '' || this.sourceLists.classList.target == '' || this.sourceLists.classList.scoreRatio == ''){
            this.promptMessage('课程名称、课程目标以及各占比不能为空哦^o^', 'warning');
          }else{
            if(this.sourceLists.blockLists.length>0){
              this.sourceLists.blockLists.forEach((item, index) => {
                item.validate = false;
                if(item.name == '' || item.target=='' || item.scoreRatio==''){
                  item.validate = true;
                }
              });
              this.SOURCE_LIST({val:this.sourceLists, key:this.guid});
              let validatorsFail=this.sourceLists.blockLists.filter((currentValue,index,arr) => {
                return currentValue.validate == true
              });
              if(validatorsFail.length>0){
                  this.promptMessage(`${this.itemName}名称、${this.itemName}目标以及各占比不能为空哦^o^`, 'warning');

              }else{
                this.SOURCE_LIST({val:this.sourceLists, key:this.guid});
                this.saveClassLists('done');
              }
            }else{
                this.promptMessage(`需要先添加${this.itemName}哦^o^`, 'warning');

            }
          }
        }
      },
      //保存临时教材数据
      async saveClassLists(status){
        let CurriculumName=this.sourceLists.classList.name;
        let SourceType='IDIIL';
        let CourseType=this.userInfo.CourseType;
        let ClassProgram=this.userInfo.ClassProgram;
        if(!CurriculumName){
          CurriculumName='';
        }
        if(this.userInfo.TeacherType != 'IDIIL'){
          SourceType='CUSTOM';
        }
        let CurriculumnContent = Base64.encode(JSON.stringify(this.sourceLists));
        let inputJson = {
          CenterID: this.userInfo.centerId,
          CurriculumID: this.guid,
          CurriculumName: CurriculumName,
          CurriculumnContent: CurriculumnContent,
          UserID: this.userInfo.userId,
          SourceType: SourceType,
          CourseType: CourseType,
          ClassProgram: ClassProgram,
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

  .list-group-box::-webkit-scrollbar {/*滚动条整体样式*/
    width: 4px;     /*高宽分别对应横竖滚动条的尺寸*/
    height: 1px;
  }
  .list-group-box::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
    background: #96C2F1;
  }
  .list-group-box::-webkit-scrollbar-track {/*滚动条里面轨道*/
    -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
    border-radius: 10px;
    background: #EDEDED;
  }

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
    .blockListCard,.blockContainerCard{
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
          border-radius: 4px;
          padding: 10px;
          margin-bottom: 5px;
          color: #606266;
          cursor: pointer;
          position: relative;
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
          overflow: auto;
          .list-group {
            min-height: 20px;
            padding: 0 2px;
          }
        }
        .activeBlockStyle{
          border:1px solid #96C2F1;
          background-color:#EFF7FF;
        }
      }
    }
  }
.el-progress-bar{
  width: 80%;
}
</style>
