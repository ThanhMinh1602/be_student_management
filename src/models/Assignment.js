const mongoose = require('mongoose');

const AssignmentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    dueDate: { type: Date, required: true },
    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Class',
      required: true,
    },
    setId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Set',
      required: true,
    },
  },
  {
    timestamps: true, // Thêm cái này để có updatedAt tự động
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

module.exports = mongoose.model('Assignment', AssignmentSchema);
