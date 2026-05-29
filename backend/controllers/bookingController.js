const Booking = require('../models/Booking');
const Product = require('../models/Product');

const getMinimumNeededDate = () => {
  const minimumDate = new Date();
  minimumDate.setDate(minimumDate.getDate() + 5);
  minimumDate.setHours(0, 0, 0, 0);
  return minimumDate;
};

const formatCsvCell = (value) => `"${String(value || '').replace(/"/g, '""')}"`;

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Public
const createBooking = async (req, res) => {
  try {
    const {
      customerName,
      customerEmail,
      customerPhone,
      productId,
      selectedSize,
      selectedColor,
      neededDate,
      notes,
    } = req.body;

    if (!customerName || !customerEmail || !customerPhone || !productId || !selectedSize || !selectedColor || !neededDate) {
      return res.status(400).json({ success: false, message: 'All booking fields are required' });
    }

    const parsedNeededDate = new Date(neededDate);
    if (Number.isNaN(parsedNeededDate.getTime())) {
      return res.status(400).json({ success: false, message: 'Needed date is invalid' });
    }

    parsedNeededDate.setHours(0, 0, 0, 0);
    if (parsedNeededDate < getMinimumNeededDate()) {
      return res.status(400).json({ success: false, message: 'Needed date must be at least 5 days from today' });
    }

    const product = await Product.findById(productId).populate('category');
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const booking = await Booking.create({
      customerName,
      customerEmail,
      customerPhone,
      product: productId,
      productName: product.nameEn, // Cache product name
      productCategory: product.category ? product.category.nameEn : 'Uncategorized',
      selectedSize,
      selectedColor,
      bookingDate: new Date(),
      neededDate: parsedNeededDate,
      notes,
    });

    res.status(201).json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all bookings (Admin only)
// @route   GET /api/bookings
// @access  Private/Admin
const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({}).populate('product').sort({ createdAt: -1 });
    res.json({ success: true, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update booking status (Admin only)
// @route   PUT /api/bookings/:id
// @access  Private/Admin
const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).json({ success: false, message: 'Status is required' });
    }

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    if (!booking.bookingDate) {
      booking.bookingDate = booking.createdAt || new Date();
    }
    if (!booking.neededDate) {
      const fallbackNeededDate = new Date(booking.bookingDate);
      fallbackNeededDate.setDate(fallbackNeededDate.getDate() + 5);
      booking.neededDate = fallbackNeededDate;
    }

    booking.status = status;
    const updatedBooking = await booking.save();

    res.json({ success: true, data: updatedBooking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Export bookings to CSV (Admin only)
// @route   GET /api/bookings/export
// @access  Private/Admin
const exportBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({}).sort({ createdAt: -1 });
    
    // Construct CSV content
    let csv = 'ID,Customer Name,Email,Phone,Product,Category,Size,Color,Booking Date,Needed Date,Notes,Status,Created At\n';
    
    bookings.forEach((booking) => {
      const bookingDate = booking.bookingDate ? booking.bookingDate.toISOString() : booking.createdAt.toISOString();
      const neededDate = booking.neededDate ? booking.neededDate.toISOString() : '';

      csv += [
        booking._id,
        formatCsvCell(booking.customerName),
        formatCsvCell(booking.customerEmail),
        formatCsvCell(booking.customerPhone),
        formatCsvCell(booking.productName),
        formatCsvCell(booking.productCategory),
        formatCsvCell(booking.selectedSize),
        formatCsvCell(booking.selectedColor),
        formatCsvCell(bookingDate),
        formatCsvCell(neededDate),
        formatCsvCell(booking.notes),
        formatCsvCell(booking.status),
        formatCsvCell(booking.createdAt.toISOString()),
      ].join(',') + '\n';
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=booking_requests.csv');
    res.status(200).send(csv);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createBooking,
  getBookings,
  updateBookingStatus,
  exportBookings,
};
