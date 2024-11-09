import { useLocation } from "react-router-dom";
import { getPageHeader } from "../utils";

const Navbar = () => {
  const { pathname } = useLocation();
  const user = JSON.parse(sessionStorage.getItem('user'));
  return (
    <nav className="flex items-center justify-between bg-white  border-b-2 border-charcoalGray sticky top-0 text-charcoalGray px-8 py-5  w-full">
      <p className="ml-[22%]">{getPageHeader(pathname)}</p>
      <div className="flex  gap-3">
        <p>{user.name || user.username}</p>
        <p className="w-6 h-6 rounded-full bg-softGray"></p>
      </div>
    </nav>
  )
}

export default Navbar

