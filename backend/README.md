# Makazi Backend

The backend service for the Makazi Citizen Registration and Management System, built with NestJS.

## 🏗️ Architecture

The backend follows a modular architecture with the following key components:

```
backend/
├── src/
│   ├── admin/           # Admin management module
│   ├── auth/            # Authentication & authorization
│   ├── biometric/       # Biometric verification
│   ├── citizen/         # Citizen registration & management
│   ├── common/          # Shared utilities & decorators
│   ├── config/          # System configuration
│   ├── database/        # Database configuration & migrations
│   ├── document/        # Document management
│   ├── integration/     # External service integrations
│   ├── logging/         # System logging
│   ├── notification/    # Notification system
│   └── reporting/       # Reporting & analytics
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- pnpm (recommended) or npm

### Installation

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Set up environment variables:
   ```bash
   # Create .env file
   DATABASE_HOST=localhost
   DATABASE_PORT=5432
   DATABASE_USERNAME=postgres
   DATABASE_PASSWORD=your_password
   DATABASE_NAME=makazi
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRATION=1d
   ```

3. Run database migrations:
   ```bash
   pnpm run migration:run
   ```

4. Start the development server:
   ```bash
   pnpm run start:dev
   ```

## 📚 API Documentation

The API documentation is available at `http://localhost:30002/api/docs` when running the server.

### Core Modules

#### Authentication (`/auth`)
- `POST /auth/login` - User login
- `POST /auth/refresh` - Refresh token
- `POST /auth/logout` - User logout

#### Admin Management (`/admin`)
- `POST /admin/first-admin` - Create first admin
- `GET /admin` - List all admins
- `POST /admin` - Create new admin
- `GET /admin/:id` - Get admin details
- `PUT /admin/:id` - Update admin
- `DELETE /admin/:id` - Delete admin

#### Citizen Management (`/citizen`)
- `POST /citizen` - Register new citizen
- `GET /citizen` - List all citizens
- `GET /citizen/:id` - Get citizen details
- `PUT /citizen/:id` - Update citizen
- `DELETE /citizen/:id` - Delete citizen

#### Document Management (`/document`)
- `POST /document/citizen/:id` - Upload document
- `GET /document/citizen/:id` - Get citizen documents
- `GET /document/:id` - Get document details
- `PUT /document/:id/verify` - Verify document
- `PUT /document/:id/reject` - Reject document
- `DELETE /document/:id` - Delete document

#### Biometric Management (`/biometric`)
- `POST /biometric/citizen/:id` - Add biometric data
- `GET /biometric/citizen/:id` - Get citizen biometrics
- `POST /biometric/match` - Match biometric data
- `DELETE /biometric/:id` - Delete biometric record

## 🗄️ Database Schema

### Core Tables

#### `admin`
```sql
CREATE TABLE admin (
    id UUID PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    last_login JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### `citizen`
```sql
CREATE TABLE citizen (
    id UUID PRIMARY KEY,
    nida_number VARCHAR(255) UNIQUE,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    date_of_birth DATE NOT NULL,
    gender VARCHAR(50) NOT NULL,
    phone_number VARCHAR(50) NOT NULL,
    email VARCHAR(255),
    address JSONB NOT NULL,
    registration_status VARCHAR(50) NOT NULL,
    biometric_data JSONB,
    documents JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### `document`
```sql
CREATE TABLE document (
    id UUID PRIMARY KEY,
    citizen_id UUID REFERENCES citizen(id),
    document_type VARCHAR(50) NOT NULL,
    document_number VARCHAR(255) NOT NULL,
    document_data JSONB NOT NULL,
    verification_status VARCHAR(50) NOT NULL,
    verified_by UUID REFERENCES admin(id),
    verification_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🔒 Security

### Authentication
- JWT-based authentication
- Token refresh mechanism
- Secure password hashing with bcrypt

### Authorization
- Role-based access control (RBAC)
- Role hierarchy:
  - SUPER_ADMIN
  - ADMIN
  - REGISTRAR
  - VERIFIER

### Data Protection
- Input validation using class-validator
- SQL injection prevention
- XSS protection
- CORS configuration
- Rate limiting

## 🧪 Testing

```bash
# Unit tests
pnpm run test

# e2e tests
pnpm run test:e2e

# Test coverage
pnpm run test:cov
```

## 📦 Deployment

### Production Build
```bash
# Build the application
pnpm run build

# Start production server
pnpm run start:prod
```

### Docker Deployment
```bash
# Build Docker image
docker build -t makazi-backend .

# Run container
docker run -p 30002:30002 makazi-backend
```

## 🔍 Monitoring & Logging

- Structured logging with Winston
- Audit logging for sensitive operations
- Performance monitoring
- Error tracking

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.
