/**
 * Socket.io configuration
 */

'use strict';

var meetingManager = require('./components/meetingManager');

// When the user disconnects.. perform this
function onDisconnect(socket) {

}

// When the user connects.. perform this
function onConnect(socket) {
  var currentRoom, userName;

  socket.on('join', function(data, fn) {
    data = data || {};
    meetingManager.joinRoom(socket, fn, data.user, data.room, function(name, room) {
      userName = name;
      currentRoom = room;
    });
  });

  socket.on('msg', function(data) {
    meetingManager.handleMsg(socket, data, userName, currentRoom);
  });
}

module.exports = function(socketio) {

  socketio.on('connection', function(socket) {

    // Call onDisconnect.
    socket.on('disconnect', function() {
      onDisconnect(socket);
      console.info('[%s] DISCONNECTED', socket);
    });

    // Call onConnect.
    onConnect(socket);
    console.info('[%s] CONNECTED', socket);
  });
};