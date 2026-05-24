# Amihan Staycation

![Next.js](https://img.shields.io/badge/Next.js-000000.png?logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?logo=react)
![Express](https://img.shields.io/badge/Express-black?logo=express)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-blue?logo=postgresql&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)

## Team Members

**Project Lead**

- Arjohn Banado

**Documentation**

- John Lawrence Amihan
- John Bennidick Bernal

**UI/UX**

- John Lawrence Amihan

**Frontend Developers**

- Arjohn Banado
- Gregory Austero
- Nathaniel Andoy

**Backend Developers**

- Arjohn Banado
- Rashed Carnain
- Aldwin Santos

## Project Overview

A full-stack web application with a Next.js frontend and an Express backend. The system provides authenticated user flows, booking and payment management, notifications, and reviews in a scalable full-stack architecture.

## Features

- Role-based access for users, admins, and agents
- Secure authentication with JWT and server-managed sessions
- Booking creation and history tracking
- Payment method management
- Notifications and real-time updates
- Reviews and ratings workflow
- Admin management tools

## Tech Stack

**Frontend**

- Next.js (App Router)
- TypeScript
- React
- Tailwind CSS / MUI
- SWR / Apollo Client

**Backend**

- Node.js + Express
- TypeScript
- Prisma + PostgreSQL (or compatible SQL database)
- JWT authentication
- Socket.IO for notifications

**Tooling**

- Jest
- ESLint
- PostCSS

## Installation

### Prerequisites

- Node.js (>= 18)
- npm or yarn
- Database (PostgreSQL or compatible)

### Clone

```bash
git clone https://github.com/Project2START/amihan-staycation.git
cd amihan-staycation
```

### Install Dependencies

```bash
cd frontend
npm install

cd ../backend
npm install
```

## Environment Variables

Environment configuration details are shared only with approved contributors. Please coordinate with the Project Lead or IT Head to obtain the required variables and access instructions.

## Running the Project Locally

### Backend

```bash
cd backend
npm run dev
```

### Frontend

```bash
cd frontend
npm run dev
```

## Scripts/Commands

### Frontend

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run test
```

### Backend

```bash
npm run dev
npm run test
```

## Folder Structure

```text
amihan-staycation/
  backend/
    prisma/
    src/
      app.ts
      server.ts
      graphql/
      middleware/
      modules/
      shared/
  frontend/
    src/
      app/
      lib/
      proxyModules/
    public/
```

## API Overview

- REST API under `/api/*` (users, products, bookings, payments, reviews, notifications)
- GraphQL endpoint at `/graphql`
- Socket.IO for real-time notifications

## Authentication Flow

- Credentials and OAuth handled via backend services.
- Next.js server issues and stores `auth_token` in HTTP-only cookies.
- Frontend retrieves the token via a Next.js API route and sends it to the backend as:
  ```http
    Authorization: Bearer <token>
  ```
- Backend accepts Bearer tokens with cookie fallback for compatibility.

## Deployment

- Frontend: Vercel
- Backend: Render
- Database: Managed PostgreSQL (Supabase)

## Contributing Guidelines

1. Create a feature branch: `git checkout -b feature/<name>`
2. Commit with clear messages.
3. Open a pull request with a concise description and screenshots if UI changes.
4. Ensure tests pass before requesting review.

## License

This is a university requirements project developed with real stakeholders and external clients. Licensing and distribution rights are subject to institutional and client agreements. A formal license file will be added if and when it is approved.

## Future Improvements

- Real-time in-app chat
- SMS and email booking status notifications
- Same-platform domain deployment for frontend and backend
- Mobile app
