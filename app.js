import express from 'express';
import dotenv from 'dotenv';
import connectDB from './database/database.js';
import userRoutes from './routes/userRoutes.js';
import blogRoutes from './routes/blogRoutes.js';

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/api/users', userRoutes);
app.use('/api/blogs', blogRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


// npm init -y
// npm pkg set type="module"