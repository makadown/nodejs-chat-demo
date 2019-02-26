const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

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
    socket.emit('newMessage', {
        from: 'Admin',
        text: 'Welcome to the chat app',
        createdAt: new Date().getTime()
    });

    // From Admin to every user joined
    socket.broadcast.emit('newMessage', {
        from: 'Admin',
        text: 'New User Joined',
        createdAt: new Date().getTime()
    });

    socket.on('createMessage', (message)=>{
        console.log('createMessage', message);
        // io.emit() Emite evento a un chingo de conexiones.
        io.emit('newMessage', {
             from: message.from,
             text: message.text,
             createdAt: new Date().getTime()
        });
        /*
        socket.broadcast.emit('newMessage', {
                 from: message.from,
                 text: message.text,
                 createdAt: new Date().getTime()
        });
        */
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

server.listen( port, () => { console.log(`Server http arriba arribota en puerto ${port}`) });

