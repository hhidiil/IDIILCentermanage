/**
 * 数据库连接基本信息设置，使用连接池来达到资源复用
 * Created by gaoju on 2018/10/30.
 */
var mysql = require('mysql')
//建立连接池
const pool = mysql.createPool({
  host: '192.168.11.231',
  port: 3306,
  user: 'root',
  password: 'IDIILCenter',
  database: 'zhongkaodb',// zhongkaodb
})
console.log("database connecting......")

let db={};

db.pool=pool;

db.query_db=(opt) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        reject(err)
      } else {
        connection.query(opt.sql, (err, rows) => {
          if (err) {
            console.log(`${opt.name} err: + ${err}`);
            reject(err)
          } else {
            resolve(rows)
          }
          connection.release()
        })
      }
    })
  })
}

// 查询所有数据
db.selectAll=(sql,moduleName) => {
  let opt = {};
  opt.sql = sql;
  opt.name = moduleName;
  return db.query_db(opt);
}

db.insertData =(table,arrData,moduleName) => {
  let fields = '';
  let values = '';
  for (let k in arrData) {
    fields += k + ',';
    values = values + "'" + arrData[k] + "',"
  }
  fields = fields.slice(0, -1);
  values = values.slice(0, -1);
  console.log(fields, values);
  let sql = "INSERT INTO " + table + '(' + fields + ') VALUES(' + values + ')';
  let opt = {};
  opt.sql = sql;
  opt.name = moduleName;

  return db.query_db(opt);
}

db.updateData =(table,sets,where,moduleName) => {
  let _SETS='';
  let keys='';
  let values='';
  for(let k in sets){
    _SETS+=k+"='"+sets[k]+"',";
  }
  _SETS=_SETS.slice(0,-1);

  let sql="UPDATE "+table+" SET "+ _SETS +" WHERE "+ where;
  console.log("----------------",sql);

  let opt = {};
  opt.sql = sql;
  opt.name = moduleName;
  let res=db.query_db(opt);

  return  res;
}

db.deleteData =(table,where,moduleName) => {
  let sql="DELETE  FROM "+table+' WHERE '+where;
 console.log('delete ############## ',sql);
  let opt = {};
  opt.sql = sql;
  opt.name = moduleName;

  return db.query_db(opt);
}

module.exports = db;
