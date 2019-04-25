const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const Filter = require('bad-words');
const { generarMensaje, generateLocationMessage } = require('./utils/messages');

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

    socket.on('join', ({username, room}) => {
        /* socket.join genera un "cuarto" de conexion, de modo que se emiten especificos eventos
           unicamente para ese "cuarto", de modos que solo lo verán quienes se conecten a éste, y
           esto se hace mediante socket.broadcast.to.emit. */
        socket.join(room);

        socket.emit('message', generarMensaje(`Bienvenido al cuarto ${room} de chat`) );
        socket.broadcast.to(room).emit('message', generarMensaje( `${username} se ha conectado ...`));
    });

    socket.on('mensajeEnviado', (mensaje, callback) =>{
        const filter = new Filter();

        if (filter.isProfane(mensaje)) {
            return callback(generarMensaje('No se permiten palabrotas!'));
        }

        io.emit('message', generarMensaje(mensaje));
        callback();
    });

    socket.on('disconnect', () => {
        io.emit('message', generarMensaje(`A user has left!`));
    });

    socket.on('sendLocation', (coords, callback) => {
        io.emit('locationMessage',
            generateLocationMessage(`https://google.com/maps?q=${coords.latitude},${coords.longitude}`));
        callback(); // hacerle saber al cliente que se ha enviado mensaje
    });

});


server.listen( port, () => { console.log(`Server http arriba arribota en puerto ${port}`) });

