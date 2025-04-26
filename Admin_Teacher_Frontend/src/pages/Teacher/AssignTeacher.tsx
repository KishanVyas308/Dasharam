'use client'

import { useState, useEffect } from 'react'
import { useRecoilValue, useRecoilState } from 'recoil'
import { motion } from 'framer-motion'
import { stdSubAtom } from '../../state/stdSubAtom'
import { teachersAtom } from '../../state/teachersAtom'
import { FaChalkboardTeacher, FaUserTie, FaChevronDown, FaPlus, FaTrash } from 'react-icons/fa'
import axios from 'axios'
import { BACKEND_URL } from '../../config'
import { toast } from 'react-toastify'
import Loading from '../../components/Loading'

const AssignTeacher = () => {
  const [standardId, setStandardId] = useState("")
  const [subjectName, setSubjectName] = useState("")
  const [teacherId, setTeacherId] = useState("")
  const [standards, setStandards] = useRecoilState(stdSubAtom)
  const teachers = useRecoilValue(teachersAtom)
  const [assignedTeachers, setAssignedTeachers] = useState<string[]>([])

  const [isLoading, setIsLoading] = useState(false)

  const [standardIdCT, setStandardIdCT] = useState("")
  const [teacherIdCT, setTeacherIdCT] = useState("")

  // Set assigned teachers when subject is selected
  useEffect(() => {
    if (standardId && subjectName) {
      const standard = standards.find((std: any) => std.id === standardId)
      if (standard) {
        const subject = standard.subjects.find((sub: any) => sub.name === subjectName)
        if (subject && subject.teacherIds) {
          setAssignedTeachers(subject.teacherIds)
        } else {
          setAssignedTeachers([])
        }
      }
    } else {
      setAssignedTeachers([])
    }
  }, [standardId, subjectName, standards])


  const handleAssignTeachers = async () => {
    if (!standardId) {
      toast.error("Please select a standard/class")
      return
    }
    if (!subjectName) {
      toast.error("Please select a subject")
      return
    }
    if (!teacherId) {
      toast.error("Please select teacher")
      return
    }

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
        
        // Update the local state with the new teacher assignments
        const updatedStandards = standards.map((std: any) => {
          if (std.id === standardId) {
            const updatedSubjects = std.subjects.map((sub: any) => {
              if (sub.name === subjectName) {
                return { ...sub, teacherIds: assignedTeachers }
              }
              return sub
            })
            return { ...std, subjects: updatedSubjects }
          }
          return std
        })
        
        setStandards(updatedStandards)
        
        // Reset form fields after successful assignment
        setStandardId("")
        setSubjectName("")
        setTeacherId("")
        setAssignedTeachers([])
      }
      setIsLoading(false)
    } catch (error : any) {
      toast.error(error.response.data.message || "Failed to assign teachers")
      setIsLoading(false)
    }
  }

  const handleAssignClassTeacher = async () => {
    if (!standardIdCT) {
      toast.error("Please select a standard/class")
      return
    }
    if (!teacherIdCT) {
      toast.error("Please select a teacher")
      return
    }
    
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
        
        // Update the local state with the new class teacher assignment
        const updatedStandards = standards.map((std: any) => {
          if (std.id === standardIdCT) {
            return { ...std, classTeacherId: teacherIdCT }
          }
          return std
        })
        
        setStandards(updatedStandards)
        
        // Reset form fields after successful assignment
        setStandardIdCT("")
        setTeacherIdCT("")
      }
      setIsLoading(false)
    } catch (error: any) {
      toast.error(error.response.data.message || "Failed to assign class teacher")
      setIsLoading(false)
    }
  }

  const getTeacherName = (teacherId: string) => {
    const teacher = teachers.find((t: any) => t.id === teacherId)
    return teacher ? teacher.name : "Unknown Teacher"
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
      {isLoading && <Loading />}
      
      <h2 className="text-2xl font-bold text-gray-800 mb-8 border-b pb-4 flex items-center">
        <FaChalkboardTeacher className="mr-3 text-indigo-600" />
        Teacher Assignment
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white p-6 rounded-lg shadow-md border border-indigo-100"
        >
          <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
            <FaChalkboardTeacher className="mr-2 text-indigo-500" />
            Assign Subject Teachers
          </h3>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="standardSelect" className="block text-sm font-semibold text-gray-700">Standard/Class</label>
              <div className="relative">
                <select
                  id="standardSelect"
                  value={standardId}
                  onChange={(e) => {
                    setStandardId(e.target.value);
                    setSubjectName("");
                    setAssignedTeachers([]);
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                >
                  <option value="">Select Standard</option>
                  {standards.map((standard: any) => (
                    <option key={standard.id} value={standard.id}>
                      {standard.standard}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
                  <FaChevronDown size={14} />
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="subjectSelect" className="block text-sm font-semibold text-gray-700">Subject</label>
              <div className="relative">
                <select
                  id="subjectSelect"
                  value={subjectName}
                  onChange={(e) => setSubjectName(e.target.value)}
                  disabled={!standardId}
                  className={`w-full px-4 py-3 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all ${!standardId ? 'bg-gray-100 cursor-not-allowed' : ''}`}
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
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
                  <FaChevronDown size={14} />
                </div>
              </div>
            </div>
            
            {standardId && subjectName && (
              <div className="mt-4 space-y-4">
                <div className="flex items-end space-x-2">
                  <div className="flex-grow space-y-2">
                    <label htmlFor="teacherSelect" className="block text-sm font-semibold text-gray-700">
                      Add Teacher
                    </label>
                    <div className="relative">
                      <select
                        id="teacherSelect"
                        value={teacherId}
                        onChange={(e) => setTeacherId(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                      >
                        <option value="">Select Teacher</option>
                        {teachers.map((teacher: any) => (
                          <option 
                            key={teacher.id} 
                            value={teacher.id}
                            disabled={assignedTeachers.includes(teacher.id)}
                          >
                            {teacher.name} {assignedTeachers.includes(teacher.id) ? '(Already assigned)' : ''}
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
                        <FaChevronDown size={14} />
                      </div>
                    </div>
                  </div>
                  
                  {/* <button
                    onClick={handleAddTeacherToSubject}
                    disabled={!teacherId}
                    className={`px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all ${
                      !teacherId 
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                        : 'bg-indigo-600 text-white hover:bg-indigo-700'
                    }`}
                  >
                    <FaPlus />
                  </button> */}
                </div>
                
                {/* <div className="mt-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Assigned Teachers</h4>
                  
                  {assignedTeachers.length === 0 ? (
                    <p className="text-gray-500 text-sm py-2">No teachers assigned yet</p>
                  ) : (
                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 max-h-40 overflow-y-auto">
                      <ul className="space-y-2">
                        {assignedTeachers.map((teacherId: string) => (
                          <li 
                            key={teacherId} 
                            className="flex justify-between items-center px-3 py-2 bg-white rounded border border-gray-100"
                          >
                            <span className="text-gray-800">{getTeacherName(teacherId)}</span>
                            <button
                              onClick={() => handleRemoveTeacherFromSubject(teacherId)}
                              className="p-1 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                              title="Remove teacher"
                            >
                              <FaTrash size={12} />
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div> */}
              </div>
            )}
            
            <motion.div
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="mt-6"
            >
              <button
                onClick={handleAssignTeachers}
                disabled={isLoading || !standardId || !subjectName || !teacherId }
                className={`w-full px-4 py-3 font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all shadow-md ${
                  isLoading || !standardId || !subjectName  || !teacherId
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}
              >
                <div className="flex items-center justify-center">
                  <FaChalkboardTeacher className="mr-2" />
                  {isLoading ? "Processing..." : "Save Teacher Assignments"}
                </div>
              </button>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-white p-6 rounded-lg shadow-md border border-indigo-100"
        >
          <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
            <FaUserTie className="mr-2 text-indigo-500" />
            Assign Class Teacher
          </h3>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="standardCTSelect" className="block text-sm font-semibold text-gray-700">Standard/Class</label>
              <div className="relative">
                <select
                  id="standardCTSelect"
                  value={standardIdCT}
                  onChange={(e) => setStandardIdCT(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                >
                  <option value="">Select Standard</option>
                  {standards.map((standard: any) => (
                    <option key={standard.id} value={standard.id}>
                      {standard.standard}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
                  <FaChevronDown size={14} />
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="teacherCTSelect" className="block text-sm font-semibold text-gray-700">Class Teacher</label>
              <div className="relative">
                <select
                  id="teacherCTSelect"
                  value={teacherIdCT}
                  onChange={(e) => setTeacherIdCT(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                >
                  <option value="">Select Teacher</option>
                  {teachers.map((teacher: any) => (
                    <option key={teacher.id} value={teacher.id}>
                      {teacher.name}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
                  <FaChevronDown size={14} />
                </div>
              </div>
            </div>
            
            <motion.div
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="mt-6"
            >
              <button
                onClick={handleAssignClassTeacher}
                disabled={isLoading || !standardIdCT || !teacherIdCT}
                className={`w-full px-4 py-3 font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all shadow-md ${
                  isLoading || !standardIdCT || !teacherIdCT
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}
              >
                <div className="flex items-center justify-center">
                  <FaUserTie className="mr-2" />
                  {isLoading ? "Processing..." : "Assign Class Teacher"}
                </div>
              </button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default AssignTeacher