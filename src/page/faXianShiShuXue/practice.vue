<template>
  <div class="row">
    <div class="col-2">
      <button class="btn btn-secondary button" @click="sort">
        To original order
      </button>
    </div>

    <div class="col-6">
      <h3>Transition</h3>
      <draggable
        class="list-group"
        tag="ul"
        v-model="list"
        v-bind="dragOptions"
        @start="isDragging = true"
        @end="isDragging = false"
      >
        <transition-group type="transition" name="flip-list">
          <li
            class="list-group-item"
            v-for="(element,index) in list"
            :key="element.orderzz"
          >
          {{element.orderzz}}
            {{ element.name }}
          </li>
        </transition-group>
      </draggable>
    </div>

  </div>
</template>

<script>
  import draggable from 'vuedraggable'
  const message = [
    "vue.draggable",
    "draggable",
    "component",
    "for",
    "vue.js 2.0",
    "based",
    "on",
    "Sortablejs"
  ];
  export default {

    components: {
      draggable
    },
    data() {
      return {
        list: message.map((name, index) => {
          return { name, orderzz: index + 1 };
    })
    };
    },
    mounted(){
      this.init()
    },
    methods: {
      sort() {
        this.list = this.list.sort((a, b) => a.order - b.order);
      },
      init(){
        this.$layer.alert("找不到对象！");
      }
    },
    computed: {
      dragOptions() {
        return {
          animation: 0,
          group: "description",
          disabled: false,
          ghostClass: "ghost"
        };
      }
    }
  };
</script>

<style>
  /*.button {*/
    /*margin-top: 35px;*/
  /*}*/
  .flip-list-move {
    transition: transform 0.5s;
  }
  /*.no-move {*/
    /*transition: transform 0s;*/
  /*}*/
  /*.ghost {*/
    /*opacity: 0.5;*/
    /*background: #c8ebfb;*/
  /*}*/
  /*.list-group {*/
    /*min-height: 20px;*/
  /*}*/
  /*.list-group-item {*/
    /*cursor: move;*/
  /*}*/
  /*.list-group-item i {*/
    /*cursor: pointer;*/
  /*}*/
</style>
