import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const token = localStorage.getItem("token"); // hoặc sessionStorage nếu bạn dùng

  return token ? <Outlet /> : <Navigate to="/" replace />;
};

export default ProtectedRoute;
