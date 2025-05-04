const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const cookie = require('cookie');

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
            let room = `${Date.now()}_guest`;
            let role = 'guest';

            const cookies = cookie.parse(socket.request.headers.cookie || '');
            const token = cookies.token;

            if (!token) {
                socket.emit('auth-error', 'disconnecting because no auth');
                socket.disconnect();
            }

            let decoded = jwt.decode(token);

            if (decoded && decoded.role === 'admin') {
                verifier = 'admin-secret-token';
            }

            jwt.verify(token, verifier, (err, decoded) => {
                if (err) {
                    socket.emit('auth-error', 'Invalid or expired token.');
                    socket.disconnect();
                    return;
                }

                role = decoded.role || 'guest';
                room = role === 'admin' ? 'admin' : room;

                console.log(role);

                socket.join(room);

                // Dont update
                // Or do, but don't change rooms or anything like that (it is important that each user can retain their session as long as their cookie lasts.)

                UserDirector.addUser(socket.id, { socket: socket.id, room: room, role: role });

                this.io.emit('user-join', UserDirector.getAllUsers().length);

                socket.on('message', (data) => {
                    this.emitToRoom(room, 'message', { user: socket.id, message: data });
                });

                socket.on('change-room', (newRoom) => {
                    if (role === 'admin') {
                        socket.leave(room);
                        room = newRoom;
                        socket.join(newRoom);
                    } else {
                        socket.disconnect();
                    }
                });

                socket.on('disconnect', () => {
                    if (UserDirector.userExists(socket.id)) {
                        UserDirector.removeUserBySocketId(socket.id);
                        this.io.emit('user-leave', UserDirector.getAllUsers().length);
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
