const generarMensaje = (texto) => {
    return {
        texto,
        createdAt: new Date().getTime()
    }
}

const generateLocationMessage = (url) => {
    return {
        url,
        createdAt: new Date().getTime()
    }
};

module.exports = { generarMensaje, generateLocationMessage };