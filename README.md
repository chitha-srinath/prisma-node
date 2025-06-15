# Node.js Prisma API

A production-ready Node.js REST API built with Express, TypeScript, and Prisma ORM.

## Features

- 🚀 TypeScript for type safety
- 📦 Express.js for routing and middleware
- 🔐 Prisma ORM for database operations
- 🔒 Security features (Helmet, CORS, Rate Limiting)
- 🐳 Docker support for development and production
- 📝 API documentation
- 🧪 Testing setup
- 🔍 ESLint and Prettier for code quality

## Prerequisites

- Node.js 18 or higher
- Docker and Docker Compose (for containerized development)
- PostgreSQL (if running locally without Docker)

## Getting Started

### Development Setup

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd prisma-node
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:

   ```bash
   cp .env.example .env
   ```

   Edit `.env` with your configuration.

4. Start development server using Docker:
   ```bash
   docker-compose up
   ```
   Or without Docker:
   ```bash
   npm run dev
   ```

### Database Migrations

```bash
# Generate migration
npx prisma migrate dev --name <migration-name>

# Apply migrations
npx prisma migrate deploy
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage
```

### Building for Production

```bash
# Build the application
npm run build

# Start production server
npm start
```

## API Documentation

The API documentation is available at `/api-docs` when running the server.

### Available Endpoints

- `GET /api/todos` - List all todos
- `POST /api/todos` - Create a new todo
- `GET /api/posts` - List all posts
- `POST /api/posts` - Create a new post
- `GET /api/users` - List all users
- `POST /api/users` - Create a new user

## Project Structure

```
prisma-node/
├── src/
│   ├── routes/          # Route definitions
│   ├── controllers/     # Request handlers
│   ├── services/        # Business logic
│   ├── middlewares/     # Custom middlewares
│   ├── utils/          # Utility functions
│   └── types/          # TypeScript type definitions
├── prisma/             # Database schema and migrations
├── tests/              # Test files
├── app.ts             # Express app setup
├── server.ts          # Server entry point
└── package.json       # Project dependencies
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Security

If you discover any security-related issues, please email security@example.com instead of using the issue tracker.

## Support

For support, email support@example.com or open an issue in the repository.
