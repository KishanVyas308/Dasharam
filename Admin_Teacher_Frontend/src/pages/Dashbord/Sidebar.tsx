import { motion } from "framer-motion";
import { FaTimes } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { userAtom } from "../../state/userAtom";
import { UserRole } from "../../types/type";
import { menuItems } from "../../App";

interface SidebarProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  isHome?: boolean;
}

interface MenuItem {
  title: string;
  link: string;
  icon: React.ElementType;
}

const Sidebar: React.FC<SidebarProps> = ({ isSidebarOpen, toggleSidebar, isHome = false }) => {
  const user = useRecoilValue(userAtom);
  const location = useLocation();

  return (
    <>
      {(isSidebarOpen || window.innerWidth > 768) && (
        <motion.aside
          initial={{ x: isHome ? -300 : 0 }}
          animate={{ x: 0 }}
          exit={{ x: isHome ? -300 : 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed md:static top-0 left-0 h-full w-72 bg-gradient-to-b from-indigo-800 to-indigo-700 text-white shadow-xl z-50 overflow-y-auto"
        >
          <div className="p-6 flex justify-between items-center border-b border-indigo-600">
            <Link to="/" className="text-white flex items-center gap-2">
              <span className="text-2xl font-bold">Dasaram</span>
            </Link>
            <button 
              onClick={toggleSidebar} 
              className="md:hidden text-white hover:bg-indigo-600 p-2 rounded-full transition-colors duration-200"
            >
              <FaTimes size={20} />
            </button>
          </div>
          
          <nav className="mt-6 px-2">
            <div className="space-y-1.5">
              {menuItems.map((item, index) => {
                if (user?.role === UserRole.Teacher) {
                  return (item.title === "Manage Tests" || item.title === "Attendance") && (
                    <SidebarItem 
                      key={item.title}
                      item={item} 
                      index={index} 
                      isActive={location.pathname === item.link}
                    />
                  );
                }
                return (
                  <SidebarItem 
                    key={item.title}
                    item={item} 
                    index={index} 
                    isActive={location.pathname === item.link}
                  />
                );
              })}
            </div>
          </nav>
        </motion.aside>
      )}
    </>
  );
};

interface SidebarItemProps {
  item: MenuItem;
  index: number;
  isActive: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ item, index, isActive }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Link
        to={item.link}
        className={`flex items-center px-4 py-3 rounded-lg text-gray-100 transition-all duration-200 ${
          isActive 
            ? 'bg-indigo-600 shadow-md font-medium' 
            : 'hover:bg-indigo-800/60'
        }`}
      >
        <item.icon className={`w-5 h-5 mr-3 ${isActive ? 'text-white' : 'text-indigo-300'}`} />
        <span>{item.title}</span>
        {isActive && (
          <div className="w-1.5 h-full bg-white absolute right-0 rounded-l-full"></div>
        )}
      </Link>
    </motion.div>
  );
};

export default Sidebar;
