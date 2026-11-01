"use client";

import * as React from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { AdminEnrollmentsResult, EnrollmentListParams } from "@/app/data/admin/get-admin-enrollments";
import { formatETB } from "@/lib/utils";
import { timeAgo } from "@/lib/date";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SearchBar from "@/components/ui/search-bar";
import {
  IconCheck,
  IconClock,
  IconX,
  IconDownload,
  IconReceipt,
  IconCurrencyDollar,
  IconUsers,
} from "@tabler/icons-react";

interface EnrollmentsLedgerClientProps {
  initialData: AdminEnrollmentsResult;
  params: EnrollmentListParams;
}

export function EnrollmentsLedgerClient({
  initialData,
  params,
}: EnrollmentsLedgerClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createQueryString = React.useCallback(
    (newParams: Record<string, string | null>) => {
      const q = new URLSearchParams(searchParams.toString());
      for (const [key, val] of Object.entries(newParams)) {
        if (!val || val === "all") {
          q.delete(key);
        } else {
          q.set(key, val);
        }
      }
      return q.toString();
    },
    [searchParams]
  );

  const handleSearch = (searchVal: string) => {
    const qs = createQueryString({
      search: searchVal.trim() ? searchVal : null,
      page: "0",
    });
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  const handleStatusChange = (statusVal: string) => {
    const qs = createQueryString({ status: statusVal, page: "0" });
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  const handleExportCSV = () => {
    if (initialData.enrollments.length === 0) {
      toast.error("No enrollment records to export");
      return;
    }

    const headers = [
      "Enrollment ID",
      "Student Name",
      "Student Email",
      "Course Title",
      "Category",
      "Amount (ETB)",
      "Status",
      "Enrolled Date",
    ];

    const escapeCSV = (field: string | number) => {
      const str = String(field);
      return `"${str.replace(/"/g, '""')}"`;
    };

    const rows = initialData.enrollments.map((e) => [
      e.id,
      e.user.name,
      e.user.email,
      e.course.title,
      e.course.category,
      e.amount,
      e.status,
      new Date(e.createdAt).toISOString(),
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map(escapeCSV).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `clario-enrollments-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success(`Exported ${initialData.enrollments.length} transactions`);
  };

  const getStatusBadge = (status: "ACTIVE" | "PENDING" | "CANCELED") => {
    switch (status) {
      case "ACTIVE":
        return (
          <Badge
            variant="outline"
            className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-xs flex items-center gap-1 w-fit"
          >
            <IconCheck className="size-3" />
            Active
          </Badge>
        );
      case "PENDING":
        return (
          <Badge
            variant="outline"
            className="bg-amber-500/10 text-amber-600 border-amber-500/20 text-xs flex items-center gap-1 w-fit"
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
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Transactions
            </CardTitle>
            <IconReceipt className="size-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tabular-nums">
              {initialData.total}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Matching current filter parameters
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Gross Volume
            </CardTitle>
            <IconCurrencyDollar className="size-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tabular-nums">
              {formatETB(initialData.totalRevenue)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Settled payments from active enrollments
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Shown On Page
            </CardTitle>
            <IconUsers className="size-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tabular-nums">
              {initialData.enrollments.length} of {initialData.total}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Page {initialData.page + 1}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filter and Action Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <Tabs
          value={params.status || "all"}
          onValueChange={handleStatusChange}
          className="w-full md:w-auto"
        >
          <TabsList className="h-9">
            <TabsTrigger value="all" className="text-xs">
              All Transactions
            </TabsTrigger>
            <TabsTrigger value="ACTIVE" className="text-xs">
              Active
            </TabsTrigger>
            <TabsTrigger value="PENDING" className="text-xs">
              Pending
            </TabsTrigger>
            <TabsTrigger value="CANCELED" className="text-xs">
              Canceled
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex items-center gap-3">
          <div className="w-full md:w-64">
            <SearchBar
              value={params.search || ""}
              handleChange={handleSearch}
              placeholder="Search student or course..."
            />
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            className="h-9 text-xs gap-1.5 shrink-0"
          >
            <IconDownload className="size-3.5" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Ledger Table */}
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          {initialData.enrollments.length === 0 ? (
            <div className="py-16 text-center text-muted-foreground text-sm">
              No enrollment transactions found matching the filter criteria.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[220px]">Student</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead className="text-right">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {initialData.enrollments.map((enr) => {
                  const studentName = enr.user.name || "Student";
                  const initials = studentName
                    .trim()
                    .split(/\s+/)
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2);

                  return (
                    <TableRow key={enr.id} className="hover:bg-muted/30">
                      <TableCell>
                        <div className="flex items-center gap-2.5">
                          <Avatar className="size-8">
                            <AvatarImage
                              src={enr.user.image || undefined}
                              alt={studentName}
                            />
                            <AvatarFallback className="text-xs">
                              {initials}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <p className="font-medium text-sm truncate">
                              {studentName}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                              {enr.user.email}
                            </p>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        <Link
                          href={`/admin/courses/${enr.course.id}`}
                          className="font-medium text-sm hover:underline hover:text-primary transition-colors line-clamp-1"
                        >
                          {enr.course.title}
                        </Link>
                      </TableCell>

                      <TableCell>
                        <Badge variant="secondary" className="text-xs font-normal">
                          {enr.course.category}
                        </Badge>
                      </TableCell>

                      <TableCell className="font-semibold text-sm tabular-nums text-foreground">
                        {formatETB(enr.amount)}
                      </TableCell>

                      <TableCell>{getStatusBadge(enr.status)}</TableCell>

                      <TableCell>
                        <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono text-muted-foreground">
                          {enr.id.slice(0, 10)}...
                        </code>
                      </TableCell>

                      <TableCell className="text-right text-xs text-muted-foreground whitespace-nowrap">
                        {timeAgo(new Date(enr.createdAt))}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
