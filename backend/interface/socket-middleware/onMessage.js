const validator = require('validator');
const AdminInterface = require('../AdminInterface');

module.exports = ({ socket, io, dbQuery, roomRef, role, timestamp, AdminDirector }) => {
    socket.on('message', async (message) => {

        if (typeof message !== 'string') return socket.emit('error', { type: 'format-error', message: 'Message not in proper format.' });

        let escapedMessage = validator.escape(message);
        let blacklistMessage = validator.blacklist(escapedMessage, '\\[\\]');
        let trimMessage = blacklistMessage.trim();

        const insert = await dbQuery(
            'INSERT INTO `support-messages` (room, user, message, `delete-after`) VALUES (?, ?, ?, ?)',
            [roomRef.current, role, trimMessage, timestamp]
        );

        if (!insert) return socket.emit('error', { type: 'db-error', message: 'There was an issue uploading your message to the database.' } );

        if (role !== 'admin' && !AdminDirector.adminInRoom(roomRef.current)) {
            io.to('admin').emit('update-unread-counts', { room: roomRef.current, unread: 1 } );
        }

        if (AdminDirector.adminInRoom(roomRef.current)) {
            const insertedId = insert?.insertId;
            const updateRead = await dbQuery(
                'UPDATE `support-messages` SET `is_read` = 1 WHERE id = ?',
                [insertedId]
            );
        
            if (!updateRead) return socket.emit('error', { type: 'db-error', message: 'There was an issue updating the read status of the message.' });
        }

        io.to(roomRef.current).emit('message', { user: role, message });
    });
};