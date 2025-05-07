const onMessage = require('./onMessage');
const onChangeRoom = require('./onChangeRoom');
const onDisconnect = require('./onDisconnect');

const formatTimestamp = require('../../middleware/formatTimestamp.js');
const rateLimitAllEvents = require('../../middleware/rateLimitAllEvents.js');

module.exports = async ({ socket, io, dbQuery, UserDirector, AdminDirector }) => {
    const { role, room, exp, name } = socket.user;
    const timestamp = formatTimestamp(exp);
    const roomRef = { current: role === 'admin' ? 'admin' : room };

    socket.join(roomRef.current);

    if (role === 'guest') {
        const [unreadData] = await dbQuery(`
            SELECT room, COUNT(*) AS unread 
            FROM \`support-messages\` 
            WHERE \`is_read\` = 0 AND \`room\` = ? AND user != "admin"
        `, [roomRef.current]);

        if (!unreadData) {
            return socket.emit('error', { type: 'db-error', message: 'Error retrieving unread messages.' });
        }

        const { unread } = unreadData;
        UserDirector.addUser(name, { room: roomRef.current, role, unread });
    }

    if (role === 'admin') {
        AdminDirector.addUser(name, { room: roomRef.current, role });

        const unreadMessages = await dbQuery(`
            SELECT room, COUNT(*) AS unread 
            FROM \`support-messages\` 
            WHERE \`is_read\` = 0 AND user != "admin" 
            GROUP BY room
        `);

        if (!unreadMessages) {
            return socket.emit('error', { type: 'db-error', message: 'Error retrieving unread messages.' });
        }

        const updatedUsers = UserDirector.getAllUsers().map(([socketId, user]) => {
            const match = unreadMessages.find(msg => msg.room === user.room);
            return [socketId, { ...user, unread: match?.unread || 0 }];
        });

        io.to('admin').emit('update-users', updatedUsers);
    }

    // Emit updated user list to all clients
    const allUsers = UserDirector.getAllUsers();
    io.to('admin').emit('update-users', allUsers);
    io.emit('user-join', allUsers.length);

    // Emit admin online status
    io.emit('admin-online', { message: AdminDirector.adminOnline() });

    // Send past messages to the newly joined user
    const pastMessages = await dbQuery('SELECT * FROM `support-messages` WHERE room = ?', [roomRef.current]);
    if (pastMessages) {
        socket.emit('past-messages', { messages: pastMessages });
    }

    if (role !== 'admin') {
        rateLimitAllEvents(socket);
    }

    onDisconnect({ socket, io, UserDirector, AdminDirector, role, name });
    onMessage({ socket, io, dbQuery, roomRef, role, timestamp, AdminDirector });
    onChangeRoom({ socket, io, dbQuery, roomRef, role, AdminDirector, name });
};
