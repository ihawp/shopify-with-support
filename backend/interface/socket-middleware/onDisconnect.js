module.exports = ({ socket, io, UserDirector, AdminDirector, role, name }) => {
    socket.on('disconnect', () => {

        if (role === 'admin') {
            if (AdminDirector.userExists(name)) AdminDirector.removeUserBySocketId(name);
            io.emit('admin-online', { message: AdminDirector.adminOnline() });
            return;
        }

        if (UserDirector.userExists(name)) {
            UserDirector.removeUserBySocketId(name);
            io.emit('user-leave', UserDirector.getAllUsers().length);
            io.emit('update-users', UserDirector.getAllUsers());
        }

    });
};