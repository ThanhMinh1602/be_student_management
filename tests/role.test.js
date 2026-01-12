const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../src/app');

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

describe('Role-based access control', () => {
  let teacherToken;
  let studentToken;
  let createdSetId;

  test('register and login teacher & student', async () => {
    const t = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'T',
        email: 't@example.com',
        password: 'pass',
        role: 'teacher',
      });
    expect(t.status).toBe(201);
    const lt = await request(app)
      .post('/api/auth/login')
      .send({ email: 't@example.com', password: 'pass' });
    expect(lt.status).toBe(200);
    teacherToken = lt.body.data.token;

    const s = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'S',
        email: 's@example.com',
        password: 'pass',
        role: 'student',
      });
    expect(s.status).toBe(201);
    const ls = await request(app)
      .post('/api/auth/login')
      .send({ email: 's@example.com', password: 'pass' });
    expect(ls.status).toBe(200);
    studentToken = ls.body.data.token;
  });

  test('teacher can create set; student cannot', async () => {
    const res = await request(app)
      .post('/api/sets')
      .set('Authorization', `Bearer ${teacherToken}`)
      .send({ name: 'Set A' });
    expect(res.status).toBe(201);
    createdSetId = res.body.data._id || res.body.data.id || res.body.data.id;

    const res2 = await request(app)
      .post('/api/sets')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({ name: 'Set B' });
    expect(res2.status).toBe(403);
  });

  test('teacher can get sets; student forbidden', async () => {
    const a = await request(app)
      .get('/api/sets')
      .set('Authorization', `Bearer ${teacherToken}`);
    expect(a.status).toBe(200);
    const b = await request(app)
      .get('/api/sets')
      .set('Authorization', `Bearer ${studentToken}`);
    expect(b.status).toBe(403);
  });

  test('teacher can create question; student cannot', async () => {
    const qPayload = {
      setId: createdSetId,
      type: 'multipleChoice',
      content: 'Q1',
      answers: ['A'],
      options: ['A', 'B'],
    };
    const r = await request(app)
      .post('/api/questions')
      .set('Authorization', `Bearer ${teacherToken}`)
      .send(qPayload);
    expect(r.status).toBe(201);

    const r2 = await request(app)
      .post('/api/questions')
      .set('Authorization', `Bearer ${studentToken}`)
      .send(qPayload);
    expect(r2.status).toBe(403);
  });
});
