'use client'

import { useEffect, useState } from 'react'
import { useRecoilState } from 'recoil'
import { teachersAtom } from '../../state/teachersAtom'
import { stdSubAtom } from '../../state/stdSubAtom'
import AddTeacher from './AddTeacher'
import AssignTeacher from './AssignTeacher'
import axios from 'axios'
import { BACKEND_URL } from '../../config'
import { toast } from 'react-toastify'
import Loading from '../../components/Loading'

export default function ManageTeacherPage() {
  const [teachers, setTeachers] = useRecoilState(teachersAtom)
  const [stdSub, setStdSub] = useRecoilState(stdSubAtom)

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
