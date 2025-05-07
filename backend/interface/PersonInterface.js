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