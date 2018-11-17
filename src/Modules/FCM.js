var FCM = require('fcm-node');
//var note = new apn.Notification();
//import config from '../Config/APNS_Development.pem';
module.exports = {
    push_notification: function(serverKey, token = "", device_type, payload, notify, callback) {
        console.log('+++++++++++++++++++++++++++++++++++++++++++++++++')
        console.log({serverKey, token,device_type, payload, notify});
        console.log('+++++++++++++++++++++++++++++++++++++++++++++++++')
        console.log('heeeeeeeeeeee')

            const fcm = new FCM(serverKey);
            var message = {
                to: token,
                collapse_key: 'your_collapse_key',
               
                notification:notify, /*{
    title: "hello",
    body: "message",
    click_action: "FCM_PLUGIN_ACTIVITY",
    "color": "#f95b2c",
    "sound": true
},*/
                data: payload
             };
            fcm.send(message, function(err, response) {
                if (err) {
                    console.log('somthing gone wrong ! ');
                    callback(null, err);
                } else {
                    console.log('somthin');
                    callback(null, response)
                }
            }); 
        }
   
    
};
