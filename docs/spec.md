# Clario LMS — Specification & Implementation Status

This specification outlines what is currently implemented, what is partially implemented or in need of fixes, and the detailed technical blueprint for what remains to be built—with a primary focus on the **Student Learning Portal**.

---

## 1. Feature Implementation Matrix

| Module | Feature | Status | Notes |
|---|---|:---:|---|
| **Auth** | Email OTP Login | ✅ Complete | Prints to terminal in dev; sends via Resend in prod. |
| **Auth** | OAuth (Google & GitHub) | 🟡 Configured | Placeholders in `.env`; Better Auth integration ready. |
| **Auth** | Session Management | ✅ Complete | Better Auth with Prisma adapter; cookie-based. |
| **Security** | Arcjet Bot Protection | ✅ Complete | Guarding course creation and checkout endpoints. |
| **Security** | Arcjet Rate Limiting | ✅ Complete | Sliding and fixed window rules active. |
| **Storage** | S3 / Tigris Presigned Uploads | ✅ Complete | Direct-to-bucket upload via `/api/s3/upload`. |
| **Storage** | S3 Asset Deletion | ✅ Complete | Deletes old thumbnails and videos via `/api/s3/delete`. |
| **Admin** | Course Listing & Search | ✅ Complete | Server-rendered with pagination and filters. |
| **Admin** | Course Creation | ✅ Complete | Auto-generates Stripe Product, uploads thumbnail. |
| **Admin** | Course Editing | 🟡 Partial | Metadata updates work; Stripe product ID & price update bug. |
| **Admin** | Curriculum Builder (Chapters) | ✅ Complete | Create, delete, and drag-and-drop reorder. |
| **Admin** | Lesson Management | ✅ Complete | Create, edit, delete, S3 video upload, drag-and-drop reorder. |
| **Admin** | User Management | ✅ Complete | User table, sessions view, revoke session, CSV/JSON export. |
| **Marketing** | Landing Page (`/`) | ✅ Complete | Hero, Features, CTA, Testimonials. |
| **Marketing** | About Page (`/about`) | ✅ Complete | Static information and team details. |
| **Marketing** | Course Catalog (`/courses`) | ✅ Complete | Course grid with category filters and search. |
| **Marketing** | Course Detail (`/courses/[slug]`) | ✅ Complete | Detailed syllabus, pricing card, enroll button. |
| **Commerce** | Stripe Checkout Creation | ✅ Complete | Redirects student to hosted Stripe Checkout. |
| **Commerce** | Stripe Webhook Processing | ✅ Complete | Marks `Enrollment` as `ACTIVE` upon payment completion. |
| **Student** | Student Dashboard (`/dashboard`) | ❌ **Missing** | Link exists in `EnrollmentButton`, but route does not exist. |
| **Student** | Enrolled Courses Overview | ❌ **Missing** | No page displaying student's purchased courses. |
| **Student** | Course Classroom / Player Route | ❌ **Missing** | No classroom layout or video player view. |
| **Student** | Video Player Component | ❌ **Missing** | Need responsive player for Tigris/S3 video files. |
| **Student** | Lesson Progress Tracking | ❌ **Missing** | No `LessonProgress` schema, action, or state persistence. |
| **Student** | Progress Calculation & Next Lesson | ❌ **Missing** | No logic to resume next unfinished lesson. |
| **Student** | Course Completion State | ❌ **Missing** | No completion banner, summary, or certificate view. |
| **Platform** | Route Middleware | 🟡 Partial | `proxy.ts` is in root but not recognized by Next.js as middleware. |
| **Platform** | Error & Not-Found Boundaries | 🟡 Partial | Generic `error.tsx` and custom `not-found.tsx` needed. |

---

## 2. Detailed Technical Gap Analysis

### 2.1 The Missing Student Learning Experience (Priority #1)

Currently, when a user successfully enrolls in a course or returns to a previously purchased course, `EnrollmentButton.tsx` renders:
```tsx
if (isEnrolled) {
  return (
    <Link href="/dashboard" className={buttonVariants({ className: "w-full" })}>
      Watch now
    </Link>
  );
}
```
However, **no `/dashboard` route exists**, and there is no interface for students to watch lessons or track their learning.

