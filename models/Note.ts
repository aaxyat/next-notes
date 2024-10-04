import mongoose from 'mongoose';

const NoteSchema = new mongoose.Schema({
  title: String,
  content: String,
  userId: String,
  // Add other fields as needed
}, { timestamps: true });

export default mongoose.models.Note || mongoose.model('Note', NoteSchema);