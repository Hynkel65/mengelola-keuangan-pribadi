const fs = require('fs');
const multer = require('multer');
const path = require('path');

// Ensure the uploads directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage settings
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    },
});

// Add file type validation
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/; // Allowed file extensions
    const mimeType = allowedTypes.test(file.mimetype);
    const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase());

    if (mimeType && extName) {
        cb(null, true); // Accept the file
    } else {
        cb(new Error('Only image files (JPEG, JPG, PNG, GIF) are allowed!'), false);
    }
};

// Create the multer instance with storage and fileFilter
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
});

module.exports = upload;
