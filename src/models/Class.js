const mongoose = require('mongoose');

const classSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    studentCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const ClassModel = mongoose.model('Class', classSchema);
module.exports = ClassModel;
