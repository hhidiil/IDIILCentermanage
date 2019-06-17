<template>
  <section>

        <el-form :model="activityForm" status-icon ref="moreRules" :label-width="formLabelWidth">
          <el-form-item label="活动名称:" prop="name">
            <el-input v-model="activityForm.name" auto-complete="off"></el-input>
          </el-form-item>
        </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button @click="DialogActivityVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveActivityEdit('moreRules')">确 定</el-button>
      </span>
  </section>

</template>
<script>
    export default {
        props: []
    }
</script>
<style>

</style>
