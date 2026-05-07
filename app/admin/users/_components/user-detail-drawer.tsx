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
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
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
} from "@tabler/icons-react";
import { formatDate } from "../dummy-data";
import type { UserDetail } from "../actions";

interface UserDetailDrawerProps {
  user: UserDetail | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isLoading?: boolean;
}

export function UserDetailDrawer({ user, open, onOpenChange, isLoading = false }: UserDetailDrawerProps) {
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[85vh]">
        <DrawerHeader>
          <div className="flex items-center gap-4">
            {isLoading ? (
              <>
                <Skeleton className="h-16 w-16 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-8 w-48" />
                  <Skeleton className="h-4 w-64" />
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-20" />
                  </div>
                </div>
              </>
            ) : user ? (
              <>
                <Avatar className="h-16 w-16">
                  <AvatarImage src={user.image || undefined} alt={user.name} />
                  <AvatarFallback className="text-lg">
                    {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <DrawerTitle className="text-2xl">{user.name}</DrawerTitle>
                  <DrawerDescription className="text-base">{user.email}</DrawerDescription>
                  <div className="flex gap-2 mt-2">
                    <Badge variant={user.role === "admin" ? "destructive" : "secondary"}>
                      {user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : "No Role"}
                    </Badge>
                    <Badge variant={user.banned ? "destructive" : "default"}>
                      {user.banned ? "Inactive" : "Active"}
                    </Badge>
                    {user.emailVerified && (
                      <Badge variant="outline" className="text-green-600">
                        Verified
                      </Badge>
                    )}
                  </div>
                </div>
              </>
            ) : null}
          </div>
        </DrawerHeader>

        <div className="flex-1 overflow-y-auto px-4">
          <div className="grid gap-6 py-4">
            {/* Account Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <IconUserCheck className="h-5 w-5" />
                  Account Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
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
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">User ID</label>
                      <p className="font-mono text-sm">{user.id}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Joined</label>
                      <p className="text-sm flex items-center gap-1">
                        <IconCalendar className="h-4 w-4" />
                        {formatDate(user.createdAt.toISOString())}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Last Updated</label>
                      <p className="text-sm flex items-center gap-1">
                        <IconClock className="h-4 w-4" />
                        {formatDate(user.updatedAt.toISOString())}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Last Login</label>
                      <p className="text-sm flex items-center gap-1">
                        <IconActivity className="h-4 w-4" />
                        {user.lastLogin ? formatDate(user.lastLogin) : "Never"}
                      </p>
                    </div>
                  </div>
                ) : null}
              </CardContent>
            </Card>

            {/* Activity Statistics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <IconActivity className="h-5 w-5" />
                  Activity Statistics
                </CardTitle>
              </CardHeader>
              <CardContent>
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
                  <>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold">{user.totalLogins}</div>
                        <div className="text-sm text-muted-foreground">Total Logins</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold">{user.enrolledCourses}</div>
                        <div className="text-sm text-muted-foreground">Enrolled Courses</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold">{user.completedCourses}</div>
                        <div className="text-sm text-muted-foreground">Completed Courses</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold">{user.totalSpent.toLocaleString()} ETB</div>
                        <div className="text-sm text-muted-foreground">Total Spent</div>
                      </div>
                    </div>
                    {user.enrolledCourses > 0 && (
                      <>
                        <Separator className="my-4" />
                        <div className="text-center">
                          <div className="text-2xl font-bold">
                            {Math.round((user.completedCourses / user.enrolledCourses) * 100)}%
                          </div>
                          <div className="text-sm text-muted-foreground">Completion Rate</div>
                        </div>
                      </>
                    )}
                  </>
                ) : null}
              </CardContent>
            </Card>

            {/* Ban Information */}
            {!isLoading && user?.banned && (
              <Card className="border-red-200 bg-red-50/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-700">
                    <IconShield className="h-5 w-5" />
                    Ban Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Reason</label>
                    <p className="text-sm">{user.banReason}</p>
                  </div>
                  {user.banExpires && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Expires</label>
                      <p className="text-sm flex items-center gap-1">
                        <IconClock className="h-4 w-4" />
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
          <div className="flex flex-col gap-2 sm:flex-row sm:gap-2">
            <Button variant="outline" className="flex-1">
              <IconMail className="mr-2 h-4 w-4" />
              Send Email
            </Button>
            <Button variant="outline" className="flex-1">
              <IconUserCheck className="mr-2 h-4 w-4" />
              Edit Profile
            </Button>
            {!isLoading && user && (
              user.banned ? (
                <Button variant="outline" className="flex-1 text-green-600 hover:text-green-700">
                  <IconShieldOff className="mr-2 h-4 w-4" />
                  Unban User
                </Button>
              ) : (
                <Button variant="outline" className="flex-1 text-red-600 hover:text-red-700">
                  <IconShield className="mr-2 h-4 w-4" />
                  Ban User
                </Button>
              )
            )}
          </div>
          <DrawerClose asChild>
            <Button variant="outline">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}