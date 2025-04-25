'use client'

import { useState } from 'react'
import { useRecoilState } from 'recoil'
import { motion } from 'framer-motion'
import { teachersAtom } from '../../state/teachersAtom'
import { FaPlus, FaTrash, FaUserTie } from 'react-icons/fa'
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
    if (!name.trim()) {
      toast.error("Teacher name is required")
      return
    }
    if (!mobileNo.trim() || !/^\d{10}$/.test(mobileNo)) {
      toast.error("Valid mobile number is required")
      return
    }
    if (!grNo.trim()) {
      toast.error("GR Number is required")
      return
    }
    if (!password.trim()) {
      toast.error("Password is required")
      return
    }

    setIsLoading(true)
    try {
      const res = await axios.post(`${BACKEND_URL}/teacher/add`, {
        name,
        mobileNo,
        grNo,
        password
      },
      { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
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

  const getAllTeachers = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/teacher/all`, 
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      )
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
      const res = await axios.delete(`${BACKEND_URL}/teacher/delete/${teacherId}`,
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      )
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
    setTeachers(updatedTeachers)
    setCurrentPage(1)
    setIsLoading(false)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  return (
    <div className="min-h-screen px-4">
      {isLoading && <Loading />}
      {isConformDelete && (
      <ConformDeletePopUp
        handleClose={() => setIsConformDelete(false)}
        handleConfirm={() => handleDeleteTeacher(deleteData.id)}
        show={isConformDelete}
      />
      )}

      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-8 flex items-center">
            <FaUserTie className="mr-3 text-indigo-600" />
            Add New Teacher
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-semibold text-gray-700">Teacher Name</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter teacher's full name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="mobileNo" className="block text-sm font-semibold text-gray-700">Mobile Number</label>
              <input
                id="mobileNo"
                type="tel"
                value={mobileNo}
                onChange={(e) => setMobileNo(e.target.value)}
                placeholder="Enter 10-digit mobile number"
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
            
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                required
              />
            </div>
          </div>
          
          <motion.div 
            className="mt-8"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
          >
            <button
              onClick={handleAddTeacher}
              disabled={isLoading}
              className="w-full px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all shadow-md"
            >
              <div className="flex items-center justify-center">
                <FaPlus className="mr-2" />
                {isLoading ? "Processing..." : "Add Teacher"}
              </div>
            </button>
          </motion.div>
        </motion.div>
        
        <div className="bg-white rounded-lg shadow-lg p-6 border border-indigo-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center border-b pb-4">
            <FaUserTie className="text-indigo-600 mr-3" />
            Teacher Management
          </h2>
          
          {currentTeachers.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <p className="text-gray-500">No teachers available. Add teachers to see them here.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr>
                    <th className="px-4 py-3">Sr No</th>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Mobile No</th>
                    <th className="px-4 py-3">GR No</th>
                    <th className="px-4 py-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {currentTeachers.map((teacher: any, index: number) => (
                    <tr key={teacher.id} className="bg-white border-b hover:bg-gray-50">
                      <td className="px-4 py-3">{indexOfFirstTeacher + index + 1}</td>
                      <td className="px-4 py-3 font-medium">{teacher.name}</td>
                      <td className="px-4 py-3">{teacher.mobileNo}</td>
                      <td className="px-4 py-3">{teacher.grNo}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => {
                            setIsConformDelete(true);
                            setDeleteData({ id: teacher.id });
                          }}
                          className="p-2 text-red-500 bg-red-50 rounded-full hover:bg-red-100 transition-colors"
                          title="Delete Teacher"
                        >
                          <FaTrash size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              <div className="mt-6 flex justify-center space-x-3">
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index}
                    onClick={() => handlePageChange(index + 1)}
                    className={`px-4 py-2 border rounded-lg font-medium ${
                      currentPage === index + 1
                      ? "bg-indigo-600 text-white"
                      : "bg-white text-gray-800 hover:bg-gray-100"
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AddTeacher
