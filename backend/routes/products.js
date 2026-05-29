const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const productUploadFields = upload.fields([
  { name: 'frontImage', maxCount: 1 },
  { name: 'backImage', maxCount: 1 },
  { name: 'gallery', maxCount: 6 },
]);

router.route('/')
  .get(getProducts)
  .post(protect, productUploadFields, createProduct);

router.route('/:id')
  .get(getProductById)
  .put(protect, productUploadFields, updateProduct)
  .delete(protect, deleteProduct);

module.exports = router;
