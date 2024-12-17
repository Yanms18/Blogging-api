import mongoose from "mongoose";


const connectToDb = () => {
  mongoose.connect(process.env.MONGO_URI);

  mongoose.connection.on("connected", () => {
    console.log('Connected to MongoDB successfully');
});

mongoose.connection.on("error", (err) => {
    console.log('Error connecting to MongoDB', err);
})
};

export default connectToDb;




