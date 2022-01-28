import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  avatar: {
    type: String,
    default: '/images/no-user.jpeg',
  },
}, {
  timestamps: true,
});

UserSchema.pre('save', async function preSave(next) {
  if (!this.isModified('password') || !this.isNew) return next();

  const saltRounds = 10;

  try {
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(this.password, salt);

    this.password = hash;
    return next();

  } catch (error) {
    return next(error);
  }
});

UserSchema.methods.comparePassword = async function comparePassword(password) {
  try {
    const isMatch = await bcrypt.compare(password, this.password);
    return isMatch;
  } catch (error) {
    throw {
      message: 'internal',
      opts: {
        error,
      },
    };
  }
}

export default mongoose.models.User || mongoose.model('User', UserSchema);
