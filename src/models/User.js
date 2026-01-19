const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ['student', 'admin', 'teacher'],
      default: 'student',
    },
    isActive: { type: Boolean, default: true },
    refreshToken: { type: String, default: null },
    classId: { type: String, default: '' },
    avgScore: { type: Number, default: 0.0 },
    subject: { type: String, default: '' },
  },
  { timestamps: true },
);

// Giữ nguyên logic này của bạn
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.refreshToken;
  obj.id = obj._id;
  delete obj._id;
  delete obj.__v;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
