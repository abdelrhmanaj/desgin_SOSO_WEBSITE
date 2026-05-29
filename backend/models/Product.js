const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
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
      required: true,
      trim: true,
    },
    descriptionAr: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    sizes: [
      {
        type: String,
        trim: true,
      },
    ],
    colors: [
      {
        type: String,
        trim: true,
      },
    ],
    originalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    discountPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    priceAfterDiscount: {
      type: Number,
      min: 0,
    },
    availabilityStatus: {
      type: String,
      enum: ['in stock', 'out of stock'],
      default: 'in stock',
    },
    frontImage: {
      type: String,
      required: true,
    },
    backImage: {
      type: String,
      required: true,
    },
    gallery: [
      {
        type: String,
      },
    ],
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save middleware to calculate priceAfterDiscount
productSchema.pre('save', function () {
  if (this.discountPercentage > 0) {
    this.priceAfterDiscount = Math.round(this.originalPrice * (1 - this.discountPercentage / 100));
  } else {
    this.priceAfterDiscount = this.originalPrice;
  }
});

module.exports = mongoose.model('Product', productSchema);
