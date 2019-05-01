const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const Filter = require('bad-words');
const { generarMensaje, generateLocationMessage } = require('./utils/messages');
const { addUser, removeUser, getUser, getUsersInRoom } = require('./utils/users');

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

   /* socket.on('join', ({username, room}, callback) => {
        const {error, user} = addUser({ id: socket.id, username, room }); */
    socket.on('join', (options, callback) => {
        /* La forma en que se usa options es lo mismo que lo que esta comentado arriba, pero
           con el uso de options me ayuda en caso de que en algun momento se reestructuren
           los argumentos y asi despues enviar los parametros que necesite... */
        const {error, user} = addUser({ id: socket.id, ...options });
        /* cuando se crea un nuevo socket, éste crea su propio id el cual nos lo podemos
         "gorrear" para incrustarlo al id del usuario que entra al chat */

       // console.log ('Error en socket join?');
       // console.log(error);
        if (error) {
            return callback(error);
        }
        /* socket.join genera un "cuarto" de conexion, de modo que se emiten especificos eventos
           unicamente para ese "cuarto", de modos que solo lo verán quienes se conecten a éste, y
           esto se hace mediante socket.broadcast.to.emit. */
        socket.join(user.room);

        socket.emit('message', generarMensaje('Admin', `Bienvenido al chat! Estás en cuarto '${user.room}'`) );
        socket.broadcast.to(user.room).emit('message', generarMensaje('Admin', `${user.username} se ha conectado ...`));

        callback();
    });
 
    socket.on('mensajeEnviado', (mensaje, callback) =>{
        const user = getUser(socket.id);
        const filter = new Filter();

        if (filter.isProfane(mensaje)) {
            return callback(generarMensaje(user.username, 'No se permiten palabrotas!'));
        }

        io.to(user.room).emit('message', generarMensaje(user.username, mensaje));
        callback();
    });

    socket.on('disconnect', () => {
        const userRemoved = removeUser(socket.id);
        if (userRemoved) {
            io.to(userRemoved.room).emit('message', generarMensaje('Admin', `${userRemoved.username} has left!`));
        }
        
    });

    socket.on('sendLocation', (coords, callback) => {
        const user = getUser(socket.id);
        io.to(user.room).emit('locationMessage',
            generateLocationMessage(user.username, 
                    `https://google.com/maps?q=${coords.latitude},${coords.longitude}`));
        callback(); // hacerle saber al cliente que se ha enviado mensaje
    });

});


server.listen( port, () => { console.log(`Server http arriba arribota en puerto ${port}`) });

