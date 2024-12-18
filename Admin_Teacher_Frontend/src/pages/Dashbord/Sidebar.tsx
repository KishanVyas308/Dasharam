import { motion, AnimatePresence } from "framer-motion";
import React from "react";
import { FaTimes } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { userAtom } from "../../state/userAtom";
import { menuItems } from "./HomePage";
import { UserRole } from "../../types/type";

const Sidebar = ({isSidebarOpen, toggleSidebar, isHome = false} : {isSidebarOpen : any, toggleSidebar : any, isHome?: boolean}) => {
    const user = useRecoilValue(userAtom);
  return (
    <>
      {(isSidebarOpen || window.innerWidth > 768) && (
        <motion.aside
          initial={{ x: isHome ? -300 : 0 }}
          animate={{ x: 0 }}
          exit={{ x:  isHome ? -300 : 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed md:static top-0 left-0 h-full w-64 bg-indigo-700 text-white shadow-lg z-50"
        >
          <div className="p-5 flex justify-between items-center">
            <h1 className="text-2xl font-bold">Dasharam SMS</h1>
            <button onClick={toggleSidebar} className="md:hidden text-white">
              <FaTimes size={24} />
            </button>
          </div>
          <nav className="mt-8">
            {menuItems.map((item, index) =>
              user?.role === UserRole.Teacher
                ? (item.title === "Manage Tests" ||
                    item.title === "Attendance") &&
                  SidebarComponent({ item, index })
                : SidebarComponent({ item, index })
            )}
          </nav>
        </motion.aside>
      )}
    </>

  );
};

interface dashbardComponentType {
  item: any;
  index: any;
}

const SidebarComponent = ({ item, index }: dashbardComponentType) => {
  return (
    <motion.div
      key={item.title}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Link
        to={item.link}
        className="flex items-center px-6 py-3 text-gray-100 hover:bg-indigo-800 transition-colors duration-200"
      >
        <item.icon className="w-5 h-5 mr-3" />
        {item.title}
      </Link>
    </motion.div>
  );
};

export default Sidebar;
