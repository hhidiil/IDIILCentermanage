/**
 * @desc 管理员管理模块
 * @dateTime 2018-12-13
 **/

var express = require('express');
var Manage = require('../database/manage.db.js');
var Helper = require('../util/helper');
const manageRouter = express.Router();

/*
 * 添加中心（只有最高权限的管理员才可以）
 * */
manageRouter.post('/addCenter',async (req,res)=>{
  var props = req.body;
  var manage = new Manage({props: props});
  const result = await manage.addCenter();
  console.log("11111111111-->",result)
  console.log("222-->",result.CenterID)
  if(result){
   /* let id = Helper.randomString(false,8);//创建唯一ID号
    let props2 = req.body;
    props2.CenterID=result.CenterID;
    props2.UserId = id;
    props2.password = Helper.getMD5('123456');//默认密码
    let manage2 = new Manage({props: props2});
    const result2 = await manage2.addManagerToCenter();
    console.log("222222222-->",result2)
    */
      res.json({
        code:200,
        data:result
      })
  }else {
    res.json({
      code:500,
      message:'数据插入出错~~'
    })
  }
})
/*
 * 给中心添加管理员（目前是一个中心一个管理员）
 * */
manageRouter.post('/addManagerToCenter',async (req,res)=>{
  var props = req.body;
  var manage = new Manage({props: props});
  const result = await manage.addManagerToCenter();
  if(result){
    res.json({
      code:200,
      data:result
    })
  }else {
    res.json({
      code:500,
      message:'数据插入出错~~'
    })
  }
})
/*
 * 修改中心的信息
 * */
manageRouter.post('/updateCenter',async (req,res)=>{
  var props = req.body;
  var manage = new Manage({props: props});
  const result = await manage.updateCenterInfo();
  if(result){
    res.json({
      code:200,
      data:result
    })
  }else {
    res.json({
      code:500,
      message:'数据修改出错~~'
    })
  }
})
/*
 * 删除中心的信息
 * */
manageRouter.post('/deleteCenter',async (req,res)=>{
  var props = req.body;
  var manage = new Manage({props: props});
  const result = await manage.deleteCenterInfo();
  if(result){
    res.json({
      code:200,
      data:result
    })
  }else {
    res.json({
      code:500,
      message:'数据修改出错~~'
    })
  }
})

/*
 * 查询所有中心得管理员信息（只有最高权限的管理员才可以查询）
 * */
manageRouter.post('/getAllManagerList',async(req, res) => {
  var props = req.body;
  var manage = new Manage({props: props});
  const result = await manage.getAllManagerList();
  if(result){
    res.json({
      code:200,
      data:result
    })
  }else {
    res.json({
      code:500,
      message:'数据获取出错~~'
    })
  }
});

manageRouter.post('/getAllCenter',async(req, res) => {
  let props = req.body;
  let manage = new Manage({props: props});
  const result = await manage.getAllCenterList();//查出所有的中心
  if(result){
    res.json({
      code:200,
      data:result
    })
  }else {
    res.json({
      code:500,
      message:'数据获取出错~~'
    })
  }
})

/*
 * 查询某个中心的所有班级信息
 * */
manageRouter.post('/getAllClassesOfCenter',async(req, res) => {
  let props = req.body;
  let manage = new Manage({props: props});
  const result = await manage.getAllClassesOfCenter();
  if(result){
    if(result.length>0){
      for(let i in result){
        let props = {};
        props.classId = result[i].classId;
        let manage2 = new Manage({props:props})
        const result2 = await manage2.getInfoOfClass();
        if(result2 && result2.length>0){
          result[i].otherInfo = result2;
        }else {
          result[i].otherInfo = [];
        }
      }
      console.log(result)
    }
    res.json({
      code:200,
      data:result
    })
  }else {
    res.json({
      code:500,
      message:'数据获取出错~~'
    })
  }
});
/*
 * 查询某个班级所有学生信息
 * */
manageRouter.post('/getAllStudentOfClass',async(req, res) => {
  let props = req.body;
  let manage = new Manage({props: props});
  const result = await manage.getAllStudentOfClass();
  if(result){
    res.json({
      code:200,
      data:result
    })
  }else {
    res.json({
      code:500,
      message:'数据获取出错~~'
    })
  }
});
/*
 * 新增班级信息
 * */
manageRouter.post('/addClassInfo',async(req, res) => {
  let props = req.body;
  let manage = new Manage({props: props});
  props.classId = Helper.randomString(false,4);
  const result = await manage.addClass();
  if(result){
    res.json({
      code:200,
      data:result
    })
  }else {
    res.json({
      code:500,
      message:'数据添加出错~~'
    })
  }
});
/*
 * 删除某个班级所有信息
 * */
manageRouter.post('/deleteClassInfo',async(req, res) => {
  let props = req.body;
  let manage = new Manage({props: props});
  const result = await manage.deleteClass();
  if(result){
    res.json({
      code:200,
      data:result
    })
  }else {
    res.json({
      code:500,
      message:'数据删除出错~~'
    })
  }
});

module.exports = manageRouter;
