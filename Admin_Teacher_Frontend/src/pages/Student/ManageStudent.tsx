'use client'

import React, { useEffect, useState } from "react"
import { useRecoilState } from "recoil"
import { studentsAtom } from "../../state/studentsAtom"
import { stdSubAtom } from "../../state/stdSubAtom"
import { deleteStudent, getAllStudents } from "../../backend/handleStudent"
import { getAllStdSub } from "../../backend/subjectStdHandle"
import { motion } from 'framer-motion'
import { FaTrash, FaGraduationCap, FaChevronDown, FaChevronUp } from 'react-icons/fa'

export default function ManageStudent() {
  const [students, setStudents] = useRecoilState<any>(studentsAtom)
  const [subjects, setSubjects] = useRecoilState(stdSubAtom)
  const [expandedStandard, setExpandedStandard] = useState<string | null>(null)

  async function fetchStudents() {
    if (students.length === 0) {
      const data = await getAllStudents()
      setStudents(data)
    }
    if (subjects.length === 0) {
      const data = await getAllStdSub()
      setSubjects(data)
    }
  }

  useEffect(() => {
    fetchStudents()
  }, [])

  const handleDeleteStudent = async (studentId: string, subjectId: string) => {
    await deleteStudent(studentId, subjectId)
    const updatedStudents = await getAllStudents()
    setStudents(updatedStudents)
    const updatedSubjects = await getAllStdSub()
    setSubjects(updatedSubjects)
  }

  const toggleExpandStandard = (standardId: string) => {
    setExpandedStandard((prev) => (prev === standardId ? null : standardId))
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-6 shadow-md"
    >
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
        <FaGraduationCap className="mr-2" />
        Manage Students
      </h2>
      {subjects.map((subject: any) => (
        <div key={subject.id} className="mb-6">
          {/* Header with Standard */}
          <div
            className={`cursor-pointer flex justify-between items-center p-4 shadow-sm transition duration-300 ${
              expandedStandard === subject.id ? "bg-gray-100" : "bg-gray-200 hover:bg-gray-300"
            }`}
            onClick={() => toggleExpandStandard(subject.id)}
          >
            <h3 className="text-lg font-semibold text-gray-700">{subject.standard}</h3>
            {expandedStandard === subject.id ? <FaChevronUp /> : <FaChevronDown />}
          </div>

          {/* Expandable Table */}
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={
              expandedStandard === subject.id
                ? { height: "auto", opacity: 1 }
                : { height: 0, opacity: 0 }
            }
            transition={{ duration: 0.4 }}
            className={`${expandedStandard === subject.id ? "bg-gray-100" : ""}`}
          >
            {expandedStandard === subject.id && (
              <table className="w-full mt-2 border-collapse">
                <thead>
                  <tr className="border-b text-left">
                    <th className="p-2 border">Sr No</th>
                    <th className="p-2 border">Name</th>
                    <th className="p-2 border">GR No</th>
                    <th className="p-2 border">Parent Mobile No</th>
                    <th className="p-2 border">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {subject.students.map((id: any, index: number) => {
                    const student = students.find((student: any) => student.id === id)
                    return (
                      <tr key={id} className="border-b hover:bg-gray-50">
                        <td className="p-2 border">{index + 1}</td>
                        <td className="p-2 border">{student?.name || "Unknown"}</td>
                        <td className="p-2 border">{student?.grNo || "N/A"}</td>
                        <td className="p-2 border">{student?.parentMobile || "N/A"}</td>
                        <td className="p-2 border">
                          <button
                            onClick={() => handleDeleteStudent(id, subject.id)}
                            className="text-red-500 hover:text-red-700 transition duration-200"
                          >
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            )}
          </motion.div>
        </div>
      ))}
    </motion.div>
  )
}