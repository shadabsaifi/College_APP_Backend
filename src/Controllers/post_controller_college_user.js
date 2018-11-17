import commFunc from '../Modules/commonFunction';
import responses from '../Modules/responses';
import constant from '../Modules/constant';
import UserModel from '../Modals/user_model';
import connection from '../Modules/connection.js';
import PostModel from '../Modals/post_model';
import EventModel from '../Modals/event_model';
import PUSH_MESSAGE from '../Modules/FCM';
import md5 from 'md5';
import async from 'async';
import _ from 'lodash';

let arr = [] ;


exports.post_create = (req, res) => {
    let uploaded_by ;
    let uploaded_by_id;
    let image;
    let {post_content,post_text,post_type} = req.body;
    
    if (req.user) {
        uploaded_by_id =  req.user.user_id ;
        uploaded_by  = 1;
        console.log (uploaded_by_id, uploaded_by);
    } else {
         uploaded_by_id =  req.college.college_id ;
         uploaded_by = 2 ;
         console.log (uploaded_by_id, uploaded_by);
    }
    let current_date = new Date();
    let created_on = Math.round(current_date.getTime() / 1000);
    let post_id = md5(current_date);

    for (var i = 0; i < req.files.length; i++) {
        post_content = `/post/${req.files[i].filename}`;
    }
    console.log(req.files);
    var manValues = { post_text, post_type };
    let manKeys = ["post_text", "post_type"];
    let insertData = {uploaded_by, uploaded_by_id, post_id, post_type, post_text, created_on};
    if(post_type == 3) {
       var manValues = { post_content, post_text, post_type };
        let manKeys = ["post_content", "post_text", "post_type"];
        if(req.files){
            image = PostModel.imageModel(req.files)
            insertData= _.merge(insertData,image)
        } 
    } else {
        for (var i = 0; i < req.files.length; i++) {
            post_content = `/post/${req.files[i].filename}`;
        }
        console.log(post_content);
        insertData= _.merge(insertData,{post_content})
    }
    console.log(insertData)
    commFunc.checkKeyExist(manValues, manKeys)
     .then(result => result.length ? responses.parameterMissing(res, result[0]) : '')
     .then(result => {
         PostModel.insertQuery(insertData)
         .then((postResult) => { responses.success(res, postResult[0])})
         .catch((error) => responses.sendError(error.message, res));
     })
     .catch((error) => responses.sendError(error.message, res));
};

exports.get_post_list = (req, res) => {
        let id;
        let arr;
        console.log(req.user);
        if (req.user) {
            id = req.user.user_id;
        } else if (req.college) {
            id = req.college.college_id;
        }
        let condition = {"user_id" : id};
        UserModel.selectQuery(condition)
        .then((userResult) => {
            let prefrence = userResult[0].user_preference;
            console.log(prefrence);
            arr = JSON.parse("[" + prefrence + "]");
            console.log(arr);
            let postResult = [];
            PostModel.selectListQuery()
            .then((Result) => {
                Result.forEach(function(element) {
                    postResult.push(element);
                })
                
                EventModel.selectListQuery2()
                .then((eventResult) => {
                    eventResult.forEach(function(element) {
                        postResult.push(element);
                    })

                    
                    var postArray = [];
                    let allData3 = [];
                    //arr = [1,2,null,null];
                    async.eachSeries(postResult, get_post_list, (results) => {
                        let a, b, c;
                        if (arr[0] == "1") {
                            a = 1;
                        } else {
                            a = "null";
                        }
                        if (arr[1] == "2") {
                            b = 2;
                        } else {
                            b = "null";
                        }
                        if (arr[2] == "3") {
                            c = 3;
                        } else {
                            c = "null";
                        }
                        let allData = _.partition(postArray, function(o) {
                            return o.post_type == a || o.post_type == b || o.post_type == c
                        });
                        console.log(allData[0], allData[1]);
                        if (arr[3] == "4") {
                            let eventData = _.partition(allData[1], function(o) {
                                return o.event_id
                            });
                            var prefrenceData = allData[0].concat(eventData[0]);
                            allData3 = (_.orderBy(prefrenceData, ['created_on'], ['desc'])).concat(_.orderBy(eventData[1], ['created_on'], ['asc']));


                        } else {
                            allData3 = (_.orderBy(allData[0], ['created_on'], ['desc'])).concat(_.orderBy(allData[1], ['created_on'], ['asc']));
                        }
                        responses.success(res, allData3);
                        postArray = [];
                    });

                    function get_post_list(postResult, callback) {
                        async.parallel([
                            //calling count of like
                            function(callback) {
                                total_like_count(postResult.post_id, function(total_like_count_result) {
                                    callback(null, total_like_count_result)
                                });
                            },
                            //calling comment list
                            function(callback) {
                                total_comment(postResult.post_id, function(total_comment_result) {
                                    callback(null, total_comment_result)
                                });
                            },
                            function(callback) {
                                total_comment_count(postResult.post_id, function(total_comment_count_result) {
                                    callback(null, total_comment_count_result)
                                });
                            },
                            function(callback) {
                                liked_by_me(id, postResult.post_id, function(liked_by_me_result) {
                                    callback(null, liked_by_me_result)
                                });
                            },
                            function(callback) {
                                get_user_result(postResult.uploaded_by_id || postResult.user_id, function(userResults_result) {
                                    callback(null, userResults_result)
                                });
                            }
                        ], function(err, results) {
                            postResult.total_like_count = results[0];
                            postResult.comment_details = results[1];
                            postResult.total_comment_count = results[2];
                            postResult.liked_by_me = results[3];
                            postResult.get_user_result = results[4] || {};
                            postArray.push(postResult);
                            callback();
                        });

                        function total_like_count(post_id, callback) {
                            let sql = "SELECT * FROM `tb_post_like` WHERE `post_id`=?";
                            connection.query(sql, [post_id], (err, result) => {
                                err ? callback(0) : callback(result.length);
                            })
                        }

                        function total_comment(post_id, callback) {
                            var sql = "SELECT u.user_id, u.email, u.name, u.profile_url," +
                                " p.* FROM `tb_user` u LEFT JOIN " +
                                "`tb_post_comment` p ON p.user_id = u.user_id WHERE p.post_id=?";
                            connection.query(sql, [post_id], (err, result) => {

                                err ? callback(0) : callback(result);
                            });
                        }

                        function total_comment_count(post_id, callback) {
                            let sql = "SELECT * FROM `tb_post_comment` WHERE `post_id`=?";
                            connection.query(sql, [post_id], (err, result) => {
                                err ? callback(0) : callback(result.length);
                            })
                        }

                        function liked_by_me(user_id, post_id, callback) {
                            let sql = "select * from `tb_post_like` where user_id = ? AND post_id=?";
                            connection.query(sql, [user_id, post_id], (err, result) => {
                                if (err) {
                                    callback(0);
                                } else if (result.length) {

                                    callback(1);
                                } else {
                                    callback(2);
                                }
                            });
                        }

                        function get_user_result(user_id, callback) {
                            console.log(user_id);
                            let sql = "SELECT * FROM `tb_user` WHERE `user_id`=?";
                            connection.query(sql, [user_id], (err, result) => {
                                console.log(result.length);
                                if (err) {
                                    callback(0)
                                } else if (result.length == 0) {
                                    let sql = "SELECT * FROM `tb_college` where `college_id` =? ";
                                    connection.query(sql, [user_id], (err, result) => {
                                        if (err) {
                                            callback(0);
                                        } else {
                                            console.log('college');
                                            callback(result[0]);
                                        }
                                    });
                                } else {
                                    console.log('user')
                                    callback(result[0]);
                                }
                            })
                        }
                    }
                }).catch((error) => responses.sendError(error.message, res));
            }).catch((error) => responses.sendError(error.message, res));
        }).catch((error) => responses.sendError(error.message, res));
            };

