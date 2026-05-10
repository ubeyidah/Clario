"use client";

import * as React from "react";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { IconTrash, IconDeviceDesktop } from "@tabler/icons-react";
import { authClient } from "@/lib/auth-client";

interface SessionsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  userName: string;
}

type SessionData = {
  id: string;
  expiresAt: Date;
  createdAt: Date;
  ipAddress: string | null;
  userAgent: string | null;
  token: string;
  impersonatedBy: string | null;
};

function SessionsSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="border rounded-lg p-4 space-y-3">
          <div className="flex items-start justify-between">
            <div className="space-y-2 w-full">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4 rounded" />
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="h-3 w-32" />
              <Skeleton className="h-3 w-40" />
              <Skeleton className="h-3 w-36" />
            </div>
            <Skeleton className="h-8 w-16" />
          </div>
        </div>
      ))}
    </div>
  );
}

function SessionsList({ sessions, onRevoke, onRevokeAll, isRevokingAll, revokingIds }: { 
  sessions: SessionData[];
  onRevoke: (sessionToken: string) => void;
  onRevokeAll: () => void;
  isRevokingAll: boolean;
  revokingIds: Set<string>;
}) {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString();
  };

  const getDeviceInfo = (userAgent: string | null) => {
    if (!userAgent) return "Unknown device";
    if (userAgent.includes("Chrome")) return "Chrome";
    if (userAgent.includes("Firefox")) return "Firefox";
    if (userAgent.includes("Safari")) return "Safari";
    if (userAgent.includes("Edge")) return "Edge";
    return "Unknown browser";
  };

  if (sessions.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <IconDeviceDesktop className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>No active sessions</p>
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button
          variant="destructive"
          size="sm"
          onClick={onRevokeAll}
          disabled={isRevokingAll}
        >
          {isRevokingAll ? <Spinner className="mr-2 h-4 w-4" /> : <IconTrash className="mr-2 h-4 w-4" />}
          Revoke All
        </Button>
      </div>
      <div className="space-y-3">
        {sessions.map((session) => (
          <div
            key={session.id}
            className="border rounded-lg p-4 space-y-3"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <IconDeviceDesktop className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{getDeviceInfo(session.userAgent)}</span>
                  {session.impersonatedBy && (
                    <Badge variant="outline" className="text-xs">
                      Impersonated
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  IP: {session.ipAddress || "Unknown"}
                </p>
                <p className="text-xs text-muted-foreground">
                  Created: {formatDate(session.createdAt)}
                </p>
                <p className="text-xs text-muted-foreground">
                  Expires: {formatDate(session.expiresAt)}
                </p>
                {session.userAgent && (
                  <p className="text-xs text-muted-foreground truncate" title={session.userAgent}>
                    {session.userAgent}
                  </p>
                )}
              </div>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onRevoke(session.token)}
                disabled={revokingIds.has(session.token)}
              >
                {revokingIds.has(session.token) ? (
                  <Spinner className="h-4 w-4" />
                ) : (
                  <IconTrash className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export function SessionsSheet({ open, onOpenChange, userId, userName }: SessionsSheetProps) {
  const [sessions, setSessions] = useState<SessionData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRevokingAll, setIsRevokingAll] = useState(false);
  const [revokingIds, setRevokingIds] = useState<Set<string>>(new Set());
  const [shouldFetch, setShouldFetch] = useState(false);

  React.useEffect(() => {
    if (open && userId && shouldFetch) {
      setIsLoading(true);
      authClient.admin.listUserSessions({ userId })
        .then((response) => {
          if (response && "sessions" in response) {
            setSessions(response.sessions as SessionData[]);
          } else {
            setSessions([]);
          }
        })
        .catch((error) => {
          console.error("Failed to fetch sessions:", error);
          toast.error("Failed to load sessions");
        })
        .finally(() => setIsLoading(false));
    }
  }, [open, userId, shouldFetch]);

  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      setShouldFetch(true);
    } else {
      setShouldFetch(false);
      setSessions([]);
    }
    onOpenChange(isOpen);
  };

  const handleRevoke = async (sessionToken: string) => {
    setRevokingIds(prev => new Set(prev).add(sessionToken));
    try {
      await authClient.admin.revokeUserSession({ sessionToken });
      setSessions(prev => prev.filter(s => s.token !== sessionToken));
      toast.success("Session revoked");
    } catch (error) {
      console.error("Failed to revoke session:", error);
      toast.error("Failed to revoke session");
    } finally {
      setRevokingIds(prev => {
        const next = new Set(prev);
        next.delete(sessionToken);
        return next;
      });
    }
  };

  const handleRevokeAll = async () => {
    setIsRevokingAll(true);
    try {
      await authClient.admin.revokeUserSessions({ userId });
      toast.success("All sessions revoked");
      setSessions([]);
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to revoke all sessions:", error);
      toast.error("Failed to revoke sessions");
    } finally {
      setIsRevokingAll(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-lg flex flex-col">
        <SheetHeader className="px-6">
          <SheetTitle>Sessions - {userName}</SheetTitle>
          <SheetDescription>
            Manage active sessions for this user
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {isLoading ? (
            <SessionsSkeleton />
          ) : (
            <SessionsList 
              sessions={sessions}
              onRevoke={handleRevoke}
              onRevokeAll={handleRevokeAll}
              isRevokingAll={isRevokingAll}
              revokingIds={revokingIds}
            />
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}