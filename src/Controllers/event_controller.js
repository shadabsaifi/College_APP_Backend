import commFunc from '../Modules/commonFunction';
import responses from '../Modules/responses';
import constant from '../Modules/constant';
import UserModel from '../Modals/user_model';
import connection from '../Modules/connection.js';
import PostModel from '../Modals/post_model';
import EventModel from '../Modals/event_model';
import md5 from 'md5';
import async from 'async';
import _ from 'lodash';

let arr = [] ;

// exports.post_create = (req, res) => {
// 	let {post_content,post_text,post_type, posted_by} = req.body;
// 	let user_id = req.user.user_id;

// 	let current_date = new Date();
// 	let created_on = Math.round(current_date.getTime() / 1000);
// 	let post_id = md5(current_date);
// 	 for (var i = 0; i < req.files.length; i++) {
//        post_content = req.files[i].filename;
//     }

//     var manValues = { post_content, post_text, post_type, posted_by };
//     let manKeys = ["post_content", "post_text", "post_type","posted_by"];
//     console.log(manKeys, manValues);
// 	let insertData = {user_id, post_id, post_type, post_content, post_text, created_on};
	
// 	commFunc.checkKeyExist(manValues, manKeys)
// 	.then(result => result.length ? responses.parameterMissing(res, result[0]) : '')
// 	.then(result => {
// 		PostModel.insertQuery(insertData)
// 		.then((postResult) => { responses.success(res, postResult[0])})
// 		.catch((error) => responses.sendError(error.message, res));
// 	})
// 	.catch((error) => responses.sendError(error.message, res));
// };

exports.create_event = (req, res) =>{
	let {event_name, event_location,thumbnail, event_date, event_banner,event_baner_type, college_name} = req.body;
	let user_id = req.user.user_id ;
	let current_date = new Date();

	let created_on = Math.round(current_date.getTime() / 1000);
	let event_id = md5(current_date);
	let condition = {event_name};
	let condition1 = {user_id};
	for(let i=0 ; i<req.files.length ; i++) {
		 event_banner = `/event/${req.files[i].filename}`;
	}

	let manKeys = ["event_name", "user_id",  "event_location", "event_date","college_name"];
	let manValues = {event_name,user_id, event_location, event_date,college_name};
	let image;
	let insertData = {event_id, user_id, event_name, event_location, event_date, created_on , college_name};
	if(event_baner_type == 2) {
        if(req.files){
            image = EventModel.imageModel(req.files)
            insertData= _.merge(insertData,image)
        } 
    } else {
        for (var i = 0; i < req.files.length; i++) {
            event_banner = `/event/${req.files[i].filename}`;
        }
        console.log(event_banner);
        insertData= _.merge(insertData,{event_banner})
    }
	commFunc.checkKeyExist(manValues, manKeys)
	.then((result) => {
		if(result.length) {
			responses.parameterMissing(res, result[0]) 
		} else {
			UserModel.selectQuery(condition1)
			.then((userResult) => {
				EventModel.selectQuery(condition)
				.then((eventResult) => {

				if(eventResult.length) {
					responses.invalidCredential(res, constant.responseMessages.EVENT_NAME_ALREADY_EXIST)
				} else {
					EventModel.insertQuery(insertData)
					.then((eventResult) => {
						responses.success(res, eventResult[0])
					})
					.catch((error) => responses.sendError(error.message, res));
				}
			}).catch((error) => responses.sendError(error.message, res));

			})
			
		}
	}).catch((error) => responses.sendError(error.message, res));
};

exports.show_event = (req,res) => {
	let user_id = req.user.user_id ;
	let {college_name} = req.body;
	let condition = {college_name};
	let manKeys = [ "college_name"];
	let manValues = {college_name};
	commFunc.checkKeyExist(manValues, manKeys)
	.then((result) => {
		if(result.length) {
			responses.parameterMissing(res, result[0])
		} else {
			EventModel.selectQuery( condition )
			.then((eventResult) => {
				console.log (eventResult);
				arr = [] ;
				async.eachSeries(eventResult, get_user_result, (results) =>{
           			responses.success(res, arr);
            		arr = [];
        		});
				function get_user_result(eventResult, callback) {
					let user_id = eventResult.user_id;
					let sql = "SELECT * FROM `tb_user` WHERE `user_id` = ? " ;
					connection.query(sql, [user_id],(err, result) => {
						if(err) {
							callback(0);
						} else {
							arr.push(_.merge(result[0], eventResult));
							callback();
						}
					})
				}
			})
		}
	})
}
exports.edit_event = (req,res) => {
 	console.log("0");
 	let {event_name, event_location, event_banner, event_date,event_baner_type, event_id } = req.body;
	let user_id = req.user.user_id;
	let manKeys = ["event_id"];
	let manValues = {event_id};

	for(let i=0 ; i<req.files.length ; i++) {
		 event_banner = `/event/${req.files[i].filename}`;
	}
	let current_date = new Date();
	let updated_on = Math.round(current_date.getTime() / 1000);
	let data = commFunc.verifyData({ event_name, event_location, event_banner,event_baner_type, event_date,user_id});
	console.log (data);
	let condition = {"event_id" : event_id};
	if(user_id) {
		console.log("1");
		commFunc.checkKeyExist(manValues, manKeys)
		.then((results) => {
			if(results.length) {
				responses.parameterMissing(res, result[0])
			} else {
				console.log("2");
				EventModel.updateQuery(data, condition)
				.then((eventResult) => {
					console.log(eventResult);
					console.log("3");
					condition = {"user_id" :data.user_id};
					UserModel.selectQuery(condition)
					.then((userResult) => {
						console.log("4");
						responses.success(res, _.merge(eventResult[0],userResult[0]));
					})
					.catch((error) => responses.sendError(error.message, res));


				})
				.catch((error) => responses.sendError(error.message, res));
			}

		})
		.catch((error) => responses.sendError(error.message, res));
	} else {
		responses.authenticationErrorResponse(res);
	}

	 


}

exports.delete_event = (req,res)=> {
	console.log("delete_event");
	let {event_id} = req.body ;
	let condition  = {event_id};
	let manKeys = ["event_id"];
	commFunc.checkKeyExist(req.body, manKeys)
	.then((results) => {
		if(results.length) {
			responses.parameterMissing(res, result[0])
		} else {
			EventModel.deleteQuery(condition)
			.then((eventResult) => {
				responses.success(res, eventResult);
			})
			.catch((error) => responses.sendError(error.message, res));
		}
	})
}