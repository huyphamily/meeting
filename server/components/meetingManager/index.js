/**
 * Meeting
 */

'use strict';

var _ = require('lodash')

var meetingManager = {};
var rooms = {};

/**
* Join room
*/
meetingManager.joinRoom = function(socket, clientCallBack, userName, roomName) {
  if ( !roomName || !rooms[roomName] ) {
    roomName = createRoom(socket, userName, roomName);
  }

  var currentRoom = rooms[roomName];

  if ( Object.keys(currentRoom).length > 5 ) {
    // send error to client stating room is full
    socket.emit('error:size', Object.keys(currentRoom) )
  } else if ( currentRoom[userName] ) {
    // send error to client stating name is taken
    socket.emit('error:name', Object.keys(currentRoom) )
  } else {
    clientCallBack(currentRoom, userName);
    // tell peers user has connected
    _.each(currentRoom, function(s) {
      s.emit('peer.connected', {user: userName});
    });
    // add user to current room
    currentRoom[userName] = socket;
  }
};

/** 
* Create room
*/
function createRoom(socket, userName, roomName) {
  roomName = roomName || Math.floor( Math.random() * 100000000 );
  var currentRoom = rooms[roomName] = {};
  currentRoom[userName] = socket;
  return roomName;
}


module.exports = meetingManager;