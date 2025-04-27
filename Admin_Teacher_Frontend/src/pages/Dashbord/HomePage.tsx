"use client";

import { Link } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import { motion } from "framer-motion";
import { userAtom } from "../../state/userAtom";

import { UserRole } from "../../types/type";
import { menuItems } from "../../App";
import { useEffect, useState } from "react";
import { studentsAtom } from "../../state/studentsAtom";
import axios from "axios";
import { BACKEND_URL } from "../../config";
import { toast } from "react-toastify";
import { teachersAtom } from "../../state/teachersAtom";
import Loading from "../../components/Loading";



export default function Dashboard() {
  const user = useRecoilValue(userAtom);

  const [totalTeachers, setTotalTeachers] = useState(0);
  const [totalStudents, setTotalStudents] = useState(0);

  const [students, setStudents] = useRecoilState<any>(studentsAtom)
  const [teachers, setTeachers] = useRecoilState(teachersAtom)

  const [isLoading, setIsLoading] = useState(true)

  const getAllStudents = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/student/all`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      )

      console.log("students", res.data);

      if (res.status === 200) {

        return res.data
      }
    } catch (error: any) {
      toast.error("Failed to fetch updated standards list")
      return []
    }
  }

  const getAllTeachers = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/teacher/all`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      )
      if (res.status === 200) {
        setIsLoading(false)
        return res.data
      }
    } catch (error: any) {
      setIsLoading(false)
      toast.error("Failed to fetch updated teachers list")
      return []
    }

    setIsLoading(false)
  }


  useEffect(() => {
    if (user?.role === UserRole.Admin) {
      if (students.length === 0) {
        setIsLoading(true)
        const fetchStudents = async () => {
          const data = await getAllStudents()
          setStudents(data)
          setTotalStudents(data.length)
        }
        fetchStudents()
      } else {
        setTotalStudents(students.length)
      }
      if (teachers.length === 0) {
        const fetchTeachers = async () => {
          const data = await getAllTeachers()
          setTeachers(data)
          setTotalTeachers(data.length)
        }
        fetchTeachers()
      } else {
        setTotalTeachers(teachers.length)
      }
    }
    setIsLoading(false)
  }, [])




  return (

    <div className="flex-1 flex flex-col overflow-hidden">
      {
        isLoading && <Loading />
      }
      <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gradient-to-br">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header Section */}
          <div className="mb-8">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col md:flex-row justify-between items-start md:items-center"
            >
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Welcome{user?.name ? `, ${user.name}` : ''}
                </h1>
                <p className="mt-2 text-gray-600">
                  Dasharam School Management Dashboard
                </p>
              </div>
              <div className="mt-4 md:mt-0 bg-white py-2 px-4 rounded-lg shadow-sm border border-gray-200">
                <p className="text-sm text-gray-500">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>
            </motion.div>
          </div>

          {/* Quick Stats */}
          {user?.role === UserRole.Admin && (


            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
            >
              {[
                { label: 'Total Students', value: totalStudents, color: 'bg-blue-500' },
                { label: 'Total Teachers', value: totalTeachers, color: 'bg-green-500' },
                // { label: 'Upcoming Events', value: '8', color: 'bg-purple-500' }
              ].map((stat, i) => (
                <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 relative overflow-hidden">
                  <div className={`absolute top-0 left-0 w-1 h-full ${stat.color}`}></div>
                  <p className="text-gray-500 text-sm font-medium">{stat.label}</p>
                  <p className="text-2xl font-bold mt-2 text-gray-800">{stat.value}</p>
                </div>
              ))}
            </motion.div>

          )}

          {/* Main Menu Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Access</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {menuItems.map((item, index) =>
                user?.role === UserRole.Teacher
                  ? (item.title === "Manage Tests" || item.title === "Attendance") &&
                  DashboardComponent({ item, index })
                  : DashboardComponent({ item, index })
              )}
            </div>
          </motion.div>
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
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
      className="h-full"
    >
      <Link
        to={item.link}
        className={`relative group block h-full bg-white overflow-hidden rounded-xl ${item.underDevelopment ? "cursor-not-allowed" : ""
          } border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300`}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

        <div className="relative p-6 h-full">
          <div className="flex items-center">
            <div className={`flex-shrink-0 rounded-lg p-3 ${item.underDevelopment
              ? "bg-gray-100 text-gray-400"
              : "bg-indigo-50 text-indigo-600 group-hover:bg-indigo-100 group-hover:text-indigo-700"
              } transition-all duration-300`}>
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <item.icon className="w-7 h-7" />
              </motion.div>
            </div>
            <div className="ml-4 flex-1">
              <h3 className={`text-lg font-semibold ${item.underDevelopment
                ? "text-gray-500"
                : "text-gray-800 group-hover:text-indigo-700"
                } transition-colors duration-200`}>
                {item.title}
              </h3>

              <div className="mt-1.5">
                {item.underDevelopment ? (
                  <div className="flex items-center">
                    <span className="inline-flex items-center text-xs font-medium text-red-600 bg-red-50 px-2.5 py-1 rounded-full">
                      <span className="mr-1.5 w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></span>
                      Under Development
                    </span>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 group-hover:text-indigo-500 transition-colors duration-200">
                    Click to manage
                  </p>
                )}
              </div>
            </div>

            {!item.underDevelopment && (
              <div className="ml-2 transition-transform duration-300 transform group-hover:translate-x-1">
                <svg className="w-5 h-5 text-gray-400 group-hover:text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            )}
          </div>
        </div>

        {!item.underDevelopment && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-500 transform scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-300"></div>
        )}
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
