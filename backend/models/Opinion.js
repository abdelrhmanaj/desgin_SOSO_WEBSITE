const mongoose = require('mongoose');

const opinionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
    },
    comment: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
    isVisible: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Opinion', opinionSchema);
