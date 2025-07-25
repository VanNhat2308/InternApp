import { Navigate, Outlet, useLocation } from "react-router-dom";

const ProtectedRoute = () => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const location = useLocation();

  if (!token) {
    return <Navigate to="/" replace />;
  }

  // Nếu đã đăng nhập nhưng vào sai nhánh
  if (role === 'Admin' && !location.pathname.startsWith('/admin')) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  if (role === 'Student' && !location.pathname.startsWith('/student')) {
    return <Navigate to="/student/dashboard" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
