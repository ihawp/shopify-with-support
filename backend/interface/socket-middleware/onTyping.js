const isTyping = ({ socket, io, roomRef }) => {
    socket.on('is-typing', () => {
        if (roomRef.current !== 'admin') io.to(roomRef.current).emit('typing', { val: true });
    });
}

const stopTyping = ({ socket, io, roomRef }) => {
    socket.on('stop-typing', () => {
        if (roomRef.current !== 'admin') io.to(roomRef.current).emit('typing', { val: false });
    });
}

module.exports = { isTyping, stopTyping }