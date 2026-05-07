"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconDotsVertical,
  IconMail,
  IconShield,
  IconShieldOff,
  IconUserCheck,
  IconUserX,
} from "@tabler/icons-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { formatDate, dummyUsers, UserType } from "../dummy-data";
import { UserDetailDrawer } from "./user-detail-drawer";

export function UsersTable() {
  const [data] = React.useState(() => dummyUsers);
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [selectedUser, setSelectedUser] = React.useState<UserType | null>(null);
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  // Create dynamic columns with click handlers
  const dynamicColumns = React.useMemo<ColumnDef<UserType>[]>(() => [
    {
      id: "select",
      header: ({ table }) => (
        <div className="flex items-center justify-center">
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
          />
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex items-center justify-center">
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "name",
      header: "User",
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div
            className="flex items-center gap-3 cursor-pointer hover:text-primary min-w-0"
            onClick={() => {
              setSelectedUser(user);
              setDrawerOpen(true);
            }}
          >
            <Avatar className="h-8 w-8 flex-shrink-0">
              <AvatarImage src={user.image || undefined} alt={user.name} />
              <AvatarFallback>
                {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col min-w-0">
              <span className="font-medium truncate">{user.name}</span>
              <span className="text-sm text-muted-foreground truncate">{user.email}</span>
            </div>
          </div>
        );
      },
      enableHiding: false,
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => {
        const role = row.original.role;
        const variants = {
          admin: "destructive",
          student: "secondary"
        } as const;

        return (
          <Badge variant={variants[role as keyof typeof variants] || "outline"}>
            {role.charAt(0).toUpperCase() + role.slice(1)}
          </Badge>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const user = row.original;
        const statusConfig = {
          active: { variant: "default" as const, label: "Active" },
          inactive: { variant: "secondary" as const, label: "Inactive" },
          banned: { variant: "destructive" as const, label: "Banned" }
        };

        const config = statusConfig[user.status as keyof typeof statusConfig];

        return (
          <Badge variant={config.variant}>
            {config.label}
          </Badge>
        );
      },
    },
    {
      accessorKey: "enrolledCourses",
      header: "Courses",
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="text-sm">
            <div>{user.enrolledCourses} enrolled</div>
            <div className="text-muted-foreground">{user.completedCourses} completed</div>
          </div>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Joined",
      cell: ({ row }) => {
        return formatDate(row.original.createdAt);
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const user = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-8 w-8 p-0"
              >
                <span className="sr-only">Open menu</span>
                <IconDotsVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(user.id)}>
                Copy user ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <IconMail className="mr-2 h-4 w-4" />
                Send email
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => {
                setSelectedUser(user);
                setDrawerOpen(true);
              }}>
                <IconUserCheck className="mr-2 h-4 w-4" />
                View profile
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {user.banned ? (
                <DropdownMenuItem className="text-green-600">
                  <IconShieldOff className="mr-2 h-4 w-4" />
                  Unban user
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem className="text-red-600">
                  <IconShield className="mr-2 h-4 w-4" />
                  Ban user
                </DropdownMenuItem>
              )}
              <DropdownMenuItem className="text-orange-600">
                <IconUserX className="mr-2 h-4 w-4" />
                Deactivate
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ], []);

  const table = useReactTable({
    data,
    columns: dynamicColumns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const handleBulkAction = (action: string) => {
    const selectedRows = table.getFilteredSelectedRowModel().rows;
    const userIds = selectedRows.map(row => row.original.id);

    toast.success(`${action} applied to ${userIds.length} users`);
    setRowSelection({});
  };

  const selectedCount = table.getFilteredSelectedRowModel().rows.length;

  return (
    <div className="space-y-4">
      {selectedCount > 0 && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 bg-background border rounded-lg shadow-lg p-4 min-w-fit">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">
              {selectedCount} user{selectedCount !== 1 ? 's' : ''} selected
            </span>
            <div className="flex gap-2 ml-auto">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleBulkAction("Activated")}
              >
                <IconUserCheck className="mr-2 h-4 w-4" />
                Activate
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => handleBulkAction("Deactivated")}
              >
                <IconUserX className="mr-2 h-4 w-4" />
                Deactivate
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => handleBulkAction("Banned")}
              >
                <IconShield className="mr-2 h-4 w-4" />
                Ban
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleBulkAction("Emailed")}
              >
                <IconMail className="mr-2 h-4 w-4" />
                Send Email
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="rounded-md border overflow-x-auto">
        <Table className="min-w-full">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="whitespace-nowrap">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="whitespace-nowrap">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={dynamicColumns.length} className="h-24 text-center">
                  No users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between px-2">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} user(s) selected.
        </div>
        <div className="flex items-center space-x-6 lg:space-x-8">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">Rows per page</p>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value) => {
                table.setPageSize(Number(value));
              }}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue placeholder={table.getState().pagination.pageSize} />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex w-[100px] items-center justify-center text-sm font-medium">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to first page</span>
              <IconChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to previous page</span>
              <IconChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to next page</span>
              <IconChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to last page</span>
              <IconChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <UserDetailDrawer
        user={selectedUser}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
      />
    </div>
  );
}