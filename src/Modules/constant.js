/**
 * The node-module to hold the constants for the server
 */

let define = (obj, name, value) => {
    Object.defineProperty(obj, name, {
        value: value,
        enumerable: true,
        writable: false,
        configurable: true
    });
}

exports.responseFlags = {};
exports.responseMessages = {};

//FOR MESSAGES
define(exports.responseMessages, 'PARAMETER_MISSING',                     'Some parameter missing.');
define(exports.responseMessages, 'INVALID_ACCESS_TOKEN',                  'Invalid access token.');
define(exports.responseMessages, 'INVALID_MOBILE_NUMBER',                 'Invalid mobile number.');
define(exports.responseMessages, 'INVALID_EMAIL_ID',                      'Invalid email id.');
define(exports.responseMessages, 'INVALID_CREDENTIAL',                    'Invalid credential.');
define(exports.responseMessages, 'INCORRECT_PASSWORD',                    'Incorrect Password.');
define(exports.responseMessages, 'ACTION_COMPLETE',                       'Action complete.');
define(exports.responseMessages, 'LOGIN_SUCCESSFULLY',                    'Logged in successfully.');
define(exports.responseMessages, 'SHOW_ERROR_MESSAGE',                    'Show error message.');
define(exports.responseMessages, 'IMAGE_FILE_MISSING',                    'Image file is missing.');
define(exports.responseMessages, 'ERROR_IN_EXECUTION',                    'Error in execution.');
define(exports.responseMessages, 'UPLOAD_ERROR',                          'Error in uploading.');
define(exports.responseMessages, 'STATUS_CHANGED_SUCCESSFULLY',           'Status changed successfully.');
define(exports.responseMessages, 'USER_NOT_FOUND',                        'User not found.');
define(exports.responseMessages, 'NO_DATA_FOUND',                         'No data found.');
define(exports.responseMessages, 'USER_DELETED_SUCCESSFULLY',             'User deleted successfully.');
define(exports.responseMessages, 'PASSWORD_CHANGED_SUCCESSFULLY',         'Password changed successfully.');
define(exports.responseMessages, 'EMAIL_ALREADY_EXISTS',                  'Email already registered');
define(exports.responseMessages, 'MOBILE_ALREADY_EXISTS',                 'Mobile already registered');
define(exports.responseMessages, 'EXPIRED_TOKEN',                         'This link has been expired.');
define(exports.responseMessages, 'OTP_NOT_FOUND',                         'OTP not found.');
define(exports.responseMessages, 'PASSWORD_STRENGTH_IS_WEAK',             'password is not strong');
define(exports.responseMessages, 'USER_NAME_ALREADY_EXIST',               'user name already exist');
define(exports.responseMessages, 'SOCIAL_ID__ALREADY_EXIST',               'user already exist');
define(exports.responseMessages, 'MOBILE_NUMBER_ALREADY_EXIST',            'mobile number already exist');
define(exports.responseMessages, 'PAGE_NAME_ALREADY_EXISTS',               'Page name already exist please give any other name');
define(exports.responseMessages, 'EVENT_NAME_ALREADY_EXIST',                  'Event name already registered');
define(exports.responseMessages, 'ALREADY_SHARED',               			'Already shared this post');
define(exports.responseMessages, 'REQUEST_ALREADY_SENT',               			'Request already sent');
define(exports.responseMessages, 'REQUEST_DELETED_SUCCESSFULLY',             'Request deleted_successfully');




//FOR FLAGS
define(exports.responseFlags, 'ALREADY_EXIST',                       422);
define(exports.responseFlags, 'PARAMETER_MISSING',                   422);
define(exports.responseFlags, 'INVALID_ACCESS_TOKEN',                401);
define(exports.responseFlags, 'INVALID_MOBILE_NUMBER',               403);
define(exports.responseFlags, 'INVALID_CREDENTIAL',                  403);
define(exports.responseFlags, 'INVALID_EMAIL_ID',                    403);
define(exports.responseFlags, 'WRONG_PASSWORD',                      403);
define(exports.responseFlags, 'ACTION_COMPLETE',                     200);
define(exports.responseFlags, 'LOGIN_SUCCESSFULLY',                  200);
define(exports.responseFlags, 'SHOW_ERROR_MESSAGE',                  400);
define(exports.responseFlags, 'IMAGE_FILE_MISSING',                  422);
define(exports.responseFlags, 'ERROR_IN_EXECUTION',                  404);
define(exports.responseFlags, 'STATUS_CHANGED_SUCCESSFULLY',         200);
define(exports.responseFlags, 'USER_NOT_FOUND',                      204);
define(exports.responseFlags, 'NO_DATA_FOUND',                       204);
define(exports.responseFlags, 'USER_DELETED_SUCCESSFULLY',           200);
define(exports.responseFlags, 'PASSWORD_CHANGED_SUCCESSFULLY',       200);
define(exports.responseFlags, 'OTP_NOT_FOUND',                       403);
define(exports.responseFlags, 'PASSWORD_STRENGTH_IS_WEAK',           403);
define(exports.responseFlags, 'USER_NAME_ALREADY_EXIST',           	 403);
define(exports.responseFlags, 'SOCIAL_ID__ALREADY_EXIST',            403);
define(exports.responseFlags, 'MOBILE_NUMBER_ALREADY_EXIST',         403);
define(exports.responseFlags, 'PAGE_NAME_ALREADY_EXISTS',        	 403);
define(exports.responseFlags, 'ALREADY_SHARED',        	 			 403);
define(exports.responseFlags, 'EVENT_NAME_ALREADY_EXIST',        	 403);
define(exports.responseFlags, 'REQUEST_ALREADY_SENT',        		 403);
define(exports.responseFlags, 'REQUEST_DELETED_SUCCESSFULLY',        200);



