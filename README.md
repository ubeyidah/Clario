<div align="center">

# 🎓 Clario

**Modern Learning Management System Built with Next.js**

[![Next.js](https://img.shields.io/badge/Next.js-16.0.7-black?style=flat-square&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.0-blue?style=flat-square&logo=react&logoColor=white)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-blue?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1.17-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-7.1.0-2D3748?style=flat-square&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=flat-square&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

A comprehensive, scalable Learning Management System designed for modern educational institutions. Clario provides an intuitive platform for course management, student enrollment, and interactive learning experiences.

</div>

## ✨ Features

- 🚀 **Modern Tech Stack** - Built with Next.js 16, React 19, and TypeScript
- 🎨 **Beautiful UI** - Responsive design with Tailwind CSS and Radix UI components
- 🔐 **Secure Authentication** - Better Auth integration with email verification
- 📊 **Analytics Dashboard** - Real-time insights with Recharts
- 🌙 **Dark Mode Support** - Seamless theme switching
- 📱 **Mobile Responsive** - Optimized for all devices
- 🗄️ **Robust Database** - PostgreSQL with Prisma ORM
- 📧 **Email Notifications** - Resend integration for transactional emails
- 🛡️ **Security First** - Arcjet protection and rate limiting
- 🎯 **Type Safety** - Full TypeScript coverage with Zod validation

## 🏗️ Architecture

### Tech Stack

| Category             | Technology                 |
| -------------------- | -------------------------- |
| **Framework**        | Next.js 16 (App Router)    |
| **Frontend**         | React 19, TypeScript 5.9   |
| **Styling**          | Tailwind CSS 4.1, Radix UI |
| **Database**         | PostgreSQL, Prisma 7.1     |
| **Authentication**   | Better Auth 1.4            |
| **Email**            | Resend 6.5                 |
| **Security**         | Arcjet 1.0-beta            |
| **Forms**            | React Hook Form, Zod       |
| **Charts**           | Recharts 2.15              |
| **State Management** | React Context, Hooks       |

### Project Structure

```
clario/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Authentication routes
│   │   ├── sign-in/             # Sign-in page
│   │   └── verify-request/      # Email verification
│   ├── (marketing)/             # Public marketing pages
│   │   ├── _components/         # Marketing components
│   │   └── page.tsx             # Landing page
│   ├── api/                     # API routes
│   │   └── auth/               # Authentication endpoints
│   ├── globals.css             # Global styles
│   └── layout.tsx              # Root layout
├── components/                  # Reusable components
│   ├── common/                 # Shared components
│   ├── ui/                     # UI component library
│   ├── mode-toggle.tsx         # Theme switcher
│   └── theme-provider.tsx      # Theme context
├── hooks/                       # Custom React hooks
├── lib/                         # Utility libraries
│   ├── auth.ts                 # Authentication configuration
│   ├── db.ts                   # Database client
│   ├── email/                  # Email templates
│   └── utils.ts                # Helper functions
├── prisma/                      # Database schema & migrations
│   ├── schema.prisma           # Database model
│   └── migrations/             # Migration files
└── public/                      # Static assets
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- pnpm (recommended) or npm/yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/ubeyidah/clario.git
   cd clario
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Environment setup**

   ```bash
   cp .env.example .env.local
   ```

   Configure your environment variables:

   ```env
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/clario"
   BETTER_AUTH_URL="http://localhost:3000"
   BETTER_AUTH_SECRET=""
   GITHUB_CLIENT_ID=""
   GITHUB_CLIENT_SECRET=""
   RESEND_API_KEY=""
   ARCJET_KEY=""
   ```

4. **Database setup**

   ```bash
   pnpm db:generate
   pnpm db:migrate
   ```

5. **Start development server**

   ```bash
   pnpm dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📚 Available Scripts

| Script             | Description              |
| ------------------ | ------------------------ |
| `pnpm dev`         | Start development server |
| `pnpm build`       | Build for production     |
| `pnpm start`       | Start production server  |
| `pnpm lint`        | Run ESLint               |
| `pnpm db:generate` | Generate Prisma client   |
| `pnpm db:migrate`  | Run database migrations  |
| `pnpm db:push`     | Push schema to database  |
| `pnpm db:studio`   | Open Prisma Studio       |

### Authentication

Clario uses Better Auth for secure authentication:

- Email/password authentication
- Email verification
- Session management
- OAuth provider support (ready for Google, GitHub, etc.)

### Security Features

- **Arcjet Integration** - Rate limiting and bot protection
- **CSRF Protection** - Built-in Next.js security
- **Input Validation** - Zod schema validation
- **Secure Headers** - Optimized security headers

### Email System

- **Resend Integration** - Reliable email delivery
- **Email Templates** - Customizable email designs
- **Transactional Emails** - Verification, notifications, etc.

### Key Components

- Authentication forms
- Navigation components
- Dashboard widgets
- Data tables
- Charts and graphs
- Modals and dialogs

## 🌱 Development

### Code Style

- **ESLint** - Code linting and formatting
- **TypeScript** - Type safety and IntelliSense
- **Prettier** - Code formatting (configured via ESLint)

### Best Practices

- Component-driven development
- Responsive design first
- Accessibility focused
- Performance optimized
- SEO friendly

## 📈 Performance

Clario is optimized for performance:

- **Next.js 16** - Latest performance improvements
- **React 19** - Concurrent features
- **Code Splitting** - Automatic route-based splitting
- **Image Optimization** - Next.js Image component
- **Bundle Analysis** - Optimized dependencies

### Environment Variables

Ensure all required environment variables are set in production:

- `DATABASE_URL`
- `AUTH_SECRET`
- `AUTH_URL`
- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`
- `ARCJET_KEY`

## 🤝 Contributing

We welcome contributions! Please read our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License
