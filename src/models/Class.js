const mongoose = require('mongoose');

const classSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    studentCount: { type: Number, default: 0 },
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    schedule: { type: String },
    subject: { type: String },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Class', classSchema);
