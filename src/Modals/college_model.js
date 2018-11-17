import connection from '../Modules/connection.js';
import responses from '../Modules/responses';
import constant from '../Modules/constant';
import commonfunc from '../Modules/commonFunction';

let selectQuery = (values) => {
	return new Promise((resolve, reject) => {
		let sql = "SELECT * FROM `tb_college` WHERE ?";
		connection.query(sql, [values], (err, result) => {
			err ? reject(err) : resolve(result)
		});
	});
};

let selectQuery1 = (values) => {
	
	return new Promise((resolve, reject) => {
		let sql = "SELECT * FROM `tb_college_pivot` WHERE ?";
		connection.query(sql, [values], (err, result) => {
			if(err) { reject(err) } else{
				console.log(result); 
				resolve(result);
			}
		});
	});
};
let selectQuery2 = (values) => {
	return new Promise((resolve, reject) => {
		let sql =  `SELECT * FROM tb_college WHERE social_type ="${values.social_type}" AND social_id="${values.social_id}"`;
		connection.query(sql, Object.values(values), (err, result) => {
			err ? reject(err) : resolve(result)
			console.log(result[0]);
		});
	});
};

let selectQuery4 = (values1, values2) => {
	return new Promise((resolve, reject) => {
		let sql = "SELECT * FROM `tb_college` WHERE ? NOT IN (?)";
		connection.query(sql, [values1, values2], (err, result) => {
			err ? reject(err) : resolve(result)
			console.log(result);
		});
	});
};

let updateQuery1 = (values, condition) => {
	console.log (values, condition);
	return new Promise((resolve, reject) => {
		let sql = "UPDATE `tb_college_pivot` SET ? WHERE ?";
		connection.query(sql, [values, condition], (err, result) => {
			if (err) {
				reject(err);
			} else {
				console.log ("inside");
				let sql = "SELECT * FROM `tb_college_pivot` WHERE ?";
				connection.query(sql, [condition], (err, result) => {
					//let {password, ...output} = result[0];
					err ? reject(err) : resolve(result[0]);
					
				});
			}
		});
	});
};
let updateQuery = (values, condition) => {
	console.log(values, condition);
	return new Promise((resolve, reject) => {
		let sql = "UPDATE `tb_college` SET ? WHERE ?";
		connection.query(sql, [values, condition], (err, result) => {
			if (err) {
				reject(err);
			} else {
				let sql = "SELECT * FROM `tb_college` WHERE ?";
				connection.query(sql, [condition], (err, result) => {
					console.log (result);
					//let {password, ...output} = result[0];
					err ? reject(err) : resolve(result);
				});
			}
		});
	});
};

let sendOtp = (verification_code, mobile_number) => {
	let sql = "SELECT * FROM `tb_college` WHERE `mobile_number`=?";
	connection.query(sql, [mobile_number], (err, result) =>{
		if (err) {
			responses.sendError(err.message, res);
		} else {
			if (result.length > 0 ) {
				commonfunc.sendotp(verification_code, mobile_number);
			} else {
				// Number not found 
			}
		}
	});
};

let sendMail = (res, mobile_number) => {
	let sql = "SELECT * FROM `tb_college` WHERE `mobile_number`=?";
	connection.query(sql, [mobile_number], (err, result) =>{
		if (err) {
			responses.sendError(err.message, res);
		} else {
			if (result.length > 0 ) {
				// Twillo.sendOTP()
			} else {
				// Number not found 
			}
		}
	});
};

let insertQuery = (values) => {
	return new Promise((resolve, reject) => {
		let sql = "INSERT INTO `tb_college` SET ?";
		connection.query(sql, [values], (err, result) => {
			if (err) {reject(err);}
			else {
				// message.sendOtp
				// email.sendMail
				let sql = "SELECT * FROM `tb_college` WHERE college_id=?";
				connection.query(sql, [values.college_id], (err, result) => {
					//let {password, ...output} = result;
					err ? reject(err) : resolve(result);
				});
			}
		});
	});
}

let insertQuery1 = (values) => {
	return new Promise((resolve, reject) => {
		let sql = "INSERT INTO `tb_college_pivot` SET ?";
		connection.query(sql, [values], (err, result) => {
			if (err) {reject(err);}
			else {
				// message.sendOtp
				// email.sendMail
				let sql = "SELECT * FROM `tb_college_pivot` WHERE college_id=?";
				connection.query(sql, [values.college_id], (err, result) => {
					//let {row_id,college_id, ...output} = result[0];
					err ? reject(err) : resolve(result);
				});
			}
		});
	});
}
let insertQuery3 = (values) => {
	return new Promise((resolve, reject) => {
		let sql = "INSERT INTO `tb_college_pages` SET ?";
		connection.query(sql, [values], (err, result) => {
			if (err) {reject(err);}
			else {
				// message.sendOtp
				// email.sendMail
				let sql = "SELECT * FROM `tb_college_pages` WHERE college_id=?";
				connection.query(sql, [values.college_id], (err, result) => {
					//let {row_id,college_id, ...output} = result[0];
					err ? reject(err) : resolve(result);
				});
			}
		});
	});
}


let deleteQuery = (data , condition) => {
	return new Promise((resolve, reject) => {
		let sql = "DELETE  ? FROM `tb_college_pivot` WHERE ?";
		connection.query (sql ,[data , condition] , (err,result) =>{ 
				if(err){reject(err);}
				else{
			let sql = "SELECT * FROM `tb_college_pivot` WHERE ?";
			connection.query(sql, [values], (err, result) => {
				err ? reject(err) : resolve(result)
			});
		}})
	});
};
let selectQuery3 = (values) => {
	return new Promise((resolve, reject) => {
		let sql = "SELECT * FROM `tb_college_pages` WHERE ?";
		connection.query(sql, [values], (err, result) => {
			err ? reject(err) : resolve(result)
		});
	});
};





export default {
	selectQuery,
	updateQuery1,
	selectQuery2,
	sendOtp,
	sendMail,
	insertQuery,
	insertQuery1,
	updateQuery,
	selectQuery1,
	deleteQuery,
	selectQuery4,
	selectQuery3,
	insertQuery3
}