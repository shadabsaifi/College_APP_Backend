import commFunc from '../Modules/commonFunction';
import responses from '../Modules/responses';
import constant from '../Modules/constant';
import connection from '../Modules/connection.js';
import PUSH_MESSAGE from '../Modules/FCM';
import followModel from '../Modals/follow_model';
import config from '../config/development';
import md5 from 'md5';
import _ from 'lodash';
import async from 'async';
let arr = [];

exports.send_request = (req, res) => {
	let { reciever_id, device_type, device_token } =req.body ;

	let user_id = req.user.user_id ;

	let manKeys = ["reciever_id", "device_type", "device_token"];

	let manValues = {reciever_id, device_type, device_token};
	let current_date = new Date();
	let created_on = Math.round(current_date.getTime() / 1000);
	let request_id =  md5(new Date());
	let request_status = 0 ;
	console.log( md5(new Date()));
	console.log(request_id);

	let values = { reciever_id, request_id , request_status, user_id,created_on};
	let condition ={ user_id, reciever_id };

	commFunc.checkKeyExist(manValues, manKeys)
	.then(result => {
		if(result.length) {
			responses.parameterMissing(res,result[0])
		} else {
			followModel.selectQuery(condition)
			.then((results) => {
				if(results.length) {
					followModel.deletequery(condition)
					.then((deleteResult) => {
						responses.success2(res,deleteResult);
					}).catch((error) => responses.sendError(error.message, res));
				
				} else {
					// console.log("insert part calling");
					followModel.insertQuery(values)
					.then((followResults) => {
						// console.log("here is the follow result after insert");
						// console.log(followResults);
						//let user_id = followResults[0].reciever_id;
						let sql = `SELECT * FROM tb_user LEFT JOIN tb_user_pivot ON ( tb_user.user_id = tb_user_pivot.user_id ) WHERE tb_user_pivot.user_id = ?`;
		                connection.query(sql, [user_id], (err, results) => {
		                    console.log("***********************");
		                    console.log(err, results);
		                    console.log("***********************");
		                    if(err) {value
		                        responses.sendError(error.message, res);
		                    } else {
		                        let user_id = followResults[0].reciever_id;
		                        let sql = `SELECT * FROM tb_user LEFT JOIN tb_user_pivot ON ( tb_user.user_id = tb_user_pivot.user_id ) WHERE tb_user_pivot.user_id = ?`;
		                        connection.query(sql, [user_id], (err, result) => {
		                           // console.log(err, result);
		                            if(err) {
		                                responses.sendError(error.message, res);
		                            } else {
		                                // console.log("***********************");
		                                // console.log(result);
		                                // console.log("************************");
		                                let device_token = result &&result.length && result[0].device_token || "";
		                                let device_type = result && result.length && result[0].device_type || "";
		                                let title = `${result[0].user_name} You have a new message`;
		                                let notify = {    
		                                    body: `${results[0].user_name} sent you connection request.`,
		                                    click_action: "FCM_PLUGIN_ACTIVITY",
		                                    "color": "#f95b2c",
		                                    "sound": true
		                                };
		                                console.log(device_type, device_token, notify, title);

		                                let notification_id = md5(new Date());
		                                let send_by =results && results.length && results[0].user_id || "";
		                                let send_to = result && result.length && result[0].user_id|| "";
		                                let notification_text =  notify.body;value
		                                let notification_type = 1;
		                                let current_date = new Date();value
		                                let created_at = Math.round(current_date.getTime() / 1000);
		                                let payload = {user_id:results[0].user_id,notify,notification_type};value
		                                console.log(payload);
		                                let data = {notification_id, send_by, send_to, notification_text, notification_type, created_at};
		                                console.log(data);
		                                console.log("Notification pe aa gya ab save hoga");
		                                let sql = `INSERT INTO tb_notification SET ?`;
		                                connection.query(sql, [data], (err, result) => {
		                                    if(err) {
		                                       responses.sendError(err.message, res); 
		                                    } else {
		                                    PUSH_MESSAGE.push_notification("AIzaSyCN0Kd_tmsbC3f5x2NTi2o5GtoDnFIO7NE", device_token,device_type, payload, notify, function(error, resp) {
		                                        console.log({error, resp})
		                                    });

		                                    // let user_id =  postResult[0].user_id ;
		                                    // let condition = {"user_id" : user_id } ;
		                                    // UserModel.selectQuery(condition)
		                                    // .then(results => {
		                                        responses.success(res, followResults);                             
		                                    // })
		                                    // .catch((error) =>responses.sendError(error.message, res));
		                                    }
		                                })
		                            }
		                        })
		                    }
		                })
						//***********code for push notification**********************//
						//responses.success(res, followResults[0]);
					}).catch((error) => responses.sendError(error.message, res));
				}
			}).catch((error) => responses.sendError(error.message, res));
		}
	}).catch((error) => responses.sendError(error.message, res));
};

