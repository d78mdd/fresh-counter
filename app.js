/*
queuing system for the fresh counter

*/


// required packages/modules
var express = require('express');
var app = express();

var http = 	require('http').Server(app);

var io = require('socket.io')(http);

var mysql = require('mysql');









var Count = 1;  //the number of the following user
// what should the default value be ? (before even reading from the DB) 0 , 1 , undefined , 9999 or something else ?



var IP = "192.168.4.1";
//assuming the Raspbian is set up as an access point and has this static IP

//var IP = "localhost";





app.use(express.static(__dirname));
// not very useful


// database connection definition
var connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'boy',
	password : '',
	database : 'users'
});
// assuming the DB is already created
// user too, with sufficient privileges

var time = 0



// connect to the database
connection.connect();



var userinfo;

var dbresults;








connection.query('SELECT * FROM users ORDER BY id DESC LIMIT 1', function(err,rows,fields){

//connection.query("SELECT COUNT(*) AS queueLength FROM users WHERE status = 'waiting'", function(err, result){

//connection.query("SELECT * FROM users WHERE status='waiting' ORDER BY timestamp LIMIT 1", function(err,rows,fields){   // get the "oldest" waiting user



/*
	if (rows[0]==undefined) // no rows with  status='waiting'
	{
		console.log("no rows with  status='waiting'");
		
		connection.query('SELECT * FROM users ORDER BY id DESC LIMIT 1', function(err,rows,fields){
		


			Count = rows[0].id;  // now we have the last saved value from the DB

			//time = sum of all currently served users ??
				// "served"??  i've meant "waiting"?


			Count++;  // number to be used for the upcoming user

			//console.log('upcoming user', Count);

		});



	} else {   // some rows with status 'waiting'
		Count = rows[0].id;
	}
*/

/*
on start , the server/app should not care whether there are any waiting users
	maybe actually do nothing besides the packages and vars declaration

only the route  /nextuser  would care about the waiting users in the DB

on start we only need to prep a variable for an upcoming user
	which in fact can also only be taken care of by a route - '/' - meaning we dig the DB for data about the QR only after the main page is actually accessed
*/
	
	
	
	Count = rows[0].id;
	
	Count++;
	
	




	// definitions of the "routes" for the RPI screen and the user pages
	app.get('/', function(req, res){
		res.sendFile('index.html');
		//res.
	});
	
	
	app.get('/user', function(req, res){
		res.sendFile(__dirname+'/user.html');
	});
	//maybe move this below 	io.on('connection', function(socket){    to depend on it
	// no sense to enable a user to connect if main page (with QR) hasn't loaded






 






	// 
	io.on('connection', function(socket){



		app.get('/nextuser', function(req, res){
			// okay, what would this /nextuser function exactly be for ?
			  // for the "assisstant" behind the Counter to send a signal that the current user had been served  /  to call after those 5 minutes of timeout?


			console.log('goodbye user');
			res.send('next user called');

			// the currently (waiting or) served user should be dismissed (like "served" or "canceled")
				// how do I know which one is currently being served ?
				// the  Count  variable ?
			
			// the "next" one should be selected
				// what does "next" mean here?
				// "selected" how ?
					// with the same query   "SELECT * FROM users WHERE status='waiting' ORDER BY timestamp LIMIT 1"  ?

						// does this mean my colleague was right about using loop ?
						// should i have something like one looping SELECT statement that processes each "oldest"  "waiting" user directly from the DB ?

							// how do you create loops in nodejs/express? - the way you would do in javascript? - how ?
							  // does it make sense to use that ?



			
			connection.query("UPDATE users SET status = 'finished' WHERE status='serving'", function(err,rows,fields){
			// mark the currently served user as finished
			// if there's no one to serve the app simply does nothing (no sql or js or node error/warning, no nothing)

				if (err) throw err;

				//console.log(rows);

				// tell the current user he/she's finished
				//
				
					// but he/she already knows by tracking their own 'queueLglobal' variable

			});			


			//select the next waiting user
			//connection.query("SELECT * FROM users WHERE status='waiting' ORDER BY timestamp LIMIT 1", function(err,rows,fields){   // get the "oldest" waiting user
			connection.query("SELECT id, MIN(timestamp) AS servingUser FROM users WHERE status='waiting';", function(err,result){   // get the "oldest" waiting user's timestamp (we can just as well use ID)
			// we have a bunch of "waiting" users in the DB,
			// and we select the oldest one of them
			
			// and we update his/her status to "serving"

				if (err) throw err;

				//console.log(result[0].id);

				dbresults = result[0].id;



				connection.query("UPDATE users SET status = 'serving' WHERE id="+dbresults, function(err,rows,fields){

					if (err) throw err;

					console.log(dbresults);

					// broadcast? the ID next to serve
					 io.emit('serving user', dbresults);
					console.log(dbresults);
				

				});



			});




		});







		// Listening for Main page messages
		//
		socket.on('request initial data', function(){
			//console.log('main page initialized');

			io.emit('initial data', IP + ':3000/user?id=' + Count);
			// no need to broadcast , just use socket.emit?
		});



		// Listening for User messages
		//
		socket.on('user scan attempted', function(){
		// server has been "poked" by a visiting user ,
		
		// we could accept the user's ID and return some info about queue and time in case it's someone already waiting
		// in cases like a refreshed or revisited page
		
			// could simply check if that ID is already in the DB and get whatever's recorded to send it to the user
			




			socket.emit('user id',Count);
			console.log('queue attempt by ID', Count);


			//socket.on('products entered', function(prd){


			socket.on('user confirmed', function(){

				
				//default 1
				prd = 1;


				console.log("number of products: " + prd);



				// record the user into the database
				connection.query("INSERT INTO users (`products`,`timestamp`,`status`) VALUES (" + prd + ", Now(), 'waiting')"  
				, function(err,rows,fields){
					if (err)
						throw err;
					console.log('  successful insert');
					}
				)



				connection.query("SELECT COUNT(*) AS queueLength FROM users WHERE status = 'waiting'", function(err, result){
					//time = result[0].queueLength * 3;
					
					console.log('count='+result[0].queueLength);
					//console.log('time='+time);
					
					// talk to the user page
					socket.emit('user info', { queueL : result[0].queueLength, queueTime : time} );

				});



			

				time += prd * 3 ; // increase overall waiting time according to the new user's product list
				console.log("time=" + time);







				// talk to main page
				Count++;	// maybe this should go up in the callback - here it would increment even if insert failed
				io.emit('reset code', IP + ':3000/user?id=' + Count);    // this too
				//this broadcasts?
				// could instead be just socket.emit ?



				// log into main console
				//console.log(IP + ':3000/user?id=' + Count + ' will be the link for the next user');	
				//console.log("currently waiting users : " + queue.length());


			//socket.on('products entered', function(prd){
			//	connection.query('UPDATE * FROM users WHERE id=' + --Count, function(err,rows,fields){
			//	}

			//});
			
			// ?? you can't just  --Count  , you have to know exactly which user sent the info
			
				// so just make him/her send ID too - function(prd,ID)
			
			
			});
			
			

		});


		socket.on('unqueue', function(id){
		// server has received unqueue request
		
		// broadcast that back to all users
		io.emit('unqueue', id);
		
		
			connection.query('SELECT * FROM users WHERE id='+id, function(err,rows,fields){


				console.log("id="+id);
				console.log("rows[0]="+rows[0]);

				time -= rows[0].products * 3;

				console.log("rows[0].products="+rows[0].products )

				connection.query('DELETE FROM users WHERE id='+id,function (err, rows, fields){
					console.log("user " + id + " deleted from DB"); 
				});

				console.log("time="+time);

			});



		});



	});




	http.listen(3000, function(){
		//console.log('listening on *:3000');
	});




})

//console.log();  //something apropriate 

//connection.end();   // what if it remains commented?
