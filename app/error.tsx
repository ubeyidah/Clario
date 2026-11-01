"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  AlertCircleIcon,
  RefreshIcon,
  Home01Icon,
  DashboardSquare01Icon,
  HelpCircleIcon,
} from "@hugeicons/core-free-icons";

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // Log error to console for monitoring
    console.error("Clario Application Error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col justify-between bg-radial-[at_50%_0%] from-muted/30 via-background to-background text-foreground">
      {/* Top Simple Brand Header */}
      <header className="py-6 border-b border-border/40">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <Image
              src="/clario.png"
              width={36}
              height={36}
              alt="Clario Logo"
              className="rounded-xl shadow-xs"
            />
            <span className="font-bold text-xl tracking-tight">Clario</span>
          </Link>
          <Link
            href="/dashboard"
            className={buttonVariants({
              variant: "outline",
              size: "sm",
              className: "rounded-xl gap-2 text-xs",
            })}
          >
            <HugeiconsIcon icon={DashboardSquare01Icon} className="size-4" />
            Dashboard
          </Link>
        </div>
      </header>

      {/* Main Error Content */}
      <main className="flex-1 flex items-center justify-center py-16 px-4">
        <div className="max-w-lg mx-auto text-center space-y-8">
          {/* Decorative Alert Icon */}
          <div className="relative inline-flex items-center justify-center">
            <div className="size-24 rounded-3xl bg-destructive/10 border border-destructive/20 flex items-center justify-center text-destructive shadow-xl backdrop-blur-md">
              <HugeiconsIcon icon={AlertCircleIcon} className="size-12 stroke-[1.5]" />
            </div>
            <Badge
              variant="destructive"
              className="absolute -bottom-3 px-3 py-0.5 text-xs font-mono font-semibold tracking-wider shadow-sm uppercase"
            >
              Application Error
            </Badge>
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground font-heading">
              Something Went Wrong
            </h1>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-md mx-auto">
              We encountered an unexpected issue while processing your request. Our system has logged this incident.
            </p>
          </div>

          {/* Error Digest or Context */}
          {error.digest && (
            <div className="p-3 rounded-xl bg-muted/60 border border-border/70 text-xs font-mono text-muted-foreground inline-block">
              Incident Reference: <span className="text-foreground font-bold">{error.digest}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Button
              onClick={() => reset()}
              size="lg"
              className="rounded-xl gap-2 font-medium shadow-sm"
            >
              <HugeiconsIcon icon={RefreshIcon} className="size-4" />
              Try Again
            </Button>
            <Link
              href="/dashboard"
              className={buttonVariants({
                variant: "outline",
                size: "lg",
                className: "rounded-xl gap-2 font-medium",
              })}
            >
              <HugeiconsIcon icon={DashboardSquare01Icon} className="size-4" />
              My Learning
            </Link>
            <Link
              href="/"
              className={buttonVariants({
                variant: "ghost",
                size: "lg",
                className: "rounded-xl gap-2 font-medium",
              })}
            >
              <HugeiconsIcon icon={Home01Icon} className="size-4" />
              Home
            </Link>
          </div>

          {/* Technical Details Toggle */}
          <div className="pt-4">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <HugeiconsIcon icon={HelpCircleIcon} className="size-3.5" />
              {showDetails ? "Hide technical diagnostic" : "Show technical diagnostic"}
            </button>

            {showDetails && (
              <div className="mt-3 p-4 rounded-xl bg-muted/70 border border-border text-left font-mono text-xs text-muted-foreground overflow-x-auto max-h-48">
                <p className="font-semibold text-destructive mb-1">
                  {error.name || "Error"}: {error.message || "An unexpected error occurred."}
                </p>
                {error.stack && (
                  <pre className="text-[10px] leading-tight text-muted-foreground/80 whitespace-pre-wrap">
                    {error.stack}
                  </pre>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer copyright */}
      <footer className="py-6 border-t border-border/40 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Clario Academy. All rights reserved.
      </footer>
    </div>
  );
}
