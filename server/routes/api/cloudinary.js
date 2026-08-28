import { Router } from 'express';
import cloudinary from 'cloudinary';

// Configure Cloudinary with server-side secrets
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const router = Router();

// Get Cloudinary signature for unsigned uploads
router.post('/get-signature', (req, res) => {
  const timestamp = Math.round(Date.now() / 1000);
  const signature = cloudinary.utils.api_sign_request(
    {
      timestamp: timestamp,
      upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET,
    },
    process.env.CLOUDINARY_API_SECRET
  );

  res.json({
    timestamp,
    signature,
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET,
  });
});

export default router;