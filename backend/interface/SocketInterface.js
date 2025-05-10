const { Server } = require('socket.io');
const mysql = require('mysql2/promise');
const dbConnect = require('../middleware/dbConnect.js');
const nodeCron = require('node-cron');

const corsOptions = require('../middleware/corsOptions.js');
const socketHandlers = require('./socket-middleware/index.js');
const socketAuth = require('./socket-middleware/socketAuth.js');

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
        await conn.execute('DELETE FROM `support-messages` WHERE `delete-after` < NOW()');
    } catch (error) {
        console.error('Error clearing expired messages:', error);
    }
}

class SocketInterface {
    constructor(httpServer, UserDirector, AdminDirector) {
        this.io = new Server(httpServer, { cors: corsOptions, });

        this.io.use(socketAuth);

        this.io.on('connection', (socket) => {

            socketHandlers({ socket, io: this.io, dbQuery, UserDirector, AdminDirector });

        });

        nodeCron.schedule('0 * * * *', clearExpiredMessages);

    }

    emit = (event, data) => this.io.emit(event, data);

    emitToRoom = (room, event, data) => this.io.to(room).emit(event, data);

    emitToMultipleRooms = (event, rooms, data) => rooms.forEach(room => this.io.to(room).emit(event, data));

}

module.exports = SocketInterface;
