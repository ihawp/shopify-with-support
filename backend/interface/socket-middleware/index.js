const onMessage = require('./onMessage');
const onChangeRoom = require('./onChangeRoom');
const onDisconnect = require('./onDisconnect');

const formatTimestamp = require('../../middleware/formatTimestamp.js');
const rateLimitAllEvents = require('../../middleware/rateLimitAllEvents.js');

module.exports = async ({ socket, io, dbQuery, UserDirector }) => {
    const { role, room, exp, name } = socket.user;
    const roomRef = { current: role === 'admin' ? 'admin' : room };
    const timestamp = formatTimestamp(exp);

    socket.join(roomRef.current);

    UserDirector.addUser(name, { room: roomRef.current, role });

    const getAllUsers = UserDirector.getAllUsers();
    io.to('admin').emit('update-users', getAllUsers);
    io.emit('user-join', getAllUsers.length);

    const adminOnline = UserDirector.adminOnline();
    io.emit('admin-online', { message: adminOnline });

    if (role === 'admin') {
        const unreadMessages = await dbQuery('SELECT * FROM `support-messages` WHERE `delete-after` < NOW() AND `is_read` = 0');
        if (!unreadMessages) return socket.emit('error', { type: 'db-error', message: 'Error retrieving unread messages from database.' })
        io.to('admin').emit('update-unread-counts', unreadMessages);
    }

    const results = await dbQuery('SELECT * FROM `support-messages` WHERE room = ?', [roomRef.current]);
    if (results) socket.emit('past-messages', { messages: results });

    if (role !== 'admin') rateLimitAllEvents(socket);
    onDisconnect({ socket, io, UserDirector, role, name });
    onMessage({ socket, io, dbQuery, roomRef, role, timestamp });
    onChangeRoom({ socket, io, dbQuery, roomRef, role });
};