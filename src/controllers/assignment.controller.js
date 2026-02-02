const assignmentService = require('../services/assignment.service');
const response = require('../helpers/response');

async function createAssignment(req, res) {
  try {
    const a = await assignmentService.createAssignment(req.body);
    return response.success(
      res,
      a,
      'Assignment created and distributed to students',
      201,
    );
  } catch (err) {
    return response.error(res, err.message, err.statusCode || 500);
  }
}

async function listAssignments(req, res) {
  try {
    const { classId } = req.query;
    const filter = {};
    if (classId) filter.classId = classId;

    const list = await assignmentService.listAssignments(filter);
    return response.success(res, list, 'Assignments list', 200);
  } catch (err) {
    return response.error(res, err.message, 500);
  }
}

async function getAssignment(req, res) {
  try {
    const a = await assignmentService.getAssignmentById(req.params.id);
    if (!a) return response.error(res, 'Assignment not found', 404);
    return response.success(res, a, 'Assignment found', 200);
  } catch (err) {
    return response.error(res, err.message, 500);
  }
}

async function updateAssignment(req, res) {
  try {
    const a = await assignmentService.updateAssignment(req.params.id, req.body);
    if (!a) return response.error(res, 'Assignment not found', 404);
    return response.success(res, a, 'Assignment updated', 200);
  } catch (err) {
    return response.error(res, err.message, 500);
  }
}

async function deleteAssignment(req, res) {
  try {
    const a = await assignmentService.deleteAssignment(req.params.id);
    if (!a) return response.error(res, 'Assignment not found', 404);
    return response.success(res, a, 'Assignment deleted', 200);
  } catch (err) {
    return response.error(res, err.message, 500);
  }
}

module.exports = {
  createAssignment,
  listAssignments,
  getAssignment,
  updateAssignment,
  deleteAssignment,
};
