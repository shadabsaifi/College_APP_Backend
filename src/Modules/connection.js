// import mysql from 'mysql';
// var db_config = {
// 	host: "localhost",
// 	user: "root",
// 	password: "root",
// 	database: "Ranked",
// 	port : "3306"
// };

// const connection = mysql.createConnection(db_config);

// setInterval(function () {
//     connection.query('SELECT 1');
// }, 15000);

// connection.connect( (err) => { 
// 	if( err ) {
// 		// setInterval(function () {
//   //   		connection.query('SELECT 1');
//   //   		console.log ("1");
// 		// }, 5000);

// 		console.log('error when connecting to db:', err); 
// 	} else { 
// 		console.log("connection variable created "); 
// 	}
// });

// module.exports = connection;

import mysql from 'mysql';

var connection  = mysql.createPool({
		connectionLimit : 10,
		host            : 'localhost',
		user            : 'root',
		password        : 'Nagini@123',
		database        : 'Ranked'
});

connection.getConnection(function(err, connection) {
	if (err) {
		 if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.error('Database connection was closed.')
        }
        if (err.code === 'ER_CON_COUNT_ERROR') {
            console.error('Database has too many connections.')
        }
        if (err.code === 'ECONNREFUSED') {
            console.error('Database connection was refused.')
        }
	}
	    if(connection)connection.release();

	    return
});
module.exports = connection;







// var db_config = {
//   host: 'localhost',
//     user: 'root',
//     password: 'root',
//     database: 'Ranked',
//     port : "3306"
// };

// var connection;

// function handleDisconnect() {
//   connection = mysql.createConnection(db_config); // Recreate the connection, since
//                                                   // the old one cannot be reused.

//   connection.connect(function(err) {              // The server is either down
//     if(err) {                                     // or restarting (takes a while sometimes).
//       console.log('error when connecting to db:', err);
//       setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
//     }                                     // to avoid a hot loop, and to allow our node script to
//   });                                     // process asynchronous requests in the meantime.
//                                           // If you're also serving http, display a 503 error.
//   connection.on('error', function(err) {
//     console.log('db error', err);
//     if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
//       handleDisconnect();                         // lost due to either server restart, or a
//     } else {                                      // connnection idle timeout (the wait_timeout
//       throw err;                                  // server variable configures this)
//     }
//   });
// }
// handleDisconnect();
// module.exports = connection;