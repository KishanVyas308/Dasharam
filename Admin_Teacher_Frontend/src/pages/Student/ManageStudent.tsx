'use client'

import { useEffect, useState } from "react"
import { useRecoilState } from "recoil"
import { studentsAtom } from "../../state/studentsAtom"
import { stdSubAtom } from "../../state/stdSubAtom"
// import { deleteStudent, getAllStudents } from "../../backend/handleStudent"
// import { getAllStdSub } from "../../backend/standardstdHandle"
import { motion } from 'framer-motion'
import { FaTrash, FaGraduationCap, FaChevronDown, FaChevronUp } from 'react-icons/fa'
import axios from "axios"
import { BACKEND_URL } from "../../config"
import { toast } from "react-toastify"
import Loading from "../../components/Loading"

export default function ManageStudent() {
  const [students, setStudents] = useRecoilState<any>(studentsAtom)
  const [standards, setStandards] = useRecoilState(stdSubAtom)
  const [expandedStandard, setExpandedStandard] = useState<string | null>(null)

  const [isLoading, setIsLoading] = useState(false)

  async function fetchStudents() {
    if (students.length === 0) {
      setIsLoading(true)
      const data = await getAllStudents()
      setIsLoading(false)
      setStudents(data)
    }
    if (standards.length === 0) {
      setIsLoading(true)
      const data = await getAllStdSub()
      setIsLoading(false)
      setStandards(data)
    }
  }

  const getAllStdSub = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/subject-standard/all`,{ headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      if (res.status === 200) {
      
        return res.data
      }
    } catch (error: any) {
      
      toast.error("Failed to fetch updated standards list")
      return []
    }
   
  }

  const getAllStudents= async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/student/all`,{ headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      console.log("students", res.data);  
      
      if (res.status === 200) {
     
        return res.data
      }
    } catch (error: any) {
      
      toast.error("Failed to fetch updated standards list")
      return []
    }
   
  }

  useEffect(() => {
    fetchStudents()
  }, [])

  const handleDeleteStudent = async (studentId: string, subjectId: string) => {
    setIsLoading(true)
    try {
      const res = await axios.delete(`${BACKEND_URL}/student/delete`, {
        data: {
          studentId,
          standardId : subjectId
        }
      , headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      toast.success(res.data.message)
    } catch (error: any) {
      
      toast.error("Failed to delete student")
      
    }
    const updatedStudents = await getAllStudents()
    setStudents(updatedStudents)
    const updatedstandards = await getAllStdSub()
    setStandards(updatedstandards)
    setIsLoading(false)
  }

  const toggleExpandStandard = (standardId: string) => {
    setExpandedStandard((prev) => (prev === standardId ? null : standardId))
  }

  return (
    <div className="container mx-auto">
      {isLoading && <Loading />}
      
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8 border border-indigo-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center border-b pb-4">
          <FaGraduationCap className="text-indigo-600 mr-3" />
          Student Management Dashboard
        </h2>
        
        {standards.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No classes available. Add classes to view students.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {standards.map((subject: any) => (
              <div key={subject.id} className="border rounded-lg overflow-hidden">
                <div
                  className={`cursor-pointer flex justify-between items-center p-4 transition-all duration-300 ${
                    expandedStandard === subject.id 
                      ? "bg-indigo-50 border-b" 
                      : "bg-gray-50 hover:bg-gray-100"
                  }`}
                  onClick={() => toggleExpandStandard(subject.id)}
                >
                  <div className="flex items-center">
                    <span className="text-lg font-medium text-gray-800">{subject.standard}</span>
                    <span className="ml-3 bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      {subject.students.length} students
                    </span>
                  </div>
                  <div className="text-indigo-600">
                    {expandedStandard === subject.id ? <FaChevronUp /> : <FaChevronDown />}
                  </div>
                </div>

                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={expandedStandard === subject.id 
                    ? { height: "auto", opacity: 1 } 
                    : { height: 0, opacity: 0 }
                  }
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  {expandedStandard === subject.id && (
                    <div className="p-4">
                      {subject.students.length === 0 ? (
                        <p className="text-center text-gray-500 py-4">No students in this class</p>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm text-left">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                              <tr>
                                <th className="px-4 py-3">Sr No</th>
                                <th className="px-4 py-3">Name</th>
                                <th className="px-4 py-3">GR No</th>
                                <th className="px-4 py-3">Parent Mobile</th>
                                <th className="px-4 py-3">Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {subject.students.map((id: any, index: number) => {
                                const student = students.find((student: any) => student.id === id)
                                return (
                                  <tr key={id} className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-4 py-3">{index + 1}</td>
                                    <td className="px-4 py-3 font-medium">{student?.name || "Unknown"}</td>
                                    <td className="px-4 py-3">{student?.grno || "N/A"}</td>
                                    <td className="px-4 py-3">{student?.parentMobileNo || "N/A"}</td>
                                    <td className="px-4 py-3">
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          if (window.confirm('Are you sure you want to delete this student?')) {
                                            handleDeleteStudent(id, subject.id);
                                          }
                                        }}
                                        className="p-2 text-red-500 bg-red-50 rounded-full hover:bg-red-100 transition-colors"
                                        title="Delete Student"
                                      >
                                        <FaTrash size={14} />
                                      </button>
                                    </td>
                                  </tr>
                                )
                              })}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
