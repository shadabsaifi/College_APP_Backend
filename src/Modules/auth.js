import connection from './connection';
import responses from './responses';

exports.requiresLogin = (req, res, next) => {
    console.log ("auth");
    let { access_token } = req.headers;
    if (access_token) {
        let sql = "SELECT * FROM `tb_user_pivot` WHERE `access_token`=?";
        connection.query(sql, [access_token], (err, result) => {

            if (err) {
                responses.sendError(err.message, res);
            } else if (result.length == 0) {
                responses.authenticationErrorResponse(res);
            } else {
                console.log(result);
                 req.user = result[0];
                 next();
            }
        });
    } else {
        next(responses.parameterMissingResponse(res));
    }
}

exports.requiresLogin_admin = (req, res, next) => {
    let { access_token } = req.headers;
    if (access_token) {
        let sql = "SELECT * FROM `tb_admin` WHERE `access_token`=?";
        connection.query(sql, [access_token], (err, result) => {
            if (err) {
                responses.sendError(err.message, res);
            } else if (result.length == 0) {
                responses.authenticationErrorResponse(res);
            } else {
                 req.admin = result[0];
                 next();
            }
        });
    } else {
        next(responses.parameterMissingResponse(res));
    }
}

exports.requiresLogin_college = (req, res, next) => {
    let { access_token } = req.headers;
    if (access_token) {
        let sql = "SELECT * FROM `tb_college_pivot` WHERE `access_token`=?";
        connection.query(sql, [access_token], (err, result) => {
            if (err) {
                next(responses.sendError(err.message, res));
            } else if (result.length == 0) {
                responses.authenticationErrorResponse(res);
            } else {
                 req.college = result[0];
                 next();
            }
        });
    } else {
        next(responses.parameterMissingResponse(res));
    }
}
exports.requiresLogin_post = (req, res, next) => {
    let { access_token } = req.headers;
    if (access_token) {
        console.log(access_token);
        let sql = "SELECT * FROM `tb_user_pivot` WHERE `access_token`=?";
        connection.query(sql, [access_token], (err, result) => {
            if (err) {
                responses.sendError(err.message, res);
            } else if (result.length == 0) {
                let sql = "SELECT * FROM `tb_college_pivot` WHERE `access_token`=?";
                connection.query(sql, [access_token], (err, result) => {
                    if (err) {
                        next(responses.sendError(err.message, res));
                    } else if (result.length == 0) {
                        responses.authenticationErrorResponse(res);
                    } else {
                        req.college = result[0];
                        next();
                    }
                });
            } else {
                req.user = result[0];
                next(); 
            }
        });
    } else {
        next(responses.parameterMissingResponse(res));
    }
}