module.exports = ({ socket, io, UserDirector, role, userIdentifier }) => {
    socket.on('disconnect', () => {
        if (UserDirector.userExists(userIdentifier)) {
            UserDirector.removeUserBySocketId(userIdentifier);
            io.emit('user-leave', UserDirector.getAllUsers().length);
            io.emit('update-users', UserDirector.getAllUsers());
        }

        if (role === 'admin') io.emit('admin-online', UserDirector.adminOnline());
    });
};