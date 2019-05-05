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
const sideBarTemplate = document.querySelector('#sidebar-template').innerHTML;

// Options
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true });

// server (emit) -> client (receive) --acknowledgement--> server
// client (emit) -> server (receive) --acknowledgement--> client

// funcion para autoposicionar los mensajes de chat al usuario
const autoscroll = () => {
    // Nuevo elemento de mensaje
    const $newMessage = $mensajes.lastElementChild;
    // Altura del nuevo mensaje
    const newMessageStyles = getComputedStyle($newMessage);
    const newMessageMargin = parseInt(newMessageStyles.marginBottom);
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin;
    
    // Altura visible
    const visibleHeight = $mensajes.offsetHeight;

    // Altura de contenedor de mensajes
    const containerHeight = $mensajes.scrollHeight;

    /* Que tan lejos se ha escrolleado?, es decir,
     obtengo la distancia que se ha escrolleado desde la cima */
    const scrollOffset = $mensajes.scrollTop + visibleHeight;

    if (containerHeight - newMessageHeight <= scrollOffset ) {
      /* Ir al fondo del chat para seguir el hilo de conversacion
       solo lo hago cuando mi scroll esta hasta abajo */
        $mensajes.scrollTop = $mensajes.scrollHeight;
    }
};

socket.on('message', mensaje => {
  // console.log(mensaje);
  const html = Mustache.render(messageTemplate, {
    username: mensaje.username,
    mensaje: mensaje.texto,
    createdAt: moment(mensaje.createdAt).format('hh:mm:ss a')
  });
  $mensajes.insertAdjacentHTML('beforeend', html);
  autoscroll();
});

socket.on('locationMessage', mensaje => {
  const html = Mustache.render(locationMessageTemplate, {
    username: mensaje.username,
    url: mensaje.url,
    createdAt: moment(mensaje.createdAt).format('hh:mm:ss a')
  });
  $mensajes.insertAdjacentHTML('beforeend', html);
  autoscroll();
});

socket.on('roomData', ({room, users}) => {
      const html =  Mustache.render(sideBarTemplate, {
        room,
        users
      });
      document.querySelector('#sidebar').innerHTML = html;
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