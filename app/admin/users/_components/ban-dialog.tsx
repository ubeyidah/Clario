"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";

interface BanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userIds: string[];
  userNames?: string[];
  onBanSuccess?: (bannedUserIds: string[]) => void;
}

const DURATION_OPTIONS = [
  { value: "permanent", label: "Permanent", days: null },
  { value: "1", label: "1 Day", days: 1 },
  { value: "7", label: "7 Days", days: 7 },
  { value: "30", label: "30 Days", days: 30 },
  { value: "90", label: "90 Days", days: 90 },
];

export function BanDialog({ open, onOpenChange, userIds, userNames, onBanSuccess }: BanDialogProps) {
  const router = useRouter();
  const [reason, setReason] = useState("");
  const [duration, setDuration] = useState("permanent");
  const [isPending, setIsPending] = useState(false);

  const handleBan = async () => {
    setIsPending(true);
    try {
      const banExpiresIn = duration === "permanent" 
        ? undefined 
        : parseInt(duration) * 24 * 60 * 60;

      const promises = userIds.map((userId) =>
        authClient.admin.banUser({
          userId,
          banReason: reason || undefined,
          banExpiresIn,
        })
      );

      await Promise.all(promises);
      
      toast.success(
        userIds.length === 1 
          ? "User has been banned" 
          : `${userIds.length} users have been banned`
      );
      
      onBanSuccess?.(userIds);
      onOpenChange(false);
      setReason("");
      setDuration("permanent");
      router.refresh();
    } catch (error) {
      console.error("Failed to ban users:", error);
      toast.error("Failed to ban users. Please try again.");
    } finally {
      setIsPending(false);
    }
  };

  const userCount = userIds.length;
  const displayNames = userNames?.slice(0, 3).join(", ");
  const extraCount = userNames && userNames.length > 3 ? ` and ${userNames.length - 3} more` : "";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ban User{userCount > 1 ? "s" : ""}</DialogTitle>
          <DialogDescription>
            {userCount === 1 
              ? `Are you sure you want to ban this user?`
              : `Are you sure you want to ban ${displayNames}${extraCount}?`
            }
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Reason (optional)</label>
            <Textarea
              placeholder="Enter the reason for the ban..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Duration</label>
            <Select value={duration} onValueChange={setDuration}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DURATION_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleBan} disabled={isPending}>
            {isPending ? <Spinner className="mr-2" /> : null}
            Ban{userCount > 1 ? " Users" : ""}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}