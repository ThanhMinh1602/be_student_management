# BE Student Management

API backend cho Student Management (Authentication module).

Các công nghệ chính
- Node.js, Express
- MongoDB (Mongoose)
- JWT (jsonwebtoken)
- Bcrypt (password hashing)
- Joi (validation)
- Swagger (OpenAPI) cho documentation

File quan trọng
- `server.js` — entry point, kết nối DB và start app
- `src/app.js` — cấu hình Express (routes, middleware, Swagger)
- `src/routes/auth.routes.js` — routes cho auth
- `src/controllers/auth.controller.js` — controllers
- `src/services/auth.service.js` — business logic
- `src/models/user.model.js` — Mongoose schema
- `src/helpers/validation_schema.js` — Joi schemas
- `src/middlewares/auth.middleware.js` — bảo vệ route bằng JWT

Thiết lập nhanh (local)

1. Cài đặt dependencies
```bash
cd be_student_management
npm install
```

2. Tạo file môi trường
Sao chép file mẫu hoặc tạo `./.env` với các biến sau:
```
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/student_management
JWT_SECRET=change_this_to_a_strong_secret
JWT_EXPIRES_IN=1h
LOG_LEVEL=info
```

3. Chạy server
```bash
npm run dev
```

API endpoints (Auth)
- POST `/api/auth/register` — Đăng ký
  - Body: `{ name, email, password, role? }`
  - Response: `{ success: true, data: user, message: 'User registered' }`
- POST `/api/auth/login` — Đăng nhập
  - Body: `{ email, password }`
  - Response: `{ success: true, data: { token, user }, message: 'Logged in' }`
- GET `/api/auth/me` — Lấy thông tin user hiện tại
  - Header: `Authorization: Bearer <token>`
  - Response: `{ success: true, data: user, message: 'Current user' }`

Format trả về
Tất cả responses tuân thủ:
```json
{ "success": true|false, "data": ..., "message": "..." }
```

Swagger UI
- Sau khi khởi động server, truy cập: `http://localhost:3000/api/docs`

Tests
- Đã cấu hình Jest + Supertest + mongodb-memory-server để chạy test tích hợp.
- Chạy tests bằng:
```bash
npm test
```

Ghi chú bảo mật
- Thay `JWT_SECRET` trong production bằng giá trị mạnh và lưu an toàn.
- Đảm bảo MongoDB production không dùng kết nối mặc định nếu chưa cấu hình bảo mật.

Muốn tôi làm tiếp:
- Thêm CI workflow để chạy tests tự động,
- Mở rộng tài liệu Swagger (models, responses chi tiết),
- Hoàn thiện các endpoint user/role management.
# be_student_management
