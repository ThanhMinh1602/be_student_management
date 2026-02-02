/**
 * Định dạng một User đơn lẻ
 */
const single = (user) => {
  if (!user) return null;

  const data = user.toObject ? user.toObject() : user;

  return {
    id: data._id,
    fullName: data.name,
    userName: data.username,
    role: data.role,
    status: data.isActive ? true : false,
    avgScore: data.avgScore || 0,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };
};

const collection = (users) => {
  if (!users || !Array.isArray(users)) return [];
  return users.map(single);
};

module.exports = { single, collection };
