// middleware/upload.js
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log('✅ Uploads directory created at:', uploadDir);
}

// Configure storage for resumes
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        console.log('Saving file to:', uploadDir);
        cb(null, uploadDir);
    },
    filename: function(req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        const filename = `resume-${uniqueSuffix}${ext}`;
        console.log('Generated filename:', filename);
        cb(null, filename);
    }
});

// File Filter
const fileFilter = (req, file, cb) => {
    console.log('Processing file:', file.originalname);
    console.log('MIME type:', file.mimetype);
    
    const allowedTypes = /pdf|doc|docx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
        console.log('✅ File type accepted');
        return cb(null, true);
    } else {
        console.log('❌ File type rejected');
        cb(new Error('Only document files are allowed (PDF, DOC, DOCX)!'));
    }
};

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: fileFilter,
});

// Error handling middleware
const handleMulterError = (err, req, res, next) => {
    console.log('Multer error:', err);
    
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                success: false,
                message: 'File size too large. Maximum size is 5MB.'
            });
        }
        return res.status(400).json({
            success: false,
            message: err.message
        });
    } else if (err) {
        return res.status(400).json({
            success: false,
            message: err.message
        });
    }
    next();
};

// Middleware for single file upload (resume)
export const uploadResume = (req, res, next) => {
    console.log('📤 Upload middleware called');
    
    upload.single('resume')(req, res, (err) => {
        if (err) {
            console.log('❌ Upload error:', err);
            return handleMulterError(err, req, res, next);
        }
        
        console.log('✅ File uploaded successfully');
        console.log('req.file:', req.file);
        
        // If file was uploaded, add file path to req.body
        if (req.file) {
            req.body.resume = `/uploads/${req.file.filename}`;
            console.log('Resume path added to body:', req.body.resume);
        } else {
            console.log('⚠️ No file uploaded');
        }
        
        next();
    });
};

export { upload };