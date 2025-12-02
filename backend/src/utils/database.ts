import mongoose from 'mongoose';

export let isConnected = false;

export const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/leadrockets';

    // Try to connect
    const conn = await mongoose.connect(mongoURI, {
      // Remove deprecated options - they're now defaults in Mongoose 6+
    });

    console.log(`🍃 MongoDB Connected: ${conn.connection.host}`);
    isConnected = true;

    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
      isConnected = false;
    });

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ MongoDB disconnected');
      isConnected = false;
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('🔐 MongoDB connection closed through app termination');
      process.exit(0);
    });

  } catch (error) {
    console.error('❌ Database connection failed:', error);
    console.log('⚠️ Running in MOCK MODE (In-Memory Database)');
    isConnected = false;
    // Don't throw error to allow app to start in mock mode
  }
};

export const disconnectDB = async (): Promise<void> => {
  try {
    await mongoose.connection.close();
    console.log('🔐 Database disconnected successfully');
    isConnected = false;
  } catch (error) {
    console.error('❌ Error disconnecting from database:', error);
    throw error;
  }
};