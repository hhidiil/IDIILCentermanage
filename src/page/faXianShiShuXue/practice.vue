<template>
  <el-upload
    class="upload-demo"
    ref="upload"
    action="/api/file/upload"
    :data="uploadData"
    :on-preview="handlePreview"
    :on-remove="handleRemove"
    :file-list="fileList"
    :on-success="UploadOnSuccess"
    :auto-upload="false">
    <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
    <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
    <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
  </el-upload>
</template>

<script>
  import {setStore,getStore} from '../../config/publicMethod'
  export default {
    data() {
      return {
        fileList: []
      };
    },
    computed:{
      uploadData(){
        return {
          "username":JSON.parse(getStore('userInfo')).userName
        }
      }
    },
    methods: {

      submitUpload() {
        this.$refs.upload.submit(); //上传文件 "/api/file/upload"

      },
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePreview(file) {
        console.log(file);
      },
      UploadOnSuccess(response, file, fileLists){
        console.log(response);
        this.fileList.push({url:response.file, data:file, name:file.name})
      }

    }
  }
</script>
