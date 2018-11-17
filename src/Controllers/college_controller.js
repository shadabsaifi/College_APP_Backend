import commFunc from '../Modules/commonFunction';
import responses from '../Modules/responses';
import constant from '../Modules/constant';
import collegeModel from '../Modals/college_model';
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
	.then(result => result.length ? responses.parameterMissing(res, result[0]) : '')
	.then(result => {
		collegeModel.selectQuery(condition)
		.then(userResult=> userResult.length == 0 ? responses.invalidCredential(res, constant.responseMessages.INVALID_EMAIL_ID) : userResult)
		.then(userResult=> userResult[0].password != encrypt_password ? responses.invalidCredential(res, constant.responseMessages.INCORRECT_PASSWORD) : userResult)
		//.then(userResult=> userResult[0].is_mobile_number_verified == 0 ? collegeModel.sendOtp(res, userResult[0].mobile_number) : userResult)
		//.then(userResult=> userResult[0].is_email_verified == 0 ? collegeModel.sendMail(res, userResult[0]) : userResult)
		.then(userResult=> {
			let college_id = userResult[0].college_id;
			let condition = {college_id}
			collegeModel.updateQuery1(updateData, condition)
			.then((userResponse) =>{ collegeModel.selectQuery(condition).then((userResult) =>{
					 let obj = Object.assign(userResponse, userResult[0]);
                     responses.success(res, obj);

				})
				.catch((error) => responses.sendError(error.message, res));
			})
			.catch((error) => responses.sendError(error.message, res));
		})
		.catch((error) => responses.sendError(error.message, res));
	})
	.catch((error) => responses.sendError(error.message, res));
};

exports. manual_signup = (req, res) => {
	let {email, password,name,  device_type, device_token, latitude, longitude} = req.body;
	let manKeys = ["email", "password","name",  "device_type", "device_token", "latitude", "longitude"];
	let condition  = {email};
	let emailRegex = "^([a-zA-Z0-9_.]+@[a-zA-Z0-9]+[.][.a-zA-Z]+)$";

	commFunc.checkKeyExist(req.body, manKeys)
	.then(result => result.length ? new Promise  (new Error(responses.parameterMissing(res,result[0]))) : '')
	.then(result => {
		if(!email.match(emailRegex)) {
			responses.invalidemailformat(res);
		} else {
			if(password.length < 8) {
				responses.invalidpasswordformt(res);
			} else {
				collegeModel.selectQuery(condition)
				.then(userResult=> userResult.length > 0 ? responses.invalidCredential(res, constant.responseMessages.EMAIL_ALREADY_EXISTS) : userResult)
				.then(userResult=> {
					let access_token = md5(new Date());
				 	let college_id = md5(new Date());
				 	let current_date = new Date();
				 	password = md5(password);
					let created_on = Math.round(current_date.getTime() / 1000);
				 	let updated_on =  Math.round(current_date.getTime() / 1000);
				 	let insertData1 = {college_id, email,name, password, created_on};
					let insertData2 = {college_id , access_token , device_type, device_token, latitude, longitude,updated_on};
					collegeModel.insertQuery(insertData1)
                        .then((userResponse) => {
                            collegeModel.insertQuery1(insertData2).then((Response) => {
                                let obj = Object.assign(userResponse[0], Response[0]);
                                responses.success(res, obj);
                        })
                        .catch((error) => responses.sendError(error.message, res));
                    }).catch((error) => responses.sendError(error.message, res));
				}).catch((error) => responses.sendError(error.message, res));
			}
		}
	}).catch((error) => responses.sendError(error.message, res));
};

