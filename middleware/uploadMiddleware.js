const multer = require('multer');

// Configure storage settings for multer
const storage = multer.diskStorage({
    // Set destination for uploaded files
    destination: function (req, file, cb) {
        cb(null, './uploads'); // Store files in the 'uploads' directory
    },
    // Set filename for uploaded files
    filename: function (req, file, cb) {
        // Use current timestamp and original file name to create a unique file name
        cb(null, Date.now() + '-' + file.originalname);
    }
});

// Create multer instance with the defined storage settings
const upload = multer({ storage: storage });

// Export the multer instance for use in other modules
module.exports = upload;