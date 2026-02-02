const ClassModel = require('../models/Class');
const UserModel = require('../models/User');
const ClassResource = require('../resources/class.resource');

async function listClasses(filter = {}) {
  const query = {};

  const page = Math.max(parseInt(filter.page, 10) || 1, 1);
  const limit = Math.max(parseInt(filter.limit, 10) || 20, 1);
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    ClassModel.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('students'),
    ClassModel.countDocuments(query).populate('students'),
  ]);
  const classes = ClassResource.collection(items);
  return {
    items: classes,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

async function getClassById(id) {
  const c = await ClassModel.findById(id).populate('students');
  return ClassResource.detail(c);
}

async function createClass(data) {
  const c = new ClassModel(data);
  const savedClass = await c.save();
  return ClassResource.single(savedClass);
}

async function updateClass(id, data) {
  const updatedClass = await ClassModel.findByIdAndUpdate(id, data, {
    new: true,
  });
  return ClassResource.single(updatedClass);
}

async function deleteClass(id) {
  return ClassResource.single(await ClassModel.findByIdAndDelete(id));
}
// mới check tới đây -> đang sai
async function addStudentToClass(classId, studentId) {
  const c = await ClassModel.findById(classId);
  if (!c) {
    const error = new Error('Class not found');
    error.status = 404;
    throw error;
  }

  const isExisted = c.students.includes(studentId);
  if (isExisted) {
    const error = new Error('Học sinh này đã có trong lớp học');
    error.status = 400;
    throw error;
  }

  c.students.push(studentId);
  await c.save();

  const studentInfo = await UserModel.findById(studentId);
  if (!studentInfo) {
    const error = new Error('Student not found');
    error.status = 404;
    throw error;
  }

  return ClassResource.single(studentInfo);
}

async function removeStudentFromClass(classId, studentId) {
  const c = await ClassModel.findById(classId);
  if (!c) {
    const error = new Error('Không tìm thấy lớp học');
    error.status = 404;
    throw error;
  }

  const isExisted = c.students.includes(studentId);
  if (!isExisted) {
    const error = new Error('Học sinh này không có trong lớp học này');
    error.status = 400;
    throw error;
  }

  c.students.pull(studentId);
  await c.save();

  return { studentId, classId };
}
module.exports = {
  listClasses,
  getClassById,
  createClass,
  updateClass,
  deleteClass,
  addStudentToClass,
  removeStudentFromClass,
};
