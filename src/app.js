const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./config/swagger');

const authRoutes = require('./routes/auth.routes');
const setRoutes = require('./routes/set.routes');
const questionRoutes = require('./routes/question.routes');
const debugRoutes = require('./routes/debug.routes');

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));
app.get('/health', (req, res) => res.json({ success: true, message: 'ok' }));

app.use('/api/auth', authRoutes);
app.use('/api/sets', setRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/debug', debugRoutes);

module.exports = app;
