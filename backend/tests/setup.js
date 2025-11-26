import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "../test.env") });

export const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI not found in test.env");
    
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
    
    await mongoose.connect(process.env.MONGODB_URI, { 
      dbName: "testdb",
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 10000, 
      socketTimeoutMS: 45000,
    });
    console.log('Test DB connected successfully');
  } catch (error) {
    console.error('Test DB connection error:', error);
    throw error;
  }
};

export const clearDB = async () => {
  try {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const collections = mongoose.connection.collections;
    
    for (const key in collections) {
      const collection = collections[key];
      try {
        await collection.drop();
      } catch (error) {
        try {
          await collection.deleteMany({});
        } catch (deleteError) {
          if (!deleteError.message.includes('ns not found')) {
            console.log('ClearDB warning for collection', key, ':', deleteError.message);
          }
        }
      }
    }
    
    await new Promise(resolve => setTimeout(resolve, 200));
  } catch (error) {
    console.log('ClearDB error:', error.message);
  }
};

export const closeDB = async () => {
  try {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  } catch (error) {
    console.log('CloseDB error:', error.message);
  }
};

export const generateAuthToken = (userId, role = "user") =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET || 'your-secret-key', {
    expiresIn: '30d'
  });