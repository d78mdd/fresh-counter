var express = require('express');
var app = express();

var http = 	require('http').Server(app);

var io = require('socket.io')(http);

var mysql = require('mysql');








var Count = 1;  //the number of the following user
// what should the default value be ? (before even reading from the DB) 0 , 1 , undefined , 9999 or something else ?

//var os = require( 'os' );
//var IP = os.networkInterfaces()['Local Area Connection 3'][1]['address'];
var IP = "localhost";
console.log( "server's local address : " + IP );
//https://stackoverflow.com/questions/3653065/get-local-ip-address-in-node-js
//turns out there's no fully automatic way for this


app.use(express.static(__dirname));


var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'root',
  database : 'users'
});

var someVar = [];








/*
maybe here the query should read the user with the last ID

maybe if the DB is not created it should create it on its own
*/

connection.connect();



connection.query('SELECT * FROM users ORDER BY id DESC LIMIT 1', function(err,rows,fields){
	if (err)
		throw err


	console.log('The solution is: ', rows[0].id);
	

	Count = rows[0].id;

	console.log('and Count comes to be : ', Count);



	app.get('/', function(req, res){
		res.sendFile('index.html');
	});
	app.get('/user', function(req, res){
		res.sendFile(__dirname+'/user.html');
	});





	io.on('connection', function(socket){

		socket.on('user scans', function(){

			io.emit('reset code', IP + ':3000/user?id=' + Count);
		
			Count++;

			console.log(IP + ':3000/user?id=' + Count + ' is the link for the upcoming user');
		});

	});





	http.listen(3000, function(){
	console.log('listening on *:3000');
	});









	}
)













//console.log();  //something apropriate 

connection.end();
















//connection.query('INSERT INTO USERS (`number`,`time`) VALUES ("1", current_timestamp)'  // Date.now
//, function(err,rows,fields){
//	if (err)
//		throw err
//	console.log('The solution is: ', rows[0]);
//	}
//)
















