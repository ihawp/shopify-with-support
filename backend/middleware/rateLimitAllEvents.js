const { RateLimiterMemory } = require('rate-limiter-flexible');

const rateLimiter = new RateLimiterMemory({
    points: 10,
    duration: 10
});

module.exports = (socket) => {
    const originalOn = socket.on.bind(socket);

    const isAdmin = socket.user?.role === 'admin';

    socket.on = (eventName, listener) => {
        originalOn(eventName, async (...args) => {
            try {
                await rateLimiter.consume(socket.id);
                listener(...args);
            } catch (err) {
                socket.emit('error', { type: 'rate-limit', message: 'You have reached the rate limit of this application. Please slow down.' });
            }
        });
    };
}
