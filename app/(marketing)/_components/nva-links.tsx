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

interface Props {
  className?: string
}
const NavLinks = ({ className }: Props) => {
  const pathname = usePathname()
  return (
    <div className={cn("flex gap-2", className)}>
      {
        navigationLinks.map(link => {
          const isActive = link.href != "/" ? pathname.startsWith(link.href) : pathname === "/"
          return <Link href={link.href} key={link.href} className={buttonVariants({ variant: "link", className: cn({ "hover:no-underline! text-muted-foreground! hover:text-foreground!": true, "text-foreground!": isActive }) })}> {link.label}</Link>
        })
      }
    </div>
  )
}

export default NavLinks; 
