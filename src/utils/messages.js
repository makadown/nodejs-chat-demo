const generarMensaje = (texto) => {
    return {
        texto,
        createdAt: new Date().getTime()
    }
}

module.exports = { generarMensaje };