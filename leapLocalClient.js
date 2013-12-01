var io = require('socket.io-client');
var socket = io.connect('http://140.112.30.32:8001');
var webSocket = require('ws'),
        ws = new webSocket('ws://127.0.0.1:6437');
var frame;

  //   ws.onopen = function(event) {
  //   var enableMessage = JSON.stringify({enableGestures: true});
  //   ws.send(enableMessage); // Enable gestures
  // };

	ws.on('message', function(data, flags) {
		    console.log(data);
		    frame = data;
		    
	});


	setInterval(function(){socket.emit('fromLocal', frame);},100);
// var socket = require('socket.io-client')('http://140.112.30.32:8001');
socket.on('toRemote', function (data) {
		        // console.log(data);
			    // socket.emit('my other event', { my: 'data' });
			      });