import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Book02Icon,
  CheckmarkBadge01Icon,
  Calendar01Icon,
  Mail01Icon,
  SecurityCheckIcon,
} from "@hugeicons/core-free-icons";

interface ProfileHeaderProps {
  user: {
    id: string;
    name: string;
    email: string;
    image: string | null;
    role: string | null;
    emailVerified: boolean;
    createdAt: Date;
  };
  enrolledCount: number;
  completedCount: number;
}

export function ProfileHeader({
  user,
  enrolledCount,
  completedCount,
}: ProfileHeaderProps) {
  const fallbackImage = `https://avatar.vercel.sh/${user.name || "Student"}?rounded=60`;
  const joinedDate = new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(new Date(user.createdAt));

  return (
    <div className="relative overflow-hidden rounded-3xl border border-border/70 bg-gradient-to-br from-card/80 to-card/30 p-6 md:p-8 backdrop-blur-md shadow-sm">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
        {/* Avatar */}
        <div className="relative">
          <Avatar className="size-24 md:size-28 rounded-2xl ring-4 ring-primary/10 shadow-md">
            <AvatarImage
              src={user.image || fallbackImage}
              alt={user.name}
              className="object-cover"
            />
            <AvatarFallback className="rounded-2xl text-2xl font-bold bg-primary/10 text-primary">
              {user.name?.slice(0, 2).toUpperCase() || "ST"}
            </AvatarFallback>
          </Avatar>
          {user.role === "admin" && (
            <Badge
              variant="default"
              className="absolute -bottom-2 -right-2 uppercase text-[10px] font-bold tracking-wider bg-primary px-2 py-0.5 shadow-sm"
            >
              Admin
            </Badge>
          )}
        </div>

        {/* User Details */}
        <div className="flex-1 text-center md:text-left space-y-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
            <div>
              <div className="flex items-center justify-center md:justify-start gap-2.5">
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground font-heading">
                  {user.name}
                </h1>
                {user.emailVerified && (
                  <Badge
                    variant="secondary"
                    className="gap-1 text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
                    title="Verified Email"
                  >
                    <HugeiconsIcon icon={SecurityCheckIcon} className="size-3.5" />
                    Verified
                  </Badge>
                )}
              </div>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-muted-foreground mt-1.5">
                <span className="flex items-center gap-1.5">
                  <HugeiconsIcon icon={Mail01Icon} className="size-3.5" />
                  {user.email}
                </span>
                <span className="flex items-center gap-1.5">
                  <HugeiconsIcon icon={Calendar01Icon} className="size-3.5" />
                  Member since {joinedDate}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Stats Pill Counters */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-muted/60 border border-border/60 text-xs">
              <HugeiconsIcon icon={Book02Icon} className="size-4 text-blue-500" />
              <span className="font-semibold text-foreground">
                {enrolledCount}
              </span>
              <span className="text-muted-foreground">Enrolled Courses</span>
            </div>

            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-muted/60 border border-border/60 text-xs">
              <HugeiconsIcon
                icon={CheckmarkBadge01Icon}
                className="size-4 text-emerald-500"
              />
              <span className="font-semibold text-foreground">
                {completedCount}
              </span>
              <span className="text-muted-foreground">Completed Courses</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
