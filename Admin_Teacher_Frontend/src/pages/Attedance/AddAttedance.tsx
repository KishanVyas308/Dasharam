'use client'

import React, { useState, useMemo, useEffect } from "react"
import { useRecoilValue } from "recoil"
import { teachersAtom } from "../../state/teachersAtom"
import { studentsAtom } from "../../state/studentsAtom"
import { stdSubAtom } from "../../state/stdSubAtom"
import { userAtom } from "../../state/userAtom"
import { UserRole } from "../../types/type"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { motion } from 'framer-motion'
import axios from "axios"
import { BACKEND_URL } from "../../config"
import { toast } from "react-toastify"

export default function AddAttendance() {
  const teachers = useRecoilValue(teachersAtom)
  const students = useRecoilValue(studentsAtom)
  const stdSub = useRecoilValue(stdSubAtom)
  const user = useRecoilValue(userAtom)

  const [standardId, setStandardId] = useState<string>("")
  const [takenByTeacherId, setTakenByTeacherId] = useState<string>("")
  const [takenDate, setTakenDate] = useState<Date | null | undefined>(null)
  const [selectedStdStudents, setSelectedStdStudents] = useState<any>([])
  const [isTakenAttendance, setIsTakenAttendance] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  const filteredStudents = useMemo(() => {
    return students.filter((student: any) => student.standardId === standardId)
  }, [students, standardId])

  useEffect(() => {
    if (!takenDate) {
      const today = new Date()
      setTakenDate(new Date(today.getFullYear(), today.getMonth(), today.getDate()))
    }
    if (teachers.length > 0 && user?.role === UserRole.Teacher && stdSub.length > 0) {
      const stdid = stdSub.find((s: any) => s.classTeacherId === user.id)
      if (stdid) {
        setStandardId(stdid.id)
        setTakenByTeacherId(user.id)
      }
    }
  }, [teachers, user, stdSub])

  const fetchAttendance = async () => {
    if (standardId && takenDate) {
      setIsLoading(true)
      const formattedDate = new Date(takenDate.getTime() + 5.5 * 60 * 60 * 1000).toISOString().split("T")[0]
      
      try {
        const res = await axios.post(`${BACKEND_URL}/attendance/get-for-standard`, {
          standardId,
          takenDate: formattedDate
        }, { 
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })

        setSelectedStdStudents(res.data.data[0].students)
        setIsTakenAttendance(true)
        toast.info("Attendance record found for " + formattedDate, {
          position: "top-right",
          autoClose: 3000,
        })
      } catch (error: any) {
        const studentsData = filteredStudents.map((student: any) => ({
          studentId: student.id,
          present: false,
        }))
        
        setSelectedStdStudents(studentsData)
        setIsTakenAttendance(false)
        
        if (error.status === 404) {
          toast.info("No attendance record found. Create a new one.", {
            position: "top-right",
            autoClose: 3000,
          })
        } else {
          toast.error("Error fetching attendance", {
            position: "top-right",
            autoClose: 3000,
          })
          console.error(error)
        }
      } finally {
        setIsLoading(false)
      }
    }
  }

  useEffect(() => {
    if (standardId && takenDate) {
      fetchAttendance()
    }
  }, [standardId, takenDate, students])

  const handleStdChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStandardId(e.target.value || "")
  }

  const handleAttendanceChange = (studentId: string, isPresent: boolean) => {
    const updatedStudents = selectedStdStudents.map((student: any) =>
      student.studentId === studentId
        ? { ...student, present: isPresent }
        : student
    )
    setSelectedStdStudents(updatedStudents)
  }

  const markAllPresent = () => {
    const studentsData = filteredStudents.map((student: any) => ({
      studentId: student.id,
      present: true,
    }))
    setSelectedStdStudents(studentsData)
  }

  const markAllAbsent = () => {
    const studentsData = filteredStudents.map((student: any) => ({
      studentId: student.id,
      present: false,
    }))
    setSelectedStdStudents(studentsData)
  }

  const handleSubmit = async () => {
    if (!standardId) {
      toast.error("Please select a class", {
        position: "top-right",
        autoClose: 3000,
      })
      return
    }
    
    if (!takenByTeacherId) {
      toast.error("Please select a teacher", {
        position: "top-right",
        autoClose: 3000,
      })
      return
    }
    
    if (!takenDate) {
      toast.error("Please select a date", {
        position: "top-right",
        autoClose: 3000,
      })
      return
    }
    
    setIsSubmitting(true)
    const formattedDate = new Date(takenDate.getTime() + 5.5 * 60 * 60 * 1000).toISOString().split("T")[0]
    
    try {
      let res = null;
      if (isTakenAttendance) {
        res = await axios.put(`${BACKEND_URL}/attendance/update-for-standard`, {
          standardId,
          teacherId: takenByTeacherId,
          takenDate: formattedDate,
          students: selectedStdStudents
        }, { 
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
        toast.success("Attendance updated successfully", {
          position: "top-right",
          autoClose: 3000,
        })
      } else {
        res = await axios.post(`${BACKEND_URL}/attendance/add-for-standard`, {
          standardId,
          teacherId: takenByTeacherId,
          takenDate: formattedDate,
          students: selectedStdStudents
        }, { 
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
        toast.success("Attendance submitted successfully", {
          position: "top-right",
          autoClose: 3000,
        })
      }
      setIsTakenAttendance(true)
    } catch (error: any) {
      toast.error(error.response?.data?.message || "An error occurred", {
        position: "top-right",
        autoClose: 3000,
      })
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Take Attendance</h1>
        
        <div className="bg-gray-50 rounded-lg shadow-sm p-6 mb-6 border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Select Standard */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Select Class</label>
              <select
                disabled={user?.role === UserRole.Teacher}
                value={standardId || ""}
                onChange={handleStdChange}
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
              >
                <option value="">Select Class</option>
                {stdSub.map((std: any) => (
                  <option key={std.id} value={std.id}>{std.standard}</option>
                ))}
              </select>
            </div>

            {/* Select Teacher */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Select Teacher</label>
              <select
                disabled={user?.role === UserRole.Teacher}
                value={takenByTeacherId || ""}
                onChange={(e) => setTakenByTeacherId(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
              >
                <option value="">Select Teacher</option>
                {teachers.map((teacher: any) => (
                  <option key={teacher.id} value={teacher.id}>{teacher.name}</option>
                ))}
              </select>
            </div>

            {/* Select Date */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Select Date</label>
              <DatePicker
                selected={takenDate}
                onChange={(date: Date | null) => date && setTakenDate(new Date(date.getFullYear(), date.getMonth(), date.getDate()))}
                dateFormat="dd/MM/yyyy"
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
              />
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            <span className="ml-3 text-gray-600">Loading attendance data...</span>
          </div>
        ) : (
          <>
            {filteredStudents.length > 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-800">Mark Attendance</h2>
                  <div className="flex space-x-3">
                    <button 
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all duration-200 shadow-sm hover:shadow"
                      onClick={markAllPresent}
                    >
                      Mark All Present
                    </button>
                    <button 
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all duration-200 shadow-sm hover:shadow"
                      onClick={markAllAbsent}
                    >
                      Mark All Absent
                    </button>
                  </div>
                </div>

                <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm mb-6">
                  <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 grid grid-cols-12 font-medium text-sm text-gray-700">
                    <div className="col-span-1">#</div>
                    <div className="col-span-2">GR No.</div>
                    <div className="col-span-5">Student Name</div>
                    <div className="col-span-4 text-center">Attendance</div>
                  </div>
                  
                  <div className="divide-y divide-gray-200">
                    {filteredStudents.map((student: any, index: number) => {
                      const studentAttendance = selectedStdStudents.find((s: any) => s.studentId === student.id);
                      const isPresent = studentAttendance?.present || false;
                      
                      return (
                        <div 
                          key={student.id}
                          className={`grid grid-cols-12 px-4 py-3 items-center cursor-pointer transition-colors duration-150 hover:bg-gray-50`}
                          onClick={() => handleAttendanceChange(student.id, !isPresent)}
                        >
                          <div className="col-span-1 text-gray-500">{index + 1}</div>
                          <div className="col-span-2 text-gray-600 font-medium">{student.grno}</div>
                          <div className="col-span-5 text-gray-800 font-medium">{student.name}</div>
                          <div className="col-span-4 flex justify-center items-center space-x-4">
                            <div 
                              className={`relative inline-flex items-center justify-center w-16 h-8 rounded-full cursor-pointer ${
                                isPresent ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                              } transition-all duration-200`}
                            >
                              <input
                                type="checkbox"
                                checked={isPresent}
                                onChange={() => handleAttendanceChange(student.id, !isPresent)}
                                className="sr-only"
                              />
                              <span className="font-medium">
                                {isPresent ? 'Present' : 'Absent'}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                      isSubmitting 
                      ? 'bg-gray-400 cursor-not-allowed text-white' 
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm hover:shadow'
                    }`}
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                        </svg>
                        Saving...
                      </span>
                    ) : (
                      isTakenAttendance ? "Update Attendance" : "Submit Attendance"
                    )}
                  </button>
                </div>
              </motion.div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No students found</h3>
                <p className="mt-1 text-sm text-gray-500">Select a class to view and mark student attendance.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