exports.social_signup = (req, res) => {
	
	let insertData1 = "";
	let { social_type, social_id, name, device_type,device_token,latitude, longitude } = req.body;
	let manKeys = ["social_type","social_id", "name", "device_type", "device_token", "latitude", "longitude"];
	let condition = {social_id};
	commFunc.checkKeyExist(req.body, manKeys)
	.then(result => result.length ? new Promise  (new Error(responses.parameterMissing(res,result[0]))) : '')
	.then(result => {
		collegeModel.selectQuery(condition)
		.then(userResult=> {
			if(userResult.length > 0) {
			 responses.invalidCredential(res, constant.responseMessages.SOCIAL_ID__ALREADY_EXIST) 
			} else {
				let access_token = md5(new Date());
				let current_date = new Date();
			 	let college_id = md5(new Date());
			 	let created_on = Math.round(current_date.getTime() / 1000);
			 	let updated_on =  Math.round(current_date.getTime() / 1000);
			 	let insertData1 = {college_id, social_type,social_id, created_on,name};
				let insertData2 = {college_id , access_token , device_type, device_token, latitude, longitude,updated_on};
				collegeModel.insertQuery(insertData1)
	            .then((userResponse) => {
	                collegeModel.insertQuery1(insertData2)
	                .then((Response) => {
	                	let obj = Object.assign(userResponse[0], Response[0]);
	                    responses.success(res, obj)
					})
	                .catch((error) => responses.sendError(error.message, res));
	            })
	            .catch((error) => responses.sendError(error.message, res));
		    }
		}).catch((error) => responses.sendError(error.message,res));
	}).catch((error) => responses.sendError(error.message, res));
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
		collegeModel.selectQuery2(condition)
		.then(userResult=> userResult.length == 0 ? responses.invalidCredential(res, constant.responseMessages.USER_NOT_FOUND) : userResult)
		// .then(userResult=> userResult.is_mobile_number_verified == 0 ? collegeModel.sendOtp(res, userResult[0].mobile_number) : userResult)
		// .then(userResult=> userResult.is_email_verified == 0 ? collegeModel.sendMail(res, userResult[0]) : userResult)
		.then(userResult=> {
			let college_id = userResult[0].college_id;
			let condition = {college_id}
			collegeModel.updateQuery1(updateData, condition)
			.then((userResponse) =>{
				collegeModel.selectQuery(condition) 
				.then((result) => {
					let obj = Object.assign(userResponse, result[0]);
                    responses.success(res, obj)
                })
				.catch((error) => responses.sendError(error.message, res));
			})
			.catch((error) => responses.sendError(error.message, res));
		})
		.catch((error) => responses.sendError(error.message, res));
	})
	.catch((error) => responses.sendError(error.message, res));
};



