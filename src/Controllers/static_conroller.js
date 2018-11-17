import commFunc from '../Modules/commonFunction';
import responses from '../Modules/responses';
import staticModel from '../Modals/static_model';


// static controller create by shadab saifi

exports.getContent = (req, res) => {

    let { static_id } = req.query;
    let condition =  { static_id }
	let manKeys = ["static_id"];
    let manValues = { static_id };
    commFunc.checkKeyExist(manValues, manKeys)
	.then((result) => {
		if(result.length) {
			responses.parameterMissing(res,result[0]);
		}
		else{
			staticModel.selectQuery(condition).
			then(content=>{
				responses.success(res, content);
			})
			.catch((error) => responses.sendError(error.message, res));
		}
	})
	.catch((error) => responses.sendError(error.message, res));

};

exports.updateContent = (req, res)=>{

    let { static_id, content } = req.body;
    let condition =  { static_id }
    let updateData = { content }
	let manKeys = ["static_id", "content"];
    let manValues = { static_id, content };
    commFunc.checkKeyExist(manValues, manKeys)
	.then((result) => {
		if(result.length) {
			responses.parameterMissing(res,result[0]);
		}
		else{
			staticModel.updateContent(updateData, condition).
			then(contet=>{
				responses.success(res, contet);
			})
			.catch((error) => responses.sendError(error.message, res));
		}
	})
	.catch((error) => responses.sendError(error.message, res));
}

exports.deleteContent = (req, res)=>{
    
    let { static_id } = req.query;
    let condition =  { static_id }
	let manKeys = ["static_id"];
    let manValues = { static_id };
    commFunc.checkKeyExist(manValues, manKeys)
	.then((result) => {
		if(result.length) {
			responses.parameterMissing(res,result[0]);
		}
		else{
			staticModel.deleteContent(condition).
			then(contet=>{
				responses.success(res, contet);
			})
			.catch((error) => responses.sendError(error.message, res));
		}
	})
	.catch((error) => responses.sendError(error.message, res));
}




