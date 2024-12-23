'use client'

import { useState } from 'react'
import { useRecoilState } from 'recoil'
import { motion } from 'framer-motion'
import { teachersAtom } from '../../state/teachersAtom'
import { FaPlus, FaTrash } from 'react-icons/fa'
import axios from 'axios'
import { BACKEND_URL } from '../../config'
import Loading from '../../components/Loading'
import { toast } from 'react-toastify'
import ConformDeletePopUp from '../../components/conformation/ConformDeletePopUp'

const AddTeacher = () => {
  const [name, setName] = useState("")
  const [mobileNo, setMobileNo] = useState("")
  const [grNo, setGrNo] = useState("")
  const [password, setPassword] = useState("")
  const [teachers, setTeachers] = useRecoilState(teachersAtom)
  const [isLoading, setIsLoading] = useState(false)

  const [isConformDelete, setIsConformDelete] = useState(false)
  const [deleteData, setDeleteData] = useState<any>({})

  const [currentPage, setCurrentPage] = useState(1)
  const teachersPerPage = 5

  const indexOfLastTeacher = currentPage * teachersPerPage
  const indexOfFirstTeacher = indexOfLastTeacher - teachersPerPage
  const currentTeachers = teachers.slice(indexOfFirstTeacher, indexOfLastTeacher)
  const totalPages = Math.ceil(teachers.length / teachersPerPage)

  const handleAddTeacher = async () => {
 
    if (name && mobileNo && grNo && password) {
      setIsLoading(true)
      try {
        const res = await axios.post(`${BACKEND_URL}/teacher/add`, {
          name,
          mobileNo,
          grNo,
          password
        })
        if (res.status === 200) {
          toast.success(res.data.message)
          const updatedTeachers = await getAllTeachers()
          setTeachers(updatedTeachers)
        }
      } catch (error : any) {
        setIsLoading(false)
        toast.error(error.response.data.message)
      }
     
     
      setName("")
      setMobileNo("")
      setGrNo("")
      setPassword("")
      setCurrentPage(1)
      setIsLoading(false)
    }
  }

  const getAllTeachers = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/teacher/all`)
      if (res.status === 200) {
        return res.data

      }
      setIsLoading(false)
    } catch (error: any) {
      setIsLoading(false)
      toast.error("Failed to fetch updated teachers list")
      return []
    }
  }

  const handleDeleteTeacher = async (teacherId: string) => {
    setIsLoading(true)
    try {
      const res = await axios.delete(`${BACKEND_URL}/teacher/delete/${teacherId}`)
      if (res.status === 200) {
      toast.success(res.data.message)
      setIsConformDelete(false)
    }
  } catch (error: any) {
    setIsLoading(false)
    toast.error(error.response.data.message)
    setIsConformDelete(false)
  }
  const updatedTeachers = await getAllTeachers()
    console.log(updatedTeachers);
    
    setTeachers(updatedTeachers)
    setCurrentPage(1)
    setIsLoading(false)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  return (
    <div>
      {/* Navbar */}
      {
        isLoading && <Loading />
      }
      {
        isConformDelete &&  <ConformDeletePopUp handleClose={() => setIsConformDelete(false)} handleConfirm={() => handleDeleteTeacher(deleteData.id)} show={isConformDelete} />
      }

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
                  onClick={() => {
                    setIsConformDelete(true)
                    setDeleteData({id : teacher.id})
                  }}
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
