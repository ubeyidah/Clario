"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IconDownload } from "@tabler/icons-react";
import type { UserListParams } from "@/app/data/admin/get-admin-users";
import { useTransition } from "react";

interface ExportButtonProps {
  params: UserListParams;
}

export function ExportButton({ params }: ExportButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleExport = (format: "csv" | "json") => {
    startTransition(async () => {
      const { exportUsersAsCSV, exportUsersAsJSON } = await import("../actions");

      const data = format === "csv"
        ? await exportUsersAsCSV(params)
        : await exportUsersAsJSON(params);

      const blob = new Blob([data], { type: format === "csv" ? "text/csv" : "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `users.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" size="sm" disabled={isPending}>
          <IconDownload className="mr-2 h-4 w-4" />
          {isPending ? "Exporting..." : "Export Users"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Export Format</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handleExport("csv")}>
          Export as CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport("json")}>
          Export as JSON
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}