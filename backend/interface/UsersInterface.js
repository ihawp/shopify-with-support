class UsersInterface {
  constructor() {
    this.users = new Map();
  }

  addUser(socketId, { room, role }) {
    const userData = { room, role };
    this.users.set(socketId, userData);
  }

  removeUserBySocketId(socketId) {
    this.users.delete(socketId);
  }

  updateUser(socketId, { room, role }) {
    if (this.users.has(socketId)) {
      const updatedData = { room, role };
      this.users.set(socketId, updatedData);
    } else {
      return 0;
    }
  }

  getUserData(socketId) {
    return this.users.get(socketId);
  }

  userExists(socketId) {
    return this.users.has(socketId);
  }

  getAllUsers() {
    return Array.from(this.users.entries());
  }
}

module.exports = UsersInterface;
