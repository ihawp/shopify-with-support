const onMessage = require('./onMessage');
const onChangeRoom = require('./onChangeRoom');
const onDisconnect = require('./onDisconnect');

const generateRandomName = require('../../middleware/generateRandomName.js');
const formatTimestamp = require('../../middleware/formatTimestamp.js');

module.exports = async ({ socket, io, dbQuery, UserDirector }) => {
    const { role, room: room, exp } = socket.user;
    const roomRef = { current: role === 'admin' ? 'admin' : room };
    const timestamp = formatTimestamp(exp);

    socket.join(roomRef.current);
    const userIdentifier = generateRandomName();
    UserDirector.addUser(userIdentifier, { room: roomRef.current, role });

    const getAllUsers = UserDirector.getAllUsers();
    io.to('admin').emit('update-users', getAllUsers);
    io.emit('user-join', getAllUsers.length);

    if (role === 'admin') io.emit('admin-online', true);

    const results = await dbQuery('SELECT * FROM `support-messages` WHERE room = ?', [roomRef.current]);
    if (results) socket.emit('past-messages', { messages: results });

    onDisconnect({ socket, io, UserDirector, role, userIdentifier });
    onMessage({ socket, io, dbQuery, roomRef, role, timestamp });
    onChangeRoom({ socket, io, dbQuery, roomRef, role });
};