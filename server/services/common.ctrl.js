/**
 * @desc 发现式数学课程模块控制器
 * @dateTime 2018-11-28
 **/

var express = require('express');
var path = require('path')
var Common = require('../database/Common.db.js');
var Helper = require('../util/helper');
const CommonRouter = express.Router();


/*
 * 获取老师派课列表。
 * */
CommonRouter.post('/getAreaList',async(req,res)=>{
  var props = req.body;
  var objCommon = new Common({props: props});
  const result = await objCommon.getAreaList();
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

module.exports = CommonRouter;
