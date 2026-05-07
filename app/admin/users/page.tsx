import { SiteHeader } from "@/components/common/site-header";
import SearchBar from "@/components/ui/search-bar";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Suspense } from "react";
import { UsersTable } from "./_components/users-table";
import { UsersTableSkeleton } from "./_components/users-table-skeleton";
import { getAdminUsers } from "@/app/data/admin/get-admin-users";
import type { UserListParams } from "@/app/data/admin/get-admin-users";

interface UsersPageProps {
  searchParams: {
    search?: string;
    status?: string;
    role?: string;
    page?: string;
    pageSize?: string;
  };
}

const UsersPage = ({ searchParams }: UsersPageProps) => {
  const params: UserListParams = {
    search: searchParams.search,
    status: searchParams.status as "active" | "inactive" | "banned" | "all" | undefined,
    role: searchParams.role as "admin" | "student" | "all" | undefined,
    page: searchParams.page ? parseInt(searchParams.page) : 0,
    pageSize: searchParams.pageSize ? parseInt(searchParams.pageSize) : 10,
  };

  return (
    <main>
      <SiteHeader>
        <Button variant="secondary" size="sm">Export Users</Button>
      </SiteHeader>
      <div className="p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-xl font-semibold mb-6">User Management</h1>
          <div className="flex items-center gap-4 w-full md:w-auto">
            <SearchBar placeholder="Search users by name or email..." />
            <Select defaultValue="all">
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Users</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="banned">Banned</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all">
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="student">Student</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Suspense fallback={<UsersTableSkeleton />}>
          <RenderUsers params={params} />
        </Suspense>
      </div>
    </main>
  );
};

async function RenderUsers({ params }: { params: UserListParams }) {
  const { users } = await getAdminUsers(params);

  return (
    <UsersTable
      initialUsers={users}
    />
  );
}

export default UsersPage;