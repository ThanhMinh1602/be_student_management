const UserRole = {
  STUDENT: 'student', // Sinh viên
  TEACHER: 'teacher', // Giáo viên
  ADMIN: 'admin', // Quản trị viên
};

// Đóng băng object để không ai sửa được giá trị trong quá trình chạy
Object.freeze(UserRole);

module.exports = UserRole;
