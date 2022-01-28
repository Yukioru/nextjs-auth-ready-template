import mongoose from 'mongoose';
import { getDefaultExpireTime } from '@/lib/config';

const SessionSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true,
  },
  userId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  expiredAt: {
    type: Date,
    expires: (getDefaultExpireTime().getTime() - (new Date().getTime())),
  }
}, {
  timestamps: true,
});

export default mongoose.models.Session || mongoose.model('Session', SessionSchema);
