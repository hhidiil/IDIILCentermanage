<template>
  <section>
    <div class="ql-editor" v-html="html"></div>
  </section>
</template>

<script>
  import { getEditorUrl } from '../api/exploration'
  export default{
    // 使用时请使用 :url.sync=""传值
    props: {
      url: {
        required: true
      }
    },
    data () {
      return {
        loading: false,
        html: ''
      }
    },
    watch: {
      url (value) {
        this.load(value)
      }
    },
    mounted () {
      this.load(this.url)
    },
    methods: {
      async load (url) {
        if (url && url.length > 0) {
          let result = await getEditorUrl(url);
          this.html = result;

        }
      }
    }
  }
</script>
