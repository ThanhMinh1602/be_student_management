/**
 * Format một Assignment đơn lẻ
 */
const single = (assignment) => {
    if (!assignment) return null;


    const data = assignment.toObject ? assignment.toObject() : assignment;

    return {
        id: data._id,
        assignmentName: data.title,
        className: data.classId?.name || 'Lớp không xác định',
        setName: data.setId?.name || data.setId?.title || 'Bộ đề không xác định',
        deadline: data.dueDate,
        description: data.description,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
    };
};

/**
 * Format danh sách Assignment
 */
const collection = (assignments) => {
    if (!assignments || !Array.isArray(assignments)) return [];
    return assignments.map(single);
};

module.exports = { single, collection };