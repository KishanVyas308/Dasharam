'use client'

import React, { useEffect, useState } from "react"
import { useRecoilState } from "recoil"
import { studentsAtom } from "../../state/studentsAtom"
import { stdSubAtom } from "../../state/stdSubAtom"
import { addStudent, getAllStudents } from "../../backend/handleStudent"
import { getAllStdSub } from "../../backend/subjectStdHandle"
import { motion } from 'framer-motion'
import { FaUserPlus } from 'react-icons/fa'

export default function AddStudent() {
  const [name, setName] = useState("")
  const [parentName, setParentName] = useState("")
  const [parentMobileNo, setParentMobileNo] = useState("")
  const [grNo, setGrNo] = useState("")
  const [password, setPassword] = useState("")
  const [standardId, setStandardId] = useState("")

  const [students, setStudents] = useRecoilState(studentsAtom)
  const [standard, setStandard] = useRecoilState(stdSubAtom)

  async function fetchStandardsSub() {
    if (standard.length === 0) {
      const data = await getAllStdSub()
      setStandard(data)
    }
  }

  useEffect(() => {
    fetchStandardsSub()
  }, [standard])

  const handleAddStudent = async () => {
    if (name && parentName && parentMobileNo && grNo && password && standardId) {
      await addStudent(name, parentName, parentMobileNo, grNo, password, standardId)
      const updatedStudents = await getAllStudents()
      setStudents(updatedStudents)
      setName("")
      setParentName("")
      setParentMobileNo("")
      setGrNo("")
      setPassword("")
      setStandardId("")
    }
    fetchStandardsSub()
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-6 rounded-lg shadow-md"
    >
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
        <FaUserPlus className="mr-2" />
        Add Student
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Student Name</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>
        <div>
          <label htmlFor="parentName" className="block text-sm font-medium text-gray-700 mb-1">Parent Name</label>
          <input
            id="parentName"
            type="text"
            value={parentName}
            onChange={(e) => setParentName(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>
        <div>
          <label htmlFor="parentMobileNo" className="block text-sm font-medium text-gray-700 mb-1">Parent Mobile No.</label>
          <input
            id="parentMobileNo"
            type="text"
            value={parentMobileNo}
            onChange={(e) => setParentMobileNo(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>
        <div>
          <label htmlFor="grNo" className="block text-sm font-medium text-gray-700 mb-1">GR No.</label>
          <input
            id="grNo"
            type="text"
            value={grNo}
            onChange={(e) => setGrNo(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>
        <div>
          <label htmlFor="standard" className="block text-sm font-medium text-gray-700 mb-1">Select Standard</label>
          <select
            id="standard"
            value={standardId}
            onChange={(e) => setStandardId(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          >
            <option value="">Select Standard</option>
            {standard.map((std: any) => (
              <option key={std.id} value={std.id}>{std.standard}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="mt-6">
        <button
          onClick={handleAddStudent}
          className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition duration-200 flex items-center justify-center"
        >
          <FaUserPlus className="mr-2" />
          Add Student
        </button>
      </div>
    </motion.div>
  )
}