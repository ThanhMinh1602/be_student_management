const QuestionModel = require('../models/Question');
const setService = require('./set.service');

async function createQuestion(payload) {
  const q = new QuestionModel(payload);
  await q.save();
  // increment count on set
  await setService.incrementQuestionCount(payload.setId, 1);
  return q;
}

async function getQuestionById(id) {

  return QuestionModel.findById(id).populate('setId');
}

async function updateQuestion(id, payload) {
  return QuestionModel.findByIdAndUpdate(id, payload, { new: true }).populate('setId');;
}

async function deleteQuestion(id) {
  const q = await QuestionModel.findById(id).populate('setId');;
  if (!q) return null;
  await QuestionModel.findByIdAndDelete(id);
  await setService.incrementQuestionCount(q.setId, -1);
  return q;
}

async function listQuestions(filter = {}, options = {}) {
  return QuestionModel.find(filter)
    .sort({ createdAt: -1 })
    .limit(options.limit || 0).populate('setId');;
}

module.exports = {
  createQuestion,
  getQuestionById,
  updateQuestion,
  deleteQuestion,
  listQuestions,
};
