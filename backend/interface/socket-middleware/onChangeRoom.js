module.exports = ({ socket, dbQuery, roomRef, role }) => {
    socket.on('change-room', async (newRoom) => {
        if (role !== 'admin') socket.disconnect();
    
        if (roomRef.current !== 'admin') socket.leave(roomRef.current);
    
        const newMessages = await dbQuery('SELECT * FROM `support-messages` WHERE room = ?', [newRoom]);
    
        if (newMessages) socket.emit('past-messages', { messages: newMessages });
    
        roomRef.current = newRoom;
        socket.join(newRoom);
    });
};
