import connection from '../Modules/connection.js';
import responses from '../Modules/responses';
import constant from '../Modules/constant';
import commonfunc from '../Modules/commonFunction';



let insertQuery = (values) => {
	return new Promise((resolve, reject) => {
		let sql = "INSERT INTO `tb_user_block` SET ?";
		connection.query(sql, [values], (err, result) => {
			if (err) {reject(err);}
			else {
				// message.sendOtp
				// email.sendMail
				let sql = "SELECT * FROM `tb_user_block` WHERE block_id=?";
				connection.query(sql, [values.block_id], (err, result) => {
					//let {password, ...output} = result[0];
					err ? reject(err) : resolve(result[0]);
				});
			}
		});
	});
}
let insertQuery2 = (values) => {
	return new Promise((resolve, reject) => {
		let sql = "INSERT INTO `tb_report_post` SET ?";
		connection.query(sql, [values], (err, result) => {
			if (err) {reject(err);}
			else {
				// message.sendOtp
				// email.sendMail
				let sql = "SELECT * FROM `tb_report_post` WHERE report_id=?";
				connection.query(sql, [values.report_id], (err, result) => {
					//let {password, ...output} = result[0];
					err ? reject(err) : resolve(result[0]);
				});
			}
		});
	});
}

let selectQuery = (values) => {
	console.log(values)
	return new Promise((resolve, reject) => {
		let sql = `SELECT * FROM tb_user_block WHERE user_id ="${values.user_id}" AND block_user_id ="${values.block_user_id}"`;
		connection.query(sql, Object.values(values), (err, result) => {
			console.log(result);

			err ? reject(err) : resolve(result[0]);
		});
	});
};

let insertQuery3 = (values) => {
	return new Promise((resolve, reject) => {
		let sql = "INSERT INTO `tb_colleges_list` SET ?";
		connection.query(sql, [values], (err, result) => {
			if (err) {reject(err);}
			else {
				// message.sendOtp
				// email.sendMail
				let sql = "SELECT * FROM `tb_colleges_list` WHERE college_id=?";
				connection.query(sql, [values.college_id], (err, result) => {
					//let {password, ...output} = result[0];
					err ? reject(err) : resolve(result[0]);
				});
			}
		});
	});
}

let selectQuery1 = () => {
	
	return new Promise((resolve, reject) => {
		let sql = `SELECT college_id, college_name FROM tb_colleges_list `;
		connection.query(sql, [], (err, result) => {
			console.log(result);

			err ? reject(err) : resolve(result);
		});
	});
};


export default {
	insertQuery,
	insertQuery2,
	selectQuery,

	selectQuery1,

	insertQuery3
};