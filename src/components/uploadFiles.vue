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
          <el-button slot="trigger" size="mini" type="primary">上传文件</el-button>
        </el-upload>
      </div>
      <div class="file-list">
        <ul class="el-upload-list el-upload-list--text">
          <draggable class="list-group" :list="fileLists" :group="group" @change="log">
            <li tabindex="0" class="el-upload-list__item" v-for="(item,key) in fileLists" :key="key" :class="{'is-ready' : item.data.status=='ready', 'is-success' : item.data.status=='success'}" @click="handleFileEnlarge(item.url)">
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
          <li tabindex="0" class="el-upload-list__item" v-for="(item,key) in fileLists" :key="key" :class="{'is-ready' : item.data.status=='ready', 'is-success' : item.data.status=='success'}" @click="handleFileEnlarge(item.url)">
            <a class="el-upload-list__item-name">
              <i class="el-icon-document"></i>{{ item.name }}
            </a>
          </li>
      </ul>
    </div>
    <!-- 放大弹窗 -->
    <el-dialog
      width="60%"
      v-dialogDrag
      title="教参预览"
      :visible.sync="isEnlargeImage"
      :close-on-click-modal="false"
      append-to-body>
        <img @click="isEnlargeImage = false" style="width:100%;" :src="enlargeImage">
    </el-dialog>
  </div>
</template>
<script>
  import { mapState,mapMutations } from 'vuex'
  import draggable from 'vuedraggable'
  import {setStore,getStore} from '../config/publicMethod'
    export default {
        props: ['group','fileLists'],
        data(){
          return{
            isEnlargeImage:false, //放大图片
            enlargeImage:'', //放大图片地址
            params: {
              action: "/api/file/upload",
              data: {
                "username":JSON.parse(getStore('userInfo')).userName
              }
            }
          }
        },

        components:{
          draggable
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
            console.log("——————————change——————————");
            if (file.status == 'ready') {
              console.log("ready");
            }
            else if (file.status == 'fail') {
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
            console.log("——————————progress——————————");
            this.progress = Math.floor(event.percent)
          },
          //文件上传成功时的钩子
          UploadOnSuccess(response, file, fileLists){
            console.log("——————————success——————————");
              this.promptMessage( '上传成功', 'success');
              this.fileLists.push({url:response.file, data:file, name:file.name});
              this.sendFilesToParent()
          },

          //文件上传失败时的钩子
          UploadOnError(err, file, fileLists){
            console.log("——————————error——————————");
            console.log(err);
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
          handleFileEnlarge(_url) { //放大图片
            if (_url) {
              this.enlargeImage = _url;
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
<style scoped lang="less">
  .list-group{
    min-height: 45px;
  }
</style>
