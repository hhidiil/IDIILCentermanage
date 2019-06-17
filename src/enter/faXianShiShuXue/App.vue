<template>
  <div id="app" class="fillcontain">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="less">
  @import '../../assets/common.less';
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
  }
  .el-menu-item,.el-submenu__title{
    text-align: left;
  }
  .el-submenu__title:hover{
    background-color: #232e3fa3 !important;
  }
  .el-table th{
    text-align: center;
  }
  .el-submenu .el-menu-item{
    min-width: 100px !important;
  }
  .el-dialog__body{
    padding: 10px 20px 30px 20px;
    max-height: 550px;
    overflow: auto;
  }

  .textForm{
    .el-form-item{
      margin: 0;
      &__label{
         color:rgb(0, 102, 153);
       }
    }
  }

  .edit_container .ql-toolbar.ql-snow + .ql-container.ql-snow {
    display: flex;
    flex-direction: column;
  }
</style>
