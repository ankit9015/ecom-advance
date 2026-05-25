// Initialize MongoDB with sample data
db = db.getSiblingDB('catalogue');

// Create collections
db.createCollection('products');

// Insert sample products
db.products.insertMany([
  {
    _id: 1,
    name: 'Laptop Pro',
    description: 'High-performance laptop for professionals',
    price: 1299.99,
    category: 'Electronics',
    image: 'https://via.placeholder.com/300?text=Laptop+Pro',
    stock: 50,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: 2,
    name: 'Wireless Headphones',
    description: 'Premium wireless headphones with noise cancellation',
    price: 199.99,
    category: 'Electronics',
    image: 'https://via.placeholder.com/300?text=Headphones',
    stock: 150,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: 3,
    name: 'USB-C Cable',
    description: 'High-speed USB-C charging and data cable',
    price: 19.99,
    category: 'Accessories',
    image: 'https://via.placeholder.com/300?text=USB+Cable',
    stock: 500,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: 4,
    name: 'Mechanical Keyboard',
    description: 'RGB mechanical keyboard with programmable keys',
    price: 149.99,
    category: 'Electronics',
    image: 'https://via.placeholder.com/300?text=Keyboard',
    stock: 80,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: 5,
    name: '4K Monitor',
    description: '32-inch 4K Ultra HD monitor',
    price: 499.99,
    category: 'Electronics',
    image: 'https://via.placeholder.com/300?text=Monitor',
    stock: 30,
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

print('MongoDB initialized successfully with sample products');