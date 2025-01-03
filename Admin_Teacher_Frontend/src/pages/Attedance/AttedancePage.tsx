// 'use client'

// import { useEffect, useState } from 'react'
// import { useRecoilState } from 'recoil'
// import { teachersAtom } from '../../state/teachersAtom'
// import { stdSubAtom } from '../../state/stdSubAtom'
// import { studentsAtom } from '../../state/studentsAtom'
// import AddAttendance from './AddAttedance'
// import axios from 'axios'
// import { BACKEND_URL } from '../../config'
// import { toast } from 'react-toastify'
// import Loading from '../../components/Loading'


// export default function AttendancePage() {
//   const [teachers, setTeachers] = useRecoilState(teachersAtom)
//   const [stdSubjects, setStdSubjects] = useRecoilState(stdSubAtom)
//   const [students, setStudents] = useRecoilState(studentsAtom)




//   const [isLoading, setIsLoading] = useState(true)


//   const getAllTeachers = async () => {
//     try {
//       const res = await axios.get(`${BACKEND_URL}/teacher/all`)
//       if (res.status === 200) {
//         setIsLoading(false)
//         return res.data
//       }
//     } catch (error: any) {
//       setIsLoading(false)
//       toast.error("Failed to fetch updated teachers list")
//       return []
//     }

//     setIsLoading(false)
//   }

//   const getAllStdSub = async () => {
//     try {
//       const res = await axios.get(`${BACKEND_URL}/subject-standard/all`)
//       if (res.status === 200) {
//         setIsLoading(false)
//         return res.data
//       }
//     } catch (error: any) {
//       setIsLoading(false)
//       toast.error("Failed to fetch updated standards list")
//       return []
//     }
//     setIsLoading(false)
//   }

//   const getAllStudents= async () => {
//     try {
//       const res = await axios.get(`${BACKEND_URL}/student/all`)
//       console.log("students", res.data);  
      
//       if (res.status === 200) {
//         setIsLoading(false)
//         return res.data
//       }
//     } catch (error: any) {
//       setIsLoading(false)
//       toast.error("Failed to fetch updated standards list")
//       return []
//     }
//     setIsLoading(false)
//   }

//   useEffect(() => {
//     if (teachers.length === 0) {
//       getAllTeachers().then((data) => setTeachers(data))
//     }
//     else {
//       setIsLoading(false)
//     }
//     if (stdSubjects.length === 0) {
//       getAllStdSub().then((data) => setStdSubjects(data))
//     }
//     else {
//       setIsLoading(false)
//     }
//     if (students.length === 0) {
//       getAllStudents().then((data) => {
//         setStudents(data)
//         console.log(data);
        
//       })
//     } else {
//       setIsLoading(false)
//     }
//   }, [])

//   return (
//     <div className="flex h-screen bg-gray-100 overflow-hidden">
//       {
//         isLoading && <Loading />
//       }
    

//       {/* Main Content */}
//       <div className="flex-1 flex flex-col overflow-hidden"> 


//         {/* Page Content */}
//         <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
//           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//             <AddAttendance />
//           </div>
//         </main>
//       </div>
//     </div>
//   )
// }





"use client";

import { JSXElementConstructor, ReactElement, ReactNode, useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { motion } from "framer-motion";
import { teachersAtom } from "../../state/teachersAtom";
import { stdSubAtom } from "../../state/stdSubAtom";
import { studentsAtom } from "../../state/studentsAtom";
import { userAtom } from "../../state/userAtom";
import AddAttendance from "./AddAttedance";
import {
  FaBars,
  FaSignOutAlt,
  FaChalkboardTeacher,
  FaUserGraduate,
  FaBook,
  FaClipboardList,
  FaUserCheck,
  FaTimes,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import { BACKEND_URL } from "../../config";
import { toast, ToastContentProps } from "react-toastify";
import Loading from "../../components/Loading";
// import ManageAttendance from "./ManageAttedance";
import { Student } from "../../types/type";

const menuItems = [
  { title: "Manage Subjects", icon: FaBook, link: "/subject-std" },
  {
    title: "Manage Teachers",
    icon: FaChalkboardTeacher,
    link: "/manage-teacher",
  },
  { title: "Manage Students", icon: FaUserGraduate, link: "/manage-student" },
  { title: "Manage Tests", icon: FaClipboardList, link: "/manage-test" },
  { title: "Attendance", icon: FaUserCheck, link: "/add-attendance" },
];

export default function AttendancePage() {
  const [teachers, setTeachers] = useRecoilState(teachersAtom);
  const [stdSubjects, setStdSubjects] = useRecoilState(stdSubAtom);
  const [students, setStudents] = useRecoilState(studentsAtom);
  const user = useRecoilValue(userAtom);
  const [activeTab, setActiveTab] = useState("add"); // 'add' or 'manage'
  const [isSidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768);
  const [isProfileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      setSidebarOpen(window.innerWidth > 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchData = async (url: string, setState: { (valOrUpdater: any): void; (valOrUpdater: any): void; (valOrUpdater: Student[] | ((currVal: Student[]) => Student[])): void; (arg0: any): void; }, errorMessage: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ((props: ToastContentProps<unknown>) => React.ReactNode) | null | undefined) => {
    try {
      const res = await axios.get(url);
      if (res.status === 200) {
        setState(res.data);
      }
    } catch (error) {
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (teachers.length === 0) {
      fetchData(
       ` ${BACKEND_URL}/teacher/all`,
        setTeachers,
        "Failed to fetch teachers list"
      );
    }
    if (stdSubjects.length === 0) {
      fetchData(
       ` ${BACKEND_URL}/subject-standard/all`,
        setStdSubjects,
        "Failed to fetch standards list"
      );
    }
    if (students.length === 0) {
      fetchData(
        `${BACKEND_URL}/student/all`,
        setStudents,
        "Failed to fetch students list"
      );
    }
  }, []);

  const handleLogout = () => {
    Cookies.remove("user");
    toast.success("User logged out successfully");
  };

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const toggleProfileDropdown = () => {
    setProfileDropdownOpen(!isProfileDropdownOpen);
  };

  return (
 
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-6">
              <div className="flex space-x-4">
                <button
                  onClick={() => setActiveTab("add")}
                  className={`px-4 py-2 rounded-md ${
                    activeTab === "add"
                      ? "bg-indigo-600 text-white"
                      : "bg-white text-indigo-600 hover:bg-indigo-50"
                  }`}
                >
                  Add Attendance
                </button>
                <button
                  onClick={() => setActiveTab("manage")}
                  className={`px-4 py-2 rounded-md ${
                    activeTab === "manage"
                      ? "bg-indigo-600 text-white"
                      : "bg-white text-indigo-600 hover:bg-indigo-50"
                  }`}
                >
                  Manage Attendance
                </button>
              </div>
            </div>
            {activeTab === "add" ? <AddAttendance /> :  <></>}
          </div>
        </main>
  );
}
//have any error
