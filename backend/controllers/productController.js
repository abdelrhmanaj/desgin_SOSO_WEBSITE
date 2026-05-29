const Product = require('../models/Product');
const Category = require('../models/Category');
const fs = require('fs');
const path = require('path');

// @desc    Get all products with filtering, search, sorting
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const {
      search,
      category,
      size,
      color,
      minPrice,
      maxPrice,
      sort,
      isFeatured,
      limit,
    } = req.query;

    const query = {};

    // Search query: check bilingual names and descriptions
    if (search) {
      query.$or = [
        { nameEn: { $regex: search, $options: 'i' } },
        { nameAr: { $regex: search, $options: 'i' } },
        { descriptionEn: { $regex: search, $options: 'i' } },
        { descriptionAr: { $regex: search, $options: 'i' } },
      ];
    }

    // Category filter: either category object ID or category slug
    if (category) {
      // Find category by slug first if it's not a valid ObjectId
      if (category.match(/^[0-9a-fA-F]{24}$/)) {
        query.category = category;
      } else {
        const cat = await Category.findOne({ slug: category.toLowerCase() });
        if (cat) {
          query.category = cat._id;
        } else {
          // If category not found, return empty data
          return res.json({ success: true, count: 0, data: [] });
        }
      }
    }

    // Size filter
    if (size) {
      query.sizes = size; // Match if size is in the sizes array
    }

    // Color filter
    if (color) {
      // Direct match (case-insensitive or exact)
      query.colors = { $regex: new RegExp(`^${color}$`, 'i') };
    }

    // Price range filter on priceAfterDiscount
    if (minPrice || maxPrice) {
      query.priceAfterDiscount = {};
      if (minPrice) query.priceAfterDiscount.$gte = Number(minPrice);
      if (maxPrice) query.priceAfterDiscount.$lte = Number(maxPrice);
    }

    // Featured products
    if (isFeatured) {
      query.isFeatured = isFeatured === 'true';
    }

    let apiQuery = Product.find(query).populate('category');

    // Sorting
    if (sort) {
      if (sort === 'newest') {
        apiQuery = apiQuery.sort({ createdAt: -1 });
      } else if (sort === 'priceAsc') {
        apiQuery = apiQuery.sort({ priceAfterDiscount: 1 });
      } else if (sort === 'priceDesc') {
        apiQuery = apiQuery.sort({ priceAfterDiscount: -1 });
      }
    } else {
      // Default sort is newest
      apiQuery = apiQuery.sort({ createdAt: -1 });
    }

    // Limit
    if (limit) {
      apiQuery = apiQuery.limit(Number(limit));
    }

    const products = await apiQuery;

    res.json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category');
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
  try {
    const {
      nameEn,
      nameAr,
      descriptionEn,
      descriptionAr,
      category,
      sizes,
      colors,
      originalPrice,
      discountPercentage,
      availabilityStatus,
      isFeatured,
    } = req.body;

    if (!nameEn || !nameAr || !descriptionEn || !descriptionAr || !category || !originalPrice) {
      return res.status(400).json({ success: false, message: 'Required fields missing' });
    }

    // Validate category exists
    const cat = await Category.findById(category);
    if (!cat) {
      return res.status(400).json({ success: false, message: 'Invalid category' });
    }

    // Check if images are uploaded
    if (!req.files || !req.files['frontImage'] || !req.files['backImage']) {
      return res.status(400).json({ success: false, message: 'Front and back images are required' });
    }

    const frontImage = `/uploads/${req.files['frontImage'][0].filename}`;
    const backImage = `/uploads/${req.files['backImage'][0].filename}`;

    const gallery = [];
    if (req.files['gallery']) {
      req.files['gallery'].forEach((file) => {
        gallery.push(`/uploads/${file.filename}`);
      });
    }

    // Parse array variables (they might come as stringified JSON or comma-separated lists)
    let parsedSizes = [];
    if (sizes) {
      parsedSizes = typeof sizes === 'string' ? JSON.parse(sizes) : sizes;
    }

    let parsedColors = [];
    if (colors) {
      parsedColors = typeof colors === 'string' ? JSON.parse(colors) : colors;
    }

    const product = new Product({
      nameEn,
      nameAr,
      descriptionEn,
      descriptionAr,
      category,
      sizes: parsedSizes,
      colors: parsedColors,
      originalPrice: Number(originalPrice),
      discountPercentage: Number(discountPercentage || 0),
      availabilityStatus,
      isFeatured: isFeatured === 'true' || isFeatured === true,
      frontImage,
      backImage,
      gallery,
    });

    const savedProduct = await product.save();
    res.status(201).json({ success: true, data: savedProduct });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
  try {
    const {
      nameEn,
      nameAr,
      descriptionEn,
      descriptionAr,
      category,
      sizes,
      colors,
      originalPrice,
      discountPercentage,
      availabilityStatus,
      isFeatured,
      keepGallery, // IDs or file paths of existing gallery to keep
    } = req.body;

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    if (category) {
      const cat = await Category.findById(category);
      if (!cat) {
        return res.status(400).json({ success: false, message: 'Invalid category' });
      }
      product.category = category;
    }

    product.nameEn = nameEn || product.nameEn;
    product.nameAr = nameAr || product.nameAr;
    product.descriptionEn = descriptionEn || product.descriptionEn;
    product.descriptionAr = descriptionAr || product.descriptionAr;
    product.originalPrice = originalPrice !== undefined ? Number(originalPrice) : product.originalPrice;
    product.discountPercentage = discountPercentage !== undefined ? Number(discountPercentage) : product.discountPercentage;
    product.availabilityStatus = availabilityStatus || product.availabilityStatus;
    if (isFeatured !== undefined) {
      product.isFeatured = isFeatured === 'true' || isFeatured === true;
    }

    if (sizes) {
      product.sizes = typeof sizes === 'string' ? JSON.parse(sizes) : sizes;
    }
    if (colors) {
      product.colors = typeof colors === 'string' ? JSON.parse(colors) : colors;
    }

    // Handle single images updating
    if (req.files) {
      if (req.files['frontImage']) {
        // Delete old frontImage
        if (product.frontImage) {
          const oldPath = path.join(__dirname, '..', product.frontImage);
          if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        }
        product.frontImage = `/uploads/${req.files['frontImage'][0].filename}`;
      }

      if (req.files['backImage']) {
        // Delete old backImage
        if (product.backImage) {
          const oldPath = path.join(__dirname, '..', product.backImage);
          if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        }
        product.backImage = `/uploads/${req.files['backImage'][0].filename}`;
      }

      // Handle gallery updating
      if (req.files['gallery']) {
        const newGalleryPaths = req.files['gallery'].map(file => `/uploads/${file.filename}`);
        
        let keptPaths = [];
        if (keepGallery) {
          keptPaths = typeof keepGallery === 'string' ? JSON.parse(keepGallery) : keepGallery;
        }

        // Delete old gallery files not in keptPaths
        product.gallery.forEach((oldImg) => {
          if (!keptPaths.includes(oldImg)) {
            const oldPath = path.join(__dirname, '..', oldImg);
            if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
          }
        });

        product.gallery = [...keptPaths, ...newGalleryPaths];
      }
    }

    const updatedProduct = await product.save();
    res.json({ success: true, data: updatedProduct });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Delete front image
    if (product.frontImage) {
      const oldPath = path.join(__dirname, '..', product.frontImage);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    // Delete back image
    if (product.backImage) {
      const oldPath = path.join(__dirname, '..', product.backImage);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    // Delete gallery images
    if (product.gallery && product.gallery.length > 0) {
      product.gallery.forEach((img) => {
        const imgPath = path.join(__dirname, '..', img);
        if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
      });
    }

    await product.deleteOne();
    res.json({ success: true, message: 'Product removed' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
