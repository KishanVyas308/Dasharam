'use client'

import { useEffect, useState } from "react"
import { useRecoilState } from "recoil"
import { studentsAtom } from "../../state/studentsAtom"
import { stdSubAtom } from "../../state/stdSubAtom"
// import { deleteStudent, getAllStudents } from "../../backend/handleStudent"
// import { getAllStdSub } from "../../backend/standardstdHandle"
import { motion, AnimatePresence } from 'framer-motion'
import { FaTrash, FaGraduationCap, FaChevronDown, FaChevronUp, FaEdit, FaTimes, FaSave } from 'react-icons/fa'
import axios from "axios"
import { BACKEND_URL } from "../../config"
import { toast } from "react-toastify"
import Loading from "../../components/Loading"

export default function ManageStudent() {
  const [students, setStudents] = useRecoilState<any>(studentsAtom)
  const [standards, setStandards] = useRecoilState(stdSubAtom)
  const [expandedStandard, setExpandedStandard] = useState<string | null>(null)

  const [isLoading, setIsLoading] = useState(false)
  // Edit modal states
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingStudent, setEditingStudent] = useState<any>(null)
  const [editForm, setEditForm] = useState({
    name: '',
    parentName: '',
    parentMobileNo: '',
    grno: '',
    standardId: ''
  })
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [isEditLoading, setIsEditLoading] = useState(false)

  async function fetchStudents() {
    if (students.length === 0) {
      setIsLoading(true)
      const data = await getAllStudents()
      setIsLoading(false)
      setStudents(data)
    }
    if (standards.length === 0) {
      setIsLoading(true)  
      const data = await getAllStdSub()
      setIsLoading(false)
      setStandards(data)
    }
  }

  const getAllStdSub = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/subject-standard/all`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
      if (res.status === 200) {

        return res.data
      }
    } catch (error: any) {

      toast.error("Failed to fetch updated standards list")
      return []
    }

  }

  const getAllStudents = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/student/all`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
      console.log("students", res.data);

      if (res.status === 200) {

        return res.data
      }
    } catch (error: any) {

      toast.error("Failed to fetch updated standards list")
      return []
    }

  }

  useEffect(() => {
    fetchStudents()
  }, [])

  const handleDeleteStudent = async (studentId: string, subjectId: string) => {
    setIsLoading(true)
    try {
      const res = await axios.delete(`${BACKEND_URL}/student/delete`, {
        data: {
          studentId,
          standardId: subjectId
        }
        , headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
      toast.success(res.data.message)
    } catch (error: any) {

      toast.error("Failed to delete student")

    }
    const updatedStudents = await getAllStudents()
    setStudents(updatedStudents)
    const updatedstandards = await getAllStdSub()
    setStandards(updatedstandards)
    setIsLoading(false)
  }
  const toggleExpandStandard = (standardId: string) => {
    setExpandedStandard((prev) => (prev === standardId ? null : standardId))
  }

  const handleEditStudent = (student: any, standardId: string) => {
    setEditingStudent({ ...student, currentStandardId: standardId })
    setEditForm({
      name: student.name || '',
      parentName: student.parentName || '',
      parentMobileNo: student.parentMobileNo || '',
      grno: student.grno || '',
      standardId: standardId
    })
    setShowEditModal(true)
  }

  const handleUpdateStudent = async () => {
    // Validation
    if (!editForm.name.trim()) {
      toast.error("Student name is required")
      return
    }
    if (!editForm.parentName.trim()) {
      toast.error("Parent name is required")
      return
    }
    if (!editForm.parentMobileNo.trim() || !/^\d{10}$/.test(editForm.parentMobileNo)) {
      toast.error("Valid parent mobile number is required")
      return
    }
    if (!editForm.grno.trim()) {
      toast.error("GR Number is required")
      return
    }

    // Check if GR number already exists (excluding current student)
    const grExists = students.some((student: any) =>
      student.grno === editForm.grno && student.id !== editingStudent.id
    )
    if (grExists) {
      toast.error("GR Number already exists")
      return
    }

        if (!editForm.standardId) {
      toast.error("Please select a standard/class")
      return
    }

    setShowConfirmDialog(true)
  }
  
  const confirmUpdate = async () => {
    setIsEditLoading(true)
    setShowConfirmDialog(false)

    console.log("Updating standardId:", editForm.standardId);
    console.log("Editing student:", editingStudent);


    try {
      const res = await axios.put(`${BACKEND_URL}/student/edit`, {
        studentId: editingStudent.id,
        name: editForm.name,
        parentName: editForm.parentName,
        parentMobileNo: editForm.parentMobileNo,
        grno: editForm.grno,
        oldStandardId: editingStudent.currentStandardId,
        newStandardId: editForm.standardId
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })

      toast.success(res.data.message)

      // Refresh data
      const updatedStudents = await getAllStudents()
      setStudents(updatedStudents)
      const updatedStandards = await getAllStdSub()
      setStandards(updatedStandards)

      setShowEditModal(false)
      setEditingStudent(null)
      setEditForm({
        name: '',
        parentName: '',
        parentMobileNo: '',
        grno: '',
        standardId: ''
      })
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update student")
    }

    setIsEditLoading(false)
  }

  return (
    <div className="container mx-auto">
      {isLoading && <Loading />}

      <div className="bg-white rounded-lg shadow-lg p-6 mb-8 border border-indigo-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center border-b pb-4">
          <FaGraduationCap className="text-indigo-600 mr-3" />
          Student Management Dashboard
        </h2>

        {standards.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No classes available. Add classes to view students.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {standards.map((subject: any) => (
              <div key={subject.id} className="border rounded-lg overflow-hidden">
                <div
                  className={`cursor-pointer flex justify-between items-center p-4 transition-all duration-300 ${expandedStandard === subject.id
                    ? "bg-indigo-50 border-b"
                    : "bg-gray-50 hover:bg-gray-100"
                    }`}
                  onClick={() => toggleExpandStandard(subject.id)}
                >
                  <div className="flex items-center">
                    <span className="text-lg font-medium text-gray-800">{subject.standard}</span>
                    <span className="ml-3 bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      {subject.students.length} students
                    </span>
                  </div>
                  <div className="text-indigo-600">
                    {expandedStandard === subject.id ? <FaChevronUp /> : <FaChevronDown />}
                  </div>
                </div>

                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={expandedStandard === subject.id
                    ? { height: "auto", opacity: 1 }
                    : { height: 0, opacity: 0 }
                  }
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  {expandedStandard === subject.id && (
                    <div className="p-4">
                      {subject.students.length === 0 ? (
                        <p className="text-center text-gray-500 py-4">No students in this class</p>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm text-left">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                              <tr>
                                <th className="px-4 py-3">Sr No</th>
                                <th className="px-4 py-3">Name</th>
                                <th className="px-4 py-3">GR No</th>
                                <th className="px-4 py-3">Parent Mobile</th>
                                <th className="px-4 py-3">Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {subject.students.map((id: any, index: number) => {
                                const student = students.find((student: any) => student.id === id)
                                return (
                                  <tr key={id} className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-4 py-3">{index + 1}</td>
                                    <td className="px-4 py-3 font-medium">{student?.name || "Unknown"}</td>
                                    <td className="px-4 py-3">{student?.grno || "N/A"}</td>
                                    <td className="px-4 py-3">{student?.parentMobileNo || "N/A"}</td>                                    <td className="px-4 py-3">
                                      <div className="flex items-center space-x-2">
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleEditStudent(student, subject.id);
                                          }}
                                          className="p-2 text-blue-500 bg-blue-50 rounded-full hover:bg-blue-100 transition-colors"
                                          title="Edit Student"
                                        >
                                          <FaEdit size={14} />
                                        </button>

                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            if (window.confirm('Are you sure you want to delete this student?')) {
                                              handleDeleteStudent(id, subject.id);
                                            }
                                          }}
                                          className="p-2 text-red-500 bg-red-50 rounded-full hover:bg-red-100 transition-colors"
                                          title="Delete Student"
                                        >
                                          <FaTrash size={14} />
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                )
                              })}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              </div>
            ))}
          </div>)}
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {showEditModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setShowEditModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-lg p-6 w-full max-w-md mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Edit Student</h3>                <button
                  onClick={() => setShowEditModal(false)}
                  disabled={isEditLoading}
                  className="text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaTimes size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Student Name
                  </label>                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    disabled={isEditLoading}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="Enter student name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Parent Name
                  </label>                  <input
                    type="text"
                    value={editForm.parentName}
                    onChange={(e) => setEditForm({ ...editForm, parentName: e.target.value })}
                    disabled={isEditLoading}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="Enter parent name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Parent Mobile Number
                  </label>                  <input
                    type="tel"
                    value={editForm.parentMobileNo}
                    onChange={(e) => setEditForm({ ...editForm, parentMobileNo: e.target.value })}
                    disabled={isEditLoading}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="Enter 10-digit mobile number"
                    maxLength={10}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    GR Number
                  </label>                  <input
                    type="text"
                    value={editForm.grno}
                    onChange={(e) => setEditForm({ ...editForm, grno: e.target.value })}
                    disabled={isEditLoading}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="Enter GR number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Class/Standard
                  </label>                  <select
                    value={editForm.standardId}
                    onChange={(e) => {
                      setEditForm({ ...editForm, standardId: e.target.value });
                      console.log("Selected standardId:", e.target.value);
                    }}
                    disabled={isEditLoading}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    <option value="">Select a class</option>
                    {standards.map((standard: any) => (
                      <option key={standard.id} value={standard.id}>
                        {standard.standard}
                      </option>
                    ))}
                  </select>
                </div>
              </div>              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowEditModal(false)}
                  disabled={isEditLoading}
                  className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateStudent}
                  disabled={isEditLoading}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isEditLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Updating...
                    </>
                  ) : (
                    <>
                      <FaSave className="mr-2" size={14} />
                      Update Student
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirmation Dialog */}
      <AnimatePresence>
        {showConfirmDialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-lg p-6 w-full max-w-sm mx-4"
            >
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Confirm Update
                </h3>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to update this student's information?
                </p>                <div className="flex justify-center space-x-3">
                  <button
                    onClick={() => setShowConfirmDialog(false)}
                    disabled={isEditLoading}
                    className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmUpdate}
                    disabled={isEditLoading}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isEditLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Updating...
                      </>
                    ) : (
                      'Confirm'
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}



