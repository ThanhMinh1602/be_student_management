const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SetSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    questionCount: { type: Number, default: 0 },
    // Xóa createdAt ở đây đi
  },
  {
    timestamps: true, // Thêm cái này để có updatedAt tự động
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

module.exports = mongoose.model('Set', SetSchema);
