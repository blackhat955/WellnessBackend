const request = require('supertest');
const app = require('../app'); // Assuming your Express app is exported from 'app.js' or 'index.js'
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Mock user data for testing
const mockUser = {
  email: 'test@example.com',
  password: 'test123',
  firstname: 'Test',
  lastname: 'User',
  userType: 'user',
};

beforeAll(async () => {
  // Create a test user in the database before running the tests
  const hashedPassword = await bcrypt.hash(mockUser.password, 10);
  await User.create({ ...mockUser, password: hashedPassword });
});

describe('POST /register', async() => {
  it('should register a new user', async () => {
    const res = await request(app)
      .post('/register')
      .send({
        email: 'newuser@example.com',
        password: 'newuser123',
        firstname: 'New',
        lastname: 'User',
        userType: 'customer',
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toEqual('Registered successfully');
    expect(res.body.data).toBeDefined();
  });

  it('should return 409 if user already exists', async() => {
    const res = await request(app)
      .post('/register')
      .send(mockUser);
    expect(res.statusCode).toEqual(409);
    expect(res.body.message).toEqual('User already Exists');
    expect(res.body.userData).toBeDefined();
  });
});

describe('POST /login', () => {
  it('should login with correct credentials and send OTP', async () => {
    const res = await request(app)
      .post('/login')
      .send({ email: mockUser.email, password: mockUser.password });
    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toEqual('Code sent to email');
    expect(res.body.userDetails).toBeDefined();
  });

  it('should return 401 for invalid credentials', async () => {
    const res = await request(app)
      .post('/login')
      .send({ email: 'invalid@example.com', password: 'invalid123' });
    expect(res.statusCode).toEqual(401);
    expect(res.body.message).toEqual('Invalid credentials');
  });
});
