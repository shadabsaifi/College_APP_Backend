import user from '../Controllers/user_controller';
import staticContent from '../Controllers/static_conroller';
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


	app.route("/user/manual_login").post(user.manual_login);

	app.route("/user/manual_signup").post(user.manual_signup);

	app.route("/user/social_signup").post(user.social_signup);


	app.route("/user/social_login").post(user.social_login);


	app.route("/user/create_profile").post(auth.requiresLogin, upload.any(), user.create_profile);

	app.route ("/user/forget_Password").post ( user.forget_Password);

	app.route ("/user/varify_otp").post ( user.varify_otp);

	app.route ("/user/reset_password").post ( user.reset_password);

	app.route ("/user/view_profile").get(auth.requiresLogin, user.view_profile);

	app.route ("/user/logout").post(auth.requiresLogin, user.logout);

	app.route("/user/edit_profile").post(auth.requiresLogin,upload.any(), user.edit_profile);

	// router create by shadab saifi
	app.route("/user/getContent").get(staticContent.getContent)

	app.route("/user/updateContent").post(staticContent.updateContent)

	app.route("/user/deleteContent").get(staticContent.deleteContent)

	return app;
}