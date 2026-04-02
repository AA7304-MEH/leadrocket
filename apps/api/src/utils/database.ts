/**
 * Database connection utility
 * Uses mock file-based storage for development
 */

export let isConnected = false;

export const connectDB = async (): Promise<void> => {
  // Using file-based mock storage - no external DB connection needed
  console.log('✅ Using file-based mock storage (no database required)');
  isConnected = true;
};

export const disconnectDB = async (): Promise<void> => {
  console.log('🔐 Mock storage cleanup complete');
  isConnected = false;
};