const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../src/app');
const User = require('../src/models/user.model');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await User.deleteMany({});
});

describe('Auth API', () => {
  test('Health check', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  test('Register -> Login -> Me flow', async () => {
    const payload = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    };

    const reg = await request(app).post('/api/auth/register').send(payload);
    expect(reg.status).toBe(201);
    expect(reg.body.success).toBe(true);
    expect(reg.body.data.email).toBe('test@example.com');

    const login = await request(app)
      .post('/api/auth/login')
      .send({ email: payload.email, password: payload.password });
    expect(login.status).toBe(200);
    expect(login.body.success).toBe(true);
    const { token } = login.body.data;
    expect(token).toBeDefined();

    const me = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`);
    expect(me.status).toBe(200);
    expect(me.body.success).toBe(true);
    expect(me.body.data.email).toBe(payload.email);
  });
});
