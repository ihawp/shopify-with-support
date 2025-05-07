module.exports = ({ socket, io, UserDirector, role, name }) => {
    socket.on('disconnect', () => {
        if (UserDirector.userExists(name)) {
            UserDirector.removeUserBySocketId(name);
            io.emit('user-leave', UserDirector.getAllUsers().length);
            io.emit('update-users', UserDirector.getAllUsers());
        }

        if (role === 'admin') io.emit('admin-online', UserDirector.adminOnline());
    });
};