exports.post_delete = (req, res) => {
    let {post_id}  = req.body;
    let manKeys = ["post_id"];

    let condition = {post_id};
    commFunc.checkKeyExist(req.body, manKeys)
    .then(result => result.length ? responses.parameterMissing(res, result[0]) : '')
    .then(result => {
        PostModel.deleteQuery(condition)
        .then((postResult) => {responses.success(res,postResult)})
        .catch((error)=>responses.sendError(error.message,res));
    })
    .catch((error) => responses.sendError(error.message, res));
};

exports.post_like = (req, res) => {
    let user_id;
    let user_type;
    if (req.user) {
        user_id =  req.user.user_id ;
        user_type = 1;
    } else if(req.college) {
        user_id =  req.college.college_id ;
        user_type = 2 ;
   }
    let {post_id}  = req.body;
    let manValues = {post_id}
    let manKeys = ["post_id"]; 
    //let user_id = req.user.id;
    let current_date = new Date();
    let created_on = Math.round(current_date.getTime() / 1000);
    let post_like_id = md5(current_date);
    let insertData = {user_id, post_id, post_like_id,user_type, created_on};
    let condition = {post_id, user_id};
    commFunc.checkKeyExist(manValues, manKeys)
    .then(result => result.length ? responses.parameterMissing(res, result[0]) : '')
    .then(result => {
        PostModel.selectQuery_like(condition)
        .then(postResult => {
                if(postResult.length != 0) {
                    console.log ("delete");
                PostModel.deleteLikeQuery(condition)
                    .then(results => {responses.success(res,postResult)})
                    .catch((error) => responses.sendError(error.message,res));
            } else {
                console.log ("insert");
                PostModel.insertLikeQuery(insertData)
                .then((postResult) => {
                    let user_id = postResult[0].user_id;
                    condition = {user_id};
                    UserModel.selectQuery(condition)
                    .then(userResults => {
                        responses.success(res,_.merge(postResult[0],userResults[0]));
                    })
                    .catch((error)=>responses.sendError(error.message,res));
                })
                .catch((error)=>responses.sendError(error.message,res));
            }
        })
    })
    .catch((error) => responses.sendError(error.message, res));
};

