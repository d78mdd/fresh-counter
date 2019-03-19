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


//var IP = "192.168.178.60";
var IP = "localhost";


//var IP = "localhost";
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

var time = 0



//sleep function definition
function sleep() {
	return new Promise(resolve => setTimeout(resolve, 20000));  // 20 seconds for "serving" a user
};

//queue definition
var queue = async.queue( async function (task,callback) {    // without "async" the "await sleep()" has no visible effect
	
	time-=task;
	
	console.log('Serving user');
	await sleep();
	callback();
}, 1);   // 1 is the "concurency" argument for "queue" - "users" to be served one by one and not at the same time
		// could be increased in a future version to support multiple 'fresh counters' or even multiple shops ( / pay desks ?)

/*
tracking of the queue will only happen while the server is running
should it ?
*/





queue.drain = function() {
    console.log('All currently waiting users have been served. Counter is currently idle. Awaiting users...');
};

//
//// adding dummy users to the queue
//++inqueue;
//queue.push({name: 'a'}, function (err) {
//    //console.log('I in');
//    
//    //console.log('finished processing user1');
//});
//++inqueue;
//queue.push({name: 'b'}, function (err) {
//    //console.log('II in');
//    
//   //console.log('finished processing user2');
//});
//
//








// connect to the database
connection.connect();
// if there's an error it would be seen from the SELECT below?
/*
maybe if the DB is not created it should create it on its own

*/






//dummy users

time += 3 ;
console.log("time=" + time);
queue.push(3   // queue.length() - "a function returning the number of items waiting to be processed."   // but i seem to break it somehow
, function (err) {
			
	console.log('User a served. ' + queue.length() + ' remain');
	//time-=queue.uTime;
	


	//console.log(err);
	//console.log(data);
	//console.log(data1);  // output TypeError: callback is not a function
	//console.log(data2);  // undefined
	//console.log(data.name);
	//console.log(data.uTime);
	


	console.log("should take " + time + " minutes");

	//console.log(queue.workersList()); // output: []
	//console.log(queue.running()); // output: 0

	}
)

time += 3 ;
console.log("time=" + time);
queue.push(3   // queue.length() - "a function returning the number of items waiting to be processed."   // but i seem to break it somehow
, function (err) {
	
	//console.log('Serving user b');
	console.log('User b served. ' + queue.length() + ' remain');
	//time-=queue[0].uTime;
	console.log("should take " + time + " minutes");
	}
)

time += 3 ;
console.log("time=" + time);
queue.push(3   // queue.length() - "a function returning the number of items waiting to be processed."   // but i seem to break it somehow
,  function (err) {
	
	//console.log('Serving user c');
	console.log('User c served. ' + queue.length() + ' remain');
	//time-=queue[0].uTime;
	console.log("should take " + time + " minutes");
	}
)

time += 3 ;
console.log("time=" + time);
queue.push(3   // queue.length() - "a function returning the number of items waiting to be processed."   // but i seem to break it somehow
, function (err) {
	
	//console.log('Serving user d');
	console.log('User d served. ' + queue.length() + ' remain');
	//time-=queue[0].uTime;
	console.log("should take " + time + " minutes");
	}
)

time += 3 ;
console.log("time=" + time);
queue.push(3   // queue.length() - "a function returning the number of items waiting to be processed."   // but i seem to break it somehow
, function (err) {
	
	//console.log('Serving user e');
	console.log('User e served. ' + queue.length() + ' remain');
	//time-=queue[0].uTime;
	console.log("should take " + time + " minutes");
	}
)









var userinfo;



//initial selection of the latest user from the database
//if this fails nothing else should happen - everything else needs this to finish
connection.query('SELECT * FROM users ORDER BY id DESC LIMIT 1', function(err,rows,fields){
	if (err)
		throw err


	Count = rows[0].id;  // now we have the last saved value from the DB

	//time = sum of all currently served users ??


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
 






	// 
	io.on('connection', function(socket){

		//
		socket.on('request initial data', function(){
			console.log('main page initialized');
			//socket.emit('initial data', Count);
			io.emit('initial data', IP + ':3000/user?id=' + Count);
		});




		//
		socket.on('user scan attempted', function(){
		// server has been "poked" by a visiting user ,

			
			socket.emit('user id',Count);
			console.log('ID from socket', Count);



			socket.on('products entered', function(prd){

				console.log("number of products: " + prd);



				// record the user into the database
				connection.query('INSERT INTO USERS (`products`,`time`) VALUES ('+prd+', Now())'  
				, function(err,rows,fields){
					if (err)
						throw err;
					console.log('  successful insert');
					}
				)


				// talk to the user page
				socket.emit('user info', { queueL : queue.length(), queueTime : time} );


				time += prd * 3 ; // increase overall waiting time according to the new user's product list
				console.log("time=" + time);


				// push the user to the queue
				queue.push( prd*3
				,  function (err) {
					console.log('  user served, ' + queue.length() + ' remain.');
					
					console.log("should take " + time + " minutes");
					}
				)





				// talk to main page
				Count++;	// maybe this should go up in the callback - here it would increment even if insert failed
				io.emit('reset code', IP + ':3000/user?id=' + Count);    // this too



				// log into main console
				console.log(IP + ':3000/user?id=' + Count + ' will be the link for the next user');
				console.log("currently waiting users : " + queue.length());

			});



		});

	});





	http.listen(3000, function(){
		console.log('listening on *:3000');
	});









	}
)








//console.log();  //something apropriate 

//connection.end();   // what if it remains commented?




