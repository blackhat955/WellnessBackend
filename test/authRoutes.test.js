const supertest = require('supertest');
const express = require('express');
const mongoose = require("mongoose");
const router = require("../routes/authRoutes")
require("dotenv").config();
MONGO_URI = "mongodb+srv://earthh17:zS4njrU9MrKNNpVN@cluster0.wp530qf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const app = express();
app.use(express.json());
// app.use(require('cors')());

app.use('/auth', authRoutes); // Mount the auth routes
// app.use('/video', content);

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
    const res = await supertest(app)
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
    const res = await supertest(app)
      .post('/register')
      .send(mockUser);
    expect(res.statusCode).toEqual(409);
    expect(res.body.message).toEqual('User already Exists');
    expect(res.body.userData).toBeDefined();
  });
});

describe('POST /login', () => {
  it('should login with correct credentials and send OTP', async () => {
    const res = await supertest(app)
      .post('/login')
      .send({ email: mockUser.email, password: mockUser.password });
    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toEqual('Code sent to email');
    expect(res.body.userDetails).toBeDefined();
  });

  it('should return 401 for invalid credentials', async () => {
    const res = await supertest(app)
      .post('/login')
      .send({ email: 'invalid@example.com', password: 'invalid123' });
    expect(res.statusCode).toEqual(401);
    expect(res.body.message).toEqual('Invalid credentials');
  });
});