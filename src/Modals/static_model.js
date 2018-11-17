import connection from '../Modules/connection.js';
import constant from '../Modules/constant';
import async from 'async';


let insertQuery = (values) => {
  return new Promise((resolve, reject) => {
    let sql = `INSERT INTO tb_static SET ?`
    async.forEachOf(values, (value, index, cb) => {
      connection.query(sql, value, (err, results) => {
        if (err)
          reject(err);
        else
          cb();
      })
    }, () => {
      console.log("static content successfully created.");
    });
  })
}

let selectQuery = (value) => {
  return new Promise((resolve, reject) => {
    let sql = `SELECT * FROM  tb_static WHERE static_id = ?`;
    connection.query(sql, Object.values(value), (err, results) => {
      if (err)
        reject(err);
      else
        resolve(results[0]);
    })
  })
}

let updateQuery = (value, condition) => {
  return new Promise((resolve, reject) => {
    let sql = `UPDATE tb_static SET ? WHERE ?`;
    connection.query(sql, [value, condition], (err, results) => {
      if (err)
        reject(err);
      else
        resolve(results[0]);
    })
  })
}

let deleteQuery = (value) => {
  return new Promise((resolve, reject) => {
    let sql = `DELETE FROM tb_static WHERE static_id =  ?`;
    connection.query(sql, Object.values(value), (err, results) => {
      if (err)
        reject(err);
      else
        resolve(results[0]);
    })
  })
}


module.exports = {

  insertQuery,
  selectQuery,
  updateQuery,
  deleteQuery

}
