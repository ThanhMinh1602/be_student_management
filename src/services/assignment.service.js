const AssignmentModel = require('../models/Assignment');
const ClassModel = require('../models/Class');
const StudentResultModel = require('../models/StudentResult');

async function createAsssignment(payload) {
  const existing = await AssignmentModel.findOne({
    setId: payload.setId,
    classId: payload.classId,
  });

  if (existing) {
    const error = new Error('Bộ câu hỏi này đã được giao cho lớp này rồi.');
    error.statusCode = 400;
    throw error;
  }

  const targetClass = await ClassModel.findById(payload.classId);
  if (!targetClass) {
    const error = new Error('Lớp học không tồn tại');
    error.statusCode = 404;
    throw error;
  }

  const a = new AssignmentModel(payload);
  await a.save();

  if (targetClass.students && targetClass.students.length > 0) {
    const studentResults = targetClass.students.map((studentId) => ({
      assignmentId: a._id,
      studentId: studentId,
      status: 'assigned',
    }));

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
    await StudentResultModel.deleteMany({ assignmentId: id });
  }
  return a;
}
async function listAssignments(filter = {}, options = {}) {
  const assignments = await AssignmentModel.find(filter)
    .sort({ createdAt: -1 })
    .limit(options.limit || 0)
    .select('title dueDate classId setId')
    .populate({ path: 'classId', select: 'name' })
    .populate({ path: 'setId', select: 'title' })
    .lean();

  return assignments.map((item) => ({
    id: item._id,
    questionName: item.title,
    className: item.classId?.name || 'Không xác định',
    setName: item.setId?.title || 'Không xác định',
    deadline: item.dueDate,
  }));
}
module.exports = {
  createAsssignment,
  getAssignmentById,
  updateAssignment,
  deleteAssignment,
  listAssignments,
};
