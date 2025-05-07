module.exports = ({ socket, io, dbQuery, roomRef, role, timestamp }) => {
    socket.on('message', async (message) => {
        const insert = await dbQuery(
            'INSERT INTO `support-messages` (room, user, message, `delete-after`) VALUES (?, ?, ?, ?)',
            [roomRef.current, role, message, timestamp]
        );

        if (insert) io.to(roomRef.current).emit('message', { user: role, message });
    });
};