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

  socket.on('join', function(data, fn) {
    data = data || {};
    meetingManager.joinRoom(socket, fn, data.user, data.room);
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