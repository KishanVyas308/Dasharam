import { JSXElementConstructor, ReactElement, ReactNode, useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { teachersAtom } from "../../state/teachersAtom";
import { stdSubAtom } from "../../state/stdSubAtom";
import { studentsAtom } from "../../state/studentsAtom";
import AddAttendance from "./AddAttedance";
import axios from "axios";
import { BACKEND_URL } from "../../config";
import { toast, ToastContentProps } from "react-toastify";
import { Student } from "../../types/type";
import ManageAttendance from "./ManageAttedance";

export default function AttendancePage() {
  const [teachers, setTeachers] = useRecoilState(teachersAtom);
  const [stdSubjects, setStdSubjects] = useRecoilState(stdSubAtom);
  const [students, setStudents] = useRecoilState(studentsAtom);
  const [activeTab, setActiveTab] = useState("add"); // 'add' or 'manage'
  const [isLoading, setIsLoading] = useState({
    teachers: false,
    standards: false,
    students: false
  });

  const fetchData = async (
    url: string, 
    setState: { 
      (valOrUpdater: any): void; 
      (valOrUpdater: Student[] | ((currVal: Student[]) => Student[])): void; 
    }, 
    errorMessage: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ((props: ToastContentProps<unknown>) => React.ReactNode) | null | undefined,
    loadingKey: 'teachers' | 'standards' | 'students'
  ) => {
    try {
      setIsLoading(prev => ({ ...prev, [loadingKey]: true }));
      const res = await axios.get(url, { 
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      
      if (res.status === 200) {
        setState(res.data);
      }
    } catch (error) {
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      console.error(`Error fetching ${loadingKey}:`, error);
    } finally {
      setIsLoading(prev => ({ ...prev, [loadingKey]: false }));
    }
  };

  useEffect(() => {
    if (teachers.length === 0) {
      fetchData(
        `${BACKEND_URL}/teacher/all`,
        setTeachers,
        "Failed to fetch teachers list",
        'teachers'
      );
    }
    if (stdSubjects.length === 0) {
      fetchData(
        `${BACKEND_URL}/subject-standard/all`,
        setStdSubjects,
        "Failed to fetch standards list",
        'standards'
      );
    }
    if (students.length === 0) {
      fetchData(
        `${BACKEND_URL}/student/all`,
        setStudents,
        "Failed to fetch students list",
        'students'
      );
    }
  }, []);

  const isDataLoading = isLoading.teachers || isLoading.standards || isLoading.students;

  return (
    <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Attendance Management</h1>
          <p className="text-gray-600 mt-2">
            Track and manage student attendance records efficiently
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm mb-6 p-1 inline-flex">
          <button
            onClick={() => setActiveTab("add")}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              activeTab === "add"
                ? "bg-indigo-600 text-white shadow-md"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            Add Attendance
          </button>
          <button
            onClick={() => setActiveTab("manage")}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              activeTab === "manage"
                ? "bg-indigo-600 text-white shadow-md"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            Manage Attendance
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {isDataLoading ? (
            <div className="flex justify-center items-center p-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
              <span className="ml-3 text-gray-600">Loading data...</span>
            </div>
          ) : (
            <div className="p-6">
              {activeTab === "add" ? <AddAttendance /> : <ManageAttendance />}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
