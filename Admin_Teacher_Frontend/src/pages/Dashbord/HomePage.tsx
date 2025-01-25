"use client";

import { Link } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { motion } from "framer-motion";
import { userAtom } from "../../state/userAtom";

import { UserRole } from "../../types/type";
import { menuItems } from "../../App";



export default function Dashboard() {
  const user = useRecoilValue(userAtom);


  return (

    <div className="flex-1 flex flex-col overflow-hidden">


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
            <div className={`flex items-center ${item.underDevelopment ? "opacity-50" : ""}`}>
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
              {item.underDevelopment ? (
                <span className="ml-2 text-xs text-red-600 bg-red-200 px-2 py-1 rounded-full uppercase font-semibold">
                Under Development
                </span>
              ) : (
                <p className="mt-1 text-sm text-gray-500">Click to manage</p>
              )}
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
