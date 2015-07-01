/**
 * Socket.io configuration
 */

'use strict';

var meetingManager = require('./components/meetingManager');


module.exports = function(socketio) {

  socketio.on('connection', function(socket) {
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

    socket.on('disconnect', function() {
      meetingManager.leaveRoom(userName, currentRoom);
    })
  });
};