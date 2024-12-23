const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connectToDb = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error('MONGO_URI is not defined in the environment variables');
    }

    mongoose.set('strictQuery', false);

    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 60000, // Increase server selection timeout to 60 seconds
    });

    console.log('Connected to MongoDB successfully');
  } catch (error) {
    console.error('Error connecting to MongoDB', error);
    process.exit(1); // Exit the process with failure
  }
};

module.exports = connectToDb;