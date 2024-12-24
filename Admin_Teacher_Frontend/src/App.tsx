import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login";
import HomePage from "./pages/Dashbord/HomePage";
import AdminAuthMiddleware from "./middlewares/AdminAuthMiddleware";
import SubjectStdPage from "./pages/SubjectStdPage/SubjectStdPage";
import { Bounce, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ManageTeacherPage from "./pages/Teacher/ManageTeacherPage";
import ManageStudentPage from "./pages/Student/ManageStudentPage";
import TestPage from "./pages/Test/TestPage";
import AttedancePage from "./pages/Attedance/AttedancePage";
import ManageImages from "./pages/Manage_Images/ManageImages";
import Sidebar from "./pages/Dashbord/Sidebar";
import { useState } from "react";
import { FaBars, FaBook, FaChalkboardTeacher, FaClipboardList, FaSignOutAlt, FaUserCheck, FaUserGraduate } from "react-icons/fa";
import Cookies from "js-cookie";
import { useRecoilState } from "recoil";
import { userAtom } from "./state/userAtom";


export const menuItems = [
  { title: "Manage Subjects", icon: FaBook, link: "/subject-std" },
  {
    title: "Manage Teachers",
    icon: FaChalkboardTeacher,
    link: "/manage-teacher",
  },
  { title: "Manage Students", icon: FaUserGraduate, link: "/manage-student" },
  { title: "Manage Tests", icon: FaClipboardList, link: "/manage-test" },
  { title: "Attendance", icon: FaUserCheck, link: "/add-attedance" },
  { title: "Manage Images", icon: FaUserCheck, link: "/manage-images" },
];

function App() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useRecoilState(userAtom);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = () => {
    Cookies.remove("user");
    setUser(null);
  };

  return (
    <div className="">
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="*"
            element={
              <div className="flex h-screen bg-gray-100">
                {/* Sidebar */}
                <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

                {/* Main Content */}
                <div className="flex-1 flex flex-col overflow-hidden">
                  {/* Header */}
                  <header className="bg-white shadow-sm">
                    <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                      <div className="flex items-center">
                        <button
                          onClick={toggleSidebar}
                          className="md:hidden mr-4 text-gray-600 hover:text-gray-900"
                        >
                          <FaBars size={24} />
                        </button>
                        <h2 className="text-2xl font-semibold text-gray-800">
                          Dashboard
                        </h2>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="relative group">
                          <div className="flex items-center space-x-2 cursor-pointer">
                            <img
                              src="https://th.bing.com/th/id/OIP.n0waXJvNzJqj3wmDBfS1ZwHaHa?w=165&h=180&c=7&r=0&o=5&dpr=2&pid=1.7"
                              alt="User Avatar"
                              className="rounded-full w-10 h-10"
                            />
                            <span className="text-gray-800 font-medium">
                              {user?.name || "User"}
                            </span>
                          </div>
                          <div className="absolute right-0 w-48  py-2 bg-white rounded-md shadow-xl z-20 hidden group-hover:block">
                            <button
                              onClick={handleLogout}
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-500 hover:text-white w-full text-left"
                            >
                              <FaSignOutAlt className="inline-block mr-2" /> Logout
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </header>

                  {/* Routes */}
                  <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                      <Routes>
                        <Route
                          path="/"
                          element={<AdminAuthMiddleware children={<HomePage />} allowAccessToTeacher={true} />}
                        />
                        <Route
                          path="/subject-std"
                          element={<AdminAuthMiddleware children={<SubjectStdPage />} allowAccessToTeacher={false} />}
                        />
                        <Route
                          path="/manage-teacher"
                          element={<AdminAuthMiddleware children={<ManageTeacherPage />} allowAccessToTeacher={false} />}
                        />
                        <Route
                          path="/manage-student"
                          element={<AdminAuthMiddleware children={<ManageStudentPage />} allowAccessToTeacher={false} />}
                        />
                        <Route
                          path="/manage-test"
                          element={<AdminAuthMiddleware children={<TestPage />} allowAccessToTeacher={true} />}
                        />
                        <Route
                          path="/add-attedance"
                          element={<AdminAuthMiddleware children={<AttedancePage />} allowAccessToTeacher={true} />}
                        />
                        <Route
                          path="/manage-images"
                          element={<AdminAuthMiddleware children={<ManageImages />} allowAccessToTeacher={false} />}
                        />
                      </Routes>
                    </div>
                  </main>
                </div>
              </div>
            }
          />
        </Routes>
      </Router>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
    </div>
  );
  
}

export default App;