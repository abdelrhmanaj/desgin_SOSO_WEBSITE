const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    nameEn: {
      type: String,
      required: true,
      trim: true,
    },
    nameAr: {
      type: String,
      required: true,
      trim: true,
    },
    descriptionEn: {
      type: String,
      trim: true,
    },
    descriptionAr: {
      type: String,
      trim: true,
    },
    image: {
      type: String,
      required: true, // Image path
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Category', categorySchema);
