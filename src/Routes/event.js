import event from '../Controllers/event_controller';
import auth from '../Modules/auth';
import multer from 'multer';
import md5 from 'md5';
import path from 'path';
 
exports.getRouter = (app) => {

	let storage = multer.diskStorage({
	destination : function(req,file,callback){
		console.log(file)
        callback(null,'./src/uploads/event');
	},
	filename : function(req,file,callback){
		let fileUniqueName = md5(Date.now());
        callback(null,fileUniqueName+ path.extname(file.originalname));
    }
});
	let upload = multer({storage:storage});

	app.route("/event/create_event").post(auth.requiresLogin, upload.any(), event.create_event);

	app.route("/event/show_event").post(auth.requiresLogin, event.show_event);

	app.route("/event/edit_event").post(auth.requiresLogin,upload.any(), event.edit_event);

	app.route("/event/delete_event").post(auth.requiresLogin, event.delete_event);

	//app.route("/post/post_create").post(auth.requiresLogin_post,upload.any(), post.post_create);
	return app;
}