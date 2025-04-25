'use client'

import { useEffect, useState } from 'react'
import { useRecoilState } from 'recoil'
import { motion, AnimatePresence } from 'framer-motion'
import { stdSubAtom } from '../../state/stdSubAtom'
import { teachersAtom } from '../../state/teachersAtom'
import { FaPlus, FaTrash, FaPencilAlt, FaSave, FaTimes, FaGraduationCap, FaChalkboardTeacher } from 'react-icons/fa'
import axios from 'axios'
import { BACKEND_URL } from '../../config'
import { toast } from 'react-toastify'
import Loading from '../../components/Loading'
import ConformDeletePopUp from '../../components/conformation/ConformDeletePopUp'

export default function SubjectStandardPage() {
  const [stdSubState, setStdSubState] = useRecoilState<any>(stdSubAtom)
  const [teachers, setTeachers] = useRecoilState(teachersAtom)
  const [isLoading, setIsLoading] = useState(false)

  const [addStdText, setAddStdText] = useState('')
  const [addSubjTexts, setAddSubjTexts] = useState<any>({})

  const [isEditStdName, setIsEditStdName] = useState(false)
  const [editStdName, setEditStdName] = useState('')
  const [editStdId, setEditStdId] = useState('')

  const [isConformDelete, setIsConformDelete] = useState(false)
  const [deleteData, setDeleteData] = useState<any>({})

  useEffect(() => {
    setUp()
  }, [])

  async function setUp() {
    setIsLoading(true)
    try {
      const res = await axios.get(`${BACKEND_URL}/subject-standard/all`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
      if (res.data) {
        setStdSubState(res.data)
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to fetch standards and subjects')
    }

    try {
      const res = await axios.get(`${BACKEND_URL}/teacher/all`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
      if (res.data) {
        setTeachers(res.data)
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to fetch teachers')
    }
    setIsLoading(false)
  }

  async function handleAddStandard() {
    if (!addStdText.trim()) {
      toast.error('Standard name cannot be empty')
      return
    }
    setIsLoading(true)
    try {
      const res = await axios.post(
        `${BACKEND_URL}/subject-standard/add`,
        { name: addStdText.trim() },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      )
      if (res.status === 200) {
        toast.success(res.data.message)
        setAddStdText('')
        setUp()
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to add standard')
    } finally {
      setIsLoading(false)
    }
  }

  async function handleUpdateStandardName(standardId: string) {
    if (!editStdName.trim()) {
      toast.error('Standard name cannot be empty')
      return
    }
    setIsLoading(true)
    try {
      const res = await axios.put(
        `${BACKEND_URL}/subject-standard/update-name/${standardId}`,
        { newName: editStdName.trim() },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      )
      if (res.status === 200) {
        toast.success(res.data.message)
        setEditStdName('')
        setIsEditStdName(false)
        setUp()
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update standard name')
    } finally {
      setIsLoading(false)
    }
  }

  async function handleDeleteStandard(standardId: string) {
    if (!window.confirm('Are you sure you want to delete this standard?')) {
      return
    }
    setIsLoading(true)
    try {
      const res = await axios.delete(`${BACKEND_URL}/subject-standard/delete/${standardId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
      if (res.status === 200) {
        toast.success(res.data.message)
        setUp()
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete standard')
    } finally {
      setIsLoading(false)
    }
  }

  async function handleAddStandardSubjects(standardId: string) {
    if (!addSubjTexts[standardId]?.trim()) {
      toast.error('Subject names cannot be empty')
      return
    }
    const newSubjects = addSubjTexts[standardId]
      .split(',')
      .map((name: string) => ({ name: name.trim() }))
    setIsLoading(true)
    try {
      const res = await axios.post(
        `${BACKEND_URL}/subject-standard/add-subjects`,
        { standardId: standardId, newSubjects: newSubjects },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      )
      if (res.status === 200) {
        toast.success(res.data.message)
        setAddSubjTexts((prev: any) => ({ ...prev, [standardId]: '' }))
        setUp()
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to add subjects')
    } finally {
      setIsLoading(false)
    }
  }

  async function handleDeleteSubject(standardId: string, subjectName: string) {
    if (!window.confirm(`Are you sure you want to delete the subject "${subjectName}"?`)) {
      return
    }
    setIsLoading(true)
    try {
      const res = await axios.put(
        `${BACKEND_URL}/subject-standard/remove-subject`,
        { standardId: standardId, subjectName: subjectName },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      )
      if (res.status === 200) {
        toast.success(res.data.message)
        setUp()
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete subject')
    } finally {
      setIsLoading(false)
    }
  }

  async function handleDeleteTeacherFromSubject(standardId: string, subjectName: string, teacherId: string) {
    if (!window.confirm('Are you sure you want to remove this teacher from the subject?')) {
      return
    }
    setIsLoading(true)
    try {
      const res = await axios.put(
        `${BACKEND_URL}/subject-standard/std/sub/remove-teacher`,
        { standardId: standardId, subjectName: subjectName, teacherId: teacherId },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      )
      if (res.status === 200) {
        setIsConformDelete(false)
        toast.success(res.data.message)
        setUp()
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to remove teacher from subject')
    } finally {
      setIsLoading(false)
    }
  }



  return (
    <div className="min-h-screen ">
      {isLoading && <Loading />}

      {isConformDelete && (
        <ConformDeletePopUp
          show={isConformDelete}
          handleClose={() => setIsConformDelete(false)}
          handleConfirm={() => handleDeleteTeacherFromSubject(
            deleteData.standardId,
            deleteData.subjectName,
            deleteData.teacherId
          )}
        />
      )}

          <header className="bg-white shadow-md rounded-lg px-6 py-5 mb-8 border-l-4 border-indigo-600">
            <div className="flex items-center">
              <FaGraduationCap className="text-3xl text-indigo-600 mr-4" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Standards & Subjects Management</h1>
                <p className="text-gray-600 mt-1">Manage standards, subjects, and assign teachers</p>
              </div>
            </div>
          </header>
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Add New Standard</h2>
            <div className="flex space-x-2">
              <input
                type="text"
                className="flex-grow px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter standard name"
                value={addStdText}
                onChange={(e) => setAddStdText(e.target.value)}
              />
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 flex items-center"
                onClick={handleAddStandard}
              >
                <FaPlus className="mr-2" size={14} />
                Add
              </button>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AnimatePresence>
            {stdSubState && stdSubState.map((standard: any) => (
              <motion.div
                key={standard.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
              >
                {isEditStdName && standard.id === editStdId ? (
                  <div className="flex items-center space-x-2 mb-4">
                    <input
                      type="text"
                      className="flex-grow px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={editStdName}
                      onChange={(e) => setEditStdName(e.target.value)}
                    />
                    <button
                      className="p-2 text-green-500 hover:text-green-600 transition-colors"
                      onClick={() => handleUpdateStandardName(standard.id)}
                      title="Save"
                    >
                      <FaSave size={18} />
                    </button>
                    <button
                      className="p-2 text-red-500 hover:text-red-600 transition-colors"
                      onClick={() => setIsEditStdName(false)}
                      title="Cancel"
                    >
                      <FaTimes size={18} />
                    </button>
                  </div>
                ) : (
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold text-gray-800">
                      {standard.standard}
                    </h3>
                    <div className="space-x-1">
                      <button
                        className="p-2 text-blue-500 hover:text-blue-600 transition-colors"
                        onClick={() => {
                          setIsEditStdName(true)
                          setEditStdName(standard.standard)
                          setEditStdId(standard.id)
                        }}
                        title="Edit Standard"
                      >
                        <FaPencilAlt size={16} />
                      </button>
                      <button
                        className="p-2 text-red-500 hover:text-red-600 transition-colors"
                        onClick={() => handleDeleteStandard(standard.id)}
                        title="Delete Standard"
                      >
                        <FaTrash size={16} />
                      </button>
                    </div>
                  </div>
                )}

                <div className="mb-5 p-4 bg-gray-50 rounded-lg">
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                    placeholder="Add subjects (comma-separated)"
                    value={addSubjTexts[standard.id] || ''}
                    onChange={(e) =>
                      setAddSubjTexts((prev: any) => ({ ...prev, [standard.id]: e.target.value }))
                    }
                  />
                  <button
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 flex items-center justify-center"
                    onClick={() => handleAddStandardSubjects(standard.id)}
                  >
                    <FaPlus className="mr-2" size={14} />
                    Add Subjects
                  </button>
                </div>

                <div className="mb-4 flex items-center">
                  <div className="p-2 bg-blue-50 rounded-full mr-3">
                    <FaGraduationCap className="text-blue-500" size={18} />
                  </div>
                  <div>
                    <span className="text-sm text-gray-500 font-medium">Class Teacher</span>
                    <p className="font-medium">
                      {standard.classTeacherId ? (
                        <span className="text-blue-600">
                          {teachers.find((teacher: any) => teacher.id === standard.classTeacherId)?.name}
                        </span>
                      ) : (
                        <span className="text-red-500">Not Assigned</span>
                      )}
                    </p>
                  </div>
                </div>

                <h4 className="font-medium text-gray-700 mb-2">Subjects</h4>
                <div className="space-y-2">
                  {standard.subjects.map((subject: any) => (
                    <motion.div
                      key={subject.name}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="flex justify-between items-center bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center mb-1">
                          <FaChalkboardTeacher className="text-gray-500 mr-2" size={16} />
                          <span className="font-medium text-gray-800">{subject.name}</span>
                        </div>
                        <div className="text-sm pl-6">
                          {subject.teacherIds?.length ? (
                            <div className="flex flex-wrap gap-1">
                              {subject.teacherIds.map((id: string) => (
                                <span
                                  key={id}
                                  className="inline-flex items-center bg-blue-50 text-blue-600 px-2 py-1 rounded-full text-xs font-medium hover:bg-red-50 hover:text-red-500 cursor-pointer transition-colors"
                                  onClick={() => {
                                    setIsConformDelete(true)
                                    setDeleteData({ standardId: standard.id, subjectName: subject.name, teacherId: id })
                                  }}
                                  title="Click to remove teacher"
                                >
                                  {teachers.find((teacher: any) => teacher.id === id)?.name}
                                  <FaTimes className="ml-1" size={10} />
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-red-500 text-xs">No teachers assigned</span>
                          )}
                        </div>
                      </div>
                      <button
                        className="p-2 text-red-400 hover:text-red-600 transition-colors ml-2"
                        onClick={() => handleDeleteSubject(standard.id, subject.name)}
                        title="Delete Subject"
                      >
                        <FaTrash size={14} />
                      </button>
                    </motion.div>
                  ))}
                  {standard.subjects.length === 0 && (
                    <div className="text-center py-4 text-gray-500 italic text-sm">
                      No subjects added yet
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </main>
    </div>
  )
}