/**
 * Created by zhangjinjin on 2019/4/11.
 */
import Vue from "vue";
import Vuex from "vuex";
import mutations from './mutations'
import actions from './actions'

Vue.use(Vuex);

const state = {
  count:0,
  sourceListsInfo:{
    classList:{
      classId:"",
      name:"",
      datetime: "",
      target: "",
      duration:"",
      version:[],
      commits: ""
    },
    blockLists:[]
  },
  currentBlockKey:'', //选择的当前区块key
  currentBlockList:[] //选择的当前区块的列表

};
export default new Vuex.Store({
  state,
  mutations,
  actions
});
