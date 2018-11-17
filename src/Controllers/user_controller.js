import commFunc from '../Modules/commonFunction';
import responses from '../Modules/responses';
import constant from '../Modules/constant';
import UserModel from '../Modals/user_model';
import config from '../config/development';
import md5 from 'md5';
import _ from 'lodash';

let arr = [];

exports.manual_login = (req, res) => {
	
	let {email, password, device_type, device_token, latitude, longitude} = req.body;
	let manKeys = ["email", "password", "device_type", "device_token", "latitude", "longitude"];
	let condition  = {email};
	let encrypt_password = md5(password);
	let access_token = md5(new Date());
	let updateData = {access_token, device_type, device_token, latitude, longitude};
	commFunc.checkKeyExist(req.body, manKeys)
	.then(result => { 
		if(result.length) {
			throw new Error(responses.parameterMissing(res, result[0])); 
		} else {
			UserModel.selectQuery(condition)
			.then(userResult=> {
				if (userResult.length == 0) {
					let response = {
						response: {},
						message: "Email is not found."
					};
					res.status(constant.responseFlags.INVALID_CREDENTIAL).json(response)
				} else { 
					if (userResult[0].password != encrypt_password) {
						responses.invalidCredential(res, constant.responseMessages.INCORRECT_PASSWORD)
					} else {
						let user_id = userResult[0].user_id;
						let condition = {user_id}
					 	UserModel.updateQuery1(updateData, condition)
						.then((userResponse) => { 
							UserModel.selectQuery(condition)
							.then((userResult) =>{
								userResult[0].password = "";
								let obj = Object.assign(userResponse, userResult[0]);
	            				responses.success(res, obj);
							}).catch((error) => responses.sendError(error.message, res));
						}).catch((error) => responses.sendError(error.message, res));
					}
				}
			}).catch((error) => responses.sendError(error.message, res));
		}
	}).catch((error) => responses.sendError(error.message, res));
};

exports.manual_signup = (req, res) => {
	let {email, password,name,  device_type, device_token, latitude, longitude} = req.body;
	let manKeys = ["email", "password","name",  "device_type", "device_token", "latitude", "longitude"];
	let condition  = {email};
	let emailRegex = "^([a-zA-Z0-9_.]+@[a-zA-Z0-9]+[.][.a-zA-Z]+)$";

	commFunc.checkKeyExist(req.body, manKeys)
	.then(result => {
		if(result.length) {
			responses.parameterMissing(res,result[0]);
		} else {

			if(!email.match(emailRegex)) {
				responses.invalidemailformat(res);
			} else {
				if(password.length < 8) {
					responses.invalidpasswordformt(res);
				} else {
					UserModel.selectQuery(condition)
					.then(userResult=> { 
						if (userResult.length != 0) {
				        	let response = {
								response: {},
								message: "Email already registered."
							};
							res.status(constant.responseFlags.INVALID_CREDENTIAL).json(response);
						} else { 
							let access_token = md5(new Date());
					 		let user_id = md5(new Date());
					 		let current_date = new Date();
					 		password = md5(password);
							let created_on = Math.round(current_date.getTime() / 1000);
					 		let updated_on =  Math.round(current_date.getTime() / 1000);
					 		let insertData1 = {user_id, email,name, password, created_on};
							let insertData2 = {user_id , access_token , device_type, device_token, latitude, longitude,updated_on};
							UserModel.insertQuery(insertData1)
	                    	.then((userResponse) => {
	                        	UserModel.insertQuery1(insertData2).then((Response) => {
	                            	let obj = Object.assign(userResponse, Response);
	                            	responses.success(res, obj)
	                   			}).catch((error) => responses.sendError(error.message, res));
	                		}).catch((error) => responses.sendError(error.message, res));
	                    }
	        		}).catch((error) => responses.sendError(error.message, res));
			
				}
			}
		}
	}).catch((error) => responses.sendError(error.message, res));
};

