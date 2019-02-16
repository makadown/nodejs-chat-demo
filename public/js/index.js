var socket = io();

socket.on('connect', function() {
  console.log('Connected to server');

  
  socket.emit('createEmail', {
      to: 'nora@example.com',
      text: 'Hey, soy mayito!'
  });
});

socket.on('disconnect', function() {
  console.log('Disconnected from server');
});

socket.on('newEmail', function (email) {
    console.log('Sending new email: ', email);
});