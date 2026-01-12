const SetModel = require('../models/Set');
const QuestionModel = require('../models/Question');

async function createSet({ name }) {
  const set = new SetModel({ name, questionCount: 0 });
  await set.save();
  return set;
}

async function getAllSets() {
  return SetModel.find().sort({ createdAt: -1 });
}

async function getSetById(id) {
  return SetModel.findById(id);
}

async function updateSet(id, payload) {
  return SetModel.findByIdAndUpdate(id, payload, { new: true });
}

async function deleteSet(id) {
  // Delete questions belonging to set and the set itself
  await QuestionModel.deleteMany({ setId: id });
  return SetModel.findByIdAndDelete(id);
}

async function incrementQuestionCount(setId, delta = 1) {
  return SetModel.findByIdAndUpdate(
    setId,
    { $inc: { questionCount: delta } },
    { new: true }
  );
}

module.exports = {
  createSet,
  getAllSets,
  getSetById,
  updateSet,
  deleteSet,
  incrementQuestionCount,
};
