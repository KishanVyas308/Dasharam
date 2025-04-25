'use client'

import { useEffect, useState } from "react"
import { useRecoilState, useSetRecoilState } from "recoil"
import { studentsAtom } from "../../state/studentsAtom"
import { stdSubAtom } from "../../state/stdSubAtom"
// import { addStudent, getAllStudents } from "../../backend/handleStudent"
// import { getAllStdSub } from "../../backend/subjectStdHandle"
import { motion } from 'framer-motion'
import { FaUserPlus } from 'react-icons/fa'
import axios from "axios"
import { BACKEND_URL } from "../../config"
import { toast } from "react-toastify"
import Loading from "../../components/Loading"

export default function AddStudent() {
  const [name, setName] = useState("")
  const [parentName, setParentName] = useState("")
  const [parentMobileNo, setParentMobileNo] = useState("")
  const [grNo, setGrNo] = useState("")

  const [standardId, setStandardId] = useState("")

  const [isLoading, setIsLoading] = useState(false)

  const [students, setStudents] = useRecoilState(studentsAtom)
  const [standard, setStandard] = useRecoilState(stdSubAtom)

  const getAllStdSub = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/subject-standard/all`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
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

  async function fetchStandardsSub() {
    if (standard.length === 0) {
      setIsLoading(true)
      const data = await getAllStdSub()
      setIsLoading(false)
      setStandard(data)
    }
  }

  useEffect(() => {
    fetchStandardsSub()
  }, [standard])

  const getAllStudents = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/student/all`,
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      )

      if (res.status === 200) {
        return res.data
      }
    } catch (error: any) {
      setIsLoading(false)
      toast.error("Failed to fetch updated standards list")
      return []
    }
  }

  const handleAddStudent = async () => {
    if (!name.trim()) {
      toast.error("Student name is required")
      return
    }
    if (!parentName.trim()) {
      toast.error("Parent name is required")
      return
    }
    if (!parentMobileNo.trim() || !/^\d{10}$/.test(parentMobileNo)) {
      toast.error("Valid parent mobile number is required")
      return
    }
    if (!grNo.trim()) {
      toast.error("GR Number is required")
      return
    }
    // add validation for grno if exists in the database
    if (students.some((student: any) => student.grno === grNo)) {
      toast.error("GR Number already exists")
      return
    }
    if (!standardId) {
      toast.error("Please select a standard/class")
      return
    }

    setIsLoading(true)

    try {
      const res = await axios.post(`${BACKEND_URL}/student/add`, {
        name,
        parentName,
        parentMobileNo,
        grno: grNo,
        standardId
      }, 
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      )
      toast.success(res.data.message)
    } catch (error: any) {
      setIsLoading(false)
      toast.error("Failed to add student")
      return
    }

    const updatedStudents = await getAllStudents()
    setStudents(updatedStudents)
    setName("")
    setParentName("")
    setParentMobileNo("")
    setGrNo("")
    setStandardId("")
    setIsLoading(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white p-8 rounded-xl shadow-lg border border-gray-100"
    >
      {isLoading && <Loading />}
      
      <h2 className="text-2xl font-bold text-gray-800 mb-8 flex items-center">
        <FaUserPlus className="mr-3 text-indigo-600" />
        Add New Student
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="name" className="block text-sm font-semibold text-gray-700">Student Name</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter student's full name"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
            required
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="parentName" className="block text-sm font-semibold text-gray-700">Parent Name</label>
          <input
            id="parentName"
            type="text"
            value={parentName}
            onChange={(e) => setParentName(e.target.value)}
            placeholder="Enter parent's full name"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
            required
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="parentMobileNo" className="block text-sm font-semibold text-gray-700">Parent Mobile Number</label>
          <input
            id="parentMobileNo"
            type="tel"
            value={parentMobileNo}
            onChange={(e) => setParentMobileNo(e.target.value)}
            placeholder="Enter parent's contact number"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
            required
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="grNo" className="block text-sm font-semibold text-gray-700">GR Number</label>
          <input
            id="grNo"
            type="text"
            value={grNo}
            onChange={(e) => setGrNo(e.target.value)}
            placeholder="Enter general register number"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
            required
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <label htmlFor="standard" className="block text-sm font-semibold text-gray-700">Standard/Class</label>
          <select
            id="standard"
            value={standardId}
            onChange={(e) => setStandardId(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none bg-white transition-all"
            required
          >
            <option value="">Select a standard</option>
            {standard.map((std: any) => (
              <option key={std.id} value={std.id}>{std.standard}</option>
            ))}
          </select>
        </div>
      </div>
      
      <motion.div 
        className="mt-8"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
      >
        <button
          onClick={handleAddStudent}
          disabled={isLoading}
          className="w-full px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all shadow-md"
        >
          <div className="flex items-center justify-center">
            <FaUserPlus className="mr-2" />
            {isLoading ? "Processing..." : "Add Student"}
          </div>
        </button>
      </motion.div>
    </motion.div>
  )
}