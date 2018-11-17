import connection from '../Modules/connection.js';
import responses from '../Modules/responses';
import constant from '../Modules/constant';



let insertQuery = (values) => {
	return new Promise((resolve, reject) => {
		let sql = "INSERT INTO `tb_event` SET ? ";
		connection.query(sql, [values], (err, result) => {
			if(err) {
				reject(err);
			} else {
				let event_id = values.event_id;
				let sql = "SELECT * FROM `tb_event` WHERE event_id=?";
				connection.query(sql, [event_id], (err, result) => {
					err ? reject(err) : resolve(result);
				});
			}
		})
	})
};

let selectListQuery2 = () => {
	return new Promise ((resolve, reject) => {
		let sql = "SELECT * FROM `tb_event`";
		connection.query(sql, [], (err, result) => {
			if(err) {
				reject(err);
			} else {
				resolve(result);
			}
		})

	})
};
let selectQuery = (values) => {
	return new Promise ((resolve, reject) => {
		let sql = "SELECT * FROM `tb_event` WHERE ? ";
		connection.query(sql, [values], (err, result) => {
			if(err) {
				reject(err);
			} else {
				resolve(result);
			}
		})

	})
};
let deleteQuery = (values) => {
	return new  Promise((resolve, reject) =>{
		let sql = "DELETE FROM `tb_event` WHERE ? ";
		connection.query(sql, [values], (err,result) => {
			if(err) {
				reject(err);
			} else {
				resolve(result);
			}
		})
	})
}
let updateQuery = (values, condition) => {
	return new Promise((resolve, reject) => {
		let sql = "UPDATE `tb_event` SET ? WHERE ? ";
		connection.query(sql, [values, condition],(err, results) => {
			if (err) {
				reject(err);
			} else {
				let sql = "SELECT * FROM `tb_event` WHERE ?";
				connection.query(sql, [condition], (err, result) => {
					//let {password, ...output} = result[0];
					err ? reject(err) : resolve(result);
				});
			}
		})
	})
}

let imageModel = (imageArray)=>{
	console.log(imageArray);
	let thumbnail, event_banner;
	imageArray.map(image=>{
		console.log(image)
	if(image.fieldname == "thumbnail"){
		//thumbnail = image.originalname;
 		thumbnail = `/event/${image.filename}`;
	}else{
				//back_image = image.originalname;
 		event_banner = `/event/${image.filename}`;
	}	
	})
	return {thumbnail,event_banner};
}


export default {
	 
	insertQuery,
	selectQuery,
	deleteQuery,
	updateQuery,
	selectListQuery2,
	imageModel
}