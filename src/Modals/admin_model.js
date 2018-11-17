import connection from '../Modules/connection.js';
import responses from '../Modules/responses';
import constant from '../Modules/constant';
import commonfunc from '../Modules/commonFunction';

let selectQuery = (values) => {
	return new Promise((resolve, reject) => {
		let sql = "SELECT * FROM `tb_admin` WHERE ?";
		connection.query(sql, [values], (err, result) => {
			console.log("err===>>>>",err)
			console.log("result===>>>>",result)
			err ? reject(err) : resolve(result)
			console.log (result);
		});
	});
};

let updateQuery = (values, condition) => {
	console.log( values, condition);
	return new Promise((resolve, reject) => {
		let sql = "UPDATE `tb_admin` SET ? WHERE ?";
		connection.query(sql, [values, condition], (err, result) => {
			if (err) {
				reject(err);
			} else {
				let sql = "SELECT * FROM `tb_admin` WHERE ?";
				connection.query(sql, [condition], (err, result) => {
					
					err ? reject(err) : resolve(result);
				});
			}
		});
	});
};



let sendOtp = (verification_code, mobile_number) => {
	let sql = "SELECT * FROM `tb_admin` WHERE `mobile_number`=?";
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


export default {
	selectQuery,
	updateQuery,
	sendOtp
}