exports.post_comment = (req, res) => {
    let user_id;
    let user_type;
    if (req.user) {
        user_id =  req.user.user_id ;
        user_type = 1;
    } else if(req.college){
        user_id =  req.college.college_id ;
        user_type = 2 ;
   }
    let {post_id, post_comment_text}  = req.body;
    let manKeys = ["post_id", "post_comment_text"];
    //let user_id = req.user.user_id;
    let current_date = new Date();
    let created_on = Math.round(current_date.getTime() / 1000);
    let post_comment_id = md5(current_date);
    let insertData = {user_id, post_id, post_comment_id,user_type, post_comment_text, created_on};
    commFunc.checkKeyExist(req.body, manKeys)
    .then(result => result.length ? responses.parameterMissing(res, result[0]) : '')
    .then(result => {
        PostModel.insertCommentQuery(insertData)
        .then((postResult) => {
            console.log(postResult);
            let post_id = postResult[0].post_id;
            PostModel.selectQuery({post_id})
            .then((postResults) => {
                console.log(postResults);
                let sql = `SELECT * FROM tb_user LEFT JOIN tb_user_pivot ON ( tb_user.user_id = tb_user_pivot.user_id ) WHERE tb_user_pivot.user_id = ?`;
                connection.query(sql, [user_id], (err, results) => {
                    console.log("***********************");
                    console.log(err, results);
                    console.log("***********************");
                    if(err) {
                        responses.sendError(error.message, res);
                    } else {
                        let user_id2 = postResults[0].uploaded_by_id;
                        let sql = `SELECT * FROM tb_user LEFT JOIN tb_user_pivot ON ( tb_user.user_id = tb_user_pivot.user_id ) WHERE tb_user_pivot.user_id = ?`;
                        connection.query(sql, [user_id2], (err, result) => {
                           // console.log(err, result);
                            if(err) {
                                responses.sendError(error.message, res);
                            } else {
                                // console.log("***********************");
                                // console.log(result);
                                // console.log("************************");
                                let device_token = result &&result.length && result[0].device_token || "";
                                let device_type = result && result.length && result[0].device_type || "";
                                let title = `${result[0].user_name} You have a new message`;
                                let notify = {    
                                    body: `${results[0].user_name} commented on your post.`,
                                    click_action: "FCM_PLUGIN_ACTIVITY",
                                    "color": "#f95b2c",
                                    "sound": true
                                };
                                console.log(device_type, device_token, notify, title);

                                let notification_id = md5(new Date());
                                let send_by =results && results.length && results[0].user_id || "";
                                let send_to = result && result.length && result[0].user_id|| "";
                                let notification_text =  notify.body;
                                let notification_type = 3;
                                let current_date = new Date();
                                let created_at = Math.round(current_date.getTime() / 1000);
                                let payload = {user_id:results[0].user_id,post_id :postResults[0].post_id,notify,notification_type};
                                console.log(payload);
                                let data = {notification_id, send_by, send_to, notification_text, notification_type, created_at};
                                console.log(data);
                                console.log("Notification pe aa gya ab save hoga");
                                let sql = `INSERT INTO tb_notification SET ?`;
                                connection.query(sql, [data], (err, result) => {
                                    if(err) {
                                       responses.sendError(err.message, res); 
                                    } else {
                                    PUSH_MESSAGE.push_notification("AIzaSyCN0Kd_tmsbC3f5x2NTi2o5GtoDnFIO7NE", device_token,device_type, payload, notify, function(error, resp) {
                                        console.log({error, resp})
                                    });

                                    let user_id =  postResult[0].user_id ;
                                    let condition = {"user_id" : user_id } ;
                                    UserModel.selectQuery(condition)
                                    .then(results => {
                                        responses.success(res, _.merge(postResult[0],results[0]));                             
                                    })
                                    .catch((error) =>responses.sendError(error.message, res));
                                    }
                                })
                            }
                        })
                    }
                })
            }).catch((error)=>responses.sendError(error.message,res));

             
        })
        .catch((error)=>responses.sendError(error.message,res));
    })
    .catch((error) => responses.sendError(error.message, res));
};

exports.post_sub_comment = (req, res) => {
    console.log("sub_comment");
    let user_id;
    let user_type;
    if (req.user) {
        user_id =  req.user.user_id ;
        user_type = 1;
    } else if(req.college) {
        user_id =  req.college.college_id ;
        user_type = 2 ;
   }
    let {post_comment_id, sub_comment_text} = req.body;
    let manKeys = ["post_comment_id", "sub_comment_text"];
    let manValues = {post_comment_id, sub_comment_text};

    let current_date = new Date();
    let created_on = Math.round(current_date.getTime() / 1000);
    let sub_comment_id =md5(current_date);

    let insertData = {user_id, user_type, post_comment_id, sub_comment_id, sub_comment_text, created_on};

    commFunc.checkKeyExist(manValues, manKeys)
    .then(result => result.length ?responses.parameterMissing(res, result[0]): '')
    .then((result) => {
        PostModel.insertQuery3(insertData)
        .then((postResult) =>{
            console.log (postResult);
            user_id = postResult[0].user_id;
            let condition = {"user_id" : user_id}
            console.log (condition);
            UserModel.selectQuery(condition)
         .  then(results => {
            console.log (result);
                responses.success(res, _.merge(postResult[0],results[0]));                             
            })
            .catch((error) =>responses.sendError(error.message, res));
        })
        .catch((error) =>responses.sendError(error.message, res));
    }) 
    .catch((error) =>responses.sendError(error.message, res));
};

