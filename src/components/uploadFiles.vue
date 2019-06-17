<template>
  <div class="uploadFilesContainer">
    <div v-if="prepareLessonsStatus != 'check'">
      <div class="file-upload">
        <el-upload
          class="upload-demo"
          ref="upload"
          list-type="text"
          multiple
          :show-file-list="false"
          :action="params.action"
          :data="params.data"
          :on-change="handleChange"
          :on-progress="uploadOnProgress"
          :on-success="UploadOnSuccess"
          :on-error="UploadOnError">
          <el-button slot="trigger" size="mini" type="primary">上传多媒体文件</el-button>
          <el-button slot="trigger" size="mini" type="primary" @click.stop="showEditor">自制文本素材</el-button>
          <el-button v-if=" userInfo.CourseType == 'EE' && type == 'item'" slot="trigger" size="mini" type="primary" @click.stop="DialogIdiilVisible = true;">添加英语课件</el-button>
        </el-upload>
      </div>
      <div class="file-list">
        <ul class="el-upload-list el-upload-list--text">
          <draggable class="list-group" :list="fileLists" :group="group" @change="log">
            <li tabindex="0" class="el-upload-list__item" v-for="(item,key) in fileLists" :key="key" :class="{'is-ready' : item.data.status=='ready', 'is-success' : item.data.status=='success'}" @click="handleFileEnlarge(item)">
              <a class="el-upload-list__item-name">
                <i class="el-icon-document"></i>{{ item.name }}
              </a>
              <label class="el-upload-list__item-status-label">
                <i class="el-icon-upload-success el-icon-circle-check"></i>
              </label>
              <i class="el-icon-close" @click.stop ="handleFileRemove(item,key)"></i>
            </li>
          </draggable>
        </ul>
      </div>
    </div>
    <div v-else class="file-list">
      <span size="mini">&nbsp;</span>
      <ul class="el-upload-list el-upload-list--text" v-if="fileLists.length>0">
          <li tabindex="0" class="el-upload-list__item" v-for="(item,key) in fileLists" :key="key" :class="{'is-ready' : item.data.status=='ready', 'is-success' : item.data.status=='success'}" @click="handleFileEnlarge(item)">
            <a class="el-upload-list__item-name">
              <i class="el-icon-document"></i>{{ item.name }}
            </a>
          </li>
      </ul>
    </div>
    <!-- 图片放大弹窗 -->
    <el-dialog
      width="60%"
      v-dialogDrag
      title="教参预览"
      :visible.sync="isEnlargeImage"
      :close-on-click-modal="false"
      append-to-body>
      <img v-if="fileType == 'image'" @click="isEnlargeImage = false" style="width:100%;" :src="enlargeFileSrc">
      <v-html-panel v-else-if="fileType == 'html'" :url.asyc="enlargeFileSrc"></v-html-panel>
      <iframe v-else-if="fileType == 'onLine'" frameborder=0  name="showHere" style="width: 100%;min-height: 540px;" :src="enlargeFileSrc"></iframe>
      <a v-else :href="enlargeFileSrc" style="color: #3a8ee6;">点击下载文件</a>
    </el-dialog>

    <!--富文本编辑器-->
    <el-dialog
      width="60%"
      v-dialogDrag
      title="文本素材编辑器"
      :visible.sync="DialogEditorisible"
      :close-on-click-modal="false"
      append-to-body
      v-if='DialogEditorisible'>
      <v-editor @sendEditorInfo="sendEditorInfo"></v-editor>
    </el-dialog>

    <!--IDIIL教材弹出框-->
    <el-dialog
      width="60%"
      v-dialogDrag
      title="IDIIL教材"
      :visible.sync="DialogIdiilVisible"
      :close-on-click-modal="false"
      append-to-body
      v-if='DialogIdiilVisible'>
      <el-dialog
        width="60%"
        v-dialogDrag
        title="预览界面"
        :visible.sync="innerVisible"
        append-to-body>
        <iframe  frameborder=0  name="showHere" width="100%" style="width: 100%;min-height: 540px;" :src="enlargeFileSrc"></iframe>
      </el-dialog>
      <select-class v-on:selectClassHandle="selectClassHandle" v-on:previewClassHandle="previewClassHandle"></select-class>
    </el-dialog>
  </div>
