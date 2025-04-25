'use client'

import React, { useEffect, useState, useMemo } from 'react'
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
import { 
  FaSearch, 
  FaFilter, 
  FaCalendarAlt, 
  FaChalkboardTeacher, 
  FaBook, 
  FaTrophy, 
  FaChartLine, 
  FaDownload, 
  FaTrash, 
  FaRegEye, 
  FaRegStar, 
  FaSort,
  FaChevronLeft,
  FaChevronRight,
  FaUserGraduate
} from 'react-icons/fa'

export default function ManageTest() {
  const [tests, setTests] = useRecoilState(teastsAtom)
  const user = useRecoilValue(userAtom)

  const [selectedStd, setSelectedStd] = useState<string>('')
  const [selectedSubject, setSelectedSubject] = useState<string>('')
  const [selectedTest, setSelectedTest] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState<boolean>(false)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [students, setStudents] = useRecoilState<any>(studentsAtom)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [sortField, setSortField] = useState<string>('date')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  const [dateFilter, setDateFilter] = useState<{ start: Date | null, end: Date | null }>({ start: null, end: null })

  const [teachers, setTeachers] = useRecoilState(teachersAtom)
  const [stdSub, setStdSub] = useRecoilState(stdSubAtom)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [subjects, setSubjects] = useState<any[]>([])
  const [testToDelete, setTestToDelete] = useState<string | null>(null)
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState<boolean>(false)

  const itemsPerPage = 10

  useEffect(() => {
    if (user?.role === UserRole.Teacher && stdSub.length > 0) {
      const stdid = stdSub.find((s: any) => s.classTeacherId === user.id)
      if (stdid) {
        setSelectedStd(stdid.id)
        setSubjects(stdid.subjects)
      }
    }
  }, [user, stdSub])

  const handleStdChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedStdId = event.target.value
    setSelectedStd(selectedStdId)
    const selectedStandard = stdSub.find((std: any) => std.id === selectedStdId)
    setSubjects(selectedStandard ? selectedStandard.subjects : [])
    setCurrentPage(1)
  }

  const handleSubjectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSubject(event.target.value)
    setCurrentPage(1)
  }

  const handleSortChange = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('desc')
    }
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

  const openAnalytics = (test: any) => {
    setSelectedTest(test)
    setIsAnalyticsOpen(true)
  }

  const closeAnalytics = () => {
    setIsAnalyticsOpen(false)
  }

  const confirmDelete = (testId: string) => {
    setTestToDelete(testId)
    setIsDeleteConfirmOpen(true)
  }

  const cancelDelete = () => {
    setTestToDelete(null)
    setIsDeleteConfirmOpen(false)
  }

  const handleDeleteTest = async () => {
    if (!testToDelete) return
    
    setIsLoading(true)
    try {
      const res = await axios.delete(`${BACKEND_URL}/test/delete/${testToDelete}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
      
      // Remove test from local state
      if (res.status === 200) {
        setTests(tests.filter((test: any) => test.id !== testToDelete))
        toast.success("Test deleted successfully")
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete test")
    }
    
    setIsLoading(false)
    setTestToDelete(null)
    setIsDeleteConfirmOpen(false)
  }

  const exportTestResults = (test: any) => {
    // Convert test results to CSV
    let csvContent = "Student Name,GR No,Marks Obtained,Total Marks,Percentage\n"
    
    test.students.forEach((student: any) => {
      const studentInfo = students.find((s: any) => s.id === student.studentId)
      if (studentInfo) {
        const percentage = ((parseInt(student.marks) / parseInt(test.totalMarks)) * 100).toFixed(2)
        csvContent += `${studentInfo.name},${studentInfo.grno},${student.marks},${test.totalMarks},${percentage}%\n`
      }
    })
    
    // Create and download the CSV file
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${test.name}_${test.subject}_results.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    
    toast.success("Test results exported successfully")
  }

  // Analytics calculations
  const testAnalytics = useMemo(() => {
    if (!selectedTest) return null
    
    const totalStudents = selectedTest.students.length
    const marks = selectedTest.students.map((s: any) => parseInt(s.marks) || 0)
    const totalMarks = parseInt(selectedTest.totalMarks) || 100
    const passingPercentage = selectedTest.passingPercentage || 35
    const passingMarks = (totalMarks * passingPercentage) / 100
    
    // Basic metrics
    const highestMarks = Math.max(...marks)
    const lowestMarks = Math.min(...marks)
    const avgMarks = marks.reduce((sum: number, mark: number) => sum + mark, 0) / totalStudents
    
    // Pass/fail counts
    const passCount = marks.filter((mark : number) => mark >= passingMarks).length
    const failCount = totalStudents - passCount
    
    // Grade distribution
    const excellent = marks.filter((mark: number) => (mark / totalMarks) * 100 >= 80).length
    const good = marks.filter((mark : number) => (mark / totalMarks) * 100 >= 60 && (mark / totalMarks) * 100 < 80).length
    const average = marks.filter((mark : number) => (mark / totalMarks) * 100 >= passingPercentage && (mark / totalMarks) * 100 < 60).length
    const poor = marks.filter((mark : number) => (mark / totalMarks) * 100 < passingPercentage).length
    
    // Calculate top 3 students
    const topStudents = [...selectedTest.students]
      .sort((a, b) => parseInt(b.marks) - parseInt(a.marks))
      .slice(0, 3)
      .map(student => {
        const studentInfo = students.find((s: any) => s.id === student.studentId)
        return {
          name: studentInfo ? studentInfo.name : 'Unknown',
          marks: student.marks,
          percentage: ((parseInt(student.marks) / totalMarks) * 100).toFixed(2)
        }
      })
    
    return {
      totalStudents,
      highestMarks,
      lowestMarks,
      avgMarks: avgMarks.toFixed(2),
      passCount,
      failCount,
      passPercentage: ((passCount / totalStudents) * 100).toFixed(2),
      failPercentage: ((failCount / totalStudents) * 100).toFixed(2),
      grades: { excellent, good, average, poor },
      topStudents
    }
  }, [selectedTest, students])

  // Filter and sort tests
  const filteredTests = useMemo(() => {
    return tests
      .filter((t: any) => {
        // Filter by standard
        if (selectedStd && t.standardId !== selectedStd) return false
        
        // Filter by subject
        if (selectedSubject && t.subject !== selectedSubject) return false
        
        // Filter by search query
        if (searchQuery) {
          const query = searchQuery.toLowerCase()
          return (
            t.name.toLowerCase().includes(query) ||
            t.subject.toLowerCase().includes(query)
          )
        }
        
        // Filter by date range
        if (dateFilter.start && dateFilter.end) {
          const testDate = new Date(t.takenDate)
          return testDate >= dateFilter.start && testDate <= dateFilter.end
        }
        
        return true
      })
      .sort((a: any, b: any) => {
        if (sortField === 'name') {
          return sortDirection === 'asc' 
            ? a.name.localeCompare(b.name)
            : b.name.localeCompare(a.name)
        }
        if (sortField === 'subject') {
          return sortDirection === 'asc' 
            ? a.subject.localeCompare(b.subject)
            : b.subject.localeCompare(a.subject)
        }
        if (sortField === 'date') {
          return sortDirection === 'asc' 
            ? new Date(a.takenDate).getTime() - new Date(b.takenDate).getTime()
            : new Date(b.takenDate).getTime() - new Date(a.takenDate).getTime()
        }
        return 0
      })
  }, [tests, selectedStd, selectedSubject, searchQuery, dateFilter, sortField, sortDirection])

  // Pagination for test list
  const totalTestPages = Math.max(1, Math.ceil(filteredTests.length / itemsPerPage))
  const paginatedTests = filteredTests.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  // Pagination for modal
  const totalModalPages = selectedTest 
    ? Math.ceil(selectedTest.students.length / itemsPerPage) 
    : 1
  const paginatedStudents = selectedTest 
    ? selectedTest.students.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      )
    : []

  const navigatePage = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && currentPage > 1) {
      setCurrentPage(prev => prev - 1)
    } else if (direction === 'next' && currentPage < (isModalOpen ? totalModalPages : totalTestPages)) {
      setCurrentPage(prev => prev + 1)
    }
  }

  const getStandard = (id: string) => {
    return stdSub.find((s: any) => s.id === id)?.standard || 'Unknown'
  }

  const getTeacherName = (id: string) => {
    return teachers.find((t: any) => t.id === id)?.name || 'Unknown'
  }

  const getAllTeachers = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/teacher/all`,
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
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
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
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
  }

  const getAllStudents = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/student/all`,
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
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
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
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
    const fetchData = async () => {
      setIsLoading(true)
      
      if (teachers.length === 0) {
        const resTeacher = await getAllTeachers()
        setTeachers(resTeacher)
      }
      
      if (stdSub.length === 0) {
        const resStandards = await getAllStdSub()
        setStdSub(resStandards)
      }
      
      if (students.length === 0) {
        const data = await getAllStudents()
        setStudents(data)
      }
      
      if (tests.length === 0) {
        const data = await getAllTests()
        setTests(data)
      }
      
      setIsLoading(false)
    }
    
    fetchData()
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg p-6"
    >
      {isLoading && <Loading />}
      
      {/* Filter and Search Section */}
      <div className="mb-6 border-b pb-5">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
          <h3 className="text-xl font-bold text-gray-800 flex items-center mb-3 md:mb-0">
            <FaFilter className="text-indigo-600 mr-2" />
            Filter Tests
          </h3>
          <div className="w-full md:w-1/3 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tests..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Class/Standard</label>
            <select
              value={selectedStd}
              onChange={handleStdChange}
              disabled={user?.role === UserRole.Teacher}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                user?.role === UserRole.Teacher ? 'bg-gray-100' : ''
              }`}
            >
              <option value="">All Standards</option>
              {stdSub.map((std: any) => (
                <option key={std.id} value={std.id}>{std.standard}</option>
              ))}
            </select>
          </div>
          
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Subject</label>
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
          
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Sort By</label>
            <div className="flex space-x-2">
              <select
                value={sortField}
                onChange={(e) => handleSortChange(e.target.value)}
                className="flex-grow px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="date">Date</option>
                <option value="name">Test Name</option>
                <option value="subject">Subject</option>
              </select>
              <button
                onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
                className="px-3 py-2 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                title={sortDirection === 'asc' ? 'Ascending' : 'Descending'}
              >
                <FaSort className={sortDirection === 'asc' ? 'transform rotate-180' : ''} />
              </button>
            </div>
          </div>
          
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Date (Coming Soon)</label>
            <div className="px-3 py-2 border border-gray-300 bg-gray-50 rounded-md cursor-not-allowed text-gray-500 text-sm">
              Date filter coming soon
            </div>
          </div>
        </div>
      </div>
      
      {/* Test List */}
      <div>
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <FaBook className="text-indigo-600 mr-2" />
          Test Results
          <span className="ml-2 text-sm font-normal text-gray-500">
            {filteredTests.length} tests found
          </span>
        </h3>
        
        {filteredTests.length === 0 ? (
          <div className="bg-gray-50 rounded-lg p-6 text-center text-gray-500">
            {selectedStd || selectedSubject ? (
              <p>No tests found for the selected filters.</p>
            ) : (
              <p>No tests available. Create a new test to get started.</p>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="overflow-hidden rounded-lg border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Test Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Subject
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Class
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Marks
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedTests.map((test: any) => (
                    <tr key={test.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{test.name}</div>
                        <div className="text-sm text-gray-500">Teacher: {getTeacherName(test.takenByTeacherId)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                          {test.subject}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {getStandard(test.standardId)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(test.takenDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {test.totalMarks}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => openModal(test)}
                            className="text-indigo-600 hover:text-indigo-900"
                            title="View Results"
                          >
                            <FaRegEye />
                          </button>
                          <button
                            onClick={() => openAnalytics(test)}
                            className="text-blue-600 hover:text-blue-900"
                            title="View Analytics"
                          >
                            <FaChartLine />
                          </button>
                          <button
                            onClick={() => exportTestResults(test)}
                            className="text-green-600 hover:text-green-900"
                            title="Export Results"
                          >
                            <FaDownload />
                          </button>
                          <button
                            onClick={() => confirmDelete(test.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete Test"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Pagination for test list */}
            {totalTestPages > 1 && (
              <div className="flex justify-between items-center mt-4 px-2">
                <button
                  onClick={() => navigatePage('prev')}
                  disabled={currentPage === 1}
                  className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaChevronLeft className="mr-1" />
                  Previous
                </button>
                <span className="text-sm text-gray-700">
                  Page {currentPage} of {totalTestPages}
                </span>
                <button
                  onClick={() => navigatePage('next')}
                  disabled={currentPage === totalTestPages}
                  className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                  <FaChevronRight className="ml-1" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Test Results Modal */}
      {isModalOpen && selectedTest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4 py-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-lg shadow-xl overflow-hidden w-full max-w-5xl max-h-[90vh] flex flex-col"
          >
            <div className="p-6 flex justify-between items-center border-b">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-1">{selectedTest.name}</h2>
                <div className="flex flex-wrap items-center text-sm text-gray-600 gap-3">
                  <span className="flex items-center">
                    <FaBook className="mr-1" /> {selectedTest.subject}
                  </span>
                  <span className="flex items-center">
                    <FaUserGraduate className="mr-1" /> {getStandard(selectedTest.standardId)}
                  </span>
                  <span className="flex items-center">
                    <FaCalendarAlt className="mr-1" /> {new Date(selectedTest.takenDate).toLocaleDateString()}
                  </span>
                  <span className="flex items-center">
                    <FaChalkboardTeacher className="mr-1" /> {getTeacherName(selectedTest.takenByTeacherId)}
                  </span>
                  <span className="flex items-center">
                    <FaTrophy className="mr-1" /> Total: {selectedTest.totalMarks} marks
                  </span>
                </div>
              </div>
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
            
            <div className="overflow-auto p-6 flex-grow">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-indigo-50 p-4 rounded-lg">
                  <p className="text-indigo-800 font-medium mb-1">Total Students</p>
                  <p className="text-2xl font-bold text-indigo-900">{selectedTest.students.length}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-green-800 font-medium mb-1">Average Score</p>
                  <p className="text-2xl font-bold text-green-900">
                    {testAnalytics?.avgMarks} / {selectedTest.totalMarks}
                  </p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-blue-800 font-medium mb-1">Passed</p>
                  <p className="text-2xl font-bold text-blue-900">
                    {testAnalytics?.passCount} <span className="text-sm font-normal">({testAnalytics?.passPercentage}%)</span>
                  </p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <p className="text-red-800 font-medium mb-1">Failed</p>
                  <p className="text-2xl font-bold text-red-900">
                    {testAnalytics?.failCount} <span className="text-sm font-normal">({testAnalytics?.failPercentage}%)</span>
                  </p>
                </div>
              </div>
              
              <table className="min-w-full table-auto border-collapse border border-gray-200">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-4 py-2 text-left">Rank</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Student Name</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">GR No.</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Marks</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Percentage</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Result</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedStudents
                    .sort((a: any, b: any) => parseInt(b.marks) - parseInt(a.marks))
                    .map((student: any, index: number) => {
                      const studentInfo = students.find((s: any) => s.id === student.studentId)
                      const passingPercentage = selectedTest.passingPercentage || 35
                      const passingMarks = (parseInt(selectedTest.totalMarks) * passingPercentage) / 100
                      const isPassing = parseInt(student.marks) >= passingMarks
                      const percentage = ((parseInt(student.marks) / parseInt(selectedTest.totalMarks)) * 100).toFixed(2)
                      
                      // Calculate global rank
                      const allStudentsSorted = [...selectedTest.students].sort((a: any, b: any) => parseInt(b.marks) - parseInt(a.marks))
                      const globalRank = allStudentsSorted.findIndex((s: any) => s.studentId === student.studentId) + 1
                      
                      return (
                        <tr key={student.studentId} className={`hover:bg-gray-50 ${isPassing ? '' : 'bg-red-50'}`}>
                          <td className="border border-gray-300 px-4 py-2">
                            {globalRank <= 3 ? (
                              <span className="flex items-center">
                                <FaRegStar className={`mr-1 ${
                                  globalRank === 1 ? 'text-yellow-500' : 
                                  globalRank === 2 ? 'text-gray-400' : 'text-yellow-700'
                                }`} />
                                {globalRank}
                              </span>
                            ) : (
                              globalRank
                            )}
                          </td>
                          <td className="border border-gray-300 px-4 py-2 font-medium">
                            {studentInfo ? studentInfo.name : 'Unknown Student'}
                          </td>
                          <td className="border border-gray-300 px-4 py-2">
                            {studentInfo ? studentInfo.grno : 'N/A'}
                          </td>
                          <td className="border border-gray-300 px-4 py-2 font-semibold">
                            {student.marks} / {selectedTest.totalMarks}
                          </td>
                          <td className="border border-gray-300 px-4 py-2">
                            {percentage}%
                          </td>
                          <td className="border border-gray-300 px-4 py-2">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              isPassing 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {isPassing ? 'Pass' : 'Fail'}
                            </span>
                          </td>
                        </tr>
                      )
                    })}
                </tbody>
              </table>
            </div>
            
            {/* Pagination Controls */}
            {totalModalPages > 1 && (
              <div className="p-4 border-t flex justify-between items-center">
                <button
                  onClick={() => navigatePage('prev')}
                  disabled={currentPage === 1}
                  className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaChevronLeft className="mr-1" />
                  Previous
                </button>
                <span className="text-sm text-gray-700">
                  Page {currentPage} of {totalModalPages}
                </span>
                <button
                  onClick={() => navigatePage('next')}
                  disabled={currentPage === totalModalPages}
                  className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                  <FaChevronRight className="ml-1" />
                </button>
              </div>
            )}
            
            <div className="p-4 border-t flex justify-end space-x-3">
              <button
                onClick={() => {
                  closeModal()
                  openAnalytics(selectedTest)
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
              >
                <FaChartLine className="mr-2" />
                View Analytics
              </button>
              <button
                onClick={() => exportTestResults(selectedTest)}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center"
              >
                <FaDownload className="mr-2" />
                Export Results
              </button>
            </div>
          </motion.div>
        </div>
      )}
      
      {/* Analytics Modal */}
      {isAnalyticsOpen && selectedTest && testAnalytics && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4 py-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-lg shadow-xl overflow-hidden w-full max-w-4xl max-h-[90vh] flex flex-col"
          >
            <div className="p-6 flex justify-between items-center border-b">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-1">Performance Analytics</h2>
                <p className="text-gray-600">
                  {selectedTest.name} - {selectedTest.subject} ({getStandard(selectedTest.standardId)})
                </p>
              </div>
              <button onClick={closeAnalytics} className="text-gray-500 hover:text-gray-800">
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
            
            <div className="overflow-auto p-6 flex-grow">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Key Metrics</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Students</span>
                      <span className="font-medium">{testAnalytics.totalStudents}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Highest Marks</span>
                      <span className="font-medium">{testAnalytics.highestMarks} / {selectedTest.totalMarks}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Lowest Marks</span>
                      <span className="font-medium">{testAnalytics.lowestMarks} / {selectedTest.totalMarks}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Average Marks</span>
                      <span className="font-medium">{testAnalytics.avgMarks} / {selectedTest.totalMarks}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Pass Percentage</span>
                      <span className="font-medium text-green-600">{testAnalytics.passPercentage}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Fail Percentage</span>
                      <span className="font-medium text-red-600">{testAnalytics.failPercentage}%</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Grade Distribution</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-gray-600">Excellent (80%+)</span>
                        <span className="text-sm font-medium">{testAnalytics.grades.excellent} students</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="bg-green-600 h-2.5 rounded-full" 
                          style={{ width: `${(testAnalytics.grades.excellent / testAnalytics.totalStudents) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-gray-600">Good (60-79%)</span>
                        <span className="text-sm font-medium">{testAnalytics.grades.good} students</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="bg-blue-500 h-2.5 rounded-full" 
                          style={{ width: `${(testAnalytics.grades.good / testAnalytics.totalStudents) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-gray-600">Average (35-59%)</span>
                        <span className="text-sm font-medium">{testAnalytics.grades.average} students</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="bg-yellow-500 h-2.5 rounded-full" 
                          style={{ width: `${(testAnalytics.grades.average / testAnalytics.totalStudents) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-gray-600">Poor (Below 35%)</span>
                        <span className="text-sm font-medium">{testAnalytics.grades.poor} students</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="bg-red-500 h-2.5 rounded-full" 
                          style={{ width: `${(testAnalytics.grades.poor / testAnalytics.totalStudents) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Top Performers</h3>
                  <div className="space-y-4">
                    {testAnalytics.topStudents.map((student, index) => (
                      <div key={index} className={`p-3 rounded-lg ${
                        index === 0 ? 'bg-yellow-50 border border-yellow-200' : 
                        index === 1 ? 'bg-gray-50 border border-gray-200' : 
                        'bg-yellow-50 border border-yellow-700'
                      }`}>
                        <div className="flex items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                            index === 0 ? 'bg-yellow-500 text-white' : 
                            index === 1 ? 'bg-gray-400 text-white' : 
                            'bg-yellow-700 text-white'
                          }`}>
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-medium">{student.name}</p>
                            <p className="text-sm">
                              {student.marks} / {selectedTest.totalMarks} ({student.percentage}%)
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Pass/Fail Distribution</h3>
                <div className="relative pt-1">
                  <div className="flex h-16 mb-4">
                    <div 
                      className="flex flex-col justify-center items-center bg-green-600 text-white px-2 text-center"
                      style={{ width: `${testAnalytics.passPercentage}%` }}
                    >
                      <span className="text-sm font-bold mb-1">{testAnalytics.passCount}</span>
                      <span className="text-xs">Pass</span>
                    </div>
                    <div 
                      className="flex flex-col justify-center items-center bg-red-600 text-white px-2 text-center"
                      style={{ width: `${testAnalytics.failPercentage}%` }}
                    >
                      <span className="text-sm font-bold mb-1">{testAnalytics.failCount}</span>
                      <span className="text-xs">Fail</span>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-500">0%</span>
                    <span className="text-xs text-gray-500">100%</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-4 border-t flex justify-end">
              <button
                onClick={closeAnalytics}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
      
      {/* Delete Confirmation Modal */}
      {isDeleteConfirmOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-xl overflow-hidden w-full max-w-md"
          >
            <div className="p-6 border-b">
              <h3 className="text-xl font-bold text-gray-900">Confirm Delete</h3>
            </div>
            <div className="p-6">
              <p className="text-gray-700">
                Are you sure you want to delete this test? This action cannot be undone and all student results will be permanently removed.
              </p>
            </div>
            <div className="p-4 border-t bg-gray-50 flex justify-end space-x-3">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteTest}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  )
}
