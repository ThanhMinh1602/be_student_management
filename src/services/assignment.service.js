const AssignmentModel = require('../models/Assignment');
const ClassModel = require('../models/Class');
const StudentResultModel = require('../models/StudentResult');
const AssignmentResource = require('../resources/assignment.resource');

async function createAssignment(payload) {
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

  const assignment = await a.populate(['classId', 'setId']);
  console.log('Created assignment:', assignment);
  return AssignmentResource.single(assignment);
}

async function getAssignmentById(id) {
  const assignment = await AssignmentModel.findById(id).populate(['classId', 'setId']);
  return AssignmentResource.single(assignment);
}

async function updateAssignment(id, payload) {
  const assignment = await AssignmentModel.findByIdAndUpdate(id, payload, { new: true }).populate(
    ['classId', 'setId'],
  );
  return AssignmentResource.single(assignment);
}

async function deleteAssignment(id) {
  const a = await AssignmentModel.findByIdAndDelete(id);
  if (a) {
    await StudentResultModel.deleteMany({ assignmentId: id });
  }
  return AssignmentResource.single(a);
}

async function listAssignments(filter = {}, options = {}) {
  const assignments = await AssignmentModel.find(filter)
    .sort({ createdAt: -1 })
    .limit(options.limit || 0)
    .populate(['classId', 'setId']);

  return AssignmentResource.collection(assignments);
}
module.exports = {
  createAssignment,
  getAssignmentById,
  updateAssignment,
  deleteAssignment,
  listAssignments,
};
