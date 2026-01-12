const questionService = require('../services/question.service');
const response = require('../helpers/response');

async function createQuestion(req, res) {
  try {
    // req.body đã được validate ở middleware
    const q = await questionService.createQuestion(req.body);
    return response.success(res, q, 'Question created', 201);
  } catch (err) {
    return response.error(res, err.message, 500);
  }
}

async function listQuestions(req, res) {
  try {
    const { setId } = req.query;
    const filter = {};
    if (setId) filter.setId = setId;

    const list = await questionService.listQuestions(filter);
    return response.success(res, list, 'Questions list', 200);
  } catch (err) {
    return response.error(res, err.message, 500);
  }
}

async function getQuestion(req, res) {
  try {
    const { id } = req.params;
    const q = await questionService.getQuestionById(id);
    if (!q) return response.error(res, 'Question not found', 404);

    return response.success(res, q, 'Question found', 200);
  } catch (err) {
    return response.error(res, err.message, 500);
  }
}

async function updateQuestion(req, res) {
  try {
    const { id } = req.params;
    const q = await questionService.updateQuestion(id, req.body);
    if (!q) return response.error(res, 'Question not found', 404);

    return response.success(res, q, 'Question updated', 200);
  } catch (err) {
    return response.error(res, err.message, 500);
  }
}

async function deleteQuestion(req, res) {
  try {
    const { id } = req.params;
    const q = await questionService.deleteQuestion(id);
    if (!q) return response.error(res, 'Question not found', 404);

    return response.success(res, q, 'Question deleted', 200);
  } catch (err) {
    return response.error(res, err.message, 500);
  }
}

module.exports = {
  createQuestion,
  listQuestions,
  getQuestion,
  updateQuestion,
  deleteQuestion,
};