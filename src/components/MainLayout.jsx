import { Outlet } from "react-router-dom"
import Navbar from "./Navbar"
import Sidebar from "./Sidebar"

const MainLayout = () => {
  return (
    <div>
      <Navbar />
      <Sidebar />
      <main className="ml-[20%] py-4 ">
        <Outlet />
      </main>
    </div>
  )
}

export default MainLayout