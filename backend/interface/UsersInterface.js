class UsersInterface {
    constructor() {
      this.users = new Map();
    }
  
    addUser(socketId, data) {
      this.users.set(socketId, data);
    }
  
    removeUserBySocketId(socketId) {
      this.users.delete(socketId);
    }

    updateUser(socketId, data) {
      if (this.users.has(socketId)) {
        this.users.set(socketId, data);
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
  