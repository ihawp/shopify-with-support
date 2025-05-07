const PersonInterface = require('./PersonInterface');

class AdminInterface extends PersonInterface {
    constructor() {
        super();
    }

    adminOnline() {
        return this.people.size > 0;
    }
}

module.exports = AdminInterface;