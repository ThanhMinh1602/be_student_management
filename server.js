require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./src/app');

// defined once
const MONGO_URI =
  process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/student_management';
const PORT = process.env.PORT || 3000;

// Connect to Database
mongoose
  .connect(MONGO_URI) // Options like useNewUrlParser are defaults in Mongoose 6+
  .then(() => {
    console.log('✅ Connected to MongoDB');

    // Only start the server if the database connects successfully
    app.listen(PORT, () => {
      console.log(`🚀 Server listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Mongo connection error:', err);
    process.exit(1); // Exit process with failure
  });
