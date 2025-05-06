function generateRandomName() {
    const adjectives = ['cool', 'fast', 'quiet', 'bright', 'smart'];
    const nouns = ['tiger', 'falcon', 'gecko', 'panda', 'fox'];
    const randomAdj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
    const randomNum = Math.floor(Math.random() * 1000);
    return `${randomAdj}-${randomNoun}-${randomNum}`;
}

module.exports = generateRandomName