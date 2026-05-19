# Q&A Forum API (NestJS)

Backend service for a simple Q&A forum. Provides authentication, user profiles,
thread creation, and replies, with a documented REST API.

## Features

- JWT-based auth (register/login)
- Threads and replies API
- User profiles
- Validation and Swagger/OpenAPI docs

## Tech stack

- NestJS + TypeScript
- PostgreSQL + TypeORM
- JWT (passport-jwt)
- Swagger UI

## Requirements

- Node.js 20+
- PostgreSQL database

## Environment variables

Create a `.env` file in this folder:

```bash
DATABASE_URL=postgres://user:password@localhost:5432/forum
JWT_SECRET=your-secret
JWT_EXPIRES_IN=7d
PORT=3000
FRONTEND_URL=http://localhost:5173
```

## Setup

```bash
npm install
```

## Run the server

```bash
# development (watch mode)
npm run start:dev

# production
npm run start:prod
```

API base path: `http://localhost:3000/api`
Swagger docs: `http://localhost:3000/api/docs`

## Useful scripts

```bash
npm run build
npm run lint
npm run test
npm run test:e2e
npm run test:cov
npm run seed
```

## Notes

- In development, TypeORM auto-syncs schema when `NODE_ENV=development`.
