import express from 'express';
import dotenv from 'dotenv';
import connectDB from './database/db.js';
import userRoutes from './routes/userRoutes.js';
import blogRoutes from './routes/blogRoutes.js';
import authRoutes from './routes/authentication.js'; // Import authentication routes

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/api/users', userRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/auth', authRoutes); // Register authentication routes

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


// npm init -y
// npm pkg set type="module"