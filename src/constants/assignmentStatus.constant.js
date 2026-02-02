const AssignmentStatus = {
  ASSIGNED: 'assigned', // Mới giao, sinh viên chưa đụng vào
  IN_PROGRESS: 'in_progress', // Đang làm bài (quan trọng để check nếu rớt mạng vào lại)
  SUBMITTED: 'submitted', // Đã nộp bài thành công
  LATE: 'late', // Nộp muộn (nếu bạn cho phép nộp sau deadline)
  MISSED: 'missed', // Quá hạn mà chưa nộp (tính 0 điểm)
};

// Đóng băng object để không ai sửa được giá trị trong quá trình chạy
Object.freeze(AssignmentStatus);

module.exports = AssignmentStatus;
