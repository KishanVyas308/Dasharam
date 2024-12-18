'use client'

import React, { useEffect, useState } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import { motion } from 'framer-motion'
import { studentsAtom } from '../../state/studentsAtom'
import { stdSubAtom } from '../../state/stdSubAtom'
import { userAtom } from '../../state/userAtom'
import { getAllStudents } from '../../backend/handleStudent'
import { getAllStdSub } from '../../backend/subjectStdHandle'
import AddStudent from './AddStudent'
import ManageStudent from './ManageStudent'
import { FaBars, FaUserCircle, FaSignOutAlt, FaChalkboardTeacher, FaUserGraduate, FaBook, FaClipboardList, FaUserCheck, FaTimes } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import Cookies from 'js-cookie'
import Sidebar from '../Dashbord/Sidebar'

const menuItems = [
  { title: "Manage Subjects", icon: FaBook, link: "/subject-std" },
  { title: "Manage Teachers", icon: FaChalkboardTeacher, link: "/manage-teacher" },
  { title: "Manage Students", icon: FaUserGraduate, link: "/manage-student" },
  { title: "Manage Tests", icon: FaClipboardList, link: "/manage-test" },
  { title: "Attendance", icon: FaUserCheck, link: "/add-attedance" },
]

export default function ManageStudentPage() {
  const [students, setStudents] = useRecoilState<any>(studentsAtom)
  const [subjects, setSubjects] = useRecoilState(stdSubAtom)
  const user = useRecoilValue(userAtom)

  const [isSidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768)
  const [activeTab, setActiveTab] = useState('add') // 'add' or 'manage'
  const [showLogout, setShowLogout] = useState(false) // state to track profile click

  useEffect(() => {
    const handleResize = () => {
      setSidebarOpen(window.innerWidth > 768)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    async function fetchData() {
      if (students.length === 0) {
        const studentsData = await getAllStudents()
        setStudents(studentsData)
      }
      if (subjects.length === 0) {
        const subjectsData = await getAllStdSub()
        setSubjects(subjectsData)
      }
    }
    fetchData()
  }, [students, subjects, setStudents, setSubjects])

  const handleLogout = () => {
    Cookies.remove("user")
    console.log("User logged out")
    setShowLogout(false) // Hide logout button after logging out
  }

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen)
  }

  const handleProfileClick = () => {
    setShowLogout(!showLogout) // Toggle logout button visibility
  }

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar */}
      <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar}/>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">    {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <div className="flex items-center">
              <button onClick={toggleSidebar} className="md:hidden mr-4 text-gray-600 hover:text-gray-900">
                <FaBars size={24} />
              </button>
              <h2 className="text-2xl font-semibold text-gray-800">Manage Students</h2>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="flex items-center space-x-2 cursor-pointer" onClick={handleProfileClick}>
                <img
                    src="https://th.bing.com/th/id/OIP.n0waXJvNzJqj3wmDBfS1ZwHaHa?w=165&h=180&c=7&r=0&o=5&dpr=2&pid=1.7"
                    alt="User Avatar"
                    className="rounded-full w-10 h-10"
                  />
                  <span className="text-gray-800 font-medium">{user?.name || "User"}</span>
                </div>
                {showLogout && (
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
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-6">
              <div className="flex space-x-4">
                <button
                  onClick={() => setActiveTab('add')}
                  className={`px-4 py-2 rounded-md ${
                    activeTab === 'add'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white text-indigo-600 hover:bg-indigo-50'
                  }`}
                >
                  Add Student
                </button>
                <button
                  onClick={() => setActiveTab('manage')}
                  className={`px-4 py-2 rounded-md ${
                    activeTab === 'manage'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white text-indigo-600 hover:bg-indigo-50'
                  }`}
                >
                  Manage Students
                </button>
              </div>
            </div>
            {activeTab === 'add' ? <AddStudent /> : <ManageStudent />}
          </div>
        </main>
      </div>
    </div>
  )
}
