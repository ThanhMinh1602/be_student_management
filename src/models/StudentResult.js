const mongoose = require('mongoose');

const StudentResultSchema = new mongoose.Schema(
  {
    // Tham chiếu đến lượt giao bài (Master)
    assignmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Assignment',
      required: true,
    },
    // Tham chiếu đến sinh viên
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Hoặc 'Student' tùy theo Model của bạn
      required: true,
    },
    // Trạng thái bài làm
    status: {
      type: String,
      enum: ['assigned', 'started', 'submitted', 'missed'],
      default: 'assigned',
    },
    // Lưu vết câu trả lời
    answers: [
      {
        questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
        selectedOption: { type: String }, // Đáp án sinh viên chọn
        isCorrect: { type: Boolean }, // Lưu lại để thống kê nhanh không cần tính toán lại
        timeTaken: { type: Number }, // Thời gian làm câu này (giây) - rất hữu ích cho Blooket
      },
    ],
    // Kết quả tổng quát
    score: { type: Number, default: 0 },
    totalCorrect: { type: Number, default: 0 },

    // Thời gian thực tế
    startedAt: { type: Date }, // Lúc sinh viên bắt đầu bấm làm bài
    submittedAt: { type: Date }, // Lúc sinh viên bấm nộp bài
  },
  {
    timestamps: true,
  },
);

// Đánh Index để truy vấn danh sách bài tập của 1 sinh viên cực nhanh
StudentResultSchema.index({ studentId: 1, status: 1 });
// Đánh Index để giáo viên xem kết quả của 1 bài tập nhanh
StudentResultSchema.index({ assignmentId: 1 });

module.exports = mongoose.model('StudentResult', StudentResultSchema);
