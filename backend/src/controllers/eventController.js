import Event from "../models/event.model.js";
import Booking from "../models/booking.model.js";
import { generateEventId } from "../utils/generateIds.js";
import { formatDate } from "../utils/dateFormatter.js";

export const getEvents = async (req, res) => {
  try {
    const {
      category,
      locationType,
      dateFrom,
      dateTo,
      page = 1,
      limit = 10,
    } = req.query;

    let query = {};

    if (category && category !== "all") {
      query.category = category;
    }

    if (locationType && locationType !== "all") {
      query.locationType = locationType;
    }

    if (dateFrom || dateTo) {
      query.date = {};

      if (dateFrom) {
        const fromDate = new Date(dateFrom);
        if (isNaN(fromDate.getTime())) {
          return res.status(400).json({
            success: false,
            message: "Invalid dateFrom format",
          });
        }
        fromDate.setHours(0, 0, 0, 0);
        query.date.$gte = fromDate;
      }

      if (dateTo) {
        const toDate = new Date(dateTo);
        if (isNaN(toDate.getTime())) {
          return res.status(400).json({
            success: false,
            message: "Invalid dateTo format",
          });
        }
        toDate.setHours(23, 59, 59, 999);
        query.date.$lte = toDate;
      }

      if (dateFrom && dateTo) {
        const from = new Date(dateFrom);
        const to = new Date(dateTo);
        if (from > to) {
          return res.status(400).json({
            success: false,
            message: "dateFrom cannot be after dateTo",
          });
        }
      }
    }

    const skip = (page - 1) * limit;

    const events = await Event.find(query)
      .sort({ date: 1, createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .populate("createdBy", "name email");

    const total = await Event.countDocuments(query);

    res.json({
      success: true,
      data: {
        events: events.map((e) => ({
          ...e.toObject(),
          formattedDate: formatDate(e.date),
        })),
        pagination: {
          current: Number(page),
          pages: Math.ceil(total / limit),
          total,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching events",
      error: error.message,
    });
  }
};


export const getEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate(
      "createdBy",
      "name email"
    );

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    res.json({
      success: true,
      data: {
        event: {
          ...event.toObject(),
          formattedDate: formatDate(event.date),
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error while fetching event",
      error: error.message,
    });
  }
};

export const createEvent = async (req, res) => {
  try {
    console.log("Creating event with data:", req.body);
    console.log("User creating event:", req.user);

    const {
      title,
      description,
      category,
      location,
      locationType,
      date,
      startTime,
      endTime,
      capacity,
      price,
      organizer,
      image,
    } = req.body;

    if (
      !title ||
      !description ||
      !category ||
      !location ||
      !locationType ||
      !date ||
      !startTime ||
      !endTime ||
      !capacity ||
      !organizer
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const validCategories = [
      "Music",
      "Tech",
      "Business",
      "Workshop",
      "Webinar",
      "Conference",
      "Other",
    ];
    if (!validCategories.includes(category)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category",
      });
    }

    if (!["Online", "In-Person"].includes(locationType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid location type",
      });
    }

    const eventDate = new Date(date);
    if (isNaN(eventDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid date format",
      });
    }

    if (capacity < 1) {
      return res.status(400).json({
        success: false,
        message: "Capacity must be at least 1",
      });
    }

    const today = new Date();
    const todayDate = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const eventDateOnly = new Date(
      eventDate.getFullYear(),
      eventDate.getMonth(),
      eventDate.getDate()
    );

    if (eventDateOnly < todayDate) {
      return res.status(400).json({
        success: false,
        message: "Cannot create events in the past",
      });
    }

    const eventId = await generateEventId();
    console.log("Generated event ID:", eventId);

    const eventData = {
      eventId,
      title: title.trim(),
      description: description.trim(),
      category,
      location: location.trim(),
      locationType,
      date: eventDate,
      startTime,
      endTime,
      capacity: parseInt(capacity),
      price: price ? parseFloat(price) : 0,
      organizer: organizer.trim(),
      image: image || "",
      createdBy: req.user.id,
      status: "Upcoming",
    };

    console.log("Event data to create:", eventData);

    const event = await Event.create(eventData);
    console.log("Event created successfully:", event._id);

    const eventResponse = {
      ...event.toObject(),
      formattedDate: formatDate(event.date),
    };

    res.status(201).json({
      success: true,
      message: "Event created successfully",
      data: {
        event: eventResponse,
      },
    });
  } catch (error) {
    console.error("Error creating event:", error);

    // Handle duplicate event ID
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Event ID already exists. Please try again.",
      });
    }

    // Handle validation errors
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors,
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error while creating event",
      error:
        process.env.NODE_ENV === "production"
          ? "Internal server error"
          : error.message,
    });
  }
};

export const updateEvent = async (req, res) => {
  try {
    const updates = req.body;

    if (updates.capacity && updates.capacity < 1) {
      return res.status(400).json({
        success: false,
        message: "Capacity must be >= 1",
      });
    }

    if (updates.date && isNaN(new Date(updates.date))) {
      return res.status(400).json({
        success: false,
        message: "Invalid date",
      });
    }

    let event = await Event.findById(req.params.id);
    if (!event)
      return res
        .status(404)
        .json({ success: false, message: "Event not found" });

    if (
      event.createdBy.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized" });
    }

    event = await Event.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    res.json({
      success: true,
      message: "Event updated successfully",
      data: {
        event: {
          ...event.toObject(),
          formattedDate: formatDate(event.date),
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error while updating event",
      error: error.message,
    });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event)
      return res
        .status(404)
        .json({ success: false, message: "Event not found" });

    if (
      event.createdBy.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized" });
    }

    await event.deleteOne();

    res.json({ success: true, message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error while deleting event",
      error: error.message,
    });
  }
};

export const getEventAttendees = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event)
      return res
        .status(404)
        .json({ success: false, message: "Event not found" });

    const attendees = await Booking.find({
      event: req.params.id,
      status: "confirmed",
    }).populate("user", "name email");

    res.json({
      success: true,
      data: { attendees },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error fetching attendees",
      error: error.message,
    });
  }
};
