'use client'

import React, { useState, useMemo, useEffect } from "react"
import { useRecoilState, useRecoilValue } from "recoil"
import { teastsAtom } from "../../state/testsAtom"
import { teachersAtom } from "../../state/teachersAtom"
import { studentsAtom } from "../../state/studentsAtom"
import { stdSubAtom } from "../../state/stdSubAtom"
import { userAtom } from "../../state/userAtom"
import { UserRole } from "../../types/type"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { addTest } from "../../backend/handleTest"
import { motion } from 'framer-motion'

export default function AddTest() {
  const [tests, setTests] = useRecoilState(teastsAtom)
  const teachers = useRecoilValue(teachersAtom)
  const students = useRecoilValue(studentsAtom)
  const stdSub = useRecoilValue(stdSubAtom)
  const user = useRecoilValue(userAtom)

  const [name, setName] = useState<string>("")
  const [standardId, setStandardId] = useState<string>("")
  const [subject, setSubject] = useState<string>("")
  const [takenByTeacherId, setTakenByTeacherId] = useState<string>("")
  const [totalMarks, setTotalMarks] = useState<string>("0")
  const [takenDate, setTakenDate] = useState<Date | null>(null)
  const [selectedStdStudents, setSelectedStdStudents] = useState<any>([])

  useEffect(() => {
    if (!takenDate) {
      const today = new Date()
      setTakenDate(new Date(today.getFullYear(), today.getMonth(), today.getDate()))
    }
    if(user?.role === UserRole.Teacher && teachers.length > 0 && stdSub.length > 0) {
      const stdid = stdSub.find((s: any) => s.classTeacherId === user.id)
      setStandardId(stdid.id)
      setTakenByTeacherId(user.id)
      const selectedStudents = students
        .filter((student: any) => student.standardId === stdid.id)
        .map((student: any) => ({
          studentId: student.id,
          marks: "0",
        }))
      setSelectedStdStudents(selectedStudents)
    }
  }, [])

  const filteredStudents = useMemo(() => {
    return students.filter((student: any) => student.standardId === standardId)
  }, [students, standardId])

  const handleStdChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedStdId = e.target.value || ""
    setStandardId(selectedStdId)

    const selectedStudents = students
      .filter((student: any) => student.standardId === selectedStdId)
      .map((student: any) => ({
        studentId: student.id,
        marks: "0",
      }))

    setSelectedStdStudents(selectedStudents)
  }

  const handleMarksChange = (studentId: string, newMarks: string) => {
    const updatedStudents = selectedStdStudents.map((student: any) =>
      student.studentId === studentId
        ? { ...student, marks: newMarks || "0" }
        : student
    )
    setSelectedStdStudents(updatedStudents)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-6 rounded-lg shadow-md"
    >
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Add Test</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label htmlFor="testName" className="block text-sm font-medium text-gray-700 mb-1">Test Name</label>
          <input
            id="testName"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label htmlFor="standard" className="block text-sm font-medium text-gray-700 mb-1">Select Standard</label>
          <select
            id="standard"
            value={standardId}
            onChange={handleStdChange}
            disabled={user?.role === UserRole.Teacher}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Select Standard</option>
            {stdSub.map((std: any) => (
              <option key={std.id} value={std.id}>{std.standard}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Select Subject</label>
          <select
            id="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Select Subject</option>
            {stdSub
              .find((std: any) => std.id === standardId)
              ?.subjects.map((sub: any) => (
                <option key={sub.name} value={sub.name}>{sub.name}</option>
              ))}
          </select>
        </div>
        <div>
          <label htmlFor="teacher" className="block text-sm font-medium text-gray-700 mb-1">Select Teacher</label>
          <select
            id="teacher"
            value={takenByTeacherId}
            onChange={(e) => setTakenByTeacherId(e.target.value)}
            disabled={user?.role === UserRole.Teacher}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Select Teacher</option>
            {teachers.map((teacher: any) => (
              <option key={teacher.id} value={teacher.id}>{teacher.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="totalMarks" className="block text-sm font-medium text-gray-700 mb-1">Total Marks</label>
          <input
            id="totalMarks"
            type="number"
            value={totalMarks}
            onChange={(e) => setTotalMarks(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label htmlFor="takenDate" className="block text-sm font-medium text-gray-700 mb-1">Test Date</label>
          <DatePicker
            id="takenDate"
            selected={takenDate}
            onChange={(date: Date | null) => setTakenDate(date)}
            dateFormat="dd/MM/yyyy"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      <h3 className="text-xl font-semibold text-gray-800 mb-4">Assign Marks to Students</h3>
      <div className="space-y-4 mb-6">
        {filteredStudents.map((student: any) => (
          <div key={student.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
            <span>{student.name}</span>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                value={selectedStdStudents.find((s: any) => s.studentId === student.id)?.marks || "0"}
                onChange={(e) => handleMarksChange(student.id, e.target.value)}
                className="w-20 px-2 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <span>/ {totalMarks}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <button
          className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition duration-200"
          onClick={async () => {
            console.log({
              name,
              standardId,
              subject,
              takenByTeacherId,
              totalMarks,
              takenDate,
              selectedStdStudents,
            })
            const res = await addTest(
              name,
              standardId,
              subject,
              takenByTeacherId,
              totalMarks,
              takenDate?.toISOString() || "",
              selectedStdStudents
            )
            if (res) {
              setTests([...tests, res])
            }
          }}
        >
          Add Test
        </button>
      </div>
    </motion.div>
  )
}