exports.social_signup = (req, res) => {
	console.log("signup");
	let insertData1 = "";
	let { social_type, social_id, name, device_type,device_token,latitude, longitude } = req.body;
	let manKeys = ["social_type","social_id", "name", "device_type", "device_token", "latitude", "longitude"];
	let condition = {social_id};
	
	commFunc.checkKeyExist(req.body, manKeys)
	.then(result => result.length ? new Promise  (new Error(responses.parameterMissing(res,result[0]))) : '')
	.then(result => {
		UserModel.selectQuery(condition)
		.then(userResult=> {
			if( userResult.length ) {
				responses.invalidCredential(res, constant.responseMessages.SOCIAL_ID__ALREADY_EXIST)
			} else {
				let access_token = md5(new Date());
				let current_date = new Date();
			 	let user_id = md5(new Date());
			 	let created_on = Math.round(current_date.getTime() / 1000);
			 	let updated_on =  Math.round(current_date.getTime() / 1000);
			 	let insertData1 = {user_id, social_type,social_id, created_on,name};
				let insertData2 = {user_id , access_token , device_type, device_token, latitude, longitude,updated_on};
				UserModel.insertQuery(insertData1)
	            .then((userResponse) => {
	                UserModel.insertQuery1(insertData2).then((Response) => {
	                	let obj = Object.assign(userResponse, Response);
	                    responses.success(res, obj)
					})
	                .catch((error) => responses.sendError(error.message, res));
	            })
	            .catch((error) => responses.sendError(error.message, res));
	        }
        }).catch((error) => responses.sendError(error.message, res));
	}).catch((error) => responses.sendError(error.message,res));
};

exports.social_login = (req, res) => {
	let {social_type,social_id, device_type, device_token, latitude, longitude} = req.body;
	let manKeys = ["social_type", "social_id", "device_type", "device_token", "latitude", "longitude"];
	let condition  = { social_type , social_id };
	let access_token = md5(new Date());
	let updateData = {access_token, device_type, device_token, latitude, longitude};
	
	commFunc.checkKeyExist(req.body, manKeys)
	.then(result => result.length ? responses.parameterMissing(res, result[0]) : '')
	.then(result => {
		UserModel.selectQuery2(condition)
		.then(userResult=> {
			if(userResult.length == 0) { 
				responses.invalidCredential(res, constant.responseMessages.USER_NOT_EXIST);
			} else {
				// .then(userResult=> userResult.is_mobile_number_verified == 0 ? UserModel.sendOtp(res, userResult[0].mobile_number) : userResult)
				// .then(userResult=> userResult.is_email_verified == 0 ? UserModel.sendMail(res, userResult[0]) : userResult)
				let user_id = userResult[0].user_id;
				let condition = {user_id}
				UserModel.updateQuery1(updateData, condition)
				.then((userResponse) =>{
					UserModel.selectQuery(condition) 
					.then((result) => {
		                responses.success(res, _.merge(userResponse,result[0]))
		            })
					.catch((error) => responses.sendError(error.message, res));
				})
				.catch((error) => responses.sendError(error.message, res));
			}
		})
		.catch((error) => responses.sendError(error.message, res));
	})
	.catch((error) => responses.sendError(error.message, res));
};



exports.create_profile = (req, res) => {

    let { user_name, email, mobile_number, college_name,state, profile_image } = req.body;
   
    let user_id = req.user.user_id;
     let condition = {user_id};
    let is_profile_create = 1 ;
    for (var i = 0; i < req.files.length; i++) {
       profile_image = `/user/${req.files[i].filename}`; 
   }
    let manKeys = ["user_name", "email", "mobile_number", "college_name", "state"];
    let manValues = {user_name, email,  mobile_number , college_name, state };
  	let  updateData = { user_name, email, profile_image, mobile_number, college_name, state, is_profile_create};
	commFunc.checkKeyExist (manValues, manKeys)
    .then(result => result.length ? responses.parameterMissing(res, result[0]) : '')
    .then(result => {
    	UserModel.selectQuery(condition)
		.then((userResult) => {
			if(userResult[0].social_id){

    			condition = {email};

	    		UserModel.selectQuery(condition)
	    		.then((userResult) => {
		    		if (userResult.length) {
		    			responses.invalidCredential(res, constant.responseMessages.EMAIL_ALREADY_EXISTS)
		    		}
		    	}).catch((error) => responses.sendError(error.message, res));

	    		UserModel.selectQuery({user_name})
				.then((userResult) => {
					if (userResult.length) {
						responses.invalidCredential(res, constant.responseMessages.USER_NAME_ALREADY_EXIST)
					}
				}).catch((error) => responses.sendError(error.message, res));

				UserModel.selectQuery({mobile_number})
				.then((userResult) => {
					if (userResult.length) { 
						responses.invalidCredential(res, constant.responseMessages.MOBILE_NUMBER_ALREADY_EXIST)
					}
				}).catch((error) => responses.sendError(error.message, res));

				condition = {user_id};
				UserModel.updateQuery(updateData, condition)
		    	.then((userResponse) => {responses.success(res, userResponse)
		    	}).catch((error) => responses.sendError(error.message, res));
		    } else {
		    	UserModel.selectQuery({user_name})
				.then((userResult) => {
					if (userResult.length) {
						responses.invalidCredential(res, constant.responseMessages.USER_NAME_ALREADY_EXIST)
					}
				}).catch((error) => responses.sendError(error.message, res));
				
				UserModel.selectQuery({mobile_number})
				.then((userResult) => {
					if (userResult.length) { 
						responses.invalidCredential(res, constant.responseMessages.MOBILE_NUMBER_ALREADY_EXIST)
					}
				}).catch((error) => responses.sendError(error.message, res)); 
					
				condition = {user_id};
				UserModel.updateQuery(updateData, condition)
		    	.then((userResponse) => {
		    		UserModel.selectQuery1(condition) 
		    		.then((Response) =>{
		    			let obj = Object.assign(userResponse, Response[0])
                    	responses.success(res, obj)
					}).catch((error) => responses.sendError(error.message, res));
				}).catch((error) => responses.sendError(error.message, res));
			}
		})
		.catch((error) => responses.sendError(error.message, res));
	})
	.catch((error) => responses.sendError(error.message, res));
};

