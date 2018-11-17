import admin from '../Controllers/admin_controller';
import auth from '../Modules/auth';
import multer from 'multer';
import md5 from 'md5';
import path from 'path';

    

exports.getRouter = (app) => {
	let storage = multer.diskStorage({
	destination : function(req,file,callback){
		console.log(file)
        callback(null,'./src/uploads/admin');
	},
	filename : function(req,file,callback){
		let fileUniqueName = md5(Date.now());
        callback(null,fileUniqueName+ path.extname(file.originalname));
    }
});
	let upload = multer({storage:storage});

	app.route("/admin/login").post(admin.login);

	app.route ("/admin/forget_Password").post (auth.requiresLogin_admin, admin.forget_Password);

	app.route ("/admin/varify_otp").post (auth.requiresLogin_admin, admin.varify_otp);

	app.route ("/admin/reset_password").post (auth.requiresLogin_admin, admin.reset_password);

	app.route ("/admin/create_profile").post (auth.requiresLogin_admin, upload.any(), admin.create_profile);

	return app;
}