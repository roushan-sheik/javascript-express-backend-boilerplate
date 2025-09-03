// uploadMiddleware.js
import multer from 'multer';

const ALLOWED_MIME_TYPES = [
    'image/jpeg',
    'image/png',
    'image/svg+xml',
    'image/gif',
    'image/webp',
    'video/mp4',
    'video/quicktime',
    'video/x-msvideo',
    "application/octet-stream",
    'image/vnd.microsoft.icon'
];

const fileFilter = (req, file, cb) => {
    if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
        cb(null, true);
    } else {
        const error = new Error('Invalid file type. Only image and video files are allowed.');
        error.status = 400;
        cb(error, false);
    }
};

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 10 * 1024 * 1024,
    },
    fileFilter,
});

export default upload;
