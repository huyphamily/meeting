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
* socketCallback is used to set userName and roomName for the socket
*/
meetingManager.joinRoom = function(socket, clientCallback, userName, roomName, socketCallback) {
  if ( !roomName || !rooms[roomName] ) {
    createRoom(socket, clientCallback, userName, roomName, socketCallback);
  } else {
    addUserToRoom(socket, clientCallback, userName, roomName, socketCallback);
  }
};

/** 
* Create Room
* if room does not exist, this will create the room and add the user to it
*/
function createRoom(socket, clientCallback, userName, roomName, socketCallback) {
  roomName = roomName || Math.floor( Math.random() * 100000000 );
  var currentRoom = rooms[roomName] = {};
  userName = userName || createUsername(roomName);
  currentRoom[userName] = socket;
  clientCallback(userName, currentRoom);
  socketCallback(userName, currentRoom);
}

/** 
* Add User To Room
* if room exist, this will add a user to the room
*/
function addUserToRoom(socket, clientCallback, userName, roomName, socketCallback) {
  var currentRoom = rooms[roomName];
  userName = userName || createUsername(roomName);

  if ( Object.keys(currentRoom).length > 5 ) {
    // send error to client stating room is full
    socket.emit('error:size', Object.keys(currentRoom) );
  } else if ( currentRoom[userName] ) {
    // send error to client stating name is taken
    socket.emit('error:name', Object.keys(currentRoom) );
  } else {
    clientCallback(userName, currentRoom);
    // tell peers user has connected
    _.each(currentRoom, function(s) {
      s.emit('peer.connected', {user: userName});
    });
    // add user to current room
    currentRoom[userName] = socket;
    socketCallback(userName, currentRoom)
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


/** 
* Handle Msg
* handle msg event such as SDP message and ICE candidate
*/
meetingManager.handleMsg = function(socket, data, userName, roomName) {
  var to = data.to;
  var currentRoom = rooms[roomName];
  if ( currentRoom && currentRoom[to] ) {
    rooms[currentRoom][to].emit('msg', data);
  } else {
    socket.emit('error:msg');
  }
};

/**
* Leave Room
* remove a user from a room and tell all peers of user disconnect
*/
meetingManager.leaveRoom = function(userName, roomName) {
  var currentRoom = rooms[roomName];
  if ( !roomName || !currentRoom ) {
    return;
  }
  delete currentRoom[userName];
  _.each(currentRoom, function(s) {
    s.emit('peer.disconnected', {user: userName});
  });
};

module.exports = meetingManager;