/**
 * 查询用户信息基本信息
 * Created by gaoju on 2017/11/15.
 */
var Helper = require('../util/helper');

const db = require('./dbconfig')
let query_db=db.query_db;

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


/**
 * author: hhu
 * detail: 查询某个中心的授权应用
 * function: getCenterProgram
 * input: CenterId
 * */
Manage.prototype.getCenterProgram = function() {
  var sCenterID=this.props.CenterID||'000';
  var _sql = `select * from tblCenterProgram where centerid='${sCenterID}';`;
  console.log("getCenterProgram --------------",_sql);
  const res = query_db({sql: _sql, name: 'getCenterProgram'}).catch((err)=>{
    console.log("服务端查询出错了。。。",err)
  })
  return res
};


/**
 * author: hhu
 * detail: 添加新的中心
 * function: addCenter
 * input: CenterName,Address,sParentID,DistinctID,DistinctName,Name,ContactInfo,sStatus
 * */
Manage.prototype.addCenter = async function() {
  var sParentID=this.props.ParentID||"000";
  var sCenterID=Helper.getUUID();
  var sStatus=_this.props.Status||'1';
  var _this=this;
  var resTemp=await getLastCenterCode(sParentID);

  var sLastCenterCode=resTemp.LastCenterCode;

  let sTable="tblCenter";
  let arrData={};
  arrData.CenterId=sCenterID;
  arrData.CenterCode=sLastCenterCode;
  arrData.CenterName=_this.props.CenterName;
  arrData.Address=_this.props.Address;
  arrData.ParentID=sParentID;
  arrData.DistinctID=_this.props.DistinctID;
  arrData.DistinctName=_this.props.DistinctName;
  arrData.Name=_this.props.Name;
  arrData.ContactInfo=_this.props.ContactInfo;
  arrData.Status=sStatus;
  arrData.LastUpdateTime=Helper.getDateTime("FULL");

  var res = await db.insertData(sTable,arrData,"addCenter").catch((err)=>{
      console.log("服务端查询出错了。。。",err)
  })

  res={};
  res.CenterID=sCenterID;
  return res
};

/**
 * author: hhu
 * detail: 添加中心用户
 * function: addCenterUser
 * input: CenterID,UserID,UserType,Status
 **/
Manage.prototype.addCenterUser =async function() {
  var _this=this;
  let sTable="tblCenterUser";
  let arrData={};
  arrData.CenterId=_this.props.CenterID;
  arrData.UserID=_this.props.UserId;
  arrData.UserType=_this.props.UserType;
  arrData.Status=_this.props.Status;
  arrData.LastUpdateTime=Helper.getDateTime("FULL");
//现在假定一个中心中一个用户只能有一个角色
  _sql="delete from  tblCenterUser  where  CenterID='"+_props.CenterID+"' and  UserID='" + _this.props.UserId + "'";

  var res1= await db.query_db(_sql).catch((err)=>{
    console.log("delete CenterManager  服务端出错了。。。",err)
  });

  var res = await db.insertData(sTable,arrData,"addCenterUser").catch((err)=>{
    console.log("服务端查询出错了。。。",err)
  })

  return res
};


/**
 * author: hhu
 * detail:修改用户数据
 * */
Manage.prototype.changeCenterManager =async function() {
  let _sql = '';
  let _props=this.props;
  let res={code:500,message:'undealed error!'};

  let strTable="tblCenterUser";
  let arrData={};
  arrData.UserID=_props.UserID;
  arrData.CenterID=_props.CenterID;
  arrData.UserType='A';
  arrData.Status=_props.Status||'1';
  arrData.LastUpdateTime=Helper.getDateTime("FULL");
  //现在假定一个中心只能有一个管理员  所以添加
  let strWhere=" CenterID='"+_props.CenterID+"' and Usertype='A'";
 console.log("changeCenterManager =======",_sql);
  var res1= await db.deleteData(strTable,strWhere,'deleteCenterManager').catch((err)=>{
    console.log("delete CenterManager  服务端出错了。。。",err)
    return err;
  });

  res = await db.insertData(strTable, arrData, 'changeCenterManager').catch((err) => {
    console.log("updateMemberInfo  服务端出错了。。。", err)
  });

  return res
}


/**
 * author: hhu
 * detail: 添加中心用户
 * function: addCenterProgram
 * input:  CenterID,CenterProgram=[,...]
 **/
Manage.prototype.addCenterProgram =async function() {
  var _this=this;
  let sTable="tblCenterProgram";
  var res=null;
  var sCenterID=_this.props.CenterID||'';
  _this.props.CenterProgram.forEach(async function(ProgramCode){
    let strWhere="CenterID='"+sCenterID+"' and ProgramCode='"+ProgramCode+"'";
    res = await db.deleteData(sTable,strWhere,"deleteCenterProgram").catch((err)=>{
      console.log("服务端查询出错了。。。",err)
    })
    let arrData={};
    arrData.CenterId=sCenterID;
    arrData.ProgramCode=ProgramCode;
    res = await db.insertData(sTable,arrData,"addCenterProgram").catch((err)=>{
      console.log("服务端查询出错了。。。",err)
    })
  })

  return res;
};






/*给中心添加管理员*/
Manage.prototype.addManagerToCenter= function() {
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


/////////////////////////////////////////////////////////  private  function    //////////////////////////////

function getLastCenterCode(sParentID){
  return new Promise((resolve, reject) => {
    var sLastCenterCode='';
    var _sql=`select ifnull(max(CenterCode),'000') as CenterCode from tblCenter where ParentID='${sParentID}'`;
    query_db({sql: _sql, name: 'addCenter'}).then((res1)=>{
      sCenterCode=((parseInt(res1[0].CenterCode)+1)+'').padStart(3,'0');
      resolve({LastCenterCode:sCenterCode});
    }).catch((err)=>{
      reject(err);
    });
  });
}


