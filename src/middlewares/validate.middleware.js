// src/middlewares/validate.middleware.js
const validate = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ 
      success: false, 
      message: error.details[0].message // Lấy message lỗi chi tiết đầu tiên
    });
  }
  // Gán lại value đã được Joi xử lý (ép kiểu, trim...) vào body
  req.body = value; 
  next();
};

module.exports = validate;