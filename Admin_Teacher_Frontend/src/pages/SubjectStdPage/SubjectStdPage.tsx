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
  const [isLoading , setIsLoading] = useState(false)

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
    // const allStdSub = await getAllStdSub()
    setIsLoading(true)
    try {
      // returns all standards and subjects
      const res = await axios.get(`${BACKEND_URL}/subject-standard/all`,
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      )
      if (res.data) {
        
      setStdSubState(res.data)
      }
    } catch (error: any) {
      toast.error(error.response.data.message)
      setIsLoading(false)
      return
    }

    try {
      // returns all teachers
      const res = await axios.get(`${BACKEND_URL}/teacher/all`,
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      )
      if (res.data) {
      setTeachers(res.data)
      }
    } catch (error: any) {
      toast.error(error.response.data.message)
      setIsLoading(false)
      return
    }
    setIsLoading(false)
  }

  async function handleAddStandard() {
    if (addStdText.trim()) {
      // add a new standard
      setIsLoading(true)
      try {
        const res = await axios.post(`${BACKEND_URL}/subject-standard/add`, { name: addStdText.trim() } ,{ headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
        // const success = await addStandard(addStdText)
        if(res.status === 200){
          toast.success(res.data.message)
          setAddStdText('')
          setUp()
        }
      } catch (error: any) {
        toast.error(error.response.data.message)
        setIsLoading(false)
      }
    }
  }
  async function handleUpdateStandardName(standardId: string) {
    if (editStdName.trim()) {
      setIsLoading(true)
      try {
        const res = await axios.put(`${BACKEND_URL}/subject-standard/update-name/${standardId}`, { newName: editStdName.trim() },{ headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
        if (res.status === 200) {
          toast.success(res.data.message)
          setEditStdName('')
          setIsEditStdName(false)
          setUp()
        }
      } catch (error: any) {
        toast.error(error.response.data.message)
        setIsLoading(false)
      }
    }
  }

  async function handleDeleteStandard(standardId: string) {
    setIsLoading(true)
    try {
      const res = await axios.delete(`${BACKEND_URL}/subject-standard/delete/${standardId}`,{ headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      if (res.status === 200) {
        toast.success(res.data.message)
        setUp()
      }
    } catch (error: any) {
      toast.error(error.response.data.message)
      setIsLoading(false)
    }
  }

  async function handleAddStandardSubjects(standardId: string) {
    if (addSubjTexts[standardId]?.trim()) {
      const newSubjects = addSubjTexts[standardId].split(',').map((name: string) => ({ 
      name: name.trim() }))
      setIsLoading(true)
      try {
        const res = await axios.post(`${BACKEND_URL}/subject-standard/add-subjects`, {standardId :  standardId , newSubjects: newSubjects },{ headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
        if (res.status === 200) {
          toast.success(res.data.message)
          setAddSubjTexts((prev: any) => ({ ...prev, [standardId]: '' }))
          setUp()
        }
      } catch (error: any) {
        toast.error(error.response.data.message)
        setIsLoading(false)
      }
    }
  }

  async function handleDeleteSubject(standardId: string, subjectName: string) {
    setIsLoading(true)
    try {
      const res = await axios.put(`${BACKEND_URL}/subject-standard/remove-subject`, {
       standardId: standardId, subjectName : subjectName 
      },{ headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      if (res.status === 200) {
        toast.success(res.data.message)
        setUp()
      }
    } catch (error: any) {
      toast.error(error.response.data.message)
      setIsLoading(false)
    }
  }

  async function handleDeleteTeacherFromSubject(standardId: string, subjectName: string, teacherId: string) {
    setIsLoading(true)
    try {
      const res = await axios.put(`${BACKEND_URL}/subject-standard/std/sub/remove-teacher`, {
        standardId: standardId, subjectName: subjectName, teacherId: teacherId
      },{ headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      if (res.status === 200) {
        setIsConformDelete(false)
        toast.success(res.data.message)
        setUp()
      }
    } catch (error: any) {
      toast.error(error.response.data.message)
      setIsConformDelete(false)
      setIsLoading(false)
    }
  }

 

  return (
    <div className="">
      {/* Sidebar */}
      {
        isLoading && <Loading/>
      }
      {
        isConformDelete && <ConformDeletePopUp show={isConformDelete} handleClose={() => setIsConformDelete(false)} handleConfirm={() => handleDeleteTeacherFromSubject(deleteData.standardId, deleteData.subjectName, deleteData.teacherId)} />
      }
      
   

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
     

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-6 rounded-lg shadow-md mb-6"
            >
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Add a New Standard</h2>
              <div className="flex space-x-2">
                <input
                  type="text"
                  className="flex-grow px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter standard name"
                  value={addStdText}
                  onChange={(e) => setAddStdText(e.target.value)}
                />
                <button
                  className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition duration-200"
                  onClick={handleAddStandard}
                >
                  <FaPlus className="inline-block mr-2" />
                  Add
                </button>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AnimatePresence>
                {stdSubState && stdSubState.map((standard: any) => (
                  <motion.div
                    key={standard.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="bg-white p-6 rounded-lg shadow-md"
                  >
                    {isEditStdName && standard.id === editStdId ? (
                      <div className="flex items-center space-x-2 mb-4">
                        <input
                          type="text"
                          className="flex-grow px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          value={editStdName}
                          onChange={(e) => setEditStdName(e.target.value)}
                        />
                        <button
                          className="p-2 text-green-500 hover:text-green-600"
                          onClick={() => handleUpdateStandardName(standard.id)}
                        >
                          <FaSave size={20} />
                        </button>
                        <button
                          className="p-2 text-red-500 hover:text-red-600"
                          onClick={() => setIsEditStdName(false)}
                        >
                          <FaTimes size={20} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-semibold text-gray-800">{standard.standard}</h3>
                        <div className="space-x-2">
                          <button
                            className="p-2 text-indigo-500 hover:text-indigo-600"
                            onClick={() => {
                              setIsEditStdName(true)
                              setEditStdName(standard.standard)
                              setEditStdId(standard.id)
                            }}
                          >
                            <FaPencilAlt size={16} />
                          </button>
                          <button
                            className="p-2 text-red-500 hover:text-red-600"
                            onClick={() => handleDeleteStandard(standard.id)}
                          >
                            <FaTrash size={16} />
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="mb-4">
                      <input
                        type="text"
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Add subjects (comma-separated)"
                        value={addSubjTexts[standard.id] || ''}
                        onChange={(e) =>
                          setAddSubjTexts((prev: any) => ({ ...prev, [standard.id]: e.target.value }))
                        }
                      />
                      <button
                        className="mt-2 px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition duration-200"
                        onClick={() => handleAddStandardSubjects(standard.id)}
                      >
                        Add Subjects
                      </button>
                    </div>

                    <div className="mb-4">
                      <p className="text-gray-600">
                        <FaGraduationCap className="inline-block mr-2" />
                        Class Teacher:{' '}
                        {standard.classTeacherId ? (
                          <span className="text-indigo-500 font-semibold">
                            {teachers.find((teacher: any) => teacher.id === standard.classTeacherId)?.name}
                          </span>
                        ) : (
                          <span className="text-red-500 font-semibold">Not Assigned</span>
                        )}
                      </p>
                    </div>

                    <div className="space-y-2">
                      {standard.subjects.map((subject: any) => (
                        <motion.div
                          key={subject.name}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          className="flex justify-between items-center bg-gray-100 p-2 rounded-md bg-opacity-50"
                        >
                          <div>
                            <FaChalkboardTeacher className="inline-block mr-2 text-gray-600" />
                            <span className="font-medium">{subject.name}</span> -{' '}
                            {subject.teacherIds?.length ? (
                              subject.teacherIds.map((id: string) => (
                                <div key={id} className="inline-block" onClick={() => {
                                  setIsConformDelete(true)
                                  setDeleteData({ standardId: standard.id, subjectName: subject.name, teacherId: id })
                                }}>
                                  <span className="text-indigo-500 font-semibold hover:text-red-500 cursor-pointer transition-colors duration-100">
                                  {teachers.find((teacher: any) => teacher.id === id)?.name}
                                  </span>
                                  
                                  {', '}
                                </div>
                              ))
                            ) : (
                              <span className="text-red-500 font-semibold">Not Assigned</span>
                            )}
                          </div>
                          <button
                            className="p-1 text-red-500 hover:text-red-600"
                            onClick={() => handleDeleteSubject(standard.id, subject.name)}
                          >
                            <FaTrash size={14} />
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}