var express = require('express');
var app = express();

var http = require('http').Server(app);

var io = require('socket.io')(http);





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
		io.emit('reset code', Count);
		console.log(Count);
		
		Count++;
		
	});

});










http.listen(3000, function(){
  console.log('listening on *:3000');
});
