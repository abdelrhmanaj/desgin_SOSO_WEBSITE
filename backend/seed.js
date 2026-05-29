require('dotenv').config();
const mongoose = require('mongoose');

const User = require('./models/User');
const Category = require('./models/Category');
const Product = require('./models/Product');
const { adminUsers, categories: seedCategories, products: seedProducts } = require('./data/seedData');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/wardrobe_luxury');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

const discountedPrice = (product) => (
  product.discountPercentage > 0
    ? Math.round(product.originalPrice * (1 - product.discountPercentage / 100))
    : product.originalPrice
);

const seedDatabase = async () => {
  try {
    for (const user of adminUsers) {
      const exists = await User.findOne({ email: user.email });
      if (!exists) {
        await User.create(user);
      } else {
        exists.username = user.username;
        exists.password = user.password;
        exists.role = user.role;
        await exists.save();
      }
    }
    console.log(`Upserted ${adminUsers.length} admin users`);

    const seedSlugs = seedCategories.map((category) => category.slug);
    const seedProductNames = seedProducts.map((product) => product.nameEn);
    await Product.deleteMany({ nameEn: { $nin: seedProductNames } });
    await Category.deleteMany({ slug: { $nin: seedSlugs } });

    const categoryDocs = [];
    for (const { key, ...category } of seedCategories) {
      const doc = await Category.findOneAndUpdate(
        { slug: category.slug },
        category,
        { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
      );
      categoryDocs.push({ key, doc });
    }
    console.log(`Upserted ${categoryDocs.length} categories`);

    const categoryMap = new Map(categoryDocs.map(({ key, doc }) => [key, doc._id]));
    for (const { categoryKey, ...product } of seedProducts) {
      await Product.findOneAndUpdate(
        { nameEn: product.nameEn },
        {
          ...product,
          category: categoryMap.get(categoryKey),
          availabilityStatus: 'in stock',
          priceAfterDiscount: discountedPrice(product),
          gallery: [product.frontImage, product.backImage],
        },
        { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
      );
    }
    console.log(`Upserted ${seedProducts.length} products`);

    console.log('\nDatabase seeding completed successfully.');
    console.log('Default login: admin@wardrobe.com / AdminPassword123');
    console.log('Owner login: abdelrhmanaja@gail.com / AdminPassword123');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error.message);
    process.exit(1);
  }
};

connectDB().then(seedDatabase);
