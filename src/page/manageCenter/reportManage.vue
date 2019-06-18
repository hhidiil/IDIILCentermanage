<template>
  <div>报表管理</div>
</template>
<script>
  import { getDataFromServer_User } from '../../api/user'
  export default {
    props: [],
    data(){
      return{
        fileLists:[],
        isEnlargeImage:false, //放大图片
        enlargeImage:'', //放大图片地址
        params: {
          action: 'http://nwprodsub.idiil.com.cn:9999/api/user/uploadExcel',//getDataFromServer_User({},'uploadExcel'),
          data: {
            "username":"ccc",
            "SchoolID":"009",
            // "ClassID":"ccc",
          }
        }
      }
    },
  }

</script>
<style scoped lang="less">
  .list-group{
    min-height: 45px;
  }
</style>
