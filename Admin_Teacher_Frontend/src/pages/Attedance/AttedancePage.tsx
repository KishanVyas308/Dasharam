'use client'

import React, { useEffect, useState } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import { motion } from 'framer-motion'
import { teachersAtom } from '../../state/teachersAtom'
import { stdSubAtom } from '../../state/stdSubAtom'
import { studentsAtom } from '../../state/studentsAtom'
import { userAtom } from '../../state/userAtom'
import { getAllTeachers } from '../../backend/handleTeacher'
import { getAllStdSub } from '../../backend/subjectStdHandle'
import { getAllStudents } from '../../backend/handleStudent'
import AddAttendance from './AddAttedance'
import { FaBars, FaUserCircle, FaSignOutAlt, FaChalkboardTeacher, FaUserGraduate, FaBook, FaClipboardList, FaUserCheck, FaTimes } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import Cookies from 'js-cookie'

const menuItems = [
  { title: "Manage Subjects", icon: FaBook, link: "/subject-std" },
  { title: "Manage Teachers", icon: FaChalkboardTeacher, link: "/manage-teacher" },
  { title: "Manage Students", icon: FaUserGraduate, link: "/manage-student" },
  { title: "Manage Tests", icon: FaClipboardList, link: "/manage-test" },
  { title: "Attendance", icon: FaUserCheck, link: "/add-attedance" },
]

export default function AttendancePage() {
  const [teachers, setTeachers] = useRecoilState(teachersAtom)
  const [stdSubjects, setStdSubjects] = useRecoilState(stdSubAtom)
  const [students, setStudents] = useRecoilState(studentsAtom)
  const user = useRecoilValue(userAtom)

  const [isSidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768)
  const [isProfileOpen, setProfileOpen] = useState(false)
  const [isProfileDropdownOpen, setProfileDropdownOpen] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setSidebarOpen(window.innerWidth > 768)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (teachers.length === 0) {
      getAllTeachers().then((data) => setTeachers(data))
    }
    if (stdSubjects.length === 0) {
      getAllStdSub().then((data) => setStdSubjects(data))
    }
    if (students.length === 0) {
      getAllStudents().then((data) => setStudents(data || []))
    }
  }, [])

  const handleLogout = () => {
    Cookies.remove("user")
    console.log("User logged out")
  }

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen)
  }

  const toggleProfileDropdown = () => {
    setProfileDropdownOpen(!isProfileDropdownOpen)
  }

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar */}
      <motion.aside
        initial={{ x: window.innerWidth <= 768 ? -300 : 0 }}
        animate={{ x: isSidebarOpen || window.innerWidth > 768 ? 0 : -300 }}
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
          {menuItems.map((item) => (
            <Link
              key={item.title}
              to={item.link}
              className="flex items-center px-6 py-3 text-gray-100 hover:bg-indigo-800 transition-colors duration-200"
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.title}
            </Link>
          ))}
        </nav>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">     {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <div className="flex items-center">
              <button onClick={toggleSidebar} className="md:hidden mr-4 text-gray-600 hover:text-gray-900">
                <FaBars size={24} />
              </button>
              <h2 className="text-2xl font-semibold text-gray-800">Attendance</h2>
            </div>
            {/* Profile Section */}
            <div className="relative group md:inline-block">
              <div className="flex items-center space-x-2 cursor-pointer" onClick={toggleProfileDropdown}>
              <img
                    src="https://th.bing.com/th/id/OIP.n0waXJvNzJqj3wmDBfS1ZwHaHa?w=165&h=180&c=7&r=0&o=5&dpr=2&pid=1.7"
                    alt="User Avatar"
                    className="rounded-full w-10 h-10"
                  />
                <span className="text-gray-800 font-medium">{user?.name || "User"}</span>
              </div>
              {isProfileDropdownOpen && (
                <div className="absolute right-0 w-48 mt-2 py-2 bg-white rounded-md shadow-xl z-20">
                  <button
                    onClick={handleLogout}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-500 hover:text-white w-full text-left"
                  >
                    <FaSignOutAlt className="inline-block mr-2" /> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <AddAttendance />
          </div>
        </main>
      </div>
    </div>
  )
}
