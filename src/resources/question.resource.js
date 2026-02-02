/**
 * Định dạng một câu hỏi đơn lẻ
 */
const single = (q) => {
  if (!q) return null;

  // Xử lý an toàn nếu q là Mongoose Document
  const data = q.toObject ? q.toObject() : q;

  return {
    id: data._id, // Chuyển _id -> id
    setId: data.setId,
    type: data.type,
    content: data.content,
    timeLimit: data.timeLimit,
    isRandom: data.isRandom,
    options: data.options || [],
    answers: data.answers || [],
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };
};

/**
 * Định dạng một danh sách câu hỏi
 */
const collection = (questions) => {
  if (!questions || !Array.isArray(questions)) return [];
  return questions.map(single);
};

module.exports = { single, collection };
