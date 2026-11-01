import Link from "next/link";
import Image from "next/image";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Compass01Icon,
  Book02Icon,
  DashboardSquare01Icon,
  Home01Icon,
  Search01Icon,
} from "@hugeicons/core-free-icons";

export default function NotFound() {
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
            href="/courses"
            className={buttonVariants({
              variant: "outline",
              size: "sm",
              className: "rounded-xl gap-2 text-xs",
            })}
          >
            <HugeiconsIcon icon={Book02Icon} className="size-4" />
            Browse Courses
          </Link>
        </div>
      </header>

      {/* Main 404 Hero Content */}
      <main className="flex-1 flex items-center justify-center py-16 px-4">
        <div className="max-w-xl mx-auto text-center space-y-8">
          {/* Decorative 404 Badge & Icon */}
          <div className="relative inline-flex items-center justify-center">
            <div className="size-28 rounded-3xl bg-muted/60 border border-border/80 flex items-center justify-center text-primary shadow-xl backdrop-blur-md">
              <HugeiconsIcon icon={Compass01Icon} className="size-14 stroke-[1.5]" />
            </div>
            <Badge
              variant="secondary"
              className="absolute -bottom-3 px-3 py-1 text-xs font-mono font-bold tracking-wider shadow-sm uppercase border border-border"
            >
              Error 404
            </Badge>
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground font-heading">
              Page Not Found
            </h1>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-md mx-auto">
              The page or course you are looking for does not exist, may have been relocated, or is temporarily unavailable.
            </p>
          </div>

          {/* Quick Helpful Navigation Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-lg mx-auto text-left">
            <Link
              href="/courses"
              className="group p-4 rounded-2xl border border-border/70 bg-card/50 hover:bg-card hover:border-primary/50 transition-all flex flex-col justify-between gap-3 shadow-xs"
            >
              <div className="size-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-105 transition-transform">
                <HugeiconsIcon icon={Book02Icon} className="size-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                  Course Catalog
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Browse all active courses
                </p>
              </div>
            </Link>

            <Link
              href="/dashboard"
              className="group p-4 rounded-2xl border border-border/70 bg-card/50 hover:bg-card hover:border-primary/50 transition-all flex flex-col justify-between gap-3 shadow-xs"
            >
              <div className="size-9 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center group-hover:scale-105 transition-transform">
                <HugeiconsIcon icon={DashboardSquare01Icon} className="size-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground group-hover:text-blue-500 transition-colors">
                  My Learning
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Resume your enrolled courses
                </p>
              </div>
            </Link>

            <Link
              href="/"
              className="group p-4 rounded-2xl border border-border/70 bg-card/50 hover:bg-card hover:border-primary/50 transition-all flex flex-col justify-between gap-3 shadow-xs"
            >
              <div className="size-9 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center group-hover:scale-105 transition-transform">
                <HugeiconsIcon icon={Home01Icon} className="size-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground group-hover:text-amber-500 transition-colors">
                  Home Page
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Return to landing page
                </p>
              </div>
            </Link>
          </div>

          {/* Primary Action Buttons */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/courses"
              className={buttonVariants({
                size: "lg",
                className: "rounded-xl gap-2 font-medium shadow-sm",
              })}
            >
              <HugeiconsIcon icon={Search01Icon} className="size-4" />
              Explore All Courses
            </Link>
            <Link
              href="/"
              className={buttonVariants({
                variant: "outline",
                size: "lg",
                className: "rounded-xl gap-2 font-medium",
              })}
            >
              <HugeiconsIcon icon={Home01Icon} className="size-4" />
              Go Home
            </Link>
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
