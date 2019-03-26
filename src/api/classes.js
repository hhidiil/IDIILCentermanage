import fetch_requset from '../config/fetch'

const API_CONFIG = '/api/classes';

/**
 * [添加新增备课列表信息]
 */
export const addCourseListInfo = (data) => {
  const url = `${API_CONFIG}/addCourseListInfo`;
  return fetch_requset(url,data,'POST')
}
/**
 * [修改课程的信息]
 */
export const updateCourseListInfo = (data) => {
  const url = `${API_CONFIG}/updateCourseListInfo`;
  return fetch_requset(url,data,'POST')
}
/**
 * [删除课程的信息]
 */
export const deleteCourseListInfo = (data) => {
  const url = `${API_CONFIG}/deleteCourseListInfo`;
  return fetch_requset(url,data,'POST')
}
/**
 * [获取备课列表信息]
 */
export const getCourseList = (data) => {
  const url = `${API_CONFIG}/getCourseList`;
  return fetch_requset(url,data,'POST')
}
/**
 * [获取课程信息]
 */
export const getClassInfo = (data) => {
  const url = `${API_CONFIG}/getCourseInfo`;
  return fetch_requset(url,data,'POST')
}
/**
 * [获取学生当前的课程信息]
 */
export const getDoingCourseInfoOfStudent = (data) => {
  const url = `${API_CONFIG}/getDoingCourseInfoOfStudent`;
  return fetch_requset(url,data,'POST')
}
/*
* 更新课程的信息
* */
export const updateDoingCourseInfo = (data)=>{
  const url = `${API_CONFIG}/updateDoingCourseInfo`;
  return fetch_requset(url,data,'POST')
}
/*
 * 获取上一次上课的内容
 * */
export const getCurrentCourseInfo = (data)=>{
  const url = `${API_CONFIG}/getCurrentCourseInfo`;
  return fetch_requset(url,data,'POST')

}
