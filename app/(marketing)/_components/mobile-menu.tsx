import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Menu } from "lucide-react";
import NavLinks from "./nva-links";
import UserProfile from "./user-profile";
const MobileMenu = () => {
  return (
    <div className="md:hidden">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size="icon" className="rounded-xl md:hidden">
            <Menu />
          </Button>
        </DialogTrigger>
        <DialogContent className="top-44 pt-12">
          <DialogTitle></DialogTitle>
          <NavLinks className="flex-col" />
          <UserProfile />
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default MobileMenu; 
