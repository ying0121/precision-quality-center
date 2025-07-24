const multer = require('multer');
const fs = require('fs');
const path = require('path');

// Function to handle file upload
exports.uploadFile = (req, destination, files) => {
    return new Promise((resolve, reject) => {
        // Set up storage configuration
        const storage = multer.diskStorage({
            destination: function (req, file, cb) {
                if (!fs.existsSync(destination)) {
                    fs.mkdirSync(destination, { recursive: true });
                }
                cb(null, destination);
            },
            filename: function (req, file, cb) {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                const extension = path.extname(file.originalname);
                cb(null, uniqueSuffix + extension);
            }
        });

        // Set up multer to use the local storage
        if (files == [] || files == null || files == undefined) {
            const upload = multer({ storage: storage }).single('file');
            // Handle upload
            upload(req, null, function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve(req.file.filename);
                }
            });
        } else {
            const upload = multer({ storage: storage }).fields(files)
            upload(req, null, function (err) {
                if (err) {
                    reject(err);
                } else {
                    // Collect filenames of uploaded files
                    const uploadedFiles = {};
                    files.forEach(_file => {
                        if (req.files[_file['name']]) {
                            uploadedFiles[_file['name']] = req.files[_file['name']][0].filename
                        }
                    });
                    resolve(uploadedFiles);
                }
            });
        }
    });
};

exports.deleteOldFile = (filename, destination) => {
    return new Promise((resolve, reject) => {
        if (!filename) {
            reject(new Error("Filename is missing"));
            return;
        }

        const filePath = path.join(destination, filename);

        if (!fs.existsSync(filePath)) {
            resolve(); // File doesn't exist, resolve immediately
            return;
        }

        fs.unlink(filePath, (err) => {
            if (err) {
                console.error('Error deleting old file:', err);
                reject(err);
            } else {
                resolve();
            }
        });
    });
};
