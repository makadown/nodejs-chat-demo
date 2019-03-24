const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const publicDirectoryPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer( app );
var io = socketIO(server);

app.use(express.static(publicDirectoryPath));

let count = 0;

io.on('connection', (socket) => {
    console.log('New websocket connection!');

    socket.emit('countUpdated', count);
    socket.on('increment', () =>{
        count++;
        /* socket.emit manda a una conexion especifica */
        // socket.emit('countUpdated', count);
        /* io.emit manda a todos los conectados (broadcast) */
        io.emit('countUpdated', count)
    });
});

server.listen( port, () => { console.log(`Server http arriba arribota en puerto ${port}`) });

