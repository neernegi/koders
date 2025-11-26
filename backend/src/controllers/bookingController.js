import Booking from '../models/booking.model.js';
import Event from '../models/event.model.js';
import { generateBookingId } from '../utils/generateIds.js';
import { formatDate, isEventStarted } from '../utils/dateFormatter.js';
import { generateBookingPDF, simulateEmailConfirmation } from '../services/pdfService.js';


// VALIDATION UTILITY

const validateBooking = ({ eventId, seats }) => {
  const errors = [];

  if (!eventId) errors.push('Event ID is required');
  if (!seats) errors.push('Seats field is required');
  if (seats < 1 || seats > 2) errors.push('You can book 1–2 seats only');

  return errors;
};


// CREATE BOOKING
export const createBooking = async (req, res) => {
  try {
    const { eventId, seats } = req.body;

  
    const errors = validateBooking(req.body);
    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }

   
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Event already started?
    if (isEventStarted(event.date)) {
      return res.status(400).json({
        success: false,
        message: 'Cannot book a past event'
      });
    }

    // Seat availability
    if (event.bookedSeats + seats > event.capacity) {
      return res.status(400).json({
        success: false,
        message: 'Not enough seats available'
      });
    }

    // User already booked?
    const existingBooking = await Booking.findOne({
      user: req.user.id,
      event: eventId,
      status: 'confirmed'
    });

    if (existingBooking) {
      return res.status(400).json({
        success: false,
        message: 'You have already booked this event'
      });
    }

    const bookingId = generateBookingId();
    const totalAmount = event.price * seats;

    const booking = await Booking.create({
      bookingId,
      user: req.user.id,
      event: eventId,
      seats,
      totalAmount
    });

    // Update event seats
    event.bookedSeats += seats;
    await event.save();

    await booking.populate('event');
    await booking.populate('user', 'name email');

    // Generate PDF (Buffer)
    const pdfBuffer = await generateBookingPDF(booking);

    // Simulate Email sending
    const emailResponse = simulateEmailConfirmation(booking, pdfBuffer);

    return res.status(201).json({
      success: true,
      message: 'Booking confirmed successfully',
      emailStatus: emailResponse,
      data: {
        booking: {
          ...booking.toObject(),
          event: {
            ...booking.event.toObject(),
            formattedDate: formatDate(booking.event.date)
          }
        }
      }
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error while creating booking',
      error: error.message
    });
  }
};

// GET USER BOOKINGS
export const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      user: req.user.id,
      status: 'confirmed'
    })
      .populate('event')
      .sort({ bookingDate: -1 });

    const formatted = bookings.map(b => ({
      ...b.toObject(),
      event: {
        ...b.event.toObject(),
        formattedDate: formatDate(b.event.date)
      }
    }));

    return res.json({
      success: true,
      data: { bookings: formatted }
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching bookings',
      error: error.message
    });
  }
};


// CANCEL BOOKING
export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('event');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    if (booking.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this booking'
      });
    }

    if (isEventStarted(booking.event.date)) {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel a booking after event start'
      });
    }

    booking.status = 'cancelled';
    booking.cancellationDate = new Date();
    await booking.save();

    const event = await Event.findById(booking.event._id);
    event.bookedSeats -= booking.seats;
    await event.save();

    return res.json({
      success: true,
      message: 'Booking cancelled successfully'
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error while cancelling booking',
      error: error.message
    });
  }
};


// GET SINGLE BOOKING
export const getBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('event')
      .populate('user', 'name email');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    if (booking.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this booking'
      });
    }

    return res.json({
      success: true,
      data: {
        booking: {
          ...booking.toObject(),
          event: {
            ...booking.event.toObject(),
            formattedDate: formatDate(booking.event.date)
          }
        }
      }
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching booking',
      error: error.message
    });
  }
};