#### Missing Student Components & Pages:
1. **Student Dashboard (`/dashboard`)**:
   - Header with greeting, active enrollment count, completed courses count, and total learning time.
   - "Continue Learning" hero card linking directly to the last active lesson.
   - Enrolled courses grid with progress percentage bar (`% completed`).
2. **Classroom / Course Player Route (`/learn/[courseId]/[lessonId]` or `/courses/[slug]/learn/[lessonId]`)**:
   - **Split-Screen / Theater Layout**:
     - **Left/Center Main Area**:
       - Video player for streaming S3 video (`https://clario.t3.storage.dev/${videoFileKey}`).
       - Lesson title and navigation header (Back to Dashboard, Next/Previous Lesson buttons).
       - Rich-text lesson notes / description (rendered using Tiptap content).
       - "Mark as Complete & Next" action button.
     - **Right/Sidebar Area (Collapsible)**:
       - Course progress bar (e.g. `7 / 12 lessons completed (58%)`).
       - Chapter accordion listing all lessons.
       - Visual checkmarks indicating completed lessons.
       - Lock indicators for unenrolled visitors (with authorization barrier).
3. **Database Schema Requirement: `LessonProgress`**:
   The current Prisma schema tracks `Enrollment`, but does not track whether individual lessons are completed.
   ```prisma
   model LessonProgress {
     id          String    @id @default(cuid())
     completed   Boolean   @default(false)
     completedAt DateTime?

     userId      String
     user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)

     lessonId    String
     lesson      Lesson    @relation(fields: [lessonId], references: [id], onDelete: Cascade)

     createdAt   DateTime  @default(now())
     updatedAt   DateTime  @updatedAt

     @@unique([userId, lessonId])
     @@index([userId])
     @@index([lessonId])
   }
   ```
4. **Data Access & Server Actions Required**:
   - `app/data/student/get-enrolled-courses.ts`: Fetches all courses where `enrollment.status == 'ACTIVE'`, with progress calculation.
   - `app/data/student/get-lesson-view.ts`: Validates enrollment, fetches lesson video key, title, description, and neighbor lessons (prev/next).
   - `app/student/actions.ts`:
     - `toggleLessonProgressA(lessonId: string, completed: boolean)`: Toggles completion state and returns updated course progress.

---

### 2.2 Payment & Money Precision Audit

1. **Floating Point Currency Storage**:
   - `Course.price` and `Enrollment.amount` are modeled as `Float` in Prisma schema. In PostgreSQL, `Float` maps to `DOUBLE PRECISION`, which suffers from floating-point arithmetic drift.
   - **Fix**: Migrate schema to integer minor units (`priceInCents Int`) or PostgreSQL `Decimal`.
2. **Stripe Unit Amount Integer Validation**:
   - In `app/admin/courses/create/actions.ts`, unit amount is passed as `data.price * 100`. If a user enters `49.99`, IEEE 754 float multiplication can evaluate to `4999.000000000001`, causing Stripe API rejection.
   - **Fix**: Wrap with `Math.round(data.price * 100)`.
3. **Course Update Stripe Mismatch**:
   - In `app/admin/courses/[courseId]/edit/actions.ts`:
     ```ts
     await stripe.products.update(course.id, { ... });
     ```
     `course.id` is the internal CUID (e.g. `cm...`), not the Stripe Product ID (`prod_...`). Clario currently only stores `stripePriceId` in the database.
   - **Fix**: Add `stripeProductId String?` to the `Course` model, populate it on course creation, and use it in `stripe.products.update`.

---

### 2.3 Route Middleware & Protection

- `proxy.ts` is placed in the project root, but Next.js expects `middleware.ts`.
- The matcher in `proxy.ts` currently covers `["/admin/:path*", "/sign-in", "/verify-request"]`.
- When the student portal is added, the matcher must also protect `["/dashboard/:path*", "/learn/:path*"]` to ensure unauthorized visitors are instantly redirected to `/sign-in`.

---

### 2.4 Duration Formatting Bug

In `lib/utils.ts`:
```ts
export function formatDuration(duration: number) {
  const hours = Math.floor(duration);
  const minutes = Math.round((duration - hours) * 60);
  ...
}
```
If a course has a fractional duration, it handles minutes inconsistently. A dedicated, well-tested helper is needed to format decimal hours into `X hrs Y mins`.
