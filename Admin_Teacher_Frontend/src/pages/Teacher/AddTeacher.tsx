'use client'

import React, { useState } from 'react'
import { useRecoilState } from 'recoil'
import { motion } from 'framer-motion'
import { teachersAtom } from '../../state/teachersAtom'
import { addTeacher, deleteTeacher, getAllTeachers } from '../../backend/handleTeacher'
import { FaPlus, FaTrash } from 'react-icons/fa'

const AddTeacher = () => {
  const [name, setName] = useState("")
  const [mobileNo, setMobileNo] = useState("")
  const [grNo, setGrNo] = useState("")
  const [password, setPassword] = useState("")
  const [teachers, setTeachers] = useRecoilState(teachersAtom)

  const [currentPage, setCurrentPage] = useState(1)
  const teachersPerPage = 5

  const indexOfLastTeacher = currentPage * teachersPerPage
  const indexOfFirstTeacher = indexOfLastTeacher - teachersPerPage
  const currentTeachers = teachers.slice(indexOfFirstTeacher, indexOfLastTeacher)
  const totalPages = Math.ceil(teachers.length / teachersPerPage)

  const handleAddTeacher = async () => {
    if (name && mobileNo && grNo && password) {
      await addTeacher(name, mobileNo, grNo, password)
      const updatedTeachers = await getAllTeachers()
      setTeachers(updatedTeachers)
      setName("")
      setMobileNo("")
      setGrNo("")
      setPassword("")
      setCurrentPage(1)
    }
  }

  const handleDeleteTeacher = async (teacherId: string) => {
    await deleteTeacher(teacherId)
    const updatedTeachers = await getAllTeachers()
    setTeachers(updatedTeachers)
    setCurrentPage(1)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  return (
    <div>
      {/* Navbar */}
  

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-6 rounded-lg shadow-md mt-6 mx-auto max-w-3xl"
      >
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Add Teacher</h2>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Teacher Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="text"
            placeholder="Mobile Number"
            value={mobileNo}
            onChange={(e) => setMobileNo(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="text"
            placeholder="GR Number"
            value={grNo}
            onChange={(e) => setGrNo(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={handleAddTeacher}
            className="w-full px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition duration-200 flex items-center justify-center"
          >
            <FaPlus className="mr-2" />
            Add Teacher
          </button>
        </div>

        <div className="mt-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Teacher List</h3>
          <ul className="space-y-2">
            {currentTeachers.map((teacher: any) => (
              <li
                key={teacher.id}
                className="flex justify-between items-center bg-gray-50 p-3 rounded-md"
              >
                <span>{teacher.name} - {teacher.mobileNo}</span>
                <button
                  onClick={() => handleDeleteTeacher(teacher.id)}
                  className="p-1 text-red-500 hover:text-red-600"
                >
                  <FaTrash size={16} />
                </button>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex justify-center space-x-2">
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                onClick={() => handlePageChange(index + 1)}
                className={`px-3 py-1 border rounded-md ${currentPage === index + 1
                  ? "bg-indigo-500 text-white"
                  : "bg-white text-gray-800 hover:bg-gray-100"
                  }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default AddTeacher
