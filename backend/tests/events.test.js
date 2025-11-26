import request from 'supertest';
import app from '../src/app.js';
import { connectDB, closeDB, clearDB, generateAuthToken } from './setup.js';
import User from '../src/models/user.model.js';
import Event from '../src/models/event.model.js';

describe('Events API', () => {
  let adminToken;
  let userToken;
  let adminUser;
  let regularUser;

  beforeAll(async () => {
    await connectDB();
  });

  afterAll(async () => {
    await closeDB();
  });

  beforeEach(async () => {
    await clearDB();

    await new Promise(resolve => setTimeout(resolve, 300));

    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(7);
    
    adminUser = new User({
      name: 'Admin User',
      email: `admin${timestamp}${random}@example.com`,
      password: 'password123',
      role: 'admin'
    });
    await adminUser.save();

    regularUser = new User({
      name: 'Regular User',
      email: `user${timestamp}${random}@example.com`,
      password: 'password123',
      role: 'user'
    });
    await regularUser.save();

    await new Promise(resolve => setTimeout(resolve, 300));

    const adminCount = await User.countDocuments({ _id: adminUser._id });
    const regularCount = await User.countDocuments({ _id: regularUser._id });
    
    console.log('Admin user exists:', adminCount > 0);
    console.log('Regular user exists:', regularCount > 0);

    if (adminCount === 0 || regularCount === 0) {
      console.log('Users not found, recreating...');
      await User.deleteMany({});
      
      adminUser = await User.create({
        name: 'Admin User',
        email: `admin${timestamp}${random}2@example.com`,
        password: 'password123',
        role: 'admin'
      });
      
      regularUser = await User.create({
        name: 'Regular User', 
        email: `user${timestamp}${random}2@example.com`,
        password: 'password123',
        role: 'user'
      });
      
      await new Promise(resolve => setTimeout(resolve, 300));
    }

    adminToken = generateAuthToken(adminUser._id, 'admin');
    userToken = generateAuthToken(regularUser._id, 'user');

    console.log('Admin user ID:', adminUser._id.toString());
    console.log('Regular user ID:', regularUser._id.toString());
  });

  describe('GET /api/events', () => {
    it('should get all events', async () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 7);
      
      await Event.create({
        eventId: `EVT-TEST-${Date.now()}`,
        title: 'Test Event',
        description: 'Test Description',
        category: 'Tech',
        location: 'Test Location',
        locationType: 'Online',
        date: futureDate,
        startTime: '10:00',
        endTime: '12:00',
        capacity: 100,
        price: 0,
        organizer: 'Test Organizer',
        createdBy: adminUser._id
      });

      const response = await request(app)
        .get('/api/events')
        .expect(200);

      expect(response.body.data.events).toHaveLength(1);
      expect(response.body.data.events[0]).toHaveProperty('title', 'Test Event');
    });
  });

  describe('POST /api/events', () => {
    it('should create event as admin', async () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 30);
      const futureDateString = futureDate.toISOString().split('T')[0];

      const eventData = {
        title: 'New Event',
        description: 'Event Description',
        category: 'Tech',
        location: 'Test Location',
        locationType: 'Online',
        date: futureDateString,
        startTime: '10:00',
        endTime: '12:00',
        capacity: 100,
        price: 0,
        organizer: 'Test Organizer'
      };

      const response = await request(app)
        .post('/api/events')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(eventData);

      console.log('Create Event Response Status:', response.status);
      console.log('Create Event Response Body:', response.body);

      expect(response.status).toBe(201);
      expect(response.body.data.event).toHaveProperty('title', 'New Event');
      expect(response.body.data.event).toHaveProperty('eventId');
    });

    it('should not create event as regular user', async () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 30);
      const futureDateString = futureDate.toISOString().split('T')[0];

      const eventData = {
        title: 'New Event',
        description: 'Event Description',
        category: 'Tech',
        location: 'Test Location',
        locationType: 'Online',
        date: futureDateString,
        startTime: '10:00',
        endTime: '12:00',
        capacity: 100,
        price: 0,
        organizer: 'Test Organizer'
      };

      const response = await request(app)
        .post('/api/events')
        .set('Authorization', `Bearer ${userToken}`)
        .send(eventData);

      console.log('Regular user event creation response:', response.body);

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty('message', 'User role user is not authorized to access this route');
    });
  });

  describe('Health Check', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('EventEase API is running');
    });
  });
});