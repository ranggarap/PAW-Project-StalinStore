const { formatDate } = require('../utils/formatter');

const logger = (req, res, next) => {
    const timestamp = formatDate();
    
    // Dengarkan event 'finish' dari respons Express agar status code akurat
    res.on('finish', () => {
        console.log(`[${timestamp}] ${req.method} ${req.originalUrl || req.url} - ${res.statusCode}`);
    });
    
    next();
};

module.exports = logger;
