var socket = io();

socket.on('message', (mensaje) => {
  console.log(mensaje);
});

document.querySelector('#message-form').addEventListener('submit', (e) =>{
  // console.log('mensaje enviado!');
  e.preventDefault(); // para evitar que se haga un refresh.
  const mensaje = e.target.elements.mensaje.value;  
  // [e.target.elements.mensaje.value] es lo mismo que [document.querySelector('#mensaje').value]
  socket.emit('mensajeCliente', mensaje); 
});

document.querySelector('#mensaje').addEventListener('keyup', function() {
  var nameInput = document.querySelector('#mensaje').value;
  if (nameInput != '') {
      document.querySelector('#enviar').removeAttribute('disabled');
  } else {
      document.querySelector('#enviar').setAttribute('disabled', null);
  }
});
