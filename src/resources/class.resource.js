const UserResource = require('./user.resource');

/**
 * Format cơ bản cho danh sách lớp học (Không bao gồm danh sách sinh viên cụ thể để nhẹ gói tin)
 */
const single = (classRoom) => {
  if (!classRoom) return null;

  const data = classRoom.toObject ? classRoom.toObject() : classRoom;

  return {
    id: data._id,
    classRoomName: data.name,
    schedule: data.schedule,
    studentCount:
      data.students && Array.isArray(data.students)
        ? data.students.length
        : data.studentCount || 0,
    teacherName: data.teacherId?.name || null,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };
};

/**
 * Format chi tiết lớp học (Bao gồm danh sách students)
 */
const detail = (classRoom) => {
  if (!classRoom) return null;

  const basicInfo = single(classRoom);
  const data = classRoom.toObject ? classRoom.toObject() : classRoom;

  return {
    ...basicInfo,
    students: UserResource.collection(data.students || []),
  };
};

/**
 * Format danh sách lớp học
 */
const collection = (classRooms) => {
  if (!classRooms || !Array.isArray(classRooms)) return [];
  return classRooms.map(single);
};

module.exports = { single, detail, collection };
