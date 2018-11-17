import connection from '../Modules/connection.js';
import responses from '../Modules/responses';
import constant from '../Modules/constant';
import commonfunc from '../Modules/commonFunction';

let insertQuery =(values) => {
	console.log(values);
	return new Promise((resolve, reject) => {
		let sql = "INSERT INTO `tb_follow_request` SET ?";
		connection.query(sql, [values], (err, result) =>{
			if(err) {
				reject(err);
			} else {
				console.log(values.request_id);
				let condition = {"request_id" :values.request_id};
				console.log(condition); 
				let sql = "SELECT * from `tb_follow_request` WHERE ?";
				connection.query(sql, [condition], (err, result) => {
					if(err) {
						reject(err);
					} else {
						console.log(result);
						resolve(result);
					}
				})
			}
		});
	});
}

let selectQuery = (condition) => {
	console.log("condition in select query");
	console.log(condition);
	return new Promise((resolve, reject) => {
		let sql = `SELECT * FROM tb_follow_request WHERE (user_id ="${condition.user_id}" AND reciever_id="${condition.reciever_id}") AND request_status = "0"`;
		connection.query(sql,Object.values(condition), (err, result) => {
			if(err) {
				reject(err);
			} else {
				console.log(result)
				resolve(result);
			}
		})
	})
} 
let selectQuery2 = (condition) => {
	console.log (condition)
	return new Promise((resolve, reject) => {
		let sql = `SELECT * FROM tb_follow_request WHERE reciever_id = "${condition.reciever_id}" AND request_status = "${condition.request_status}"`;
		connection.query(sql, Object.values(condition), (err, result) => {
			if(err) {
				reject(err);
			} else {
				resolve(result);
			}
		})
	})
}
let updateQuery = (values, condition) =>{
	return new Promise((resolve, reject) => {
		let sql = `UPDATE tb_follow_request SET ? WHERE ?`;
		connection.query(sql, [values, condition],(err, result) =>{
			if(err) {
				reject(err);
			} else {
				let sql  = `SELECT * FROM  tb_follow_request WHERE ?`;
				connection.query(sql, [condition], (err, results) => {
					if(err) {
						reject(err);
					} else{
						resolve(results[0]);
					}
				})  
			}
		})
	})
}
let insertQuery2 = (values) => {
	return new Promise((resolve, reject) => {
		let sql = "INSERT INTO `tb_followers` SET ?";
		connection.query(sql, [values], (err, result) => {
			if(err) {
				reject(err);
			} else {
				console.log("sahi hai ");

				let condition = values.follow_id;
				console.log(condition);
				let sql = "SELECT * from `tb_followers` WHERE `follow_id` = ?";
				connection.query(sql, [condition], (err, result) => {
					if(err) {
						reject(err);
					} else {
						resolve(result);
					}
				})
			}
		});
	});
};

let insertQuery3 = (values) => {
	console.log(values);
	return new Promise((resolve, reject) => {
		let sql = "INSERT INTO `tb_notification` SET ?";
		connection.query(sql, [values], (err, result) => {
			console.log(err, result)
			if(err) {
				reject(err);
			} else {
				console.log("sahi hai");

				let condition = values.notification_id;
				console.log(condition);
				let sql = "SELECT * from `tb_notification` WHERE `notification_id` = ?";
				console.log(err, result);
				connection.query(sql, [condition], (err, result) => {
					if(err) {
						reject(err);
					} else {
						resolve(result);updateQuery1
					}
				})
			}
		});
	});
};


let selectQuery3 = (value) => {
	// console.log(value1, value2);
	// value1 = JSON.stringify(value1);
	// value2 = JSON.stringify(value2);
	//console.log(value1, value2);
	return new Promise((resolve, reject) => {
		//let sql = `SELECT * from tb_user where (user_id not in (SELECT user_id from tb_followers) AND (college_name = "${value.college_name}")) AND (user_id NOT IN ("${value.user_id}"))`;
		//let sql  = `SELECT * from tb_user where (user_id not in (SELECT user_id from tb_followers) AND user_id not in (SELECT reciever_id from tb_follow_request WHERE request_status = 0 OR request_status = 1)) AND ((college_name = "${value.college_name}") AND (user_id NOT IN ("${value.user_id}")))`;
		//let sql = `SELECT * FROM tb_user WHERE (( user_id NOT IN ( SELECT reciever_id FROM tb_follow_request WHERE request_status IN(0,1) ) AND tb_user.college_name = "${value.college_name}" ) AND tb_user.user_id NOT IN("${value.user_id}"))`
		let sql = `select* from tb_user where user_id not in (select reciever_id from tb_follow_request where
					request_status in (0,1) AND user_id = "${value.user_id}")
					 AND college_name = "${value.college_name}" AND user_id NOT IN ("${value.user_id}")`;
		connection.query(sql, Object.values(value), (err, results) => {
			if(err) {
				console.log(err);
				reject(err);
			} else {
				console.log(results);
				resolve(results);
			}
		})
	})
}
let selectQuery4 = (value) => {
	return new Promise((resolve, reject) => {
		let sql = `SELECT * FROM tb_followers WHERE follower_id = "${value.user_id}" OR user_id = "${value.user_id}"`;
		connection.query(sql, Object.values(value), (err, results) => {
			if(err) {
				reject(err);
			} else {
				resolve(results);
			}
		})
	})
}

let selectQuery5 = (value) => {
	console.log(value);
	return new Promise((resolve, reject) => {
		let sql = `SELECT * from tb_user_pivot where ?`;
		connection.query(sql, [value], (err, result) => {
			console.log(result, err);
			if(err) {
				reject(err) 
			} else {
				console.log(result);
				resolve(result[0])
			}
		})
	})
}

let deletequery = (value) => {
	console.log("delete part calling")
	console.log(value);
	return new Promise((resolve, reject) => {
		let sql = `DELETE from tb_follow_request WHERE user_id = ? AND reciever_id = ?`;
		connection.query(sql, Object.values(value), (err, result) => {
			if(err) {
				console.log(err);
				reject(err) 
			} else {
				resolve(result[0])
			}
		})
	})

}


// create by shadab saifi

let selectQuery6 = (value) => {
	
	return new Promise((resolve, reject) => {
		let sql = `SELECT * FROM tb_notification WHERE user_id = ?`;
		connection.query(sql, Object.values(value), (err, results) => {
			if(err)
				reject(err);
			else
				resolve(results);
		})
	})
}

let updateQuery1 = (value)=>{

	return new Promise((resolve, reject) => {
		let sql = `UPDATE tb_user SET is_notification = case WHEN is_notification = 1 THEN 0 WHEN is_notification = 0 THEN 1 END WHERE user_id = ?`;
		connection.query(sql, Object.values(value),(err, result) =>{
			if(err)
				reject(err);
			else {
				let sql  = `SELECT * FROM  tb_user WHERE user_id = ?`;
				connection.query(sql, Object.values(value), (err, results) => {
					if(err)
						reject(err);
					else
						resolve(results[0]);
				})
			}
		})
	})
}



export default {
	
	insertQuery,
	selectQuery,
	selectQuery2,
	updateQuery,
	insertQuery2,
	selectQuery3,
	selectQuery4,
	selectQuery5,
	deletequery,
	insertQuery3,
	selectQuery6,
	updateQuery1

}