exports.get_sub_comment =(req, res) => {
    let user_id;
    let user_type;
    if (req.user) {
        user_id =  req.user.user_id ;
        user_type = 1;
    } else if(req.college){
        user_id =  req.college.college_id ;
        user_type = 2 ;
   }
    let {post_comment_id} = req.body;
    let manKeys = ["post_comment_id"];
    let manValues = {post_comment_id};
    let condition = {post_comment_id};
    let commentArray  = []; 
    commFunc.checkKeyExist (manValues, manKeys)
    .then(result => result.length ? responses.parameterMissing(res, result[0]) : '')
    .then(result => {
        PostModel.get_comment_query2(condition)
        .then((commentResult) => { 
            async.eachSeries(commentResult, get_comment_list, (results) =>{
                return responses.success(res, commentArray);
                // commentArray = [];
            });
            function get_comment_list(commentResult, callback) {
                async.parallel([

                    function(callback) {
                        get_user_result(commentResult , function(userResult_Result) {
                            callback(null, userResult_Result)
                        })
                    },
                    function(callback) {
                        get_like_result(commentResult ,function(postLikeResults_result) {
                            callback(null,postLikeResults_result )
                        })
                    },
                    function(callback) {
                        liked_by_me(user_id, commentResult , function(likedByMe_result_results) {
                            callback(null, likedByMe_result_results)
                        })
                    },
                    function(callback) {
                        total_like_count(user_id, commentResult , function(likedByMe_result_results) {
                            callback(null, likedByMe_result_results)
                        })
                    }

                    ], function(err, results) {
                    commentResult.get_user_result = results[0] ;
                    commentResult.get_like_result = results[1] ;
                    commentResult.liked_by_me = results[2]; 
                    commentResult.total_like_count = results[3];
                    commentArray.push(commentResult);
                    callback();
                });
                // function get_sub_comment (commentResult, callback) {
                //     let sql = "SELECT * FROM  `tb_post_sub_comment` WHERE `post_comment_id`=?";
                //     connection.query(sql, [commentResult.post_comment_id], (err, result) =>{
                //         if(err) {
                //             callback(0);
                //         } else{
                //             callback(result);
                //         }
                //     })
                // }
                function get_user_result(commentResult, callback) {
                    let sql  = "SELECT * FROM `tb_user` WHERE `user_id` = ? ";
                    connection.query(sql, [commentResult.user_id], (err, result) => {
                        if(err) {
                            callback(0);
                        } else {
                            callback(result[0])
                        }
                    })
                }
                function get_like_result(commentResult, callback) {
                    let sql = "SELECT * FROM `tb_sub_comment_like` WHERE `user_id` = ? AND `sub_comment_id` = ?";
                    connection.query(sql, [user_id, commentResult.sub_comment_id], (err, result) => {
                        if(err) {
                            callback(0);
                        } else {
                            callback(result)
                        }
                    })
                }
                function liked_by_me(user_id, commentResult, callback) {
                    let sql = "SELECT * FROM `tb_sub_comment_like` WHERE `user_id` = ? AND `sub_comment_id` = ?";
                    connection.query(sql, [user_id, commentResult.sub_comment_id], (err, result) => {
                        if(err) {
                            callback (0);
                        } else{
                            if(result.length) {
                                callback(1);
                            } else {
                                callback(2);
                            }
                        }
                    }) 
                }
                function total_like_count(user_id, commentResult, callback) {
                    let sql = "SELECT * FROM `tb_sub_comment_like` WHERE `user_id` = ? AND `sub_comment_id` = ?";
                    connection.query(sql, [user_id, commentResult.sub_comment_id], (err, result) => {
                        if(err) {
                            callback (0);
                        } else{
                            callback(result.length);
                        }
                    })  
                }
            }
        }).catch((error) =>{ console.log (error); responses.sendError(error.message, res)});
    }).catch((error) => { console.log(error); responses.sendError(error.message, res)});
};

exports.post_like_list = (req, res) => {
    let {post_id} = req.body; 
    let manKeys = [ "post_id"] ;
    let condition = {post_id};

    commFunc.checkKeyExist (req.body, manKeys)
    .then(result => result.length ? responses.parameterMissing(res, result[0]) : '')
    .then(result => {
        
        PostModel.get_likes_query(condition)
        .then((likeResult) => { 
            // responses.success(res, likeResult)
            var likeArray = [];
            async.eachSeries(likeResult, get_like_list, (results) =>{
                responses.success(res, likeArray);
                likeArray = [];
            });

            function get_like_list(likeResult, callback) {
                async.parallel([
                    //calling count of like
                     function(callback) {
                        get_user_result(likeResult.user_id, function(userResults_result){
                            callback(null,userResults_result)
                        });
                    }
                ], function(err, results) {
                    ;
                    likeResult.get_user_result = results[0] || {};
                    likeArray.push(likeResult);
                    callback();
                });
                function get_user_result(user_id, callback) {
                    let sql = "SELECT * FROM `tb_user` WHERE `user_id`=?";
                    connection.query(sql, [user_id], (err, result) => {
                        if(err){ 
                         callback(0) 
                        }else {
                         callback(result[0]);
                        }
                    })
                }
            }
        }).catch((error) => responses.sendError(error.message, res));
    }).catch((error) => responses.sendError(error.message, res));
};


