'use client'

import  { useState } from 'react'
import { useRecoilValue } from 'recoil'
import { motion } from 'framer-motion'
import { stdSubAtom } from '../../state/stdSubAtom'
import { teachersAtom } from '../../state/teachersAtom'
// import { addTeacherIdsFromStdSub, addClassTeacherToStandard } from '../../backend/subjectStdHandle'
import { FaChalkboardTeacher, FaUserTie } from 'react-icons/fa'
import axios from 'axios'
import { BACKEND_URL } from '../../config'
import { toast } from 'react-toastify'
import Loading from '../../components/Loading'

const AssignTeacher = () => {
  const [standardId, setStandardId] = useState("")
  const [subjectName, setSubjectName] = useState("")
  const [teacherId, setTeacherId] = useState("")
  const standards = useRecoilValue(stdSubAtom)
  const teachers = useRecoilValue(teachersAtom)

  const [isLoading, setIsLoading] = useState(false)

  const [standardIdCT, setStandardIdCT] = useState("")
  const [teacherIdCT, setTeacherIdCT] = useState("")

  const handleAssignTeacher = async () => {
    if (standardId && subjectName && teacherId) {
      // await addTeacherIdsFromStdSub(standardId, subjectName, teacherId)
      setIsLoading(true)
      try {  
        const res = await axios.post(`${BACKEND_URL}/subject-standard/assign-subject-teacher`, {
          standardId,
          subjectName,
          teacherId
        },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })

        if (res.status === 200) {
          toast.success(res.data.message)
        }
        setIsLoading(false)

      } catch (error : any) {
        toast.error(error.response.data.message)
        setIsLoading(false)
      }
    }
  }

  const handleAssignClassTeacher = async () => {
    if (standardIdCT && teacherIdCT) {
      setIsLoading(true)
      try {
        const res = await axios.post(`${BACKEND_URL}/subject-standard/assign-class-teacher`, {
          standardId: standardIdCT,
          teacherId: teacherIdCT
        },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })

        if (res.status === 200) {
          toast.success(res.data.message)
        }
        setIsLoading(false)

      } catch (error: any) {
        toast.error(error.response.data.message)
        setIsLoading(false)
      }
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {
        isLoading && <Loading />
      }
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-6 rounded-lg shadow-md"
      >
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Assign Teacher to Subject</h2>
        <div className="space-y-4">
          <select
            value={standardId}
            onChange={(e) => setStandardId(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Select Standard</option>
            {standards.map((standard: any) => (
              <option key={standard.id} value={standard.id}>
                {standard.standard}
              </option>
            ))}
          </select>
          <select
            value={subjectName}
            onChange={(e) => setSubjectName(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Select Subject</option>
            {standards
              .find((std: any) => std.id === standardId)
              ?.subjects.map((subject: any) => (
                <option key={subject.name} value={subject.name}>
                  {subject.name}
                </option>
              ))}
          </select>
          <select
            value={teacherId}
            onChange={(e) => setTeacherId(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Select Teacher</option>
            {teachers.map((teacher: any) => (
              <option key={teacher.id} value={teacher.id}>
                {teacher.name}
              </option>
            ))}
          </select>
          <button
            onClick={handleAssignTeacher}
            className="w-full px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition duration-200 flex items-center justify-center"
          >
            <FaChalkboardTeacher className="mr-2" />
            Assign Teacher
          </button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-6 rounded-lg shadow-md"
      >
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Assign Class Teacher</h2>
        <div className="space-y-4">
          <select
            value={standardIdCT}
            onChange={(e) => setStandardIdCT(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Select Standard</option>
            {standards.map((standard: any) => (
              <option key={standard.id} value={standard.id}>
                {standard.standard}
              </option>
            ))}
          </select>
          <select
            value={teacherIdCT}
            onChange={(e) => setTeacherIdCT(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Select Teacher</option>
            {teachers.map((teacher: any) => (
              <option key={teacher.id} value={teacher.id}>
                {teacher.name}
              </option>
            ))}
          </select>
          <button
            onClick={handleAssignClassTeacher}
            className="w-full px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition duration-200 flex items-center justify-center"
          >
            <FaUserTie className="mr-2" />
            Assign Class Teacher
          </button>
        </div>
      </motion.div>
    </div>
  )
}

export default AssignTeacher