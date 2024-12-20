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
import { addAttendance, checkAttendance } from "../../backend/handleAttandance"
import { motion } from 'framer-motion'

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
      setStandardId(stdid.id)
      setTakenByTeacherId(user.id)
    }
  }, [])

  const fetchAttendance = async () => {
    if (standardId && takenDate) {
      const formattedDate = new Date(takenDate.getTime() + 5.5 * 60 * 60 * 1000).toISOString().split("T")[0]
      const attendanceData = await checkAttendance(standardId, formattedDate)
      if (attendanceData?.data) {
        setSelectedStdStudents(attendanceData.data[0].students)
        setIsTakenAttendance(true)
      }
      else {
        const studentsData = filteredStudents.map((student: any) => ({
          studentId: student.id,
          present: false,
        }))
        setSelectedStdStudents(studentsData)
        setIsTakenAttendance(false)
      }
    }
  }

  useEffect(() => {
    fetchAttendance()
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

  return (
    <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white p-6 rounded-lg shadow-md w-full max-w-7xl mx-auto"
  >
    <h2 className="text-2xl font-semibold text-gray-800 mb-6">Take Attendance</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      {/* Select Standard */}
      <div>
        <label htmlFor="standard" className="block text-sm font-medium text-gray-700 mb-1">Select Standard</label>
        <select
          id="standard"
          disabled={user?.role === UserRole.Teacher}
          value={standardId || ""}
          onChange={handleStdChange}
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">Select Standard</option>
          {stdSub.map((std: any) => (
            <option key={std.id} value={std.id}>{std.standard}</option>
          ))}
        </select>
      </div>
  
      {/* Select Teacher */}
      <div>
        <label htmlFor="teacher" className="block text-sm font-medium text-gray-700 mb-1">Select Teacher</label>
        <select
          id="teacher"
          disabled={user?.role === UserRole.Teacher}
          value={takenByTeacherId || ""}
          onChange={(e) => setTakenByTeacherId(e.target.value)}
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">Select Teacher</option>
          {teachers.map((teacher: any) => (
            <option key={teacher.id} value={teacher.id}>{teacher.name}</option>
          ))}
        </select>
      </div>
  
      {/* Select Date */}
      <div>
        <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">Select Date</label>
        <DatePicker
          id="date"
          selected={takenDate}
          onChange={(date: Date | null) => setTakenDate(new Date(date?.getFullYear() ?? 0, date?.getMonth() ?? 0, date?.getDate() ?? 0))}
          dateFormat="dd/MM/yyyy"
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
    </div>
  
    <h3 className="text-xl font-semibold text-gray-800 mb-4">Mark Attendance</h3>
    <div className="space-y-4 mb-6">
      {filteredStudents.map((student: any) => (
        <div key={student.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
          <span>{student.name}</span>
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              checked={selectedStdStudents.find((s: any) => s.studentId === student.id)?.present || false}
              onChange={(e) => handleAttendanceChange(student.id, e.target.checked)}
              className="form-checkbox h-5 w-5 text-indigo-600"
            />
            <span className="ml-2">Present</span>
          </label>
        </div>
      ))}
    </div>
  
    <div className="flex justify-end">
      <button
        className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition duration-200"
        onClick={async () => {
          if (!takenDate) {
            console.error("Taken date is undefined")
            return
          }
          const formattedDate = new Date(takenDate.getTime() + 5.5 * 60 * 60 * 1000).toISOString().split("T")[0]
          console.log({
            standardId,
            takenByTeacherId,
            takenDate: formattedDate,
            selectedStdStudents,
          })
          const res = await addAttendance(
            standardId,
            takenByTeacherId,
            formattedDate,
            selectedStdStudents
          )
        }}
      >
        {isTakenAttendance ? "Update Attendance" : "Submit Attendance"}
      </button>
    </div>
  </motion.div>
  
  )
}