exports.post_comment_list = (req, res) => {
    let user_id;
    let user_type;
    if (req.user) {
        user_id =  req.user.user_id ;
        user_type = 1;
    } else if(req.college) {
        user_id =  req.college.college_id ;
        user_type = 2 ;
   }

    let {post_id} = req.body; 
    let manKeys = ["post_id"];
    let condition = {post_id};

    commFunc.checkKeyExist (req.body, manKeys)
    .then(result => result.length ? responses.parameterMissing(res, result[0]) : '')
    .then(result => {
        PostModel.get_comment_query(condition)
        .then((postResult) => { 
            let postCommentArr = [];
            async.eachSeries(postResult, get_post_details, function(result){
                responses.success(res, postCommentArr);
            });
            function get_post_details(postResult, callback){
                async.parallel([
                    //calling count of like
                    function(callback) {
                        get_user_result(postResult, function(userResults_result){
                            callback(null,userResults_result)
                        });
                    },
                    function(callback) {
                        get_sub_comment(postResult, function(postResults_result){
                            callback(null, postResults_result)
                        })
                     },
                    function(callback) {
                        get_comment_like(postResult, function(postLikeResults_result){
                            callback(null, postLikeResults_result)
                        })
                    },
                    function(callback) {
                        liked_by_me(user_id, postResult.post_comment_id, function(liked_by_me_result){
                            callback(null,liked_by_me_result)
                        });
                    }   
                ], function(err, results) {
                    postResult.get_user_result = results[0] || {};
                    postResult.get_sub_comment_list = results[1] || [] ;
                    postResult.total_comment_like = results[2] || {} ;
                    postResult.liked_by_me = results[3];
                    postCommentArr.push(postResult);
                    callback();
                });

                function get_user_result(postResult, callback) {
                    console.log (postResult);
                    let sql = "SELECT * FROM `tb_user` WHERE `user_id`=?";
                    connection.query(sql, [postResult.user_id], function(err, userResult) {
                        if (err) {
                            callback(0);
                        } else {
                            console.log(userResult);
                            if (userResult.length > 0 ) {
                                callback(userResult[0]);
                            } else {
                                callback({});
                            }
                        }
                    });
                }

                function get_sub_comment(postResult, callback) {
                    let sql = "SELECT * FROM `tb_post_sub_comment` WHERE `post_comment_id`=?";
                    connection.query(sql, [postResult.post_comment_id], (err, postSubCommentResult) =>{
                        if(err) {
                            callback(0);
                        } else {
                            if (postSubCommentResult.length > 0 ) {
                                async.eachSeries(postSubCommentResult, get_sub_user_result, (userResult) =>{
                                    callback(postSubCommentResult);
                                })
                                function get_sub_user_result(postSubCommentResult, callback) {
                                    let sql = `SELECT * FROM tb_user WHERE user_id = ?`;
                                    connection.query(sql , [postSubCommentResult.user_id],(err, userSubCommentResult) =>{
                                        if(err) {
                                            callback(0);
                                        }else {
                                            if (userSubCommentResult.length > 0) {
                                                postSubCommentResult.posted_by_use_details = userSubCommentResult[0] || {};
                                                callback();
                                            } else {
                                                postSubCommentResult.posted_by_use_details = {};
                                                callback();
                                            }
                                        }
                                    }) 
                                }
                            } else {
                                postSubCommentResult = [];
                                callback(postSubCommentResult);
                            }
                        }
                    });
                }
                function get_comment_like(postResult, callback) {
                    let sql = "SELECT * FROM `tb_comment_like` where `post_comment_id` = ?";
                    connection.query(sql,[postResult.post_comment_id], (err,commentLikeResult) =>{
                        if(err) {
                            callback(0);
                        } else {
                            if(commentLikeResult.length >0) {
                                postResult.total_like_count = commentLikeResult.length;
                                callback();
                            } else {
                                postResult.total_like_count = 0;
                                callback();
                            }

                        }
                    });
                }
                function liked_by_me (user_id, post_comment_id, callback) {
                    console.log(user_id, post_comment_id);
                    let sql = "select * from `tb_comment_like` where user_id = ? AND post_comment_id=?";
                    connection.query (sql, [user_id, post_comment_id], (err, result) => {
                        if (err) {
                            callback (0); 
                        } else if(result.length) {

                            callback(1);
                        } else {
                            callback(2);
                        }
                    });
                }

            }
        }).catch((error) => responses.sendError(error.message, res));
    }).catch((error) => responses.sendError(error.message, res));
};

exports.comment_like = (req, res) => {
    let  {post_comment_id} = req.body;
    let user_id;
    let user_type;
    if (req.user) {
        user_id =  req.user.user_id ;
        user_type = 1;
    } else if(req.college) {
        user_id =  req.college.college_id ;
        user_type = 2 ;
    }

    let manKeys = ["post_comment_id"];
    let manValues = {post_comment_id};
    let current_date = new Date();
    let created_on = Math.round(current_date.getTime() / 1000);
    let comment_like_id =md5(current_date);

    let insertData = {user_id, post_comment_id, created_on, comment_like_id} ;
    let condition = {user_id, post_comment_id};

    commFunc.checkKeyExist(manValues, manKeys)
    .then(result => result.length ?responses.parameterMissing(res, result[0]): '')
    .then((result) => {
        PostModel.selectQuery_like2(condition)
        .then((results) => {
            if(results.length == 0) {
                console.log ("insert data");
                PostModel. insertQuery4(insertData)
                .then((postResult) => {
                    let user_id = postResult[0].user_id ;
                    condition = {user_id};
                     UserModel.selectQuery(condition) 
                    .then((userResult) => {
                        console.log (userResult, postResult);
                        responses.success(res, _.merge(postResult[0], userResult[0]));
                    })
                    .catch((error) => responses.sendError(error.message, res));
                }).catch((error) => responses.sendError(error.message, res));
            } else {
                console.log ("delete data");
                PostModel.deleteLikeQuery2(condition)
                .then(results => {responses.success(res,results)})
                .catch((error) => responses.sendError(error.message,res));
            }
        }).catch((error) => responses.sendError(error.message, res));
    }).catch((error) => responses.sendError(error.message, res));
};

