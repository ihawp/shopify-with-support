const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const cookie = require('cookie');
const mysql = require('mysql2');

//

class SocketInterface {
    constructor(httpServer, UserDirector) {
        this.io = new Server(httpServer, {
            cors: {
                origin: "http://localhost:5173",
                methods: ["GET", "POST"],
                credentials: true,  // Allow cookies to be sent with WebSocket requests
            },
        });

        this.io.on('connection', (socket) => {

            let verifier = 'user-secret-token';
            let role = 'guest';

            // Here we parse the requests cookies
            // And retrieve a token if one exists
            const cookies = cookie.parse(socket.request.headers.cookie || '');
            const token = cookies?.token;

            // Force user to want to reload page so that they can retrieve auth and chat with support admin
            if (!token) {
                socket.emit('auth-error', 'disconnecting because no auth');
                socket.disconnect();
            }

            // Use decode (allows access to key pair values stored in jwt without verifying the jwt with a secret token) to try admin checking (change verifier to admin-secret-token)
            let insecureDecoded = jwt.decode(token);
            if (insecureDecoded && insecureDecoded?.role === 'admin') verifier = 'admin-secret-token';

            // Use jwt verify on the proper verifier (this could likely be reduced or functionality brought from elsewhere, but I think it's important it remains inline in this context without having to pass params)
            jwt.verify(token, verifier, (err, decoded) => {
                if (err) {
                    socket.emit('auth-error', 'Invalid or expired token.');
                    socket.disconnect();
                    return;
                }

                role = decoded.role || 'guest';
                let room = role === 'admin' ? 'admin' : decoded.room;

                socket.join(room);

                UserDirector.addUser(room, { room: room, role: role });

                this.emitToRoom('admin', 'update-users', UserDirector.getAllUsers());

                this.io.emit('user-join', UserDirector.getAllUsers().length);

                socket.on('message', (data) => {

                    // so we receive a message
                    // we know the role of this user from above
                    // we can upload to db: the message, who sent it ('guest' or 'admin'), the room, timestamp
                    // use mysql 2 for now (with XAMPP)

                    

                    this.emitToRoom(room, 'message', { user: role, message: data });
                });

                socket.on('change-room', (newRoom) => {
                    if (role !== 'admin') socket.disconnect();
                    if (room !== 'admin') socket.leave(room);
                    room = newRoom;
                    socket.join(newRoom);
                });

                socket.on('disconnect', () => {
                    if (UserDirector.userExists(room)) {
                        UserDirector.removeUserBySocketId(room);
                        this.io.emit('user-leave', UserDirector.getAllUsers().length);
                        this.io.emit('update-users', UserDirector.getAllUsers());
                    }
                });
            });
        });
    }

    emit(event, data) {
        this.io.emit(event, data);
    }

    emitToRoom(room, event, data) {
        this.io.to(room).emit(event, data);
    }

    emitToMultipleRooms(event, rooms, data) {
        rooms.forEach(room => {
            this.io.to(room).emit(event, data);
        });
    }
}

module.exports = SocketInterface;
