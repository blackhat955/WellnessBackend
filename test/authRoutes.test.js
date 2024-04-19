// set- up 
const express = require("express");
const supertest = require("supertest");
const mongoose = require("mongoose");
const crypto = require('crypto');
const authRoutes = require("../routes/authRoutes"); // ensure correct path

require("dotenv").config();
MONGO_URI = "mongodb+srv://earthh17:zS4njrU9MrKNNpVN@cluster0.wp530qf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";


const app = express();
app.use(express.json());
app.use("/auth", authRoutes);

const User = require('../models/User');
const bcrypt = require('bcryptjs');

// /* Connecting to the database before each test. */
// beforeAll(async () => {
//     await mongoose.connect(MONGO_URI);
// });
  
// /* Closing database connection after each test. */
// afterAll(async () => {
//     await mongoose.connection.close();
// });

beforeAll(async () => {
    await mongoose.connect(MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
});

beforeEach(async () => {

    // Clear the users before each test
    await User.deleteMany({});
    // Create a user with a known verification code
    const hashedPassword = await bcrypt.hash('testpassword', 10);
    
    await User.create({
        email: 'testuser8@gmail.com',
        password: hashedPassword,
        firstname: 'Test',
        lastname: 'User',
        userType: 'professional',
        code: '123456' // Explicitly set the code expected by the test
    });

      // // Assuming the user is created first
      // const token = crypto.randomBytes(20).toString('hex');
      // await User.updateOne({ email: 'testuser8@gmail.com' }, {
      //     resetToken: token,
      //     tokenExpiry: Date.now() + 3600000 // 1 hour from now
      // });
});

afterEach(async () => {
    // Clean up the database after each test
    await User.deleteMany({});
});

afterAll(async () => {
    await mongoose.connection.close();
});


// test cases
describe("Authentication Routes", () => {
    // test("should register a user", async () => {

    //   const password = 'testpassword';
    //   const hashedPassword = await bcrypt.hash(password, 10);
    //   const newUser = {
    //     email: "testuser8@gmail.com",
    //     password: hashedPassword,
    //     firstname: "Test",
    //     lastname: "User",
    //     userType: "professional" || "customer",
    //     code: '123456'
    //   };
    //   const response = await supertest(app)
    //     .post("/auth/register")
    //     .send(newUser);
    //   expect(response.status).toBe(200);
    //   expect(response.body.message).toBe('Registered successfully');
    // });
  
  //   test("should register a user", async () => {

  //     // Ensure the user does not exist
  //     await User.deleteMany({
  //       $or: [
  //           { email: "newuser@example.com" },
  //           { email: "testuser@example.com" }
  //       ]
  //   });
  //     const password = 'newtestpassword';
  //     const hashedPassword = await bcrypt.hash(password, 10);
  //     const newUser = {
  //         email: "newuser@example.com", // Use a unique email to avoid conflict
  //         password: hashedPassword,
  //         firstname: "NewTest",
  //         lastname: "User",
  //         userType: "professional"
  //     };
  //     const response = await supertest(app)
  //         .post("/auth/register")
  //         .send(newUser);
  //     expect(response.status).toBe(200); // Expected to be successful
  //     expect(response.body.message).toBe('Registered successfully');
  // });  

    test("should fail login with incorrect credentials", async () => {
      const credentials = {
        email: "testuser8@gmail.com",
        password: "wrongpassword"
      };
      const response = await supertest(app)
        .post("/auth/login")
        .send(credentials);
      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Invalid credentials');
    });
  
    // test("should verify user code after login", async () => {
    //   const credentials = {
    //     email: "testuser8@gmail.com",
    //     code: "123456"  // Assuming you know the code or mock it
    //   };
    //   const response = await supertest(app)
    //     .post("/auth/verify-code")
    //     .send(credentials);
    //   expect(response.status).toBe(200);
    //   expect(response.body.message).toBe('Authenticated successfully');
    // });

    // test("should verify user code after login", async () => {
    //     // Ensure the user and code are set up correctly before this test
    //     const response = await supertest(app)
    //         .post("/auth/verify-code")
    //         .send({ email: "testuser8@gmail.com", code: "123456" }); // Correct the code as needed
    //     expect(response.status).toBe(200);
    //     expect(response.body.message).toBe('Authenticated successfully');
    // });

    test("should verify user code after login", async () => {
        const credentials = {
            email: "testuser8@gmail.com",
            code: "123456"
        };
        const response = await supertest(app)
            .post("/auth/verify-code")
            .send(credentials);
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Authenticated successfully');
    });
    

    test("should send reset password link", async () => {
      const email = {
        email: "testuser8@gmail.com"
      };
      const response = await supertest(app)
        .post("/auth/forget-password")
        .send(email);
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Reset link sent to email.');
    });



    // if you want to add any test case, add above this as after this the example test inputs will be deleted

    // test("should delete the test user", async () => {
    //     const credentials = {email: "testuser8@gmail.com"};
    //     const response = await supertest(app)
    //       .delete("/auth/deleteUserForTest")
    //       .send(credentials);
    //     expect(response.status).toBe(200);
    //     expect(response.body.message).toBe('Deleted Testing User successfully');
    //   });
    test("should delete the test user", async () => {
        const response = await supertest(app)
            .delete("/auth/deleteUserForTest")
            .send({ email: "testuser8@gmail.com" });
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Deleted Testing User successfully');
    });

    // Add more tests for reset-password and other scenarios
  });
  
  describe('POST /verify-code', () => {
    it('should successfully verify user with correct code', async () => {
      const user = {
        email: 'testuser8@gmail.com',
        code: '123456'  // Assume this is the correct code
      };
      const res = await supertest(app)
        .post('/auth/verify-code')
        .send(user);
      expect(res.statusCode).toEqual(200);
      expect(res.body.message).toEqual('Authenticated successfully');
    });
  
    it('should reject verification with incorrect code', async () => {
      const user = {
        email: 'testuser8@gmail.com',
        code: 'wrongcode'
      };
      const res = await supertest(app)
        .post('/auth/verify-code')
        .send(user);
      expect(res.statusCode).toEqual(401);
      expect(res.body.message).toEqual('Invalid code');
    });
  });

  describe('POST /forget-password', () => {
    it('should send a reset password link for registered email', async () => {
      const res = await supertest(app)
        .post('/auth/forget-password')
        .send({ email: 'testuser8@gmail.com' });
      expect(res.statusCode).toEqual(200);
      expect(res.body.message).toEqual('Reset link sent to email.');
    });
  
    it('should return error for unregistered email', async () => {
      const res = await supertest(app)
        .post('/auth/forget-password')
        .send({ email: 'unregistered@example.com' });
      expect(res.statusCode).toEqual(400);
      expect(res.body.message).toEqual('Email not registered.');
    });
  });

  describe('POST /reset-password', () => {
    // it('should allow password reset with valid token', async () => {
    //   const res = await supertest(app)
    //     .post('/auth/reset-password')
    //     .send({ token: 'validToken123', password: 'newPassword123' });
    //   expect(res.statusCode).toEqual(200);
    //   expect(res.body.message).toEqual('Password reset successfully.');
    // });
  
    test("should allow password reset with valid token", async () => {
      // Create and save a user with a reset token
      const resetToken = crypto.randomBytes(20).toString('hex');
      const user = await User.findOne({ email: 'testuser8@gmail.com' });
      user.resetToken = resetToken;
      user.tokenExpiry = Date.now() + 3600000; // Token expires in 1 hour
      await user.save();
  
      // Now attempt to reset password using the valid token
      const res = await supertest(app)
          .post('/auth/reset-password')
          .send({ token: resetToken, password: 'newPassword123' });
      expect(res.statusCode).toEqual(200);
      expect(res.body.message).toEqual('Password reset successfully');
  });
  

    it('should reject reset with invalid or expired token', async () => {
      const res = await supertest(app)
        .post('/auth/reset-password')
        .send({ token: 'expiredToken123', password: 'newPassword123' });
      expect(res.statusCode).toEqual(400);
      expect(res.body.message).toEqual('Invalid or expired token.');
    });
  });

  describe('GET /search-fitness-professional', () => {
    it('should return matching fitness professionals', async () => {
      const res = await supertest(app)
        .get('/auth/search-fitness-professional?firstname=John')
        .send();
      expect(res.statusCode).toEqual(200);
      expect(res.body.data).toBeInstanceOf(Array);
    });
  
    it('should return empty array when no matches found', async () => {
      const E_Array = [] ;
      const res = await supertest(app)
        .get('/auth/search-fitness-professional?firstname=Nonexistent')
        .send();
      expect(res.statusCode).toEqual(200);
      expect(res.body.data).toEqual(E_Array);
    });
  });
    
  describe('GET /get-workout-plan', () => {
    // it('should retrieve workout plan for a user', async () => {
    //   const res = await supertest(app)
    //     .get('/auth/get-workout-plan?email=user@example.com')
    //     .send();
    //   expect(res.statusCode).toEqual(200);
    //   expect(res.body.data).toBeDefined();
    // });
  
    it('should return 404 if no plan found', async () => {
      const res = await supertest(app)
        .get('/auth/get-workout-plan?email=noplan@example.com')
        .send();
      expect(res.statusCode).toEqual(404);
      expect(res.body.message).toEqual('No workout plan found for this email.');
    });
  });

  describe('GET /contents', () => {
    it('should return filtered contents correctly', async () => {
      const res = await supertest(app)
        .get('/auth/contents?type=Video&instructor=JohnDoe')
        .send();
      expect(res.statusCode).toEqual(200);
      expect(res.body).toBeInstanceOf(Array);
    });
  
    it('should return sorted contents by date', async () => {
      const res = await supertest(app)
        .get('/auth/contents?sort=asc')
        .send();
      expect(res.statusCode).toEqual(200);
      expect(res.body).toBeInstanceOf(Array);
      // Further tests could check for correct ordering
    });
  });
  