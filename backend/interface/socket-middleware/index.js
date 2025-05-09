const onMessage = require('./onMessage');
const onChangeRoom = require('./onChangeRoom');
const onDisconnect = require('./onDisconnect');
const { isTyping, stopTyping } = require('./onTyping.js');

const formatTimestamp = require('../../middleware/formatTimestamp.js');
const rateLimitAllEvents = require('../../middleware/rateLimitAllEvents.js');

module.exports = async ({ socket, io, dbQuery, UserDirector, AdminDirector }) => {
    const { role, room, exp, name } = socket.user;
    const timestamp = formatTimestamp(exp);
    const roomRef = { current: role === 'admin' ? 'admin' : room };

    socket.join(roomRef.current);

    // When a guest connects it will fetch their current unread_messages count from support messages so that it is available for admin viewing immediatley.
    // The value is added to the UserDirector object so that it can be retrieved upon admin join.
    if (role === 'guest') {
        const unreadData = await dbQuery(`SELECT room, COUNT(*) AS unread FROM \`support-messages\` WHERE \`is_read\` = 0 AND \`room\` = ? AND user != "admin"`, [roomRef.current]);

        if (!unreadData) return socket.emit('error', { type: 'db-error', message: 'Error retrieving unread messages.' });

        UserDirector.addUser(name, { room: roomRef.current, role, unread: unreadData[0].unread, typing: false });
    }

    // Send signal 
    // (before a potentially futher updated admin signal)
    // This signal is used to tell the frontend that the user has joined and that the message channel is available for joining
    const allUsers = UserDirector.getAllUsers();
    io.to('admin').emit('update-users', allUsers);
    io.emit('user-join', allUsers.length);

    // Get all users current message room/counts and send to all admins (via admin room)
    if (role === 'admin') {
        AdminDirector.addUser(name, { room: roomRef.current, role });

        const unreadMessages = await dbQuery(`SELECT room, COUNT(*) AS unread FROM \`support-messages\` WHERE \`is_read\` = 0 AND user != "admin" GROUP BY room`);

        if (!unreadMessages) return socket.emit('error', { type: 'db-error', message: 'Error retrieving unread messages.' });

        const updatedUsers = UserDirector.getAllUsers().map(([userName, user]) => {
            const match = unreadMessages.find(msg => msg.room === user.room);
            return [userName, { ...user, unread: match?.unread || 0 }];
        });

        io.to('admin').emit('update-users', updatedUsers);
    }

    // Emit admin online status
    io.emit('admin-online', { message: AdminDirector.adminOnline() });

    // Send past messages to the newly joined user
    const pastMessages = await dbQuery('SELECT * FROM `support-messages` WHERE room = ?', [roomRef.current]);
    if (pastMessages) socket.emit('past-messages', { messages: pastMessages });

    // Socket IO Events
    if (role !== 'admin') rateLimitAllEvents(socket);
    onDisconnect({ socket, io, UserDirector, AdminDirector, role, name });
    onMessage({ socket, io, dbQuery, roomRef, role, timestamp, AdminDirector, name, UserDirector });
    onChangeRoom({ socket, io, dbQuery, roomRef, role, AdminDirector, name });
    isTyping({ socket, io, roomRef, name });
    stopTyping({ socket, io, roomRef, name });
};