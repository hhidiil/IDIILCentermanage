/**
 * 查询用户信息基本信息
 * Created by gaoju on 2017/11/15.
 */

const db = require('./dbconfig');
const Helper = require('../util/helper');

let query_db=db.query_db;

/*用户模块 构造方法*/
var User = function(user) {
    this.props = user.props
};


/**
 * author: hhu
 * detail:注册 添加用户数据
 * */
User.prototype.registerMember =async function() {
  let _sql = '';
  let _props=this.props;
  let strTable="tblMemberInfo";
  let arrData={};
  arrData.UserID=_props.UserID;
  if(_props.UserName) arrData.UserName=_props.UserName;
  if(_props.NickName) arrData.NickName=_props.NickName;
  if(_props.ActualName) arrData.ActualName=_props.ActualName;
  if(_props.Password) arrData.Password=_props.Password;
  if(_props.Sex) arrData.Sex=_props.Sex;
  if(_props.Birthday) arrData.Birthday=_props.Birthday;
  if(_props.DistinctID) arrData.DistinctID=_props.DistinctID;
  if(_props.DistinctName) arrData.DistinctName=_props.DistinctName;
  if(_props.Address) arrData.Address=_props.Address;
  if(_props.ContactInfo) arrData.ContactInfo=_props.ContactInfo;
  if(_props.Equipment) arrData.Equipment=_props.Equipment;
  arrData.RegisterDate=Helper.getDateTime("FULL");
  arrData.LastUpdateTime=Helper.getDateTime("FULL");

  var res=await db.insertData(strTable,arrData,'registerMember').catch((err)=>{
    console.log("registerMember 服务端出错了。。。",err)
  });
  res={};
  res.UserID=_props.UserID;

  if(_props.UserType && _props.UserType.toString()!=="M") {
    let strSQL="delete from tblCenterUser where CenterID='---' and UserID='" +_props.UserID+"';"
    var res1=await db.query_db(strSQL).catch((err)=>{
      console.log("registerMember 服务端出错了。。。",err)
    });

    strTable="tblCenterUser";
    arrData={};
    arrData.UserID=_props.UserID;
    arrData.CenterID='---';
    arrData.UserType=_props.UserType;
    arrData.Status='1';
    arrData.LastUpdateTime=Helper.getDateTime('FULL');
    var res2=await db.insertData(strTable,arrData,'addCenterUser').catch((err)=>{
      console.log("registerMember 服务端出错了。。。",err)
    });

  }
  return res
}


/**
 * author: hhu
 * detail:修改用户数据
 * */
User.prototype.updateMemberInfo =async function() {
  let _sql = '';
  let _props=this.props;
  let strTable="tblMemberInfo";
  let arrData={};
  if(_props.UserName) arrData.UserName=_props.UserName;
  if(_props.NickName) arrData.NickName=_props.NickName;
  if(_props.ActualName) arrData.ActualName=_props.ActualName;
  if(_props.Password) arrData.Password=_props.Password;
  if(_props.Sex) arrData.Sex=_props.Sex;
  if(_props.Birthday) arrData.Birthday=_props.Birthday;
  if(_props.DistinctID) arrData.DistinctID=_props.DistinctID;
  if(_props.DistinctName) arrData.DistinctName=_props.DistinctName;
  if(_props.Address) arrData.Address=_props.Address;
  if(_props.ContactInfo) arrData.ContactInfo=_props.ContactInfo;
  if(_props.Equipment) arrData.Equipment=_props.Equipment;
  arrData.LastUpdateTime=Helper.getDateTime("FULL");

  var strWhere="UserID='"+_props.UserID+"'";


  var res= db.updateData(strTable,arrData,strWhere,'updateMemberInfo').catch((err)=>{
    console.log("updateMemberInfo  服务端出错了。。。",err)
  });
  res={};
  res.UserID=_props.UserID;
  return res
}



/**
 * author: hhu
 * detail:修改用户数据
 * */
User.prototype.changeCenterManager =async function() {
  let _sql = '';
  let _props=this.props;
  let strTable="tblCenterUser";
  let arrData={};
  arrData.UserID=_props.UserID;
  arrData.CenterID=_props.CenterID;
  arrData.UserType='A';
  arrData.Status='1';
  arrData.LastUpdateTime=Helper.getDateTime("FULL");
 //现在假定一个中心只能有一个管理员
  _sql="delete from  tblCenterUser  where  CenterID='"+_props.CenterID+"'";

  var res1= await db.query_db(_sql).catch((err)=>{
    console.log("delete CenterManager  服务端出错了。。。",err)
  });

  var res= await db.insertData(strTable,arrData,strWhere,'changeCenterManager').catch((err)=>{
    console.log("updateMemberInfo  服务端出错了。。。",err)
  });
  return res
}