exports.show_request = (req, res) => {
	let reciever_id = req.user.user_id;
	let condition = {"reciever_id" : reciever_id, "request_status" : 0 };

	followModel.selectQuery2(condition)
	.then((userResult) =>{
		console.log("::::::::::::::::::::::::");
		console.log(userResult);
		console.log("::::::::::::::::::::::::");
		async.eachSeries(userResult, get_user_details, (results) => { 
			responses.success(res, arr);
			arr = [];
		})
		function get_user_details(userResult, callback) {
			async.parallel([
		        function(callback) {
		            get_user_result(userResult, function(total_user_result){
		                callback(null,total_user_result)
		            });
		        }
		    ],function(err, results) {
		    	userResult.total_user_result = results[0];
		    	arr.push(userResult);
            	callback();
			})
			function get_user_result(userResult, callback) {
				let user_id = userResult.user_id;
				let sql = "SELECT * FROM `tb_user` where `user_id` = ? ";
				connection.query(sql, [user_id], (err, result) =>{
					if(err) {
						callback(0);
					} else {
						callback(result[0]);
					}
				})
			}
		}

	}).catch((error) => responses.sendError(error.message, res));
};

 exports.accept_request =(req, res) => {
 	let reciever_id = req.user.user_id;
 	let {user_id, request_status, request_id} = req.body; 
 	let updateData = {request_status};
 	let condition ={request_id};
 	let manKeys = ["user_id" , "request_status"];
 	let manValues = {user_id, request_status};

	commFunc.checkKeyExist(manValues, manKeys)
 	.then((result) => {
		if(result.length) {
			responses.parameterMissing(res,result[0]);
		} else {
			followModel.updateQuery(updateData, condition)
			.then((updateResult) => {
				console.log(updateResult);
				if(request_status == 1) {
					console.log("accept k anadar aaya ");
					let follower_id = updateResult.user_id;
					let user_id = updateResult.reciever_id;
					let follow_id  = md5(new Date());
					let current_date = new Date();
					let is_follow = 1;
					let created_on = Math.round(current_date.getTime() / 1000);
					let insertData = {follow_id, follower_id, user_id, follow_id, created_on};
					followModel.insertQuery2(insertData)
					.then((Results) => {
					 	let sql = `SELECT * FROM tb_user LEFT JOIN tb_user_pivot ON ( tb_user.user_id = tb_user_pivot.user_id ) WHERE tb_user_pivot.user_id = ?`;
		                connection.query(sql, [user_id], (err, results) => {
		                    console.log("***********************");
		                    console.log(err, results);
		                    console.log("***********************");
		                    if(err) {
		                        responses.sendError(error.message, res);
		                    } else {
		                        let user_id = req.user.user_id;
		                        let sql = `SELECT * FROM tb_user LEFT JOIN tb_user_pivot ON ( tb_user.user_id = tb_user_pivot.user_id ) WHERE tb_user_pivot.user_id = ?`;
		                        connection.query(sql, [user_id], (err, result) => {
		                           // console.log(err, result);
		                            if(err) {
		                                responses.sendError(error.message, res);
		                            } else {
		                                // console.log("***********************");
		                                // console.log(result);
		                                // console.log("************************");
		                                let device_token = result &&result.length && result[0].device_token || "";
		                                let device_type = result && result.length && result[0].device_type || "";
		                                let title = `${result[0].user_name} You have a new message`;
		                                let notify = {    
		                                    body: `${results[0].user_name} accept you connection request.`,
		                                    click_action: "FCM_PLUGIN_ACTIVITY",
		                                    "color": "#f95b2c",
		                                    "sound": true
		                                };
		                                console.log(device_type, device_token, notify, title);

		                                let notification_id = md5(new Date());
		                                let send_by =results && results.length && results[0].user_id || "";
		                                let send_to = result && result.length && result[0].user_id|| "";
		                                let notification_text =  notify.body;
		                                let notification_type = 2;
		                                let current_date = new Date();
		                                let created_at = Math.round(current_date.getTime() / 1000);
		                                let payload = {user_id:results[0].user_id,notify,notification_type};
		                                console.log(payload);
		                                let data = {notification_id, send_by, send_to, notification_text, notification_type, created_at};
		                                console.log(data);
		                                console.log("Notification pe aa gya ab save hoga");
		                                let sql = `INSERT INTO tb_notification SET ?`;
		                                connection.query(sql, [data], (err, result) => {
		                                    if(err) {
		                                       responses.sendError(err.message, res); 
		                                    } else {
		                                    PUSH_MESSAGE.push_notification("AIzaSyCN0Kd_tmsbC3f5x2NTi2o5GtoDnFIO7NE", device_token,device_type, payload, notify, function(error, resp) {
		                                        console.log({error, resp})
		                                    });

		                                    // let user_id =  postResult[0].user_id ;
		                                    // let condition = {"user_id" : user_id } ;
		                                    // UserModel.selectQuery(condition)
		                                    // .then(results => {
		                                        responses.success(res, Results[0]);                             
		                                    // })
		                                    // .catch((error) =>responses.sendError(error.message, res));
		                                    }
		                                })
		                            }
		                        })
		                    }
		                })
						//***************** code for push notification ****************//
						//responses.success(res, Results[0]);
					}).catch((error) => responses.sendError(error.message, res));
				} else if(request_status == 2){
					console.log("reject kr diya");
					responses.success(res, updateResult[0]);
				}

			}).catch((error) =>{console.log(error); responses.sendError(error.message, res)});
		}
	}).catch((error) => {console.log(error); responses.sendError(error.message, res)});

 };

 exports.show_user = (req, res) => {

 	let user_id = req.user.user_id;
 	let {college_name} = req.body;
 	// user_id = {"user_id" : user_id};
 	// let {college_name} = req.body;
 	// college_name = {"college_name" : college_name};
 	// college_name = {"college_name" : college_name};
 	let manKeys = ["college_name"];
 	let manValues = {college_name};

 	console.log(user_id, college_name);

 	commFunc.checkKeyExist(manValues,manKeys)
 	.then((result) => {
 		followModel.selectQuery3({college_name, user_id})
 		.then((userResult) => {
 			responses.success(res, userResult);
 		}).catch((error) => responses.sendError(error.message, res));			
 		
 	}).catch((error) => responses.sendError(error.message, res)); 
 };


 exports.show_friends = (req, res) => {
 	let user_id = req.user.user_id;
 	let condition = {user_id};
 	console.log(condition);
 	followModel.selectQuery4(condition)
 	.then((friendResult) => {
 		console.log(":::::::::::::::::::::::");
 		console.log(friendResult);
 		console.log(":::::::::::::::::::::::");
 		async.eachSeries(friendResult, get_user_details, (results) => {
			responses.success(res, arr);
			arr = [];
		})
	 	function get_user_details(userResult, callback) {
	 		console.log(userResult);
	 		console.log("INSIDE get_user_details");
	 		console.log(userResult.user_id == user_id);
	 		console.log(userResult.follower_id == user_id);
	 		console.log("::::::::::::::::::::::::::::::::::");
	 		if(userResult.follower_id == user_id) {
	 			console.log("1");
	 			user_id = userResult.user_id ;	
	 		} else {
	 			user_id = userResult.follower_id;
	 		}	
			// let user_id = userResult.follower_id ;
			let sql = "SELECT * FROM `tb_user` where `user_id` = ? ";
			connection.query(sql, [user_id], (err, result) =>{
				if(err) {
					callback(0);
				} else {
					arr.push(result[0]);
					callback();
				}
			})
		}
	 }).catch((error) => responses.sendError(error.message, res));
	
 
}

