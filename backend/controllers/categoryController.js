const Category = require('../models/Category');
const fs = require('fs');
const path = require('path');

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({});
    res.json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a category
// @route   POST /api/categories
// @access  Private/Admin
const createCategory = async (req, res) => {
  try {
    const { nameEn, nameAr, descriptionEn, descriptionAr, slug } = req.body;

    if (!nameEn || !nameAr || !slug) {
      return res.status(400).json({ success: false, message: 'English/Arabic names and slug are required' });
    }

    // Check if category already exists
    const categoryExists = await Category.findOne({ slug });
    if (categoryExists) {
      return res.status(400).json({ success: false, message: 'Category slug already exists' });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload an image for the category' });
    }

    const imagePath = `/uploads/${req.file.filename}`;

    const category = await Category.create({
      nameEn,
      nameAr,
      descriptionEn,
      descriptionAr,
      slug: slug.toLowerCase(),
      image: imagePath,
    });

    res.status(201).json({ success: true, data: category });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update a category
// @route   PUT /api/categories/:id
// @access  Private/Admin
const updateCategory = async (req, res) => {
  try {
    const { nameEn, nameAr, descriptionEn, descriptionAr, slug } = req.body;
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    category.nameEn = nameEn || category.nameEn;
    category.nameAr = nameAr || category.nameAr;
    category.descriptionEn = descriptionEn || category.descriptionEn;
    category.descriptionAr = descriptionAr || category.descriptionAr;
    category.slug = slug ? slug.toLowerCase() : category.slug;

    if (req.file) {
      // Remove old image
      if (category.image) {
        const oldImagePath = path.join(__dirname, '..', category.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      category.image = `/uploads/${req.file.filename}`;
    }

    const updatedCategory = await category.save();
    res.json({ success: true, data: updatedCategory });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    // Delete image file
    if (category.image) {
      const imagePath = path.join(__dirname, '..', category.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await category.deleteOne();
    res.json({ success: true, message: 'Category removed' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};
