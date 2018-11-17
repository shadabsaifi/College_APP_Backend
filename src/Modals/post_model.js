import connection from '../Modules/connection.js';
import responses from '../Modules/responses';
import constant from '../Modules/constant';

let selectQuery = (values) => {
	return new Promise((resolve, reject) => {
		let sql = "SELECT * FROM `tb_post` WHERE ?";
		connection.query(sql, [values], (err, result) => {
			err ? reject(err) : resolve(result);
		});
	});
};

let selectListQuery = () => {
	return new Promise((resolve, reject) => {
		let sql = "SELECT * FROM `tb_post`";
		connection.query(sql, [], (err, result) => {
			err ? reject(err) : resolve(result);
		});
	});
};

let updateQuery = (values, condition) => {
	return new Promise((resolve, reject) => {
		let sql = "UPDATE `tb_post` SET ? WHERE ?";
		connection.query(sql, [values, condition], (err, result) => {
			if (err) {
				reject(err);
			} else {
				let sql = "SELECT * FROM `tb_post` WHERE ?";
				connection.query(sql, [condition], (err, result) => {
					let {password, ...output} = result[0];
					err ? reject(err) : resolve(output);
				});
			}
		});
	});
};

let insertQuery = (values) => {
	return new Promise((resolve, reject) => {
		let sql = "INSERT INTO `tb_post` SET ?";
		connection.query(sql, [values], (err, result) => {
			if (err) {reject(err);}
			else {
				let sql = "SELECT * FROM `tb_post` WHERE post_id=?";
				connection.query(sql, [values.post_id], (err, result) => {
					err ? reject(err) : resolve(result);
				});
			}
		});
	});
}
let deleteQuery = (values) => {
	return new Promise((resolve, reject) => {
		let sql = "DELETE FROM `tb_post` WHERE ?";
		connection.query(sql, [values], (err,result) =>{
			if(err) { reject(err);} 
			else {
				let sql = "SELECT * FROM `tb_post`";
				connection.query(sql, [], (err, result) => {
					err ? reject(err) : resolve(result);
				});

			}
		});
	});
} 

let insertLikeQuery = (values) => {
	return new Promise((resolve, reject) => {
		let sql = "INSERT INTO `tb_post_like` SET ?";
		connection.query(sql, [values], (err, result) => {
			if (err) {reject(err);}
			else {
				let sql = "SELECT * FROM `tb_post_like` WHERE post_like_id=?";
				connection.query(sql, [values.post_like_id], (err, result) => {
					err ? reject(err) : resolve(result);
				});
			}
		});
	});
}
let selectQuery_like = (values) => {
	return new Promise((resolve, reject) => {
		let sql =  `SELECT * FROM tb_post_like WHERE user_id ="${values.user_id}" AND post_id="${values.post_id}"`;
		connection.query(sql, Object.values(values), (err, result) => {
			err ? reject(err) : resolve(result)
			console.log(result);
		});
	});
}
let deleteLikeQuery = (values) => {
	return new Promise((resolve, reject) => {
		let sql =` delete FROM tb_post_like WHERE post_id= "${values.post_id}" AND user_id = "${values.user_id}" `;
		connection.query(sql, Object.values(values), (err, result) => {
			err ? reject(err) : resolve(result)
			console.log(result);
		});
	})
}

let insertCommentQuery = (values) => {
	return new Promise((resolve, reject) => {
		let sql = "INSERT INTO `tb_post_comment` SET ?";
		connection.query(sql, [values], (err, result) => {
			if (err) {reject(err);}
			else {
				let sql = "SELECT * FROM `tb_post_comment` WHERE post_comment_id=?";
				connection.query(sql, [values.post_comment_id], (err, result) => {
					err ? reject(err) : resolve(result);
				});
			}
		});
	});
}
let get_comment_query = (values) => {
	console.log (values);
	return new Promise((resolve, reject) => {
		let sql = "SELECT * FROM `tb_post_comment` WHERE ?";
		connection.query(sql, [values], (err, result) => {
			err ? reject(err) : resolve(result);
		});
	});
};
let get_likes_query = (values) => {
	return new Promise((resolve, reject) => {
		let sql = "SELECT * FROM `tb_post_like` WHERE ?";
		connection.query(sql, [values], (err, result) => {
			err ? reject(err) : resolve(result);
		});
	});
};
let insertQuery3 = (values) => {
	console.log (values);
	return new Promise((resolve, reject) => {
		let sql = "INSERT INTO `tb_post_sub_comment` SET ?";
		connection.query(sql, [values], (err, result) => {
			if (err) {reject(err);}
			else {
				let sub_comment_id = values.sub_comment_id;
				let sql = `SELECT * FROM tb_post_sub_comment WHERE	? `;
				connection.query(sql, {sub_comment_id}, (err, result) => {
					err ? reject(err) : resolve(result);
				});
			}
		});
	});
};
let insertQuery4 = (values) => {
	return new  Promise((resolve, reject) => {
		let sql = "INSERT INTO `tb_comment_like` SET ?";
		connection.query(sql, [values],(err, result) =>{
			if(err) {
				reject(err);
			} else {
				let comment_like_id = values.comment_like_id;
				let sql = `SELECT * FROM tb_comment_like WHERE ?`;
				connection.query(sql, {comment_like_id}, (err, result) =>{
					err ? reject(err) :resolve(result);
				});
			} 
		});
	});
}
let deleteLikeQuery2 = (values) => {
	return new Promise((resolve, reject) => {
		let sql =` delete FROM tb_comment_like WHERE post_comment_id= "${values.post_comment_id}" AND user_id = "${values.user_id}" `;
		connection.query(sql, Object.values(values), (err, result) => {
			err ? reject(err) : resolve(result)
			console.log(result);
		});
	})
}
let selectQuery_like2 = (values) => {
	return new Promise((resolve, reject) => {
		let sql =  `SELECT * FROM tb_comment_like WHERE user_id ="${values.user_id}" AND post_comment_id="${values.post_comment_id}"`;
		connection.query(sql, Object.values(values), (err, result) => {
			err ? reject(err) : resolve(result)
			console.log(result);
		});
	});
}

