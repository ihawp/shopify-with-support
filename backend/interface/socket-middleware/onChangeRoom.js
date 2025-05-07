module.exports = ({ socket, io, dbQuery, roomRef, role }) => {
    socket.on('change-room', async (newRoom) => {
        if (role !== 'admin') return socket.disconnect();
    
        socket.leave(roomRef.current);
        roomRef.current = newRoom;
        
        const newMessages = await dbQuery('SELECT * FROM `support-messages` WHERE room = ?', [newRoom]);

        if (!newMessages) return socket.emit('error', { type: 'db-error', message: 'Failed to retrieve messages from the database.' });
    
        socket.emit('past-messages', { messages: newMessages });

        const updateMessage = await dbQuery('UPDATE `support-messages` SET `is_read` = 1 WHERE `room` = ? AND `is_read` = 0', [newRoom]);

        if (!updateMessage) return socket.emit('error', { type: 'db-error', message: 'Failed to update messages as read (is_read).' })

        io.to('admin').emit('update-unread-counts', { room: newRoom, unread: 0 });
    
        socket.join(newRoom);
    });
};
