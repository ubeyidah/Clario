<div align="center">

<img src="./public/clario.png" width="120" alt="Clario">

# Clario

**Modern Learning Management System**

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react&logoColor=white)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=flat-square&logo=postgresql&logoColor=white)](https://www.postgresql.org/)

</div>

## Features

- Course management with chapters and lessons
- Student enrollment and progress tracking
- Admin dashboard with user management
- Email/password and OAuth authentication
- Dark mode support
- Email notifications via Resend

## Tech Stack

- **Next.js 16** - App Router
- **React 19** + TypeScript
- **Tailwind CSS 4** + Radix UI
- **PostgreSQL** + Prisma
- **Better Auth** - Authentication
- **Resend** - Emails
- **Arcjet** - Security

## Getting Started

```bash
# Clone
git clone https://github.com/ubeyidah/clario.git
cd clario

# Install
pnpm install

# Setup
cp .env.example .env

# Database
pnpm db:generate
pnpm db:migrate

# Run
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000)

## License

MIT