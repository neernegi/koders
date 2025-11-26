import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  eventId: {
    type: String,
    unique: true,
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Music', 'Tech', 'Business', 'Workshop', 'Webinar', 'Conference', 'Sports', 'Arts', 'Food', 'Health', 'Other']
  },
  location: {
    type: String,
    required: true
  },
  locationType: {
    type: String,
    enum: ['Online', 'In-Person'],
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  startTime: {
    type: String,
    required: true
  },
  endTime: {
    type: String,
    required: true
  },
  capacity: {
    type: Number,
    required: true,
    min: 1
  },
  bookedSeats: {
    type: Number,
    default: 0
  },
  price: {
    type: Number,
    default: 0
  },
  image: {
    type: String,
    default: ''
  },
  organizer: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Upcoming', 'Ongoing', 'Completed'],
    default: 'Upcoming'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Fixed pre-save hook
eventSchema.pre('save', function(next) {
  if (this.status === 'Upcoming' || this.isModified('date')) {
    const today = new Date();
    const eventDate = new Date(this.date);
    
    const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const eventDateOnly = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate());
    
    if (eventDateOnly < todayDate) {
      this.status = 'Completed';
    } else if (eventDateOnly.getTime() === todayDate.getTime()) {
      this.status = 'Ongoing';
    } else {
      this.status = 'Upcoming';
    }
  }
  
  if (typeof next === 'function') {
    next();
  }
});

export default mongoose.model('Event', eventSchema);