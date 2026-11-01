"use client";

import * as React from "react";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RecentEnrollmentItem } from "@/app/data/admin/get-recent-enrollments";
import { formatETB } from "@/lib/utils";
import { timeAgo } from "@/lib/date";
import {
  IconCheck,
  IconClock,
  IconX,
  IconArrowRight,
  IconReceipt,
} from "@tabler/icons-react";

interface RecentEnrollmentsTableProps {
  enrollments: RecentEnrollmentItem[];
}

export function RecentEnrollmentsTable({
  enrollments,
}: RecentEnrollmentsTableProps) {
  const getStatusBadge = (status: "ACTIVE" | "PENDING" | "CANCELED") => {
    switch (status) {
      case "ACTIVE":
        return (
          <Badge
            variant="outline"
            className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-xs flex items-center gap-1 w-fit"
          >
            <IconCheck className="size-3" />
            Active
          </Badge>
        );
      case "PENDING":
        return (
          <Badge
            variant="outline"
            className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 text-xs flex items-center gap-1 w-fit"
          >
            <IconClock className="size-3" />
            Pending
          </Badge>
        );
      case "CANCELED":
        return (
          <Badge
            variant="outline"
            className="bg-destructive/10 text-destructive border-destructive/20 text-xs flex items-center gap-1 w-fit"
          >
            <IconX className="size-3" />
            Canceled
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <Card className="mx-4 lg:mx-6">
      <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
        <div>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <IconReceipt className="size-5 text-primary" />
            Recent Platform Enrollments
          </CardTitle>
          <CardDescription>
            Live transactions and student course registrations
          </CardDescription>
        </div>
        <Button variant="ghost" size="sm" asChild className="text-xs gap-1">
          <Link href="/admin/enrollments">
            View All Ledger
            <IconArrowRight className="size-3.5" />
          </Link>
        </Button>
      </CardHeader>

      <CardContent className="p-0">
        {enrollments.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground text-sm">
            No enrollments found yet. Once students purchase courses, they will appear here in real-time.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[240px]">Student</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Enrolled</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {enrollments.map((item) => {
                  const studentName = item.user.name || "Anonymous Student";
                  const initials = studentName
                    .trim()
                    .split(/\s+/)
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2);

                  return (
                    <TableRow key={item.id} className="hover:bg-muted/40">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="size-8">
                            <AvatarImage
                              src={item.user.image || undefined}
                              alt={studentName}
                            />
                            <AvatarFallback className="text-xs">
                              {initials}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col min-w-0">
                            <span className="font-medium text-sm truncate">
                              {studentName}
                            </span>
                            <span className="text-xs text-muted-foreground truncate">
                              {item.user.email}
                            </span>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        <Link
                          href={`/admin/courses/${item.course.id}`}
                          className="font-medium text-sm hover:underline hover:text-primary transition-colors line-clamp-1"
                        >
                          {item.course.title}
                        </Link>
                      </TableCell>

                      <TableCell>
                        <Badge variant="secondary" className="text-xs font-normal">
                          {item.course.category}
                        </Badge>
                      </TableCell>

                      <TableCell className="font-semibold text-sm tabular-nums">
                        {formatETB(item.amount)}
                      </TableCell>

                      <TableCell>{getStatusBadge(item.status)}</TableCell>

                      <TableCell className="text-right text-xs text-muted-foreground whitespace-nowrap">
                        {timeAgo(new Date(item.createdAt))}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
