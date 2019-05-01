var socket = io();

const $botonLocation = document.querySelector('#send-location');
const $botonEnviar = document.querySelector('#enviar');
const $txtMensaje = document.querySelector('#mensaje');
const $mensajes = document.querySelector('#messages');

/* // Pendiente
$txtMensaje.addEventListener("keyup", (event) => {
  if (event.keyCode == '13' && $txtMensaje.value.length > 1) {
    enviarTexto($txtMensaje.value);
  }
}
);*/

// Templates
const messageTemplate = document.querySelector('#message-template').innerHTML;
const locationMessageTemplate = document.querySelector('#location-message-template').innerHTML;

// Options
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true });

// server (emit) -> client (receive) --acknowledgement--> server
// client (emit) -> server (receive) --acknowledgement--> client

socket.on('message', mensaje => {
  // console.log(mensaje);
  const html = Mustache.render(messageTemplate, {
    username: mensaje.username,
    mensaje: mensaje.texto,
    createdAt: moment(mensaje.createdAt).format('hh:mm:ss a')
  });
  $mensajes.insertAdjacentHTML('beforeend', html);
});

socket.on('locationMessage', mensaje => {
  const html = Mustache.render(locationMessageTemplate, {
    username: mensaje.username,
    url: mensaje.url,
    createdAt: moment(mensaje.createdAt).format('hh:mm:ss a')
  });
  $mensajes.insertAdjacentHTML('beforeend', html);
});

$botonEnviar.addEventListener('click', enviarTexto);

function enviarTexto(e) {
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
}

$txtMensaje.addEventListener('keyup', function () {
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
     // console.log('Locación compartida!');
    });
  });
});

socket.emit('join', { username, room }, (error) => {
 // console.log('Error en chat.js?');
 // console.log(error);
  if (error) {
    alert(error);
    location.href = '/';
  }
});