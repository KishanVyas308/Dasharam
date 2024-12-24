'use client'

import { useEffect, useState } from 'react'
import { useRecoilState } from 'recoil'
import { teachersAtom } from '../../state/teachersAtom'
import { stdSubAtom } from '../../state/stdSubAtom'
import { studentsAtom } from '../../state/studentsAtom'
import AddAttendance from './AddAttedance'
import axios from 'axios'
import { BACKEND_URL } from '../../config'
import { toast } from 'react-toastify'
import Loading from '../../components/Loading'


export default function AttendancePage() {
  const [teachers, setTeachers] = useRecoilState(teachersAtom)
  const [stdSubjects, setStdSubjects] = useRecoilState(stdSubAtom)
  const [students, setStudents] = useRecoilState(studentsAtom)




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

  const getAllStudents= async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/student/all`)
      console.log("students", res.data);  
      
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
    if (teachers.length === 0) {
      getAllTeachers().then((data) => setTeachers(data))
    }
    else {
      setIsLoading(false)
    }
    if (stdSubjects.length === 0) {
      getAllStdSub().then((data) => setStdSubjects(data))
    }
    else {
      setIsLoading(false)
    }
    if (students.length === 0) {
      getAllStudents().then((data) => {
        setStudents(data)
        console.log(data);
        
      })
    } else {
      setIsLoading(false)
    }
  }, [])

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {
        isLoading && <Loading />
      }
    

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden"> 


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
