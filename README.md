# Makazi - Citizen Registration and Management System

Makazi is a comprehensive citizen registration and management system built with NestJS (backend) and Next.js (frontend). The system provides robust features for citizen registration, document management, biometric verification, and administrative oversight.

## 🏗️ Architecture

The project is structured as a monorepo with two main applications:

```
makazi/
├── backend/           # NestJS application
└── frontend/         # Next.js application
```

### Backend (NestJS)

The backend is built with NestJS and provides a robust API with the following features:

- **Authentication & Authorization**
  - JWT-based authentication
  - Role-based access control (RBAC)
  - Secure password hashing

- **Core Modules**
  - Admin Management
  - Citizen Registration
  - Document Management
  - Biometric Verification
  - Audit Logging
  - System Configuration
  - Integration Services

- **Database**
  - PostgreSQL database
  - UUID-based primary keys
  - Proper indexing and relationships
  - Migration system

### Frontend (Next.js)

The frontend is built with Next.js and provides a modern, responsive user interface:

- **Features**
  - Modern UI with responsive design
  - Type-safe development with TypeScript
  - Efficient state management
  - Real-time updates

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- pnpm (recommended) or npm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Mdoe-Tech/makazi.git
   cd makazi
   ```

2. Install dependencies:
   ```bash
   # Install backend dependencies
   cd backend
   pnpm install

   # Install frontend dependencies
   cd ../frontend
   pnpm install
   ```

3. Set up environment variables:
   ```bash
   # Backend (.env)
   DATABASE_HOST=localhost
   DATABASE_PORT=5432
   DATABASE_USERNAME=postgres
   DATABASE_PASSWORD=your_password
   DATABASE_NAME=makazi

   # Frontend (.env.local)
   NEXT_PUBLIC_API_URL=http://localhost:30002
   ```

4. Run database migrations:
   ```bash
   cd backend
   pnpm run migration:run
   ```

### Development

1. Start the backend:
   ```bash
   cd backend
   pnpm run start:dev
   ```

2. Start the frontend:
   ```bash
   cd frontend
   pnpm run dev
   ```

## 📚 API Documentation

The API documentation is available at `http://localhost:30002/api/docs` when running the backend server.

### Key Endpoints

- **Authentication**
  - POST `/auth/login` - User login
  - POST `/auth/refresh` - Refresh token

- **Admin**
  - POST `/admin/first-admin` - Create first admin
  - GET `/admin` - List all admins
  - POST `/admin` - Create new admin

- **Citizen**
  - POST `/citizen` - Register new citizen
  - GET `/citizen` - List all citizens
  - GET `/citizen/:id` - Get citizen details

- **Document**
  - POST `/document/citizen/:id` - Upload document
  - GET `/document/citizen/:id` - Get citizen documents

- **Biometric**
  - POST `/biometric/citizen/:id` - Add biometric data
  - GET `/biometric/citizen/:id` - Get citizen biometrics

## 🗄️ Database Schema

The system uses PostgreSQL with the following main tables:

- `admin` - Administrator accounts
- `citizen` - Citizen records
- `document` - Document management
- `biometric` - Biometric data
- `notifications` - System notifications
- `audit_logs` - System audit trail
- `system_configs` - System configuration
- `integration_config` - External integrations

## 🔒 Security Features

- JWT-based authentication
- Role-based access control
- Password hashing with bcrypt
- Audit logging
- Input validation
- CORS protection
- Rate limiting

## 🧪 Testing

```bash
# Backend tests
cd backend
pnpm run test
pnpm run test:e2e

# Frontend tests
cd frontend
pnpm run test
```

## 📦 Deployment

### Backend Deployment

1. Build the application:
   ```bash
   cd backend
   pnpm run build
   ```

2. Start the production server:
   ```bash
   pnpm run start:prod
   ```

### Frontend Deployment

1. Build the application:
   ```bash
   cd frontend
   pnpm run build
   ```

2. Start the production server:
   ```bash
   pnpm run start
   ```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Mdoe Tech** - *Initial work* - [Mdoe-Tech](https://github.com/Mdoe-Tech)

## 🙏 Acknowledgments

- NestJS team for the amazing framework
- Next.js team for the frontend framework
- All contributors who have helped shape this project 