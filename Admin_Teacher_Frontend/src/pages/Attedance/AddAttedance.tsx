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
import Loading from "../../components/Loading"

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

  const [isloading, setIsLoading] = useState<boolean>(false)

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
      setIsLoading(true)
      const formattedDate = new Date(takenDate.getTime() + 5.5 * 60 * 60 * 1000).toISOString().split("T")[0]
      // const attendanceData = await checkAttendance(standardId, formattedDate)
      //? get attedance for the selected standard and date
      try {

        const res = await axios.post(`${BACKEND_URL}/attendance/get-for-standard`, {
          standardId,
          takenDate: formattedDate
        } ,{ headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
        console.log(res.data.data[0].students);

        setSelectedStdStudents(res.data.data[0].students)
        setIsTakenAttendance(true)
        toast.info("Attendance taken! for " + formattedDate);
        setIsLoading(false)
      } catch (error: any) {
        if (error.status == 404) {
          const studentsData = filteredStudents.map((student: any) => ({
            studentId: student.id,
            present: false,
          }))
          setSelectedStdStudents(studentsData)
          setIsTakenAttendance(false)
          toast.warning("Attendance not taken yet!");
          setIsLoading(false)
        }
        else {
          const studentsData = filteredStudents.map((student: any) => ({
            studentId: student.id,
            present: false,
          }))
          setSelectedStdStudents(studentsData)
          setIsTakenAttendance(false)
          toast.error("Error fetching attendance")
          console.log(error)
        }
        setIsLoading(false)
      }
      setIsLoading(false)
    }
    setIsLoading(false)
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
      {
        isloading && <Loading />
      }
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
      <div className="flex justify-between items-center mb-4">

        <h3 className="text-xl font-semibold text-gray-800">Mark Attendance</h3>
        <button className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition duration-200" onClick={() => {
          const studentsData = filteredStudents.map((student: any) => ({
            studentId: student.id,
            present: true,
          }))
          setSelectedStdStudents(studentsData)
        }}
        >Mark all Present</button>
      </div>
      <div className="space-y-4 mb-6">
        {filteredStudents.map((student: any) => {
          const isPresent = selectedStdStudents.find((s: any) => s.studentId === student.id)?.present || false;
          return (
            <div
              key={student.id}
              className={`flex items-center justify-between ${isPresent ? "bg-green-100" : "bg-red-100"} p-3 rounded-md`}
              onClick={() => handleAttendanceChange(student.id, !isPresent)}
            >
              <span className="w-[40%]">{student.name}</span>
              <span className="w-[35%]">{student.grno}</span>
              <label className="w-[25%] inline-flex items-center">
                <input
                  type="checkbox"
                  checked={isPresent}
                  readOnly
                  className="form-checkbox h-5 w-5 text-indigo-600"
                />
                <span className="ml-2">{isPresent ? "Present" : "Absent"}</span>
              </label>
            </div>
          );
        })}
      </div>

      <div className="flex justify-end">
        <button
          className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition duration-200"
          onClick={async () => {
            if (!takenDate) {
              console.error("Taken date is undefined")
              return
            }
            setIsLoading(true)
            const formattedDate = new Date(takenDate.getTime() + 5.5 * 60 * 60 * 1000).toISOString().split("T")[0]
            console.log({
              standardId,
              takenByTeacherId,
              takenDate: formattedDate,
              selectedStdStudents,
            })

            try {
              let res = null;
              if (isTakenAttendance) {
                res = await axios.put(`${BACKEND_URL}/attendance/update-for-standard`, {
                  standardId,
                  teacherId: takenByTeacherId,
                  takenDate: formattedDate,
                  students: selectedStdStudents
                } ,{ headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
              })
              } else {
                res = await axios.post(`${BACKEND_URL}/attendance/add-for-standard`, {
                  standardId,
                  teacherId: takenByTeacherId,
                  takenDate: formattedDate,
                  students: selectedStdStudents
                } ,{ headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
              })
              }
              setIsTakenAttendance(true)
              toast.success(res.data.message)

              setIsLoading(false)
            } catch (error: any) {
              toast.success(error.res.data.message)
              setIsLoading(false)
            }

            setIsLoading(false)
          }}
        >
          {isTakenAttendance ? "Update Attendance" : "Submit Attendance"}
        </button>
      </div>
    </motion.div>

  )
}
