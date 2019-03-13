<!doctype html>
<html>
<head>
	<title>Welcome</title>
		
	<style>

		h2 {
			font-family: "Times New Roman", Times, serif;
			font-size: 40px;
			color:blue;
			text-align: center;
		}

		p {
			font-family: "Times New Roman", Times, serif;
			font-size: 20px;
			text-align: center;
		}
		
	</style>

</head>


<body>		
	<script src="/socket.io/socket.io.js"></script>
	<script src="https://code.jquery.com/jquery-1.11.1.js"></script>
	<script src="/qrcode.js"></script>
	

	<h2> Welcome to the Store </h2>	
	<p> please scan QRcode below for queue </p>
	<br/>
	<br/>
	

	<script>	
	$(function () {
	
		//
		var socket = io();
		

		// send an initial signal to get the IP settings for the first code
		//socket.emit('user scans');
		//no , this is not supposed to happen
		socket.emit('request initial data');
		socket.on('initial data', function(data){

			var $nd = $( "<div id='qrcode' ></div>" );
			$( "body" ).append( $nd );

			qrcode = new QRCode(document.getElementById("qrcode"), data+'');    // QRCode does not work with a pure number as a 2nd argument

			document.getElementById("qrcode").style.margin="0 auto";
			document.getElementById("qrcode").style.width="256px";

			console.log("making initial code with '" + data + "'");
		});
		

		//
		socket.on('reset code', function(link){
						
			//wait a few seconds / delay the showing of the new code
			setTimeout(function(){      //https://stackoverflow.com/questions/1836105/how-to-wait-5-seconds-with-jquery			
				
				// dynamically re-create the div element
				var $newdiv1 = $( "<div id='qrcode' ></div>" );
				$( "body" ).append( $newdiv1 );
				
				
				// generate a code
				qrcode = new QRCode(document.getElementById("qrcode"), link);

				// set/adjust/put in the middle of the screen/view area  assuming a 256px image size
				//  center horizontally
				document.getElementById("qrcode").style.margin="0 auto";
				document.getElementById("qrcode").style.width="256px";
				//  how about vertically ?
				// https://www.w3schools.com/css/css_dimension.asp
				// https://medium.freecodecamp.org/how-to-center-things-with-style-in-css-dc87b7542689   among others

				console.log("making code with '" + link + "'");
				
			},100);  // 2 seconds time before showing the new QR
			
			$("#qrcode").detach();		// clear/hide/remove the current code - its div tag

		});
		
		
	});
	</script>
	
	
	
	
</body>
</html>





