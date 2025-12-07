"use client"

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navigationLinks = [
  { href: "/", label: "Home" },
  { href: "/#features", label: "Features" },
  { href: "/courses", label: "Courses" },
  { href: "/about", label: "About" },
];
const NavLinks = () => {
  const pathname = usePathname()
  return (
    <div className="flex gap-2">
      {
        navigationLinks.map(link => {
          const isActive = link.href != "/" ? pathname.startsWith(link.href) : pathname === "/"
          return <Link href={link.href} key={link.href} className={buttonVariants({ variant: "ghost", className: cn({ "bg-accent text-accent-foreground dark:bg-accent/50": isActive }) })}> {link.label}</Link>
        })
      }
    </div>
  )
}

export default NavLinks; 
