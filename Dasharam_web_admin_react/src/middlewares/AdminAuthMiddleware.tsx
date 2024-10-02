import React, { useEffect } from "react";
import { currentAdminState } from "../state/currentAdminAtom";
import { useRecoilState } from "recoil";
import { Navigate, useNavigate } from "react-router-dom";
import Login from "../pages/auth/Login";

const AdminAuthMiddleware = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const [currentAdmin, setCurrentAdmin] = useRecoilState(currentAdminState);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setCurrentAdmin(JSON.parse(user));
      navigate("/");
    }
  }, []);

  return <>{currentAdmin ? children :  <Navigate to="/login" />}</>;
};

export default AdminAuthMiddleware;
