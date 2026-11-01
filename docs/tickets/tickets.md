# Clario LMS — Engineering Tickets

This document defines the actionable ticket backlog derived from [spec.md](../spec.md) and [roadmap.md](../roadmap.md). Each ticket corresponds to a dedicated git branch and pull request.

---

## Ticket Overview

| Ticket ID | Title | Branch | Status |
|---|---|---|:---:|
| **TICK-001** | Next.js 16.4 Upgrade, Schema Extension, Stripe Product ID & Currency Fix | `fix/phase-1-core-fixes-and-schema` | ✅ Merged (#15) |
| **TICK-002** | Student Data Access Layer & Progress Mutation Actions | `feat/phase-2-student-dal-and-actions` | ✅ Merged (#16) |
| **TICK-003** | Student Learning Dashboard (`/dashboard`) | `feat/phase-3-student-dashboard` | ✅ Merged (#17) |
| **TICK-004** | Course Classroom, Video Player & Curriculum Sidebar (`/learn/...`) | `feat/phase-4-classroom-player` | ✅ Merged (#18) |
| **TICK-005** | Course Completion Celebration, Verified Certificate & Dashboard Production Resilience | `feat/phase-5-course-completion` | ✅ Merged (#19) |
| **TICK-006** | Global Error & 404 Boundaries (`error.tsx`, `not-found.tsx`, `global-error.tsx`) | `feat/phase-5-error-boundaries` | 🔄 In Progress |
| **TICK-007** | Student Account & Profile Settings (`/profile`) | `feat/phase-5-user-profile` | 📋 Backlog |

---

## TICK-001: Next.js 16.4 Upgrade, Schema Extension, Stripe Product ID & Currency Fix

- **Branch**: `fix/phase-1-core-fixes-and-schema`
- **Status**: ✅ Merged (PR #15)
- **Scope**:
  1. **Next.js Upgrade**:
     - Upgrade `next` and `eslint-config-next` to `16.4.3`.
  2. **Prisma Schema Extensions**:
     - Add `stripeProductId String? @unique` to `Course` model.
     - Add `model LessonProgress` with `[userId, lessonId]` unique constraint, timestamps, and relations to `User` and `Lesson`.
     - Generate and apply database migration.
  3. **Stripe & Money Fixes**:
     - In `createCourseA`: store `stripeCourse.id` into `Course.stripeProductId`, and enforce `Math.round(data.price * 100)`.
     - In `updateCourseA`: update Stripe product using `course.stripeProductId` instead of `course.id`.
     - In `enrollInCourseA`: ensure safe integer arithmetic for Stripe line items.
  4. **Next.js 16 Proxy Update**:
     - Extend `proxy.ts` matcher and private route validation to guard `/dashboard/:path*` and `/learn/:path*`.
  5. **Verification**:
     - `pnpm build` must pass with zero TypeScript or lint errors.

---

## TICK-002: Student Data Access Layer & Progress Mutation Actions

- **Branch**: `feat/phase-2-student-dal-and-actions`
- **Status**: ✅ Merged (PR #16)
- **Scope**:
  1. `app/data/student/get-enrolled-courses.ts`:
     - Fetch active user enrollments with total lessons, completed lessons count, progress %, and next uncompleted lesson ID.
  2. `app/data/student/get-course-player.ts`:
     - Authorize enrolled student for specific course and lesson.
     - Fetch current lesson details and structured syllabus with completion status per lesson.
     - Calculate previous and next lesson navigation pointers.
  3. `app/student/actions.ts`:
     - Implement `toggleLessonProgressA(lessonId: string, completed: boolean)` with Arcjet protection and cache revalidation.

---

## TICK-003: Student Learning Dashboard (`/dashboard`)

- **Branch**: `feat/phase-3-student-dashboard`
- **Status**: ✅ Merged (PR #17)
- **Scope**:
  1. Layout: `app/dashboard/layout.tsx` with student header and user menu.
  2. Page: `app/dashboard/page.tsx` displaying:
     - Learning metrics (courses enrolled, completed, total hours).
     - "Continue Learning" hero banner.
     - Enrolled courses grid with progress percentage bar.
     - Empty state with CTA to `/courses`.

---

## TICK-004: Course Classroom, Video Player & Curriculum Sidebar (`/learn/...`)

- **Branch**: `feat/phase-4-classroom-player`
- **Status**: ✅ Merged (PR #18)
- **Scope**:
  1. Classroom Route: `app/learn/[courseId]/[lessonId]/page.tsx` and auto-redirect `app/learn/[courseId]/page.tsx`.
  2. HTML5 Video Player streaming from Tigris/S3 bucket with playback speed and scrubber controls.
  3. Curriculum sidebar accordion displaying all chapters, lessons, active indicator, and completion checkboxes.
  4. Next/Previous lesson buttons and lesson description view.

---

## TICK-005: Course Completion Celebration, Verified Certificate & Dashboard Production Resilience

- **Branch**: `feat/phase-5-course-completion`
- **Status**: ✅ Merged (PR #19)
- **Scope**:
  1. **Dashboard Production Error Fixes**:
     - Fix `proxy.ts` infinite redirect loop caused by optimistic redirect on stale/expired cookies.
     - Protect `allLessonIds.length === 0` in `get-enrolled-courses.ts` against SQL syntax errors when querying Prisma `LessonProgress`.
     - Add null-safety for `user.name` and `user.email` in `app/dashboard/page.tsx`.
     - Enhance `useFileKeyToUrl` to safely handle empty, null, and absolute URLs with fallback placeholder.
     - Add `app/dashboard/error.tsx` boundary with user-friendly retry button.
     - Wrap `requireUser` in React `cache()` to eliminate redundant session database queries per request.
     - Update `next.config.ts` remotePatterns with leading slashes (`pathname: "/**"`).
  2. **Course Completion Celebration & Certificate**:
     - Build `CourseCompletionModal` with confetti celebration and achievement dialog.
     - Integrate celebration and certificate link in `CoursePlayerSidebar` and `LessonNavigationControls`.
     - Create `/learn/[courseId]/certificate` route with print-ready certificate layout, verification ID, and credential sharing.
     - Add certificate quick-action button on completed course cards in `/dashboard`.

---

## TICK-006: Global Error & 404 Boundaries

- **Branch**: `feat/phase-5-error-boundaries`
- **Status**: 🔄 In Progress
- **Scope**:
  1. Custom 404 Not Found page (`app/not-found.tsx`) styled with Clario brand theme and quick navigation.
  2. Root application error boundary (`app/error.tsx`) with incident digest and retry.
  3. Critical global layout error boundary (`app/global-error.tsx`).
  4. Classroom playback error boundary (`app/learn/[courseId]/error.tsx`).
  5. Admin management error boundary (`app/admin/error.tsx`).

---

## TICK-007: Student Account & Profile Settings

- **Branch**: `feat/phase-5-user-profile`
- **Status**: 📋 Backlog
- **Scope**:
  1. Profile page (`/profile` or `/dashboard/profile`).
  2. Edit user name, avatar upload via Tigris S3, and password update via Better Auth.
  3. View active session list and revoke devices.
