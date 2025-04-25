'use client'

import { useEffect, useState } from 'react'
import { useRecoilState } from 'recoil'
import { studentsAtom } from '../../state/studentsAtom'
import { stdSubAtom } from '../../state/stdSubAtom'
// import { getAllStudents } from '../../backend/handleStudent'
// import { getAllStdSub } from '../../backend/subjectStdHandle'
import AddStudent from './AddStudent'
import ManageStudent from './ManageStudent'
import axios from 'axios'
import { BACKEND_URL } from '../../config'
import { toast } from 'react-toastify'
import Loading from '../../components/Loading'
import { FaChalkboardTeacher } from 'react-icons/fa'

export default function ManageStudentPage() {
  const [students, setStudents] = useRecoilState<any>(studentsAtom)
  const [subjects, setSubjects] = useRecoilState(stdSubAtom)

  const [activeTab, setActiveTab] = useState('add') // 'a state to track profile click

  const [isLoading, setIsLoading] = useState(false)



  const getAllStudents = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/student/all`,
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
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

  const getAllStdSub = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/subject-standard/all`,
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }

      )
      if (res.status === 200) {
        return res.data
      }
    } catch (error: any) {

      toast.error("Failed to fetch updated standards list")
      return []
    }

  }

  async function fetchData() {
    if (students.length === 0) {
      setIsLoading(true)
      const studentsData = await getAllStudents()
      setIsLoading(false)
      setStudents(studentsData)
    }
    if (subjects.length === 0) {
      setIsLoading(true)
      const subjectsData = await getAllStdSub()
      setIsLoading(false)
      setSubjects(subjectsData)
    }
  console.log("students", students);
    
  }
  useEffect(() => {
    fetchData()
    console.log("token", localStorage.getItem('token'));
    
  }, [])


  return (
    <div className="min-h-screen ">
      {isLoading && <Loading />}
      
      <div className="flex flex-col overflow-hidden">
        <header className="bg-white shadow-md rounded-lg px-6 py-5 mb-8 border-l-4 border-indigo-600">
              <div className="flex items-center">
                <FaChalkboardTeacher className="text-3xl text-indigo-600 mr-4" />
                <div>
            <h1 className="text-2xl font-bold text-gray-900">Student Management</h1>
            <p className="text-gray-600 mt-1">Add new students and manage their details</p>
                </div>
              </div>
                  </header>
      <main className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="bg-white shadow-sm rounded-xl overflow-hidden mb-8">
          <div className="border-b border-gray-200">
          <nav className="flex space-x-2 p-4" aria-label="Tabs">
            <button
            onClick={() => setActiveTab('add')}
            className={`px-4 py-2.5 text-sm font-medium rounded-md transition-all duration-200 ${
              activeTab === 'add'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-gray-700 hover:bg-gray-100'
            }`}
            >
            Add Student
            </button>
            <button
            onClick={() => setActiveTab('manage')}
            className={`px-4 py-2.5 text-sm font-medium rounded-md transition-all duration-200 ${
              activeTab === 'manage'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-gray-700 hover:bg-gray-100'
            }`}
            >
            Manage Students
            </button>
          </nav>
          </div>
          
          <div className="p-6">
          {activeTab === 'add' ? <AddStudent /> : <ManageStudent />}
          </div>
        </div>
        </div>
      </main>
      </div>
    </div>
  )
}
