import { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { requireUser } from "@/app/data/user/require-user";
import UserProfile from "@/app/(marketing)/_components/user-profile";
import { buttonVariants } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";

export default async function LearnLayout({
  children,
}: {
  children: ReactNode;
}) {
  await requireUser();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Classroom Minimal Header */}
      <header className="h-14 border-b border-border bg-card/50 backdrop-blur-md px-4 flex items-center justify-between z-30 shrink-0">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className={buttonVariants({
              variant: "ghost",
              size: "sm",
              className: "gap-1.5 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground",
            })}
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} className="size-4" />
            <span className="hidden sm:inline">Back to Dashboard</span>
          </Link>

          <div className="h-4 w-px bg-border" />

          <Link href="/" className="flex items-center gap-2">
            <Image src="/clario.png" width={26} height={26} alt="Clario" />
            <span className="font-bold text-sm tracking-tight">Clario</span>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <UserProfile />
        </div>
      </header>

      {/* Classroom Body */}
      <div className="flex-1 flex overflow-hidden">{children}</div>
    </div>
  );
}