exports.sub_comment_like = (req, res) => {
    let  {sub_comment_id} = req.body;
    let user_id;
    let user_type;
    if (req.user) {
        user_id =  req.user.user_id ;
        user_type = 1;
    } else if(req.college) {
        user_id =  req.college.college_id ;
        user_type = 2 ;
    }

    let manKeys = ["sub_comment_id"];
    let manValues = {sub_comment_id};
    let current_date = new Date();
    let created_on = Math.round(current_date.getTime() / 1000);
    let comment_like_id =md5(current_date);

    let insertData = {user_id, sub_comment_id, created_on, comment_like_id} ;
    let condition = {user_id, sub_comment_id};

    commFunc.checkKeyExist(manValues, manKeys)
    .then(result => result.length ?responses.parameterMissing(res, result[0]): '')
    .then((result) => {
        PostModel.selectQuery_like3(condition)
        .then((results) => {
            if(results.length == 0) {
                console.log ("insert data");
                PostModel. insertQuery5(insertData)
                .then((postResult) => {
                    let user_id = postResult[0].user_id ;
                    condition = {user_id};
                     UserModel.selectQuery(condition) 
                    .then((userResult) => {
                        console.log (userResult, postResult);
                        responses.success(res, _.merge(postResult[0], userResult[0]));
                    })
                    .catch((error) => responses.sendError(error.message, res));
                }).catch((error) => responses.sendError(error.message, res));
            } else {
                console.log ("delete data");
                PostModel.deleteLikeQuery3(condition)
                .then(results => {responses.success(res,results)})
                .catch((error) => responses.sendError(error.message,res));
            }
        }).catch((error) => responses.sendError(error.message, res));
    }).catch((error) => responses.sendError(error.message, res));
};

exports.comment_like_list = (req, res) => {
    let {post_comment_id} = req.body; 
    let manKeys = [ "post_comment_id"] ;
    let condition = {post_comment_id};

    commFunc.checkKeyExist (req.body, manKeys)
    .then(result => result.length ? responses.parameterMissing(res, result[0]) : '')
    .then(result => {
        
        PostModel.get_likes_query2(condition)
        .then((likeResult) => { 
            // responses.success(res, likeResult)
            var likeArray = [];

            console.log('Like results', JSON.stringify(likeResult, null, 2));
            console.log(likeResult);

            async.eachSeries(likeResult, get_like_list, (err, results) =>{
                //console.log(' Satgish => Erro => ', err);
                console.log ("1");
                responses.success(res, likeArray);
                likeArray = [];
            });

            function get_like_list(likeResult, callback) {
                console.log ("2");
                async.parallel([
                    //calling count of like
                     function(callback) {
                        console.log ("get_user_result");
                        get_user_result(likeResult.user_id, function(userResults_result){
                            callback(null,userResults_result)
                        });
                    }
                ], function(err, results) {
                    likeResult.get_user_result = results[0] || {};
                    likeArray.push(likeResult);
                    callback();
                });

                function get_user_result(user_id, callback) {
                    console.log("3"); 
                    console.log (user_id);
                    let sql = "SELECT * FROM `tb_user` WHERE `user_id`= ?";
                    connection.query(sql, [user_id], (err, result) => {
                        if(err){ 
                         callback(0) 
                        }else {
                            console.log ("+++++++"+result.length);
                         callback(result[0]);
                        }
                    })
                }
            }
        }).catch((error) => responses.sendError(error.message, res));
    }).catch((error) => responses.sendError(error.message, res));
};

exports.sub_comment_like_list = (req, res) => {
    let {sub_comment_id} = req.body; 
    let manKeys = [ "sub_comment_id"] ;
    let condition = {sub_comment_id};

    commFunc.checkKeyExist (req.body, manKeys)
    .then(result => result.length ? responses.parameterMissing(res, result[0]) : '')
    .then(result => {
        
        PostModel.get_likes_query3(condition)
        .then((likeResult) => { 
            // responses.success(res, likeResult)
            var likeArray = [];
            console.log(likeResult);

            async.eachSeries(likeResult, get_like_list, (err, results) =>{
                //console.log(' Satgish => Erro => ', err);
                console.log ("1");
                responses.success(res, likeArray);
                likeArray = [];
            });

            function get_like_list(likeResult, callback) {
                console.log ("2");
                async.parallel([
                    //calling count of like
                     function(callback) {
                        console.log ("get_user_result");
                        get_user_result(likeResult.user_id, function(userResults_result){
                            callback(null,userResults_result)
                        });
                    }
                ], function(err, results) {
                    likeResult.get_user_result = results[0] || {};
                    likeArray.push(likeResult);
                    callback();
                });

                function get_user_result(user_id, callback) {
                    console.log("3"); 
                    console.log (user_id);
                    let sql = "SELECT * FROM `tb_user` WHERE `user_id`= ?";
                    connection.query(sql, [user_id], (err, result) => {
                        if(err){ 
                         callback(0) 
                        }else {
                            console.log ("+++++++"+result.length);
                         callback(result[0]);
                        }
                    })
                }
            }
        }).catch((error) => responses.sendError(error.message, res));
    }).catch((error) => responses.sendError(error.message, res));
};

