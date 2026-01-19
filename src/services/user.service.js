const bcrypt = require('bcryptjs');
const User = require('../models/User');

async function listuser(filter = {}) {
  const query = {};
  if (filter.classId) query.classId = filter.classId;
  if (filter.role) query.role = filter.role;

  // Pagination support
  const page = Math.max(parseInt(filter.page, 10) || 1, 1);
  const limit = Math.max(parseInt(filter.limit, 10) || 20, 1);
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    User.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
    User.countDocuments(query),
  ]);

  return { items, total };
}

async function getuserByClass(classId) {
  return User.find({ classId, role: 'User' });
}

async function countByClass(classId) {
  return User.countDocuments({ classId, role: 'User' });
}

async function assignStudentToClass(studentId, classId) {
  return User.findByIdAndUpdate(studentId, { classId }, { new: true });
}

async function removeStudentFromClass(studentId) {
  return User.findByIdAndUpdate(studentId, { classId: '' }, { new: true });
}

async function addStudent({ name, username, role, password = '123456' }) {
  const exists = await User.findOne({ username });
  if (exists) {
    const err = new Error(MessageCodes.AUTH.EMAIL_EXISTS); // Dùng chung mã lỗi tồn tại
    err.status = 400;
    throw err;
  }

  // Hash mật khẩu tương tự như authService
  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(password, salt);

  const s = new User({
    name,
    username,
    role,
    password: hashed
  });
  return s.save();
}

async function toggleStatus(id) {
  const stu = await User.findById(id);
  if (!stu) return null;
  stu.isActive = !stu.isActive;
  return stu.save();
}

async function resetPassword(id) {
  const stu = await User.findById(id);
  if (!stu) return null;
  stu.password = '123456';
  return stu.save();
}

async function deleteStudent(id) {
  return User.findByIdAndDelete(id);
}
async function updateUser(id, updateData) {
  // 1. Kiểm tra user có tồn tại không
  const user = await User.findById(id);
  if (!user) {
    const err = new Error('User not found');
    err.status = 404;
    throw err;
  }

  // 2. Kiểm tra trùng Username (Nếu có gửi lên username mới)
  if (updateData.username && updateData.username !== user.username) {
    const exists = await User.findOne({ username: updateData.username });
    if (exists) {
      const err = new Error('Username already exists'); // Hoặc MessageCodes.AUTH.EMAIL_EXISTS
      err.status = 400;
      throw err;
    }
  }

  // 3. Nếu có gửi password mới -> Hash mật khẩu
  if (updateData.password) {
    const salt = await bcrypt.genSalt(10);
    updateData.password = await bcrypt.hash(updateData.password, salt);
  }

  // 4. Thực hiện update
  // { new: true } để trả về data mới nhất sau khi update
  // { runValidators: true } để đảm bảo dữ liệu tuân thủ Schema (ví dụ enum role)
  return User.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
}
module.exports = {
  listuser,
  getuserByClass,
  countByClass,
  assignStudentToClass,
  removeStudentFromClass,
  addStudent,
  toggleStatus,
  resetPassword,
  deleteStudent,
  updateUser,
};
