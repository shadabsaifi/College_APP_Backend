import responses from '../Modules/responses';
import UserModal  from'../Modals/user_model';
import constants from './constant';
import config from '../config/development';
import twilio from 'twilio'
import async from 'async';
import _ from 'lodash';

/*
 * -----------------------
 * GENERATE RANDOM STRING
 * -----------------------
 */
 exports.generateRandomString = () => {
	let text = "";
	let possible = "123456789";

	for (var i = 0; i < 6; i++)
		text += possible.charAt(Math.floor(Math.random() * possible.length));

	return text;
};

/*
 * -----------------------------------------------
 * CHECK EACH ELEMENT OF ARRAY FOR BLANK AND Key
 * -----------------------------------------------
 */

exports.checkKeyExist = (req, arr) => {
	return new Promise((resolve, reject) => {
		var array = [];
		_.map(arr, (item) => {
			if(req.hasOwnProperty(item)) {
				var value = req[item];
				if( value == '' || value == undefined ) { 
					array.push(item+" can not be empty");
				}
				resolve(array);
			} else {
				array.push(item+" key is missing");
				resolve(array);
			}
		});
	}); 
};



exports.sendotp = (verification_code,sendTo) => {
	
	var client = new twilio(config.accountSid, config.authToken);
	client.messages.create({
	    body: "your one time password(OTP) is  "  +verification_code+  "  valid for 3 minutes do not disclose it" ,
	    to: '+918562938348',  // Text this number
	    from: '(912) 244-7559' // From a valid Twilio number
	})
	.then((message) => console.log(message.sid))
	.catch((err) => console.log(err));
};

//--------------------------------------//
//-------verify data--------------------//

exports.verifyData = (data = {}) => {
    var result = {};
    var count = 0;
    _.map(data, (val, key) => {
        if (val && val.length || _.isInteger(val)) {
            result[key] = val;
        }
    })
    return result;
}


