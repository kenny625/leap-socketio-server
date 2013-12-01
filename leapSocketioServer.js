var io = require('socket.io').listen(8001);

io.sockets.on('connection', function (socket) {
  socket.on('fromLocal', function (frame) {
    console.log(frame);
    socket.broadcast.emit('toRemote', frame);
  });
  
});