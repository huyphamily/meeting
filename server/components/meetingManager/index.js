/**
 * Meeting
 */

'use strict';

var _ = require('lodash')

var meetingManager = {};
var rooms = {};

/**
* Join room
* main function that gets called when a user joins a room
*/
meetingManager.joinRoom = function(socket, clientCallBack, userName, roomName) {
  if ( !roomName || !rooms[roomName] ) {
    createRoom(socket, clientCallBack, userName, roomName);
  } else {
    addUserToRoom(socket, clientCallBack, userName, roomName);
  }
};

/** 
* Create Room
* if room does not exist, this will create the room and add the user to it
*/
function createRoom(socket, clientCallBack, userName, roomName) {
  roomName = roomName || Math.floor( Math.random() * 100000000 );
  var currentRoom = rooms[roomName] = {};
  userName = userName || createUsername(roomName);
  currentRoom[userName] = socket;
  clientCallBack(currentRoom, userName);
}

/** 
* Add User To Room
* if room exist, this will add a user to the room
*/
function addUserToRoom(socket, clientCallBack, userName, roomName) {
  var currentRoom = rooms[roomName];
  userName = userName || createUsername(roomName);

  if ( Object.keys(currentRoom).length > 5 ) {
    // send error to client stating room is full
    socket.emit('error:size', Object.keys(currentRoom) );
  } else if ( currentRoom[userName] ) {
    // send error to client stating name is taken
    socket.emit('error:name', Object.keys(currentRoom) );
  } else {
    clientCallBack(currentRoom, userName);
    // tell peers user has connected
    _.each(currentRoom, function(s) {
      s.emit('peer.connected', {user: userName});
    });
    // add user to current room
    currentRoom[userName] = socket;
  }
}

/** 
* Create Username
* if username does not exist, it will create the username
*/
function createUsername(roomName) {
  var currentRoom = rooms[roomName];
  var userName = 'Guest' + Math.floor( Math.random() * 100000 );
  if ( currentRoom[userName] ) {
    return createUsername(roomName);
  }
  return userName;
}


module.exports = meetingManager;