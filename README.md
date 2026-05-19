# Q&A Forum API (NestJS)

Backend service for a simple Q&A forum. Provides authentication, user profiles,
thread creation, and replies with a documented REST API.

## Features

- JWT-based auth (register/login)
- Thread and reply management
- User profiles
- Validation plus Swagger/OpenAPI docs

## Tech stack

- NestJS + TypeScript
- PostgreSQL + TypeORM
- Passport JWT
- Swagger UI

## Requirements

- Node.js 20+
- PostgreSQL database

## Environment variables

Create a `.env` file in this folder:

```env
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

## Access

- API base path: http://localhost:3000/api
- Swagger docs: http://localhost:3000/api/docs

## Useful scripts

```bash
npm run build
npm run lint
npm run test
npm run test:e2e
npm run test:cov
npm run seed
```

## Screenshots

<details>
<summary>Swagger UI and sample endpoints</summary>

![Screenshot of Swagger UI showing API documentation](images/image.png)
![Screenshot of GET request /api/users/{id}](images/image1.png)
![Screenshot of POST request /api/auth/register](images/image2.png)
![Screenshot of POST request /api/auth/login](images/image3.png)
![Screenshot of GET request /api/threads](images/image4.png)
![Screenshot of POST request /api/threads](images/image5.png)
![Screenshot of GET request /api/threads/my-threads](images/image6.png)
![Screenshot of GET request /api/threads/{id}](images/image7.png)

</details>

## Notes

- In development, TypeORM auto-syncs schema when `NODE_ENV=development`.
