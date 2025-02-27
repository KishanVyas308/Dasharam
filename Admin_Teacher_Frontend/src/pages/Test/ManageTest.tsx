'use client'

import React, { useEffect, useState } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import { motion } from 'framer-motion'
import { teastsAtom } from '../../state/testsAtom'
import { stdSubAtom } from '../../state/stdSubAtom'
import { studentsAtom } from '../../state/studentsAtom'
import { userAtom } from '../../state/userAtom'
import { UserRole } from '../../types/type'
import axios from 'axios'
import { BACKEND_URL } from '../../config'
import { toast } from 'react-toastify'
import { teachersAtom } from '../../state/teachersAtom'
import Loading from '../../components/Loading'

export default function ManageTest() {
  const [tests, setTests] = useRecoilState(teastsAtom)
  const user = useRecoilValue(userAtom)

  const [selectedStd, setSelectedStd] = useState<string>('')
  const [selectedSubject, setSelectedSubject] = useState<string>('')
  const [selectedTest, setSelectedTest] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [students, setStudents] = useRecoilState<any>(studentsAtom)

  const [teachers, setTeachers] = useRecoilState(teachersAtom)
  const [stdSub, setStdSub] = useRecoilState(stdSubAtom)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [subjects, setSubjects] = useState<any[]>([])

  const itemsPerPage = 10

  useEffect(() => {
    if (user?.role === UserRole.Teacher && stdSub.length > 0) {
      const stdid = stdSub.find((s: any) => s.classTeacherId === user.id)
      setSelectedStd(stdid.id)
      setSubjects(stdid.subjects)
    }
  }, [user, stdSub])

  const handleStdChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedStdId = event.target.value
    setSelectedStd(selectedStdId)
    const selectedStandard = stdSub.find((std: any) => std.id === selectedStdId)
    setSubjects(selectedStandard ? selectedStandard.subjects : [])
  }

  const handleSubjectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSubject(event.target.value)
  }

  const openModal = (test: any) => {
    setSelectedTest(test)
    setIsModalOpen(true)
    setCurrentPage(1) // Reset pagination when opening the modal
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedTest(null)
  }

  // Pagination logic
  const totalPages = selectedTest ? Math.ceil(selectedTest.students.length / itemsPerPage) : 1
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedStudents = selectedTest ? selectedTest.students.slice(startIndex, endIndex) : []

  const goToPreviousPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1)
  }

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1)
  }

  const getAllTeachers = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/teacher/all`,
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      )
      if (res.status === 200) {
        return res.data
      }
    } catch (error: any) {
      toast.error("Failed to fetch updated teachers list")
      return []
    }
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

  const getAllStudents = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/student/all`,
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      )
      if (res.status === 200) {
        return res.data
      }
    } catch (error: any) {
      toast.error("Failed to fetch updated standards list")
      return []
    }
  }

  const getAllTests = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/test/all`,
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      )
      if (res.status === 200) {
        return res.data
      }
    } catch (error: any) {
      toast.error("Failed to fetch updated tests list")
      return []
    }
  }

  useEffect(() => {
    if (teachers.length == 0) {
      const fetchTeachers = async () => {
        setIsLoading(true)
        const resTeacher = await getAllTeachers()
        setIsLoading(false)
        setTeachers(resTeacher)
      }
      fetchTeachers()
    }
    if (stdSub.length == 0) {
      const fetchStandards = async () => {
        setIsLoading(true)
        const resStandards = await getAllStdSub()
        setIsLoading(false)
        setStdSub(resStandards)
      }
      fetchStandards()
    }
    if (students.length === 0) {
      const fetchStudents = async () => {
        setIsLoading(true)
        const data = await getAllStudents()
        setIsLoading(false)
        setStudents(data)
      }
      fetchStudents()
    }
    if (tests.length === 0) {
      const fetchTests = async () => {
        setIsLoading(true)
        const data = await getAllTests()
        setTests(data)
        setIsLoading(false)
      }
      fetchTests()
    }
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-6 rounded-lg shadow-md"
    >
      {isLoading && <Loading />}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <div className="w-full md:w-1/4">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Standards</h3>
          <select
            value={selectedStd}
            onChange={handleStdChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All Standards</option>
            {stdSub && stdSub.map((std: any) => (
              <option key={std.id} value={std.id}>{std.standard}</option>
            ))}
          </select>
          <h3 className="text-lg font-semibold text-gray-800 mb-4 mt-4">Subjects</h3>
          <select
            value={selectedSubject}
            onChange={handleSubjectChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All Subjects</option>
            {subjects.map((subject: any) => (
              <option key={subject.name} value={subject.name}>{subject.name}</option>
            ))}
          </select>
        </div>

        {/* Main Content */}
        <div className="w-full md:w-3/4">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Tests</h3>
          {selectedStd ? (
            <ul className="space-y-2">
              {tests
                .filter((t: any) => t.standardId == selectedStd && (selectedSubject === '' || t.subject === selectedSubject))
                .map((t: any) => (
                  <li
                    key={t.id}
                    onClick={() => openModal(t)}
                    className="p-3 bg-gray-50 rounded-md hover:bg-gray-100 cursor-pointer transition duration-200"
                  >
                    <h4 className="font-medium">{t.name} - {t.subject}</h4>
                    <p className="text-sm text-gray-600">Date: {new Date(t.takenDate).toLocaleDateString()} | Total Marks: {t.totalMarks}</p>
                  </li>
                ))}
              {tests.filter((t: any) => t.standardId === selectedStd && (selectedSubject === '' || t.subject === selectedSubject)).length === 0 && (
                <p className="text-gray-600">No tests available for the selected standard and subject.</p>
              )}
            </ul>
          ) : (
            <p className="text-gray-600">Please select a standard to view tests.</p>
          )}
        </div>
      </div>

      {/* Test Details Modal */}
      {isModalOpen && selectedTest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-lg shadow-xl overflow-hidden w-full max-w-4xl mx-4 sm:mx-6 md:mx-8">
            <div className="p-6 flex justify-between items-center border-b">
              <h2 className="text-2xl font-semibold">{selectedTest.name} - {selectedTest.subject}</h2>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-800">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <table className="min-w-full table-auto border-collapse border border-gray-200">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-4 py-2 text-left">Student Name</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Marks Obtained</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Total Marks</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedStudents.map((student: any, index: number) => {
                    const studentInfo = students.find((s: any) => s.id === student.studentId)
                    return (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-4 py-2">{studentInfo ? studentInfo.name : 'Unknown Student'}</td>
                        <td className="border border-gray-300 px-4 py-2">{student.marks}</td>
                        <td className="border border-gray-300 px-4 py-2">{selectedTest.totalMarks}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
              {/* Pagination Controls */}
              <div className="flex justify-between items-center mt-4">
                <button
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="text-gray-700">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  )
}
