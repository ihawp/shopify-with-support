const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const cookie = require('cookie');
const mysql = require('mysql2/promise');
const dbConnect = require('../middleware/dbConnect.js');

const formatTimestamp = require('../middleware/formatTimestamp.js');

const dbQuery = async (conn, queryString, bindParam) => {
    try {
        const [results] = await conn.execute(
            queryString,
            bindParam
        );
        if (results) return results;
    } catch (error) {
        return false;
    }
}

class SocketInterface {
    constructor(httpServer, UserDirector) {
        this.io = new Server(httpServer, {
            cors: {
                origin: "http://localhost:5173",
                methods: ["GET", "POST"],
                credentials: true,
            },
        });

        this.io.on('connection', (socket) => {

            let verifier = 'user-secret-token';

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
            const insecureDecoded = jwt.decode(token);
            if (insecureDecoded && insecureDecoded?.role === 'admin') verifier = 'admin-secret-token';

            // Use jwt verify on the proper verifier (this could likely be reduced or functionality brought from elsewhere, but I think it's important it remains inline in this context without having to pass params)
            jwt.verify(token, verifier, async (err, decoded) => {
                if (err) {
                    socket.emit('auth-error', 'Invalid or expired token.');
                    socket.disconnect();
                    return;
                }

                const role = decoded.role || 'guest';

                // this is an issue
                // room needs to be const to remain defined within the 
                const roomRef = {
                    current: role === 'admin' ? 'admin' : decoded.room
                };

                // Query for past messages and emit them to the user
                const conn = await mysql.createConnection(dbConnect);
                const messages = await dbQuery(conn,
                    'SELECT * FROM `support-messages` WHERE room = ?',
                    [roomRef.current]
                );

                if (messages) {
                    socket.emit('past-messages', { messages });
                }

                socket.join(roomRef.current);

                UserDirector.addUser(roomRef.current, { room: roomRef.current, role: role });

                this.emitToRoom('admin', 'update-users', UserDirector.getAllUsers());

                this.io.emit('user-join', UserDirector.getAllUsers().length);

                socket.on('message', async (data) => {

                    const newTimestamp = formatTimestamp(decoded.exp);

                    const uploadMessage = await dbQuery(conn,
                        'INSERT INTO `support-messages` (room, user, message, `delete-after`) VALUES (?, ?, ?, ?)', 
                        [roomRef.current, role, data, newTimestamp]
                    );

                    if (uploadMessage) {
                        this.emitToRoom(roomRef.current, 'message', { user: role, message: data });
                    }
                    // else send error
                });

                socket.on('change-room', async (newRoom) => {
                    if (role !== 'admin') socket.disconnect();
                
                    if (roomRef.current !== 'admin') {
                        socket.leave(roomRef.current);
                    }
                
                    const newMessages = await dbQuery(conn,
                        'SELECT * FROM `support-messages` WHERE room = ?',
                        [newRoom]
                    );
                
                    if (newMessages) {
                        socket.emit('past-messages', { messages: newMessages });
                    }
                
                    roomRef.current = newRoom;
                    socket.join(newRoom);
                });

                socket.on('disconnect', () => {
                    if (UserDirector.userExists(roomRef.current)) {
                        UserDirector.removeUserBySocketId(roomRef.current);
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
