require('dotenv').config();
const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 5001;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://admin:password@localhost:27017/catalogue?authSource=admin';

let db;
let productsCollection;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
const connectDB = async () => {
  try {
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    db = client.db('catalogue');
    productsCollection = db.collection('products');
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', service: 'catalogue' });
});

// Get all products
app.get('/api/products', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const products = await productsCollection
      .find({})
      .skip(skip)
      .limit(limit)
      .toArray();

    const total = await productsCollection.countDocuments();

    res.json({
      success: true,
      data: products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get product by ID
app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await productsCollection.findOne({ _id: parseInt(req.params.id) });
    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    res.json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Search products
app.get('/api/products/search', async (req, res) => {
  try {
    const query = req.query.q || '';
    const products = await productsCollection
      .find({
        $or: [
          { name: { $regex: query, $options: 'i' } },
          { description: { $regex: query, $options: 'i' } },
          { category: { $regex: query, $options: 'i' } }
        ]
      })
      .toArray();

    res.json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create product
app.post('/api/products', async (req, res) => {
  try {
    const { name, description, price, category, image, stock } = req.body;

    if (!name || !price) {
      return res.status(400).json({ success: false, error: 'Name and price are required' });
    }

    const newProduct = {
      _id: await productsCollection.countDocuments() + 1,
      name,
      description,
      price,
      category,
      image,
      stock: stock || 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await productsCollection.insertOne(newProduct);
    res.status(201).json({ success: true, data: newProduct });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update product
app.put('/api/products/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const updates = { ...req.body, updatedAt: new Date() };
    delete updates._id;

    const result = await productsCollection.findOneAndUpdate(
      { _id: id },
      { $set: updates },
      { returnDocument: 'after' }
    );

    if (!result.value) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    res.json({ success: true, data: result.value });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete product
app.delete('/api/products/:id', async (req, res) => {
  try {
    const result = await productsCollection.deleteOne({ _id: parseInt(req.params.id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    res.json({ success: true, message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, error: 'Internal server error' });
});

// Start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Catalogue service running on port ${PORT}`);
  });
});
