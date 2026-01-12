const Student = require('../models/Student');

async function listStudents(filter = {}) {
  const query = {};
  if (filter.classId) query.classId = filter.classId;
  if (filter.role) query.role = filter.role;

  // Pagination support
  const page = Math.max(parseInt(filter.page, 10) || 1, 1);
  const limit = Math.max(parseInt(filter.limit, 10) || 20, 1);
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    Student.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Student.countDocuments(query),
  ]);

  return { items, total };
}

async function getStudentsByClass(classId) {
  return Student.find({ classId, role: 'student' });
}

async function countByClass(classId) {
  return Student.countDocuments({ classId, role: 'student' });
}

async function assignStudentToClass(studentId, classId) {
  return Student.findByIdAndUpdate(studentId, { classId }, { new: true });
}

async function removeStudentFromClass(studentId) {
  return Student.findByIdAndUpdate(studentId, { classId: '' }, { new: true });
}

async function addStudent({ fullName, username, role = 'student', password = '123456' }) {
  const exists = await Student.findOne({ username });
  if (exists) throw { status: 400, message: 'Username already exists' };
  const s = new Student({ fullName, username, role, password });
  return s.save();
}

async function toggleStatus(id) {
  const stu = await Student.findById(id);
  if (!stu) return null;
  stu.isActive = !stu.isActive;
  return stu.save();
}

async function resetPassword(id) {
  const stu = await Student.findById(id);
  if (!stu) return null;
  stu.password = '123456';
  return stu.save();
}

async function deleteStudent(id) {
  return Student.findByIdAndDelete(id);
}

module.exports = {
  listStudents,
  getStudentsByClass,
  countByClass,
  assignStudentToClass,
  removeStudentFromClass,
  addStudent,
  toggleStatus,
  resetPassword,
  deleteStudent,
};
