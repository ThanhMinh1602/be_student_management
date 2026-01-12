const questionService = require('../services/question.service');
const {
  questionCreateSchema,
  questionUpdateSchema,
} = require('../helpers/validation_schema');

async function createQuestion(req, res) {
  try {
    const payload = req.body;
    // basic validation
    const required = ['setId', 'type', 'content', 'answers'];
    for (const f of required) {
      if (payload[f] === undefined)
        return res
          .status(400)
          .json({ success: false, message: `${f} is required` });
    }

    const { error, value } = questionCreateSchema.validate(req.body);
    if (error)
      return res.status(400).json({ success: false, message: error.message });

    const q = await questionService.createQuestion(value);
    return res
      .status(201)
      .json({ success: true, data: q, message: 'Question created' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

async function listQuestions(req, res) {
  try {
    const { setId } = req.query;
    const filter = {};
    if (setId) filter.setId = setId;
    const list = await questionService.listQuestions(filter);
    return res.json({ success: true, data: list, message: 'Questions' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

async function getQuestion(req, res) {
  try {
    const { id } = req.params;
    const q = await questionService.getQuestionById(id);
    if (!q)
      return res
        .status(404)
        .json({ success: false, message: 'Question not found' });
    return res.json({ success: true, data: q, message: 'Question' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

async function updateQuestion(req, res) {
  try {
    const { id } = req.params;
    const { error, value } = questionUpdateSchema.validate(req.body);
    if (error)
      return res.status(400).json({ success: false, message: error.message });
    const q = await questionService.updateQuestion(id, value);
    if (!q)
      return res
        .status(404)
        .json({ success: false, message: 'Question not found' });
    return res.json({ success: true, data: q, message: 'Question updated' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

async function deleteQuestion(req, res) {
  try {
    const { id } = req.params;
    const q = await questionService.deleteQuestion(id);
    if (!q)
      return res
        .status(404)
        .json({ success: false, message: 'Question not found' });
    return res.json({ success: true, data: q, message: 'Question deleted' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

module.exports = {
  createQuestion,
  listQuestions,
  getQuestion,
  updateQuestion,
  deleteQuestion,
};
