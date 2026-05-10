<div align="center">

![Clario](./public/clario.png)

# Clario

**Modern Learning Management System**

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react&logoColor=white)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=flat-square&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

A full-featured learning management system with course creation, student enrollment, progress tracking, and secure authentication.

</div>

## Features

- **Course Management** - Create and organize courses with chapters and lessons
- **Student Enrollment** - Track student progress and completion
- **Admin Dashboard** - User management, analytics, and oversight
- **Secure Auth** - Better Auth with email/password and OAuth
- **Dark Mode** - Full theme support
- **Email Notifications** - Resend integration

## Tech Stack

| Category | Technology |
|----------|-------------|
| Framework | Next.js 16 (App Router) |
| Frontend | React 19, TypeScript |
| Styling | Tailwind CSS 4, Radix UI |
| Database | PostgreSQL, Prisma |
| Auth | Better Auth |
| Email | Resend |
| Security | Arcjet |

## Quick Start

```bash
# Clone
git clone https://github.com/ubeyidah/clario.git
cd clario

# Install
pnpm install

# Setup env
cp .env.example .env

# Database
pnpm db:generate
pnpm db:migrate

# Run
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

## Environment Variables

```env
DATABASE_URL=
BETTER_AUTH_URL=
BETTER_AUTH_SECRET=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
RESEND_API_KEY=
ARCJET_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
NEXT_PUBLIC_S3_BUCKET_NAME_IMG=
```

## License

MIT