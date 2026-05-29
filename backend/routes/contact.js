const express = require('express');
const router = express.Router();
const {
  createContactMessage,
  getContactMessages,
} = require('../controllers/contactController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .post(createContactMessage)
  .get(protect, getContactMessages);

module.exports = router;
