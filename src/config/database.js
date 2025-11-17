const mongoose = require('mongoose');

const connectDB = async () => {
  // In development, use local JSON database
  if (process.env.NODE_ENV !== 'production') {
    console.log('📁 Using local JSON database for development');
    const localdb = require('./localdb');
    console.log('✅ Local JSON database ready');
    return;
  }

  // Production: use MongoDB
  console.log('🔌 Connecting to MongoDB Atlas...');
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️  MongoDB disconnected');
    });

  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;