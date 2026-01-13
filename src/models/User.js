const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    // Tên hiển thị (Dùng chung cho fullName của Student và name của Admin/Teacher)
    name: { type: String, required: true, trim: true }, 
    
    // Tên đăng nhập (Thay thế cho email)
    username: { 
      type: String, 
      required: true, 
      unique: true, 
      lowercase: true, 
      trim: true 
    },
    
    password: { type: String, required: true },
    
    role: { 
      type: String, 
      enum: ['student', 'admin', 'teacher'], 
      default: 'student' 
    },
    
    isActive: { type: Boolean, default: true },
    
    // Lưu Refresh Token để thực hiện cơ chế xoay vòng (Rotation)
    refreshToken: { type: String, default: null }, 

    // Thông tin đặc thù cho Student
    classId: { type: String, default: '' }, // Để String để khớp với các API assign/remove
    avgScore: { type: Number, default: 0.0 },
    
    // Thông tin đặc thù cho Teacher
    subject: { type: String, default: '' } 
  },
  { timestamps: true }
);

// Tự động định dạng dữ liệu khi chuyển sang JSON trả về cho Frontend
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  
  // Bảo mật: Xóa mật khẩu và refresh token trước khi gửi đi
  delete obj.password;
  delete obj.refreshToken;
  
  // Đồng bộ hóa ID: Map _id thành id để khớp với Flutter Model
  obj.id = obj._id;
  delete obj._id;
  delete obj.__v;
  
  return obj;
};

const User = mongoose.model('User', userSchema);
module.exports = User;