exports.get_page_list = (req, res) => {
    let user_id;
    let user_type;
    if (req.user) {
        user_id =  req.user.user_id ;
        user_type = 1;
    } else if(req.college){
        user_id =  req.college.college_id ;
        user_type = 2 ;
   }
   let pageArray = [];
   PostModel.getlistQuery()
   .then((postResult) => {
        pageArray = [];
        async.eachSeries(postResult, get_user_result ,(err, result) => {
            return responses.success(res,pageArray);
            pageArray = [];
        })
    })
    function get_user_result(postResult, callback) {
        async.parallel([
            function(callback) {
                get_user_results( postResult, function(userResults_result){
                    callback(null,userResults_result)
                });
            }
        ], function(err, results) {
            postResult.get_user_results = results[0] || {};
            pageArray.push(postResult);
            callback();
        });
        function get_user_results( postResult, callback) {
            console.log (postResult);
            let college_id = postResult.college_id;
            let sql = " SELECT * FROM `tb_college` WHERE `college_id` = ? ";
            connection.query(sql, [college_id], (err , userResults) => {
                if(err) {
                    callback(0);
                } else {
                    console.log(userResults);
                    callback(userResults[0]);
                }
            })

        }
    }
}
exports.get_user_post = (req, res) => {
    let user_id;
    let postArray = [];
    let user_type;
    if (req.user) {
        user_id =  req.user.user_id ;
        user_type = 1;
    } else if(req.college) {
        user_id =  req.college.college_id ;
        user_type = 2 ;
    }
    let condition = user_id;
    PostModel.selectListQuery2(condition)
    .then((postResult) => {
        postArray = [];
        async.eachSeries(postResult, get_post_list, (result) =>{
            return responses.success(res, postArray);
            postArray = [];
        })
    })
    function get_post_list(postResult, callback) {
        async.parallel([
            function(callback) {
                console.log ("1");
                console.log (postResult);
                get_user_result(postResult.uploaded_by_id, function(userResult_result){
                    callback(null, userResult_result)
                })
            },
            // function(callabck) {
            //     console.log ("2");
            //     get_like_result(postResult.post_id, function(likeResult_result) {
            //         callback(null, likeResult_result)
            //     })
            // },
            function(callback) {
                console.log ("3");
                get_comment_result(postResult.post_id, function(commentResult_result) {
                    callback(null, commentResult_result)
                })
            },
            function(callback) {
                console.log ("4");
                liked_by_me(user_id, postResult.post_id, function(liked_by_me_result){
                    callback(null, liked_by_me_result)
                })
            },
            function(callback) {
                console.log ("5");
                total_like_count(postResult.post_id, function(total_like_count_result) {
                    callback(null, total_like_count_result)
                })
            },
            function(callback) {
                console.log ("6");
                total_comment_count(postResult.post_id, function(total_comment_count_result) {
                    callback(null, total_comment_count_result)
                });
            }
        ], function(err, results) {
            postResult.user_details = results[0];
            // postResult.like_details = results[1];
             postResult.comment_details = results[1];
            //
            postResult.liked_by_me  = results[2];
            postResult.total_like_count = results[3];
            postResult.total_comment_count = results[4];
            postArray.push(postResult);
            console.log (postArray);
            callback();
        });
        function get_user_result(user_id, callback) {
            let sql = "SELECT * FROM `tb_user` WHERE `user_id`=?";
            connection.query(sql, [user_id], function(err, userResult) {
                if (err) {
                    callback(0);
                } else {
                    if (userResult.length > 0 ) {
                        callback(userResult[0]);
                    } else {
                        callback({});
                    }
                }
            });
        }
        // function get_like_result(post_id, callback) {
        //     console.log("post_id" +post_id);
        //     let sql = "SELECT * FROM `tb_post_like` WHERE `post_id`=?";
        //     connection.query(sql, [post_id], (err, result) => {
        //         console.log (err);
        //         console.log (result.length);
        //         if(err) { 
        //             callback(0) 
        //         }else if (result.length == 0) { 
        //             callback([])
        //         } else {
        //             callback(result);
        //         }
        //     })
        // }

        function get_comment_result(post_id, callback) {
            var sql = "SELECT u.user_id, u.email, u.name, u.profile_image,"+
                      " p.* FROM `tb_user` u LEFT JOIN "+
                      "`tb_post_comment` p ON p.user_id = u.user_id WHERE p.post_id=?";
            connection.query(sql, [post_id], (err, result)=> {
                if(err) { 
                    callback(0) 
                } else if(result.length) {
                    callback(result);
                } else {
                    callback({});
                }

            });
        }
       
        function total_like_count(post_id, callback) {
            let sql = "SELECT * FROM `tb_post_like` WHERE `post_id`=?";
            connection.query(sql, [post_id], (err, result) => {
                if( err ) {
                    callback(0)
                } else if(result.length) {
                    callback(result.length);
                } else {
                    callback ( {} );
                }
            });
        }

        function total_comment_count(post_id, callback) {
            let sql = "SELECT * FROM `tb_post_comment` WHERE `post_id`=?";
            connection.query(sql, [post_id], (err, result) => {
                if(err) {
                    callback(0)
                } else if(result.length) { 
                    callback(result.length)
                } else {
                    callback({});
                }
            });
        }
        function liked_by_me (user_id, post_id, callback) {
            let sql = "select * from `tb_post_like` where user_id = ? AND post_id=?";
            connection.query (sql, [user_id, post_id], (err, result) => {
                if (err) {
                    callback (0); 
                } else if(result.length){

                    callback(1);
                } else {
                    callback(2);
                }
            });
        }
    }
}

