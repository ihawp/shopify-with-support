class PersonInterface {
    constructor() {
        this.people = new Map();
    }

    addUser(socketId, { room, role }) {
        const personData = { room, role };
        this.people.set(socketId, personData);
    }

    removeUserBySocketId(socketId) {
        this.people.delete(socketId);
    }

    updateUser(socketId, { room, role }) {
        if (this.people.has(socketId)) {
            const updatedData = { room, role };
            this.people.set(socketId, updatedData);
        } else {
            return 0;
        }
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