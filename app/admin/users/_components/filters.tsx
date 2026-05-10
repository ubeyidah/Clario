"use client";

import SearchBar from "@/components/ui/search-bar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import * as React from "react";

interface FiltersProps {
  search: string;
  status: string;
  role: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onRoleChange: (value: string) => void;
}

const Filters = ({ search, status, role, onSearchChange, onStatusChange, onRoleChange }: FiltersProps) => {
  const handleStatusChange = (value: string) => {
    const newValue = value === "all" ? "" : value;
    onStatusChange(newValue);
  };

  const handleRoleChange = (value: string) => {
    const newValue = value === "all" ? "" : value;
    onRoleChange(newValue);
  };

  return (
    <div className="flex items-center gap-4 w-full md:w-auto">
      <SearchBar
        placeholder="Search users by name or email..."
        value={search}
        handleChange={onSearchChange}
      />
      <Select value={status || "all"} onValueChange={handleStatusChange}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Users</SelectItem>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="banned">Banned</SelectItem>
        </SelectContent>
      </Select>
      <Select value={role || "all"} onValueChange={handleRoleChange}>
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
  );
};

export default Filters;