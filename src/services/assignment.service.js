const AssignmentModel = require('../models/Assignment');
const ClassModel = require('../models/Class');
const StudentResultModel = require('../models/StudentResult');

async function createAsssignment(payload) {
  // 1. Kiểm tra trùng lặp (tránh giao 1 bộ đề cho 1 lớp nhiều lần cùng lúc)
  const existing = await AssignmentModel.findOne({
    setId: payload.setId,
    classId: payload.classId,
  });

  if (existing) {
    const error = new Error('Bộ câu hỏi này đã được giao cho lớp này rồi.');
    error.statusCode = 400;
    throw error;
  }

  // 2. Kiểm tra lớp học
  const targetClass = await ClassModel.findById(payload.classId);
  if (!targetClass) {
    const error = new Error('Lớp học không tồn tại');
    error.statusCode = 404;
    throw error;
  }

  // 3. Lưu Assignment Master
  const a = new AssignmentModel(payload);
  await a.save();

  // 4. Tự động tạo bản ghi StudentResult cho tất cả sinh viên trong lớp
  if (targetClass.students && targetClass.students.length > 0) {
    const studentResults = targetClass.students.map((studentId) => ({
      assignmentId: a._id,
      studentId: studentId,
      status: 'assigned',
    }));
    // Dùng insertMany để tối ưu hiệu năng
    await StudentResultModel.insertMany(studentResults);
  }

  return a.populate(['classId', 'setId']);
}

async function getAssignmentById(id) {
  return AssignmentModel.findById(id).populate(['classId', 'setId']);
}

async function updateAssignment(id, payload) {
  return AssignmentModel.findByIdAndUpdate(id, payload, { new: true }).populate(
    ['classId', 'setId'],
  );
}

async function deleteAssignment(id) {
  const a = await AssignmentModel.findByIdAndDelete(id);
  if (a) {
    // Xóa tất cả các bài làm liên quan khi xóa bài tập gốc (Cascade delete)
    await StudentResultModel.deleteMany({ assignmentId: id });
  }
  return a;
}

async function listAssignments(filter = {}, options = {}) {
  return AssignmentModel.find(filter)
    .sort({ createdAt: -1 })
    .limit(options.limit || 0)
    .populate(['classId', 'setId']);
}

module.exports = {
  createAsssignment,
  getAssignmentById,
  updateAssignment,
  deleteAssignment,
  listAssignments,
};
