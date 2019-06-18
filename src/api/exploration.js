/**
 * Created by zhangjinjin on 2019/4/15.
 */

import fetchp_requset from '../config/fetchJsonp'
import fetch_requset from '../config/fetch'

const API_CONFIG = '/api/curriculum';
//const API_CONFIG = 'http://nwprodsub.idiil.com.cn:9999/api/curriculum';

/**
 * [获取线上数学列表]
 */
const sCenterWebUrl="https://nwprodsub.idiil.com.cn";
export const getOnLineData = (data) => {
    const url = sCenterWebUrl + "/SYSTEM/PUBLIC(MATH)/SaveAndGetOnLineData.jsp";
    return fetchp_requset(url,data,'text/html');
};

/**
 * [保存课程信息]
 */
export const saveTempCurriculum = (data) => {
  const url = `${API_CONFIG}/saveTempCurriculum`;
  return fetch_requset(url,data,'POST')
}

/**
 * [获取课程信息]
 */
export const getTempCurriculum = (data) => {
  const url = `${API_CONFIG}/getTempCurriculum`;
  return fetch_requset(url,data,'POST')
}

/**
 * [获取课程列表]
 */
export const getCurriculumList = (data) => {
  const url = `${API_CONFIG}/getCurriculumList`;
  return fetch_requset(url,data,'POST')
}


/**
 * [删除指定课程]
 */
export const deleteCurriculum = (data) => {
  const url = `${API_CONFIG}/deleteCurriculum`;
  return fetch_requset(url,data,'POST')
}





/* $.ajax({
 url: sCenterWebUrl + "/SYSTEM/PUBLIC(MATH)/SaveAndGetOnLineData.jsp",
 //          type: "GET",
 dataType: "jsonp",
 data: onlinePra,
 jsonp: "callback",//传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(默认为:callback)
 // jsonpCallback: "portraitCallBack",//自定义的jsonp回调函数名称，默认为jQuery自动生成的随机函数名
 success: function (data) {
 console.log(data)
 },
 error:function (err) {
 console.log(err)
 }
 });
 */
