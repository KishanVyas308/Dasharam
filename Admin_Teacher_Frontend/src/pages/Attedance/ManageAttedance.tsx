import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import { BACKEND_URL } from '../../config';
import { toast } from 'react-toastify';
import { useRecoilState } from 'recoil';
import { stdSubAtom } from '../../state/stdSubAtom';
import { studentsAtom } from '../../state/studentsAtom';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import 'jspdf-autotable';

const ManageAttendance: React.FC = () => {
    const [attedanceData, setAttedanceData] = useState<any>([]);
    const [selectedClass, setSelectedClass] = useState<string>('');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [stdSubState, setStdSubState] = useRecoilState<any>(stdSubAtom);
    const [students, setStudents] = useRecoilState<any>(studentsAtom);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [itemsPerPage, setItemsPerPage] = useState<number>(10);
    const [hasMoreData, setHasMoreData] = useState<boolean>(true);

    useEffect(() => {
        if (stdSubState.length === 0) setUp();
        if (students.length === 0) {
            fetchStudents();
        }
    }, []);

    async function fetchStudents() {
        if (students.length === 0) {
            setIsLoading(true);
            const data = await getAllStudents();
            setIsLoading(false);
            setStudents(data);
        }
    }

    const getAllStudents = async () => {
        try {
            const res = await axios.get(`${BACKEND_URL}/student/all`, { 
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            if (res.status === 200) {
                return res.data;
            }
        } catch (error: any) {
            toast.error("Failed to fetch students list", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
            });
            return [];
        }
    };

    async function setUp() {
        setIsLoading(true);
        try {
            const res = await axios.get(`${BACKEND_URL}/subject-standard/all`, { 
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            if (res.data) {
                setStdSubState(res.data);
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to fetch standards", {
                position: "top-right",
                autoClose: 3000,
            });
        } finally {
            setIsLoading(false);
        }
    }

    const fetchAttendance = async () => {
        if (!selectedClass || !dateRange[0] || !dateRange[1]) {
            toast.error('Please select class and date range', {
                position: "top-right",
                autoClose: 3000,
            });
            return;
        }

        setIsLoading(true);

        try {
            const res = await axios.post(`${BACKEND_URL}/attendance/get-for-selected-date`, {
                standardId: selectedClass,
                startDate: dateRange[0].toISOString().split('T')[0],
                endDate: dateRange[1].toISOString().split('T')[0],
            }, { 
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });

            if (res.status === 200) {
                setAttedanceData(res.data.data);
                // Check if we have data for the current date range
                setHasMoreData(res.data.data.length > 0);
                toast.success('Attendance fetched successfully', {
                    position: "top-right",
                    autoClose: 2000,
                });
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to fetch attendance', {
                position: "top-right",
                autoClose: 3000,
            });
        } finally {
            setIsLoading(false);
        }
    };

    // Function to continue iteration to the next date range
    const continueIteration = () => {
        if (!dateRange[0] || !dateRange[1]) return;
        
        // Calculate the next date range
        const daysDifference = Math.ceil(
            (dateRange[1]!.getTime() - dateRange[0]!.getTime()) / (1000 * 60 * 60 * 24)
        );
        
        const newStartDate = new Date(dateRange[1]!);
        newStartDate.setDate(newStartDate.getDate() + 1);
        
        const newEndDate = new Date(newStartDate);
        newEndDate.setDate(newEndDate.getDate() + daysDifference);
        
        // Update the date range
        setDateRange([newStartDate, newEndDate]);
        
        // Reset to first page when changing date range
        setCurrentPage(1);
    };

    // Effect to fetch attendance data when date range changes due to iteration
    useEffect(() => {
        if (dateRange[0] && dateRange[1] && selectedClass) {
            fetchAttendance();
        }
    }, [dateRange]);

    const generateDateRange = (startDate: Date, endDate: Date): string[] => {
        const dates: string[] = [];
        let currentDate = new Date(startDate);
        while (currentDate <= endDate) {
            dates.push(currentDate.toISOString().split('T')[0]);
            currentDate.setDate(currentDate.getDate() + 1);
        }
        return dates;
    };

    const getStudentNameById = (id: string) => {
        const student = students.find((student: any) => student.id === id);
        return student ? student.name : 'Unknown';
    };

    const dateHeaders =
        dateRange[0] && dateRange[1] ? generateDateRange(dateRange[0], dateRange[1]) : [];

    const allStudents = Array.from(
        new Set(attedanceData.flatMap((data: any) => data.students.map((student: any) => student.studentId)))
    );

    const filteredStudents = allStudents.filter((studentId: any) => {
        const studentName = getStudentNameById(studentId);
        return studentName.toLowerCase().includes(searchQuery.toLowerCase());
    });

    const getStudentGrNoById = (id: string) => {
        const student = students.find((student: any) => student.id === id);
        return student ? student.grno : 'Unknown';
    }

    const downloadExcel = () => {
        const data = filteredStudents.map((studentId: any, index) => {
            const row: any = {
                'Sr. No': index + 1,
                'Gr No': getStudentGrNoById(studentId),
                'Student Name': getStudentNameById(studentId),
            };
            dateHeaders.forEach((date) => {
                const attendanceData = attedanceData.find(
                    (data: any) => data.takenDate === date
                );
                const studentAttendance = attendanceData?.students.find(
                    (student: any) => student.studentId === studentId
                );
                row[date] = studentAttendance ? (studentAttendance.present ? 'P' : 'A') : '-';
            });
            return row;
        });

        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Attendance');
        XLSX.writeFile(workbook, 'attendance.xlsx');
    };

    const downloadPDF = () => {
        const doc = new jsPDF();
        const tableColumn = ['Sr. No', 'Gr No', 'Student Name', ...dateHeaders];
        const tableRows: any[] = [];

        filteredStudents.forEach((studentId: any, index) => {
            const rowData: any[] = [
                index + 1,
                getStudentGrNoById(studentId),
                getStudentNameById(studentId),
            ];
            dateHeaders.forEach((date) => {
                const attendanceData = attedanceData.find(
                    (data: any) => data.takenDate === date
                );
                const studentAttendance = attendanceData?.students.find(
                    (student: any) => student.studentId === studentId
                );
                rowData.push(studentAttendance ? (studentAttendance.present ? 'P' : 'A') : '-');
            });
            tableRows.push(rowData);
        });
        autoTable(doc, { head: [tableColumn], body: tableRows, startY: 20 });
       
        doc.text('Attendance Report', 14, 15);
        doc.save('attendance.pdf');
    };

    return (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-6">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">Attendance Records</h1>
                
                <div className="bg-gray-50 rounded-lg shadow-sm p-6 mb-6 border border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Select Class</label>
                            <select
                                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                                value={selectedClass}
                                onChange={(e) => setSelectedClass(e.target.value)}
                            >
                                <option value="">Select Class</option>
                                {stdSubState.map((standard: any) => (
                                    <option key={standard.id} value={standard.id}>
                                        {standard.standard}
                                    </option>
                                ))}
                            </select>
                        </div>
                        
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Select Date Range</label>
                            <DatePicker
                                selectsRange={true}
                                startDate={dateRange[0] || undefined}
                                endDate={dateRange[1] || undefined}
                                onChange={(update: [Date | null, Date | null]) => {
                                    setDateRange(update);
                                }}
                                isClearable={true}
                                placeholderText="Select date range"
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                            />
                        </div>
                        
                        <div className="flex items-end space-x-3">
                            <button
                                className={`flex-1 px-4 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                                    isLoading 
                                    ? 'bg-gray-400 cursor-not-allowed' 
                                    : 'bg-indigo-600 hover:bg-indigo-700 shadow-sm hover:shadow text-white'
                                }`}
                                onClick={fetchAttendance}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <span className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Loading...
                                    </span>
                                ) : 'Fetch Attendance'}
                            </button>
                            
                            <button
                                className={`flex-1 px-4 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                                    !hasMoreData || isLoading || !dateRange[0] || !dateRange[1]
                                    ? 'bg-gray-400 cursor-not-allowed text-white'
                                    : 'bg-emerald-600 hover:bg-emerald-700 shadow-sm hover:shadow text-white'
                                }`}
                                onClick={continueIteration}
                                disabled={!hasMoreData || isLoading || !dateRange[0] || !dateRange[1]}
                            >
                                Next Date Range
                            </button>
                        </div>
                    </div>
                </div>
                
                {attedanceData.length > 0 ? (
                    <div>
                        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-4">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search by student name..."
                                    className="pl-10 pr-4 py-2.5 w-full md:w-64 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            
                            <div className="flex space-x-3">
                                <button
                                    className="flex items-center px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-all duration-200 shadow-sm hover:shadow"
                                    onClick={downloadExcel}
                                >
                                    <svg className="w-5 h-5 mr-1.5" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                        <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2zm13-15v8h-2v-8h2zm-6 8v-4h2v4h-2zm-4 0v-8h2v8H7z"></path>
                                    </svg>
                                    Excel
                                </button>
                                <button
                                    className="flex items-center px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all duration-200 shadow-sm hover:shadow"
                                    onClick={downloadPDF}
                                >
                                    <svg className="w-5 h-5 mr-1.5" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                        <path d="M20 2H8a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2zm-8.5 12.5h-3a.5.5 0 0 1 0-1h3a.5.5 0 0 1 0 1zm0-3h-3a.5.5 0 0 1 0-1h3a.5.5 0 0 1 0 1zm0-3h-3a.5.5 0 0 1 0-1h3a.5.5 0 0 1 0 1zm8 4h-6a.5.5 0 0 1 0-1h6a.5.5 0 0 1 0 1zm0-3h-6a.5.5 0 0 1 0-1h6a.5.5 0 0 1 0 1zm0-3h-6a.5.5 0 0 1 0-1h6a.5.5 0 0 1 0 1z"></path>
                                    </svg>
                                    PDF
                                </button>
                            </div>
                        </div>
                        
                        <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gr. No</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                        {dateHeaders.map((date) => (
                                            <th key={date} className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                                                {new Date(date).toLocaleDateString('en-US', {
                                                    day: 'numeric',
                                                    month: 'short'
                                                })}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredStudents.length > 0 ? (
                                        filteredStudents.map((studentId: any, index) => (
                                            <tr key={studentId} className="hover:bg-gray-50 transition-colors duration-100">
                                                <td className="px-4 py-3 text-sm text-gray-500">{index + 1}</td>
                                                <td className="px-4 py-3 text-sm text-gray-500 font-medium">{getStudentGrNoById(studentId)}</td>
                                                <td className="px-4 py-3 text-sm text-gray-900 font-medium">{getStudentNameById(studentId)}</td>
                                                {dateHeaders.map((date) => {
                                                    const attendanceData = attedanceData.find(
                                                        (data: any) => data.takenDate === date
                                                    );
                                                    const studentAttendance = attendanceData?.students.find(
                                                        (student: any) => student.studentId === studentId
                                                    );
                                                    return (
                                                        <td key={date} className="px-4 py-3 text-center">
                                                            {studentAttendance ? (
                                                                studentAttendance.present ? (
                                                                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-100 text-green-800 font-bold">P</span>
                                                                ) : (
                                                                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-100 text-red-800 font-bold">A</span>
                                                                )
                                                            ) : (
                                                                <span className="text-gray-400">-</span>
                                                            )}
                                                        </td>
                                                    );
                                                })}
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={3 + dateHeaders.length} className="px-4 py-6 text-center text-gray-500">
                                                No matching student records found
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No attendance records</h3>
                        <p className="mt-1 text-sm text-gray-500">Select a class and date range to view attendance records.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageAttendance;
