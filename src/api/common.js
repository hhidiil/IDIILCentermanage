import fetch_requset from '../config/fetch'

//const API_CONFIG = '/api/common';

const API_CONFIG = 'https://nwprodsub.idiil.com.cn:9999/api/common';
export const getDataFromServer=(jsondata,functionName)=>{
  const url = `${API_CONFIG}/${functionName}`;
  return fetch_requset(url,jsondata,'POST')
}
/**
 * [获取城市基本信息]
 */
export const getAreaList = (data) => {
  const url = `${API_CONFIG}/getAreaList`;
  return fetch_requset(url,data,'POST')
}
