const studentService = require('../services/student.service');
const response = require('../helpers/response');

async function list(req, res) {
  try {
    const { classId, page, limit } = req.query;
    const result = await studentService.listStudents({ classId, page, limit });
    // result: { items, total } — response helper will attach total
    return response.success(res, result, 'Students list', 200);
  } catch (err) {
    return response.error(res, err.message || err, err.status || 500);
  }
}

async function add(req, res) {
  try {
    const { fullName, username, role, password } = req.body;
    const s = await studentService.addStudent({ fullName, username, role, password });
    return response.success(res, s, 'Student created', 201);
  } catch (err) {
    return response.error(res, err.message || err, err.status || 500);
  }
}

async function assign(req, res) {
  try {
    const { id } = req.params;
    const { classId } = req.body;
    const updated = await studentService.assignStudentToClass(id, classId);
    if (!updated) return response.error(res, 'Student not found', 404);
    return response.success(res, updated, 'Assigned to class', 200);
  } catch (err) {
    return response.error(res, err.message || err, err.status || 500);
  }
}

async function removeFromClass(req, res) {
  try {
    const { id } = req.params;
    const updated = await studentService.removeStudentFromClass(id);
    if (!updated) return response.error(res, 'Student not found', 404);
    return response.success(res, updated, 'Removed from class', 200);
  } catch (err) {
    return response.error(res, err.message || err, err.status || 500);
  }
}

async function toggleStatus(req, res) {
  try {
    const { id } = req.params;
    const updated = await studentService.toggleStatus(id);
    if (!updated) return response.error(res, 'Student not found', 404);
    return response.success(res, updated, 'Toggled status', 200);
  } catch (err) {
    return response.error(res, err.message || err, err.status || 500);
  }
}

async function resetPassword(req, res) {
  try {
    const { id } = req.params;
    const updated = await studentService.resetPassword(id);
    if (!updated) return response.error(res, 'Student not found', 404);
    return response.success(res, updated, 'Password reset', 200);
  } catch (err) {
    return response.error(res, err.message || err, err.status || 500);
  }
}

async function remove(req, res) {
  try {
    const { id } = req.params;
    const removed = await studentService.deleteStudent(id);
    if (!removed) return response.error(res, 'Student not found', 404);
    return response.success(res, removed, 'Student deleted', 200);
  } catch (err) {
    return response.error(res, err.message || err, err.status || 500);
  }
}

module.exports = {
  list,
  add,
  assign,
  removeFromClass,
  toggleStatus,
  resetPassword,
  remove,
};
