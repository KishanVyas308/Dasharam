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

export default function ManageStudentPage() {
  const [students, setStudents] = useRecoilState<any>(studentsAtom)
  const [subjects, setSubjects] = useRecoilState(stdSubAtom)

  const [activeTab, setActiveTab] = useState('add') // 'a state to track profile click

  const [isLoading, setIsLoading] = useState(false)



  const getAllStudents = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/student/all`)
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
      const res = await axios.get(`${BACKEND_URL}/subject-standard/all`)
      if (res.status === 200) {

        return res.data
      }
    } catch (error: any) {

      toast.error("Failed to fetch updated standards list")
      return []
    }

  }

  useEffect(() => {
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
    }
    fetchData()
  }, [students, subjects, setStudents, setSubjects])


  return (
    <div>
      {isLoading && <Loading />}
     
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">    


        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-6">
              <div className="flex space-x-4">
                <button
                  onClick={() => setActiveTab('add')}
                  className={`px-4 py-2 rounded-md ${activeTab === 'add'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white text-indigo-600 hover:bg-indigo-50'
                    }`}
                >
                  Add Student
                </button>
                <button
                  onClick={() => setActiveTab('manage')}
                  className={`px-4 py-2 rounded-md ${activeTab === 'manage'
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
