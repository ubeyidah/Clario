import Wrapper from "@/components/common/wrapper"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import NavLinks from "./nva-links"
import { Search } from "lucide-react"
import UserProfile from "./user-profile"
import MobileMenu from "./mobile-menu"

const Navbar = () => {
  return (
    <header className="py-4 z-40 relative bg-muted/50 dark:bg-transparent">
      <Wrapper className="flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/clario.png" width={40} height={40} className="max-md:size-10" alt="clario" />
          <h1 className="text-xl font-bold">Clario.</h1>
        </Link>
        <div className="hidden md:block">
          <NavLinks />
        </div>
        <div className="flex gap-2 items-center">
          <Button variant="outline" size="icon" className="rounded-xl hidden md:flex">
            <Search />
          </Button>
          <UserProfile />
          <MobileMenu />
        </div>
      </Wrapper>

    </header >
  )
}

export default Navbar
