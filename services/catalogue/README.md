# Catalogue Service

Node.js/Express microservice for managing product catalogue using MongoDB.

## Setup

```bash
cd services/catalogue
npm install
```

## Environment Variables

Create a `.env` file:

```
NODE_ENV=development
MONGODB_URI=mongodb://admin:password@localhost:27017/catalogue?authSource=admin
PORT=5001
```

## Development

```bash
npm run dev
```

## API Endpoints

- `GET /health` - Health check
- `GET /api/products` - List all products
- `GET /api/products/:id` - Get product by ID
- `GET /api/products/search?query=keyword` - Search products
- `POST /api/products` - Create product (admin only)
- `PUT /api/products/:id` - Update product (admin only)
- `DELETE /api/products/:id` - Delete product (admin only)

## Running with Docker

```bash
docker build -t catalogue-service .
docker run -p 5001:5001 --env-file .env catalogue-service
```
