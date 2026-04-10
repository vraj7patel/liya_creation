const mongoose = require('mongoose');

const connectDB = async () => {
  let mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/liyadb';
  
  try {
    // SSL/TLS options for MongoDB Atlas connection
    const options = {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      tls: true,
      tlsAllowInvalidCertificates: false,
      tlsAllowInvalidHostnames: false,
      tlsCAFile: undefined,
    };
    
    const conn = await mongoose.connect(mongoURI, options);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    console.error('Make sure MongoDB is running locally or check your MONGODB_URI in .env');
    
    // Try connecting without SSL as fallback for local MongoDB
    if (mongoURI.includes('localhost') || mongoURI.includes('127.0.0.1')) {
      console.log('Trying connection without SSL...');
      try {
        const conn = await mongoose.connect(mongoURI);
        console.log(`MongoDB Connected (fallback): ${conn.connection.host}`);
      } catch (fallbackError) {
        console.error(`Fallback connection also failed: ${fallbackError.message}`);
        process.exit(1);
      }
    } else {
      // For Atlas, suggest IP whitelist issue
      if (error.message.includes('IP whitelist') || error.message.includes('Server selection timed out')) {
        console.error('\n=== MONGODB ATLAS CONNECTION ISSUE ===');
        console.error('Your IP address may not be whitelisted in MongoDB Atlas.');
        console.error('Please check: https://www.mongodb.com/docs/atlas/security-whitelist/');
        console.error('Or go to MongoDB Atlas -> Network Access -> Add IP Address');
      }
      process.exit(1);
    }
  }
};

module.exports = connectDB;
