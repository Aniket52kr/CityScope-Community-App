import dotenv from 'dotenv';
dotenv.config(); // Load environment variables

import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

// Validate Cloudinary credentials
const validateCloudinaryConfig = () => {
  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    console.error('Missing Cloudinary config in .env');
    throw new Error('Cloudinary environment variables not set');
  }
};
validateCloudinaryConfig();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Set up Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'cityscope_uploads', // Cloudinary folder name
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    resource_type: 'auto', // Automatically detect image/video
  },
});

// Configure Multer with validation
const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20 MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpe?g|png|gif|webp/;
    const isExtValid = allowedTypes.test(file.originalname.toLowerCase());
    const isMimeValid = allowedTypes.test(file.mimetype);

    if (isExtValid && isMimeValid) {
      cb(null, true);
    } else {
      cb(new Error('Only image files (jpg, png, gif, webp) are allowed'));
    }
  },
});

export default upload;
