# E-Commerce Advanced Architecture

A microservice-based e-commerce platform built with Node.js, Python, and React, demonstrating incremental complexity across multiple phases.

## Project Structure

```
ecom-advance/
├── frontend/              # React application
├── services/
│   ├── catalogue/         # Node.js - MongoDB (product catalogue)
│   ├── user/              # Node.js - PostgreSQL (user management)
│   └── ratings/           # Python - PostgreSQL (product ratings)
├── docker-compose.yaml    # Orchestration
├── .env                   # Environment variables
└── docs/                  # Documentation
```

## Phase 1: MVP (Current)

### Services
- **Catalogue Service** (Node.js) - MongoDB: Product listings and search
- **User Service** (Node.js) - PostgreSQL: User registration and profiles
- **Ratings Service** (Python) - PostgreSQL: Product ratings and reviews
- **Frontend** (React): Browse products, view ratings, user profile

### Features
- Product browsing
- User registration and login
- View product ratings
- No async messaging yet
- No caching yet

### Tech Stack
- **Frontend**: React 18, Axios, React Router
- **Backend**: Node.js (Express), Python (Flask)
- **Databases**: MongoDB (Catalogue), PostgreSQL (User & Ratings)
- **Containerization**: Docker & Docker Compose

## Getting Started

### Prerequisites
- Docker & Docker Compose
- Node.js 18+ (for local development)
- Python 3.9+ (for local development)

### Quick Start

```bash
# Clone the repo
git clone https://github.com/ankit9015/ecom-advance.git
cd ecom-advance

# Start all services with Docker Compose
docker-compose up

# Frontend: http://localhost:3000
# Catalogue API: http://localhost:5001
# User API: http://localhost:5002
# Ratings API: http://localhost:5003
```

### Local Development

See individual service README files in each service directory.

## API Endpoints

### Catalogue Service (Port 5001)
- `GET /api/products` - List all products
- `GET /api/products/:id` - Get product details
- `GET /api/products/search?query=keyword` - Search products

### User Service (Port 5002)
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id` - Update profile

### Ratings Service (Port 5003)
- `GET /api/ratings/product/:productId` - Get product ratings
- `POST /api/ratings` - Add rating
- `GET /api/ratings/:id` - Get rating details

## Phases

### Phase 1 (Current) ✅
- Basic CRUD operations
- Simple authentication
- Separate databases for different concerns

### Phase 2 (Coming)
- Redis caching layer
- API Gateway
- Improved error handling

### Phase 3 (Coming)
- RabbitMQ for async messaging
- Cart service
- Payment service

### Phase 4 (Coming)
- Health checks
- Logging and monitoring
- Docker networking improvements
- Production-ready configuration

## Architecture Decisions

### Database Selection
- **MongoDB** (Catalogue): Document-oriented, flexible schema for product data
- **PostgreSQL** (User & Ratings): ACID compliance, relational data, strong consistency

### Service Communication
- **Phase 1**: Direct HTTP calls
- **Phase 2+**: API Gateway + Message Queue

## Documentation

- [Frontend Setup](./frontend/README.md)
- [Catalogue Service](./services/catalogue/README.md)
- [User Service](./services/user/README.md)
- [Ratings Service](./services/ratings/README.md)

## License

MIT
