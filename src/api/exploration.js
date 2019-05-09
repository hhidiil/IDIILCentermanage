/**
 * Created by zhangjinjin on 2019/4/15.
 */

import fetchp_requset from '../config/fetchJsonp'
import fetch_requset from '../config/fetch'
/**
 * [获取线上数学列表]
 */
const sCenterWebUrl="https://nwprodsub.idiil.com.cn";
const API_CONFIG = 'http://nwprodsub.idiil.com.cn:9999/api/curriculum';

export const getOnLineData = (data) => {
    const url = sCenterWebUrl + "/SYSTEM/PUBLIC(MATH)/SaveAndGetOnLineData.jsp";
    return fetchp_requset(url,data,'GET','text/html');
};


/**
 * [保存课程信息]
 */
export const saveTempCurriculum = (data) => {
  const url = `${API_CONFIG}/saveTempCurriculum`;
  return fetch_requset(url,data,'POST')
};

/**
 * [获取课程信息]
 */
export const getTempCurriculum = (data) => {
  const url = `${API_CONFIG}/getTempCurriculum`;
  return fetch_requset(url,data,'POST')
};

/**
 * [获取课程列表]
 */
export const getCurriculumList = (data) => {
  const url = `${API_CONFIG}/getCurriculumList`;
  return fetch_requset(url,data,'POST')
};

/**
 * [删除指定课程]
 */
export const deleteCurriculum = (data) => {
  const url = `${API_CONFIG}/deleteCurriculum`;
  return fetch_requset(url,data,'POST')
};
//------------------派课接口start-------

/*
* 保存临时课程派课数据
* */
export const saveTempAssignment = (data) => {
  const url = `${API_CONFIG}/saveTempAssignment`;
  return fetch_requset(url,data,'POST')
};
/*
 * 获取一条临时派课数据
 * */
export const getTempAssignment = (data) => {
  const url = `${API_CONFIG}/getTempAssignment`;
  return fetch_requset(url,data,'POST')
};
/*
 * 获取派课列表
 * */
export const getAssignmentList = (data) => {
  const url = `${API_CONFIG}/getAssignmentList`;
  return fetch_requset(url,data,'POST')
};
/*
 * 删除一条派课
 * */
export const deleteAssignment = (data) => {
  const url = `${API_CONFIG}/deleteAssignment`;
  return fetch_requset(url,data,'POST')
};

//------------------派课接口end-------
