'use client'

import { useEffect, useState } from 'react'
import { useRecoilState } from 'recoil'
import { teachersAtom } from '../../state/teachersAtom'
import { stdSubAtom } from '../../state/stdSubAtom'
import { userAtom } from '../../state/userAtom'
// import { getAllTeachers } from '../../backend/handleTeacher'
// import { getAllStdSub } from '../../backend/subjectStdHandle'
import AddTeacher from './AddTeacher'
import AssignTeacher from './AssignTeacher'
import { FaBars, FaSignOutAlt } from 'react-icons/fa'
import Cookies from 'js-cookie'
import Sidebar from '../Dashbord/Sidebar'
import axios from 'axios'
import { BACKEND_URL } from '../../config'
import { toast } from 'react-toastify'
import Loading from '../../components/Loading'

export default function ManageTeacherPage() {
  const [teachers, setTeachers] = useRecoilState(teachersAtom)
  const [stdSub, setStdSub] = useRecoilState(stdSubAtom)
  const [user, setUser] = useRecoilState(userAtom)

  const [isSidebarOpen, setSidebarOpen] = useState(false)
  const [isProfileDropdownOpen, setProfileDropdownOpen] = useState(false) // State to toggle dropdown

  const [isLoading, setIsLoading] = useState(true)



  const getAllTeachers = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/teacher/all`)
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

  const getAllStdSub = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/subject-standard/all`)
      if (res.status === 200) {
        setIsLoading(false)
        return res.data
      }
    } catch (error: any) {
      setIsLoading(false)
      toast.error("Failed to fetch updated standards list")
      return []
    }
    setIsLoading(false)
  }

  useEffect(() => {
    const fetchTeachers = async () => {
        if (teachers.length == 0) {
        const resTeacher = await getAllTeachers()
        setTeachers(resTeacher)
      }
      setIsLoading(false)
    }

    const fetchStandards = async () => {
      if(stdSub.length == 0) {
      const resStandards = await getAllStdSub()
      setStdSub(resStandards)
      }
      setIsLoading(false)
    }

    fetchTeachers()
    fetchStandards()
  }, [])

  const handleLogout = () => {
    Cookies.remove("user")
    setUser(null)
  }

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen)
  }

  const toggleProfileDropdown = () => {
    setProfileDropdownOpen(!isProfileDropdownOpen)
  }

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {
        isLoading && <Loading />
      }
      {/* Sidebar */}
      <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <div className="flex items-center">
              <button onClick={toggleSidebar} className="md:hidden mr-4 text-gray-600 hover:text-gray-900">
                <FaBars size={24} />
              </button>
              <h2 className="text-2xl font-semibold text-gray-800">Manage Teachers</h2>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div onClick={toggleProfileDropdown} className="flex items-center space-x-2 cursor-pointer">
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
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="space-y-8">
              <AddTeacher />
              <AssignTeacher />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
