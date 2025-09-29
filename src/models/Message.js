import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  from: { type: Number, required: true }, // user.id
  to: { type: Number, required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.model('Message', messageSchema);
