import fetch_requset from '../config/fetch'

const API_CONFIG = 'https://nwprodsub.idiil.com.cn:9999/api/manage';

export const getDataFromServer=(jsondata,functionName)=>{
  const url = `${API_CONFIG}/${functionName}`;
  return fetch_requset(url,jsondata,'POST')
}
/**
 * [查询各个中心的管理员列表信息]
 */
export const addCenter = (data) => {
  const url = `${API_CONFIG}/addCenter`;
  return fetch_requset(url,data,'POST')
}

/**
 * [把用户绑定到中心]
 */
export const addCenterUser = (data) => {
  const url = `${API_CONFIG}/addCenterUser`;
  return fetch_requset(url,data,'POST')
}

/**
 * [切换中心管理员]
 */
/*export const changeCenterManager = (data) => {
  const url = `${API_CONFIG}/addCenterUser`;
  return fetch_requset(url,data,'POST')
}*/
/**
 * [切换中心管理员]
 */
export const changeCenterManager = (data) => {
  const url = `${API_CONFIG}/changeCenterManager`;
  return fetch_requset(url,data,'POST')
}

/**
 * [查询各个中心的管理员列表信息]
 */
export const getAllManagerList = (data) => {
  const url = `${API_CONFIG}/getAllManagerList`;
  return fetch_requset(url,data,'POST')
}
/**
 * [查询某中心班级列表信息]
 */
export const getAllClassesOfCenter = (data) => {
  const url = `${API_CONFIG}/getAllClassesOfCenter`;
  return fetch_requset(url,data,'POST')
}
/**
 * [查询某班级学生列表信息]
 */
export const getAllStudentOfClass = (data) => {
  const url = `${API_CONFIG}/getAllStudentOfClass`;
  return fetch_requset(url,data,'POST')
}
/**
 * [新增班级]
 */
export const addClassInfo = (data) => {
  const url = `${API_CONFIG}/addClassInfo`;
  return fetch_requset(url,data,'POST')
}
/**
 * [删除班级]
 */
export const deleteClassInfo = (data) => {
  const url = `${API_CONFIG}/deleteClassInfo`;
  return fetch_requset(url,data,'POST')
}


/**
 * [删除班级]
 */
export const getCurriculumInfo = (data) => {
  const url = `/api/curriculum/getCurriculumInfo`;
  return fetch_requset(url,data,'POST')
}

/**
 * [获取中心注册的应用]
 */
export const getCenterProgram = (data) => {
  const url = `${API_CONFIG}/getCenterProgram`;
  return fetch_requset(url,data,'POST')
}

/**cui
 * [查询某中心班级列表信息]
 */

export const getAllCenter = (data) => {
  const url = `${API_CONFIG}/getAllCenter`;
  console.log("gggggggggg",url)
  return fetch_requset(url,data,'POST')
}

/**cui
 * [获取班级下的所有学生/老师/班主任列表]
 */
export const getClassCenterUser = (data) => {
  const url = `${API_CONFIG}/getClassCenterUser`;
  return fetch_requset(url,data,'POST')
}
/**cui
 * [中心下添加学校]
 */
export const addCenterSchool = (data) => {
  const url = `${API_CONFIG}/addCenterSchool`;
  return fetch_requset(url,data,'POST')
}


/**cui
 * [ 添加学校用户：管理员、老师、学生]
 */
export const addCenterSchoolUser = (data) => {
  const url = `${API_CONFIG}/addCenterSchoolUser`;
  return fetch_requset(url,data,'POST')
}
/**cui
 * [ 添加学校用户：管理员、老师、学生]
 */
export const getCenterSchoolUser = (data) => {
    const url = `${API_CONFIG}/getCenterSchoolUser`;
    return fetch_requset(url,data,'POST')
  }


/**cui
 * [ 添加学校用户：管理员、老师、学生]
 */
export const getCenterSchool = (data) => {
  const url = `${API_CONFIG}/getAllSchoolList`;
  return fetch_requset(url,data,'POST')
}
/**cui
 * [ 获取一个学校下的班级列表]
 */
export const getSchoolClasses = (data) => {
  const url = `${API_CONFIG}/getSchoolClasses`;
  return fetch_requset(url,data,'POST')
}
/**cui
 * [ 学校下建班级]
 */
export const addCenterSchoolClass = (data) => {
  const url = `${API_CONFIG}/addCenterSchoolClass`;
  return fetch_requset(url,data,'POST')
}
/*添加班级的用户*/
export const addCenterClassUser = (data) => {
  const url = `${API_CONFIG}/addCenterClassUser`;
  return fetch_requset(url,data,'POST')
}

/*获取班级yoghurt*/
export const getCenterClassUser = (data) => {
  const url = `${API_CONFIG}/getCenterClassUser`;
  return fetch_requset(url,data,'POST')
}
/*批量添加用户到班级*/
export const addCenterClassUserList = (data) => {
  const url = `${API_CONFIG}/addCenterClassUserList`;
  return fetch_requset(url,data,'POST')
}
