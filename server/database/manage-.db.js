/**
 * 查询用户信息基本信息
 * Created by gaoju on 2017/11/15.
 */

const query_db = require('./dbconfig')
/*管理员用户模块 构造方法*/
var Manage = function(manage) {
  this.props = manage.props
};

/*c查询某个中心*/
Manage.prototype.selectCenter = function() {
  var _sql = `select * from tblCenter where centerid='${this.props.centerId}';`;
  const res = query_db({sql: _sql, name: 'selectCenter'}).catch((err)=>{
    console.log("服务端查询出错了。。。",err)
  })
  return res
};
/*添加新的中心*/
//Manage.prototype.addCenter = function() {
//  var _sql = `INSERT INTO tblCenter (centerId,centerName,address) VALUES ('${this.props.centerId}','${this.props.centerName}','${this.props.address}');`;
//  const res = query_db({sql: _sql, name: 'addCenter'}).catch((err)=>{
//    console.log("服务端查询出错了。。。",err)
//  })
//  return res
//};
Manage.prototype.addCenter = async function() {
  var sParentID=this.props.ParentID||"000";
  var sCenterCode="";
  var sCenterID=getUUID();
  var _this=this;
  var sLastCenterCode='';
  var _sql=`select max(CenterCode) as CenterCode from tblCenter where ParentID='${sParentID}'`;
  const res1= await query_db({sql: _sql, name: 'deleteClass'});
  sCenterCode=((parseInt(res1[0].CenterCode)+1)+'').padStart(3,'0');
console.log("444444---",sCenterCode)
  var _sql = `INSERT INTO tblCenter (CenterId,CenterCode,CenterName,Address,ParentID,DistinctID,DistinctName,Name,ContactInfo) VALUES
       ('@CenterId@','@CenterCode@','@CenterName@','@Address@','@ParentID@','@DistinctID@','@DistinctName@','@Name@','@ContactInfo@')`;
  _sql= _sql.replace(/@CenterId@/g,sCenterID);
  _sql=_sql.replace(/@CenterCode@/g,sCenterCode);
  _sql=_sql.replace(/@CenterName@/g,_this.props.CenterName);
  _sql=_sql.replace(/@Address@/g,_this.props.Address);
  _sql=_sql.replace(/@ParentID@/g,sParentID);
  _sql=_sql.replace(/@DistinctID@/g,_this.props.DistinctID);
  _sql=_sql.replace(/@DistinctName@/g,_this.props.DistinctName);
  _sql=_sql.replace(/@Name@/g,_this.props.Name);
  _sql=_sql.replace(/@ContactInfo@/g,_this.props.ContactInfo);
  console.log("33333---",_sql);
  const res = query_db({sql: _sql, name: 'addCenter'}).catch((err)=>{
    console.log("服务端查询出错了。。。",err)
  })
  return res

};
/*给中心添加管理员*/
Manage.prototype.addManagerToCenter = function() {
  var _sql = `INSERT INTO tblManage (userId,userName,pwd,centerId,phone) VALUES ('${this.props.userId}','${this.props.userName}','${this.props.password}','${this.props.centerId}','${this.props.phone}');`;
  const res = query_db({sql: _sql, name: 'addManagerToCenter'}).catch((err)=>{
    console.log("服务端查询出错了。。。",err)
  })
  return res
};
/*修改中心信息*/
Manage.prototype.updateCenterInfo = function() {
  //var _sql = `update tblManage (userId,userName,pwd,centerId,phone) VALUES ('${this.props.userId}','${this.props.userName}','${this.props.password}','${this.props.centerId}','${this.props.phone}');`;
  var _sql = `update tblCenter t1,tblManage t2 set t1.centerName='${this.props.centerName}',t1.address='${this.props.address}',t2.userName='${this.props.userName}',t2.phone='${this.props.phone}' where t1.centerId='${this.props.centerId}' and t2.centerId='${this.props.centerId}';`;
  const res = query_db({sql: _sql, name: 'updateCenterInfo'}).catch((err)=>{
    console.log("服务端查询出错了。。。",err)
  })
  return res
};
/*删除中心*/
Manage.prototype.deleteCenterInfo = function() {
  var _sql = `delete t1,t2 from tblCenter t1,tblManage t2 where t1.centerid='${this.props.centerId}' and t2.centerid='${this.props.centerId}'`;
  const res = query_db({sql: _sql, name: 'deleteCenterInfo'}).catch((err)=>{
    console.log("服务端查询出错了。。。",err)
  })
  return res
};
/*查询所有中心管理员数据*/
Manage.prototype.getAllManagerList = function() {
  var _sql = `select t2.centerId,t2.centerName,t2.address,t1.userId,t1.userName,t1.phone,t1.permissionLevel from tblCenter t2 LEFT JOIN tblManage t1 on t1.centerId=t2.centerId`;
  const res = query_db({sql: _sql, name: 'getAllManagerList'}).catch((err)=>{
    console.log("服务端查询出错了。。。",err)
  })
  return res
};
/*查询中心的所有相关数据*/
Manage.prototype.getAllCenterList = function() {
  var _sql = `select * from tblCenter`;
  const res = query_db({sql: _sql, name: 'getAllCenterList'}).catch((err)=>{
    console.log("服务端查询出错了。。。",err)
  })
  return res
};
/*查询中心的班级的数据*/
Manage.prototype.getAllClassesOfCenter = function() {
  var _sql = `select * from tblClass2Center where centerId='${this.props.centerId}'`;
  const res = query_db({sql: _sql, name: 'getAllClassesOfCenter'}).catch((err)=>{
    console.log("服务端查询出错了。。。",err)
  })
  return res
};
/*查询班级数据老师和科目*/
Manage.prototype.getInfoOfClass = function() {
  var _sql = `SELECT * FROM tblClass2Subject where classId='${this.props.classId}'`;
  const res = query_db({sql: _sql, name: 'getInfoOfClass'}).catch((err)=>{
    console.log("服务端查询出错了。。。",err)
  })
  return res
};
/*查询班级的所有学生*/
Manage.prototype.getAllStudentOfClass = function() {
  var _sql = `SELECT studentId,classId,userName,centerId,grade from tblClass2Student t1,tblStudent t2 where t1.classid='${this.props.classId}' and t1.studentId = t2.userid`;
  const res = query_db({sql: _sql, name: 'getAllStudentOfClass'}).catch((err)=>{
    console.log("服务端查询出错了。。。",err)
  })
  return res
};
/*给中心新增班级*/
Manage.prototype.addClass = function() {
  var _sql = `INSERT INTO tblClass2Center (centerId,classId,className,grade) VALUES ('${this.props.centerId}','${this.props.classId}','${this.props.className}','${this.props.grade}');`;
  const res = query_db({sql: _sql, name: 'addClass'}).catch((err)=>{
    console.log("服务端查询出错了。。。",err)
  })
  return res
};
/*删除班级*/
Manage.prototype.deleteClass = function() {
  //var _sql = `delete t1,t2,t3  from tblClass t1,tblClass2Student t2,tblClass2Subject t3 where t1.classid='${this.props.classId}' and t2.classid='${this.props.classId}' and t3.classid='${this.props.classId}'`;
  var _sql = `DELETE t1,t2,t3  from (tblClass2Center t1 LEFT OUTER JOIN tblClass2Student t2 on t1.classId=t2.classid) LEFT OUTER JOIN tblClass2Subject t3 on (t1.classId=t3.classid) where t1.classid='${this.props.classId}'`;
  const res = query_db({sql: _sql, name: 'deleteClass'}).catch((err)=>{
    console.log("服务端查询出错了。。。",err)
  })
  return res
};
module.exports = Manage
