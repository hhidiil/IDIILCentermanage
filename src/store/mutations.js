/**
 * Created by zhangjinjin on 2019/4/11.
 */

import {
  ADD_COUNT,
  SOURCE_LIST,
  CURRENT_BLOCK_KEY,
  CURRENT_BLOCK_LIST,
  UPDATE_MENUACTIVENAME,
  UPDATE_LESSIONS_STATUS
} from './mutation-types'
import {setStore,getStore} from '../config/publicMethod'
export default{
  [SOURCE_LIST](state,newList){
    state.sourceListsInfo=newList.val;
    //存入localStorage
    setStore(`sourceLists-${newList.key}`,newList.val)

  },
  [ADD_COUNT](state){
    state.count++;
  },
  //---储存当前的区块key值
  [CURRENT_BLOCK_KEY](state,key){
    state.currentBlockKey=key;
  },
  //---储存当前的区块列表
  [CURRENT_BLOCK_LIST](state,key){
    state.currentBlockList=key;
  },
  [UPDATE_MENUACTIVENAME](state, name){
    state.menuActiveName = name
  },
  [UPDATE_LESSIONS_STATUS](state, status){
    state.prepareLessonsStatus = status
  }
}
