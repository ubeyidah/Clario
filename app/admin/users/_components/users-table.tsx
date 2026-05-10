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
  IconX,
  IconDownload,
} from "@tabler/icons-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { formatDate } from "../dummy-data";
import { UserDetailDrawer } from "./user-detail-drawer";
import { BanDialog } from "./ban-dialog";
import { SendEmailSheet } from "./send-email-sheet";
import { SessionsSheet } from "./sessions-sheet";
import type { AdminUser } from "@/app/data/admin/get-admin-users";
import type { UserDetail } from "../actions";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export function UsersTable({ initialUsers }: { initialUsers: AdminUser[] }) {
  const router = useRouter();
  const [data, setData] = React.useState(initialUsers);

  React.useEffect(() => {
    setData(initialUsers);
  }, [initialUsers]);
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [selectedUser, setSelectedUser] = React.useState<UserDetail | null>(null);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [isLoadingUser, setIsLoadingUser] = React.useState(false);
  const [banDialogOpen, setBanDialogOpen] = React.useState(false);
  const [banUserIds, setBanUserIds] = React.useState<string[]>([]);
  const [sendEmailOpen, setSendEmailOpen] = React.useState(false);
  const [emailUser, setEmailUser] = React.useState<{ email: string; name: string } | null>(null);
  const [sessionsOpen, setSessionsOpen] = React.useState(false);
  const [sessionUser, setSessionUser] = React.useState<{ id: string; name: string } | null>(null);

  const { data: session } = authClient.useSession();
  const currentUserId = session?.user?.id;

  const handleUserClick = async (user: AdminUser) => {
    setDrawerOpen(true);
    setIsLoadingUser(true);

    try {
      // Import and call the server action
      const { getUserDetailA } = await import("../actions");
      const userDetail = await getUserDetailA(user.id);
      setSelectedUser(userDetail);
    } catch (error) {
      console.error("Failed to load user details:", error);
    } finally {
      setIsLoadingUser(false);
    }
  };

  const openBanDialog = (userIds: string[]) => {
    setBanUserIds(userIds);
    setBanDialogOpen(true);
  };

  // Create dynamic columns with click handlers
  const dynamicColumns = React.useMemo<ColumnDef<AdminUser>[]>(() => [
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
            onClick={() => handleUserClick(user)}
          >
            <Avatar className="h-8 w-8 flex-shrink-0">
              <AvatarImage src={user.image || undefined} alt={user.name} />
              <AvatarFallback>
                <AvatarFallback>
                {user.name.trim() 
                  ? user.name.trim().split(/\s+/).map(n => n[0]).join('').toUpperCase().slice(0, 2)
                  : '??'}
                </AvatarFallback>
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
        const displayRole = role === "admin" ? "Admin" : "Student";
        const variants = {
          admin: "destructive",
          student: "secondary"
        } as const;

        return (
          <Badge variant={variants[role as keyof typeof variants] || "secondary"}>
            {displayRole}
          </Badge>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const user = row.original;

        if (user.banned) {
          return <Badge variant="destructive">Banned</Badge>;
        }

        return <Badge variant="default">Active</Badge>;
      },
    },
    {
      accessorKey: "enrolledCourses",
      header: "Courses",
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="text-sm">
            <div>{user._count.enrollments} enrolled</div>
            <div className="text-muted-foreground">{user._count.courses} created</div>
          </div>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Joined",
      cell: ({ row }) => {
        return formatDate(row.original.createdAt.toISOString());
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const user = row.original;

        const handleUnban = async (userId: string) => {
          try {
         const handleUnban = async (userId: string) => {
           try {
             await authClient.admin.unbanUser({ userId });
            await authClient.admin.unbanUser({ userId });
            toast.success("User has been unbanned");
            setData(prev => prev.map(user => 
              user.id === userId ? { ...user, banned: false } : user
            ));
            router.refresh();
          } catch (error) {
            console.error("Failed to unban user:", error);
            toast.error("Failed to unban user");
          }
        };

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
              <DropdownMenuItem 
                disabled={currentUserId === user.id}
                onClick={() => {
                  navigator.clipboard.writeText(user.id);
                  toast.success("User ID copied to clipboard");
                }}
              >
                Copy user ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                disabled={currentUserId === user.id}
                onClick={() => {
                  setEmailUser({ email: user.email, name: user.name });
                  setSendEmailOpen(true);
                }}
              >
                <IconMail className="mr-2 h-4 w-4" />
                Send email
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleUserClick(user)}>
                <IconUserCheck className="mr-2 h-4 w-4" />
                View profile
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => {
                  setSessionUser({ id: user.id, name: user.name });
                  setSessionsOpen(true);
                }}
              >
                <IconShield className="mr-2 h-4 w-4" />
                Sessions
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {user.banned ? (
                <DropdownMenuItem 
                  className="text-green-600" 
                  disabled={currentUserId === user.id}
                  onClick={() => handleUnban(user.id)}
                >
                  <IconShieldOff className="mr-2 h-4 w-4" />
                  Unban
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem 
                  variant="destructive" 
                  disabled={currentUserId === user.id}
                  onClick={() => openBanDialog([user.id])}
                >
                  <IconShield className="mr-2 h-4 w-4" />
                  Ban
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ], [router, currentUserId]);

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

  const selectedCount = table.getFilteredSelectedRowModel().rows.length;

  const handleExportSelected = () => {
    const selectedRows = table.getFilteredSelectedRowModel().rows;
    const users = selectedRows.map(row => row.original);
    
    const csvContent = [
      ['ID', 'Name', 'Email', 'Role', 'Status', 'Enrolled', 'Created'].join(','),
      ...users.map(u => [
        u.id,
        `"${u.name}"`,
        `"${u.email}"`,
        u.role || '',
        u.banned ? 'Banned' : 'Active',
        u._count.enrollments,
        u.createdAt.toISOString()
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'selected-users.csv';
    a.click();
    URL.revokeObjectURL(url);
    setRowSelection({});
    toast.success(`Exported ${users.length} users`);
  };

  const handleBanSelected = () => {
    const selectedRows = table.getFilteredSelectedRowModel().rows;
    const userIds = selectedRows.map(row => row.original.id);
    
    if (currentUserId && userIds.includes(currentUserId)) {
      toast.error("You cannot ban yourself");
      return;
    }
    
    openBanDialog(userIds);
  };

  const selectedUserIds = table.getFilteredSelectedRowModel().rows.map(row => row.original.id);
  const includesCurrentUser = Boolean(currentUserId && selectedUserIds.includes(currentUserId));

  return (
    <div className="space-y-4">

      <div className="rounded-md border overflow-x-auto">
        <Table className="min-w-full">
          <TableHeader className="[&_tr]:bg-muted/50 [&_tr]:hover:bg-muted/50">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="whitespace-nowrap [&_tr]:hover:bg-muted/50">
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

      {selectedCount > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
          <div className="flex items-center gap-3 bg-background border rounded-lg shadow-lg px-4 py-2">
            <span className="text-sm font-medium whitespace-nowrap">
              {selectedCount} selected
            </span>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="destructive"
                onClick={handleBanSelected}
                disabled={includesCurrentUser}
                title={includesCurrentUser ? "You cannot ban yourself" : undefined}
              >
                <IconShield className="mr-1 h-4 w-4" />
                Ban
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleExportSelected}
              >
                <IconDownload className="mr-1 h-4 w-4" />
                Export
              </Button>
            </div>
            <Button
              size="sm"
              variant="ghost"
              className="h-6 w-6 p-0"
              onClick={() => setRowSelection({})}
            >
              <IconX className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      <UserDetailDrawer
        user={selectedUser}
        open={drawerOpen}
        onOpenChange={(open) => {
          setDrawerOpen(open);
          if (!open) {
            setSelectedUser(null);
            setIsLoadingUser(false);
          }
        }}
        isLoading={isLoadingUser}
      />

      <BanDialog
        open={banDialogOpen}
        onOpenChange={setBanDialogOpen}
        userIds={banUserIds}
        userNames={data.filter(u => banUserIds.includes(u.id)).map(u => u.name)}
        onBanSuccess={(bannedUserIds) => {
          setData(prev => prev.map(user => 
            bannedUserIds.includes(user.id) 
              ? { ...user, banned: true } 
              : user
          ));
        }}
      />

      {emailUser && (
        <SendEmailSheet
          open={sendEmailOpen}
          onOpenChange={setSendEmailOpen}
          userEmail={emailUser.email}
          userName={emailUser.name}
        />
      )}

      {sessionUser && (
        <SessionsSheet
          open={sessionsOpen}
          onOpenChange={setSessionsOpen}
          userId={sessionUser.id}
          userName={sessionUser.name}
        />
      )}
    </div>
  );
}