exports.post_share = (req, res) => { 
	let {post_id, owner_id} = req.body;
	let user_id;
    let user_type;
    if (req.user) {
        user_id =  req.user.user_id ;
        user_type = 1;
    } else if(req.college) {
        user_id =  req.college.college_id ;
        user_type = 2 ;
    }
    console.log(req.body);
    console.log(user_id);
	let manKeys = ["post_id", "owner_id"];
	commFunc.checkKeyExist (req.body, manKeys)
    .then(result => result.length ? responses.parameterMissing(res, result[0]) : '')
    .then(result => {
    	let condition =  {post_id, owner_id};
    	PostModel.selectListQuery3(condition)
    	.then((postResult) => {
            console.log(postResult);
    		if(postResult.length) {
    			let current_date = new Date();
    			let created_at = Math.round(current_date.getTime() / 1000);
    			let data = {post_id, owner_id, user_id, created_at}
    			PostModel.insertQuery6(data)
    			.then((shareResult) => {
                    console.log("1111111111111111111111");
                    console.log(shareResult);
                    console.log("1111111111111111111111");
                    let post_id = shareResult[0].post_id;
                    PostModel.selectQuery({post_id})
                    .then((postResults) => {
                        console.log("22222222222222222222222222222");
                        console.log(postResults);
                        console.log("22222222222222222222222222222");
                        let sql = `SELECT * FROM tb_user LEFT JOIN tb_user_pivot ON ( tb_user.user_id = tb_user_pivot.user_id ) WHERE tb_user_pivot.user_id = ?`;
                        connection.query(sql, [user_id], (err, results) => {
                            console.log("***********************");
                            console.log(err, results);
                            console.log("***********************");
                            if(err) {
                                responses.sendError(error.message, res);
                            } else {
                                let user_id2 = postResults[0].uploaded_by_id;
                                let sql = `SELECT * FROM tb_user LEFT JOIN tb_user_pivot ON ( tb_user.user_id = tb_user_pivot.user_id ) WHERE tb_user_pivot.user_id = ?`;
                                connection.query(sql, [user_id2], (err, result) => {
                                   // console.log(err, result);
                                    if(err) {
                                        responses.sendError(error.message, res);
                                    } else {
                                        // console.log("***********************");
                                        // console.log(result);
                                        // console.log("************************");
                                        let device_token = result &&result.length && result[0].device_token || "";
                                        let device_type = result && result.length && result[0].device_type || "";
                                        let title = `${result[0].user_name} You have a new message.`;
                                        let notify = {    
                                            body: `${results[0].user_name} shared your post.`,
                                            click_action: "FCM_PLUGIN_ACTIVITY",
                                            "color": "#f95b2c",
                                            "sound": true
                                        };
                                        console.log(device_type, device_token, notify, title);

                                        let notification_id = md5(new Date());
                                        let send_by =results && results.length && results[0].user_id || "";
                                        let send_to = result && result.length && result[0].user_id|| "";
                                        let notification_text =  notify.body;
                                        let notification_type = 4;
                                        let current_date = new Date();
                                        let created_at = Math.round(current_date.getTime() / 1000);
                                        let payload = {user_id:results[0].user_id,notify,notification_type};
                                        console.log(payload);
                                        let data = {notification_id, send_by, send_to, notification_text, notification_type, created_at};
                                        console.log(data);
                                        console.log("Notification pe aa gya ab save hoga");
                                        let sql = `INSERT INTO tb_notification SET ?`;
                                        connection.query(sql, [data], (err, result) => {
                                            if(err) {
                                               responses.sendError(err.message, res); 
                                            } else {
                                            PUSH_MESSAGE.push_notification("AIzaSyCN0Kd_tmsbC3f5x2NTi2o5GtoDnFIO7NE", device_token,device_type, payload, notify, function(error, resp) {
                                                console.log({error, resp})
                                            });

                                            let user_id =  postResult[0].user_id ;
                                            let condition = {"user_id" : user_id } ;
                                            UserModel.selectQuery(condition)
                                            .then(results => {
                                                responses.success(res, _.merge(postResult[0],results[0]));                             
                                            })
                                            .catch((error) =>responses.sendError(error.message, res));
                                            }
                                        })
                                    }
                                })
                            }
                        })
                    }).catch((error) => responses.sendError(error.message, res));
        				// responses.success(res, shareResult);
    			}).catch((error) => responses.sendError(error.message, res));
    		} else {
                let response = {
                        response: {},
                        message: "Post not found."
                    };
                    res.status(constant.responseFlags.INVALID_CREDENTIAL).json(response)
            }
    	}).catch((error) => responses.sendError(error.message, res));
    }).catch((error) => responses.sendError(error.message, res));
}







