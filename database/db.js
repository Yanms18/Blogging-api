const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connectToDb = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error('MONGO_URI is not defined in the environment variables');
    }

    // Set the strictQuery option to false to prepare for Mongoose 7
    mongoose.set('strictQuery', false);

    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('Connected to MongoDB successfully');
  } catch (error) {
    console.error('Error connecting to MongoDB', error);
    process.exit(1); // Exit the process with failure
  }
};

module.exports = connectToDb;