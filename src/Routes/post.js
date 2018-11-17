//import post from '../Controllers/post_controller';
import post from '../Controllers/post_controller_college_user';
import auth from '../Modules/auth';
import multer from 'multer';
import md5 from 'md5';
import path from 'path';
 
exports.getRouter = (app) => {

	let storage = multer.diskStorage({
	destination : function(req,file,callback){
		console.log(file)
        callback(null,'./src/uploads/post');
	},
	filename : function(req,file,callback){
		let fileUniqueName = md5(Date.now());
        callback(null,fileUniqueName+ path.extname(file.originalname));
    }
});
	let upload = multer({storage:storage});


	app.route("/post/post_create").post(auth.requiresLogin_post,upload.any(), post.post_create);

    app.route("/post/get_post_list").post(auth.requiresLogin_post, post.get_post_list);

	app.route("/post/post_delete").post(auth.requiresLogin_post, post.post_delete);

	app.route("/post/post_like").post(auth.requiresLogin_post, post.post_like);

	app.route("/post/post_comment").post(auth.requiresLogin_post, post.post_comment);

	app.route("/post/post_comment_list").post(auth.requiresLogin_post, post.post_comment_list);

	app.route("/post/post_like_list").post(auth.requiresLogin_post, post.post_like_list);

	app.route("/post/post_sub_comment").post(auth.requiresLogin_post, post.post_sub_comment);

	app.route("/post/get_sub_comment").post(auth.requiresLogin_post, post.get_sub_comment);

	app.route ("/post/comment_like").post(auth.requiresLogin_post, post.comment_like);

	app.route ("/post/sub_comment_like").post(auth.requiresLogin_post, post.sub_comment_like);

	app.route ("/post/comment_like_list").post(auth.requiresLogin_post, post.comment_like_list);

	app.route ("/post/sub_comment_like_list").post(auth.requiresLogin_post, post.sub_comment_like_list);

	app.route("/post/get_page_list").post(auth.requiresLogin_post, post.get_page_list);

	app.route("/post/get_user_post").post(auth.requiresLogin_post, post.get_user_post);

	app.route("/post/post_share").post(auth.requiresLogin_post, post.post_share);





	return app;
}