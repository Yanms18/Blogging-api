import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  first_name: { 
    type: String, 
    required: true 
  },
  last_name: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    trim: true
  },
  password: { 
    type: String, 
    required: true 
  },
  blogs: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Blog' 
  }]
}, { timestamps: true });



export default mongoose.model('User', userSchema);
