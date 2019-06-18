/**
 * 课程发现式数学课件制作　　
 * Created by gaoju on 2017/11/15.
 */

const query_db = require('./dbconfig')
/*课程模块 构造方法*/
var Common = function(Commons) {
  this.props = Commons.props
};
/*查询最新的课程*/
Common.prototype.getAreaList= function() {
  var _sql = `select * from  area  order by id `;
  const res = query_db({sql: _sql, name: 'getLastClassInfo'}).catch((err)=>{
    console.log("服务端查询出错了(getLastClassInfo)。。。",err)
  })
  return res
}


module.exports = Common
