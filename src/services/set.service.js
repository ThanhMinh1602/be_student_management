const SetModel = require('../models/Set');
const QuestionModel = require('../models/Question');
const SetResource = require('../resources/set.resource');

async function createSet({ name }) {
  const set = new SetModel({ name, questionCount: 0 });
  await set.save();
  return SetResource.single(set);
}

async function getAllSets() {
  const sets = await SetModel.find().sort({ createdAt: -1 }).lean();

  return sets.map((set) => SetResource.single(set));
}

async function getSetById(id) {
  const set = await SetModel.findById(id).lean();
  if (!set) return null;

  const questions = await QuestionModel.find({ setId: id })
    .sort({ createdAt: 1 })
    .lean();

  return SetResource.detail(set, questions);
}

async function updateSet(id, payload) {
  const set = await SetModel.findByIdAndUpdate(id, payload, {
    new: true,
  }).lean();
  if (!set) return null;

  return SetResource.single(set);
}

async function deleteSet(id) {
  await QuestionModel.deleteMany({ setId: id });
  const set = await SetModel.findByIdAndDelete(id);
  return set ? SetResource.single(set) : null;
}

async function incrementQuestionCount(setId, delta = 1) {
  return SetModel.findByIdAndUpdate(
    setId,
    { $inc: { questionCount: delta } },
    { new: true },
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
