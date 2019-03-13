/*
queuing system for the fresh counter


*/


// required packages/modules
var express = require('express');
var app = express();

var http = 	require('http').Server(app);

var io = require('socket.io')(http);

var mysql = require('mysql');

var async = require('async');








var Count = 1;  //the number of the following user
// what should the default value be ? (before even reading from the DB) 0 , 1 , undefined , 9999 or something else ?

//var os = require( 'os' );
//var IP = os.networkInterfaces()['Local Area Connection 3'][1]['address'];
var IP = "localhost";
console.log( "server's local address : " + IP );
//https://stackoverflow.com/questions/3653065/get-local-ip-address-in-node-js
//turns out there's no fully automatic way for this


app.use(express.static(__dirname));


// database connection definition
var connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : 'root',
	database : 'users'
});



//sleep function definition
function sleep() {
	return new Promise(resolve => setTimeout(resolve, 3000));  // 3 seconds for "serving" a user
};

//queue definition
var queue = async.queue(async function (task) {
	console.log('Serving user ' + '' + '.');
	await sleep();    	
	console.log('User ' + '' + ' served.');
	//callback();
}, 1);   // 1 is the "concurency" argument for "queue" - "users" to be served one by one and not at the same time
		// could be increased in a future version to support multiple 'fresh counters' or even multiple shops ( / pay desks ?)

/*
tracking of the queue will only happen while the server is running
should it ?
*/









// connect to the database
connection.connect();
// if there's an error it would be seen from the SELECT below?
/*
maybe if the DB is not created it should create it on its own

*/




//initial selection of the latest user from the database
//if this fails nothing else should happen - everything else needs this to finish
connection.query('SELECT * FROM users ORDER BY id DESC LIMIT 1', function(err,rows,fields){
	if (err)
		throw err


	Count = rows[0].id;  // now we have the last saved value from the DB

	Count++;  // number to be used for the upcoming user

	console.log('upcoming user', Count);



	// definitions of the "routes" for the RPI screen and the user pages
	app.get('/', function(req, res){
		res.sendFile('index.html');
		//res.
	});
	app.get('/user', function(req, res){
		res.sendFile(__dirname+'/user.html');
	});
 


 


	// adding to the queue
	queue.push({name: 'a'}, function (err) {
	    //console.log('I in');
	    
	    //console.log('finished processing user1');
	});
	queue.push({name: 'b'}, function (err) {
	    //console.log('II in');

	   //console.log('finished processing user2');
	});





	// 
	io.on('connection', function(socket){

		//
		socket.on('request initial data', function(){
			console.log('main page initialized');
			//socket.emit('initial data', Count);
			io.emit('initial data', IP + ':3000/user?id=' + Count);
		});




		//
		socket.on('user scans', function(){
		// server has been "poked" by a visiting user ,

			
			// , recording that
			connection.query('INSERT INTO USERS (`number`,`time`) VALUES ("1", Now())'  
			, function(err,rows,fields){
				if (err)
					throw err;
				console.log('successful insert');
				}
			)
			//we issue the recording into the DB as the "Async callback function"
			//while that's taking place , we prepare the next code with the following 2 lines


			//add the user to the queue
			queue.push({name: Count});
		

			//
			Count++;	// maybe this should go up in the callback - here it would increment even if insert failed
			io.emit('reset code', IP + ':3000/user?id=' + Count);    // this too


			console.log(IP + ':3000/user?id=' + Count + ' is the link for the upcoming user');
		});

	});





	http.listen(3000, function(){
		console.log('listening on *:3000');
	});









	}
)








//console.log();  //something apropriate 

//connection.end();   // what if it remains commented?




