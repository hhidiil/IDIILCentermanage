<template>
  <div class="uploadFilesContainer">
    <div class="file-upload">

      <el-upload
        class="upload-demo"
        ref="upload"
        list-type="text"
        :show-file-list="false"
        action="/api/file/upload"
        multiple
        :on-change="handleChange"
        :on-progress="uploadOnProgress"
        :on-success="UploadOnSuccess"
        :on-error="UploadOnError">
        <el-button slot="trigger" size="mini" type="primary">上传文件</el-button>
        <!--<el-button style="margin-left: 10px;" size="mini" type="success" @click="submitUpload">上传到服务器</el-button>-->
      </el-upload>
    </div>
    <div class="file-list">
        <ul class="el-upload-list el-upload-list--text">
          <draggable class="list-group" :list="fileLists" :group="group" @change="log">
            <li tabindex="0" class="el-upload-list__item" v-for="(item,key) in fileLists" :key="key" :class="{'is-ready' :item.status == 'ready' , 'is-success' :item.status == 'success'}">
              <a class="el-upload-list__item-name">
                <i class="el-icon-document"></i>{{ item.name }}
              </a>
              <label class="el-upload-list__item-status-label">
                <i class="el-icon-upload-success el-icon-circle-check"></i>
              </label>
              <i class="el-icon-close" @click="handleFileRemove(item,key)"></i>
              <i class="el-icon-close-tip">按 delete 键可删除</i>
              <div v-if="item.status == 'ready'">
                <el-progress v-if="item.progress != 0 && item.status == 'ready'" :percentage="item.progress" :stroke-width="2"></el-progress>
              </div>
            </li>
          </draggable>
        </ul>
    </div>
  </div>
</template>
<script>
  import draggable from 'vuedraggable'
    export default {
        props: ['group','fileList'],
        data(){
          return{
            fileLists: []
          }
        },
        components:{
          draggable
        },
        created(){
          this.fileLists = JSON.parse(JSON.stringify(this.fileList));
        },
        watch:{
          fileList(newVal, oldVal){
            this.fileLists = JSON.parse(JSON.stringify(newVal));
          }
        },
        methods:{
          /*
           *文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用
           * */
          handleChange(file, fileLists) {
            console.log("——————————change——————————");
            if (file.status == 'ready') {
              this.fileLists.push({
                url: file.url,
                name: file.name,
                status: 'ready',
                progress: 0,
                pgStatus: 'text'
              });
            } else if (file.status == 'success'){
              this.fileLists.forEach((item, index) => {
                if(item.name == file.name){
                  item.status = 'success';
                  item.pgStatus = 'success'
                }
              })
              this.sendFilesToParent();
            } else if (file.status == 'fail') {
              this.fileLists.forEach((item, index) => {
                if(item.name == file.name){
                  item.status = 'fail';
                  item.pgStatus = 'exception'
                }
             })
            }
          },
          //文件上传时的钩子
          uploadOnProgress(event, file, fileList){
            console.log("——————————progress——————————");
            console.log(event.percent);
            this.fileLists.forEach((item, index) => {
              if(item.name == file.name){
              item.progress = Math.floor(event.percent)
            }
          })
          },
          //文件上传成功时的钩子
          UploadOnSuccess(response, file, fileLists){
            console.log("——————————success——————————");
            console.log(file)
          },
          //文件上传失败时的钩子
          UploadOnError(err, file, fileLists){
            console.log("——————————error——————————");
            console.log(err)

          },
          submitUpload(){
            this.$refs.upload.submit();
          },
          //删除添加的文件
          handleFileRemove(file,i){
            console.log(file,i);
            let that = this;
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
           * 提示信息
           * */
          promptMessage(text, type){
            this.$message({
              showClose: true,
              message: text,
              type: type
            });
          },
          log(evt){
            console.log(evt);
            this.sendFilesToParent();
          },
          /*
          *向父组件传递参数
          * */
          sendFilesToParent(){
            this.$emit("listenChildFiles", this.fileLists)
          }

        }
    }

</script>
<style scoped lang="less">
  .list-group{
    min-height: 100px;
  }
</style>
