const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const cookie = require('cookie');
const mysql = require('mysql2/promise');
const dbConnect = require('../middleware/dbConnect.js');
const nodeCron = require('node-cron');

const corsOptions = require('../middleware/corsOptions.js');

const socketHandlers = require('./socket-middleware/index.js');

const conn = mysql.createPool(dbConnect);

const dbQuery = async (queryString, bindParam) => {
    try {
        const [results] = await conn.execute(queryString, bindParam);
        if (results) return results;
    } catch (error) {
        return false;
    }
}

async function clearExpiredMessages() {
    try {
        const [results] = await conn.execute('DELETE FROM `support-messages` WHERE `delete-after` < NOW() AND `user` != "admin"');
        if (results) console.log(`Deleted ${results.affectedRows} expired messages.`);
    } catch (error) {
        console.error('Error clearing expired messages:', error);
    }
}

class SocketInterface {
    constructor(httpServer, UserDirector) {
        this.io = new Server(httpServer, { cors: corsOptions, });

        this.io.use(require('./socket-middleware/socketAuth.js'));

        this.io.on('connection', (socket) => {

            const getAllUsers = UserDirector.getAllUsers();
            this.emitToRoom('admin', 'update-users', getAllUsers);
            this.io.emit('user-join', getAllUsers.length);

            socketHandlers({ socket, io: this.io, dbQuery, UserDirector });

        });

        nodeCron.schedule('0 * * * *', clearExpiredMessages);

    }

    emit = (event, data) => this.io.emit(event, data);

    emitToRoom = (room, event, data) => this.io.to(room).emit(event, data);

    emitToMultipleRooms = (event, rooms, data) => rooms.forEach(room => this.io.to(room).emit(event, data));

}

module.exports = SocketInterface;
