import { notFound } from "next/navigation";
import Wrapper from "@/components/common/wrapper";
import { prisma } from "@/lib/db";
import { getFullSession } from "@/app/data/user/require-user";
import { ProfileHeader } from "./_components/profile-header";
import { ProfileInfoForm } from "./_components/profile-info-form";
import { PasswordChangeForm } from "./_components/password-change-form";
import { ActiveSessionsCard } from "./_components/active-sessions-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  UserIcon,
  LockPasswordIcon,
  ComputerIcon,
} from "@hugeicons/core-free-icons";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const { session, user: sessionUser } = await getFullSession();

  const user = await prisma.user.findUnique({
    where: { id: sessionUser.id },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
      emailVerified: true,
      createdAt: true,
      accounts: {
        select: {
          providerId: true,
        },
      },
      enrollments: {
        where: { status: "ACTIVE" },
        select: {
          id: true,
          course: {
            select: {
              chapters: {
                select: {
                  lessons: {
                    select: { id: true },
                  },
                },
              },
            },
          },
        },
      },
      lessonProgress: {
        where: { completed: true },
        select: { lessonId: true },
      },
      sessions: {
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          ipAddress: true,
          userAgent: true,
          createdAt: true,
          expiresAt: true,
        },
      },
    },
  });

  if (!user) {
    return notFound();
  }

  // Calculate course completion stats
  const completedLessonIdSet = new Set(
    user.lessonProgress.map((lp) => lp.lessonId)
  );

  let completedCoursesCount = 0;
  for (const enrollment of user.enrollments) {
    const courseLessons = (enrollment.course?.chapters || []).flatMap(
      (c) => c.lessons
    );
    if (
      courseLessons.length > 0 &&
      courseLessons.every((l) => completedLessonIdSet.has(l.id))
    ) {
      completedCoursesCount += 1;
    }
  }

  const providers = user.accounts.map((a) => a.providerId);

  return (
    <Wrapper as="main" className="py-8 md:py-12 space-y-8 max-w-5xl">
      {/* Profile Summary Card */}
      <ProfileHeader
        user={{
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role,
          emailVerified: user.emailVerified,
          createdAt: user.createdAt,
        }}
        enrolledCount={user.enrollments.length}
        completedCount={completedCoursesCount}
      />

      {/* Profile Settings Tabs */}
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="bg-muted/60 p-1 rounded-2xl border border-border/60">
          <TabsTrigger
            value="profile"
            className="rounded-xl gap-2 text-xs font-semibold data-active:bg-background data-active:shadow-xs"
          >
            <HugeiconsIcon icon={UserIcon} className="size-4" />
            General Profile
          </TabsTrigger>
          <TabsTrigger
            value="security"
            className="rounded-xl gap-2 text-xs font-semibold data-active:bg-background data-active:shadow-xs"
          >
            <HugeiconsIcon icon={LockPasswordIcon} className="size-4" />
            Security & Password
          </TabsTrigger>
          <TabsTrigger
            value="sessions"
            className="rounded-xl gap-2 text-xs font-semibold data-active:bg-background data-active:shadow-xs"
          >
            <HugeiconsIcon icon={ComputerIcon} className="size-4" />
            Active Sessions ({user.sessions.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4">
          <ProfileInfoForm
            initialName={user.name}
            initialImage={user.image}
            email={user.email}
          />
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <PasswordChangeForm providers={providers} />
        </TabsContent>

        <TabsContent value="sessions" className="space-y-4">
          <ActiveSessionsCard
            sessions={user.sessions}
            currentSessionId={session.id}
          />
        </TabsContent>
      </Tabs>
    </Wrapper>
  );
}
