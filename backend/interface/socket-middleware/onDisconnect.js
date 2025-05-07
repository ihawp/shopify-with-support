module.exports = ({ socket, io, UserDirector, AdminDirector, role, name }) => {
    socket.on('disconnect', () => {

        if (role !== 'admin') {
            if (UserDirector.userExists(name)) {
                UserDirector.removeUserBySocketId(name);
                io.emit('user-leave', UserDirector.getAllUsers().length);
                io.emit('update-users', UserDirector.getAllUsers());
            }
            return;
        }

        if (AdminDirector.userExists(name)) {
            AdminDirector.removeUserBySocketId(name);
        }

        io.emit('admin-online', AdminDirector.adminOnline());
    });
};