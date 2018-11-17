import constants from './constant';

exports.parameterMissing = (res, result) => {
	let response = {
		"message": result,
		"response" : {}
	};
	res.status(constants.responseFlags.PARAMETER_MISSING).json(response);
};

exports.parameterMissingResponse = (res) => {
	let response = {
		"message": constants.responseMessages.PARAMETER_MISSING,
		"response" : {}
	};
	res.status(constants.responseFlags.PARAMETER_MISSING).json(response);
};

exports.invalidCredential = function (res, msg) {
	var response = {
		"message": msg,
		"response" : {} 

	};
	res.status(constants.responseFlags.INVALID_CREDENTIAL).json(response);
};

exports.authenticationErrorResponse =  (res) => {
	var response = {
		"message": constants.responseMessages.INVALID_ACCESS_TOKEN,
		"response" : {}
	};
	res.status(constants.responseFlags.INVALID_ACCESS_TOKEN).json(response);
};

exports.sendError = (error, res) => {
	var response = {
		"message": constants.responseMessages.ERROR_IN_EXECUTION,
		"response" : {},
		"error": error
	};
	res.status(constants.responseFlags.ERROR_IN_EXECUTION).json(response);
};

exports.success = (res, result) => {
	var response = {
		"message": constants.responseMessages.ACTION_COMPLETE,
		"response" : result
	};
	res.status(constants.responseFlags.ACTION_COMPLETE).json(response);
};
exports.success2 = (res, result) => {
	var response = {
		"message": constants.responseMessages.REQUEST_DELETED_SUCCESSFULLY,
		"response" : result
	};
	res.status(constants.responseFlags.REQUEST_DELETED_SUCCESSFULLY).json(response);
};

exports.userNotExist = (res) => {
	var response = {
		"message": "User not found.",
		"response" : {}
	};
	res.status(constants.responseFlags.ACTION_COMPLETE).json(response);	
}
exports.invalidpasswordformt = (res) => {
	var response = {
		"message" : "password is not strong", 
		"response" : {}
	};
	res.status(constants.responseFlags.ACTION_COMPLETE).json(response);
}