<template>
  <div class="addTagsContainer">
    <el-tag
      v-for="tag in dynamicTags"
      :key="tag"
      closable
      :disable-transitions="false"
      @close="handleTagClose(tag)">
      {{tag}}
    </el-tag>
    <el-input
      class="input-new-tag"
      v-if="inputVisible"
      v-model="inputValue"
      ref="saveTagInput"
      size="small"
      @keyup.enter.native="handleTagInputConfirm"
      @blur="handleTagInputConfirm"
    >
    </el-input>
    <el-button v-else class="button-new-tag" size="small" @click="showTagInput">+ {{tagType}}</el-button>
  </div>
</template>
<script>
    export default {
        props: ['tagType','toDynamicTags'],
        data(){
          return{
            dynamicTags: [],
            inputVisible: false,
            inputValue: ''
          }
        },
        created(){
          this.dynamicTags = JSON.parse(JSON.stringify(this.toDynamicTags))
        },
        methods: {
          handleTagClose(tag) {
            this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
            this.sendMsgToParent();
          },

          showTagInput() {
            this.inputVisible = true;
            this.$nextTick(_ => {
              this.$refs.saveTagInput.$refs.input.focus();
            });
          },

          handleTagInputConfirm() {
            let inputValue = this.inputValue;
            if (inputValue) {
              this.dynamicTags.push(inputValue);
            }
            this.inputVisible = false;
            this.inputValue = '';
            this.sendMsgToParent();
          },
          sendMsgToParent(){
            this.$emit("listenToChildTagLists", this.dynamicTags)
          }
        }
    }
</script>
<style scoped lang="less">
  .el-tag {
    margin-right: 10px;
  }
  .button-new-tag {
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    vertical-align: bottom;
  }
</style>
