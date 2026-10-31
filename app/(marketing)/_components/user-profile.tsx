"use client"

import { authClient } from "@/lib/auth-client"
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { buttonVariants } from "@/components/ui/button"
import Link from "next/link"
import { useTheme } from "next-themes"
import { Check } from "lucide-react"
import useLogout from "@/hooks/use-logout"

const UserProfile = () => {

  const { signOut } = useLogout()
  const { setTheme, theme } = useTheme()
  const { data, error, isPending } = authClient.useSession()
  if (!data || isPending || error) return <Link href="/sign-in" className={buttonVariants()}>Sign In</Link>
  const userName = data?.user.name || data?.user.email?.split('@')[0]
  const fallbackImage = `https://avatar.vercel.sh/${userName}?rounded=60`
  const isAdmin = data?.user.role === "admin"

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="w-8 h-8 cursor-pointer">
            <AvatarImage className="size-8" src={data?.user.image ?? fallbackImage} alt={userName} />
            <AvatarFallback>{userName?.slice(0, 2)}</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" sideOffset={10} className='w-56'>
          <DropdownMenuLabel className='flex items-center gap-2'>
            <Avatar>
              <AvatarImage src={data?.user.image ?? fallbackImage} alt={userName} />
              <AvatarFallback>{userName?.slice(0, 2)}</AvatarFallback>
            </Avatar>
            <div className='flex flex-1 flex-col'>
              <span className='text-popover-foreground'>{userName}</span>
              <span className='text-muted-foreground text-xs'>{data?.user.email}</span>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem asChild>
              <Link href="/dashboard" className="w-full cursor-pointer">My Learning</Link>
            </DropdownMenuItem>
            {isAdmin && (
              <DropdownMenuItem asChild>
                <Link href="/admin" className="w-full cursor-pointer">Admin Dashboard</Link>
              </DropdownMenuItem>
            )}
            <DropdownMenuItem asChild>
              <Link href="/courses" className="w-full cursor-pointer">Browse Courses</Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Themes</DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <DropdownMenuItem className="flex justify-between items-center" onClick={() => setTheme("system")}>System {theme == "system" && <Check />}</DropdownMenuItem>
                  <DropdownMenuItem className="flex justify-between items-center" onClick={() => setTheme("dark")}>Dark {theme == "dark" && <Check />} </DropdownMenuItem>
                  <DropdownMenuItem className="flex justify-between items-center" onClick={() => setTheme("light")}>Light {theme == "light" && <Check />} </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
            <DropdownMenuItem variant="destructive" onClick={signOut} className="cursor-pointer">Sign Out</DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

    </div>
  )
}

export default UserProfile 
