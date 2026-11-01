"use client";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  IconMail,
  IconShield,
  IconShieldOff,
  IconUserCheck,
  IconCalendar,
  IconActivity,
  IconClock,
  IconDotsVertical,
  IconBook,
  IconUserExclamation,
} from "@tabler/icons-react";
import { formatDate } from "../dummy-data";
import type { UserDetail } from "../actions";
import { formatETB } from "@/lib/utils";
import Link from "next/link";

interface UserDetailDrawerProps {
  user: UserDetail | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isLoading?: boolean;
  onSendEmail?: (user: { email: string; name: string }) => void;
  onToggleBan?: (userId: string, isBanned: boolean) => void;
  onRoleChange?: (userId: string, newRole: "admin" | "student") => void;
}

export function UserDetailDrawer({
  user,
  open,
  onOpenChange,
  isLoading = false,
  onSendEmail,
  onToggleBan,
  onRoleChange,
}: UserDetailDrawerProps) {
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[88vh]">
        <DrawerHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {isLoading ? (
                <>
                  <Skeleton className="h-16 w-16 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-4 w-48" />
                  </div>
                </>
              ) : user ? (
                <>
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={user.image || undefined} alt={user.name} />
                    <AvatarFallback className="text-lg">
                      {user.name
                        .split(" ")
                        .filter((n) => n.length > 0)
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <DrawerTitle className="text-xl">{user.name}</DrawerTitle>
                    <DrawerDescription className="text-sm">
                      {user.email}
                    </DrawerDescription>
                  </div>
                </>
              ) : null}
            </div>

            {/* Dropdown Menu */}
            {!isLoading && user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <IconDotsVertical className="h-4 w-4" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>User Actions</DropdownMenuLabel>
                  <DropdownMenuItem
                    onClick={() => {
                      onOpenChange(false);
                      onSendEmail?.({ email: user.email, name: user.name });
                    }}
                  >
                    <IconMail className="mr-2 h-4 w-4" />
                    Send Email
                  </DropdownMenuItem>

                  {user.role === "admin" ? (
                    <DropdownMenuItem
                      onClick={() => onRoleChange?.(user.id, "student")}
                    >
                      <IconUserCheck className="mr-2 h-4 w-4" />
                      Demote to Student
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem
                      onClick={() => onRoleChange?.(user.id, "admin")}
                    >
                      <IconUserExclamation className="mr-2 h-4 w-4" />
                      Promote to Admin
                    </DropdownMenuItem>
                  )}

                  <DropdownMenuSeparator />
                  {user.banned ? (
                    <DropdownMenuItem
                      className="text-green-600"
                      onClick={() => onToggleBan?.(user.id, true)}
                    >
                      <IconShieldOff className="mr-2 h-4 w-4" />
                      Unban User
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() => onToggleBan?.(user.id, false)}
                    >
                      <IconShield className="mr-2 h-4 w-4" />
                      Ban User
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* Badges below */}
          {!isLoading && user && (
            <div className="flex flex-wrap gap-2 mt-4">
              <Badge variant={user.role === "admin" ? "destructive" : "secondary"}>
                {user.role
                  ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
                  : "Student"}
              </Badge>
              <Badge
                variant="outline"
                className={
                  user.banned
                    ? "bg-destructive/10 text-destructive border-destructive/20"
                    : "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                }
              >
                {user.banned ? "Banned" : "Active"}
              </Badge>
              {user.emailVerified && (
                <Badge variant="outline" className="text-green-600 border-green-500/30">
                  Verified
                </Badge>
              )}
            </div>
          )}
        </DrawerHeader>

        <div className="flex-1 overflow-y-auto px-4">
          <div className="grid gap-6 py-4">
            {/* Account Information */}
            <Card>
              <CardHeader className="py-3 border-b">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <IconUserCheck className="h-4 w-4 text-primary" />
                  Account Information
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                {isLoading ? (
                  <div className="grid grid-cols-2 gap-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i}>
                        <Skeleton className="h-4 w-24 mb-1" />
                        <Skeleton className="h-4 w-32" />
                      </div>
                    ))}
                  </div>
                ) : user ? (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                    <div>
                      <label className="font-medium text-muted-foreground block">User ID</label>
                      <p className="font-mono truncate">{user.id}</p>
                    </div>
                    <div>
                      <label className="font-medium text-muted-foreground block">Joined</label>
                      <p className="flex items-center gap-1">
                        <IconCalendar className="h-3.5 w-3.5 text-muted-foreground" />
                        {formatDate(user.createdAt.toISOString())}
                      </p>
                    </div>
                    <div>
                      <label className="font-medium text-muted-foreground block">Last Updated</label>
                      <p className="flex items-center gap-1">
                        <IconClock className="h-3.5 w-3.5 text-muted-foreground" />
                        {formatDate(user.updatedAt.toISOString())}
                      </p>
                    </div>
                    <div>
                      <label className="font-medium text-muted-foreground block">Last Login</label>
                      <p className="flex items-center gap-1">
                        <IconActivity className="h-3.5 w-3.5 text-muted-foreground" />
                        {user.lastLogin ? formatDate(user.lastLogin) : "Never"}
                      </p>
                    </div>
                  </div>
                ) : null}
              </CardContent>
            </Card>

            {/* Activity Statistics */}
            <Card>
              <CardHeader className="py-3 border-b">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <IconActivity className="h-4 w-4 text-primary" />
                  Activity & Spending
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                {isLoading ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="text-center">
                        <Skeleton className="h-8 w-16 mx-auto mb-1" />
                        <Skeleton className="h-4 w-20 mx-auto" />
                      </div>
                    ))}
                  </div>
                ) : user ? (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                    <div className="p-3 bg-muted/30 rounded-lg">
                      <div className="text-xl font-bold">{user.totalLogins}</div>
                      <div className="text-xs text-muted-foreground">Total Sessions</div>
                    </div>
                    <div className="p-3 bg-muted/30 rounded-lg">
                      <div className="text-xl font-bold">{user.enrolledCourses}</div>
                      <div className="text-xs text-muted-foreground">Enrolled Courses</div>
                    </div>
                    <div className="p-3 bg-muted/30 rounded-lg">
                      <div className="text-xl font-bold">{user.activeEnrollments}</div>
                      <div className="text-xs text-muted-foreground">Active Access</div>
                    </div>
                    <div className="p-3 bg-muted/30 rounded-lg">
                      <div className="text-xl font-bold text-emerald-600">
                        {formatETB(user.totalSpent)}
                      </div>
                      <div className="text-xs text-muted-foreground">Lifetime Spent</div>
                    </div>
                  </div>
                ) : null}
              </CardContent>
            </Card>

            {/* Enrolled Courses & Progress */}
            {!isLoading && user && (
              <Card>
                <CardHeader className="py-3 border-b flex flex-row items-center justify-between">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <IconBook className="h-4 w-4 text-primary" />
                    Enrolled Courses & Learning Progress
                  </CardTitle>
                  <Badge variant="outline" className="text-xs">
                    {user.enrolledCoursesList.length} course{user.enrolledCoursesList.length === 1 ? "" : "s"}
                  </Badge>
                </CardHeader>
                <CardContent className="p-0 divide-y divide-border/50">
                  {user.enrolledCoursesList.length === 0 ? (
                    <div className="py-6 text-center text-muted-foreground text-xs">
                      This user is not enrolled in any courses yet.
                    </div>
                  ) : (
                    user.enrolledCoursesList.map((course) => (
                      <div key={course.courseId} className="p-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <Link
                            href={`/admin/courses/${course.courseId}`}
                            className="font-medium text-sm hover:underline hover:text-primary transition-colors"
                          >
                            {course.title}
                          </Link>
                          <Badge variant="secondary" className="text-xs">
                            {course.status}
                          </Badge>
                        </div>

                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>
                            Progress: {course.completedLessons} of {course.totalLessons} lessons
                          </span>
                          <span className="font-mono font-semibold text-foreground">
                            {course.progressPercentage}%
                          </span>
                        </div>

                        <Progress value={course.progressPercentage} className="h-1.5" />

                        <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
                          <span>Paid: {formatETB(course.amount)}</span>
                          <span>Enrolled: {formatDate(course.enrolledAt.toISOString())}</span>
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            )}

            {/* Ban Information */}
            {!isLoading && user?.banned && (
              <Card className="border-red-500/30 bg-destructive/5">
                <CardHeader className="py-3">
                  <CardTitle className="flex items-center gap-2 text-destructive text-sm">
                    <IconShield className="h-4 w-4" />
                    Ban Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-xs">
                  <div>
                    <label className="font-medium text-muted-foreground block">Reason</label>
                    <p className="text-sm">{user.banReason || "No reason specified"}</p>
                  </div>
                  {user.banExpires && (
                    <div>
                      <label className="font-medium text-muted-foreground block">Expires</label>
                      <p className="flex items-center gap-1">
                        <IconClock className="h-3.5 w-3.5 text-muted-foreground" />
                        {formatDate(user.banExpires.toISOString())}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
