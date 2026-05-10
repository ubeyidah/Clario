"use client";

import { useState, useMemo } from "react";
import { UsersTable } from "./users-table";
import type { AdminUser, UserListParams } from "@/app/data/admin/get-admin-users";
import Filters from "./filters";
import { ExportButton } from "./export-button";

interface UsersPageClientProps {
  initialUsers: AdminUser[];
  params: UserListParams;
}

export default function UsersPageClient({ initialUsers, params }: UsersPageClientProps) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [role, setRole] = useState("");

  const filteredUsers = useMemo(() => {
    return initialUsers.filter((user) => {
      const matchesSearch = !search || 
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase());
      
      const matchesStatus = !status || 
        (status === "banned" && user.banned) ||
        (status === "active" && !user.banned);
      
      const matchesRole = !role ||
        (role === "admin" && user.role === "admin") ||
        (role === "student" && user.role !== "admin");

      return matchesSearch && matchesStatus && matchesRole;
    });
  }, [initialUsers, search, status, role]);

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <Filters 
          search={search}
          status={status}
          role={role}
          onSearchChange={setSearch}
          onStatusChange={setStatus}
          onRoleChange={setRole}
        />
        <ExportButton params={params} />
      </div>
      <UsersTable initialUsers={filteredUsers} />
    </>
  );
}