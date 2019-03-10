var express = require('express');
var app = express();

var http = require('http').Server(app);

var io = require('socket.io')(http);







var os = require( 'os' );
//var IP = os.networkInterfaces()['Local Area Connection 3'][1]['address'];
var IP = "localhost";
console.log( "server's local address : " + IP );
//https://stackoverflow.com/questions/3653065/get-local-ip-address-in-node-js
//turns out there's no fully automatic way for this




app.use(express.static(__dirname));

var Count = 1;  //the number of the following user




app.get('/', function(req, res){
  res.sendFile('index.html');
});
app.get('/user', function(req, res){
  res.sendFile(__dirname+'/user.html');
});




io.on('connection', function(socket){

	socket.on('user scans', function(){
		io.emit('reset code', IP + ':3000/user?id=' + Count);
		console.log(IP + ':3000/user?id=' + Count + ' is the link for the upcoming user');
		
		Count++;
		
	});

});










http.listen(3000, function(){
  console.log('listening on *:3000');
});
