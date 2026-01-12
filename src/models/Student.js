const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    username: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['student', 'admin'], default: 'student' },
    classId: { type: String, default: '' },
    avgScore: { type: Number, default: 0.0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

studentSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

const Student = mongoose.model('Student', studentSchema);
module.exports = Student;
