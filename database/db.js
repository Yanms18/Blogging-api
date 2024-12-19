import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectToDb = () => {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    throw new Error('MONGO_URI is not defined in the environment variables');
  }

  mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  mongoose.connection.on('connected', () => {
    console.log('Connected to MongoDB successfully');
  });

  mongoose.connection.on('error', (err) => {
    console.log('Error connecting to MongoDB', err);
  });
};

export default connectToDb;
