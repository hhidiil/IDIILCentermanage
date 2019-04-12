<template>
  <div>
    <div class="row">
      <div class="col-2">

      </div>

      <div class="col-6">
        {{draggingInfo}}

        <draggable
          tag="el-collapse"
          :list="list"
          :component-data="collapseComponentData"
          @start="isDragging = true"
          @end="isDragging = false"
        >

            <el-collapse-item
              v-for="item in list"
              :key="item.id"
              :title="item.title"
              :name="item.id"
            >
              <transition-group type="transition" name="flip-list">
              <div v-for="(lign, idx) in item.text" :key="idx">{{ lign }}</div>
              </transition-group>
            </el-collapse-item>

        </draggable>
      </div>
     <div>
       {{activeNames}}
     </div>
    </div>

    <div>
      <div ref="data_section" class="data_section">

        <div class="drag drag1" style="width:200px;height:200px;background: lightblue;position: absolute;" @mousedown="move($event,1)"></div>
        <div class="drag drag2" style="width:200px;height:200px;background: lightcoral;position: absolute" @mousedown="move($event,2)"></div>
        <div class="drag drag3" style="width:200px;height:200px;background: lightgreen;position: absolute" @mousedown="move($event,3)"></div>
      </div>
    </div>
  </div>
</template>

<script>
  import "element-ui/lib/theme-chalk/index.css";
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
      //调用组件
      draggable
    },
    data() {
      return {
        list: [
          {
            title: "Consistency",
            id: 1,
            text: [
              "Consistent with real life: in line with the process and logic of real life, and comply with languages and habits that the users are used to;",
              "Consistent within interface: all elements should be consistent, such as: design style, icons and texts, position of elements, etc."
            ]
          },
          {
            title: "Feedback",
            id: 2,
            text: [
              "Operation feedback: enable the users to clearly perceive their operations by style updates and interactive effects;",
              "Visual feedback: reflect current state by updating or rearranging elements of the page."
            ]
          },
          {
            title: "Efficiency",
            id: 3,
            text: [
              "Simplify the process: keep operating process simple and intuitive;",
              "Definite and clear: enunciate your intentions clearly so that the users can quickly understand and make decisions;",
              "Easy to identify: the interface should be straightforward, which helps the users to identify and frees them from memorizing and recalling."
            ]
          },
          {
            title: "Controllability",
            id: 4,
            text: [
              "Decision making: giving advices about operations is acceptable, but do not make decisions for the users;",
              "Controlled consequences: users should be granted the freedom to operate, including canceling, aborting or terminating current operation."
            ]
          }],
        isDragging: false,
        activeNames: [1],
        collapseComponentData: {
          on: {
            input: this.inputChanged
          },
          props: {
            value: this.activeNames
          }
        },
        //--随意拖拽
        data_section_width:'',
        data_section_height:'',
        positionX:0,
        positionY:0,
        positionArr:[]
      };
    },
    computed:{
      draggingInfo() {
        return this.isDragging ? "isDragging" : "noDragging";
      }
    },
    mounted(){
      this.data_section_width = this.$refs.data_section.offsetWidth ;
      this.data_section_heigh = this.$refs.data_section.offsetHeight ;
    },
    methods: {
      inputChanged(val) {
        this.activeNames = val;
      },
      move(e,j){
        let odiv = e.target;// 获取目标元素
        //计算出鼠标相对点击元素的位置,e.clientX获取的是鼠标的位置，OffsetLeft是元素相对于外层元素的位置
        let x = e.clientX - odiv.offsetLeft;
        let y = e.clientY - odiv.offsetTop;
        console.log(odiv.offsetLeft,odiv.offsetTop)
        document.onmousemove = (e) => {
          // 获取拖拽元素的位置
          let left = e.clientX - x;
          let top = e.clientY - y;
          this.positionX = left;
          this.positionY = top;
          // 把拖拽元素 放到 当前的位置
//              if (left <= 0) {
//                left = 0;
//              } else if (left >= document.documentElement.clientWidth - odiv.offsetWidth){
//                //document.documentElement.clientWidth 屏幕的可视宽度
//                left = document.documentElement.clientWidth - odiv.offsetWidth;
//              }
          if (left <= 0) {
            left = 0;
          } else if (left >= this.$refs.data_section.clientWidth - odiv.offsetWidth){
            left = this.$refs.data_section.clientWidth  - odiv.offsetWidth;
          }

          if (top <= 0) {
            top = 0;
          } else if (top >= this.$refs.data_section.clientHeight - odiv.offsetHeight){
            // document.documentElement.clientHeight 屏幕的可视高度
            top = this.$refs.data_section.clientHeight  - odiv.offsetHeight
          }
          odiv.style.left = left + "px";
          odiv.style.top = top + "px"
        }
        // 为了防止 火狐浏览器 拖拽阴影问题
        document.onmouseup = (e) => {
          document.onmousemove = null;
          document.onmouseup = null;
          sessionStorage.setItem('drag'+j , this.positionX + '*' + this.positionY );
          let A =  odiv.offsetLeft/document.documentElement.clientWidth;
          let B =  odiv.offsetTop/document.documentElement.clientHeight;
          console.log('X比例：'+ A+ ' Y比例：'+ B )
          // this.positionArr.push( this.positionX + '*' + this.positionY +'_'+ j )
          //console.log( this.positionArr )
        }
      }
    }
  };
</script>
<style scoped lang="less">
  .button {
    margin-top: 35px;
  }
  .flip-list-move {
    transition: transform 0.5s;
  }
  .no-move {
    transition: transform 0s;
  }
  .ghost {
    opacity: 0.5;
    background: #c8ebfb;
  }
  .list-group {
    min-height: 20px;
  }
  .list-group-item {
    cursor: move;
  }
  .list-group-item i {
    cursor: pointer;
  }
  .data_section {
    padding: 20px;
    overflow: auto;
    margin-bottom: 40px;
    background:lightgrey;
    position:relative;
    height:600px;
    width:600px;
  .uls{
    width:300px;height: 200px;
    background: lightskyblue;margin: 10px;;
  }
  }
</style>
