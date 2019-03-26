var socket = io();

// server (emit) -> client (receive) --acknowledgement--> server

// client (emit) -> server (receive) --acknowledgement--> client

socket.on('message', mensaje => {
  console.log(mensaje);
});

document.querySelector('#enviar').addEventListener('click', e => {
  const mensaje = document.querySelector('#mensaje').value;
  socket.emit('mensajeEnviado', mensaje, error => {
    if (error) {
      return console.log(error);
    }
    console.log('Mensaje entregado!');
  });
});

document.querySelector('#mensaje').addEventListener('keyup', function() {
  var nameInput = document.querySelector('#mensaje').value;
  if (nameInput != '') {
    document.querySelector('#enviar').removeAttribute('disabled');
  } else {
    document.querySelector('#enviar').setAttribute('disabled', null);
  }
});

document.querySelector('#send-location').addEventListener('click', () => {
  if (!navigator.geolocation) {
    return alert('Geolocación no es soportada por el navegador.');
  }
  navigator.geolocation.getCurrentPosition(position => {
    socket.emit('sendLocation', {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            }, () => {
            console.log('Locación compartida!');
    });
  });
});