/*用户登录校验*/
User.prototype.getUser = function() {
  var _sql = '';
  if(this.props.role == '1'){//学生
    _sql = `select userId,userName,centerId from tblStudent where username='${this.props.name}' and pwd='${this.props.pass}'`;
  }
  if(this.props.role == '2'){//教师
    _sql = `select userId,userName,centerId from tblTeacher where username='${this.props.name}' and pwd='${this.props.pass}'`;
  }
  if(this.props.role == '3'){//管理员
    _sql = `select userId,userName,centerId,permissionLevel from tblManage where username='${this.props.name}' and pwd='${this.props.pass}'`;
  }
  const res = query_db({sql: _sql, name: 'getUserAllItems'}).catch((err)=>{
    console.log("服务端查询出错了。。。",err)
  })
  return res
}

/*获取当前最新的用户id*/
User.prototype.getMaxUserId = function(callback) {
  var _sql = '';
  if(this.props.role == '0'){//普通会员
    _sql = "select IFNULL(max(UserId),'') as UserID from tblMemberInfo ORDER BY UserID  DESC LIMIT 0,1";
  }
  if(this.props.role == '1'){//学生
    _sql = "select userId from tblStudent where id>0  ORDER BY userid DESC LIMIT 0,1";
  }
  if(this.props.role == '2'){//教师
    _sql = "select userId from tblTeacher where id>0  ORDER BY userid DESC LIMIT 0,1";
  }
  if(this.props.role == '3'){//管理员
    _sql = "select userId from tblManage where id>0  ORDER BY userid DESC LIMIT 0,1";
  }
  const res = query_db({sql: _sql, name: 'getMaxUserId'}).catch((err)=>{
    console.log("服务端查询出错了。。。",err)
  })

  return res
}



/*注册 添加用户数据*/
User.prototype.getAddUser = function() {
  var _sql = '';
  if(this.props.role == '1'){//学生
    _sql = `INSERT INTO tblStudent(userid,username,pwd,centerid) VALUES ('${this.props.userId}','${this.props.userName}','${this.props.password}','${this.props.centerId}');`;
  }
  if(this.props.role == '2'){//教师
    _sql = `INSERT INTO tblTeacher(userid,username,pwd,centerid,phone) VALUES ('${this.props.userId}','${this.props.userName}','${this.props.password}','${this.props.centerId}','${this.props.phone}');`;
  }
  if(this.props.role == '3'){
    _sql = `INSERT INTO tblManage(userid,username,pwd,centerid,phone) VALUES ('${this.props.userId}','${this.props.userName}','${this.props.password}','${this.props.centerId}','${this.props.phone}');`;
  }
  const res = query_db({sql: _sql, name: 'getAddUser'}).catch((err)=>{
    console.log("服务端查询出错了。。。",err)
  })
  return res
}


/*班级对应学生表中 添加数据*/
User.prototype.getAddUserToClass = function() {
  var _sql = `INSERT INTO tblClass2Student (studentId,classId) VALUES ('${this.props.userId}','${this.props.classId}');`;
  const res = query_db({sql: _sql, name: 'getAddUserToClass'}).catch((err)=>{
    console.log("服务端查询出错了。。。",err)
  })
  return res
}
/*添加学生数据*/
User.prototype.updateStudentUser = function() {
  var _sql = `update tblClass2Student t1,tblStudent t2 set t1.classid='${this.props.classId}',t2.username='${this.props.userName}',t2.grade='${this.props.grade}' where t1.studentId='${this.props.userId}' and t2.userid='${this.props.userId}'`;
  const res = query_db({sql: _sql, name: 'updateStudentUser'}).catch((err)=>{
    console.log("服务端查询出错了。。。",err)
  })
  return res
}
/*删除学生数据*/
User.prototype.deleteStudentUser = function() {
  var _sql = `delete t1,t2 from tblClass2Student t1,tblStudent t2 where t1.studentId='${this.props.userId}' and t2.userid='${this.props.userId}'`;
  const res = query_db({sql: _sql, name: 'deleteStudentUser'}).catch((err)=>{
    console.log("服务端查询出错了。。。",err)
  })
  return res
}

module.exports = User
