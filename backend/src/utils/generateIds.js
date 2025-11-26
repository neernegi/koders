import Event from '../models/event.model.js';

export const generateEventId = async () => {
  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  const now = new Date();
  const month = months[now.getMonth()];
  const year = now.getFullYear();
  
  const generateRandom = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 3; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  let eventId;
  let exists = true;
  
  while (exists) {
    const randomPart = generateRandom();
    eventId = `EVT-${month}${year}-${randomPart}`;
    const existingEvent = await Event.findOne({ eventId });
    exists = !!existingEvent;
  }
  
  return eventId;
};

export const generateBookingId = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = 'BK-';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};