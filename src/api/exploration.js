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
    return fetch_requset(url,data,'GET','text/html');
};