exports.forget_Password = (req , res) => {
	let {mobile_number} = req.body;
	let manKeys = ["mobile_number"];
	let condition = {mobile_number};
	let verification_code = "123456";
	let updateData = {verification_code};
	commFunc.checkKeyExist(req.body, manKeys)
	 .then(result =>{
		if( result.length ) { 
	 		throw new Error(responses.parameterMissing(res, result[0]))
	 	} else {
			UserModel.selectQuery(condition)
			.then(userResult => {
	 			if(userResult.length == 0) {updateData
 					responses.invalidCredential(res , constant.responseMessages.INVALID_MOBILE_NUMBER)
	 			} else {
	 				let user_id = userResult[0].user_id;
	 				let condition = {user_id};
					UserModel.updateQuery1( updateData , condition)
					.then(userResponse =>{ 
						UserModel.sendOtp(verification_code , mobile_number)
					 	responses.success(res, userResponse);
					}).catch((error) => responses.sendError(error.message, res));
				}
			}).catch((error) => responses.sendError(error.message, res));
		}
	}).catch((error) => responses.sendError(error.message, res));
};

exports.varify_otp = (req,res) => {
	let {verification_code , mobile_number} = req.body;
	let condition = {mobile_number};

	let manKeys = ["verification_code", "mobile_number"];
	let manValues = {verification_code, mobile_number};
	commFunc.checkKeyExist(manValues, manKeys)
	.then(result => result.length ? responses.parameterMissing(res, result[0]) : '')
	.then(result => {
		UserModel.selectQuery(condition)
        .then((userResponse) => {

	        let user_id = userResponse[0].user_id;
	        let condition = {user_id} ;
			UserModel.selectQuery1(condition)
			.then(userResult => {
				if(userResult[0].verification_code != req.body.verification_code) {
					responses.invalidCredential(res , constant.responseMessages.OTP_NOT_FOUND)
				} else {
					responses.success(res,userResult[0]);
				}
			})
			.catch((error) => responses.sendError(error.message , res));
		})
		.catch((error) => responses.sendError(error.message , res));
	})
	.catch((error) => responses.sendError(error.message, res));
};

exports.reset_password = (req,res) => {
	let {mobile_number, password} = req.body;
	let verification_code = "";
	let is_mobile_number_verified  = 1;
	let manKeys = ["password"];
	//let user_id = req.user.user_id;
	let condition = {mobile_number};
	password = md5(password);
	let updateData1 = {verification_code};
	let updateData2 = {password, is_mobile_number_verified};

	//let condition = {user_id};
	commFunc.checkKeyExist(req.body, manKeys)
	.then(result => result.length ? responses.parameterMissing(res, result[0]) : '')
	.then(result => {
		
		UserModel.selectQuery(condition)
		.then((result) => {
			let user_id = result[0].user_id;
			let condition = {user_id};
			UserModel.updateQuery1(updateData1,condition)
			.then(userResult => {
				
				UserModel.updateQuery(updateData2,condition)
				.then(userResult => {
					
					UserModel.selectQuery1 (condition)
		    		.then((Response) => {
		    			let obj = Object.assign(userResult, Response[0]);
                    	responses.success(res, obj);
                	})
					.catch((error) => responses.sendError(error.message , res));
					
				})
				.catch((error) => responses.sendError(error.message , res));
			})
			.catch((error) => responses.sendError(error.message , res));
		})
		.catch((error) => responses.sendError(error.message, res));
	})
	.catch((error) => responses.sendError(error.message , res));
};

