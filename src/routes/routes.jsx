import Login from "../pages/login";
import ProtectedRoute from "./protectedRoute";
import Main from "../pages/main";
import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/home";
const publicRoutes = [
  {
    path: "/",
    element: <Login />
  }
];

const protectedRoutes = [
  {
    path:"/home",
    element: <Home/>
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <Main />
      </ProtectedRoute>
    )
  }
];

export const router = createBrowserRouter([...publicRoutes, ...protectedRoutes]);
