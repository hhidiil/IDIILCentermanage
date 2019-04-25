/**
 * Created by zhangjinjin on 2019/4/15.
 */

import fetch_requset from '../config/fetchJsonp'
/**
 * [获取线上数学列表]
 */
const sCenterWebUrl="https://nwprodsub.idiil.com.cn";
export const getOnLineData = (data) => {
    const url = sCenterWebUrl + "/SYSTEM/PUBLIC(MATH)/SaveAndGetOnLineData.jsp";
    return fetch_requset(url,data,'text/html');
};
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