exports.logout  = (req,res) => {
	let user_id = req.user.user_id;
	let manKeys = ["user_id"] ; 
	let access_token = "";
	let device_token = "";
	let condition  = {user_id};
	let updateData = {access_token, device_token};

	UserModel.updateQuery1(updateData,condition)
	.then(result => {
		
			responses.success(res,result)
		
			// console.log("invalid token");
	})			
	.catch((error) => responses.sendError(error.message , res));
};


exports.view_profile = (req, res) =>{
	let  user_id  = req.user.user_id;
	let  condition = {"user_id" : user_id } ;
	UserModel.selectQuery(condition) 
	.then((userResult) => {
		UserModel.selectQuery1(condition)
		.then((userResponse) =>{
			responses.success(res, _.merge(userResponse[0],userResult[0]));
		}).catch((error) => responses.sendError(error.message, res));
	}).catch((error) => responses.sendError(error.message, res));
};

exports.edit_profile = (req, res) => {
	let { name, mobile_number, college_name,state, profile_image}  = req.body;
	let user_id = req.user.user_id ;
	for (var i = 0; i < req.files.length; i++) {
       profile_image = `/user/${req.files[i].filename}`; 
   }
	console.log (req.body);
    console.log({college_name,mobile_number})
	let data = commFunc.verifyData({ name, mobile_number, profile_image, college_name,state });
	let condition1 = {"mobile_number" : data.mobile_number};
	let condition2 = {user_id};
	UserModel.selectQuery4(condition1,condition2)
	.then((userResult)=> {
		if(userResult.length) {
			throw new Error(responses.invalidCredential(res, constant.responseMessages.MOBILE_NUMBER_ALREADY_EXIST))
		} else {
			UserModel.updateQuery(data, condition2)
			.then((userResponse)=>{
				UserModel.selectQuery1(condition2)
				.then((userResult) => {
					responses.success(res, _.merge(userResponse,userResult[0]));
				}).catch((error) =>responses.sendError(error.message, res));
			}).catch((error) =>responses.sendError(error.message, res));
		}
	}).catch((error) =>responses.sendError(error.message, res));
};

// exports.signup = (req, res) => {
// 	let { user_name , email_id, password, device_type, device_token, latitude, longitude} = req.body;
// 	let manKeys = ["user_name","email_id", "password", "device_type", "device_token", "latitude", "longitude"];
// 	let emailRegex = "^([a-zA-Z0-9_.]+@[a-zA-Z0-9]+[.][.a-zA-Z]+)$";

// 	commFunc.checkKeyExist(req.body, manKeys)
// 	.then(result => result.length ? throw new Error(responses.parameterMissing(res,result[0])) : '')
// 	.then(result => {
// 		!email_id.match(emailRegex) ? throw new Error(responses.invalidemailformat(res)) : password.length ? throw new Error(responses.invalidCredential(res , constant.responseMessages.INVALID_PASSWORD_FORMAT)) : return UserModel.selectQuery({email_id});
// 	}).then((userResult) => {
// 		userResult.length ? responses.invalidCredential(res, constant.responseMessages.EMAIL_ALREADY_EXISTS) : return UserModel.selectQuery({user_name})
// 	}).then(userResult => {
// 		if(userResult.length >0) {
// 			responses.invalidCredential(res , constant.responseMessages.USER_NAME_ALREADY_EXISTS);
// 		} else {
// 			password = md5(password);
//     let access_token = md5(new Date());
//     let user_id = md5(new Date());
// 			let insertData = {user_id, access_token,user_name , email_id, password, device_type, device_token, latitude, longitude};
// 			return UserModel.insertQuery(insertData)
// 		}		
// 	}).then((userResponse) =>{ responses.success(res, userResponse)
// 	}).catch((error) => responses.sendError(error.message, res));
// };




