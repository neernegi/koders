import request from 'supertest';
import app from '../src/server.js';
import { connectDB, closeDB, clearDB, generateAuthToken } from './setup.js';
import User from '../src/models/user.model.js';
import Event from '../src/models/event.model.js';
import Booking from '../src/models/booking.model.js';

describe('Bookings API', () => {
  let userToken;
  let user;

  beforeAll(async () => {
    await connectDB();
  });

  afterAll(async () => {
    await closeDB();
  });

  beforeEach(async () => {
    await clearDB();

    user = await User.create({
      name: 'Test User',
      email: 'user@example.com',
      password: 'password123',
      role: 'user'
    });

    userToken = generateAuthToken(user._id, 'user');
  });

  describe('POST /api/bookings', () => {
    it('should create booking successfully', async () => {
      const event = await Event.create({
        eventId: 'EVT-TEST-123',
        title: 'Test Event',
        description: 'Test Description',
        category: 'Tech',
        location: 'Test Location',
        locationType: 'Online',
        date: new Date('2024-12-31'),
        capacity: 100,
        organizer: user._id
      });

      const response = await request(app)
        .post('/api/bookings')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          eventId: event._id,
          seats: 2
        })
        .expect(201);

      expect(response.body.booking).toHaveProperty('bookingId');
      expect(response.body.booking).toHaveProperty('seats', 2);
      expect(response.body).toHaveProperty('confirmation');
    });

    it('should not allow booking more than 2 seats', async () => {
      const event = await Event.create({
        eventId: 'EVT-TEST-123',
        title: 'Test Event',
        description: 'Test Description',
        category: 'Tech',
        location: 'Test Location',
        locationType: 'Online',
        date: new Date('2024-12-31'),
        capacity: 100,
        organizer: user._id
      });

      const response = await request(app)
        .post('/api/bookings')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          eventId: event._id,
          seats: 3
        })
        .expect(400);

      expect(response.body).toHaveProperty('message', 'Seats must be between 1 and 2');
    });
  });
});