</template>
<script>
  import { mapState,mapMutations } from 'vuex'
  import draggable from 'vuedraggable'
  import {setStore,getStore} from '../config/publicMethod'
  import {uploadFile} from '../api/upload'
  import vEditor from './vEditor.vue'
  import {getEditorUrl} from '../api/exploration'
  import selectClass from './selectClassDom.vue'

    export default {
        props: ['group','fileLists','type'],
        data(){
          return{
            isEnlargeImage:false, //放大图片
            DialogEditorisible:false,
            DialogIdiilVisible:false,
            innerVisible:false,
            enlargeFileSrc:'', //放大图片地址
            fileType:'', //查看文件类型
            userInfo:JSON.parse(getStore('userInfo')),
            params: {
              action: "/api/file/upload",
              data: {
                "username":JSON.parse(getStore('userInfo')).userName
              }
            }
          }
        },

        components:{
          draggable,
          vEditor,
          selectClass
        },
        computed: {
          ...mapState([
            'prepareLessonsStatus'
          ])
        },
        methods:{
          /*
           *文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用
           * */
          handleChange(file, fileLists) {
            if (file.status == 'fail') {
              this.promptMessage( '图片上传出错，请刷新重试！', 'error');
            }
          },
          /*
          * 上传文件函数
          * */
          submitUpload() {
            this.$refs.upload.submit(); //上传文件 "/api/file/upload"
          },
          //文件上传时的钩子
          uploadOnProgress(event, file, fileList){
            this.progress = Math.floor(event.percent)
          },
          //文件上传成功时的钩子
          UploadOnSuccess(response, file, fileLists){
            this.promptMessage( '上传成功', 'success');
            if(file.raw.type.indexOf('image') != -1){
              this.fileLists.push({url:response.file, data:file, name:file.name, type:'image'});
            }else{
              this.fileLists.push({url:response.file, data:file, name:file.name, type:'text'});
            }
            this.sendFilesToParent()
          },

          //文件上传失败时的钩子
          UploadOnError(err, file, fileLists){
            console.log("————error————"+err);
          },
          //删除添加的文件
          handleFileRemove(file,i){
            this.$confirm('是否删除此文件？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.promptMessage( '删除成功', 'success');
              this.fileLists.splice(i, 1);
              this.sendFilesToParent()
            }).catch(() => {
                this.promptMessage( '已取消删除', 'info')
            });
          },
          /*
          * 放大图片
          * */
          handleFileEnlarge(item) { //放大图片
            let _url=item.url;
            if (_url) {
              this.fileType=item.type;
              this.enlargeFileSrc = _url;
              this.isEnlargeImage = !this.isEnlargeImage;
            }
          },
          /*
          * 列表之间拖拽触发事件
          * */
          log(evt){
            this.sendFilesToParent()
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
          *文件列表数据改变时，向父组件传参
          * */
          sendFilesToParent(){
            this.$emit('sendFilesInfo',this.fileLists)
          },
          /*
          * 资质文件编辑框出现
          * */
          showEditor(){
            this.DialogEditorisible = true;
          },
          /*
          * 获取子组件编辑框数据
          * */
          sendEditorInfo(name, content){
            let that = this;
            this.DialogEditorisible = false;
            let oName=name+".html";
            // 创建Blob对象
            //Blob 对象表示一个不可变、原始数据的类文件对象
            var formData = new FormData();
            var blob = new Blob([content], {"type":"text/html"});
            formData.append("file", blob, oName);
            formData.append("username",this.params.data.username);
            uploadFile(formData,function(response){
                let data = {
                  name:oName,
                  percentage: 100,
                  status: "success",
                  response:{
                    file:response.file
                  }
                };
              that.fileLists.push({url:response.file, data:data, name:data.name, type:'html'});
              that.sendFilesToParent();
            });

          },
          //选择完线上课程之后的处理逻辑
          selectClassHandle(param){
            this.DialogIdiilVisible=false;
            let data = {
              name:param.ChapterName+param.UID,
//              param:param,
              percentage: 100,
              status: "success",
              response:{
                file:param.ClassUrl
              }
            };
            this.fileLists.push({url:data.response.file, data:data, name:data.name,type:'onLine'});
            this.sendFilesToParent();
          },
          //点击预览按钮，预览课件
          previewClassHandle(param){
            this.enlargeFileSrc=param;
            this.innerVisible=true;
          }

        }
    }

</script>
<style scoped lang="less">
  .list-group{
    min-height: 45px;
  }

</style>
