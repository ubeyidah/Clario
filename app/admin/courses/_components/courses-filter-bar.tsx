"use client";

import * as React from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import SearchBar from "@/components/ui/search-bar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { COURSE_CATEGORIES } from "@/lib/constants";

interface CoursesFilterBarProps {
  currentSearch?: string;
  currentCategory?: string;
  currentStatus?: string;
}

export function CoursesFilterBar({
  currentSearch = "",
  currentCategory = "all-courses",
  currentStatus = "all",
}: CoursesFilterBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createQueryString = React.useCallback(
    (params: Record<string, string | null>) => {
      const newParams = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(params)) {
        if (!value || value === "all" || value === "all-courses") {
          newParams.delete(key);
        } else {
          newParams.set(key, value);
        }
      }
      return newParams.toString();
    },
    [searchParams]
  );

  const handleSearch = (searchVal: string) => {
    const qs = createQueryString({ search: searchVal.trim() ? searchVal : null });
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  const handleCategoryChange = (catVal: string) => {
    const qs = createQueryString({ category: catVal });
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  const handleStatusChange = (statusVal: string) => {
    const qs = createQueryString({ status: statusVal });
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Status Pills */}
        <Tabs
          value={currentStatus || "all"}
          onValueChange={handleStatusChange}
          className="w-full md:w-auto"
        >
          <TabsList className="h-9">
            <TabsTrigger value="all" className="text-xs">
              All Courses
            </TabsTrigger>
            <TabsTrigger value="Published" className="text-xs">
              Published
            </TabsTrigger>
            <TabsTrigger value="Draft" className="text-xs">
              Drafts
            </TabsTrigger>
            <TabsTrigger value="Archived" className="text-xs">
              Archived
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Search & Category Filter */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="w-full md:w-64">
            <SearchBar
              value={currentSearch}
              handleChange={handleSearch}
              placeholder="Search course title..."
            />
          </div>

          <Select
            value={currentCategory || "all-courses"}
            onValueChange={handleCategoryChange}
          >
            <SelectTrigger className="w-[180px] h-9 text-xs">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent align="end">
              <SelectItem value="all-courses">All Categories</SelectItem>
              {COURSE_CATEGORIES.map((category) => (
                <SelectItem key={category.id} value={category.label}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
