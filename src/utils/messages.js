const generarMensaje = (username, texto) => {
    return {
        username,
        texto,
        createdAt: new Date().getTime()
    }
}

const generateLocationMessage = (username, url) => {
    return {
        username,
        url,
        createdAt: new Date().getTime()
    }
};

module.exports = { generarMensaje, generateLocationMessage };