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

/* socket.emit manda a una conexion especifica */
// socket.emit('countUpdated', count);
/* io.emit manda a todos los conectados (broadcast) 
   socket.broadcast.emit envia a todos los conectados excepto al cliente que generó dicho broadcast */

io.on('connection', (socket) => {
    // console.log('New websocket connection!');

    socket.emit('message', 'Bienvenido a la app de chat!');
    socket.broadcast.emit('message', 'Un nuevo usuario se ha conectado...');

    socket.on('mensajeCliente', (mensaje) =>{
        // console.log('Mensaje recibido: ' + mensaje);
        io.emit('message', mensaje);
    });

    socket.on('disconnect', () => {
        io.emit('message', 'Un usuario se ha ido...');
    });

});

server.listen( port, () => { console.log(`Server http arriba arribota en puerto ${port}`) });

