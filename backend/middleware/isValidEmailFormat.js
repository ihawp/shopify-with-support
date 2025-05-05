function isValidEmailFormat(email) {
    // Very simple and safe regex for email format validation
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

module.exports = isValidEmailFormat