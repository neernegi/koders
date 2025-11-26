import request from 'supertest';
import app from '../src/server.js';
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

    adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'password123',
      role: 'admin'
    });

    regularUser = await User.create({
      name: 'Regular User',
      email: 'user@example.com',
      password: 'password123',
      role: 'user'
    });

    adminToken = generateAuthToken(adminUser._id, 'admin');
    userToken = generateAuthToken(regularUser._id, 'user');
  });

  describe('GET /api/events', () => {
    it('should get all events', async () => {
      await Event.create({
        eventId: 'EVT-TEST-123',
        title: 'Test Event',
        description: 'Test Description',
        category: 'Tech',
        location: 'Test Location',
        locationType: 'Online',
        date: new Date('2024-12-31'),
        capacity: 100,
        organizer: adminUser._id
      });

      const response = await request(app)
        .get('/api/events')
        .expect(200);

      expect(response.body.events).toHaveLength(1);
      expect(response.body.events[0]).toHaveProperty('title', 'Test Event');
    });
  });

  describe('POST /api/events', () => {
    it('should create event as admin', async () => {
      const eventData = {
        title: 'New Event',
        description: 'Event Description',
        category: 'Tech',
        location: 'Test Location',
        locationType: 'Online',
        date: '2024-12-31',
        capacity: 100
      };

      const response = await request(app)
        .post('/api/events')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(eventData)
        .expect(201);

      expect(response.body.event).toHaveProperty('title', 'New Event');
      expect(response.body.event).toHaveProperty('eventId');
    });

    it('should not create event as regular user', async () => {
      const eventData = {
        title: 'New Event',
        description: 'Event Description',
        category: 'Tech',
        location: 'Test Location',
        locationType: 'Online',
        date: '2024-12-31',
        capacity: 100
      };

      const response = await request(app)
        .post('/api/events')
        .set('Authorization', `Bearer ${userToken}`)
        .send(eventData)
        .expect(403);

      expect(response.body).toHaveProperty('message', 'Access denied. Insufficient permissions.');
    });
  });
});