const bcrypt = require('bcryptjs');
const User = require('../models/User');
const UserResource = require('../resources/user.resource');

async function listUser(filter = {}) {
  const query = {};
  if (filter.classId) query.classId = filter.classId;
  if (filter.role) query.role = filter.role;
  // Tìm kiếm theo tên hoặc username (nếu cần)
  if (filter.keyword) {
    query.$or = [
      { name: { $regex: filter.keyword, $options: 'i' } },
      { username: { $regex: filter.keyword, $options: 'i' } },
    ];
  }

  // Pagination support
  const page = Math.max(parseInt(filter.page, 10) || 1, 1);
  const limit = Math.max(parseInt(filter.limit, 10) || 20, 1);
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    User.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(), // Tối ưu hiệu năng: trả về JSON thuần
    User.countDocuments(query),
  ]);

  return {
    total,
    items: UserResource.collection(items),
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

async function getUserByClass(classId) {
  if (!classId) return { total: 0, items: [] };
  const users = await User.find({ classId, role: 'User' }).lean();
  const items = UserResource.collection(users);

  return { total: items.length, items };
}

async function countByClass(classId) {
  return User.countDocuments({ classId, role: 'User' });
}
async function addStudent({ name, username, role, password = '123456' }) {
  // 1. Kiểm tra tồn tại
  const exists = await User.findOne({ username });
  if (exists) {
    const err = new Error('Username already exists');
    err.status = 400; // Bad Request
    throw err;
  }

  // 2. Hash mật khẩu
  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(password, salt);

  // 3. Tạo User
  const newUser = new User({
    name,
    username,
    role: role || 'student',
    password: hashed,
    isActive: true, // Mặc định kích hoạt
    avgScore: 0,
  });

  await newUser.save();
  return UserResource.single(newUser);
}

async function toggleStatus(id) {
  const user = await User.findById(id);
  if (!user) return null;

  // Đảo ngược trạng thái hiện tại
  user.isActive = !user.isActive;
  await user.save();

  return UserResource.single(user);
}

async function resetPassword(id) {
  const user = await User.findById(id);
  if (!user) return null;

  // QUAN TRỌNG: Phải hash mật khẩu mới
  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash('123456', salt);

  user.password = hashed;
  await user.save();

  return UserResource.single(user);
}

async function deleteStudent(id) {
  const deletedUser = await User.findByIdAndDelete(id);
  // Nên trả về thông tin user đã xóa để FE cập nhật UI nếu cần
  return UserResource.single(deletedUser);
}

async function updateUser(id, updateData) {
  // 1. Kiểm tra user tồn tại
  const user = await User.findById(id);
  if (!user) {
    const err = new Error('User not found');
    err.status = 404;
    throw err;
  }

  // 2. Kiểm tra trùng Username (nếu có đổi)
  if (updateData.username && updateData.username !== user.username) {
    const exists = await User.findOne({ username: updateData.username });
    if (exists) {
      const err = new Error('Username already exists');
      err.status = 400;
      throw err;
    }
  }

  // 3. Nếu có đổi password -> Hash lại
  if (updateData.password) {
    const salt = await bcrypt.genSalt(10);
    updateData.password = await bcrypt.hash(updateData.password, salt);
  }

  // 4. Update
  const updatedUser = await User.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });

  return UserResource.single(updatedUser);
}

module.exports = {
  listUser,
  getUserByClass,
  countByClass,
  addStudent,
  toggleStatus,
  resetPassword,
  deleteStudent,
  updateUser,
};
