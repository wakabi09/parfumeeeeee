import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Nama wajib diisi'],
    },
    email: {
      type: String,
      required: [true, 'Email wajib diisi'],
      unique: true,
      match: [/^\S+@\S+\.\S+$/, 'Email tidak valid'],
    },
    password: {
      type: String,
      required: [true, 'Password wajib diisi'],
    },
    role: {
      type: String,
      enum: ['user', 'admin', 'owner'], // ✅ updated
      default: 'user',
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model('User', userSchema);
export default User;
