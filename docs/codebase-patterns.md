# Clario LMS — Codebase Patterns & Development Guidelines

This document outlines the standard engineering patterns, conventions, and architectural best practices implemented across the Clario codebase.

---

## 1. Directory Structure & File Conventions

The repository adheres strictly to Next.js App Router idioms combined with clean domain segregation:

```
├── app/
│   ├── (auth)/                  # Route group for auth flows (clean URLs)
│   │   ├── sign-in/
│   │   └── verify-request/
│   ├── (marketing)/             # Route group for public catalog & marketing
│   │   ├── about/
│   │   └── courses/
│   │       └── [slug]/
│   ├── admin/                   # Admin portal (course authoring, user admin)
│   │   ├── courses/
│   │   │   ├── [courseId]/      # Course details, curriculum builder, lesson editor
│   │   │   └── create/
│   │   └── users/               # User analytics, session management, exports
│   ├── api/                     # API Route Handlers
│   │   ├── auth/[...all]/       # Better Auth mount point
│   │   ├── s3/upload & delete   # S3 Presigned URL generator
│   │   └── webhook/stripe       # Stripe webhook ingress
│   ├── data/                    # Data Access Layer (DAL) — read-only queries
│   │   ├── admin/               # Admin queries & requireAdmin guard
│   │   ├── course/              # Public course queries
│   │   └── user/                # User session & enrollment status queries
│   ├── not-admin/               # Fallback page for non-admin users
│   └── payment/                 # Stripe return handlers (/success, /cancel)
├── components/
│   ├── common/                  # Global components (SiteHeader, Wrapper)
│   ├── file-uploader/           # Tigris/S3 drag & drop file upload component
│   ├── sidebar/                 # Admin responsive sidebar
│   ├── text-editor/             # Tiptap WYSIWYG editor & renderer
│   └── ui/                      # Base shadcn/ui primitive components
├── hooks/
│   ├── try-catch.ts             # Uniform async error handling hook
│   └── use-mobile.ts            # Viewport breakpoint detection
├── lib/                         # Shared utilities, client initializers, and types
│   ├── arcjet.ts                # Arcjet rules & client
│   ├── auth.ts                  # Server Better Auth instance
│   ├── auth-client.ts           # Client Better Auth hook & helpers
│   ├── db.ts                    # Prisma Client singleton
│   ├── env.ts                   # Type-safe environment validation
│   ├── s3-client.ts             # AWS SDK v3 S3 client
│   ├── stripe.ts                # Stripe SDK client
│   ├── types.ts                 # Shared TypeScript interfaces & types
│   └── zod-validation.ts        # Zod validation schemas
└── prisma/
    ├── schema.prisma            # Database schema
    └── migrations/              # Database migration history
```

---

## 2. The Data Access Layer (DAL) Pattern

### Why the DAL?
In Next.js App Router, combining database access with page components or server actions often leads to security oversights and inconsistent caching. Clario segregates all reads into `app/data/`.

### Pattern Implementation
Every data file enforces the server boundary and inspects the incoming request context:

```typescript
// app/data/course/get-course-detail.ts
import "server-only";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";

export const getCourseBySlug = async (slug: string) => {
  const course = await prisma.course.findUnique({
    where: { slug },
    select: {
      id: true,
      title: true,
      description: true,
      fileKey: true,
      price: true,
      duration: true,
      level: true,
      category: true,
      shortDescription: true,
      slug: true,
      chapters: {
        select: {
          id: true,
          title: true,
          lessons: {
            select: {
              id: true,
              title: true,
            },
            orderBy: { position: "asc" },
          },
        },
        orderBy: { position: "asc" },
      },
    },
  });

  if (!course) {
    return notFound();
  }

  return course;
};
```

### Access Guard Helpers
Guard helpers redirect unauthorized requests immediately before page rendering begins:
```typescript
// app/data/admin/require-admin.ts
import "server-only";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect, RedirectType } from "next/navigation";

export const requireAdmin = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return redirect("/sign-in", RedirectType.replace);
  }

  if (session.user.role === "admin") {
    return session;
  }

  return redirect("/not-admin", RedirectType.replace);
};
```

---

## 3. The Server Action Mutation Pattern

All state-altering actions implement a consistent 6-step lifecycle:
1. **Authorization**: Call `requireAdmin()` or `requireUser()`.
2. **Abuse Prevention**: Query `aj.protect(req, { fingerprint })` using Arcjet.
3. **Input Validation**: Validate payload using Zod `schema.safeParse(body)`.
4. **Database Execution**: Execute Prisma queries within `prisma.$transaction()` when modifying related records.
5. **Cache Invalidation**: Revalidate impacted route paths via `revalidatePath()`.
6. **Unified Response**: Return standard `ApiResponse { success: boolean; message: string; data?: T }`.