let get_comment_query2 = (values) => {
	console.log (values);
	return new Promise((resolve, reject) => {
		let sql = "SELECT * FROM `tb_post_sub_comment` WHERE ?";
		connection.query(sql, [values], (err, result) => {
			err ? reject(err) : resolve(result);
		});
	});
};
let insertQuery5 = (values) => {
	return new  Promise((resolve, reject) => {
		let sql = "INSERT INTO `tb_sub_comment_like` SET ?";
		connection.query(sql, [values],(err, result) =>{
			if(err) {
				reject(err);
			} else {
				let comment_like_id = values.comment_like_id;
				let sql = `SELECT * FROM tb_sub_comment_like WHERE ?`;
				connection.query(sql, {comment_like_id}, (err, result) =>{
					err ? reject(err) :resolve(result);
				});
			} 
		});
	});
}

let deleteLikeQuery3 = (values) => {
	return new Promise((resolve, reject) => {
		let sql =` delete FROM tb_sub_comment_like WHERE sub_comment_id= "${values.sub_comment_id}" AND user_id = "${values.user_id}" `;
		connection.query(sql, Object.values(values), (err, result) => {
			err ? reject(err) : resolve(result)
			console.log(result);
		});
	})
}
let selectQuery_like3 = (values) => {
	return new Promise((resolve, reject) => {
		let sql =  `SELECT * FROM tb_sub_comment_like WHERE user_id ="${values.user_id}" AND sub_comment_id="${values.sub_comment_id}"`;
		connection.query(sql, Object.values(values), (err, result) => {
			err ? reject(err) : resolve(result)
			console.log(result);
		});
	});
}
let get_likes_query2 = (values) => {
	return new Promise((resolve, reject) => {
		let sql = "SELECT * FROM `tb_comment_like` WHERE ?";
		connection.query(sql, [values], (err, result) => {
			err ? reject(err) : resolve(result);
		});
	});
};
let get_likes_query3 = (values) => {
	return new Promise((resolve, reject) => {
		let sql = "SELECT * FROM `tb_sub_comment_like` WHERE ?";
		connection.query(sql, [values], (err, result) => {
			err ? reject(err) : resolve(result);
		});
	});
};
let getlistQuery = (values) => {
	return new Promise((resolve, reject) => {
		let sql = "SELECT * FROM `tb_college_pages`";
		connection.query(sql, [], (err , results) =>{
			if(err) {
				reject(err);
			} else {
				resolve(results);
			}
		});
	})
};
let selectListQuery2 = (values) => {
	return new Promise((resolve, reject)=> {
		let sql = "SELECT * FROM `tb_post` WHERE `uploaded_by_id` = ? ";
		connection.query(sql, [values] ,(err, results) =>{
			if(err) {
				reject(err);
			} else {
				resolve(results);
			}
		});
	})
}

let selectListQuery3 = (values) => {
	console.log(values);
	return new Promise((resolve, reject)=> {
		let sql = `SELECT * FROM tb_post WHERE post_id = "${values.post_id}" AND uploaded_by_id = "${values.owner_id}"`;
		connection.query(sql, Object.values(values) ,(err, results) =>{
			console.log(err, results);
			if(err) {
				reject(err);
			} else {
				resolve(results);
			}
		});
	})
}

let insertQuery6 = (values) => {
	return new  Promise((resolve, reject) => {
		let sql = "INSERT INTO `tb_post_share` SET ?";
		connection.query(sql, [values],(err, result) =>{
			if(err) {
				reject(err);
			} else {
				let sql = `SELECT * FROM tb_post_share WHERE post_id = "${values.post_id}" AND user_id = "${values.user_id}"`;
				connection.query(sql, Object.values(values), (err, result) =>{
					err ? reject(err) :resolve(result);
				});
			} 
		});
	});
}

let imageModel = (imageArray)=>{
	console.log(imageArray);
	let thumbnail, post_content;
	imageArray.map(image=>{
		console.log(image)
	if(image.fieldname == "thumbnail"){
		//thumbnail = image.originalname;
 		thumbnail = `/post/${image.filename}`;
	}else{
				//back_image = image.originalname;
 		post_content = `/post/${image.filename}`;
	}	
	})
	return {thumbnail,post_content};
}

export default {
	imageModel,
	selectQuery,
	selectListQuery,
	updateQuery,
	insertQuery,
	deleteQuery,
	insertLikeQuery,
	insertCommentQuery,
	get_comment_query,
	get_likes_query,
	selectQuery_like,
	deleteLikeQuery,
	insertQuery3,
	insertQuery4,
	deleteLikeQuery2,
	selectQuery_like2,
	insertQuery5,
	deleteLikeQuery3,
	selectQuery_like3,
	get_likes_query2,
	get_likes_query3,
	get_comment_query2,
	getlistQuery,
	selectListQuery2,
	insertQuery6,
	selectListQuery3
}