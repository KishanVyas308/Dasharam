"use client";

import { useState } from "react";
import { Link } from "react-router-dom";
import { useRecoilState } from "recoil";
import { motion, AnimatePresence } from "framer-motion";
import { userAtom } from "../../state/userAtom";
import Cookies from "js-cookie";
import {
  FaChalkboardTeacher,
  FaUserGraduate,
  FaBook,
  FaClipboardList,
  FaUserCheck,
  FaBars,
  FaSignOutAlt,
} from "react-icons/fa";
import { UserRole } from "../../types/type";
import Sidebar from "./Sidebar";

export const menuItems = [
  { title: "Manage Subjects", icon: FaBook, link: "/subject-std" },
  {
    title: "Manage Teachers",
    icon: FaChalkboardTeacher,
    link: "/manage-teacher",
  },
  { title: "Manage Students", icon: FaUserGraduate, link: "/manage-student" },
  { title: "Manage Tests", icon: FaClipboardList, link: "/manage-test" },
  { title: "Attendance", icon: FaUserCheck, link: "/add-attedance" },
];

export default function Dashboard() {
  const [user, setUser] = useRecoilState(userAtom);
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    Cookies.remove("user");
    setUser(null);
    console.log("User logged out");
  };

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar */}
      <AnimatePresence>
        <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} isHome={true}/>
      </AnimatePresence>

      

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <div className="flex items-center">
              <button
                onClick={toggleSidebar}
                className="md:hidden mr-4 text-gray-600 hover:text-gray-900"
              >
                <FaBars size={24} />
              </button>
              <h2 className="text-2xl font-semibold text-gray-800">
                Dashboard
              </h2>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative group">
                <div className="flex items-center space-x-2 cursor-pointer">
                  <img
                    src="https://th.bing.com/th/id/OIP.n0waXJvNzJqj3wmDBfS1ZwHaHa?w=165&h=180&c=7&r=0&o=5&dpr=2&pid=1.7"
                    alt="User Avatar"
                    className="rounded-full w-10 h-10"
                  />
                  <span className="text-gray-800 font-medium">
                    {user?.name || "User"}
                  </span>
                </div>
                <div className="absolute right-0 w-48 mt-2 py-2 bg-white rounded-md shadow-xl z-20 hidden group-hover:block">
                  <button
                    onClick={handleLogout}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-500 hover:text-white w-full text-left"
                  >
                    <FaSignOutAlt className="inline-block mr-2" /> Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-3xl font-bold text-gray-900 mb-6"
            >
              Welcome to Dasharam School Management System
            </motion.h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {menuItems.map((item, index) =>
                user?.role === UserRole.Teacher
                  ? (item.title === "Manage Tests" ||
                      item.title === "Attendance") &&
                    DashboardComponent({ item, index })
                  : DashboardComponent({ item, index })
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

interface dashbardComponentType {
  item: any;
  index: any;
}

const DashboardComponent = ({ item, index }: dashbardComponentType) => {
  return (
    <motion.div
      key={item.title}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Link
        to={item.link}
        className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
      >
        <div className="p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-indigo-500 rounded-full p-3 transition-all duration-300 hover:bg-indigo-600">
              <motion.div
                whileHover={{ scale: 1.2, rotate: 20 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <item.icon className="w-6 h-6 text-white" />
              </motion.div>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">
                {item.title}
              </h3>
              <p className="mt-1 text-sm text-gray-500">Click to manage</p>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

// const SidebarComponent = ({ item, index }: dashbardComponentType) => {
//   return (
//     <motion.div
//       key={item.title}
//       initial={{ opacity: 0, x: -20 }}
//       animate={{ opacity: 1, x: 0 }}
//       transition={{ delay: index * 0.1 }}
//     >
//       <Link
//         to={item.link}
//         className="flex items-center px-6 py-3 text-gray-100 hover:bg-indigo-800 transition-colors duration-200"
//       >
//         <item.icon className="w-5 h-5 mr-3" />
//         {item.title}
//       </Link>
//     </motion.div>
//   );
// };
