/**
 * Socket.io configuration
 */

'use strict';

var rooms = {};



// When the user disconnects.. perform this
function onDisconnect(socket) {
}

// When the user connects.. perform this
function onConnect(socket) {

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