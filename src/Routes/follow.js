import follow from '../Controllers/follow_controller';
import auth from '../Modules/auth';
import multer from 'multer';
import md5 from 'md5';
import path from 'path';

    

exports.getRouter = (app) => {

	let storage = multer.diskStorage({
		destination : function(req,file,callback){
			console.log(file)
	        callback(null,'./src/uploads/user');
		},
		filename : function(req,file,callback){
			let fileUniqueName = md5(Date.now());
	        callback(null,fileUniqueName+ path.extname(file.originalname));
	    }
	});
	let upload = multer({storage:storage});

	app.route("/follow/send_request").post(auth.requiresLogin, follow.send_request);

	app.route("/follow/show_request").post(auth.requiresLogin, follow.show_request);

	app.route("/follow/accept_request").post(auth.requiresLogin, follow.accept_request);

	app.route("/follow/show_user").post(auth.requiresLogin, follow.show_user);

	app.route("/follow/show_friends").post(auth.requiresLogin, follow.show_friends);
	
	// create by shadab saifi

	app.route("/follow/notification").get(follow.notification);
	
	app.route("/follow/onOffNotification").get(follow.onOffNotification);
	
	return app;
}