// create by shadab saifi

exports.notification = (req, res)=>{

	let { user_id } = req.query;
	let condition =  { send_to:user_id }
	let manKeys = ["user_id"];
	let manValues = { user_id };
	commFunc.checkKeyExist(manValues, manKeys)
	.then((result) => {
		if(result.length) {
			responses.parameterMissing(res,result[0]);
		}
		else{
			followModel.selectQuery6(condition).
			then(notification=>{
				responses.success(res, notification);
			})
			.catch((error) => responses.sendError(error.message, res));
		}
	})
	.catch((error) => responses.sendError(error.message, res));
}

exports.onOffNotification = (req, res)=>{
	// let { user_id, is_notification } = req.body;
	let { user_id } = req.query;
	let condition =  { user_id };
	// if(is_notification === 0 || is_notification === 1)
	// 	is_notification = "No"
	// else
	// 	is_notification = ""
	// let manKeys = ["user_id", "is_notification"];
	let manKeys = ["user_id"];
	// let manValues = { user_id, is_notification };
	let manValues = { user_id };
	commFunc.checkKeyExist(manValues, manKeys)
	.then((result) => {
		if(result.length) {
			responses.parameterMissing(res,result[0]);
		}
		else{
			followModel.updateQuery1(condition).
			then(notification=>{
				responses.success(res, notification);
			})
			.catch((error) => responses.sendError(error.message, res));
		}
	})
	.catch((error) => responses.sendError(error.message, res));
}

exports.getContent = (req, res)=>{
	
}
