// config/multerConfig.js
const multer = require('multer');

const storage = multer.memoryStorage(); // Use memory storage to handle file uploads

const upload = multer({ storage: storage });

module.exports = upload;
