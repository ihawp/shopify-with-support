function formatTimestamp6(data) {
    const pad = (n, len = 2) => String(n).padStart(len, '0');

    // Ensure input is a number (timestamp in ms)
    const ms = typeof data === 'number' ? data : Number(data?.timestamp || data);
    const date = new Date(ms * 1000);

    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());

    const milliseconds = date.getMilliseconds();
    const microseconds = pad(milliseconds * 1000, 6);

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${microseconds}`;
}

module.exports = formatTimestamp6;
