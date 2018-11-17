import commFunc from '../Modules/commonFunction';
import responses from '../Modules/responses';
import constant from '../Modules/constant';
import AdminModel from '../Modals/admin_model';
import md5 from 'md5';
import _ from 'lodash';

let arr = [];

exports.login = (req, res) => {
	let {email, password} = req.body;
	let manKeys = ["email", "password"];
	let manValues = {email, password} ;
	let condition  = {email};

	let encrypt_password = md5(password);
	let access_token = md5(new Date());
	let updateData = { access_token };
	
	commFunc.checkKeyExist(manValues, manKeys)
	.then(result => result.length ? responses.parameterMissing(res, result[0]) : '')
	.then(result => {
		AdminModel.selectQuery(condition)
		.then(userResult=> userResult.length == 0 ? responses.invalidCredential(res, constant.responseMessages.INVALID_EMAIL_ID) : userResult)
		.then(userResult=> userResult[0].password != encrypt_password ? responses.invalidCredential(res, constant.responseMessages.INCORRECT_PASSWORD) : userResult)
		.then(userResult =>{
			let admin_id = userResult[0].admin_id;
			let condition = {admin_id};
			AdminModel.updateQuery(updateData, condition)
			.then((userResponse) =>{ responses.success(res, userResponse[0])})
			.catch((error) => responses.sendError(error.message, res));
		})
		.catch((error) => responses.sendError(error.message, res))
	})
	.catch((error) => responses.sendError(error.message, res));
};

exports.forget_Password = (req , res) => {
	let {mobile_number} = req.body;

	let manKeys = ["mobile_number"];
	let condition = {mobile_number};
	let verification_code = commFunc.generateRandomString();
	let updateData = {verification_code};
	commFunc.checkKeyExist(req.body, manKeys)
	.then(result => result.length ? responses.parameterMissing(res, result[0]) : '')
	.then(result => {
		AdminModel.selectQuery(condition)
		.then(userResult => userResult[0].length == 0 ? responses.invalidCredential(res , constant.responseMessages.INVALID_MOBILE_NUMBER) : userResult)
		.then(userResult =>{
			let admin_id = userResult[0].admin_id;
			let condition = {admin_id};
			AdminModel.updateQuery( updateData , condition)
			.then((userResponse) => {

				AdminModel.sendOtp(verification_code , mobile_number);
				responses.success(res, userResponse);
			})
			.catch((error) => responses.sendError(error.message, res));
		})
		.catch((error) => responses.sendError(error.message, res));
	})
	.catch((error) => responses.sendError(error.message, res));
};

exports.varify_otp = (req,res) => {
	let {verification_code} = req.body;
	let admin_id = req.admin.admin_id;

	let manKeys = ["verification_code"];
	let data = {verification_code};
	let condition = {admin_id} ;
	commFunc.checkKeyExist(req.body, manKeys)
	.then(result => result.length ? responses.parameterMissing(res, result[0]) : '')
	.then(result => {
		AdminModel.selectQuery(condition)
		.then(userResult => userResult[0].verification_code != req.body.verification_code ? responses.invalidCredential(res , constant.responseMessages.OTP_NOT_FOUND) : userResult)
		.then(userResult => {
			 responses.success(res,userResult)})
		.catch((error) => responses.sendError(error.message , res));
	})
	.catch((error) => responses.sendError(error.message , res));
};

exports.reset_password = (req,res) => {
	let {password} = req.body;
	let verification_code = "";
	let is_mobile_number_verified  = 1;
	let manKeys = ["password"];
	let admin_id = req.admin.admin_id;
	password = md5(password);
	let updateData = {verification_code, password};

	let condition = {admin_id};
	commFunc.checkKeyExist(req.body, manKeys)
	.then(result => result.length ? responses.parameterMissing(res, result[0]) : '')
	.then(result => {
		AdminModel.updateQuery(updateData,condition)
		.then(userResult => {
			 responses.success(res,userResult[0])})
			.catch((error) => responses.sendError(error.message , res));
		})
		.catch((error) => responses.sendError(error.message , res));
};

exports.create_profile = (req, res) => {

    let {name, mobile_number, profile_image} = req.body;
    let admin_id = req.admin.admin_id;
	let condition = {mobile_number};
    for (var i = 0; i < req.files.length; i++) {
       profile_image = req.files[i].filename;
    }
    let manKeys = ["name", "mobile_number", "profile_image"];
    let manValues = {name , mobile_number , profile_image };
  	let  updateData = { name, mobile_number, profile_image};
	commFunc.checkKeyExist(manValues, manKeys)
    .then(result => result.length ? responses.parameterMissing(res, result[0]) : '')
    .then(result => {
    	AdminModel.selectQuery(condition)
		.then(userResult => userResult.length > 0 ? responses.invalidCredential(res, constant.responseMessages.MOBILE_NUMBER_ALREADY_EXIST) : userResult)
		.then((userResult) => {
			let condition = {admin_id};
			AdminModel.updateQuery(updateData, condition)
        	.then((userResponse) => {
        		console.log( "success" );
            	responses.success(res, userResponse)
            })
            .catch((error) => responses.sendError(error.message, res));
        })
        .catch((error) => responses.sendError(error.message, res));
	})
    .catch((error) => responses.sendError(error.message, res));
};




