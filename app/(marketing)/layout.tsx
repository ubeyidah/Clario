import { ReactNode } from "react"
import Navbar from "./_components/navbar"

const Layout = ({ children }: { children: ReactNode }) => {

  return (
    <div>
      <Navbar />
      {children}
      <div>Footer</div>
    </div>
  )
}

export default Layout 
