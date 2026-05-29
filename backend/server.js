require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

const User = require('./models/User');
const Category = require('./models/Category');
const Product = require('./models/Product');
const { adminUsers, categories: seedCategories, products: seedProducts } = require('./data/seedData');

const app = express();

connectDB();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/products', require('./routes/products'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/opinions', require('./routes/opinions'));

app.get('/api/health', (req, res) => {
  res.json({ status: 'up', timestamp: new Date() });
});

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend', 'dist', 'index.html'));
  });
}

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

const PORT = process.env.PORT || 5000;

const seedDatabase = async () => {
  try {
    for (const user of adminUsers) {
      const userExists = await User.findOne({ email: user.email });
      if (!userExists) {
        await User.create(user);
        console.log(`Seeded admin user: ${user.email} / ${user.password}`);
      }
    }

    const categoriesCount = await Category.countDocuments();
    if (categoriesCount > 0) return;

    const insertedCategories = await Category.insertMany(
      seedCategories.map(({ key, ...category }) => category)
    );
    console.log(`Seeded ${insertedCategories.length} default categories.`);

    const categoryMap = new Map(
      seedCategories.map((category, index) => [category.key, insertedCategories[index]._id])
    );
    const products = seedProducts.map(({ categoryKey, ...product }) => ({
      ...product,
      category: categoryMap.get(categoryKey),
      availabilityStatus: 'in stock',
      priceAfterDiscount: product.discountPercentage > 0
        ? Math.round(product.originalPrice * (1 - product.discountPercentage / 100))
        : product.originalPrice,
      gallery: [product.frontImage, product.backImage],
    }));

    await Product.insertMany(products);
    console.log(`Seeded ${products.length} sample products.`);
  } catch (err) {
    console.error('Database seeding failed:', err);
  }
};

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await seedDatabase();
});
