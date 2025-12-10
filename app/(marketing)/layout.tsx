import { ReactNode } from "react"
import Navbar from "./_components/navbar"
import Footer from "./_components/footer"

const Layout = ({ children }: { children: ReactNode }) => {

  return (
    <div>
      <Navbar />
      {children}
      <Footer />
    </div>
  )
}

export default Layout 
