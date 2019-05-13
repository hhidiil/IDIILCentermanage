<template>
  <div>
    <head-top></head-top>
    <div class="centerManage_section" :xs="4" :sm="6" :md="8" :lg="15" :xl="15">
      <header>
        <el-row>
          <el-col :span="12" class="grid-content titleSetion"><h2>报表管理</h2></el-col>
        </el-row>
      </header>

    </div>
  </div>
</template>
<script type="text/ecmascript-6">


</script>
<style lang="less" type="text/less">
  .centerManage_section {
    position: relative;
    padding: 20px;
    overflow: auto;
  .section_table{
    border: 1px solid gainsboro;
    padding: 10px;
  }
  .titleSetion{
    padding: 20px;
    text-align: left;
  }
  .editSetion{
    padding: 20px;
    text-align: right;
  }
  .questionStyle{
    border: 1px solid gainsboro;
    padding: 10px;
  }
  }
  .el-row {
    font-size: 14px;
  &:last-child {
     margin-bottom: 0;
   }
  }
  .el-col {
    border-radius: 4px;
    padding: 5px 0;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 32px;
    line-height: 32px;
  }
  .AddInput{
    display: none;
    padding:8px 0;
  }
  .AddInput:first-child{
    display:inline-table;
  }
</style>
