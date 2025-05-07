const PersonInterface = require('./PersonInterface');

class AdminInterface extends PersonInterface {
    constructor() {
        super();
    }

    adminOnline() {
        return this.people.size > 0;
    }

    adminInRoom(room) {
        for (const [, { room: adminRoom }] of this.people) {
            console.log(room, adminRoom);
            if (adminRoom === room) {
                return true;
            }
        }
        return false;
    }
}

module.exports = AdminInterface;