import college from '../Controllers/college_controller';
import auth from '../Modules/auth';
import multer from 'multer';
import md5 from 'md5';
import path from 'path';

    

exports.getRouter = (app) => {

	let storage = multer.diskStorage({
	destination : function(req,file,callback){
		console.log(file)
        callback(null,'./src/uploads/college');
	},
	filename : function(req,file,callback){
		let fileUniqueName = md5(Date.now());
        callback(null,fileUniqueName+ path.extname(file.originalname));
    }
});
	let upload = multer({storage:storage});


	app.route("/college/manual_login").post(college.manual_login);

	app.route("/college/manual_signup").post(college.manual_signup);

	app.route("/college/social_signup").post(college.social_signup);


	app.route("/college/social_login").post(college.social_login);


	app.route("/college/create_profile").post(auth.requiresLogin_college, upload.any(), college.create_profile);

	 app.route ("/college/forget_Password").post (college.forget_Password);

	app.route ("/college/varify_otp").post (college.varify_otp);

	app.route ("/college/reset_password").post (college.reset_password);

	app.route("/college/edit_profile").post(auth.requiresLogin_college, upload.any(), college.edit_profile);

	app.route("/college/create_page").post(auth.requiresLogin_college, upload.any(), college.create_page);

	app.route("/college/logout").post (auth.requiresLogin_college, college.logout);

	return app;
}