// models/user.model.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({  
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/.+\@.+\..+/, 'Please fill a valid email address'],
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  }
}, { timestamps: true });

// ✅ Prevent OverwriteModelError
const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
