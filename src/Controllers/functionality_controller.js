import commFunc from '../Modules/commonFunction';
import responses from '../Modules/responses';
import constant from '../Modules/constant';
import connection from '../Modules/connection.js';
import functionalityModel from '../Modals/functionality_model';
import UserModel from '../Modals/user_model';
import config from '../config/development';
import md5 from 'md5';
import _ from 'lodash';
import async from 'async';


exports.block_user = (req, res) => {
	let user_id = req.user.user_id;
	let { block_user_id } = req.body;
	let manKeys = ["block_user_id"];
	let manValues = {block_user_id}; 
	commFunc.checkKeyExist(manValues, manKeys)
	.then(result => { 
		if(result.length) {
			throw new Error(responses.parameterMissing(res, result[0])); 
		} else {
			let condition = {user_id, block_user_id};
			functionalityModel.selectQuery(condition)
			.then((Results) => {
				if(Results) {
					let response = {
						response: {},
						message: "User already blocked."
					};
					res.status(constant.responseFlags.INVALID_CREDENTIAL).json(response);
				} else  {
					let current_date = new Date();
					let block_id = md5(current_date);
					let created_at = Math.round(current_date.getTime() / 1000);
					let is_block = 1;
					let data = {user_id, block_id, block_user_id, created_at, is_block}
					functionalityModel.insertQuery(data)
					.then((blockResult) => {
						console.log(blockResult);
						responses.success(res, blockResult);
					}).catch((error) => responses.sendError(error.message, res));
			
				}
			})
			
		}
	}).catch((error) => responses.sendError(error.message, res));
}


exports.report_post = (req, res) => {
	let user_id = req.user.user_id;
	let {post_id} = req.body;
	let manKeys = ["post_id"];
	commFunc.checkKeyExist(req.body, manKeys)
	.then(result => { 
		if(result.length) {
			throw new Error(responses.parameterMissing(res, result[0])); 
		} else {
			let current_date = new Date();
			let created_at = Math.round(current_date.getTime() / 1000);
			let report_id = md5(current_date);
			let data = {post_id,report_id, user_id, created_at};
			functionalityModel.insertQuery2(data)
			.then((reportResult) => {
				responses.success(res, reportResult);
			}).catch((error) => responses.sendError(error.message, res));
		}
	}).catch((error) => responses.sendError(error.message, res));
}

exports.set_preference = (req, res) => {
	console.log("PEREFRENCE")
	console.log(req.body);
	let user_id = req.user.user_id;
	let {user_preference} = req.body;
	let manKeys = ["user_preference"];
	commFunc.checkKeyExist(req.body, manKeys)
	.then(result => { 
		if(result.length) {
			throw new Error(responses.parameterMissing(res, result[0])); 
		} else {
			user_preference  = user_preference.toString();
			let condition = {user_id};
			let values = {user_preference};
			UserModel.updateQuery(values, condition)
			.then((Result) => {
				responses.success(res, Result);
			}).catch((error) => responses.sendError(error.message, res));
		}
	}).catch((error) => responses.sendError(error.message, res));
}

exports.set_college = (req, res) => {
  	let {college_name, state} = req.body;
  	let current_date = new Date();
	let college_id = md5(current_date);
	let created_at = Math.round(current_date.getTime() / 1000);
	let manKeys = ["college_name", "state"]
	let insertData = {college_name, state,college_id,created_at}
	commFunc.checkKeyExist(req.body, manKeys)
	.then(result => { 
		if(result.length) {
			throw new Error(responses.parameterMissing(res, result[0])); 
		} else {
			functionalityModel.insertQuery3(insertData)
			.then((collegeResult) => {
				responses.success(res, collegeResult);
			}).catch((error) => responses.sendError(error.message, res));
		}
	}).catch((error) => responses.sendError(error.message, res));
}

exports.get_college = (req, res) => {
  	
	functionalityModel.selectQuery1()
	.then((collegeResult) => {
		responses.success(res, collegeResult);
	}).catch((error) => responses.sendError(error.message, res));
}

// exports.college_ranking = (req, res) =>{
// 	functionalityModel.select2()
// 	.then((collegeResult)=> {
// 		async.eachSeries(collegeResult, get_post_list, (results) =>{
// 			responses.success(res, allData3);
// 			postArray = [];
// 		})
// 		function get_post_list(postResult, callback) => {
// 			let post_id = postResult.post_id;
// 			function get_post_list(postResult, callback) {
//                 async.parallel([
//                     //calling count of like
//                     function(callback) {
//                         total_like_count(postResult.post_id, function(total_like_count_result){
//                             callback(null,total_like_count_result)
//                         });
//                     },
//                     //calling comment list
                    
//                     function(callback) {
//                         total_comment_count(postResult.post_id, function(total_comment_count_result){
//                             callback(null,total_comment_count_result)
//                         });
                    
//                     },
//                     function(callback) {
//                         total_post_share(postResult.post_id, function(total_comment_count_result){
//                             callback(null,total_comment_count_result)
//                         });
                    
//                     }
//                 ], function(err, results) {
//                     postResult.total_like_count = results[0];
//                     postResult.total_comment_count = results[1];
//                     postResult.total_post_share = results[2];
//                     postArray.push(postResult);
//                     callback();
//                 });

//                 function total_like_count(post_id, callback) {
//                     let sql = "SELECT * FROM `tb_post_like` WHERE `post_id`=?";
//                     connection.query(sql, [post_id], (err, result) => {
//                         err ? callback(0) : callback(result.length);
//                     })
//                 }
// 				function total_comment_count(post_id, callback) {
//                     let sql = "SELECT * FROM `tb_post_comment` WHERE `post_id`=?";
//                     connection.query(sql, [post_id], (err, result) => {
//                         err ? callback(0) : callback(result.length);
//                     })
//                 }
//                 function total_post_share(post_id, callback) {
//                     let sql = "SELECT * FROM `tb_post_share` WHERE `post_id`=?";
//                     connection.query(sql, [post_id], (err, result) => {
//                         err ? callback(0) : callback(result.length);
//                     })
//                 }
//             }

// 		}
// 	})
// }
		