exports.create_profile = (req, res) => {

    let { user_name, email, mobile_number, college_name, profile_image } = req.body;
   
    let college_id = req.college.college_id;
     let condition = {college_id};
    let is_profile_create = 1 ;
   
    for (var i = 0; i < req.files.length; i++) {
       profile_image = `/college/${req.files[i].filename}`; 
   }
    let manKeys = ["user_name", "email", "mobile_number", "college_name"];
    let manValues = {user_name, email,  mobile_number , college_name };
  	let  updateData = { user_name, email, profile_image, mobile_number, college_name, is_profile_create};
	commFunc.checkKeyExist (manValues, manKeys)
    .then(result => result.length ? responses.parameterMissing(res, result[0]) : '')
    .then(result => {
    	collegeModel.selectQuery(condition)
		.then((userResult) => {
			if(userResult.social_id){

    			condition = {email};
	    		collegeModel.selectQuery(condition)
	    		.then((userResult) => {
		    		if (userResult.length) {throw new Error(responses.invalidCredential(res, constant.responseMessages.EMAIL_ALREADY_EXISTS))}
	    			return collegeModel.selectQuery({user_name})
				}).then((userResult) => {
					if (userResult.length) {
						throw new Error(responses.invalidCredential(res, constant.responseMessages.USER_NAME_ALREADY_EXIST))
					}
					return collegeModel.selectQuery({mobile_number})
				}).then((userResult) => {
					if (userResult.length) { 
						throw new Error(responses.invalidCredential(res, constant.responseMessages.MOBILE_NUMBER_ALREADY_EXIST))
					} 
					condition = {college_id};
					return collegeModel.updateQuery(updateData, condition)
		    	}).then((userResponse) => {
		    		collegeModel.selectQuery1 (condition)
		    		.then((Response) => {
		    			let obj = Object.assign(userResponse, Response[0]);
                    	responses.success(res, obj)
		    		}).catch((error) => responses.sendError(error.message, res));
		    	}).catch((error) => responses.sendError(error.message, res));
		    } else {
		    		collegeModel.selectQuery({user_name})
				.then((userResult) => {
					if (userResult.length) {
						throw new Error(responses.invalidCredential(res, constant.responseMessages.USER_NAME_ALREADY_EXIST))
					}
					return collegeModel.selectQuery({mobile_number})
				}).then((userResult) => {
					if (userResult.length) { 
						throw new Error(responses.invalidCredential(res, constant.responseMessages.MOBILE_NUMBER_ALREADY_EXIST))
					} 
					condition = {college_id};
					return collegeModel.updateQuery(updateData, condition)
		    	}).then((userResponse) => {
		    		collegeModel.selectQuery1 (condition)
		    		.then((Response) => {
		    			let obj = Object.assign(userResponse[0], Response[0]);
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
	console.log(mobile_number);

	let manKeys = ["mobile_number"];
	let condition = {mobile_number};
	let verification_code = "123456";
	//let verification_code = commFunc.generateRandomString();
	let updateData = {verification_code};
	commFunc.checkKeyExist(req.body, manKeys)
	.then(result => result.length ? responses.parameterMissing(res, result[0]) : '')
	.then(result => {
		collegeModel.selectQuery(condition)
		.then(userResult => {
			console.log (userResult);
			 if(userResult[0].mobile_number != mobile_number) {
			   responses.invalidCredential(res , constant.responseMessages.INVALID_MOBILE_NUMBER)
			} else {
			
					let college_id = userResult[0].college_id;
					let condition = {college_id};
					collegeModel.updateQuery1( updateData , condition)
					.then((userResponse) => {

						collegeModel.sendOtp(verification_code , mobile_number);
						responses.success(res, userResponse);
					})
					.catch((error) => responses.sendError(error.message, res));
			}
		}) .catch((error) => {console.log(error); responses.sendError(error.message, res)})
	})
	.catch((error) => responses.sendError(error.message, res));
};

exports.varify_otp = (req,res) => {
	let {verification_code , mobile_number} = req.body;
	let condition = {mobile_number};
	let manKeys = ["verification_code", "mobile_number"];
	let manValues = {verification_code, mobile_number};
	commFunc.checkKeyExist(manValues, manKeys)
	.then(result => result.length ? responses.parameterMissing(res, result[0]) : '')
	.then(result => {
		collegeModel.selectQuery(condition)
        .then((userResponse) => {
        	let college_id = userResponse[0].college_id;
	        let condition = {college_id} ;
			collegeModel.selectQuery1(condition)
			.then(userResult => userResult[0].verification_code != req.body.verification_code ? responses.invalidCredential(res , constant.responseMessages.OTP_NOT_FOUND) : userResult)
			.then(userResult => {
				responses.success(res,userResult[0])
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
	let condition = {mobile_number};
	password = md5(password);
	let updateData1 = {verification_code};
	let updateData2 = {password, is_mobile_number_verified};

	//let condition = {college_id};
	commFunc.checkKeyExist(req.body, manKeys)
	.then(result => result.length ? responses.parameterMissing(res, result[0]) : '')
	.then(result => {
		collegeModel.selectQuery(condition)
		.then((result) => {
			let college_id = result[0].college_id;
			let condition = {college_id};
			collegeModel.updateQuery1(updateData1,condition)
			.then(userResult => {
				collegeModel.updateQuery(updateData2,condition)
				.then(userResult => {
					collegeModel.selectQuery1 (condition)
		    		.then((Response) => {
		    			let obj = Object.assign(userResult[0], Response[0]);
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
	let college_id = req.college.college_id;
	let manKeys = ["college_id"] ; 
	let access_token = "";
	let condition  = {college_id};
	let updateData = {access_token};

	collegeModel.updateQuery1(updateData,condition)
	.then(result => {
		responses.success(res,result)})
	.catch((error) => responses.sendError(error.message , res));
};

exports.edit_profile = (req, res) => {
	console.log ("edit_profile");
	let { name, mobile_number, profile_image}  = req.body;
	let college_id = req.college.college_id ;
	console.log (req.body);
	for (var i = 0; i < req.files.length; i++) {
       profile_image = `/college/${req.files[i].filename}`; 
   }
	let data = commFunc.verifyData({ name, mobile_number, profile_image});
	let condition1 = {"mobile_number" : data.mobile_number};
	let condition2 = {college_id};
	console.log (data,   condition1,   condition2);
	collegeModel.selectQuery4(condition1,condition2)
	.then((userResult)=> {
		if(userResult.length) {
			throw new Error(responses.invalidCredential(res, constant.responseMessages.MOBILE_NUMBER_ALREADY_EXIST))
		} else {
			collegeModel.updateQuery(data, condition2)
			.then((userResponse)=>{
				collegeModel.selectQuery1(condition2)
				.then((userResult) => {
					responses.success(res, _.merge(userResponse[0],userResult[0]));
				}).catch((error) =>responses.sendError(error.message, res));
			}).catch((error) =>responses.sendError(error.message, res));
		}
	}).catch((error) =>responses.sendError(error.message, res));
};
exports.create_page = (req, res) => {
	let {name , profile_image, page_description, catagory} = req.body;
	let college_id =  req.college.college_id;
	//console.log (college_id);
		for (var i = 0; i < req.files.length; i++) {
		    profile_image = `/college/${req.files[i].filename}`; 
		}
	let current_date = new Date();
	let page_id = md5(new Date());
	let created_on = Math.round(current_date.getTime() / 1000);
	let insertData  =  {name, profile_image, page_description, catagory, created_on, page_id, college_id};
	let condition = {name};
	console.log (condition);
	let manKeys = ["name", "page_description", "catagory"];
	let manValues = {name, page_description, catagory};
	commFunc.checkKeyExist(manValues, manKeys)
	.then(result => result.length ? responses.parameterMissing(res, result[0]) : '')
	.then(result => {
		collegeModel.selectQuery3(condition)
		.then((userResult) => {
			if(userResult.length) {
				responses.invalidCredential(res, constant.responseMessages.PAGE_NAME_ALREADY_EXISTS)
			}else{
				collegeModel.insertQuery3(insertData)
				.then(result => {
					responses.success(res, result)
				})
				.catch((error) => responses.sendError(error.message , res));
			}
		}).catch((error) => responses.sendError(error.message, res))

	}).catch((error) => responses.sendError(error.message, res));
};

// // exports.signup = (req, res) => {
// // 	let { user_name , email_id, password, device_type, device_token, latitude, longitude} = req.body;
// // 	let manKeys = ["user_name","email_id", "password", "device_type", "device_token", "latitude", "longitude"];
// // 	let emailRegex = "^([a-zA-Z0-9_.]+@[a-zA-Z0-9]+[.][.a-zA-Z]+)$";

// // 	commFunc.checkKeyExist(req.body, manKeys)
// // 	.then(result => result.length ? throw new Error(responses.parameterMissing(res,result[0])) : '')
// // 	.then(result => {
// // 		!email_id.match(emailRegex) ? throw new Error(responses.invalidemailformat(res)) : password.length ? throw new Error(responses.invalidCredential(res , constant.responseMessages.INVALID_PASSWORD_FORMAT)) : return collegeModel.selectQuery({email_id});
// // 	}).then((userResult) => {
// // 		userResult.length ? responses.invalidCredential(res, constant.responseMessages.EMAIL_ALREADY_EXISTS) : return collegeModel.selectQuery({user_name})
// // 	}).then(userResult => {
// // 		if(userResult.length >0) {
// // 			responses.invalidCredential(res , constant.responseMessages.USER_NAME_ALREADY_EXISTS);
// // 		} else {
// // 			password = md5(password);
// //     let access_token = md5(new Date());
// //     let college_id = md5(new Date());
// // 			let insertData = {college_id, access_token,user_name , email_id, password, device_type, device_token, latitude, longitude};
// // 			return collegeModel.insertQuery(insertData)
// // 		}		
// // 	}).then((userResponse) =>{ responses.success(res, userResponse)
// // 	}).catch((error) => responses.sendError(error.message, res));
// // };




