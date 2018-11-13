var app = require('express')();
var http = require('http').Server(app);

var io = require('socket.io')(http);

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

// io.on('connection', function(socket){
//   console.log('a user connected');

//   socket.on('custom-event', function(value){
//     io.emit('custom-event', value);
//   });

//   socket.on('disconnect', function(){
//     console.log('user disconnected');
//   });
// });

const connectedUsers = [];

var onConnect = socket => {
  console.log('connected');
  // On login, store the userId on socket object
  socket.on('user_logged', userId => {
    connectedUsers.push({ userId: userId, socketId: socket.id });
  });
  socket.on('remove_users_from_group', function(data) {
    if (data && data.removedUsers) {
      connectedUsers.forEach(user => {
        if (data.removedUsers.includes(user.userId)) {
          io.to(`${user.socketId}`).emit('removed_from_group', data.group);
        }
      });
    }
  });
  socket.on('add_users_from_group', function(data) {
    if (data && data.addedUsers) {
      connectedUsers.forEach(user => {
        if (data.addedUsers.includes(user.userId)) {
          io.to(`${user.socketId}`).emit('added_to_group', data.group);
        }
      });
    }
  });
};
io.on('connect', onConnect);

http.listen(1234, function() {
  console.log('listening on *:1234');
});
