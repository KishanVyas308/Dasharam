import React, { useEffect } from "react";
import { userAtom } from "../state/userAtom";
import { useRecoilState } from "recoil";
import { Navigate, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { UserRole } from "../types/type";

const AdminAuthMiddleware = ({
  children,
  allowAccessToTeacher,
}: {
  children: React.ReactNode;
  allowAccessToTeacher: boolean;
}) => {
  const navigate = useNavigate();
  const [user, setUser] = useRecoilState(userAtom);

  useEffect(() => {
    const user: any = Cookies.get("user");
    if (user) {
      setUser(JSON.parse(user));
      if (user.roll == UserRole.Admin) navigate("/");
    }
  }, []);

  function checkuserIsAdmin() {
    if (user?.role == UserRole.Admin) {
      return children;
    } else if (user?.role == UserRole.Teacher && allowAccessToTeacher) {
      return children;
    } 
    else if(user?.role == UserRole.Teacher && !allowAccessToTeacher){
      alert("You are not allowed to access this page");
      return <Navigate to="/" />;
    }
    else {
      alert("Login First");
      return <Navigate to="/login" />;
    }
  }

  return <>{checkuserIsAdmin()}</>;
};

export default AdminAuthMiddleware;
