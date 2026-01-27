const classService = require('../services/class.service');
const response = require('../helpers/response');

async function list(req, res) {
  try {
    const { page, limit } = req.query;
    const result = await classService.listClasses({ page, limit });
    return response.success(res, result, 'Classes list', 200);
  } catch (err) {
    return response.error(res, err.message || err, err.status || 500);
  }
}

async function get(req, res) {
  try {
    const { id } = req.params;
    const c = await classService.getClassById(id);
    if (!c) return response.error(res, 'Class not found', 404);
    return response.success(res, c, 'Class found', 200);
  } catch (err) {
    return response.error(res, err.message || err, err.status || 500);
  }
}

async function add(req, res) {
  try {
    const { name } = req.body;
    const c = await classService.createClass({ name });
    return response.success(res, c, 'Class created', 201);
  } catch (err) {
    return response.error(res, err.message || err, err.status || 500);
  }
}

async function update(req, res) {
  try {
    const { id } = req.params;
    const updated = await classService.updateClass(id, req.body);
    if (!updated) return response.error(res, 'Class not found', 404);
    return response.success(res, updated, 'Class updated', 200);
  } catch (err) {
    return response.error(res, err.message || err, err.status || 500);
  }
}

async function remove(req, res) {
  try {
    const { id } = req.params;
    const removed = await classService.deleteClass(id);
    if (!removed) return response.error(res, 'Class not found', 404);
    return response.success(res, removed, 'Class deleted', 200);
  } catch (err) {
    return response.error(res, err.message || err, err.status || 500);
  }
}

async function addStudentToClass(req, res) {
  try {
    const { id } = req.params;
    const { studentId } = req.body;

    const student = await classService.addStudentToClass(id, studentId);

    // Nếu thành công
    return response.success(res, student, 'Student added to class', 200);
  } catch (err) {
    // Trả về đúng message "Học sinh này đã có trong lớp học" và mã 400
    return response.error(res, err.message || err, err.status || 500);
  }
}

async function removeStudent(req, res) {
  try {
    const { id } = req.params; // Class ID
    const { studentId } = req.body;

    const result = await classService.removeStudentFromClass(id, studentId);

    return response.success(res, result, 'Đã xóa học sinh khỏi lớp', 200);
  } catch (err) {
    return response.error(res, err.message || err, err.status || 500);
  }
}
module.exports = { list, get, add, update, remove, addStudentToClass, removeStudent };
