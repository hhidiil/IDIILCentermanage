<template>
  <div class="addClass">

    <section class="data_section">
        <el-row :gutter="20" class="mainContainer">
          <el-col :span="8">
              <el-card class="classListCard">
                <custom-list></custom-list>
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
                          <span>{{blockList.name}}</span>
                          <span v-if="blockList.validate" style="color: #f56c6c;"><i class="icon iconfont el-icon-warn"></i></span>
                        </div>
                      </li>
                    </transition-group>
                  </draggable>
                </div>
              </el-card>
          </el-col>
          <el-col :span="16">
            <el-card class="blockContainerCard">
              <div slot="header" class="clearfix">
                <span>区块内容</span>
              </div>
              <div v-if="currentBlockList[0]">
                <default-list></default-list>
              </div>
            </el-card>
          </el-col>
        </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <div class="btnBox">
            <el-button type="primary" size="small" @click="saveAllInfo('save')">保存</el-button>
            <el-button type="success" size="small" @click="saveAllInfo('upload')">上传</el-button>
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
  import {getOnLineData} from '../../api/exploration'
  import customList from '../../components/customList.vue'
  import defaultList from '../../components/defaultList.vue'
  import draggable from 'vuedraggable'
  let Base64 = require('js-base64').Base64;

  export default {
    props:[],
    data(){
      return {
        DialogIdiilVisible:false,
        formLabelWidth: '90px',
        sourceLists:{}
      }
    },
    created(){
      //在页面加载时读取localStorage里的状态信息
      const object=JSON.parse(JSON.stringify(this.sourceListsInfo));
      this.sourceLists=JSON.parse(getStore("sourceLists")) || object;
      if(this.sourceLists.classList.classId == ""){
        this.sourceLists.classList.classId=this.createGuid();
      }

      this.initBlcokShow();
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
        'CURRENT_BLOCK_LIST'
    ]),
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
              type: "class",
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
        this.SOURCE_LIST(this.sourceLists);
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
        this.SOURCE_LIST(this.sourceLists);
      },
      /*
      * 保存所有编辑信息
      * */
      saveAllInfo(){
        if(this.sourceLists.classList.name == '' || this.sourceLists.classList.target == ''){
          this.promptMessage('课程名称和课程目标不能为空哦^o^', 'error');
        }else{
          if(this.sourceLists.blockLists.length>0){
            this.sourceLists.blockLists.forEach((item, index) => {
                item.validate = false;
                if(item.name == '' || item.target==''){
                  item.validate = true;
                }
            });
            this.SOURCE_LIST(this.sourceLists);
            let validatorsFail=this.sourceLists.blockLists.filter((currentValue,index,arr) => {
              return currentValue.validate == true
            });
             if(validatorsFail.length>0){
               this.promptMessage('区块名称和区块目标不能为空哦^o^', 'error');
             }else{
               setStore("sourceLists",this.sourceLists);
               this.promptMessage('保存成功^_^', 'success');
             }
          }else{
            setStore("sourceLists",this.sourceLists);
            this.promptMessage('保存成功^_^', 'success');
          }
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
      },
      /*
       * 创建guid
       * */
      createGuid() {
        var s = [];
        var hexDigits = "0123456789abcdef";
        for (var i = 0; i < 36; i++) {
          s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
        }
        s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
        s[8] = s[13] = s[18] = s[23] = "-";

        var uuid = s.join("");
        return uuid;
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
        .classListCard{
          margin-bottom: 20px;
          .button-group{
            text-align: right;
          }
          .el-tag {
            margin-right: 10px;
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
