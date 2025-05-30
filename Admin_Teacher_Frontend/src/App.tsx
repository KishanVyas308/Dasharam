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
import Sidebar from "./pages/Dashbord/Sidebar";
import { useState } from "react";
import { FaBars, FaBook, FaChalkboardTeacher, FaClipboardList, FaGlobe, FaSignOutAlt, FaUserCheck, FaUserGraduate } from "react-icons/fa";
import Cookies from "js-cookie";
import { useRecoilState } from "recoil";
import { userAtom } from "./state/userAtom";
import ManageLandingPage from "./pages/Manage_LandingPage/ManageLandingPage";
import LandingPageHome from "./pages/Manage_LandingPage/LandingPageHome";
import LandingPageAbout from "./pages/Manage_LandingPage/LandingPageAbout";
import LandingPageGallery from "./pages/Manage_LandingPage/LandingPageGallery";
import ManageEventPage from "./pages/EventManagement/ManageEventPage";
import AcademicCalendar from "./pages/AccedamicCalender/AccedamicCalender";


export const menuItems = [
  { title: "Standard - Subjects", icon: FaBook, link: "/subject-std" },
  { title: "Teachers", icon: FaChalkboardTeacher, link: "/manage-teacher" },
  { title: "Students", icon: FaUserGraduate, link: "/manage-student" },
  { title: "Manage Tests", icon: FaClipboardList, link: "/manage-test" },
  { title: "Attendance", icon: FaUserCheck, link: "/add-attedance" },
  // { title: "Events", icon: FaCalendarAlt, link: "/events" },
  { title: "Landing Page", icon: FaGlobe, link: "/manage-landing-page", underDevelopment: true },
  // { title: "Academic Calendar", icon: FaCalendar, link: "/academic-calender" },
];

function App() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useRecoilState(userAtom);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = () => {
    Cookies.remove("user");
    localStorage.removeItem("token");
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
              <div className="flex h-screen ">
                {/* Sidebar */}
                <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

                {/* Main Content */}
                <div className="flex-1 flex flex-col overflow-hidden">
                  {/* Header */}
                    <header className="bg-white border-b border-gray-200 z-10">
                      <div className="max-w-7xl mx-auto py-3 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                        <div className="flex items-center">
                          <button
                            onClick={toggleSidebar}
                            className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                            aria-label="Toggle sidebar"
                          >
                            <FaBars size={20} />
                          </button>
                          <h2 className="ml-2 md:ml-0 text-xl font-semibold text-gray-800">
                            Dashboard
                          </h2>
                        </div>
                        <div className="flex items-center">
                          <div className="relative group">
                            <div className="flex items-center space-x-3 focus:outline-none z-40" 
                              aria-label="User menu">
                              <div className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                                <img
                                  src="https://th.bing.com/th/id/OIP.n0waXJvNzJqj3wmDBfS1ZwHaHa?w=165&h=180&c=7&r=0&o=5&dpr=2&pid=1.7"
                                  alt="User Avatar"
                                  className="rounded-full w-8 h-8 object-cover ring-2 ring-indigo-100"
                                />
                                <span className="text-gray-700 font-medium hidden sm:inline-block">
                                  {user?.name || "User"}
                                </span>
                              </div>
                            </div>
                            <div className="absolute right-0 w-56 top-full origin-top-right bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg z-50 hidden group-hover:block">
                              <div className="py-1">
                                <button
                                  onClick={handleLogout}
                                  className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-indigo-500 hover:text-white transition-colors z-50"
                                >
                                  <FaSignOutAlt className="mr-2 h-4 w-4" /> Sign out
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </header>

                  {/* Routes */}
                  <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100/35">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
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
                          path="/events"
                          element={<AdminAuthMiddleware children={<ManageEventPage />} allowAccessToTeacher={false} />}
                        />
                        <Route 
                          path="/academic-calender"
                          element={<AdminAuthMiddleware children={<AcademicCalendar />} allowAccessToTeacher={false} />}
                        />
                        <Route
                          path="/manage-landing-page"
                          element={<AdminAuthMiddleware children={<ManageLandingPage />} allowAccessToTeacher={false} />}
                        >
                          <Route index element={<LandingPageHome/>}/>
                          <Route path="about" element={<LandingPageAbout/>} />
                          <Route path="gallery" element={<LandingPageGallery/>} />
                        </Route>
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