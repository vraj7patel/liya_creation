require('dotenv').config();
const cloudinary = require('cloudinary').v2;
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

// Use CLOUDINARY_URL directly if individual vars not set
if (process.env.CLOUDINARY_URL) {
  cloudinary.config({ cloudinary_url: process.env.CLOUDINARY_URL });
} else {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
}

const Product = require('./models/Product');

async function migrate() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  const products = await Product.find({});
  console.log(`Found ${products.length} products`);

  for (const product of products) {
    let updated = false;
    const newImages = [];

    for (const img of product.images) {
      // Already a Cloudinary URL
      if (img.startsWith('http')) {
        newImages.push(img);
        continue;
      }

      // Local path - upload to Cloudinary
      const filename = path.basename(img);
      const localPath = path.join(__dirname, 'uploads/products', filename);

      if (fs.existsSync(localPath)) {
        try {
          const result = await cloudinary.uploader.upload(localPath, {
            folder: 'liya-creation/products',
            public_id: filename.replace(/\.[^/.]+$/, '')
          });
          newImages.push(result.secure_url);
          updated = true;
          console.log(`✅ Uploaded: ${filename}`);
        } catch (err) {
          console.log(`❌ Failed: ${filename} - ${err.message}`);
          newImages.push(img);
        }
      } else {
        console.log(`⚠️ File not found: ${filename}`);
        newImages.push(img);
      }
    }

    if (updated) {
      product.images = newImages;
      await product.save();
      console.log(`Updated product: ${product.name}`);
    }
  }

  console.log('Migration complete!');
  process.exit(0);
}

migrate().catch(err => { console.error(err); process.exit(1); });
