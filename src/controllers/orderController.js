const Order = require('../models/Order');
const Event = require('../models/Event');

// Create order
exports.createOrder = async (req, res) => {
  try {
    const { eventId, quantity, paymentMethod } = req.body;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    if (event.remainingTickets < quantity) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient tickets'
      });
    }

    const subtotal = event.price * quantity;
    const gst = subtotal * 0.18;
    const totalAmount = subtotal + gst;

    const order = await Order.create({
      userId: req.user.id,
      eventId,
      quantity,
      ticketPrice: event.price,
      subtotal,
      gst,
      totalAmount,
      paymentMethod,
      customerDetails: {
        name: req.user.name,
        email: req.user.email,
        phone: req.user.phone
      }
    });

    // Update event sold tickets
    event.soldTickets += quantity;
    await event.save();

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get user orders
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id })
      .populate('eventId')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};