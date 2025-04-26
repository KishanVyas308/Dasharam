'use client'

import { useEffect, useState } from 'react'
import { useRecoilState } from 'recoil'
import { motion, AnimatePresence } from 'framer-motion'
import { teastsAtom } from '../../state/testsAtom'
import { stdSubAtom } from '../../state/stdSubAtom'
import { studentsAtom } from '../../state/studentsAtom'
import { userAtom } from '../../state/userAtom'
import { UserRole } from '../../types/type'
import axios from 'axios'
import { BACKEND_URL } from '../../config'
import { toast } from 'react-toastify'
import Loading from '../../components/Loading'
import { 
  FaCalendarAlt, 
  FaCheck, 
  FaChevronRight, 
  FaClipboardCheck, 
  FaCog, 
  FaGraduationCap, 
  FaList, 
  FaPlus, 
  FaRegCheckSquare, 
  FaRegSquare, 
  FaSave, 
  FaSearch, 
  FaTimes, 
  FaUserGraduate 
} from 'react-icons/fa'

export default function AddTest() {
  const [isLoading, setIsLoading] = useState(false)
  const [tests, setTests] = useRecoilState(teastsAtom)
  const [stdSub, setStdSub] = useRecoilState(stdSubAtom)
  const [students, setStudents] = useRecoilState(studentsAtom)
  const [user, setUser] = useRecoilState(userAtom)

  // Test details
  const [testName, setTestName] = useState('')
  const [selectedStandard, setSelectedStandard] = useState('')
  const [selectedSubject, setSelectedSubject] = useState('')
  const [totalMarks, setTotalMarks] = useState('100')
  const [takenDate, setTakenDate] = useState(new Date().toISOString().split('T')[0])
  
  // Student management
  const [subjects, setSubjects] = useState<any[]>([])
  const [studentsInStandard, setStudentsInStandard] = useState<any[]>([])
  const [studentsMarks, setStudentsMarks] = useState<{ [key: string]: string }>({})
  const [searchQuery, setSearchQuery] = useState('')
  const [currentStep, setCurrentStep] = useState(1)
  
  // Batch mark assignment
  const [showBatchOptions, setShowBatchOptions] = useState(false)
  const [batchValue, setBatchValue] = useState('')
  const [selectedStudents, setSelectedStudents] = useState<string[]>([])
  const [selectAll, setSelectAll] = useState(false)
  
  // Mark distribution visualization
  const [markDistribution, setMarkDistribution] = useState<{
    excellent: number;
    good: number;
    average: number;
    poor: number;
  }>({ excellent: 0, good: 0, average: 0, poor: 0 })

  useEffect(() => {
    if (user?.role === UserRole.Teacher && stdSub.length > 0) {
      const stdid = stdSub.find((s: any) => s.classTeacherId === user.id)
      if (stdid) {
        handleStdChange(stdid.id)
        setSelectedStandard(stdid.id)
      }
    }
  }, [user, stdSub])

  useEffect(() => {
    // Create a mark distribution visualization
    const total = parseInt(totalMarks) || 100
    const passingValue = (total * 35) / 100

    const excellent = Object.values(studentsMarks).filter(mark => 
      parseInt(mark) >= (total * 80) / 100
    ).length

    const good = Object.values(studentsMarks).filter(mark => 
      parseInt(mark) >= (total * 60) / 100 && 
      parseInt(mark) < (total * 80) / 100
    ).length

    const average = Object.values(studentsMarks).filter(mark => 
      parseInt(mark) >= passingValue && 
      parseInt(mark) < (total * 60) / 100
    ).length

    const poor = Object.values(studentsMarks).filter(mark => 
      parseInt(mark) < passingValue
    ).length

    setMarkDistribution({ excellent, good, average, poor })
  }, [studentsMarks, totalMarks])

  const handleStdChange = (stdId: string) => {
    const selectedStd = stdSub.find((std: any) => std.id === stdId)
    if (selectedStd) {
      setSelectedStandard(stdId)
      setSubjects(selectedStd.subjects || [])
      setSelectedSubject('')

      // Set students for this standard
      const stdStudents = selectedStd.students || []
      const studentsWithDetails = stdStudents.map((studentId: string) => {
        const studentDetails = students.find((s: any) => s.id === studentId) || { id: studentId, name: 'Unknown' }
        return studentDetails
      })
      
      setStudentsInStandard(studentsWithDetails)
      
      // Reset student marks
      const initialMarks: { [key: string]: string } = {}
      stdStudents.forEach((studentId: string) => {
        initialMarks[studentId] = ''
      })
      setStudentsMarks(initialMarks)
      
      // Reset selected students
      setSelectedStudents([])
      setSelectAll(false)
    }
  }

  const handleSubjectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSubject(event.target.value)
  }

  const handleMarkChange = (studentId: string, value: string) => {
    const numValue = value === '' ? '' : parseInt(value) > parseInt(totalMarks) ? totalMarks : value
    setStudentsMarks({ ...studentsMarks, [studentId]: numValue })
  }

  const toggleSelectStudent = (studentId: string) => {
    if (selectedStudents.includes(studentId)) {
      setSelectedStudents(selectedStudents.filter(id => id !== studentId))
    } else {
      setSelectedStudents([...selectedStudents, studentId])
    }
  }

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedStudents([])
    } else {
      setSelectedStudents(studentsInStandard.map(student => student.id))
    }
    setSelectAll(!selectAll)
  }

  const applyBatchMarks = () => {
    if (!batchValue) {
      toast.error('Please enter a mark value')
      return
    }

    const numValue = parseInt(batchValue) > parseInt(totalMarks) ? totalMarks : batchValue
    
    const updatedMarks = { ...studentsMarks }
    selectedStudents.forEach(studentId => {
      updatedMarks[studentId] = numValue
    })
    
    setStudentsMarks(updatedMarks)
    setShowBatchOptions(false)
    setBatchValue('')
    setSelectedStudents([])
    setSelectAll(false)
    
    toast.success(`Applied ${numValue} marks to ${selectedStudents.length} students`)
  }

  const clearAllMarks = () => {
    if (window.confirm('Are you sure you want to clear all marks?')) {
      const initialMarks: { [key: string]: string } = {}
      studentsInStandard.forEach(student => {
        initialMarks[student.id] = ''
      })
      setStudentsMarks(initialMarks)
      toast.success('All marks cleared')
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
      toast.error("Failed to fetch updated students list")
      return []
    }
  }

  const getAllStdSub = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/subject-standard/all`,
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
      
      if (stdSub.length === 0) {
        const resStandards = await getAllStdSub()
        setStdSub(resStandards)
      }
      
      if (students.length === 0) {
        const resStudents = await getAllStudents()
        setStudents(resStudents)
      }
      
      setIsLoading(false)
    }
    
    fetchData()
  }, [])

  const validateForm = () => {
    if (!testName.trim()) {
      toast.error('Test name is required')
      return false
    }
    
    if (!selectedStandard) {
      toast.error('Please select a standard')
      return false
    }
    
    if (!selectedSubject) {
      toast.error('Please select a subject')
      return false
    }
    
    if (!totalMarks || parseInt(totalMarks) <= 0) {
      toast.error('Total marks must be greater than 0')
      return false
    }
    
    
  
    
    if (!takenDate) {
      toast.error('Test date is required')
      return false
    }
    
    return true
  }

  const validateStudentMarks = () => {
    const studentWithMarks = Object.entries(studentsMarks).filter(([_, mark]) => mark !== '')
    
    if (studentWithMarks.length === 0) {
      toast.error('Please enter marks for at least one student')
      return false
    }
    
    for (const [studentId, mark] of studentWithMarks) {
      if (isNaN(parseInt(mark))) {
        toast.error('All marks must be valid numbers')
        return false
      }
      
      if (parseInt(mark) < 0) {
        toast.error('Marks cannot be negative')
        return false
      }
      
      if (parseInt(mark) > parseInt(totalMarks)) {
        toast.error(`Marks cannot exceed total marks (${totalMarks})`)
        return false
      }
    }
    
    return true
  }

  const nextStep = () => {
    if (currentStep === 1) {
      if (validateForm()) {
        setCurrentStep(2)
      }
    }
  }

  const prevStep = () => {
    setCurrentStep(1)
  }

  const handleSubmit = async () => {
    if (!validateForm() || !validateStudentMarks()) {
      return
    }
    
    setIsLoading(true)
    
    try {
      // Prepare student marks data
      const studentsWithMarks = Object.entries(studentsMarks)
        .filter(([_, mark]) => mark !== '')
        .map(([studentId, mark]) => ({
          studentId,
          marks: mark
        }))
      
      const testData = {
        name: testName,
        standardId: selectedStandard,
        subject: selectedSubject,
        totalMarks,
        takenDate,
        takenByTeacherId: user?.id || '',
        students: studentsWithMarks
      }
      
      const res = await axios.post(`${BACKEND_URL}/test/add`, testData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
      
      if (res.status === 200) {
        toast.success('Test added successfully')
        
        // Update tests atom
        const updatedTests = await getAllTests()
        setTests(updatedTests)
        
        // Reset form
        setTestName('')
        setSelectedStandard('')
        setSelectedSubject('')
        setTotalMarks('100')
        setTakenDate(new Date().toISOString().split('T')[0])
        setStudentsMarks({})
        setCurrentStep(1)
      }
    } catch (error: any) {
      console.error(error)
      toast.error(error.response?.data?.message || 'Failed to add test')
    }
    
    setIsLoading(false)
  }

  // Filter students based on search query
  const filteredStudents = studentsInStandard.filter(student =>
    student.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.grno?.toString().includes(searchQuery)
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-xl shadow-lg"
    >
      {isLoading && <Loading />}
      
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center">
            <FaClipboardCheck className="mr-3 text-indigo-600" />
            {currentStep === 1 ? 'Add New Test' : 'Enter Student Marks'}
          </h2>
          
          {/* Step indicator */}
          <div className="flex items-center">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
              currentStep === 1 ? 'bg-indigo-600 text-white' : 'bg-indigo-200 text-indigo-700'
            }`}>
              1
            </div>
            <div className={`w-12 h-1 ${currentStep === 1 ? 'bg-gray-300' : 'bg-indigo-500'}`}></div>
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
              currentStep === 2 ? 'bg-indigo-600 text-white' : 'bg-indigo-200 text-indigo-700'
            }`}>
              2
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <AnimatePresence mode="wait">
          {currentStep === 1 ? (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-2">
                  <label htmlFor="testName" className="block text-sm font-semibold text-gray-700">
                    Test Name*
                  </label>
                  <input
                    id="testName"
                    type="text"
                    value={testName}
                    onChange={(e) => setTestName(e.target.value)}
                    placeholder="e.g. Mid-Term Examination"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="takenDate" className="block text-sm font-semibold text-gray-700">
                    Test Date*
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <FaCalendarAlt className="text-gray-500" />
                    </div>
                    <input
                      id="takenDate"
                      type="date"
                      value={takenDate}
                      onChange={(e) => setTakenDate(e.target.value)}
                      className="w-full pl-10 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="standard" className="block text-sm font-semibold text-gray-700">
                    Standard/Class*
                  </label>
                  <select
                    id="standard"
                    value={selectedStandard}
                    onChange={(e) => handleStdChange(e.target.value)}
                    disabled={user?.role === UserRole.Teacher}
                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none bg-white transition-all ${
                      user?.role === UserRole.Teacher ? 'bg-gray-100' : ''
                    }`}
                    required
                  >
                    <option value="">Select a standard</option>
                    {stdSub.map((std: any) => (
                      <option key={std.id} value={std.id}>{std.standard}</option>
                    ))}
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="subject" className="block text-sm font-semibold text-gray-700">
                    Subject*
                  </label>
                  <select
                    id="subject"
                    value={selectedSubject}
                    onChange={handleSubjectChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none bg-white transition-all"
                    required
                  >
                    <option value="">Select a subject</option>
                    {subjects.map((subject: any) => (
                      <option key={subject.name} value={subject.name}>{subject.name}</option>
                    ))}
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="totalMarks" className="block text-sm font-semibold text-gray-700">
                    Total Marks*
                  </label>
                  <input
                    id="totalMarks"
                    type="number"
                    value={totalMarks}
                    onChange={(e) => setTotalMarks(e.target.value)}
                    placeholder="e.g. 100"
                    min="1"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    required
                  />
                </div>
                
              
              </div>
              
              <div className="bg-indigo-50 rounded-lg p-4 mb-6">
                <div className="flex items-start">
                  <FaGraduationCap className="text-indigo-600 mt-1 mr-3" />
                  <div>
                    <h3 className="font-medium text-indigo-800">Student Information</h3>
                    <p className="text-sm text-indigo-700 mt-1">
                      {selectedStandard ? (
                        <>
                          This class has <span className="font-semibold">{studentsInStandard.length}</span> students. 
                          Proceed to the next step to enter their marks.
                        </>
                      ) : (
                        'Select a class above to see student information.'
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
            >
              <div className="mb-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                  <div className="w-full md:w-1/2 relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <FaSearch className="text-gray-500" />
                    </div>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search students by name or GR..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  
                  <div className="flex space-x-2 w-full md:w-auto">
                    <button
                      type="button"
                      onClick={() => setShowBatchOptions(!showBatchOptions)}
                      className="flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all shadow-md"
                    >
                      <FaCog className="mr-2" />
                      Batch Marks
                    </button>
                    
                    <button
                      type="button"
                      onClick={clearAllMarks}
                      className="flex items-center px-4 py-2 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all shadow-md"
                    >
                      <FaTimes className="mr-2" />
                      Clear All
                    </button>
                  </div>
                </div>
                
                {/* Batch options */}
                <AnimatePresence>
                  {showBatchOptions && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="bg-gray-50 p-4 rounded-lg mb-4 border border-gray-200">
                        <h3 className="font-medium text-gray-800 mb-3">Batch Mark Assignment</h3>
                        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                          <div className="flex items-center">
                            <button
                              type="button"
                              onClick={toggleSelectAll}
                              className="flex items-center text-gray-700 hover:text-gray-900"
                            >
                              {selectAll ? (
                                <FaRegCheckSquare className="mr-2 text-indigo-600" />
                              ) : (
                                <FaRegSquare className="mr-2 text-gray-400" />
                              )}
                              Select All ({selectedStudents.length}/{studentsInStandard.length})
                            </button>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <input
                              type="number"
                              value={batchValue}
                              onChange={(e) => setBatchValue(e.target.value)}
                              placeholder="Enter mark value"
                              min="0"
                              max={totalMarks}
                              className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                            
                            <button
                              type="button"
                              onClick={applyBatchMarks}
                              disabled={selectedStudents.length === 0 || !batchValue}
                              className="flex items-center px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all shadow-md disabled:bg-indigo-300 disabled:cursor-not-allowed"
                            >
                              <FaCheck className="mr-2" />
                              Apply to Selected
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                {/* Mark distribution visualization */}
                {Object.values(studentsMarks).some(mark => mark !== '') && (
                  <div className="bg-white p-4 rounded-lg mb-4 border border-gray-200">
                    <h3 className="font-medium text-gray-800 mb-3">Mark Distribution Preview</h3>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-gray-600">Excellent (80%+)</span>
                          <span className="text-sm font-medium">{markDistribution.excellent} students</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="bg-green-600 h-2.5 rounded-full" 
                            style={{ width: `${studentsInStandard.length > 0 ? (markDistribution.excellent / studentsInStandard.length) * 100 : 0}%` }}
                          ></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-gray-600">Good (60-79%)</span>
                          <span className="text-sm font-medium">{markDistribution.good} students</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="bg-blue-500 h-2.5 rounded-full" 
                            style={{ width: `${studentsInStandard.length > 0 ? (markDistribution.good / studentsInStandard.length) * 100 : 0}%` }}
                          ></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-gray-600">Average (35-59%)</span>
                          <span className="text-sm font-medium">{markDistribution.average} students</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="bg-yellow-500 h-2.5 rounded-full" 
                            style={{ width: `${studentsInStandard.length > 0 ? (markDistribution.average / studentsInStandard.length) * 100 : 0}%` }}
                          ></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-gray-600">Poor (Below 35%)</span>
                          <span className="text-sm font-medium">{markDistribution.poor} students</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="bg-red-500 h-2.5 rounded-full" 
                            style={{ width: `${studentsInStandard.length > 0 ? (markDistribution.poor / studentsInStandard.length) * 100 : 0}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Student marks table */}
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {showBatchOptions ? 'Select' : 'No.'}
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Student Name
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          GR Number
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Marks (Out of {totalMarks})
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredStudents.length > 0 ? (
                        filteredStudents.map((student, index) => {
                          const studentMark = studentsMarks[student.id] || ''
                          const percentage = studentMark ? (parseInt(studentMark) / parseInt(totalMarks)) * 100 : 0
                          
                          const status = !studentMark ? 'not-entered' : percentage >= 35 ? 'pass' : 'fail'
                          
                          return (
                            <tr key={student.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                {showBatchOptions ? (
                                  <button
                                    type="button"
                                    onClick={() => toggleSelectStudent(student.id)}
                                    className="flex items-center text-gray-700 hover:text-gray-900"
                                  >
                                    {selectedStudents.includes(student.id) ? (
                                      <FaRegCheckSquare className="text-indigo-600" />
                                    ) : (
                                      <FaRegSquare className="text-gray-400" />
                                    )}
                                  </button>
                                ) : (
                                  <span className="text-gray-600">{index + 1}</span>
                                )}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="font-medium text-gray-900">{student.name || 'Unknown'}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-600">{student.grno || 'N/A'}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <input
                                  type="number"
                                  value={studentMark}
                                  onChange={(e) => handleMarkChange(student.id, e.target.value)}
                                  placeholder="Enter marks"
                                  min="0"
                                  max={totalMarks}
                                  className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {status === 'not-entered' ? (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                    Not entered
                                  </span>
                                ) : status === 'pass' ? (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    Pass ({percentage.toFixed(1)}%)
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                    Fail ({percentage.toFixed(1)}%)
                                  </span>
                                )}
                              </td>
                            </tr>
                          )
                        })
                      ) : (
                        <tr>
                          <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                            {searchQuery ? 'No students match your search criteria.' : 'No students found in this class.'}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <div className="px-6 py-4 border-t bg-gray-50 flex justify-between">
        {currentStep === 1 ? (
          <div></div>
        ) : (
          <button
            type="button"
            onClick={prevStep}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors flex items-center"
          >
            Back
          </button>
        )}
        
        {currentStep === 1 ? (
          <button
            type="button"
            onClick={nextStep}
            className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all shadow-md flex items-center"
          >
            <FaList className="mr-2" />
            Enter Marks
            <FaChevronRight className="ml-2" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all shadow-md flex items-center"
          >
            <FaSave className="mr-2" />
            Save Test
          </button>
        )}
      </div>
    </motion.div>
  )
}