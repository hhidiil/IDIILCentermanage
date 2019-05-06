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
  sourceListsInfo:{},
  currentBlockKey:'', //选择的当前区块key
  currentBlockList:[], //选择的当前区块的列表
  menuActiveName: '', //侧边栏显示
  prepareLessonsStatus: '' //备课状态

};
export default new Vuex.Store({
  state,
  mutations,
  actions
});
