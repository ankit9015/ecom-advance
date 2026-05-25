-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  phone VARCHAR(20),
  address VARCHAR(255),
  city VARCHAR(100),
  state VARCHAR(100),
  zip_code VARCHAR(20),
  country VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create ratings table
CREATE TABLE IF NOT EXISTS ratings (
  id SERIAL PRIMARY KEY,
  product_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create indexes for better query performance
CREATE INDEX idx_ratings_product_id ON ratings(product_id);
CREATE INDEX idx_ratings_user_id ON ratings(user_id);
CREATE INDEX idx_users_email ON users(email);

-- Insert sample users
INSERT INTO users (email, password, first_name, last_name, phone, address, city, state, zip_code, country) VALUES
('john.doe@example.com', '$2b$10$hash_of_password_123', 'John', 'Doe', '555-0101', '123 Main St', 'New York', 'NY', '10001', 'USA'),
('jane.smith@example.com', '$2b$10$hash_of_password_456', 'Jane', 'Smith', '555-0102', '456 Oak Ave', 'Los Angeles', 'CA', '90001', 'USA'),
('bob.wilson@example.com', '$2b$10$hash_of_password_789', 'Bob', 'Wilson', '555-0103', '789 Pine Rd', 'Chicago', 'IL', '60601', 'USA');

-- Insert sample ratings
INSERT INTO ratings (product_id, user_id, rating, review) VALUES
(1, 1, 5, 'Excellent laptop! Very fast and reliable.'),
(1, 2, 4, 'Good quality, but a bit pricey.'),
(2, 1, 5, 'Best headphones I have ever used!'),
(2, 3, 4, 'Great sound quality, comfortable fit.'),
(3, 2, 5, 'Great cable, fast delivery.'),
(4, 3, 5, 'Perfect keyboard for gaming and work.'),
(5, 1, 4, 'Excellent monitor, amazing color reproduction.');

COMMIT;