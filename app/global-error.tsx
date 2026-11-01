"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Critical Global Error:", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen bg-neutral-950 text-neutral-100 flex items-center justify-center p-4 font-sans">
        <div className="max-w-md w-full text-center space-y-6 p-8 rounded-3xl border border-neutral-800 bg-neutral-900/80 shadow-2xl backdrop-blur-md">
          <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-red-500/10 text-red-400 ring-8 ring-red-500/5">
            <svg
              className="size-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Critical Application Error
            </h1>
            <p className="text-sm text-neutral-400">
              A critical error occurred while initializing the application. You can attempt to reload the application.
            </p>
            {error.digest && (
              <p className="text-xs font-mono text-neutral-500 mt-2">
                Digest: {error.digest}
              </p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => reset()}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white text-neutral-950 font-semibold text-sm hover:bg-neutral-200 transition-colors cursor-pointer"
            >
              Reload Application
            </button>
            <Link
              href="/"
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-neutral-800 text-neutral-300 font-medium text-sm hover:bg-neutral-800 transition-colors"
            >
              Return Home
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
