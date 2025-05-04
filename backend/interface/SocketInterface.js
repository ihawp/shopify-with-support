// SocketInterface.js
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');

class SocketInterface {
    constructor(httpServer, UserDirector) {
        this.io = new Server(httpServer, {
            cors: {
                origin: "http://localhost:5173",
                methods: ["GET", "POST"],
            },
        });

        this.io.on('connection', (socket) => {

            let verifier = 'user-secret-key';
            let room = `${Date.now()}_guest`;
            let role = 'guest';

            let handshake = socket.handshake.query.jwt;

            const createHandshake = () => {
                return jwt.sign(
                    { role: role },
                    verifier,
                    { expiresIn: '1h' }
                );
            }

            if (handshake === 'null') {
                handshake = createHandshake();
                this.emitToRoom(room, 'receive-jwt', { jwt: handshake });
            } else {
                const decoded = jwt.decode(handshake);
                
                if (decoded && decoded.role === 'admin') {
                    verifier = 'admin-secret-key';
                    room = 'admin';
                }
    
                jwt.verify(handshake, verifier, (err, decoded) => {
                    if (err) {
                        if (err.name === 'TokenExpiredError') {
                            UserDirector.removeUserBySocketId(socket.id);
                            socket.emit('auth-error', 'Your session has expired. Please log in again.');
                        }
                        socket.disconnect();
                        return;
                    }
    
                    role = decoded.role || 'guest';
                    room = decoded.room || room;
    
                });
            }

            const join = (newRoom) => {
                socket.leave(room);
                UserDirector.updateUser(socket.id, { socket: socket.id, room: newRoom, role: role });
                socket.join(newRoom);
            }

            join(room);

            UserDirector.addUser(socket.id, { socket: socket.id, room: room, role: role });

            socket.on('message', (data) => {
                room = UserDirector.getUserData(socket.id).room;
                this.emitToRoom(room, 'message', { user: socket.id, message: data });
            });

            socket.on('change-room', (room) => {
                if (role === 'admin') {
                    join(room);
                };
            })

            socket.on('disconnect', () => {
                if (UserDirector.userExists(socket.id)) {
                    UserDirector.removeUserBySocketId(socket.id);
                }
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
