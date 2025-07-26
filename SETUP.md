# Full-Stack Application Setup

This application consists of a Next.js frontend and Express.js backend connected together.

## Architecture

- **Frontend**: Next.js 15 application in `apps/web` (port 3000)
- **Backend**: Express.js API in `apps/http_backend` (port 3001)
- **Database**: Uses Prisma ORM (configured in `packages/db`)

## API Endpoints

The backend provides these endpoints:

- `POST /api/v1/user/signup` - User registration
- `POST /api/v1/user/signin` - User login (returns JWT token)
- `GET /api/v1/user/profile` - Get user profile (requires authentication)

## Frontend Pages

- `/` - Home page with navigation
- `/signup` - User registration form
- `/signin` - User login form
- `/dashboard` - Protected user dashboard showing profile

## Running the Application

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Set up the Database

Make sure your database is configured in `packages/db`. You may need to:

```bash
cd packages/db
npx prisma db push
# or
npx prisma migrate dev
```

### 3. Start Both Applications

From the root directory:

```bash
pnpm dev
```

This will start:
- Frontend at http://localhost:3000
- Backend at http://localhost:3001

### 4. Test the Integration

1. Visit http://localhost:3000
2. Click "Create Account" to register a new user
3. After successful registration, sign in
4. You'll be redirected to the dashboard showing your profile

## Authentication Flow

1. User registers via `/signup` page
2. Backend creates user in database with hashed password
3. User signs in via `/signin` page
4. Backend validates credentials and returns JWT token
5. Frontend stores token in localStorage
6. Protected routes use the token to access user data
7. Dashboard displays user profile fetched from backend

## Environment Variables

Frontend uses:
- `NEXT_PUBLIC_API_URL` - Backend API URL (defaults to http://localhost:3001)

Backend uses:
- JWT secret is configured in `apps/http_backend/src/config.ts`

## Tech Stack

### Frontend
- Next.js 15 with App Router
- TypeScript
- Custom CSS Modules
- React 19

### Backend
- Express.js
- TypeScript
- JWT for authentication
- bcrypt for password hashing
- CORS enabled
- Zod for validation

### Database
- Prisma ORM
- User model with id, email, username, password

## Features

✅ User registration and authentication  
✅ JWT token-based security  
✅ Password hashing with bcrypt  
✅ Responsive design  
✅ Error handling  
✅ API client with token management  
✅ Protected routes  
✅ User profile display  

The frontend and backend are now fully connected and provide a complete authentication flow!