### Action Implementation Example:
```typescript
// app/admin/courses/create/actions.ts
"use server";

import { requireAdmin } from "@/app/data/admin/require-admin";
import arcjet, { detectBot, fixedWindow } from "@/lib/arcjet";
import { prisma } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { ApiResponse, CourseSchema } from "@/lib/types";
import { courseSchema } from "@/lib/zod-validation";
import { request } from "@arcjet/next";

const aj = arcjet
  .withRule(detectBot({ mode: "LIVE", allow: [] }))
  .withRule(fixedWindow({ mode: "LIVE", window: "5m", max: 3 }));

export const createCourseA = async (body: CourseSchema): Promise<ApiResponse> => {
  const session = await requireAdmin();
  try {
    const req = await request();
    const decision = await aj.protect(req, { fingerprint: session.user.id });

    if (decision.isDenied()) {
      if (decision.reason.isBot()) {
        return { success: false, message: "We detected automated activity." };
      }
      return { success: false, message: "Rate limit exceeded. Please wait." };
    }

    const { success, data, error } = courseSchema.safeParse(body);
    if (!success) {
      return { success: false, message: error.issues[0].message };
    }

    // External Stripe synchronization
    const stripeCourse = await stripe.products.create({
      name: data.title,
      description: data.shortDescription,
      default_price_data: {
        currency: "etb",
        unit_amount: Math.round(data.price * 100),
      },
    });

    // Database persistence
    await prisma.course.create({
      data: {
        ...data,
        userId: session.user.id,
        stripePriceId: stripeCourse.default_price as string,
      },
    });

    return { success: true, message: "Course created successfully" };
  } catch (error) {
    return { success: false, message: "Internal server error" };
  }
};
```

---

## 4. Client-Side Mutation & Transition Pattern

On the client side, asynchronous Server Actions are invoked inside React's `useTransition()` paired with the custom `tryCatch` utility. This prevents UI locking, provides pending state, and catches unexpected exceptions.

```typescript
// hooks/try-catch.ts
type Success<T> = { data: T; error: null };
type Failure<E> = { data: null; error: E };
type Result<T, E = Error> = Success<T> | Failure<E>;

export const tryCatch = async <T, E = Error>(
  promise: Promise<T>,
): Promise<Result<T, E>> => {
  try {
    const data = await promise;
    return { data, error: null };
  } catch (error) {
    return { data: null, error: error as E };
  }
};
```

### Client Form Invocation Pattern
```tsx
const [isPending, startTransition] = useTransition();

const onSubmit = (formData: CourseSchema) => {
  startTransition(async () => {
    const { data: res, error } = await tryCatch(createCourseA(formData));
    if (error) {
      toast.error("An unexpected error occurred.");
      return;
    }
    if (res?.success) {
      toast.success(res.message);
      router.push("/admin/courses");
    } else {
      toast.error(res?.message || "Failed to create course");
    }
  });
};
```

---

## 5. Direct S3 Upload Pattern with Presigned URLs

### Architecture
To keep Next.js server resources low and avoid memory limits on large video uploads, files are transmitted directly from the client to the Tigris/S3 bucket.

```
Client File Select
       │
       ▼
POST /api/s3/upload (Metadata: filename, size, contentType)
       │
       ▼
Server validates with Zod & checks requireAdmin()
       │
       ▼
Returns { uploadUrl: "https://...presigned...", key: "uuid-filename.mp4" }
       │
       ▼
Client executes direct HTTP PUT: fetch(uploadUrl, { method: "PUT", body: file })
       │
       ▼
Client sends `key` to Server Action to persist in Prisma
```

### Client File Uploader Component
Implemented in `components/file-uploader/uploader.tsx`:
- Validates file type (video vs image) and max sizes (e.g., 50MB image, 500MB video).
- Provides drag-and-drop feedback with upload progress indicators.
- Automatically handles deletion of obsolete files via `POST /api/s3/delete` when replacing an asset.

---

## 6. Drag-and-Drop Curriculum Ordering Pattern

Chapters and lessons support intuitive visual reordering using `@hello-pangea/dnd`:

1. **Optimistic Local State Update**:
   When a user drops an item, the local array is immediately reordered and positions recalculated `(index + 1)`.
2. **Server Action Batch Synchronization**:
   The reordered array of `{ id: string; position: number }` is sent to `reorderChaptersA` or `reorderLessonsA`.
3. **Database Transaction**:
   The server wraps the updates in a single `prisma.$transaction()`:
   ```typescript
   const updates = chapters.map((chapter) =>
     prisma.chapter.update({
       where: { id: chapter.id, courseId },
       data: { position: chapter.position },
     }),
   );
   await prisma.$transaction(updates);
   revalidatePath(`/admin/courses/${courseId}/edit`);
   ```

---

## 7. Rich-Text Management Pattern (Tiptap)

Course long descriptions are authored using Tiptap and stored as structured JSON:
- **Authoring**: `components/text-editor/editor.tsx` provides a rich toolbar (headings, bold, lists, quotes, undo/redo).
- **Storage**: The editor serializes state to JSON: `JSON.stringify(editor.getJSON())`.
- **Rendering**: `components/text-editor/render-editor.tsx` deserializes the JSON using `@tiptap/html` or headless React renderer with Tailwind typography styling (`prose prose-sm dark:prose-invert`).
