import functionality from '../Controllers/functionality_controller';
import auth from '../Modules/auth';
import multer from 'multer';
import md5 from 'md5';
import path from 'path';

    

exports.getRouter = (app) => {

	app.route("/functionality/block_user").post(auth.requiresLogin, functionality.block_user);

	app.route("/functionality/report_post").post(auth.requiresLogin, functionality.report_post);

	app.route("/functionality/set_preference").post(auth.requiresLogin, functionality.set_preference);

	app.route("/functionality/set_college").post( functionality.set_college);

	app.route("/functionality/get_college").post( functionality.get_college);
	
	return app;
}