const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const {generateMessage} = require('./utils/message');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer( app );
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {
    console.log('New user connected baby!');
    // socket.emit() Emite un evento a una sola conexión.

    // From Admin text welcome to the chat app
    socket.emit('newMessage', 
        generateMessage('Admin', 'Welcome to the chat app'));

    // From Admin to every user joined
    socket.broadcast.emit('newMessage',
        generateMessage('Admin', 'New user joined!'));

    socket.on('createMessage', (message)=>{
        console.log('createMessage', message);
        // io.emit() Emite evento a un chingo de conexiones.
        io.emit('newMessage', 
        generateMessage(message.from, message.text));
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

server.listen( port, () => { console.log(`Server http arriba arribota en puerto ${port}`) });

