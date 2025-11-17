const { readData, writeData } = require('../config/localdb');

// Get all events
exports.getAllEvents = async (req, res) => {
  try {
    const events = readData('events.json');

    res.status(200).json({
      success: true,
      count: events.length,
      data: events
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get single event
exports.getEvent = async (req, res) => {
  try {
    const events = readData('events.json');
    const event = events.find(e => e.id === req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    res.status(200).json({
      success: true,
      data: event
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Create event (Admin only)
exports.createEvent = async (req, res) => {
  try {
    const events = readData('events.json');
    const newEvent = {
      id: 'EVT' + String(events.length + 1).padStart(3, '0'),
      ...req.body,
      createdBy: req.user?.id || 'admin',
      sold_tickets: 0
    };
    events.push(newEvent);
    writeData('events.json', events);

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: newEvent
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update event (Admin only)
exports.updateEvent = async (req, res) => {
  try {
    const events = readData('events.json');
    const index = events.findIndex(e => e.id === req.params.id);

    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    events[index] = { ...events[index], ...req.body };
    writeData('events.json', events);

    res.status(200).json({
      success: true,
      message: 'Event updated successfully',
      data: events[index]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Delete event (Admin only)
exports.deleteEvent = async (req, res) => {
  try {
    const events = readData('events.json');
    const index = events.findIndex(e => e.id === req.params.id);

    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    events.splice(index, 1);
    writeData('events.json', events);

    res.status(200).json({
      success: true,
      message: 'Event deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};