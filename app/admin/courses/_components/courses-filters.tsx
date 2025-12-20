"use client"

import SearchBar from "@/components/ui/search-bar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { COURSE_CATEGORIES } from "@/lib/constants";
import { useQueryState } from "nuqs";

const COURSE_STATUS = [
  { label: "All Status", value: "all-status" },
  { label: "Draft", value: "Draft" },
  { label: "Published", value: "Published" },
  { label: "Archived", value: "Archived" }
] as const;

interface CoursesFiltersProps {
  initialSearch?: string;
  initialCategory?: string;
  initialStatus?: string;
}

export function CoursesFilters({ 
  initialSearch = "", 
  initialCategory = "all-courses", 
  initialStatus = "all-status" 
}: CoursesFiltersProps) {
  const [searchQuery, setSearchQuery] = useQueryState('search', { 
    defaultValue: initialSearch,
    scroll: false 
  });
  const [category, setCategory] = useQueryState('category', { 
    defaultValue: initialCategory,
    scroll: false 
  });
  const [status, setStatus] = useQueryState('status', { 
    defaultValue: initialStatus,
    scroll: false 
  });

  return (
    <div className="flex items-center gap-4 w-full md:w-auto">
      <SearchBar 
        value={searchQuery}
        handleChange={setSearchQuery}
        placeholder="Search courses..."
      />
      <Select value={category} onValueChange={setCategory}>
        <SelectTrigger id="category">
          <SelectValue placeholder="Select category" />
        </SelectTrigger>
        <SelectContent position="item-aligned">
          {[{ label: "All Courses", id: "all-courses" }, ...COURSE_CATEGORIES].map((cat) => (
            <SelectItem key={cat.id} value={cat.id}>
              {cat.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={status} onValueChange={setStatus}>
        <SelectTrigger id="status">
          <SelectValue placeholder="Select status" />
        </SelectTrigger>
        <SelectContent position="item-aligned">
          {COURSE_STATUS.map((statusOption) => (
            <SelectItem key={statusOption.value} value={statusOption.value}>
              {statusOption.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}