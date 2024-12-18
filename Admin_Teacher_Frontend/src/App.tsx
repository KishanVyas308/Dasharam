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

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={<AdminAuthMiddleware children={<HomePage />} allowAccessToTeacher={true} />}
          />
          

          
          <Route
            path="/subject-std"
            element={<AdminAuthMiddleware children={<SubjectStdPage />} allowAccessToTeacher={false}/>}
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
        transition= {Bounce}
      />
    </div>
  );
}

export default App;
