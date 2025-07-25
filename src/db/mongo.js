import mongoose from 'mongoose';
import config from '../config.js';

export const connectMongo = async () => {
  try {
    await mongoose.connect(config.mongodb_uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('🟢 MongoDB conectado correctamente');
  } catch (error) {
    console.error('🔴 Error conectando MongoDB:', error.message);
  }
};
