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
import { FaChalkboardTeacher, FaUserTie, FaChevronDown, FaChevronUp, FaBook, FaTrash } from 'react-icons/fa'
import { motion } from 'framer-motion'
import ConformDeletePopUp from '../../components/conformation/ConformDeletePopUp'

export default function ManageTeacherPage() {
  const [teachers, setTeachers] = useRecoilState(teachersAtom)
  const [stdSub, setStdSub] = useRecoilState(stdSubAtom)
  const [isLoading, setIsLoading] = useState(true)
  const [expandedStandard, setExpandedStandard] = useState<string | null>(null)
  const [expandView, setExpandView] = useState<'teachers' | 'standards'>('teachers')
  
  const [isConformDelete, setIsConformDelete] = useState(false)
  const [deleteData, setDeleteData] = useState<any>({})

  const getAllTeachers = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/teacher/all`,
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
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

  const getAllStdSub = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/subject-standard/all`,
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      )
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
      if (teachers.length === 0) {
        const resTeacher = await getAllTeachers()
        setTeachers(resTeacher)
      }
      setIsLoading(false)
    }

    const fetchStandards = async () => {
      if (stdSub.length === 0) {
        const resStandards = await getAllStdSub()
        setStdSub(resStandards)
      }
      setIsLoading(false)
    }

    fetchTeachers()
    fetchStandards()
  }, [])

  const handleDeleteTeacher = async (teacherId: string) => {
    setIsLoading(true)
    try {
      const res = await axios.delete(`${BACKEND_URL}/teacher/delete/${teacherId}`,
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      )
      if (res.status === 200) {
        toast.success(res.data.message)
        setIsConformDelete(false)
      }
    } catch (error: any) {
      setIsLoading(false)
      toast.error(error.response.data.message)
      setIsConformDelete(false)
    }
    const updatedTeachers = await getAllTeachers()
    setTeachers(updatedTeachers)
    setIsLoading(false)
  }

  const toggleExpandStandard = (standardId: string) => {
    setExpandedStandard((prev) => (prev === standardId ? null : standardId))
  }

  const getTeachersForStandard = (standardId: string) => {
    const standard = stdSub.find((s: any) => s.id === standardId)
    if (!standard) return []
    
    // Get subject teachers
    const assignmentsList: Array<{teacherId: string, subjectName: string, role: string}> = []
    
    // Process each subject and its teachers
    standard.subjects.forEach((subject: any) => {
      if (subject.teacherIds && Array.isArray(subject.teacherIds) && subject.teacherIds.length > 0) {
        subject.teacherIds.forEach((teacherId: string) => {
          assignmentsList.push({
            teacherId,
            subjectName: subject.name,
            role: 'Subject Teacher'
          })
        })
      }
    })
    
    // Get class teacher
    if (standard.classTeacherId) {
      assignmentsList.push({
        teacherId: standard.classTeacherId,
        subjectName: '',
        role: 'Class Teacher'
      })
    }
    
    return assignmentsList
  }

  // Get all standards a teacher is assigned to
  const getTeacherAssignments = (teacherId: string) => {
    const assignments: Array<{standardId: string, standardName: string, subjectName: string, role: string}> = []
    
    stdSub.forEach((standard: any) => {
      // Check if teacher is a class teacher
      if (standard.classTeacherId === teacherId) {
        assignments.push({
          standardId: standard.id,
          standardName: standard.standard,
          subjectName: '',
          role: 'Class Teacher'
        })
      }
      
      // Check if teacher teaches any subjects
      standard.subjects.forEach((subject: any) => {
        if (subject.teacherIds && Array.isArray(subject.teacherIds) && 
            subject.teacherIds.includes(teacherId)) {
          assignments.push({
            standardId: standard.id,
            standardName: standard.standard,
            subjectName: subject.name,
            role: 'Subject Teacher'
          })
        }
      })
    })
    
    return assignments
  }

  const getTeacherDetails = (teacherId: string) => {
    return teachers.find((teacher: any) => teacher.id === teacherId) || { name: 'Unknown', mobileNo: 'N/A', grNo: 'N/A' }
  }

  // Count total teachers assigned to a standard (unique count)
  const countUniqueTeachers = (standardId: string) => {
    const assignments = getTeachersForStandard(standardId)
    const uniqueTeacherIds = new Set(assignments.map(a => a.teacherId))
    return uniqueTeacherIds.size
  }

  return (
    <div className="min-h-screen py-6 px-4">
      {isLoading && <Loading />}
      {isConformDelete && (
        <ConformDeletePopUp
          handleClose={() => setIsConformDelete(false)}
          handleConfirm={() => handleDeleteTeacher(deleteData.id)}
          show={isConformDelete}
        />
      )}
      
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="max-w-7xl mx-auto"
      >
        <header className="bg-white shadow-md rounded-lg px-6 py-5 mb-8 border-l-4 border-indigo-600">
          <div className="flex items-center">
            <FaChalkboardTeacher className="text-3xl text-indigo-600 mr-4" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Teacher Management</h1>
              <p className="text-gray-600 mt-1">Add new teachers and assign them to classes</p>
            </div>
          </div>
        </header>

        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <AddTeacher />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <AssignTeacher />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="bg-white rounded-lg shadow-lg p-6 border border-indigo-200"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center border-b pb-4">
              <FaUserTie className="text-indigo-600 mr-3" />
              Teacher Assignment Overview
            </h2>
            
            <div className="mb-6 flex space-x-4">
              <button 
                onClick={() => setExpandView('teachers')}
                className={`px-4 py-2 rounded-lg font-medium flex items-center ${
                  expandView === 'teachers' 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <FaUserTie className="mr-2" />
                View by Teachers
              </button>
              <button 
                onClick={() => setExpandView('standards')}
                className={`px-4 py-2 rounded-lg font-medium flex items-center ${
                  expandView === 'standards' 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <FaBook className="mr-2" />
                View by Classes
              </button>
            </div>
            
            {expandView === 'teachers' ? (
              teachers.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">No teachers available. Add teachers to see them here.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {teachers.map((teacher: any) => {
                    const teacherAssignments = getTeacherAssignments(teacher.id)
                    
                    return (
                      <div key={teacher.id} className="border rounded-lg overflow-hidden shadow-sm">
                        <div
                          className={`cursor-pointer flex justify-between items-center p-4 transition-all duration-300 ${
                            expandedStandard === teacher.id 
                              ? "bg-indigo-50 border-b" 
                              : "bg-gray-50 hover:bg-gray-100"
                          }`}
                          onClick={() => toggleExpandStandard(teacher.id)}
                        >
                          <div className="flex items-center">
                            <FaUserTie className="text-indigo-500 mr-3" />
                            <span className="text-lg font-medium text-gray-800">{teacher.name}</span>
                            <span className="ml-3 text-sm text-gray-500">GR No: {teacher.grNo}</span>
                            <span className="ml-3 bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                              {teacherAssignments.length} assignments
                            </span>
                          </div>
                          <div className="flex items-center">
                            <span className="mr-4 text-sm text-gray-600">{teacher.mobileNo}</span>
                            <div className="text-indigo-600">
                              {expandedStandard === teacher.id ? <FaChevronUp /> : <FaChevronDown />}
                            </div>
                          </div>
                        </div>

                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={expandedStandard === teacher.id 
                            ? { height: "auto", opacity: 1 } 
                            : { height: 0, opacity: 0 }
                          }
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          {expandedStandard === teacher.id && (
                            <div className="p-4 bg-white">
                              <h3 className="font-medium text-gray-800 mb-2">Assigned Classes & Subjects</h3>
                              
                              {teacherAssignments.length > 0 ? (
                                <div className="overflow-x-auto">
                                  <table className="w-full text-sm text-left">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                      <tr>
                                        <th className="px-4 py-3">Class</th>
                                        <th className="px-4 py-3">Role</th>
                                        <th className="px-4 py-3">Subject</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {teacherAssignments.map((assignment, index) => (
                                        <tr key={`${assignment.standardId}-${assignment.subjectName || 'class'}-${index}`} className="bg-white border-b hover:bg-gray-50">
                                          <td className="px-4 py-3 font-medium">{assignment.standardName}</td>
                                          <td className="px-4 py-3">
                                            <span className={`text-xs font-medium px-2 py-1 rounded ${
                                              assignment.role === 'Class Teacher' 
                                                ? 'bg-green-100 text-green-800' 
                                                : 'bg-blue-100 text-blue-800'
                                            }`}>
                                              {assignment.role}
                                            </span>
                                          </td>
                                          <td className="px-4 py-3">{assignment.subjectName || '-'}</td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              ) : (
                                <p className="text-gray-500 text-center py-3 bg-gray-50 rounded">
                                  This teacher is not assigned to any classes or subjects.
                                </p>
                              )}
                              
                              <div className="mt-4 flex justify-end">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setIsConformDelete(true);
                                    setDeleteData({ id: teacher.id });
                                  }}
                                  className="px-3 py-1.5 text-xs text-red-500 bg-red-50 hover:bg-red-100 rounded flex items-center transition-colors"
                                >
                                  <FaTrash size={12} className="mr-1" />
                                  Delete Teacher
                                </button>
                              </div>
                            </div>
                          )}
                        </motion.div>
                      </div>
                    )
                  })}
                </div>
              )
            ) : (
              stdSub.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">No classes available. Add classes to see teachers assignment.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {stdSub.map((standard: any) => {
                    const teacherAssignments = getTeachersForStandard(standard.id)
                    const uniqueTeacherCount = countUniqueTeachers(standard.id)
                    
                    return (
                      <div key={standard.id} className="border rounded-lg overflow-hidden shadow-sm">
                        <div
                          className={`cursor-pointer flex justify-between items-center p-4 transition-all duration-300 ${
                            expandedStandard === standard.id 
                              ? "bg-indigo-50 border-b" 
                              : "bg-gray-50 hover:bg-gray-100"
                          }`}
                          onClick={() => toggleExpandStandard(standard.id)}
                        >
                          <div className="flex items-center">
                            <FaBook className="text-indigo-500 mr-3" />
                            <span className="text-lg font-medium text-gray-800">{standard.standard}</span>
                            <span className="ml-3 bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                              {uniqueTeacherCount} teacher{uniqueTeacherCount !== 1 ? 's' : ''}
                            </span>
                          </div>
                          <div className="text-indigo-600">
                            {expandedStandard === standard.id ? <FaChevronUp /> : <FaChevronDown />}
                          </div>
                        </div>

                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={expandedStandard === standard.id 
                            ? { height: "auto", opacity: 1 } 
                            : { height: 0, opacity: 0 }
                          }
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          {expandedStandard === standard.id && (
                            <div className="p-4">
                              {/* Show subjects with their teacher(s) */}
                              <div className="mb-6">
                                <h3 className="text-md font-semibold text-gray-800 mb-3">Subjects & Assigned Teachers</h3>
                                
                                {standard.subjects.length === 0 ? (
                                  <p className="text-gray-500 text-center py-2">No subjects available for this class</p>
                                ) : (
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {standard.subjects.map((subject: any) => (
                                      <div key={subject.name} className="bg-white border rounded-lg p-3">
                                        <h4 className="font-medium text-gray-800 border-b pb-2 mb-2">{subject.name}</h4>
                                        
                                        {!subject.teacherIds || !Array.isArray(subject.teacherIds) || subject.teacherIds.length === 0 ? (
                                          <p className="text-gray-500 text-sm">No teachers assigned</p>
                                        ) : (
                                          <ul className="space-y-1.5">
                                            {subject.teacherIds.map((teacherId: string) => {
                                              const teacher = getTeacherDetails(teacherId)
                                              return (
                                                <li key={teacherId} className="flex justify-between text-sm">
                                                  <span className="text-gray-800">{teacher.name}</span>
                                                  <span className="text-gray-500">{teacher.mobileNo}</span>
                                                </li>
                                              )
                                            })}
                                          </ul>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                              
                              {/* Class Teacher information */}
                              <div>
                                <h3 className="text-md font-semibold text-gray-800 mb-3">Class Teacher</h3>
                                
                                {!standard.classTeacherId ? (
                                  <p className="text-gray-500 text-center py-2">No class teacher assigned</p>
                                ) : (
                                  <div className="bg-white border rounded-lg p-3">
                                    {(() => {
                                      const teacher = getTeacherDetails(standard.classTeacherId)
                                      return (
                                        <div className="flex justify-between items-center">
                                          <div>
                                            <p className="font-medium text-gray-800">{teacher.name}</p>
                                            <p className="text-gray-500 text-sm">{teacher.mobileNo}</p>
                                          </div>
                                          <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-1 rounded-full">
                                            Class Teacher
                                          </span>
                                        </div>
                                      )
                                    })()}
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </motion.div>
                      </div>
                    )
                  })}
                </div>
              )
            )}
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
