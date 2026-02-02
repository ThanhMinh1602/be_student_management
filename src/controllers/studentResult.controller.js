const studentResultService = require('../services/studentResult.service');
const response = require('../helpers/response');

async function submitAssignment(req, res) {
  try {
    const { assignmentId, answers } = req.body;
    const studentId = req.user.id; // Assuming auth middleware sets req.user

    const result = await studentResultService.submitAssignment(
      assignmentId,
      studentId,
      answers,
    );
    return response.success(
      res,
      result,
      'Assignment submitted successfully',
      200,
    );
  } catch (err) {
    return response.error(res, err.message, err.statusCode || 500);
  }
}

async function getStudentResults(req, res) {
  try {
    const { studentId } = req.query;
    const filter = {};
    if (studentId) filter.studentId = studentId;

    const results = await studentResultService.getStudentResults(filter);
    return response.success(res, results, 'Student results retrieved', 200);
  } catch (err) {
    return response.error(res, err.message, 500);
  }
}

async function getAssignmentResults(req, res) {
  try {
    const { assignmentId } = req.params;
    const results =
      await studentResultService.getAssignmentResults(assignmentId);
    return response.success(res, results, 'Assignment results retrieved', 200);
  } catch (err) {
    return response.error(res, err.message, 500);
  }
}

async function getStudentAssignmentResult(req, res) {
  try {
    const { assignmentId } = req.params;
    const studentId = req.user.id;

    const result = await studentResultService.getStudentAssignmentResult(
      assignmentId,
      studentId,
    );
    if (!result) return response.error(res, 'Result not found', 404);
    return response.success(
      res,
      result,
      'Student assignment result retrieved',
      200,
    );
  } catch (err) {
    return response.error(res, err.message, 500);
  }
}

module.exports = {
  submitAssignment,
  getStudentResults,
  getAssignmentResults,
  getStudentAssignmentResult,
};
