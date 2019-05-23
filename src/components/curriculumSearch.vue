<template>
  <el-form :inline="true" :model="formInline" class="demo-form-inline" style="text-align: left;">
    <el-form-item label="科目">
      <el-select v-model="formInline.CourseType" placeholder="科目">
        <el-option label="数学" value="MM"></el-option>
        <el-option label="英语" value="EE"></el-option>
        <el-option label="逻辑 " value="PS"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="名称">
      <el-input v-model="formInline.Name" placeholder="名称"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="">查询</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
    export default {
        props: [],
        data(){
          return{
            formInline: {
              CourseType: '',
              Name: '',
              CourseType1:''
            },
          }
        },

    }
</script>
<style scoped lang="less">

</style>
