import { SiteHeader } from "@/components/common/site-header";
import UsersPageClient from "./_components/users-page-client";
import { getAdminUsers } from "@/app/data/admin/get-admin-users";
import type { UserListParams } from "@/app/data/admin/get-admin-users";
import { RefreshButton } from "./_components/refresh-button";

interface UsersPageProps {
  searchParams: Promise<{
    search?: string;
    status?: string;
    role?: string;
    page?: string;
    pageSize?: string;
  }>;
}

export default async function UsersPage({ searchParams }: UsersPageProps) {
  const resolvedParams = await searchParams;
  
  const params: UserListParams = {
    search: resolvedParams.search,
    status: resolvedParams.status as "active" | "inactive" | "banned" | "all" | undefined,
    role: resolvedParams.role as "admin" | "student" | "all" | undefined,
    page: resolvedParams.page ? parseInt(resolvedParams.page) : 0,
    pageSize: resolvedParams.pageSize ? parseInt(resolvedParams.pageSize) : 10,
  };

  const { users } = await getAdminUsers(params);

  return (
    <main>
      <SiteHeader>
        <RefreshButton />
      </SiteHeader>
      <div className="p-4 md:p-6">
        <h1 className="text-xl font-semibold mb-6">User Management</h1>
        <UsersPageClient initialUsers={users} params={params} />
      </div>
    </main>
  );
}