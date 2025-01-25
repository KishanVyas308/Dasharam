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
            const res = await axios.get(`${BACKEND_URL}/student/all`,{ headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
            if (res.status === 200) {
                return res.data;
            }
        } catch (error: any) {
            toast.error("Failed to fetch updated standards list");
            return [];
        }
    };

    async function setUp() {
        setIsLoading(true);
        try {
            const res = await axios.get(`${BACKEND_URL}/subject-standard/all`,{ headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
            if (res.data) {
                setStdSubState(res.data);
            }
        } catch (error: any) {
            toast.error(error.response.data.message);
            setIsLoading(false);
            return;
        }
        setIsLoading(false);
    }

    const fetchAttendance = async () => {
        if (!selectedClass || !dateRange[0] || !dateRange[1]) {
            toast.error('Please select class and date range');
            return;
        }

        setIsLoading(true);

        try {
            const res = await axios.post(`${BACKEND_URL}/attendance/get-for-selected-date`, {
                standardId: selectedClass,
                startDate: dateRange[0].toISOString().split('T')[0],
                endDate: dateRange[1].toISOString().split('T')[0],
            },{ headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });

            if (res.status === 200) {
                setAttedanceData(res.data.data);
                toast.success('Attendance fetched successfully');
            }
        } catch (error: any) {
            toast.error('Failed to fetch attendance');
        } finally {
            setIsLoading(false);
        }
    };

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
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-7xl mx-auto">
            <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center text-indigo-600">Manage Attendance</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Class</label>
                <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                <option value="">Select Class</option>
                {stdSubState.map((stdSub: any) => (
                    <option key={stdSub.id} value={stdSub.id}>
                    {stdSub.standard}
                    </option>
                ))}
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Search by Name</label>
                <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Date</label>
                <DatePicker
                selectsRange
                startDate={dateRange[0] ?? undefined}
                endDate={dateRange[1] ?? undefined}
                onChange={(update) => setDateRange(update as [Date | null, Date | null])}
                isClearable
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
            </div>

            </div>


            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <button
                    onClick={fetchAttendance}
                    className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition duration-200 flex items-center justify-center"
                >
                    Fetch Attendance
                </button>
                <button
                    onClick={downloadExcel}
                    className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-200 flex items-center justify-center"
                >
                    Download as Excel
                </button>
                <button
                    onClick={downloadPDF}
                    className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-200 flex items-center justify-center"
                >
                    Download as PDF
                </button>
            </div>

            {isLoading ? (
            <div className="text-center text-indigo-600">Loading...</div>
            ) : (
            <div className="overflow-x-auto">
                <table className="w-full bg-white shadow-md rounded-lg">
                <thead className="bg-indigo-500 text-white">
                    <tr>
                    <th className="px-4 py-2 w-16">Sr. No</th>
                    <th className="px-4 py-2 w-24">Gr No</th>
                    <th className="px-4 py-2 w-48">Student Name</th>
                    {dateHeaders.map((date) => (
                        <th key={date} className="px-4 py-2 w-24">
                        {date}
                        </th>
                    ))}
                    </tr>
                </thead>
                <tbody>
                    {filteredStudents.map((studentId: any, index) => (
                    <tr key={studentId} className="odd:bg-gray-100 even:bg-gray-200">
                        <td className="px-4 py-2 text-center">{index + 1}</td>
                        <td className="px-4 py-2">{getStudentGrNoById(studentId)}</td>
                        <td className="px-4 py-2">{getStudentNameById(studentId)}</td>
                        {dateHeaders.map((date) => {
                        const attendanceData = attedanceData.find(
                            (data: any) => data.takenDate === date
                        );
                        const studentAttendance = attendanceData?.students.find(
                            (student: any) => student.studentId === studentId
                        );
                        return (
                            <td key={date} className="px-4 py-2 text-center">
                            {studentAttendance ? (
                                studentAttendance.present ? (
                                <span className="text-green-600 font-bold">P</span>
                                ) : (
                                <span className="text-red-600 font-bold">A</span>
                                )
                            ) : (
                                '-'
                            )}
                            </td>
                        );
                        })}
                    </tr>
                    ))}
                </tbody>
                </table> 
            </div>
            
                )}
        </div>
    );
};

export default ManageAttendance;
