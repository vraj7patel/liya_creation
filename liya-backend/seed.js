const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Product = require('./models/Product');
const Category = require('./models/Category');

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/liya-creation');
    console.log('Connected to MongoDB');

    // Create Admin User
    const adminExists = await User.findOne({ email: 'admin@liyacreation.com' });
    if (!adminExists) {
      await User.create({
        name: 'Admin',
        email: 'admin@liyacreation.com',
        password: 'admin123',
        phone: '1234567890',
        role: 'admin'
      });
      console.log('✅ Admin user created');
    } else {
      console.log('✅ Admin user already exists');
    }

    // Create Test User
    const userExists = await User.findOne({ email: 'test@user.com' });
    if (!userExists) {
      await User.create({
        name: 'Test User',
        email: 'test@user.com',
        password: 'test123',
        phone: '9876543210',
        role: 'user'
      });
      console.log('✅ Test user created');
    } else {
      console.log('✅ Test user already exists');
    }

    // Create Categories
    const defaultCategories = [
      { name: 'Lehengas', description: 'Traditional lehenga sarees' },
      { name: 'saree', description: 'Designer sarees' },
      { name: 'Gowns', description: 'Elegant gowns' },
      { name: 'Kurtis', description: 'Comfortable kurtis' }
    ];

    for (const cat of defaultCategories) {
      const exists = await Category.findOne({ name: cat.name });
      if (!exists) {
        await Category.create(cat);
        console.log(`✅ Category ${cat.name} created`);
      } else {
        console.log(`✅ Category ${cat.name} already exists`);
      }
    }

    // Check if products already exist - if so, skip seeding
    const existingProducts = await Product.countDocuments();
    if (existingProducts > 0) {
      console.log(`\n========================================`);
      console.log(`📦 ${existingProducts} products already exist in database.`);
      console.log(`   Skipping product seeding.`);
      console.log(`========================================\n`);
    } else {
      // Create Sample Products only if none exist
      const sampleProducts = [
        // Lehengas (6 products)
        {
          name: 'Royal Red Lehenga',
          description: 'Beautiful red lehenga with gold embroidery and matching saree. Perfect for weddings and special occasions.',
          price: 15000,
          category: 'Lehengas',
          images: ['https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500'],
          sizes: ['M', 'L', 'XL'],
          stock: 10,
          isFeatured: true
        },
        {
          name: 'Blue Net Lehenga',
          description: 'Gorgeous blue net lehenga with sequin work. Lightweight and elegant.',
          price: 12000,
          category: 'Lehengas',
          images: ['https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=500'],
          sizes: ['S', 'M', 'L'],
          stock: 8,
          isFeatured: false
        },
        {
          name: 'Green Velvet Lehenga',
          description: 'Luxurious green velvet lehenga with intricate zari work. Perfect for festive occasions.',
          price: 18500,
          category: 'Lehengas',
          images: ['https://images.unsplash.com/photo-1618220179428-22790b461013?w=500'],
          sizes: ['M', 'L', 'XL', 'XXL'],
          stock: 6,
          isFeatured: true
        },
        {
          name: 'Golden Silk Lehenga',
          description: 'Exquisite golden silk lehenga with traditional motifs. A timeless classic.',
          price: 22000,
          category: 'Lehengas',
          images: ['https://images.unsplash.com/photo-1583391720852-8eb066bc8bec?w=500'],
          sizes: ['S', 'M', 'L', 'XL'],
          stock: 5,
          isFeatured: true
        },
        {
          name: 'Pink Georgette Lehenga',
          description: 'Beautiful pink georgette lehenga with ruffled edges. Romantic and elegant.',
          price: 9800,
          category: 'Lehengas',
          images: ['https://images.unsplash.com/photo-1595039838779-f3780873afdd?w=500'],
          sizes: ['XS', 'S', 'M', 'L'],
          stock: 12,
          isFeatured: false
        },
        {
          name: 'Maroon Bridal Lehenga',
          description: 'Magnificent maroon bridal lehenga with heavy embroidery. Traditional elegance redefined.',
          price: 35000,
          category: 'Lehengas',
          images: ['https://images.unsplash.com/photo-1562229125-0e813404a3cc?w=500'],
          sizes: ['M', 'L', 'XL'],
          stock: 3,
          isFeatured: true
        },

        // saree (5 products)
        {
          name: 'Pink Silk saree',
          description: 'Elegant pink silk saree with intricate handwork. Comes with matching bottom.',
          price: 8500,
          category: 'saree',
          images: ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500'],
          sizes: ['S', 'M', 'L'],
          stock: 15,
          isFeatured: true
        },
        {
          name: 'Red Embroidered saree',
          description: 'Stunning red saree with heavy mirror work. Perfect for festive celebrations.',
          price: 6500,
          category: 'saree',
          images: ['https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500'],
          sizes: ['S', 'M', 'L', 'XL'],
          stock: 20,
          isFeatured: false
        },
        {
          name: 'Blue Net saree',
          description: 'Beautiful blue net saree with stone work. Lightweight and graceful.',
          price: 5500,
          category: 'saree',
          images: ['https://images.unsplash.com/photo-1564584217132-2271feaeb3c5?w=500'],
          sizes: ['XS', 'S', 'M', 'L'],
          stock: 18,
          isFeatured: true
        },
        {
          name: 'Green Silk saree',
          description: 'Elegant green silk saree with zari border. Traditional charm personified.',
          price: 7500,
          category: 'saree',
          images: ['https://images.unsplash.com/photo-1616091093747-9e47228805f7?w=500'],
          sizes: ['S', 'M', 'L'],
          stock: 14,
          isFeatured: false
        },
        {
          name: 'Black Designer saree',
          description: 'Contemporary black saree with modern cuts. Perfect for cocktail parties.',
          price: 9200,
          category: 'saree',
          images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500'],
          sizes: ['XS', 'S', 'M', 'L', 'XL'],
          stock: 10,
          isFeatured: true
        },

        // Gowns (6 products)
        {
          name: 'Bridal Gown',
          description: 'Stunning bridal gown with elaborate beadwork and train. A showstopper for your big day.',
          price: 25000,
          category: 'Gowns',
          images: ['https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=500'],
          sizes: ['M', 'L', 'XL'],
          stock: 5,
          isFeatured: true
        },
        {
          name: 'Designer Gown',
          description: 'Modern designer gown perfect for party wear. Features elegant draping.',
          price: 18000,
          category: 'Gowns',
          images: ['https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=500'],
          sizes: ['M', 'L', 'XL', 'XXL'],
          stock: 12,
          isFeatured: true
        },
        {
          name: 'Red Silk Gown',
          description: 'Gorgeous red silk gown with elegant silhouette. Perfect for formal events.',
          price: 16500,
          category: 'Gowns',
          images: ['https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500'],
          sizes: ['S', 'M', 'L', 'XL'],
          stock: 8,
          isFeatured: true
        },
        {
          name: 'Blue Evening Gown',
          description: 'Sophisticated blue evening gown with flowing fabric. Elegance redefined.',
          price: 14500,
          category: 'Gowns',
          images: ['https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=500'],
          sizes: ['M', 'L', 'XL'],
          stock: 7,
          isFeatured: false
        },
        {
          name: 'Pink Sequins Gown',
          description: 'Dazzling pink gown covered in sequins. Shine bright at any party.',
          price: 12800,
          category: 'Gowns',
          images: ['https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=500'],
          sizes: ['XS', 'S', 'M', 'L'],
          stock: 9,
          isFeatured: true
        },
        {
          name: 'White Wedding Gown',
          description: 'Classic white wedding gown with lace details. Fairy tale elegance.',
          price: 28000,
          category: 'Gowns',
          images: ['https://images.unsplash.com/photo-1519741497674-611481863552?w=500'],
          sizes: ['S', 'M', 'L', 'XL'],
          stock: 4,
          isFeatured: true
        },

        // Kurtis (5 products)
        {
          name: 'Cotton Kurti',
          description: 'Comfortable everyday cotton kurti in beautiful prints. Perfect for casual wear.',
          price: 2500,
          category: 'Kurtis',
          images: ['https://images.unsplash.com/photo-1583744946564-b52ac1c389c8?w=500'],
          sizes: ['XS', 'S', 'M', 'L', 'XL'],
          stock: 50,
          isFeatured: false
        },
        {
          name: 'Silk Kurti',
          description: 'Luxurious silk kurti with hand block prints. Traditional elegance for office wear.',
          price: 4500,
          category: 'Kurtis',
          images: ['https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500'],
          sizes: ['S', 'M', 'L', 'XL'],
          stock: 25,
          isFeatured: true
        },
        {
          name: 'Anarkali Kurti',
          description: 'Flared Anarkali style kurti with golden work. Graceful and glamorous.',
          price: 3800,
          category: 'Kurtis',
          images: ['https://images.unsplash.com/photo-1583391720852-8eb066bc8bec?w=500'],
          sizes: ['XS', 'S', 'M', 'L', 'XL'],
          stock: 30,
          isFeatured: true
        },
        {
          name: 'Long Kurti',
          description: 'Elegant long kurti perfect for pairing with leggings. Contemporary style.',
          price: 3200,
          category: 'Kurtis',
          images: ['https://images.unsplash.com/photo-1618235535178-4313e5778d2a?w=500'],
          sizes: ['S', 'M', 'L', 'XL', 'XXL'],
          stock: 20,
          isFeatured: false
        },
        {
          name: 'Embroidered Kurti',
          description: 'Beautiful kurti with intricate embroidery work. Perfect for festive occasions.',
          price: 4200,
          category: 'Kurtis',
          images: ['https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500'],
          sizes: ['XS', 'S', 'M', 'L'],
          stock: 18,
          isFeatured: false
        }
      ];

      for (const product of sampleProducts) {
        const exists = await Product.findOne({ name: product.name });
        if (!exists) {
          await Product.create(product);
          console.log(`✅ Product "${product.name}" created`);
        }
      }
    }

    console.log('\n========================================');
    console.log('🎉 Seed data completed successfully!');
    console.log('========================================\n');
    console.log('📋 Login Credentials:');
    console.log('----------------------------------------');
    console.log('👤 Admin:');
    console.log('   Email: admin@liyacreation.com');
    console.log('   Password: admin123');
    console.log('');
    console.log('👤 User (Customer):');
    console.log('   Email: test@user.com');
    console.log('   Password: test123');
    console.log('----------------------------------------\n');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
};

seedData();
