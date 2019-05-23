<template>
      <div class="edit_container">
        <quill-editor v-model="content"
                      ref="myQuillEditor"
                      :options="editorOption"
                      @blur="onEditorBlur($event)"
                      @focus="onEditorFocus($event)"
                      @ready="onEditorReady($event)"
                      @change="onEditorChange($event)">
        </quill-editor>
        <div v-show="quillCodeShow" class="quill-code">
          <code class="hljs" v-html="contentCode"></code>
        </div>
        <div class="quill-control">
            <el-button type="primary" size="mini" @click="previewCode">预览</el-button>
            <el-button type="success" size="mini" @click="sendEditCode">提交</el-button>
        </div>
      </div>
</template>

<script type="text/ecmascript-6">
  import hljs from 'highlight.js'
  import 'highlight.js/styles/googlecode.css' //highlight样式文件
  import { quillEditor } from 'vue-quill-editor' //组件内调用编辑器
  // require styles
  import 'quill/dist/quill.core.css'
  import 'quill/dist/quill.snow.css'
  import 'quill/dist/quill.bubble.css'


  export default {
    data () {
      return {
        content: ` `,
        textFileName:'',
        editorOption: {
          modules: {
            toolbar: [
              ['bold', 'italic', 'underline', 'strike'],
//              ['blockquote', 'code-block'],
//              [{ 'header': 1 }, { 'header': 2 }],
              [{ 'list': 'ordered' }, { 'list': 'bullet' }],
              [{ 'script': 'sub' }, { 'script': 'super' }],
              [{ 'indent': '-1' }, { 'indent': '+1' }],
              [{ 'direction': 'rtl' }],
              [{ 'size': ['small', false, 'large', 'huge'] }],
              [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
              [{ 'font': [] }],
              [{ 'color': [] }, { 'background': [] }],
              [{ 'align': [] }],
              ['clean'],
              ['link', 'image', 'video']
            ],
            syntax: {
              highlight: text => hljs.highlightAuto(text).value
            }
          }
        },
        quillCodeShow:false,
      }
    },
    components: {
      quillEditor
    },
    computed: {
      editor() {
        return this.$refs.myQuillEditor.quill
      },
      contentCode() {
        return hljs.highlightAuto(this.content).value
      }
    },
    mounted() {
      console.log('this is current quill instance object', this.editor);
      this.content = ` `

    },
    methods: {
      // 失去焦点事件
      onEditorBlur(quill) {
        console.log('editor blur!', quill)
      },
      // 获得焦点事件
      onEditorFocus(quill) {
        console.log('editor focus!', quill)
      },
      // 准备编辑器
      onEditorReady(quill) {
        console.log('editor ready!', quill)
      },
      // 内容改变事件
      onEditorChange({ quill, html, text }) {
        this.content = html
      },
      //预览代码
      previewCode(){
        this.quillCodeShow = !this.quillCodeShow
      },
      //提交
      sendEditCode(){
        this.addName()
      },
      //填写文件名字
      addName() {
        this.$prompt('请输入文件名：', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputValidator:function(val){ //function可以用来写更复杂的判断条件，返回布尔值
            if(!val){
              return false;
            }else{
              return true;
            }
//            return /^[a-zA-Z0-9]{6}$/.test(val);
          },
          inputErrorMessage:'文件名不能为空'

        }).then(({ value }) => {
          if(!value){
                this.$message({
                  type: 'info',
                  message: '请输入文件名'
                });
                return false;
          }
          this.textFileName = value;
          this.$message({
            type: 'success',
            message: '提交成功'
          });
          this.sendMsgToParent();
        }).catch(() => {});
      },
      //向父级传递参数
      sendMsgToParent(){
        this.$emit('sendEditorInfo', this.textFileName, this.content)

      }
    }

  }
</script>

<style scoped lang="less" type="text/less">
  .edit_container{
    height: 450px;
    display: flex;
    flex-direction: column;
  }

  .quill-editor{
    height: 410px;
    display: flex;
    flex-direction: column;
    word-wrap: break-word;
    .ql-container{
      display: flex;
      flex-direction: column;
    }
  }
  .ql-toolbar.ql-snow + .ql-container.ql-snow {
    border-top: 0px;
    display: flex;
    flex-direction: column;
  }
  .quill-code {
    height: 350px;
    display: flex;
    flex-direction: column;
  > code {
      margin: 0;
      padding: 1rem;
      border: 1px solid #ccc;
      border-top: none;
      border-radius: 0;
      height: 100%;
      overflow-y: auto;
    }
  }
  .quill-control{
    padding: 10px 0 0;
    text-align: right;
  }
</style>
