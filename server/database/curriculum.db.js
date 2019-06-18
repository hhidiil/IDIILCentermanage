/**
 * 课程发现式数学课件制作　　
 * Created by gaoju on 2017/11/15.
 */

const query_db = require('./dbconfig')
/*课程模块 构造方法*/
var Curriculum = function(Curriculums) {
  this.props = Curriculums.props
};
/*查询最新的课程*/
Curriculum.prototype.getLastCurriculumID= function() {
  var _sql = `select * from  tblClassCourseGroup where teacherid='${this.props.teacherId}' order by id desc limit 0,1`;
  const res = query_db({sql: _sql, name: 'getLastClassInfo'}).catch((err)=>{
    console.log("服务端查询出错了(getLastClassInfo)。。。",err)
  })
  return res
}
/*添加课程*/
Curriculum.prototype.addCurriculumInfo = function() {
  var _sql = `INSERT INTO tblClassCourseGroup(courseid,classid,centerid,teacherid,teachername,name,subjectid,subjectname,group_student_Info,target,source,othersource,commits)
              VALUES
              ('${this.props.courseId}','${this.props.classId}','${this.props.centerId}','${this.props.teacherId}','${this.props.teacherName}','${this.props.name}','${this.props.subjectId}',
               '${this.props.subjectName}','${this.props.studentGroup}','${this.props.target}','${this.props.source}',
               '${this.props.otherSource}','${this.props.commits}');`;
  const res = query_db({sql: _sql, name: 'addClassInfo'}).catch((err)=>{
    console.log("服务端查询出错了(addClassInfo)。。。",err)
  })
  return res
}
/*修改某课程的信息*/
Curriculum.prototype.updateCurriculumInfo = function() {
  var _sql = `update tblClassCourseGroup
              set name='${this.props.name}',
                  group_student_Info='${this.props.studentGroup}',
                  target='${this.props.target}',
                  source='${this.props.source}',
                  othersource='${this.props.otherSource}',
                  commits='${this.props.commits}' where courseid='${this.props.courseId}' and teacherid='${this.props.teacherId}';`;
  const res = query_db({sql: _sql, name: 'updateClassInfo'}).catch((err)=>{
    console.log("服务端查询出错了(updateClassInfo)。。。",err)
  })
  return res
}
/*删除某课程的信息*/
Curriculum.prototype.deleteCurriculumInfo = function() {
  var _sql = `delete from tblClassCourseGroup where courseid='${this.props.courseId}' and teacherid='${this.props.teacherId}';`;
  const res = query_db({sql: _sql, name: 'deleteClassListInfo'}).catch((err)=>{
    console.log("服务端查询出错了(deleteClassListInfo)。。。",err)
  })
  return res
}


/*获取课程信息*/
Curriculum.prototype.getCurriculumInfo = function() {
  var _sql = `select * from tblClassCourseGroup where courseid='${this.props.courseId}'`;
  const res = query_db({sql: _sql, name: 'getClassInfo'}).catch((err)=>{
    console.log("服务端查询出错了(getClassInfo)。。。",err)
  })
  return res
}

module.exports = Curriculum
