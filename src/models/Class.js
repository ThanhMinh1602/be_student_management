const mongoose = require('mongoose');

const classSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    studentCount: { type: Number, default: 0 },
    teacherId: { type: String },
    schedule: { type: String },
    subject: { type: String },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Class', classSchema);
