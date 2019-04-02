const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const Filter = require('bad-words');

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

    socket.on('mensajeEnviado', (mensaje, callback) =>{
        const filter = new Filter();

        if (filter.isProfane(mensaje)) {
            return callback('No se permiten palabrotas!');
        }

        io.emit('message', mensaje);
        callback();
    });

    socket.on('disconnect', () => {
        io.emit('message', `A user has left!`);
    });

    socket.on('sendLocation', (coords, retorno) => {
        io.emit('locationMessage', `https://google.com/maps?q=${coords.latitude},${coords.longitude}`);
        retorno(); // hacerle saber al cliente que se ha enviado mensaje
    });

});


server.listen( port, () => { console.log(`Server http arriba arribota en puerto ${port}`) });

