const questionResource = require('./question.resource');

/**
 * Format cơ bản (Dùng cho danh sách hoặc khi không cần chi tiết câu hỏi)
 */
const single = (set) => {
  if (!set) return null;
  const data = set.toObject ? set.toObject() : set;

  return {
    id: data._id,
    setName: data.name,
    questionCount: data.questionCount,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };
};

/**
 * Format chi tiết (Bao gồm cả danh sách câu hỏi)
 */
const detail = (set, questions = []) => {
  if (!set) return null;

  const basicInfo = single(set);

  return {
    ...basicInfo,
    questions: questionResource.collection(questions),
  };
};

/**
 * Format danh sách Set
 */
const collection = (sets) => {
  if (!sets || !Array.isArray(sets)) return [];
  return sets.map(single);
};

module.exports = { single, detail, collection };
