import { NavLink } from "react-router-dom"

const Sidebar = () => {
  return (
    <div className="w-[20%] h-full border-r-2 border-charcoalGray fixed top-0 left-0">
      <div className="py-5  flex items-center justify-center">LOGO</div>
      <div className="flex flex-col  gap-1 py-3 text-sm">
        <NavLink to="/dashboard" end className={({ isActive }) =>
          `flex gap-2 items-center px-8 py-2 ${isActive ? "bg-softGray" : ""}`
        }> <p className="w-3 h-3  border-2 border-charcoalGray"></p> Dashboard</NavLink>
      </div>
    </div>
  )
}

export default Sidebar