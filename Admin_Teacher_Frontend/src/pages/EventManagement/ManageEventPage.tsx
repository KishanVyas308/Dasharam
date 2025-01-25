import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import axios from 'axios'
import { BACKEND_URL } from '../../config'
import Loading from '../../components/Loading'
import { toast } from 'react-toastify'
import ConformDeletePopUp from '../../components/conformation/ConformDeletePopUp'
import { FaPlus, FaTrash } from 'react-icons/fa'

const ManageEventPage = () => {
    const [name, setName] = useState("")
    const [date, setDate] = useState("")
    const [detail, setDetail] = useState("")
    const [events, setEvents] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [isConformDelete, setIsConformDelete] = useState(false)
    const [deleteData, setDeleteData] = useState<any>({})



    useEffect(() => {
     
       
        
        fetchEvents()
        setDate(new Date().toISOString().split('T')[0])
    }, [])



    const fetchEvents = async () => {
        setIsLoading(true)
        try {
            const res = await axios.get(`${BACKEND_URL}/events/get`,{ headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
            if (res.status === 200) {
                const sortedEvents = res.data.sort((a: any, b: any) => {
                    return new Date(b.date).getTime() - new Date(a.date).getTime()
                })
                setEvents(sortedEvents)
            }
        } catch (error: any) {
            toast.error("Failed to fetch events")
        }
        setIsLoading(false)
    }

    const handleAddEvent = async () => {
        if (name && date && detail) {
            setIsLoading(true)
            try {
                const res = await axios.post(`${BACKEND_URL}/events/add`, {
                    name,
                    date,
                    detail
                },{ headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            })
                if (res.status === 200) {
                    toast.success(res.data.message)
                    fetchEvents()
                }
            } catch (error: any) {
                toast.error(error.response.data.message)
            }
            setName("")
            setDate("")
            setDetail("")
            setIsLoading(false)
        }
    }

    const handleDeleteEvent = async (eventId: string) => {
        setIsLoading(true)
        try {
            const res = await axios.delete(`${BACKEND_URL}/events/${eventId}`,{ headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
            if (res.status === 200) {
                toast.success(res.data.message)
                fetchEvents()
            }
        } catch (error: any) {
            toast.error(error.response.data.message)
        }
        setIsConformDelete(false)
        setIsLoading(false)
    }

    return (
        <div>
            {isLoading && <Loading />}
            {isConformDelete && (
                <ConformDeletePopUp
                    handleClose={() => setIsConformDelete(false)}
                    handleConfirm={() => handleDeleteEvent(deleteData.id)}
                    show={isConformDelete}
                />
            )}

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-6 rounded-lg shadow-md mt-6 mx-auto max-w-3xl"
            >
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">Manage Events</h2>
                <div className="space-y-4">
                    <input
                        type="text"
                        placeholder="Event Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <input
                        type="date"
                        placeholder="Event Date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <textarea
                        placeholder="Event Details"
                        value={detail}
                        onChange={(e) => setDetail(e.target.value)}
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <button
                        onClick={handleAddEvent}
                        className="w-full px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition duration-200 flex items-center justify-center"
                    >
                        <FaPlus className="mr-2" />
                        Add Event
                    </button>
                </div>

                <div className="mt-8">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Event List</h3>
                    <ul className="space-y-2">
                        {events.map((event: any) => (
                            <li
                                key={event.id}
                                className="flex flex-col bg-gray-50 p-3 rounded-md"
                            >
                                <div className="flex justify-between items-center">
                                    <span>{event.name} - {event.date}</span>
                                    <button
                                        onClick={() => {
                                            setIsConformDelete(true)
                                            setDeleteData({ id: event.id })
                                        }}
                                        className="p-1 text-red-500 hover:text-red-600"
                                    >
                                        <FaTrash size={16} />
                                    </button>
                                </div>
                                <p className="mt-2 text-gray-600">{event.detail}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            </motion.div>
        </div>
    )
}

export default ManageEventPage