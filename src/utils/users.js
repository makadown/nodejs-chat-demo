const users = [];

// addUser, removeUser, getUser, getUsersInRoom

const addUser = ( ({id, username, room}) => {
    // console.log('Limpianda data');
    // Clean the data.
    username = username.trim().toLowerCase();
    room = room.trim().toLowerCase();

    // console.log('Validando data');
    // console.log('username: ');
    // console.log(username);
    // console.log('room: ');
    // console.log(room);
    // Validate the data
    if (!username || !room) {
        return {
            error: 'username and room required'
        }
    }

    // console.log('Buscando usuario existente: ');
    // Check for existing user
    const existingUser = users.find( (user) => {
        return user.room === room && user.username === username;
    });

    // console.log('Existing user? ' + existingUser?existingUser:'Nel, no existe');
    // Validate username
    if (existingUser) {
        return {
            error: 'Username is in use!'
        };
    }

    // Store user
    const user = { id, username, room};
    users.push(user);
    // console.log('usuarios Creados ahora: ');
    // console.log(user);

    return {user};
});

const removeUser = ( (id) => {
    const index = users.findIndex((user) => user.id === id );

    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
});

const getUser = (id) => {
    return users.find((user) => user.id === id);
};

const getUsersInRoom = (room) => {
    room = room.trim().toLowerCase();
    return users.filter( (user) => user.room === room );
};

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
};