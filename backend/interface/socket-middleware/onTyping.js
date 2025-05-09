const isTyping = ({ socket, roomRef, name }) => {
    socket.on('is-typing', () => {
        if (roomRef.current !== 'admin') {
            socket.to(roomRef.current).emit('typing', { name, val: true })
        };
    });
}

const stopTyping = ({ socket, roomRef, name }) => {
    socket.on('stop-typing', () => {
        if (roomRef.current !== 'admin') {
            socket.to(roomRef.current).emit('typing', { name, val: false })
        };
    });
}

module.exports = { isTyping, stopTyping }