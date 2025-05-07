class PersonInterface {
    constructor() {
        this.people = new Map();
    }

    addUser(socketId, { room, role, unread }) {
        const personData = { room, role, unread };
        this.people.set(socketId, personData);
    }

    removeUserBySocketId(socketId) {
        this.people.delete(socketId);
    }

    updateRoom(socketId, newRoom) {
        if (!this.people.has(socketId)) return false;
    
        const user = this.people.get(socketId);
        this.people.set(socketId, { ...user, room: newRoom });
        return true;
    }

    getUserData(socketId) {
        return this.people.get(socketId);
    }

    userExists(socketId) {
        return this.people.has(socketId);
    }

    getAllUsers() {
        return Array.from(this.people.entries());
    }
}

module.exports = PersonInterface;