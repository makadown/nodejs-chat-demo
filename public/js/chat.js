var socket = io();

const $botonLocation = document.querySelector('#send-location');
const $botonEnviar = document.querySelector('#enviar');
const $txtMensaje = document.querySelector('#mensaje');
const $mensajes = document.querySelector('#messages');

// Templates
const messageTemplate = document.querySelector('#message-template').innerHTML;
const locationMessageTemplate = document.querySelector('#location-message-template').innerHTML;

// server (emit) -> client (receive) --acknowledgement--> server

// client (emit) -> server (receive) --acknowledgement--> client

socket.on('message', mensaje => {
  // console.log(mensaje);
  const html = Mustache.render(messageTemplate, {
         mensaje: mensaje.texto,
         createdAt: moment(mensaje.createdAt).format('hh:mm:ss a')
  });
  $mensajes.insertAdjacentHTML('beforeend', html);
});

socket.on('locationMessage', url => {
  const html = Mustache.render(locationMessageTemplate, {
    url
});
$mensajes.insertAdjacentHTML('beforeend', html);
});

$botonEnviar.addEventListener('click', e => {
  // deshabilitar boton mientras se genera evento
  $botonEnviar.setAttribute('disabled', null);

  const mensaje = $txtMensaje.value;
  socket.emit('mensajeEnviado', mensaje, error => {
    // habilitar boton despues de evento
    // $botonEnviar.removeAttribute('disabled');
    $txtMensaje.value = '';
    $txtMensaje.focus();
    if (error) {
      return console.log(error);
    }
    // console.log('Mensaje entregado!');
  });
});

$txtMensaje.addEventListener('keyup', function() {
  var nameInput = $txtMensaje.value;
  if (nameInput != '') {
    $botonEnviar.removeAttribute('disabled');
  } else {
    $botonEnviar.setAttribute('disabled', null);
  }
});

$botonLocation.addEventListener('click', () => {  
  if (!navigator.geolocation) {
    return alert('Geolocación no es soportada por el navegador.');
  }
  $botonLocation.setAttribute('disabled', null);
  navigator.geolocation.getCurrentPosition(position => {
    $botonLocation.removeAttribute('disabled');
    socket.emit('sendLocation', {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            }, () => {
            console.log('Locación compartida!');
    });
  });
});
