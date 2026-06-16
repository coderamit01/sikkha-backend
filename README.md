# Shikkha — Backend

Shikkha is a tutoring marketplace REST API where students can discover tutors, book sessions based on weekly availability, and leave reviews. Tutors can manage their profiles, subjects, and schedules.

## Live URL

| Environment | URL |
|---|---|
| Production API | `https://your-production-url.vercel.app/api` |

## Features

- **Role-based access** — Student, Tutor, and Admin roles with protected routes
- **Authentication** — Email/password auth with secure HTTP-only session cookies via Better Auth
- **JWT tokens** — Access and refresh token flow for stateless authorization
- **Tutor profiles** — Tutors can set hourly rate, years of experience, subjects, and profile image
- **Category & subjects** — Tutors are linked to subject categories
- **Weekly availability** — Tutors define recurring availability by day of week and time range
- **Booking system** — Students book a tutor's availability slot for a specific date; double-booking is prevented at the database level
- **Reviews & ratings** — Students can leave a review and rating after a completed session
- **Image uploads** — Profile images uploaded and hosted via Cloudinary
- **Admin seeding** — Script to seed the initial admin account

## Technologies

| Category | Technology |
|---|---|
| Runtime | Node.js 20 |
| Language | TypeScript |
| Framework | Express.js v5 |
| Database | PostgreSQL |
| ORM | Prisma v7 |
| Authentication | Better Auth |
| Image Storage | Cloudinary + Multer |
| Validation | Zod |
| Deployment | Vercel |

## Project Structure

```
src/
├── app/
│   ├── config/         # Env, Cloudinary, Multer config
│   ├── lib/            # Prisma client, Better Auth setup
│   ├── middleware/     # Authentication middleware
│   ├── modules/        # Feature modules (auth, user, tutor, booking, review, category)
│   │   └── [module]/
│   │       ├── *.controller.ts
│   │       ├── *.service.ts
│   │       └── *.route.ts
│   ├── shared/         # catchAsync, sendResponse helpers
│   └── utils/          # JWT, cookies, Cloudinary upload, admin seed
├── generated/prisma/   # Prisma generated client
└── server.ts
prisma/
└── schema/             # Split Prisma schema files
```

## Setup Instructions

### Prerequisites

- Node.js >= 20
- PostgreSQL database
- Cloudinary account

### 1. Clone the repository

```bash
git clone <repo-url>
cd sikkha-backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the root:

```env
PORT=5000
APP_URL=http://localhost:5000

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/shikkha

# Better Auth
BETTER_AUTH_SECRET=your_better_auth_secret
BETTER_AUTH_URL=http://localhost:3000

# JWT
ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
ACCESS_TOKEN_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d

# Admin seed
ADMIN_EMAIL=admin@shikkha.com
ADMIN_PASSWORD=your_admin_password

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 4. Run database migrations

```bash
npm run migrate
```

### 5. Seed the admin account

```bash
npm run seed:admin
```

### 6. Start the development server

```bash
npm run dev
```

The API will be running at `http://localhost:5000`.

## Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run migrate` | Run Prisma migrations |
| `npm run generate` | Regenerate Prisma client |
| `npm run studio` | Open Prisma Studio |
| `npm run seed:admin` | Seed the admin user |
