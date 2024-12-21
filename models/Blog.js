const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true,
    unique: true,
    trim: true
  },
  description: { 
    type: String 
  },
  author: { 
    type: String,  
    required: true 
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  state: { 
    type: String, 
    enum: ['draft', 'published'], 
    default: 'draft' 
  },
  read_count: { 
    type: Number, 
    default: 0 
  },
  reading_time: { 
    type: Number 
  },
  tags: [{ 
    type: String 
  }],
  body: { 
    type: String, 
    required: true 
  }
}, { timestamps: true });

module.exports = mongoose.model('Blog', blogSchema);